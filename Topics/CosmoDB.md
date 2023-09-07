# [Azure Cosmos DB](https://docs.microsoft.com/en-us/azure/cosmos-db/introduction)

`https://<account-name>.documents.azure.com:443/` (SQL)

- **Global Distribution:** ⚡ and 99.999% availability for multi-region databases.
- **Data Models:** Supports Key-Value, Document, Column-family, and Graph formats.
- **Scalability:** Scales throughput and storage elastically as needed.
- **Consistency:** Choose trade-off between data accuracy and performance.
- **SLAs:** Covers latency, throughput, consistency, and availability.

## [Core Components](https://docs.microsoft.com/en-us/azure/cosmos-db/databases-containers-items)

![Image showing the hierarchy of Azure Cosmos DB entities: Database accounts are at the top, Databases are grouped under accounts, Containers are grouped under databases.](https://learn.microsoft.com/en-us/training/wwl-azure/explore-azure-cosmos-db/media/cosmos-entities.png)

- [**Cosmos DB Account**](https://docs.microsoft.com/en-us/azure/cosmos-db/manage-account): Manages databases like storage accounts manage containers. Free tier availability is limited to one per subscription.
- **Databases**: Serves as a _namespace_, managing containers, users, permissions, and consistency levels.
- **Containers**: Data is stored on one or more servers, called partitions. Partition keys are used for efficient data distribution. Containers are schema-agnostic.
- **Items**: Smallest read/write data units. Schema-agnostic and API-dependent, they can represent documents, rows, nodes, or edges. Automatically indexed in containers without explicit management.

Note: Partition keys always start with '/', ex: `/partitionkey`. Min length for all names is 3 chars, alphanumeric.

### [Time to live (TTL)](https://learn.microsoft.com/en-us/azure/cosmos-db/nosql/time-to-live)

Automatically removes items after a set time (in seconds) based on last modification. TTL can be configured at the container or item level; item settings take precedence. Deletion uses spare RUs; if RUs are low, deletion lags but expired data isn't shown in queries. No container-level TTL means items won't auto-expire; a value of -1 has the same effect unless items have their own TTL. Use `DefaultTimeToLive` in `ContainerProperties` to set TTL.

### Examples

[Azure CLI](https://learn.microsoft.com/en-us/cli/azure/cosmosdb?view=azure-cli-latest):

```ps
# Create a Cosmos DB account
az cosmosdb create --name $account --kind GlobalDocumentDB ...

# Create a database
az cosmosdb sql database create --account-name $account --name $database

# Create a container
az cosmosdb sql container create --account-name $account --database-name $database --name $container --partition-key-path "/mypartitionkey"

# Create an item
az cosmosdb sql container create --account-name $account --database-name $database --container-name $container --value "{\"id\": \"1\", \"mypartitionkey\": \"mypartitionvalue\", \"description\": \"mydescription\"}"
```

[Azure Cosmos DB .NET SDK](https://learn.microsoft.com/en-us/dotnet/api/microsoft.azure.cosmos?view=azure-dotnet):

```cs
var cosmosClient = new CosmosClient("<connection-string>"); // credentials or/and options

// Create a database
Database database = await cosmosClient.CreateDatabaseIfNotExistsAsync("<database>");
// NOTE: You can use DatabaseResponse instead of Database if you need information like status codes or headers.

// database = await database.ReadAsync(); // Re-fetch data

// Create a container
Container container = await database.CreateContainerIfNotExistsAsync(id: "<container>", partitionKeyPath: "/mypartitionkey", throughput: number);

// Create an item
dynamic testItem = new
{
    id = "1",
    mypartitionkey = "mypartitionvalue",
    description = "mydescription"
};
await container.CreateItemAsync(testItem, new PartitionKey(testItem.mypartitionkey));

// NOTE: This example is for another container
QueryDefinition query = new QueryDefinition(
    "select * from sales s where s.AccountNumber = @AccountInput ")
    .WithParameter("@AccountInput", "Account1");

string query = $@"
  SELECT VALUE products
  FROM models
  JOIN products in models.Products
  WHERE products.id = '{id}'
";
FeedIterator<SalesOrder> rs = container.GetItemQueryIterator<SalesOrder>(
    query,
    // Optional:
    // requestOptions: new QueryRequestOptions()
    // {
    //     PartitionKey = new PartitionKey("Account1"),
    //     MaxItemCount = 1
    // });
while (rs.HasMoreResults)
{
    Model next = await iterator.ReadNextAsync();
    matches.AddRange(next);
}
```

## [Consistency Levels](https://docs.microsoft.com/en-us/azure/cosmos-db/consistency-levels)

Azure Cosmos DB provides a balanced approach to consistency, availability, and latency. Its globally linearizable consistency (serving requests concurrently) levels remain unaffected by regional settings, operation origins, number of associated regions, or whether your account has one or multiple write regions. 'Read consistency' specifically denotes a singular read operation, scoped within a particular partition-key range or logical partition, initiated by either a remote client or a stored procedure.

![Image showing data consistency as a spectrum.](https://learn.microsoft.com/en-us/training/wwl-azure/explore-azure-cosmos-db/media/five-consistency-levels.png)

- **Strong** - Every reader sees the latest data right away, but it may be slower (higher latency) and less available. Best for serious stuff like bank transactions where accuracy is vital. Clients will never receive a partial write.
- **Bounded staleness** - Readers may see slightly old data, but there's a limit on how old (determined by number of operations K or the time interval T for staleness - in single-region accounts, the minimum values are 10 write operations or 5 seconds, while in multi-region accounts, they are 100,000 write operations or 300 seconds). Good for things like game leaderboards where a small delay is okay.
- **Session** (default, can be configured) - Within a single user's session, the data is always up-to-date. Great for scenarios like a personal shopping cart on a website.
- **Consistent prefix** - Readers might be a bit behind, but they always see things in order. Good for situations where sequence matters, like following a chain of events.
- **Eventual** - Readers might see things out of order (non-consistent) or slightly old, but it eventually catches up. Best when speed and availability are more important than immediate consistency, like a social media like counter. Lowest latency and highest availability.

```ps
# Get the default consistency level
az cosmosdb show --name $database--query defaultConsistencyLevel ...

# Set the default consistency level
az cosmosdb update --name $database--default-consistency-level "BoundedStaleness" ...
```

```cs
ConsistencyLevel defaultConsistencyLevel = cosmosClient.ConsistencyLevel;
cosmosClient.ConsistencyLevel = ConsistencyLevel.BoundedStaleness;
```

## [Partitioning in Cosmos DB](https://docs.microsoft.com/en-us/azure/cosmos-db/partitioning-overview)

Improves⚡. Enables independent scaling of storage and throughput.

- **Partition Key**: A property in data used to distribute data across partitions. Critical for performance and scalability. Best practice: many distinct values to avoid _'hot' partitions_ (overused, or uneven partition sizes) that could become a performance bottleneck. Type: string only.
- **Logical Partitions**: Sets of items with the same partition key. Enables efficient queries and transactions. Max storage: 20 GB; Max throughput: 10,000 RU/s.
- **Physical Partitions**: Internal resources hosting logical partitions. Cosmos DB auto-splits and merges these for workload balance. Max throughput: 10,000 RU/s.
- **Partition Sets**: Groups of physical partitions. Split into subsets for ⚡.

### [Partitioning Key Selection](https://learn.microsoft.com/en-us/azure/cosmos-db/nosql/model-partition-example#identify-the-main-access-patterns)

Selecting an optimal partition key is essential for balanced data distribution and workload, which ensures high performance. Use a key that appears often in your queries' `WHERE` clause and has many unique values. For instance, in multi-tenant apps, using the tenant ID as the key improves read/write speeds and data isolation. Validate your choice through Azure SDKs and monitor metrics like data size, throughput, and cost for any needed adjustments.

### [Synthetic partition key](https://learn.microsoft.com/en-us/azure/cosmos-db/nosql/synthetic-partition-keys)

When no property has many distinct values:

- Concatenate multiple properties of an item
- Use a partition key with a random suffix
- Use a partition key with pre-calculated suffixes

## [Request Units (RUs)](https://learn.microsoft.com/en-us/azure/cosmos-db/request-units)

Represent the currency of throughput in Azure Cosmos DB. Each operation (e.g., read, write, query) consumes a certain number of RUs, depending on factors such as the item size, item property count, and query complexity.

If an operation's RU cost exceeds your provisioned RUs, the operation is rate-limited until sufficient RUs become available.

Here's a practical rule of thumb: A read operation on a 1-KB document typically consumes 1 RU.

![Image showing how database operations consume request units.](https://learn.microsoft.com/en-us/training/wwl-azure/explore-azure-cosmos-db/media/request-units.png)

### [Provisioned Throughput](https://learn.microsoft.com/en-us/azure/cosmos-db/set-throughput)

You set the number of Request Units (RUs) per second your application needs in multiples of 100. Minimum value: 400.

- **Database-level throughput**: Shared among all the containers in the database. 🏷️. ⭐: small workloads with light traffic, multitenant applications.
- **Container-level throughput**: Dedicated to a single container. ⭐: 🏋🏿 workloads, large data volumes. They have two throughput modes that _cannot be changed later_:

  - **Dedicated Throughput Mode** (set at **container** level): Reserves a set amount of processing power for _one container_. Service Level Agreements (SLAs) guarantee this, ensuring no other container can use it. This gives you consistent speed and performance for that specific container.
  - **Shared Throughput Mode** (set at **database** level): _Multiple containers in the same database_ share processing power. ⭐: _Large number of containers with variable load_. Containers with their own dedicated throughput aren't part of this sharing and operate independently.

### [Serverless mode](https://learn.microsoft.com/en-us/azure/cosmos-db/serverless)

You don't have to assign any throughput when creating resources in your Azure Cosmos DB account. At the end of your billing period, you get billed for the number of Request Units consumed by your database operations

### [Autoscale Throughput](https://learn.microsoft.com/en-us/azure/cosmos-db/provision-throughput-autoscale)

Autoscale automatically adjusts the provisioned RUs based on the current usage. You can enable autoscale on a single container, or provision autoscale throughput on a database and share it among all the containers in the database. It scales between 10% and 100% of a set maximum - from 100 to 1000 RU/s. Throughput scales automatically based on usage without affecting performance, suited for workloads with unpredictable traffic requiring high performance and scale SLAs.

```sh
az cosmosdb sql container create --throughput-type autoscale --max-throughput 4000
```

```cs
var autoscaleThroughputProperties = ThroughputProperties.CreateAutoscaleThroughput(4000);  // 4000 max RU/s
await this.cosmosDatabase.CreateContainerAsync(new ContainerProperties(id, partitionKeyPath), autoscaleThroughputProperties);
```

## [API Models](https://learn.microsoft.com/en-us/azure/cosmos-db/choose-api)

All API models return JSON formatted objects, regardless of the API used.

- **API for NoSQL** - A JSON-based, document-centric API that provides SQL querying capabilities. Ideal for web, mobile, and gaming applications, and anything that requires handling complex _hierarchical_ data with a _schemaless_ design.
- **API for MongoDB** - stores data in a document structure, via BSON format.
- **API for PostgreSQL** - Stores data either on a single node, or distributed in a multi-node configuration.
- **API for Apache Cassandra** - Supports a column-oriented schema, aligns with Apache Cassandra's distributed, scalable NoSQL philosophy, and is wire protocol compatible with it.
- **API for Table** - A _key-value_ based API that offers compatibility with Azure Table Storage, overcoming its limitations. Ideal for applications that need a simple schemaless _key-value_ store. Only supports OLTP scenarios.
- **API for Apache Gremlin** - _Graph-based_ API for highly _interconnected_ datasets. It's ideal for handling dynamic, complexly related data that exceeds the capabilities of relational databases.

Using these APIs, you can emulate various database technologies, modeling real-world data via documents, key-value, graph, and column-family models, minus the management and scaling overheads.

## [Stored procedures](https://learn.microsoft.com/en-us/azure/cosmos-db/nosql/how-to-use-stored-procedures-triggers-udfs?tabs=dotnet-sdk-v3)

Azure Cosmos DB allows transactional execution of JavaScript in the form of stored procedures, triggers, and user-defined functions (UDFs). Each needs to be registered prior to calling.

- **Stored procedures**: JavaScript functions registered per collection, capable of performing CRUD and query operations on any document in that collection. Procedures run within a bounded execution time and can handle transactions (pause and resume lengthy operations using a "continuation token" to manage the process until completion). All collection functions (ex: `collection.createDocument()`) return a `Boolean` value that represents whether that operation completes or not.

  ```js
  var helloWorldStoredProc = {
    id: "helloWorld",
    serverScript: function () {
      // context provides access to all operations that can be performed in Azure Cosmos DB
      // and access to the request and response objects
      var context = getContext();
      var response = context.getResponse();

      response.setBody("Hello, World");
    },
  };
  ```

  ```js
  var createDocumentStoredProc = {
    id: "createMyDocument",
    // This stored procedure creates a new item in the Azure Cosmos container
    body: function createMyDocument(documentToCreate) {
      var context = getContext();
      var collection = context.getCollection();

      // Async 'createDocument' operation, depends on JavaScript callbacks
      // returns true if creation was successful
      var accepted = collection.createDocument(
        collection.getSelfLink(),
        documentToCreate,
        // Callback function with error and created document parameters
        function (err, documentCreated) {
          // Handle or throw error inside the callback
          if (err) throw new Error("Error" + err.message);
          // Return the id of the newly created document
          context.getResponse().setBody(documentCreated.id);
        }
      );

      // If the document creation was not accepted, return
      if (!accepted) return;
    },
  };
  ```

  ```js
  // Parameter is always string!
  function sample(arr) {
    if (typeof arr === "string") arr = JSON.parse(arr);

    arr.forEach(function (a) {
      // do something here
      console.log(a);
    });
  }
  ```

- **Triggers**: Pretriggers and post-triggers operate before and after a database item modification, respectively. They aren't automatically executed, and must be registered and specified for each operation where execution is required. For instance, a pretrigger could validate properties of a new Cosmos item or add a timestamp, while a post-trigger might update metadata regarding a newly created item.

  - **Pre-triggers**: Can't have any input parameters. Validates properties of an item that is being created, modifies properties.
  - **Post-triggers**: Runs as part of the same transaction for the underlying item itself. Modifies properties.

  ```js
  // Pretrigger
  function validateToDoItemTimestamp() {
    var context = getContext();
    var request = context.getRequest();

    // item to be created in the current operation
    var itemToCreate = request.getBody();

    // validate properties
    if (!("timestamp" in itemToCreate)) {
      var ts = new Date();
      itemToCreate["timestamp"] = ts.getTime();
    }

    // update the item that will be created
    request.setBody(itemToCreate);
  }

  // Posttrigger
  function updateMetadata() {
    var context = getContext();
    var container = context.getCollection();
    var response = context.getResponse();

    // item that was created
    var createdItem = response.getBody();

    // query for metadata document
    var filterQuery = 'SELECT * FROM root r WHERE r.id = "_metadata"';
    var accept = container.queryDocuments(
      container.getSelfLink(),
      filterQuery,
      updateMetadataCallback
    );
    if (!accept) throw "Unable to update metadata, abort";

    function updateMetadataCallback(err, items, responseOptions) {
      if (err) throw new Error("Error" + err.message);
      if (items.length != 1) throw "Unable to find metadata document";

      var metadataItem = items[0];

      // update metadata
      metadataItem.createdItems += 1;
      metadataItem.createdNames += " " + createdItem.id;
      var accept = container.replaceDocument(
        metadataItem._self,
        metadataItem,
        function (err, itemReplaced) {
          if (err) throw "Unable to update metadata, abort";
        }
      );
      if (!accept) throw "Unable to update metadata, abort";
      return;
    }
  }
  ```

- **User-defined functions (UDFs)**: These are functions used within a query, such as a function to calculate income tax based on different brackets.

  ```js
  function tax(income) {
    if (income == undefined) throw "no input";

    if (income < 1000) return income * 0.1;
    else if (income < 10000) return income * 0.2;
    else return income * 0.4;
  }
  ```

Cosmos DB operations must complete within a limited time frame.

### [Register and use stored procedures, triggers, and user-defined functions](https://learn.microsoft.com/en-us/azure/cosmos-db/nosql/how-to-use-stored-procedures-triggers-udfs)

```cs
// Register Stored Procedure
await client.GetContainer("db", "container").Scripts.CreateStoredProcedureAsync(new StoredProcedureProperties { Id = "spCreateToDoItems", Body = File.ReadAllText("sp.js") });

// Call Stored Procedure
dynamic[] items = { new { category = "Personal", name = "Groceries" } };
await client.GetContainer("db", "container").Scripts.ExecuteStoredProcedureAsync<string>("spCreateToDoItem", new PartitionKey("Personal"), new[] { items });

// Register Pretrigger
await client.GetContainer("db", "container").Scripts.CreateTriggerAsync(new TriggerProperties { Id = "preTrigger", Body = File.ReadAllText("preTrigger.js"), TriggerOperation = TriggerOperation.Create, TriggerType = TriggerType.Pre });

// Call Pretrigger
dynamic newItem = new { category = "Personal", name = "Groceries" };
await client.GetContainer("db", "container").CreateItemAsync(newItem, null, new ItemRequestOptions { PreTriggers = new List<string> { "preTrigger" } });

// Register Post-trigger
await client.GetContainer("db", "container").Scripts.CreateTriggerAsync(new TriggerProperties { Id = "postTrigger", Body = File.ReadAllText("postTrigger.js"), TriggerOperation = TriggerOperation.Create, TriggerType = TriggerType.Post });

// Call Post-trigger
await client.GetContainer("db", "container").CreateItemAsync(newItem, null, new ItemRequestOptions { PostTriggers = new List<string> { "postTrigger" } });

// Register UDF
await client.GetContainer("db", "container").Scripts.CreateUserDefinedFunctionAsync(new UserDefinedFunctionProperties { Id = "Tax", Body = File.ReadAllText("Tax.js") });

// Call UDF
var iterator = client.GetContainer("db", "container").GetItemQueryIterator<dynamic>("SELECT * FROM Incomes t WHERE udf.Tax(t.income) > 20000");

```

## [Change feed](https://docs.microsoft.com/en-us/azure/cosmos-db/change-feed)

Enabled by default. Records changes in a container in chronological order. Order is guaranteed within each logical partition key value, but not across them. It listens for changes and then returns an ordered list of modified documents, which can be processed asynchronously and incrementally. Currently, the change feed shows all inserts and updates but not deletes. You can add a "deleted" attribute to items you plan to delete, setting its value to "true" and adding a time-to-live (TTL) value for automatic deletion.

There are two ways to interact with the change feed: push and pull models. In the push model, the change feed processor automatically sends work to a client. The pull model requires the client to request work from the server, providing low-level control of processing. The push model is generally recommended in order to avoid polling the change feed for future changes. The pull model offers extra control for specific use-cases like reading changes from a specific partition key, controlling change processing speed, or performing a one-time read for tasks like data migration.

Azure Functions uses the change feed processor behind the scenes.

NOTE: Change feed does not work with Table and PostgreSQL!

### Change feed processor

The typical lifecycle of a host instance includes reading the change feed, sleeping if no changes are detected, sending changes to the delegate for processing, and updating the lease store with the latest processed point in time.

```cs
private static async Task<ChangeFeedProcessor> StartChangeFeedProcessorAsync(
    CosmosClient cosmosClient,
    IConfiguration configuration)
{
    string databaseName = configuration["SourceDatabaseName"];
    /////////////////////////////////////////////////////////////////////////////////////////////
    // Monitored Container: Houses data. Inserts and updates are reflected in the change feed. //
    /////////////////////////////////////////////////////////////////////////////////////////////
    string sourceContainerName = configuration["SourceContainerName"];
    /////////////////////////////////////////////////////////////////////////////////////////////////
    // Lease Container: Serves as state storage and manages change feed processing across workers. //
    // It can be in the same or different account as the monitored container.                      //
    /////////////////////////////////////////////////////////////////////////////////////////////////
    string leaseContainerName = configuration["LeasesContainerName"];

    Container leaseContainer = cosmosClient.GetContainer(databaseName, leaseContainerName);
    // When implementing the change feed processor, the monitored container is always the point of entry
    ChangeFeedProcessor changeFeedProcessor = cosmosClient.GetContainer(databaseName, sourceContainerName)
        .GetChangeFeedProcessorBuilder<ToDoItem>(processorName: "changeFeedSample", onChangesDelegate: HandleChangesAsync)
            // Compute Instance: Hosts change feed processor to listen for changes.
            // Can be a VM, Kubernetes pod, Azure App Service instance, or a physical machine,
            // identified by a unique instance name.
            .WithInstanceName("consoleHost")
            .WithLeaseContainer(leaseContainer)
            .Build();

    Console.WriteLine("Starting Change Feed Processor...");
    await changeFeedProcessor.StartAsync();
    Console.WriteLine("Change Feed Processor started.");
    return changeFeedProcessor;
}

//////////////////
// The delegate //
//////////////////
static async Task HandleChangesAsync(
    ChangeFeedProcessorContext context,
    IReadOnlyCollection<ToDoItem> changes,
    CancellationToken cancellationToken)
{
    Console.WriteLine($"Started handling changes for lease {context.LeaseToken}...");
    Console.WriteLine($"Change Feed request consumed {context.Headers.RequestCharge} RU.");
    // SessionToken if needed to enforce Session consistency on another client instance
    Console.WriteLine($"SessionToken ${context.Headers.Session}");

    foreach (ToDoItem item in changes)
    {
        Console.WriteLine($"Detected operation for item with id {item.id}, created at {item.creationTime}.");
        await Task.Delay(10);
    }
}
```

## Querying data

- Data in Azure Cosmos DB is stored as JSON documents. This means you can query nested properties and arrays directly.
- Queries in Azure Cosmos DB are case sensitive.
- Azure Cosmos DB automatically **indexes all properties** in your data (configurable: `containerProperties.IndexingPolicy.ExcludedPaths.Add(new ExcludedPath{ Path = "/nonQueriedProperty/*" });` to exclude property you never query on). This makes queries fast, but it can also increase the cost of writes.
- Azure Cosmos DB supports ACID transactions within a single partition.
- Azure Cosmos DB uses optimistic concurrency control to prevent conflicts when multiple clients are trying to update the same data. This is done using `ETags` and HTTP headers.

```sql
SELECT
  c.name,
  c.age,
  {
    "phoneNumber": p.number,
    "phoneType": p.type
  } AS phoneInfo
FROM c
JOIN p IN c.phones
WHERE c.age > 21 AND ARRAY_CONTAINS(c.tags, 'student') AND STARTSWITH(p.number, '123')
ORDER BY c.age DESC
OFFSET 10 LIMIT 20

```

- Column names **require** specifiers, e.g. `c.name`, **not** `name`.
- `FROM` clause is just an alias (no need to specify container name).
- You can only join within a single container. You can't join data across different containers.
- Aggregation functions are not supported.

Queries that have an `ORDER BY` clause with two or more properties require a composite index:

```json
{
  "compositeIndexes": [
    [
      { "path": "/name", "order": "ascending" },
      { "path": "/age", "order": "descending" }
    ]
  ]
}
```

### Flattening data

The `VALUE` keyword is used to flatten the result of a `SELECT` statement (not individual fields within that statement)

```sql
SELECT VALUE {
  "name": p.name,
  "sku": p.sku,
  "vendor": p.manufacturer.name
}
FROM products p
WHERE p.sku = "teapo-surfboard-72109"
```

This is similar to aliasing `SELECT p.name AS name`

### Using UDF

```sql
SELECT c.id, udf.GetMaxNutritionValue(c.nutrients) AS MaxNutritionValue
FROM c
```

### Get count

```sql
SELECT VALUE COUNT(1) FROM models
```

## [Connectivity modes](https://learn.microsoft.com/en-us/azure/cosmos-db/nosql/sdk-connection-modes)

- **Gateway mode** (default): For environments that have a limited number of socket connections, or corporate network with strict firewall restrictions. It uses HTTPS port and a single DNS endpoint.

- **Direct mode**: Connectivity through TCP protocol, using TLS for initial authentication and encryption. ⚡

## Performance and best practices

For best performance, always use the latest SDK version and ensure the application is in the same Azure region as the Cosmos DB account. Utilize a single instance of `CosmosClient` throughout the application's lifetime and adopt `Direct` mode for lower latency and higher throughput. Leverage `PartitionKey` for efficient point reads and writes, and implement retry logic for handling transient errors.

For read-heavy operations use the `Stream API` and `FeedIterator` for better memory usage and efficient reading of multiple query result pages. Use `ChangeFeedProcessor` for reading changes in containers, and SQL Query Metrics for detailed logging of backend query executions.

For write-heavy operations enable bulk support for dealing with large data volumes, and set `EnableContentResponseOnWrite` to false for workloads with heavy payloads. Exclude unused paths from indexing and keep the size of your documents minimal to facilitate faster writes.

## [Global Distribution](https://docs.microsoft.com/en-us/azure/cosmos-db/distribute-data-globally)

- **Multi-region Writes** - Perform writes in all configured regions. This enhances write latency and availability.
- **Consistency and Latency**
- **Automatic Failover** - If an Azure region goes down, Cosmos DB can automatically failover to another region.
- **Manual Failover** - For testing purposes, you can trigger a manual failover to see how your application behaves during regional failures.
- **No downtime when adding or removing regions**

### [Conflict resolution](https://learn.microsoft.com/en-us/azure/cosmos-db/nosql/how-to-manage-conflicts)

In a multi-master setup, multiple regions can simultaneously read from and write to your Azure Cosmos DB database to maximize availability and performance. Conflicts can occur when the same data is modified concurrently in different regions. Conflict resolution policies determine how these conflicts should be resolved automatically or through custom procedures.

- **Automatic**: Uses a Last Writer Wins (LWW) policy based on a system or user-defined property.
- **Custom**: Uses a user-defined stored procedure to handle conflicts.

## [Security](https://docs.microsoft.com/en-us/azure/cosmos-db/database-security)

- Authentication - Cosmos DB uses Azure AD for authentication. When creating a Cosmos DB account, an access key is created that can be used to authenticate requests to the account.
- Authorization - Authorization in Cosmos DB is role-based. It provides built-in user and permission resources that allow fine-grained access control to containers and documents.
- Network Security - Azure Cosmos DB can be integrated with Azure Virtual Networks (VNet) and firewall rules for enhanced network security.

  ```ps
  # Create a virtual network and subnet
  az network vnet create --name $vnet --resource-group $resourceGroup --location eastus --address-prefix 10.0.0.0/16
  az network vnet subnet create --name $subnet --resource-group $resourceGroup --vnet-name $vnet --address-prefixes 10.0.0.0/24

  # Create a private endpoint connection
  az network private-endpoint create --name $privateEndpoint --resource-group $resourceGroup --vnet-name $vnet --subnet $subnet --private-connection-resource-id /subscriptions/<subscription_id>/resourceGroups/$resourceGroup/providers/Microsoft.DocumentDB/databaseAccounts/$cosmosDBAccount --group-ids sql
  ```

- Encryption - Cosmos DB supports encryption at rest and in transit. Data at rest is encrypted with service-managed keys, and you can also bring your own keys (BYOK) for added control. Data in transit is protected using TLS.

- Auditing and Monitoring - You can monitor activity on your Cosmos DB account using Azure Monitor and Azure Log Analytics.

## [Backup and Restore](https://docs.microsoft.com/en-us/azure/cosmos-db/online-backup-and-restore)

Azure Cosmos DB takes automatic backups of data regularly without affecting database performance. Backups are stored separately, encrypted (with Microsoft managed service keys), and transferred securely.

Restores can only be done between accounts within the same subscription and you can't restore into an account with lower Request Units per second (RU/s) or fewer partitions.

- **Continuous backup mode** has two tiers: 7-day retention and 30-day retention. You can restore to any point within these retention periods, into a new or existing account. You select the tier when creating a Cosmos DB account. Note that if you configure a new account with continuous backup, you can do self-service restore but you can't switch it back to periodic mode.
- **Periodic backup mode** is the default for all existing accounts. Backups are taken at intervals you configure, with data restored through a request to the support team. The maximum retention period is a month, and the minimum backup interval is an hour.

## [Monitoring and Diagnostics](https://docs.microsoft.com/en-us/azure/cosmos-db/how-to-monitor-account)

- Metrics: Built-in tracking for aspects like storage, latency, and availability.
- Azure Monitor: Enables custom dashboards, alerts, and metric visualization.
- Diagnostic Logs: Offers operation traces, which can be analyzed further in various Azure services.
- Query Stats: Provides execution metrics to help optimize and troubleshoot queries.

## [Use Cases](https://docs.microsoft.com/en-us/azure/cosmos-db/use-cases)

- IoT: Handles massive real-time data and traffic spikes.
- Retail: Offers low-latency data access worldwide.
- Gaming: Scales for millions of players with synchronized game states.
- Analytics: Balances performance and consistency for real-time analysis.
- Personalization: query user activity data to drive real-time, personalized experiences
