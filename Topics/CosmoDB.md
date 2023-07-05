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

## 4. Partitioning in Cosmos DB

- What is partitioning?
- Partition Key
- Partition Sets

## 5. Request Units (RUs)

- Understanding RUs
- Provisioned Throughput
- Serverless mode

## 6. API Models

- SQL API
- MongoDB API
- Cassandra API
- Azure Table API
- Gremlin API

## 7. Global Distribution

- Multiple write regions
- Conflict resolution

## 8. Security

- Encryption at rest
- Network security
- Role-based access control (RBAC)

## 9. Backup and Restore

- Automatic backups
- Manual backups
- Restoring data

## 10. Monitoring and Diagnostics

- Metrics
- Azure Monitor
- Diagnostics Logs

## 11. Use Cases

- Real-time analytics
- IoT applications
- Personalization
- Catalogs
