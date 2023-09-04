# Resources

## By hierarchy

- [Resource Group](./Resource%20Group.md)
  - [App Service Plan](./App%20Service%20Plan.md)
    - [App Service Web Apps](./App%20Service%20Web%20Apps.md)
  - [Storage Account](./Storage%20Account.md)
    - [Functions](./Functions.md)
    - [Queue Storage](./Queue%20Storage.md)

## Create

**NOTE**: that all services/resources require a **resource group** to be created.

| Name                 | Endpoint URL                                  | Requires                          | AZ CLI                 | C#                                                       | Powershell                   | Argument Rules                   |
| -------------------- | --------------------------------------------- | --------------------------------- | ---------------------- | -------------------------------------------------------- | ---------------------------- | -------------------------------- |
| App Service Web Apps | `https://{appname}.azurewebsites.net`         | App Service Plan                  | `webapp`               | `new WebApp(name: string, ...)`                          | `New-AzWebApp`               | GloballyUnique, ServicePlanAssoc |
| Functions            | `https://{appname}.azurewebsites.net/api`     | App Service Plan, Storage Account | `functionapp`          | `new FunctionApp(name: string, ...)`                     | `New-AzFunctionApp`          | GloballyUnique, ServicePlanAssoc |
| Container Registry   | `https://{registryname}.azurecr.io`           |                                   | `acr`                  | `new ContainerRegistry(name: string, ...)`               | `New-AzContainerRegistry`    | GloballyUnique                   |
| Container Instance   |                                               |                                   | `container`            | `new ContainerInstance(name: string, ...)`               | `New-AzContainerGroup`       | GloballyUnique, Rule4            |
| Container Apps       |                                               |                                   | `containerapp`         |                                                          |                              | GloballyUnique, Rule5            |
| Cosmos DB            | `https://{accountname}.documents.azure.com`   |                                   | `cosmosdb`             | `new CosmosDBAccount(name: string, ...)`                 | `New-AzCosmosDBAccount`      | GloballyUnique, Rule6            |
| Blob Storage         | `https://{accountname}.blob.core.windows.net` |                                   | `storage account`      | `BlobServiceClient.GetBlobContainerClient(name: string)` | `New-AzStorageAccount`       | GloballyUnique, Rule7            |
| AD                   |                                               |                                   | `ad app`               | `new Application(name: string, ...)`                     | `New-AzADApplication`        | GloballyUnique, Rule8            |
| Microsoft Graph      | `https://graph.microsoft.com`                 | AD                                |                        |                                                          |                              |                                  |
| App Configuration    |                                               |                                   | `appconfig`            | `new ConfigurationStore(name: string, ...)`              | `New-AzAppConfiguration`     | GloballyUnique, Rule9            |
| Key Vault            | `https://{vaultname}.vault.azure.net`         |                                   | `keyvault`             | `new KeyVault(name: string, ...)`                        | `New-AzKeyVault`             | GloballyUnique, Rule10           |
| Managed Identities   |                                               |                                   | `identity`             | `new ManagedIdentity(name: string, ...)`                 | `New-AzUserAssignedIdentity` | GloballyUnique, Rule11           |
| Cache for Redis      |                                               |                                   | `redis`                | `new RedisCache(name: string, ...)`                      | `New-AzRedisCache`           | GloballyUnique, Rule12           |
| CDN                  |                                               |                                   | `cdn profile`          | `new CdnProfile(name: string, ...)`                      | `New-AzCdnProfile`           | GloballyUnique, Rule13           |
| Application Insights |                                               |                                   | `application-insights` | `new ApplicationInsights(name: string, ...)`             | `New-AzApplicationInsights`  | GloballyUnique, Rule14           |
| API Management       | `https://{servicename}.azure-api.net`         |                                   | `apim`                 | `new ApiManagementService(name: string, ...)`            | `New-AzApiManagement`        | GloballyUnique, Rule15           |
| Event Grid           |                                               |                                   | `eventgrid topic`      | `new EventGridTopic(name: string, ...)`                  | `New-AzEventGridTopic`       | GloballyUnique, Rule16           |
| Event Hub            |                                               |                                   | `eventhubs namespace`  | `new EventHubNamespace(name: string, ...)`               | `New-AzEventHubNamespace`    | GloballyUnique, Rule17           |
| Service Bus          |                                               |                                   | `servicebus namespace` | `new ServiceBusNamespace(name: string, ...)`             | `New-AzServiceBusNamespace`  | GloballyUnique, Rule18           |
| Queue Storage        |                                               | Storage Account                   | `storage queue`        | `QueueServiceClient.GetQueueClient(name: string)`        | `New-AzStorageQueue`         | GloballyUnique, Rule19           |

### Argument Rules

- **GloballyUnique**: Name must be unique within the Azure subscription.
- **ServicePlanAssoc**: Must be associated with an existing App Service Plan.
- **Rule3**: Registry name must be unique across Azure.
- **Rule4**: Container name must be unique within the resource group.
- **Rule5**: Must specify either CPU or memory requirements.
- **Rule6**: Account name must be globally unique.
- **Rule7**: Must be associated with an existing storage account.
- **Rule8**: Application name must be unique within the directory.
- **Rule9**: Configuration store name must be globally unique.
- **Rule10**: Vault name must be globally unique.
- **Rule11**: Identity name must be unique within the resource group.
- **Rule12**: Cache name must be unique within the resource group.
- **Rule13**: Profile name must be unique within the resource group.
- **Rule14**: Resource name must be unique within the resource group.
- **Rule15**: Service name must be globally unique.
- **Rule16**: Topic name must be unique within the resource group.
- **Rule17**: Namespace name must be unique within the Azure subscription.
- **Rule18**: Namespace name must be unique within the Azure subscription.
- **Rule19**: Queue name must be unique within the storage account.

This table is a high-level overview and may not cover all the nuances. Always refer to the official Azure documentation for the most accurate and up-to-date information.
