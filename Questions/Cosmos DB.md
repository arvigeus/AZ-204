# Cosmos DB

Question: Which of the following consistency levels offers the greatest throughput?

- [ ] Strong
- [ ] Session
- [ ] Bounded staleness
- [ ] Consistent prefix
- [x] Eventual

Answer: The eventual consistency level offers the greatest throughput at the cost of weaker consistency.

---

Question: What are request units (RUs) in Azure Cosmos DB?

- [x] A unit of measurement used to express the cost of all database operations in Azure Cosmos DB.
- [ ] A unit of time used to measure the duration of database operations.
- [ ] A unit of storage used to measure the amount of data stored in Azure Cosmos DB.

Answer: RUs represent the normalized cost of all database operations in Azure Cosmos DB, including writes, point reads, and queries.

---

Question: When defining a stored procedure in the Azure portal input parameters are always sent as what type to the stored procedure?

- [x] String
- [ ] Integer
- [ ] Boolean

Answer: When defining a stored procedure in Azure portal, input parameters are always sent as a string to the stored procedure.

---

Question: Which of the following would one use to validate properties of an item being created?

- [x] Pretrigger
- [ ] Post-trigger
- [ ] User-defined function

Answer: Pretriggers can be used to conform data before it's added to the container.  
Post-triggers run after an item is created.  
User-defined functions run on existing data.

---

Question: Your company is developing a new online multiplayer game. The game includes a feature that shows a global leaderboard to players. The leaderboard doesn't have to be up-to-the-minute for each player, but any lag should be within a defined limit. What consistency level would be most suitable for this scenario?

- [ ] Strong
- [ ] Session
- [x] Bounded staleness
- [ ] Consistent prefix
- [ ] Eventual

Answer: The Bounded staleness consistency level allows for some lag in data propagation but within a defined limit.

---

Question: What is the most suitable consistency level for a database solution that ensures sequential data writes are returned with no gaps, can process data using either its most recent or previous version, strives to minimize latency and negative impacts on data availability, and also keeps processing overhead as minimal as possible?

- [ ] Strong
- [ ] Session
- [x] Bounded staleness
- [ ] Consistent prefix
- [ ] Eventual

Answer: The bounded Staleness consistency level ensures that data writes are returned sequentially (no gaps). You have the flexibility to set up staleness, deciding the version of data to be returned, based on either the count of versions or the time elapsed.  
All other options (except Eventual) also enabless gapless reads, but cannot configure staleness.

---

Question: Your company operates a financial application which handles sensitive transactions. It's critical that all operations are immediately consistent across all regions, even if it might impact performance. What consistency level would be most suitable for this scenario?

- [x] Strong
- [ ] Session
- [ ] Bounded staleness
- [ ] Consistent prefix
- [ ] Eventual

Answer: Strong consistency level ensures immediate consistency across all regions.

---

Question: Your company is creating a shopping platform where users interact with their own shopping carts. A user's actions should be immediately consistent within their session, but it doesn't have to be strongly consistent with other users' sessions. What consistency level would be most suitable for this scenario?

- [ ] Strong
- [x] Session
- [ ] Bounded staleness
- [ ] Consistent prefix
- [ ] Eventual

Answer: Session consistency level ensures that within a single session.

---

Question: Your company is building a workflow management system where sequences of tasks are processed. It's crucial that these tasks are processed in the order they were written, even if it means reading data a bit behind the latest. What consistency level would be most suitable for this scenario?

- [ ] Strong
- [ ] Session
- [ ] Bounded staleness
- [x] Consistent prefix
- [ ] Eventual

Answer: Consistent prefix level ensures that the sequence of operations is preserved.

---

Question: Your company is creating a social media platform with a feature to 'like' posts. It's more important to have high availability and throughput, and your application can handle some temporary inconsistencies, like the count of likes appearing out of order or slightly stale. What consistency level would be most suitable for this scenario?

- [ ] Strong
- [ ] Session
- [ ] Bounded staleness
- [ ] Consistent prefix
- [x] Eventual

Answer: Eventual consistency level prioritizes availability and throughput over immediate consistency.

---

Question: Your company has recently started using Azure Cosmos DB and hasn't made any adjustments to the consistency level. What delay should the company expect in data propagation between different regions?

- [ ] No delay, data is immediately consistent across all regions.
- [ ] Delay is limited to a specific number of operations or time interval.
- [x] Delay may occur but is contained within a single user's session.
- [ ] Delay is possible and data might be read in the order of writes but a bit behind the latest.
- [ ] Delay and out-of-order reads may occur, but the system will eventually become consistent.

Answer: Default consistency level is **Session**

---

Question: What is the primary reason for identifying access patterns in your solution when using Azure Cosmos DB?

- [ ] To determine the cost of the solution
- [x] To ensure efficient data modeling
- [ ] To choose the right programming language
- [ ] To decide the number of users for the platform

Answer: [Identifying access patterns](https://learn.microsoft.com/en-us/azure/cosmos-db/nosql/model-partition-example#identify-the-main-access-patterns) helps design the data model to optimize application interactions, such as minimizing cross-partition queries or reducing request numbers through denormalization.  
Although cost can be influenced by data modeling, the main goal is performance optimization.  
The choice of programming language is largely unrelated to data modeling. Access patterns don't dictate language choice.  
The number of platform users is a business decision, not directly related to data modeling or access patterns.

---

Question: What is the purpose of denormalization in the context of Azure Cosmos DB data modeling?

- [ ] To reduce the number of containers
- [x] To optimize read queries
- [ ] To increase the number of request units consumed
- [ ] To add more users to the platform

Answer: [Denormalization in Azure Cosmos DB data modeling](https://learn.microsoft.com/en-us/azure/cosmos-db/nosql/model-partition-example#v2-introducing-denormalization-to-optimize-read-queries) is used to optimize read queries. By storing related data together (denormalizing), you can retrieve all the data you need in a single query, reducing the need for multiple queries and improving performance.  
Denormalization doesn't aim to reduce the number of containers, increase the number of request units consumed, or add more users to the platform; it's a strategy to optimize read operations by organizing data efficiently within containers.

---

Question: In Azure Cosmos DB, when dealing with a schema design that requires optimizing read operations and reducing the number of joins, what approach is commonly used?

- [ ] Normalizing
- [ ] Sharding
- [x] Denormalizing
- [ ] Partitioning

Answer: Denormalizing is the process of restructuring a database to reduce redundancy and improve read performance. In Azure Cosmos DB, denormalizing can help in optimizing read operations by reducing the need for complex joins and aggregations. This approach can lead to faster query execution, especially in a distributed database system like Cosmos DB.

---

Question: When would you use the manual failover feature in Azure Cosmos DB?

- [x] When you want to test your application's resilience
- [ ] When you want to add a new region to your account
- [ ] When you want to enable multi-region writes
- [ ] When you want to create a new Azure Cosmos DB account

Answer: Manual failover allows you to manually trigger a failover to a backup region, which is useful for testing your application's resilience to failures.

Question: What is the prerequisite for enabling service-managed failover in Azure Cosmos DB?

- [ ] Your account must have at least one region
- [x] Your account must have two or more regions
- [ ] Your account must have multi-region writes enabled
- [ ] Your account must be configured for manual failover

Answer: The service-managed failover feature requires your account to have two or more regions, as it needs a backup region to failover to if the primary region becomes unavailable.

---

Question: What is the role of a partition key in Azure Cosmos DB?

- [x] It helps to distribute data efficiently across partitions.
- [ ] It is used to manage the Azure Cosmos DB account.
- [ ] It is used to create a unique DNS name for the account.
- [ ] It is used to group containers into a database.

Answer: The partition key helps Azure Cosmos DB distribute the data efficiently across partitions. The value of this property is then used to route data to the appropriate partition to be written, updated, or deleted.

---

Question: What is the main characteristic of Azure Cosmos DB containers regarding data schemas?

- [ ] Containers require a strict schema for all items.
- [x] Containers are schema-agnostic.
- [ ] Containers only support JSON schema.
- [ ] Containers do not support any schema.

Answer: Containers in Azure Cosmos DB are schema-agnostic, meaning items within a container can have arbitrary schemas or different entities so long as they share the same partition key.

---

Question: What is the maximum amount of data a logical partition in Azure Cosmos DB can store?

- [ ] 10 GB
- [x] 20 GB
- [ ] 50 GB
- [ ] Unlimited

Answer: 20 GB

---

Question: What is the relationship between Azure Cosmos DB and Azure Resource Group?

- [ ] Azure Cosmos DB is a type of Azure Resource Group.
- [ ] Azure Resource Group is a type of Azure Cosmos DB.
- [x] Azure Cosmos DB account is created in an Azure Resource Group.
- [ ] Azure Resource Group is created in an Azure Cosmos DB account.

Answer: To begin using Azure Cosmos DB, you need to create an Azure Cosmos DB account in an Azure Resource Group in your subscription.

---

Question: What is the maximum throughput amount a physical partition in Azure Cosmos DB can have?

- [ ] 1,000 RU/s
- [ ] 5,000 RU/s
- [x] 10,000 RU/s
- [ ] 20,000 RU/s

Answer: 10,000 RU/s

---

Question: You are designing an application that will use Azure Cosmos DB as its data store. The application will store data about customers and their orders. Each customer can have multiple orders, and you expect a high volume of read and write operations on the orders.

You want to ensure that the application can handle the expected load and that the data is distributed efficiently. You also want to ensure that the application can retrieve all orders for a specific customer as efficiently as possible.

How would you design the data model in Azure Cosmos DB to meet these requirements?

- [ ] Create separate databases for customers and orders, and use the `customer ID` as the partition key for the orders database.
- [x] Create a single container for both customers and orders, and use the `customer ID` as the partition key.
- [ ] Create separate containers for customers and orders, and use the `customer ID` as the partition key for the orders container.
- [ ] Create separate containers for customers and orders, with the `customer ID` as the partition key for the customers container and the `order ID` as the partition key for the orders container.

Answer: A container can hold items with different schemas as long as they share the same partition key. By storing customers and their orders in the same container and using the `customer ID` as the partition key, you can ensure that all orders for a specific customer are stored in the same partition. This makes it efficient to retrieve all orders for a specific customer.  
The other options are incorrect because they do not efficiently distribute the data or allow for efficient retrieval of all orders for a specific customer.

---

Question: What is the main characteristic of shared throughput in Azure Cosmos DB?

- [ ] It is exclusively reserved for a single container.
- [x] It is specified at the database level and shared with up to 25 containers.
- [ ] It automatically adjusts based on the current workload.
- [ ] It is a fixed amount of throughput.

Answer: Shared throughput in Azure Cosmos DB is specified at the database level and then shared with up to 25 containers within the database. The other options are incorrect because they describe characteristics of dedicated throughput, not shared throughput.

---

Question: Can you switch between dedicated and shared throughput in Azure Cosmos DB?

- [ ] Yes, you can switch at any time.
- [x] No, you cannot switch once a container is created.
- [ ] Yes, but only within the first 24 hours of creating a container.
- [ ] No, but you can increase the amount of dedicated throughput for a container.

Answer: You cannot switch between dedicated and shared throughput once a container is created. If you want to change a container from shared to dedicated throughput, you must create a new container and copy the data to it.

---

Question: What is the main advantage of using autoscale throughput in Azure Cosmos DB?

- [ ] It provides a fixed amount of throughput regardless of workload.
- [x] It automatically adjusts the amount of throughput based on the current workload.
- [ ] It allows throughput to be shared among multiple containers.
- [ ] It requires manual adjustment of throughput based on workload.

Answer: Autoscale automatically adjusts the amount of throughput based on the current workload.

---

Question: You are designing an application that will use Azure Cosmos DB as its data store. The application will have a high volume of read and write operations. You want to ensure that each container in your database can handle the expected load independently. How should you configure the throughput?

- [ ] Use shared throughput and create a separate database for each container.
- [x] Use dedicated throughput and assign it to each container individually.
- [ ] Use shared throughput and assign it to each container individually.
- [ ] Use dedicated throughput and assign it at the database level.

Answer: Dedicated throughput in Azure Cosmos DB is specified at the container level, meaning each container has its own amount of throughput that it can use independently of other containers.  
Shared throughput is specified at the database level (not at container level) and shared among containers, not at the individual database level.  
Dedicated throughput is not assigned at the database level but at the container level.

---

Question: You are designing an application that will use Azure Cosmos DB as its data store. The application will have several containers, each storing different types of data, but none of the containers are expected to have a high volume of read and write operations. You want to optimize costs while ensuring that all containers have enough throughput. Which of the following strategies would be the most cost-effective?

- [ ] Assign dedicated throughput to each container individually, ensuring each has enough to handle its expected load.
- [x] Assign shared throughput at the database level, allowing all containers to draw from a common pool of throughput.
- [ ] Assign dedicated throughput at the database level, ensuring the entire database has enough to handle its expected load.
- [ ] Assign shared throughput to each container individually, allowing each to draw from its own pool of throughput.

Answer: Shared throughput in Azure Cosmos DB is specified at the database level and then shared among all containers within the database. This is ideal for scenarios where you have multiple containers that do not require a high volume of operations and you want to optimize costs.  
Dedicated throughput is specified at the container (not at dayabase level) level and would be more expensive for a scenario where the containers do not have a high volume of operations.  
Shared throughput is not assigned at the container level but at the database level.

---

Question: What is the correct syntax to select all properties from items in a Cosmos DB container?

- [x] `SELECT *`
- [x] `SELECT c.*`
- [ ] `SELECT ALL`
- [ ] `SELECT c.ALL`
- [x] `SELECT c FROM root AS c`

Answer: Same as SQL. Note: The `SELECT *` syntax is only valid if FROM clause has declared exactly one alias.

---

Question: Given the following query, which option correctly selects all properties from items in the container?

```sql
FROM c
JOIN p IN c.phones
```

- [ ] `SELECT *`
- [x] `SELECT c.*`
- [ ] `SELECT p.*`
- [ ] `SELECT c.*, p.*`

Answer: `SELECT c.*`
The `SELECT *` syntax is only valid if the FROM clause has declared exactly one alias. In this case, the FROM clause has declared two aliases (`c` and `p`), so `SELECT *` is not valid.  
The `SELECT p.*` syntax would select all properties from the items in the phones array  
The `SELECT c.*, p.*` would select all properties from both the items in the container and the phones array. However, in this context, SELECT c.\* is the correct answer because the question asks for all properties from items in the container.

---

Question: Given the following data:

```json
[
  {
    "id": "6e9f51c1-6b45-440f-af5a-2abc96cd083d",
    "categoryName": "Sleeping Bags",
    "name": "Vareno Sleeping Bag (6') Turmeric",
    "price": 120,
    "closeout": true,
    "manufacturer": {
      "name": "Vareno"
    },
    "tags": [{ "name": "Color Group: Yellow" }, { "name": "Bag Shape: Mummy" }]
  }
]
```

What result this query will produce:

```Cosmos DB
SELECT {
  "name": p.name,
  "sku": p.sku,
  "vendor": p.manufacturer.name
} AS product
FROM products p
WHERE p.sku = "teapo-surfboard-72109"
```

```jsonc
[
  // Result here
]
```

Answer:

```json
[
  {
    "product": {
      "name": "Teapo Surfboard (6'10\") Grape",
      "sku": "teapo-surfboard-72109",
      "vendor": "Taepo"
    }
  }
]
```

---

Question: Given the following data:

```json
[
  {
    "id": "6e9f51c1-6b45-440f-af5a-2abc96cd083d",
    "categoryName": "Sleeping Bags",
    "name": "Vareno Sleeping Bag (6') Turmeric",
    "price": 120,
    "closeout": true,
    "manufacturer": {
      "name": "Vareno"
    },
    "tags": [{ "name": "Color Group: Yellow" }, { "name": "Bag Shape: Mummy" }]
  }
]
```

Write a query that will return this result, filtering by `teapo-surfboard-72109`:

```json
[
  {
    "name": "Teapo Surfboard (6'10\") Grape",
    "sku": "teapo-surfboard-72109",
    "vendor": "Taepo"
  }
]
```

```sql
-- Code here
```

Answer:

```sql
SELECT VALUE {
  "name": p.name,
  "sku": p.sku,
  "vendor": p.manufacturer.name
}
FROM products p
WHERE p.sku = "teapo-surfboard-72109"
```

---

Question: Which of the following best describes the format of data returned by a Cosmos DB query when using the PostgreSQL API?

- [ ] XML, since XML is a widely used format for data interchange.
- [ ] Tabular data, since the PostgreSQL API transforms the data to resemble traditional SQL results.
- [x] JSON, because Cosmos DB internally stores data in a JSON-like format, regardless of the API used.
- [ ] Binary data, encoded in a PostgreSQL-specific format.

Answer: Cosmos DB internally stores data in a JSON-like format, regardless of the API used.

---

Question: When executing a query in Azure Cosmos DB utilizing the Table API as follows:

```Cosmos DB
SELECT
FROM Invoices i
WHERE i.id =1
```

What kind of outcome can you anticipate from this query?

- [ ] Data in an XML format
- [x] Data in a JSON format
- [ ] An error due to incorrect syntax
- [ ] A table structured in rows and columns

Answer: Cosmos DB internally stores data in a JSON-like format, regardless of the API used.

---

Question: Given the following statements about Azure Cosmos DB's Change Feed, identify which ones are true:

- [x] Change Feed in Azure Cosmos DB is automatically enabled upon creation of a container.
- [x] The Change Feed presents changes to a container in a chronological sequence.
- [ ] Change Feed natively displays all modifications, including inserts, updates, and deletions.
- [ ] There is only one interaction model with Change Feed, which is the push model.
- [x] A soft-delete pattern is supported in Azure Cosmos DB where a "deleted" attribute can be appended to items intended for deletion.
- [x] In the push model, the Change Feed processor independently dispatches tasks to a client.
- [ ] Change Feed functionality is available across all API models in Azure Cosmos DB.
- [x] The pull model in Change Feed allows for manual checkpointing and control over processing speed.
- [x] Items can have a time-to-live (TTL) value attached for automatic deletion.
- [ ] Change Feed functionality is limited to the SQL (Core) API in Azure Cosmos DB.
- [ ] In the push model, the Change Feed processor requires manual intervention to dispatch tasks to a client.
- [x] Change Feed shows all inserts and updates, excluding deletions.
- [x] The Change Feed feature isn't compatible with Azure Cosmos DB's Table and PostgreSQL APIs.
- [ ] Change Feed doesn't have a provision for distributing processing tasks across multiple instances.
- [ ] The Change Feed feature is an add-on and comes with an additional cost.
- [x] Change Feed allows microservices to independently react to data changes.
- [x] Change Feed supports reading changes from a specific partition key.
- [ ] The Change Feed retains the changes indefinitely until they are consumed.
- [x] Change Feed can be used to implement event sourcing patterns where the stream of events in Change Feed forms the source of truth and can be used to materialize the application’s state.
- [ ] Change Feed cannot be used in scenarios that require triggering a function or a logic app, real-time processing, or distributed database updates.
- [x] With Change Feed, you can create low-latency, real-time data processing solutions.
- [ ] Change feed guarantees order across the partition key values.

Answer:

The retention time depends on the configured time-to-live of the items and the change feed retention period set on the container, by default it's 7 days.  
Change Feed is used in scenarios that require triggering a function or a logic app, real-time processing, or distributed database updates.  
In the change feed, order is guaranteed within each logical partition key value, but not across them.

---

Question: Your organization has deployed a multi-region Azure Cosmos DB database to ensure high availability. Each region can simultaneously read from and write to the database. There is a chance that the same document is updated concurrently in different regions, potentially leading to conflicts. To handle this, you've decided to use the automatic conflict resolution policy provided by Azure Cosmos DB. Based on your understanding of this policy, which strategy best describes how Azure Cosmos DB would resolve these conflicts?

- [ ] The update from the region that first modified the document is always retained.
- [ ] The update from a randomly selected region is retained.
- [x] The update from the region that last modified the document is retained.
- [ ] All updates from all regions are retained in some manner.

Answer: Last Writer Wins

---

Question: You're running a global highly available e-commerce application with Azure Cosmos DB, where updates to product inventory are made concurrently across multiple regions. However, you've noticed that sometimes inventory data gets out of sync across different regions. To ensure consistency in inventory data, what feature can you use in Azure Cosmos DB?

- [ ] Increase Request Units (RUs)
- [ ] Implement strong consistency level
- [ ] Disable multi-region writes
- [x] Set up a conflict resolution policy

Answer: Setting up a conflict resolution policy helps manage conflicts that arise from concurrent writes across different regions, ensuring data consistency across regions.  
The other options are related to performance, consistency levels, and write capabilities, but they don't directly address data conflicts arising from concurrent writes.  
Disabling multi-region writes could potentially avoid conflicts, but it would also negate the benefits of having a globally distributed application, like reduced latency for writes in different regions.

---

Question: An e-commerce company is implementing a data migration operation on their Azure Cosmos DB database. The operation needs to be precisely controlled, allowing the engineering team to manually request the server for a set of changes, process them, and then request the next set. Which Change Feed interaction model best fits this use case?

- [x] Pull Model
- [ ] Push Model
- [ ] Either Model
- [ ] None of the Models

Answer: The pull model offers extra control for specific use-cases, especially for data migration.

---

Question: A financial technology company is developing a real-time fraud detection system using Azure Cosmos DB. The system needs to react instantaneously to changes in the database, with minimal latency. Which Change Feed interaction model best fits this use case?

- [ ] Pull Model
- [x] Push Model
- [ ] Either Model
- [ ] None of the Models

Answer: In the push model, the change feed processor automatically sends work to a client.

---

Question: Which of the following statements about Time to Live (TTL) in Azure Cosmos DB are true? Select all that apply.

- [x] TTL can be set at the container level and can be overridden on a per-item basis.
- [ ] TTL can be set only at item level.
- [ ] When TTL has expired, if the container is overloaded with requests, data is immediately deleted.
- [x] Items with TTL set to "-1" don't expire by default.
- [x] If TTL is not set on a container, then the TTL on an item in this container has no effect.
- [ ] If a container's TTL is null or missing, items without a specific TTL will not expire, while others adhere to their own TTL.
- [ ] TTL is used for automatically deleting items after a certain period, based on their creation time.

Answer: Even after TTL has expired, if the container is overloaded with requests and there aren't enough Request Units available, the data deletion is delayed until there are enough resources.  
Items are removed after specific time period, since the time they were **last modified**.

---

Question: You aim to create a Cosmos DB client, a database, and finally a container using the Azure Cosmos DB NoSQL API. Your intention is to utilize this container to manage a collection of IoT device telemetry data. Implementing .NET for this task, you find that after running the following code snippet, errors are encountered and no elements are created as anticipated. Several discrepancies in the code prevent its successful execution. What corrections should you apply to address these issues?

```cs
using Azure.CosmosDb;

CosmosClient cosmosClient = new CosmosClient("https://myCosmosAccount.documents.core.windows.net:443/", configuration["CosmosKey"]);

Database database = await cosmosClient.CreateDatabaseIfNotExistsAsync("db");

Container container = await database.CreateContainerAsync(
    id: "id",
    partitionKeyPath: "pk",
    throughput: 200
);
```

Answer:

```cs
using Microsoft.Azure.Cosmos;

CosmosClient cosmosClient = new CosmosClient("https://mycosmosdbaccount.documents.azure.com:443/", configuration["CosmosKey"]);

Database database = await cosmosClient.CreateDatabaseIfNotExistsAsync("dbName");

Container container = await database.CreateContainerAsync(
    id: "containerId",
    partitionKeyPath: "/pk",
    throughput: 400
);
```

- **Incorrect using** - should use `Microsoft.Azure.Cosmos`.

- **Incorrect Cosmos DB account endpoint** - The endpoint used to initialize the CosmosClient object is incorrect. The provided endpoint URL contains `core.windows.net` instead of `documents.azure.com`.

- **Incorrect database name** - should be between 3 and 63 chars, `db` is just 2.

- **Incorrect container id** - should be between 3 and 63 chars, `id` is just 2.

- **Incorrect partition key path** - The partition key path doesn't start with a `/`.

- **Incorrect throughput value** - The throughput argument is set to 200, but minimum is 400 or higher.

---

Question: You are developing an application that requires the efficient and rapid addition of a large number of items using Azure Cosmos DB. Which of the following practices can be employed to optimize performance for this use case?

- [x] Set the `EnableContentResponseOnWrite` request option to false.
- [ ] Use `FeedIterator` for iterating multiple pages of query results.
- [x] Exclude unused paths from indexing.
- [ ] Use `PartitionKey` for point read.

Answer: Setting `EnableContentResponseOnWrite` to false for workloads with heavy create/write payloads and excluding unused paths from indexing can improve performance by eliminating the return of created or updated resources to the SDK and facilitating faster writes, respectively, benefiting write-heavy workloads.

Using `FeedIterator` can improve performance when reading multiple pages of query results, but it doesn't directly optimize write-heavy workloads.  
Using `PartitionKey` for point read can reduce the Request Unit (RU) charge and improve performance for read-heavy workloads, but it doesn't directly optimize write-heavy workloads.

---

Question: You are developing an application with a read-heavy workload using Azure Cosmos DB. Which of the following practices could help improve performance?

- [x] Use `PartitionKey` for point read.
- [ ] Set the `EnableContentResponseOnWrite` request option to false.
- [x] Use `FeedIterator` for iteratin multiple pages of query results.
- [ ] Increase the size of your documents.

Answer: Utilizing `PartitionKey` for point read can reduce Request Unit (RU) charges and enhance performance, particularly for read-heavy workloads, while employing `FeedIterator` can improve performance when handling multiple pages of query results, a common scenario in read-heavy workloads.

Setting `EnableContentResponseOnWrite` to false can improve performance for write-heavy workloads, but it doesn't directly optimize read-heavy workloads.  
Increasing the size of your documents can actually increase the Request Unit (RU) charge and potentially lead to more errors, so it's not a good practice for optimizing performance.

---

Question: Your application is experiencing latency issues when connecting to Azure Cosmos DB. Which of the following could be a potential cause and how would you address it?

- [ ] The application is not using the latest version of the Azure Cosmos DB SDK.
- [x] The application is running in a different Azure region than your Azure Cosmos DB account.
- [ ] The application is using a single instance of CosmosClient for the lifetime of the application.
- [x] The application is using Gateway mode for connectivity.

Answer: Running your application in the same Azure region as your Azure Cosmos DB account and using Direct mode for connectivity can significantly reduce latency, optimizing the performance of your application.

While using the latest version of the Azure Cosmos DB SDK can generally improve performance, it doesn't specifically target latency issues.  
Using a single instance of CosmosClient for the lifetime of your application is a best practice for better performance and resource utilization, so it's unlikely to be the cause of latency issues.

---

Question: You are developing an application that needs to upload a large number of items into Azure Cosmos DB as quickly as possible. Which of the following practices could help improve performance?

- [x] Enable Bulk support.
- [x] Use ThroughputProperties to manage throughput.
- [x] Use Direct mode for connectivity.
- [ ] Use Windows 64-bit host processing.
- [ ] Use single instance of CosmosClient.
- [x] Set the EnableContentResponseOnWrite request option to false.

Answer: Enabling Bulk support, utilizing `ThroughputProperties` for managing throughput, setting connectivity mode to `Direct`, and setting `EnableContentResponseOnWrite` to false can collectively enhance performance when efficiently handling large volumes of data in Azure Cosmos DB by optimizing high-volume write operations, balancing resource usage, and minimizing network and serialization costs.  
Using Windows 64-bit host processing and a single instance of CosmoCLient can generally improve performance, but it doesn't specifically target scenarios where large volumes of data are being dumped into the database.

---

Question: You are a software developer tasked with creating a C# utility that interacts with Azure Cosmos DB. Your script should establish a connection, create a database and a container if they don't exist, and finally create an item in the container. Use placeholders like `"<connection-string>"`, `"<database>"`, `"<container>"`.

```cs
// Code here
```

Answer:

```cs
var cosmosClient = new CosmosClient("<connection-string>");

// Create a database
var database = await cosmosClient.CreateDatabaseIfNotExistsAsync("<database>");

// Create a container
var container = await database.CreateContainerIfNotExistsAsync("<container>", "/mypartitionkey");

// Create an item
dynamic testItem = new
{
    id = "1",
    mypartitionkey = "mypartitionvalue",
    description = "mydescription"
};
await container.CreateItemAsync(testItem, new PartitionKey(testItem.mypartitionkey));
```

---

Question: You are developing a system that needs to interact with Azure Cosmos DB. Your task is to write a piece of code that connects to a specific Cosmos DB instance and retrieves sales orders for a given account number, with a maximum item count of 1.

```cs
var connectionString = "<connection-string>";
var dbName = "<database>";
var containerName = "<container>";
var partitionKey = "Accounts";
var throughputValue = 400;
var accountNumber = "190823";

// Code here
```

Answer:

```cs
var connectionString = "<connection-string>";
var dbName = "<database>";
var containerName = "<container>";
var partitionKey = "Accounts";
var throughputValue = 400;
var accountNumber = "190823";

var cosmosClient = new CosmosClient(connectionString);
Database database = await cosmosClient.CreateDatabaseIfNotExistsAsync(dbName);
Container container = await database.CreateContainerIfNotExistsAsync(id: , partitionKeyPath: $"/{partitionKey}", throughput: throughputValue);
QueryDefinition query = new QueryDefinition(
    "select * from sales s where s.AccountNumber = @AccountInput ")
    .WithParameter("@AccountInput", accountNumber);
FeedIterator<SalesOrder> resultSet = container.GetItemQueryIterator<SalesOrder>(
    query,
    requestOptions: new QueryRequestOptions()
    {
        PartitionKey = new PartitionKey(partitionKey),
        MaxItemCount = 1
    });
```

---

Question: Which of the following tools can you use to create and execute triggers, stored procedures, and UDFs in Azure Cosmos DB?

- [ ] Visual Studio Code
- [x] Azure Portal
- [ ] SQL Server Management Studio
- [ ] Azure DevOps

Answer: The Azure Portal is one of the tools that allow you to create and execute triggers, stored procedures, and UDFs in Azure Cosmos DB. The other options listed are not directly used for this specific purpose within Azure Cosmos DB.

---

Question: Your organization is planning to migrate a NoSQL database to Azure Cosmos DB and requires an API that can handle flexible document structures and operate using the BSON format. Which API within Azure Cosmos DB would best meet these requirements?

- [ ] SQL API
- [ ] Table API
- [ ] Gremlin API
- [ ] Cassandra API
- [x] MongoDB API

Answer: In the context of Azure Cosmos DB, the BSON (Binary JSON) format is specifically associated with the MongoDB API.

---

Question: In Azure Cosmos DB, when working with stored procedures, triggers, or user-defined functions, what specific method can be utilized to log the execution steps or trace information?

- [ ] Console.WriteLine()
- [ ] Trace.Debug()
- [ ] System.out.println()
- [x] console.log()

Answer: stored procedures, triggers, and user-defined functions are written on JavaScript.

---

Question: What language should you use if you want to create a new user-defined function, stored procedure, or trigger?

- [ ] JSON
- [x] JavaScript
- [ ] C#
- [ ] XML
- [ ] YAML

Answer: stored procedures, triggers, and user-defined functions are written on JavaScript.

---

Question: How many free tier Azure Cosmos DB accounts can you have per Azure subscription?

- [ ] Two
- [ ] Unlimited
- [x] One
- [ ] None

Answer: You can have up to one free tier Azure Cosmos DB account per Azure subscription.

---

Question: What operations can a stored procedure perform of document in Cosmos DB?

- [x] Create
- [x] Read
- [x] Update
- [x] Delete
- [ ] No operations allowed

Answer: Stored procedures are capable of performing CRUD and query operations on any document in a collection.

---

Question: Complete the following pre-trigger that adds timestampt to every new item:

```js
function validateToDoItemTimestamp() {
  /* Code here */

  // item to be created in the current operation
  var itemToCreate = /* Code here */;

  // validate properties
  if (!("timestamp" in itemToCreate)) {
    var ts = new Date();
    itemToCreate["timestamp"] = ts.getTime();
  }

  // update the item that will be created
  /* Code here */
}
```

Answer:

```js
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
```

---

Question: You are working on a project that involves storing large amounts of data in Azure Cosmos DB using the SQL API. The data consists of user profiles, each with a variety of attributes. During the design phase, you realize that no single attribute is suitable for partitioning, as they either appear too frequently or not frequently enough to distribute the workload evenly across partitions. Which of the following strategies could you use to create a synthetic partition key that ensures even distribution of workloads?

- [x] Concatenating multiple common properties, followed by a random number
- [ ] Using the user's email address as it is unique
- [x] Appending a timestamp to the user's country of residence
- [ ] Using the user's age as the partition key
- [ ] Using the user's membership status (e.g., Free, Premium, VIP)

Answer:

- Concatenating multiple common properties, followed by a random number, would create a synthetic partition key that is likely to distribute data more evenly across partitions. The random number ensures that the key is unique and helps in distributing the workload.
- Appending a timestamp to the user's country of residence would also create a synthetic partition key that can distribute data more evenly. The timestamp ensures that even if many users are from the same country, their data will be spread across multiple partitions.
- Using the user's email address as it is unique would not necessarily distribute the workload evenly, especially if the application has operations that need to query or update multiple documents that can't be guaranteed to be in the same partition.
- Using the user's age would not be a good choice for partitioning, as it could lead to hot partitions. Age groups like 20-30 or 30-40 could have more data, leading to uneven distribution.
- Using the user's membership status could also lead to hot partitions if one membership type is significantly more common than others.

---

Question: How to retain the change feed in Azure Cosmos DB until the data is deleted? What should be the value of TTL (Time to Live) property?

- [ ] null
- [x] -1
- [ ] 0
- [ ] 1

Answer: If the TTL property is set on an item to -1, the change feed will remain if the data is not deleted.

---

Question: Create a stored procedure that creates a document.

```js
var createDocumentStoredProc = {
  id: "createMyDocument",
  // This stored procedure creates a new item in the Azure Cosmos container
  body: function createMyDocument(documentToCreate) {
    // Code here
  },
};
```

Answer:

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

---

Question: How to set Time-To-Live property of `ContainerProperties` to be 1 hour?

- [ ] `DefaultTimeToLive = 60`
- [x] `DefaultTimeToLive = 3600`
- [ ] `TTL = 60`
- [ ] `TTL = 3600`

Answer: Property is `DefaultTimeToLive`, unit is _seconds_,

---

Question: You have to ensure the following query can be executed:

```sql
select * from customers order by customername, city asc
```

You have to define a policy for this:

```jsonc
{
  "automatic": true,
  "indexingMode": "Consistent",
  "includedPaths": [{ "path": "/*" }],
  "excludedPaths": []
  /* Code here */
}
```

Answer: Queries that have an `ORDER BY` clause with two or more properties require a composite index.

```json
{
  "automatic": true,
  "indexingMode": "Consistent",
  "includedPaths": [{ "path": "/*" }],
  "excludedPaths": [],
  "compositeIndexes": [
    [
      {
        "path": "/city",
        "order": "ascending"
      },
      {
        "path": "/customername",
        "order": "descending"
      }
    ]
  ]
}
```

---

Question: You are working on an Azure-based application that utilizes Azure Cosmos DB for data storage. You've noticed scalability issues attributed to hot partitioning. What is the likely cause of this hot partitioning issue in Azure Cosmos DB?

- [ ] Executing queries that don't use the partition key
- [ ] Running queries focused on a single partition key
- [ ] Failing to set an indexing policy
- [x] Designing a partition key that leads to uneven request distribution

Answer: Hot partitioning typically arises when there is an uneven distribution of requests or data across logical partitions. This imbalance prevents Azure Cosmos DB from scaling effectively. The ideal partition key should ensure a balanced distribution of both storage and throughput across partitions.

---
