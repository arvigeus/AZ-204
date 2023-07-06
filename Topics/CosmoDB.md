# Azure Cosmos DB

## [Overview](https://docs.microsoft.com/en-us/azure/cosmos-db/introduction)

Azure Cosmos DB is a fully managed NoSQL database service provided by Microsoft Azure. It provides global distribution, can scale horizontally, and offers multiple models of consistency. Cosmos DB supports multiple data models, including document, column family, graph, and key-value pairs.

### Key Benefits of Azure Cosmos DB

- **Global Distribution:** Cosmos DB allows you to distribute your data globally, enabling low latency access to data for end users from any geographic location.

- **Multi-Model Database:** Cosmos DB is multi-modal, meaning it supports multiple types of data models like Key-Value, Document, Column-family and Graph.

- **Elastically Scalable Throughput and Storage:** Azure Cosmos DB enables you to elastically scale throughput and storage based on demand.

- **Multiple Consistency Models:** It offers five consistency models - Eventual, Consistent Prefix, Session, Bounded Staleness, and Strong. This gives developers flexibility to choose consistency according to their application needs.

- **Comprehensive SLAs:** Microsoft provides comprehensive SLAs (Service Level Agreements) that cover latency, throughput, consistency, and availability.

## [Core Components](<(https://docs.microsoft.com/en-us/azure/cosmos-db/databases-containers-items)>)

- [**Cosmos DB Account**](https://docs.microsoft.com/en-us/azure/cosmos-db/manage-account) - The root resource for Azure Cosmos DB.

- **Databases** - A logical container for containers and users. Databases manage users, permissions, and the consistency level.

- **Containers** - A schema-agnostic abstraction for storing items. You can think of them as tables, collections, or graphs depending on the chosen API. A container is associated with a specific partition key that determines how the data within the container is distributed across the partitions.

- **Items** - Similar to rows or documents in other databases. An item is the smallest unit of data that can be read or written in Cosmos DB. The shape and content of items can vary as they are schema-agnostic.

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
var cosmosClient = new CosmosClient("<connection-string>");

// Create a database
Database database = await cosmosClient.CreateDatabaseIfNotExistsAsync("<database>");

// Create a container
Container container = await database.CreateContainerIfNotExistsAsync("<container>", "/mypartitionkey");

// Create an item
dynamic testItem = new
{
    id = "1",
    mypartitionkey = "mypartitionvalue",
    description = "mydescription"
};
await container.CreateItemAsync(testItem, new PartitionKey(testItem.mypartitionkey));
```

## [Consistency Levels](https://docs.microsoft.com/en-us/azure/cosmos-db/consistency-levels)

Offer balance between consistency, availability, and latency. These consistency levels are linearizable across the globe.

- **Strong** - Every reader sees the latest data right away, but it may be slower (higher latency) and less available. Best for serious stuff like bank transactions where accuracy is vital.

- **Bounded staleness** - Readers may see slightly old data, but there's a limit on how old (determined by number of operations K or the time interval T for staleness). Good for things like game leaderboards where a small delay is okay.

- **Session** (default) - Within a single user's session, the data is always up-to-date. Great for scenarios like a personal shopping cart on a website.

- **Consistent prefix** - Readers might be a bit behind, but they always see things in order. Good for situations where sequence matters, like following a chain of events.

- **Eventual** - Readers might see things out of order (non-consistent) or slightly old, but it eventually catches up. Best when speed and availability are more important than immediate consistency, like a social media like counter.

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

- **Partition Key**: This is a specific property in your data that Cosmos DB uses to distribute the data across multiple partitions. Selecting an optimal partition key is a critical decision for the performance and scalability of a Cosmos DB. A well-chosen partition key evenly disperses the workload across all partitions, thereby avoiding 'hot' partitions that could become a performance bottleneck.

- **Logical Partitions**: Each logical partition comprises a set of items sharing the same partition key value. Cosmos DB uses logical partitions to organize data, which enables rapid and efficient query processing and transaction management. Each logical partition can store up to 20 GB of data and can serve up to 10,000 RU/s.

- **Physical Partitions**: These are internal resources that Azure Cosmos DB manages. They host one or more logical partitions, providing the computational resources (CPU, I/O, memory) for them. Cosmos DB automatically splits and merges physical partitions to evenly distribute the workload as the data volume and throughput.

- **Partition Sets**: A partition set is essentially a group of physical partitions. A container might start with a single partition set, but as the data volume or throughput requirements increase, Cosmos DB can split the partition set into multiple subsets to maintain performance.

### Partitioning Strategies

Picking the right partition key is vital. It should distribute your data and workload evenly to avoid overloading any single partition, which could degrade performance.

Consider choosing a partition key that is frequently used in the WHERE clause of your queries and has a large number of distinct values. For instance, in a multi-tenant application, using the tenant ID as the partition key may be advantageous. It would ensure that each tenant's data is localized to specific partitions, improving read/write performance while keeping the tenants' data isolated.

## [Request Units (RUs)](https://learn.microsoft.com/en-us/azure/cosmos-db/request-units)

Represent the currency of throughput in Azure Cosmos DB. Each operation (e.g., read, write, query) consumes a certain number of RUs, depending on factors such as the item size, item property count, and query complexity.

If an operation's RU cost exceeds your provisioned RUs, the operation is rate-limited until sufficient RUs become available.

Here's a practical rule of thumb: A read operation on a 1-KB document typically consumes 1 RU.

### [Provisioned Throughput](https://learn.microsoft.com/en-us/azure/cosmos-db/set-throughput)

You can set provisioned throughput at either the database level or the container level.

- **Database-level throughput**: Shared among all the containers in the database. It's a cost-effective option for small workloads with light traffic.

- **Container-level throughput**: Dedicated to a single container. More suitable for workloads with heavy traffic or large data volumes.

### [Serverless mode](https://learn.microsoft.com/en-us/azure/cosmos-db/serverless)

You don't have to assign any throughput when creating resources in your Azure Cosmos DB account. At the end of your billing period, you get billed for the number of Request Units consumed by your database operations

### [Autoscale Throughput](https://learn.microsoft.com/en-us/azure/cosmos-db/provision-throughput-autoscale)

Autoscale automatically adjusts the provisioned RUs based on the current usage. It scales between 10% and 100% of a set maximum.

## [API Models](https://learn.microsoft.com/en-us/azure/cosmos-db/choose-api)

- **SQL API** - A JSON-based, document-centric API that provides SQL querying capabilities. Ideal for web, mobile, and gaming applications, and anything that requires handling complex _hierarchical_ data with a _schemaless_ design.

- **MongoDB API** - If you're already using MongoDB

- **Cassandra API** - Allows existing Apache Cassandra workloads to run on Azure Cosmos DB, with minimal code changes.

- **Azure Table API** - A _key-value_ based API that offers compatibility with Azure Table Storage, overcoming its limitations. Ideal for applications that need a simple schemaless _key-value_ store.

- **Gremlin API** - _Graph-based_ API for highly _interconnected_ datasets.

## [Global Distribution](https://docs.microsoft.com/en-us/azure/cosmos-db/distribute-data-globally)

- **Multi-region Writes** - Perform writes in all configured regions. This enhances write latency and availability.

- **Consistency and Latency**

- **Automatic Failover** - If an Azure region goes down, Cosmos DB can automatically failover to another region.

- **Manual Failover** - For testing purposes, you can trigger a manual failover to see how your application behaves during regional failures.

- **No downtime when adding or removing regions**

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

Azure Cosmos DB provides automated and manual backup capabilities to protect your data and provide recovery from both regional disasters and accidental deletes.

### Automated Backups

Cosmos DB automatically takes backups of your data at regular intervals without affecting the performance or availability of your database operations.

### Manual Backups (Point-in-time Restore)

You can manually trigger backups using the Point-in-time Restore (PITR) feature. This allows you to restore your data to any point within the last 30 days.

### Backup Storage and Retention

The backup storage is separate from your provisioned throughput and data storage, and it doesn't affect the performance of database operations. You can set the backup retention period up to 30 days.

### Restore

You can restore both manual and automatic backups to a new Cosmos DB account in case of accidental delete or write operations, or regional disasters.

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
