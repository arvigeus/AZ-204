# Azure Cosmos DB

`https://<account-name>.documents.azure.com:443/` (SQL)

## [Overview](https://docs.microsoft.com/en-us/azure/cosmos-db/introduction)

Azure Cosmos DB is a fully managed NoSQL database service provided by Microsoft Azure. It provides global distribution, can scale horizontally, and offers multiple models of consistency. Cosmos DB supports multiple data models, including document, column family, graph, and key-value pairs.

### Key Benefits of Azure Cosmos DB

- **Global Distribution:** Cosmos DB allows you to distribute your data globally, enabling low latency (99% of reads and writes completed in under 10 milliseconds) access to data for end users from any geographic location (99.999% read and write availability for multi-region databases).

- **Multi-Model Database:** Cosmos DB is multi-modal, meaning it supports multiple types of data models like Key-Value, Document, Column-family and Graph.

- **Elastically Scalable Throughput and Storage:** Azure Cosmos DB enables you to elastically scale throughput and storage based on demand.

- **Multiple Consistency Models:** It offers five consistency models - Eventual, Consistent Prefix, Session, Bounded Staleness, and Strong. This gives developers flexibility to choose consistency according to their application needs.

- **Comprehensive SLAs:** Microsoft provides comprehensive SLAs (Service Level Agreements) that cover latency, throughput, consistency, and availability.

## [Core Components](https://docs.microsoft.com/en-us/azure/cosmos-db/databases-containers-items)

### [Cosmos DB Account](https://docs.microsoft.com/en-us/azure/cosmos-db/manage-account)

The root resource for Azure Cosmos DB. It contains a unique DNS name and can be managed using various tools. It can virtually manage an unlimited amount of data and provisioned throughput. You can create one or more databases within your account, and then one or more containers to store your data. 50 max (soft limit)

### Databases

A logical container for containers and users. A database is analogous to a namespace. Databases manage users, permissions, and the consistency level. Database names should be 3-63 characters long, start with a lowercase letter or number, and only contain lowercase letters, numbers, or dashes.

### Containers

A container in Azure Cosmos DB is where data is stored. Data is stored on one or more servers, called partitions. When a container is created, you need to supply a partition key. The partition key is a property you select from your items to help Azure Cosmos DB distribute the data efficiently across partitions. Containers are schema-agnostic, meaning items within a container can have arbitrary schemas or different entities so long as they share the same partition key. Container names should be 3-63 characters long, start with a lowercase letter or number, and only contain lowercase letters, numbers, or dashes.

### Items

Similar to rows or documents in other databases. An item is the smallest unit of data that can be read or written in Cosmos DB. The shape and content of items can vary as they are schema-agnostic - depending on which API you use, an item can represent either a document in a collection, a row in a table, or a node or edge in a graph. By default, all items that you add to a container are automatically indexed without requiring explicit index or schema management.

#### [Time to live (TTL)](https://learn.microsoft.com/en-us/azure/cosmos-db/nosql/time-to-live)

Auto-deletes items after a specified time period based on their last modified time, without requiring a client-initiated delete operation. The TTL value is set in seconds at either the container or item level, with item-level settings overriding the container level.

Deletion uses leftover Request Units (RUs), and if RUs are insufficient due to heavy load, deletion is delayed but expired data isn't returned in queries. If container-level TTL is absent or null, items don't auto-expire. If it's -1, items also don't expire unless they have their own TTL. If container's TTL isn't set, item-level TTL is ineffective.

![Image showing the hierarchy of Azure Cosmos DB entities: Database accounts are at the top, Databases are grouped under accounts, Containers are grouped under databases.](https://learn.microsoft.com/en-us/training/wwl-azure/explore-azure-cosmos-db/media/cosmos-entities.png)

### Examples

[Azure CLI](https://learn.microsoft.com/en-us/cli/azure/cosmosdb?view=azure-cli-latest):

```ps
# Create a Cosmos DB account
az cosmosdb create --name $account --resource-group $resourceGroup --kind GlobalDocumentDB --locations "WestUS=0" "EastUS=1"

# Create a database
az cosmosdb sql database create --account-name $account --resource-group $resourceGroup --name $database

# Create a container
az cosmosdb sql container create --account-name $account --database-name $database --resource-group $resourceGroup --name $container --partition-key-path "/mypartitionkey"

# Create an item
az cosmosdb sql container create --account-name $account --database-name $database --resource-group $resourceGroup --container-name $container --value "{\"id\": \"1\", \"mypartitionkey\": \"mypartitionvalue\", \"description\": \"mydescription\"}"
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

FeedIterator<SalesOrder> resultSet = container.GetItemQueryIterator<SalesOrder>(
    query,
    requestOptions: new QueryRequestOptions()
    {
        PartitionKey = new PartitionKey("Account1"),
        MaxItemCount = 1
    });
```

## [Consistency Levels](https://docs.microsoft.com/en-us/azure/cosmos-db/consistency-levels)

Azure Cosmos DB provides a balanced approach to consistency, availability, and latency. Its globally linearizable consistency (serving requests concurrently) levels remain unaffected by regional settings, operation origins, number of associated regions, or whether your account has one or multiple write regions. 'Read consistency' specifically denotes a singular read operation, scoped within a particular partition-key range or logical partition, initiated by either a remote client or a stored procedure.

![Image showing data consistency as a spectrum.](https://learn.microsoft.com/en-us/training/wwl-azure/explore-azure-cosmos-db/media/five-consistency-levels.png)

- **Strong** - Every reader sees the latest data right away, but it may be slower (higher latency) and less available. Best for serious stuff like bank transactions where accuracy is vital. Clients will never receive a partial write.

- **Bounded staleness** - Readers may see slightly old data, but there's a limit on how old (determined by number of operations K or the time interval T for staleness - in single-region accounts, the minimum values are 10 write operations or 5 seconds, while in multi-region accounts, they are 100,000 write operations or 300 seconds). Good for things like game leaderboards where a small delay is okay.

- **Session** (default, can be configured) - Within a single user's session, the data is always up-to-date. Great for scenarios like a personal shopping cart on a website.

- **Consistent prefix** - Readers might be a bit behind, but they always see things in order. Good for situations where sequence matters, like following a chain of events.

- **Eventual** - Readers might see things out of order (non-consistent) or slightly old, but it eventually catches up. Best when speed and availability are more important than immediate consistency, like a social media like counter. Lowest latency and highest availability.

### Managing consistency levels

[Azure CLI](https://learn.microsoft.com/en-us/cli/azure/cosmosdb?view=azure-cli-latest):

```ps
# Get the default consistency level
az cosmosdb show --name $database --resource-group $resourceGroup --query defaultConsistencyLevel

# Set the default consistency level
az cosmosdb update --name $database --resource-group $resourceGroup --default-consistency-level "BoundedStaleness"
```

[Azure Cosmos DB .NET SDK](https://learn.microsoft.com/en-us/dotnet/api/microsoft.azure.cosmos?view=azure-dotnet):

```cs
ConsistencyLevel defaultConsistencyLevel = cosmosClient.ConsistencyLevel;
cosmosClient.ConsistencyLevel = ConsistencyLevel.BoundedStaleness;
```

## [Partitioning in Cosmos DB](https://docs.microsoft.com/en-us/azure/cosmos-db/partitioning-overview)

Azure Cosmos DB employs partitioning to efficiently distribute and manage data across multiple machines or regions. This technique enhances performance by providing high throughput and low latency. It also offers the flexibility to scale storage capacity and throughput independently.

- **Partition Key**: This is a specific property in your data that Cosmos DB uses to distribute the data across multiple partitions. Selecting an optimal partition key is a critical decision for the performance and scalability of a Cosmos DB. A well-chosen partition key evenly disperses the workload across all partitions, thereby avoiding 'hot' partitions that could become a performance bottleneck. They can be _string_ value only.

- **Logical Partitions**: Each logical partition comprises a set of items sharing the same partition key value. Cosmos DB uses logical partitions to organize data, which enables rapid and efficient query processing and transaction management. Each logical partition can store up to 20 GB of data and can serve up to 10,000 RU/s.

- **Physical Partitions**: These are internal resources that Azure Cosmos DB manages. They host one or more logical partitions, providing the computational resources (CPU, I/O, memory) for them. Cosmos DB automatically splits and merges physical partitions to evenly distribute the workload as the data volume and throughput. Max throughput: 10 000 RU/s.

- **Partition Sets**: A partition set is essentially a group of physical partitions. A container might start with a single partition set, but as the data volume or throughput requirements increase, Cosmos DB can split the partition set into multiple subsets to maintain performance.

For example, a container holds items. Each item has a unique value for the UserID property. If UserID serves as the partition key for the items in the container and there are 1,000 unique UserID values, 1,000 logical partitions are created for the container.

### Partitioning Strategies

Choosing the right partition key is crucial to evenly distribute data and workload, preventing performance degradation caused by overloaded partitions.

To optimize, consider selecting a partition key that is commonly used in the `WHERE` clause of your queries and has numerous distinct values. For example, in a multi-tenant application, utilizing the tenant ID as the partition key offers advantages. This approach localizes each tenant's data to specific partitions, enhancing read/write performance and maintaining data isolation for tenants.

## [Request Units (RUs)](https://learn.microsoft.com/en-us/azure/cosmos-db/request-units)

Represent the currency of throughput in Azure Cosmos DB. Each operation (e.g., read, write, query) consumes a certain number of RUs, depending on factors such as the item size, item property count, and query complexity.

If an operation's RU cost exceeds your provisioned RUs, the operation is rate-limited until sufficient RUs become available.

Here's a practical rule of thumb: A read operation on a 1-KB document typically consumes 1 RU.

![Image showing how database operations consume request units.](https://learn.microsoft.com/en-us/training/wwl-azure/explore-azure-cosmos-db/media/request-units.png)

### [Provisioned Throughput](https://learn.microsoft.com/en-us/azure/cosmos-db/set-throughput)

You set the number of Request Units (RUs) per second your application needs in multiples of 100. Minimum value: 400.

- **Database-level throughput**: Shared among all the containers in the database. It's a cost-effective option for small workloads with light traffic. Suitable for multitenant applications

- **Container-level throughput**: Dedicated to a single container. More suitable for workloads with heavy traffic or large data volumes. They have two throughput modes that _cannot be changed later_:

  - **Dedicated provisioned throughput mode**: In this mode, a specific amount of throughput (the capacity of the system to process and transfer data) is set aside just for _one container_. The system assures this through Service Level Agreements (SLAs), which are formal contracts that ensure this throughput is dedicated and maintained only for that container. This means that the processing power of the system is not shared with any other container, providing you with _predictable performance_ and _speeds_ for your specific container.

    ```ps
    az cosmosdb sql container create \
      -a $accountName -g $resourceGroupName \
      -d $databaseName -n $containerName \
      -p $partitionKey --throughput $throughput
    ```

    ```cs
    await this.cosmosClient.GetDatabase(databaseName).CreateContainerAsync(
      id: containerName,
      partitionKeyPath: "/myPartitionKey",
      throughput: 1000);
    ```

  - **Shared provisioned throughput mode**: The throughput is shared among _multiple containers within the same database_. This shared throughput is spread across all containers that are configured to use the shared mode. This allows for flexibility and efficiency in distributing resources, particularly when _dealing with a large number of containers with variable load_. Any containers in the database that have their own dedicated throughput will not be part of this sharing, they continue to operate independently with their allocated resources.

    ```ps
    az cosmosdb sql database create \
      -a $accountName \
      -g $resourceGroupName \
      -n $databaseName \
      --throughput $throughput
    ```

    ```cs
    await this.cosmosClient.CreateDatabaseIfNotExistsAsync(
          id: databaseName,
          throughput: 1000);
    ```

```sh
az cosmosdb sql container create --throughput 400
```

```cs
await this.cosmosDatabase.CreateContainerAsync(new ContainerProperties(id, partitionKeyPath), 400);
```

### [Serverless mode](https://learn.microsoft.com/en-us/azure/cosmos-db/serverless)

You don't have to assign any throughput when creating resources in your Azure Cosmos DB account. At the end of your billing period, you get billed for the number of Request Units consumed by your database operations

### [Autoscale Throughput](https://learn.microsoft.com/en-us/azure/cosmos-db/provision-throughput-autoscale)

Autoscale automatically adjusts the provisioned RUs based on the current usage. It scales between 10% and 100% of a set maximum - from 100 to 1000 RU/s. Throughput scales automatically based on usage without affecting performance, suited for workloads with unpredictable traffic requiring high performance and scale SLAs.

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

Do note, Cosmos DB operations must complete within a limited time frame!

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

## [Connectivity modes](https://learn.microsoft.com/en-us/azure/cosmos-db/nosql/sdk-connection-modes)

- **Gateway mode** (default): For environments that have a limited number of socket connections, or corporate network with strict firewall restrictions. It uses HTTPS port and a single DNS endpoint.

- **Direct mode**: Connectivity through TCP protocol, using TLS for initial authentication and encryption. Better performance.

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

### Backup modes

- **Continuous backup mode** has two tiers: 7-day retention and 30-day retention. You can restore to any point within these retention periods, into a new or existing account. You select the tier when creating a Cosmos DB account. Note that if you configure a new account with continuous backup, you can do self-service restore but you can't switch it back to periodic mode.

- **Periodic backup mode** is the default for all existing accounts. Backups are taken at intervals you configure, with data restored through a request to the support team. The maximum retention period is a month, and the minimum backup interval is an hour.

## [Monitoring and Diagnostics](https://docs.microsoft.com/en-us/azure/cosmos-db/how-to-monitor-account)

Azure Cosmos DB provides built-in monitoring and diagnostics features to help you track usage, capacity, performance, availability, and other metrics. Key concepts include:

### Metrics

Cosmos DB provides built-in metrics for various aspects of a Cosmos DB account, such as request charge, storage, availability, latency, etc.

### Azure Monitor

You can use Azure Monitor to create dashboards, set alerts, and visualize metrics from your Cosmos DB account.

### Diagnostic Logs

Diagnostic logs provide detailed traces of operations and can be sent to Log Analytics, Event Hubs, or Azure Storage for further analysis.

### Query Statistics

You can retrieve statistics about query execution (like request charge) to help optimize and troubleshoot your queries.

## [Use Cases](https://docs.microsoft.com/en-us/azure/cosmos-db/use-cases)

Azure Cosmos DB is designed to support a wide range of application scenarios. Its multi-model, globally distributed architecture makes it suitable for many types of applications. Here are a few examples:

### IoT and Telemetry

Cosmos DB can ingest massive amounts of data in real-time, making it suitable for IoT and telemetry scenarios. The provisioned throughput feature can handle spikes in traffic during peak times.

### Retail and Marketing

Cosmos DB's global distribution capabilities make it a good fit for applications that require low latency access to data from any part of the world, such as retail and marketing applications.

### Gaming

Cosmos DB can scale to accommodate millions of players, and its low-latency multi-master replication guarantees that all players see the same game state at the same time.

### Real-Time Analytics

Cosmos DB's support for multiple consistency models allows developers to balance between consistency and performance, making it suitable for real-time analytics workloads.

### Personalization

With Cosmos DB, you can store and query user activity data to drive real-time, personalized experiences.

## [Identifying access patterns](https://learn.microsoft.com/en-us/azure/cosmos-db/nosql/model-partition-example#identify-the-main-access-patterns)

Helps design the data model to optimize application interactions, such as minimizing cross-partition queries or reducing request numbers through denormalization (optimize read queries by organizing data efficiently within containers).
