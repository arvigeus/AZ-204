# [Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/)

## [Introduction](https://learn.microsoft.com/en-us/azure/azure-functions/functions-overview)

Azure Functions, a serverless compute service, allows you to execute small code snippets in response to events or on a schedule, eliminating the need to manage servers. It triggers your code based on specific events and simplifies data handling. Typical use cases include processing file uploads, handling real-time data streams, performing machine learning tasks, running scheduled tasks, building scalable web APIs, orchestrating serverless workflows, responding to database changes, and establishing reliable message systems.

## [Azure Functions vs Azure Logic Apps vs WebJobs](https://docs.microsoft.com/en-us/azure/azure-functions/functions-compare-logic-apps-ms-flow-webjobs)

| Feature          | Azure Functions                                                                        | Azure Logic Apps                                                         | Azure WebJobs                                                                                                      |
| ---------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| Development      | Code-first approach                                                                    | Designer-first approach                                                  | Code-first approach                                                                                                |
| Monitoring       | Azure Application Insights                                                             | Azure portal and Azure Monitor logs                                      | Application Insights                                                                                               |
| Execution        | Can run in Azure or locally                                                            | Can run in Azure, locally, or on premises                                | Runs in the context of an App Service web app                                                                      |
| Pricing          | Pay-per-use                                                                            | Based on execution and connector usage                                   | Part of the App Service plan                                                                                       |
| Unique Strengths | Flexibility and cost-effectiveness, many supported languages, built on the WebJobs SDK | Extensive integration capabilities with a large collection of connectors | Ideal for tasks related to an existing App Service app and need more control over the code that listens for events |

## [Hosting Options](https://learn.microsoft.com/en-us/azure/azure-functions/functions-scale)

The hosting plan you choose determines the following behaviors:

- How your function app is scaled based on demand and how instances allocation is managed.
- The resources available to each function app instance.
  Support for advanced functionality, such as Azure Virtual Network connectivity.

Limitations:

- Direct migration to a Dedicated (App Service) plan isn't currently supported
- Migration isn't supported on Linux.

| Hosting Plan                                                                                               | Unique Features                                                                                                                                                                                         | Limitations                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [**Consumption**](https://learn.microsoft.com/en-us/azure/azure-functions/consumption-plan)                | - Default hosting plan.<br>- Pay only when your functions are running.<br>- Scales automatically (instances: 100 Linux, 200 Windows), even during periods of high load.                                 | - Does not support Docker containers.<br>- Maximum timeout duration is 10 minutes (unlimited for others).<br>- Does not support inbound private endpoints, virtual network integration, virtual network triggers, and hybrid connections ([source](https://learn.microsoft.com/en-us/azure/azure-functions/functions-networking-options)).<br>- Apps may scale to zero when idle (_cold startup_).<br>-Limited to 1.5 GB memory and one CPU per function app.<br>- Shared resources and simultaneous scaling.<br>- Does not support the following triggers: Table storage, RabbitMQ, Kafka, Notification Hubs |
| [**Premium**](https://learn.microsoft.com/en-us/azure/azure-functions/functions-premium-plan)              | - Automatically scales based on demand using pre-warmed workers, which run applications with no delay after being idle.<br>- Data is to be processed immediately.<br>- Runs on more powerful instances. | - At least one instance per plan must always be kept warm.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| [**Dedicated**](https://learn.microsoft.com/en-us/azure/azure-functions/dedicated-plan)                    | - Run your functions within an App Service plan at regular App Service plan rates.<br>- Best for long-running scenarios where Durable Functions can't be used.<br>- Predictable cost and scaling.       | - Manual/autoscale (10-20 instances).<br>- You pay the same as you would for other App Service resources, like web apps.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| [**ASE (App Service Environment)**](https://learn.microsoft.com/en-us/azure/app-service/environment/intro) | - Provides a fully isolated and dedicated environment for securely running App Service apps at high scale.                                                                                              | - There's a flat monthly rate for an ASE that pays for the infrastructure and doesn't change with the size of the ASE. There's also a cost per App Service plan vCPU.                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| [**Kubernetes**](https://learn.microsoft.com/en-us/azure/azure-functions/functions-kubernetes-keda)        | - Provides a fully isolated and dedicated environment running on top of the Kubernetes platform.<br>- You pay only the costs of your Kubernetes cluster; no additional billing for Functions.           | - Depends on the configuration of the Kubernetes cluster.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |

The _scale controller_ adjusts resources based on event rates and trigger types. It uses heuristics for each trigger type (for Queue storage trigger, it scales based on the queue length and the age of the oldest queue message). The number of host instances can be scaled to zero when no functions are running (_cold start_).

```ps
az functionapp plan create
    --name
    --resource-group
    --sku # F1(Free), D1(Shared), B1(Basic Small), B2(Basic Medium), B3(Basic Large), S1(Standard Small), P1V2(Premium V2 Small), I1 (Isolated Small), I2 (Isolated Medium), I3 (Isolated Large), K1 (Kubernetes)
    [--is-linux {false, true}]
    [--location]
    [--max-burst]
    [--min-instances]
    [--tags]
    [--zone-redundant] # Cannot be changed after plan creation. Minimum instance count is 3.
# az functionapp plan create -g MyResourceGroup -n MyPlan --min-instances 1 --max-burst 10 --sku EP1

az functionapp plan update
    [--add]
    [--force-string]
    [--ids]
    [--max-burst]
    [--min-instances]
    [--name]
    [--remove]
    [--resource-group]
    [--set]
    [--sku]
    [--subscription]
# az functionapp plan update -g MyResourceGroup -n MyPlan --max-burst 20 --sku EP2

# Get a list of all Consumption plans in your resource group
az functionapp plan list --resource-group <MY_RESOURCE_GROUP> --query "[?sku.family=='Y'].{PlanName:name,Sites:numberOfSites}" -o table

# Get your hosting plan type
appServicePlanId=$(az functionapp show --name $functionApp --resource-group $resourceGroup --query appServicePlanId --output tsv)
az appservice plan list --query "[?id=='$appServicePlanId'].sku.tier" --output tsv

# Get a list of all Premium plans in your resource group
az functionapp plan list --resource-group <MY_RESOURCE_GROUP> --query "[?sku.family=='EP'].{PlanName:name,Sites:numberOfSites}" -o table

```

## [Storage Considerations](https://learn.microsoft.com/en-us/azure/azure-functions/storage-considerations?tabs=azure-cli)

- Function code and configuration files are stored in Azure Files in the linked storage account. Deleting this account will result in the loss of these files.
- Azure Functions requires an Azure Storage account for services like Azure Blob Storage, Azure Files, Azure Queue Storage, and Azure Table Storage.
- Storage accounts used by function apps must support Blob, Queue, and Table storage.
- The storage account should be in the same region as the function app for performance optimization.
- Each function app should use a separate storage account for best performance.
- Azure Storage encrypts all data in a storage account at rest.
- Functions use a host ID value to uniquely identify a function app in stored artifacts. Host ID collisions can occur and should be avoided.

## [Configuration](https://learn.microsoft.com/en-us/azure/azure-functions/functions-how-to-use-azure-function-app-settings)

### [host.json](https://learn.microsoft.com/en-us/azure/azure-functions/functions-host-json)

- `functionTimeout`: Default: 5 min for Consumption, 30 for rest.
- `logging.applicationInsights`
- `aggregator` - Specifies how many function invocations are aggregated when calculating metrics for Application Insights.

### [function.json](https://github.com/Azure/azure-functions-host/wiki/function.json)

Auto generated for compiled languages.

- For triggers, the direction is always `in`
- Input and output bindings use `in` and `out`, or `inout` in some cases.

```jsonc
{
  "bindings": [
    {
      "type": "queueTrigger",
      "direction": "in",
      "name": "order",
      "queueName": "myqueue-items",
      "connection": "MY_STORAGE_ACCT_APP_SETTING"
    },
    {
      "type": "table",
      "direction": "out",
      "name": "$return",
      "tableName": "outTable",
      "connection": "MY_TABLE_STORAGE_ACCT_APP_SETTING"
    }
  ]
}
```

### Configuration via CLI

Setting properties: `az resource update --resource-type Microsoft.Web/sites -g <RESOURCE_GROUP> -n <FUNCTION_APP-NAME>/config/web --set properties.XXX`, where `XXX` is the name of the property.

- `functionAppScaleLimit`: 0 or null for unrestricted, or a valid value between 1 and the app maximum.

### [local.settings.json](https://learn.microsoft.com/en-us/azure/azure-functions/functions-develop-local) (code and test locally)

```ts
type LocalSettings = {
  // When true, all values are encrypted with a local machine key.
  IsEncrypted: boolean; // false

  // Correspond to application settings in your function app in Azure.
  Values: {
    [key: string]: string;
  };

  // Customize the Functions host process
  Host: {
    LocalHttpPort: number;

    CORS: string; // supports wildcard value (*)

    // When set to true, allows withCredentials requests
    CORSCredentials: boolean;
  };

  // Used by frameworks that get connection strings from the ConnectionStrings section of a config file
   */
  ConnectionStrings: {
    [key: string]: string;
  };
};
```

## [Triggers and Bindings](https://learn.microsoft.com/en-us/azure/azure-functions/functions-triggers-bindings?tabs=csharp)

Triggers cause a function to run. A trigger defines how a function is invoked and a function must have exactly one trigger. Binding to a function is a way of declaratively connecting another resource to the function; bindings may be connected as _input bindings_ (read), _output bindings_ (write), or both.

Cannot be trigger: _Table Storage_  
Cannot be input binding: _Event Grid_, _Event Hubs_, _HTTP & webhooks_, _IoT Hub_, _Queue storage_, _SendGrid_, _Service Bus_, _Timer_  
Cannot be output binding: _IoT Hub_, _Timer_  
Available by default ([others need to be installed as separate package](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-register)): _Timer_, _HTTP & webhooks_  
Not supported on Consumption plan ([requires runtime-driven triggers](https://learn.microsoft.com/en-us/azure/azure-functions/functions-networking-options?tabs=azure-cli#premium-plan-with-virtual-network-triggers)): _RabbitMQ_, _Kafka_

### Code samples

```cs
////////////////////////////////////
// Blob
////////////////////////////////////

[FunctionName("BlobTrigger")]
public static void RunBlob([BlobTrigger("container/{name}")] string myBlob, string name, ILogger log)
{
    log.LogInformation($"Blob trigger function processed blob\n Name:{name} \n Data: {myBlob}");
}


[FunctionName("BlobStorageInputBinding")]
public static void RunBlobStorageInputBinding(
    [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = "blob/{name}")] HttpRequest req, string name,
    [Blob("container/{name}", FileAccess.Read)] Stream myBlob,
    ILogger log)
{
    // Reads the content from the blob storage for further processing
    using StreamReader reader = new StreamReader(myBlob);
    string content = reader.ReadToEnd();
    log.LogInformation($"Blob Content: {content}");
}

// [CosmosDBTrigger(...)] IReadOnlyList<Document> input,
// [Blob("container/{input[0].Id}", FileAccess.Read)] Stream myBlob

[FunctionName("BlobStorageOutputBinding")]
public static async Task<IActionResult> RunBlobStorageOutputBinding(
    [HttpTrigger(AuthorizationLevel.Function, "post", Route = "blob/{name}")] HttpRequest req, string name,
    [Blob("container/{name}", FileAccess.Write)] Stream myBlob,
    ILogger log)
{
    // Writes the request body to a blob
    string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
    using StreamWriter writer = new StreamWriter(myBlob);
    writer.Write(requestBody);
    log.LogInformation($"Blob written: {name}");
    return new OkResult();
}

////////////////////////////////////
// CosmosDB
////////////////////////////////////

[FunctionName("CosmosDBTrigger")]
public static void RunCosmos([CosmosDBTrigger(
    databaseName: "database",
    collectionName: "collection",
    ConnectionStringSetting = "CosmosDBConnection",
    LeaseCollectionName = "leases")]IReadOnlyList<Document> input, ILogger log)
{
    if (input != null && input.Count > 0)
    {
        log.LogInformation("Documents modified " + input.Count);
        log.LogInformation("First document Id " + input[0].Id);
    }
}

[FunctionName("CosmosDBInputBinding")]
public static void RunCosmosDBInputBinding(
    [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = "doc/{id}")] HttpRequest req, string id,
    [CosmosDB(databaseName:"myDb", collectionName:"collection", Id = "{id}", PartitionKey ="{partitionKey}")] dynamic document,
    ILogger log)
{
    // Retrieves a specific document from Cosmos DB for further processing
    log.LogInformation($"Document Content: {document}");
}

[FunctionName("CosmosDBOutputBinding")]
public static IActionResult RunCosmosDBOutputBinding(
    [HttpTrigger(AuthorizationLevel.Function, "post", Route = "doc/{id}")] HttpRequest req, string id,
    [CosmosDB(databaseName:"myDb", collectionName:"collection", CreateIfNotExists =true)] out dynamic document,
    ILogger log)
{
    // Writes a new document to Cosmos DB
    string requestBody = new StreamReader(req.Body).ReadToEnd();
    document = new { id = id, content = requestBody };
    log.LogInformation($"Document written: {id}");
    return new OkResult();
}

////////////////////////////////////
// EventGrid
////////////////////////////////////

[FunctionName("EventGridTrigger")]
public static async Task RunEventGrid([EventGridTrigger]EventGridEvent eventGridEvent, ILogger log)
{
    log.LogInformation(eventGridEvent.Data.ToString());
}

// No Input binding

[FunctionName("EventGridOutputBinding")]
[return: EventGrid(TopicEndpointUri = "EventGridTopicUriAppSetting", TopicKeySetting = "EventGridTopicKeyAppSetting")]
public static async Task<EventGridEvent> RunEventGridOutputBinding(
    [HttpTrigger(AuthorizationLevel.Function, "post", Route = "event/{subject}")] HttpRequest req, string subject,
    ILogger log)
{
    // Sends an event to Event Grid Topic
    string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
    var eventGridEvent = new EventGridEvent(Guid.NewGuid().ToString(), subject, requestBody, "MyEventType", DateTime.UtcNow, "1.0");
    log.LogInformation($"Event sent: {subject}");
    return eventGridEvent;
}

// Output with out eventGridEvent
[FunctionName("EventGridOutputBinding")]
[return: EventGrid(TopicEndpointUri = "EventGridTopicUriAppSetting", TopicKeySetting = "EventGridTopicKeyAppSetting")]
public static async void RunEventGridOutputBinding(
    [HttpTrigger(AuthorizationLevel.Function, "post", Route = "event/{subject}")] HttpRequest req, string subject,
    EventGrid(TopicEndpointUri = "EventGridTopicUriAppSetting", TopicKeySetting = "EventGridTopicKeyAppSetting") out eventGridEvent
    ILogger log)
{
    // Sends an event to Event Grid Topic
    string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
    eventGridEvent = new EventGridEvent(Guid.NewGuid().ToString(), subject, requestBody, "MyEventType", DateTime.UtcNow, "1.0");
    log.LogInformation($"Event sent: {subject}");
}

// Output with out batch processing
[FunctionName("EventGridOutputBinding")]
public static async Task RunEventGridOutputBinding(
    [HttpTrigger(AuthorizationLevel.Function, "post", Route = "event/{subject}")] HttpRequest req, string subject,
    [EventGrid(TopicEndpointUri = "EventGridTopicUriAppSetting", TopicKeySetting = "EventGridTopicKeyAppSetting")]IAsyncCollector<EventGridEvent> outputEvents,
    ILogger log)
{
    // Sends an event to Event Grid Topic
    string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
    var myEvent = new EventGridEvent(Guid.NewGuid().ToString(), subject, requestBody, "MyEventType", DateTime.UtcNow, "1.0");
    await outputEvents.AddAsync(myEvent);
    log.LogInformation($"Event sent: {subject}");
}

////////////////////////////////////
// EventHub
////////////////////////////////////

[FunctionName("EventHubTrigger")]
public static async Task RunEventHub([EventHubTrigger("hub", Connection = "EventHubConnectionAppSetting")] EventData[] events, ILogger log)
{
    foreach (EventData eventData in events)
    {
        string messageBody = Encoding.UTF8.GetString(eventData.Body.Array, eventData.Body.Offset, eventData.Body.Count);
        log.LogInformation($"Event Hub trigger function processed a message: {messageBody}");
    }
}

// No Input binding

[FunctionName("EventHubOutputBinding")]
[return: EventHub("outputEventHubMessage", Connection = "EventHubConnectionAppSetting")]
public static async string RunEventHubOutputBinding(
    [HttpTrigger(AuthorizationLevel.Function, "post", Route = "event/{message}")] HttpRequest req, string message
    ILogger log)
{
    // Sends an event to Event Hub
    log.LogInformation($"Event sent: {message}");
    return message;
}

// Output with out batch processing
[FunctionName("EventHubOutputBinding")]
public static async Task RunEventHubOutputBinding(
    [HttpTrigger(AuthorizationLevel.Function, "post", Route = "event/{message}")] HttpRequest req, string message,
    [EventHub("outputEventHubMessage", Connection = "EventHubConnectionAppSetting")] IAsyncCollector<string> outputEvents,
    ILogger log)
{
    // Sends an event to Event Hub
    await outputEvents.AddAsync(message);
    log.LogInformation($"Event sent: {message}");
}

////////////////////////////////////
// IoTHub
////////////////////////////////////

[FunctionName("IoTHubTrigger")]
public static async Task RunIoTHub([IoTHubTrigger("messages/events", Connection = "IoTHubConnectionAppSetting")]EventData message, ILogger log)
{
    log.LogInformation($"IoT Hub trigger function processed a message: {Encoding.UTF8.GetString(message.Body.Array)}");
}

// No Input binding

////////////////////////////////////
// Http
////////////////////////////////////

// Accessible via GET https://<APP_NAME>.azurewebsites.net/api/<FUNCTION_NAME>
// You can specify a custom route by setting Route to a string.
// For example, Route = "products/{id}" would make the function accessible at https://<APP_NAME>.azurewebsites.net/api/<FUNCTION_NAME>/products/{id}.

// Request length limit: 100 MB
// URL length limit: 4 KB
// Timeout: 230s (502 error)

[FunctionName("HttpTriggerFunction")]
public static async Task<HttpResponseMessage> Run([HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequestMessage req, ILogger log)
{
    log.LogInformation("C# HTTP trigger function processed a request.");
    return req.CreateResponse(HttpStatusCode.OK, "Hello from Azure Functions!");
}

// No Input binding

// No Output binding

////////////////////////////////////
// Queue
////////////////////////////////////

[FunctionName("QueueTrigger")]
public static void RunQueue([QueueTrigger("queue", Connection = "StorageConnectionAppSetting")]string myQueueItem, ILogger log)
{
    log.LogInformation($"Queue trigger function processed: {myQueueItem}");
}

// No Input binding

[FunctionName("QueueStorageOutputBinding")]
[return: Queue("queue")]
public static string RunQueueStorageOutputBinding(
    [HttpTrigger(AuthorizationLevel.Function, "post", Route = "queue/{message}")] HttpRequest req, string message
    ILogger log)
{
    // Sends a message to Azure Queue Storage
    log.LogInformation($"Message sent: {message}");
    return message;
}

// Alt: Write to a storage queue and an HTTP success message.
public class MultiResponse
{
    [QueueOutput("queue",Connection = "AzureWebJobsStorage")]
    public string[] Messages { get; set; }
    public HttpResponseData HttpResponse { get; set; }
}
[Function("HttpExample")]
public static MultiResponse Run(
    [HttpTrigger(AuthorizationLevel.Function, "post", Route = "queue/{message}")] HttpRequestData req,
    string message,
    FunctionContext executionContext)
{
    var logger = executionContext.GetLogger("HttpExample");
    logger.LogInformation("C# HTTP trigger function processed a request.");

    var response = req.CreateResponse(HttpStatusCode.OK);
    response.Headers.Add("Content-Type", "text/plain; charset=utf-8");
    response.WriteString(message);

    // Return a response to both HTTP trigger and storage output binding.
    return new MultiResponse()
    {
        // Write a single message.
        Messages = new string[] { message },
        HttpResponse = response
    };
}

////////////////////////////////////
// ServiceBus
////////////////////////////////////

[FunctionName("ServiceBusTrigger")]
public static async Task RunServiceBus([ServiceBusTrigger("queue", Connection = "ServiceBusConnectionAppSetting")] string myQueueItem, ILogger log)
{
    log.LogInformation($"Service Bus Queue trigger function processed message: {myQueueItem}");
}

// No Input binding

[FunctionName("ServiceBusOutputBinding")]
[return: ServiceBus("queue", Connection = "ServiceBusConnectionAppSetting")]
public static string RunServiceBusOutputBinding(
    [HttpTrigger(AuthorizationLevel.Function, "post", Route = "servicebus/{message}")] HttpRequest req, string message,
    ILogger log)
{
    // Sends a message to Service Bus Queue
    log.LogInformation($"Message sent: {message}");
    return message;
}

////////////////////////////////////
// Timer
////////////////////////////////////

[FunctionName("TimerTriggerFunction")]
public static void Run(
    // The format with 6 fields is {second} {minute} {hour} {day} {month} {day-of-week}.
    // The format with 5 fields is {minute} {hour} {day} {month} {day-of-week}, and it assumes that the seconds field is 0.
    // Each field can have a specific value, a comma-separated list of values, a range of values, or a step value.
    // The "*" character means any value, "/" is used to specify step values, and "-" is used for ranges.
    // For example, "*/5 * * * *" means "every 5 minutes", and "0 9-17 * * MON-FRI" means "every hour from 9 AM to 5 PM on weekdays".
    [TimerTrigger("0 */5 * * * *")] TimerInfo myTimer, ILogger log)
{
    log.LogInformation($"C# Timer trigger function executed at: {DateTime.Now}");
}

// No Input binding

// No Output bindong

////////////////////////////////////
// TableStorage
////////////////////////////////////

// No Trigger

[FunctionName("TableStorageInputBinding")]
public static void RunTableStorageInputBinding(
    [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = "table/{partitionKey}/{rowKey}")] HttpRequest req, string partitionKey, string rowKey,
    [Table("MyTable", "{partitionKey}", "{rowKey}")] MyTableEntity entity,
    ILogger log)
{
    // Retrieves an entity from Azure Table Storage for further processing
    log.LogInformation($"Table Entity: {entity.PartitionKey} - {entity.RowKey}");
}

[FunctionName("TableStorageInputBinding")]
public static void RunTableStorageInputBinding(
    [CosmosDBTrigger(
        databaseName: "ToDoItems",
        collectionName: "Items",
        ConnectionStringSetting = "CosmosDBConnection",
        LeaseCollectionName = "leases")]
    IReadOnlyList<Document> input,
    [Table("MyTable", "{input[0].Id}", "{input[0].PartitionKey}")] MyTableEntity entity,
    ILogger log)
{
    // Retrieves an entity from Azure Table Storage for further processing
    log.LogInformation($"Table Entity: {entity.PartitionKey} - {entity.RowKey}");
}

// [CosmosDBTrigger(...)] IReadOnlyList<Document> input,
// [Table("MyTable", "{input[0].Id}", "{input[0].PartitionKey}")] MyTableEntity entity

[FunctionName("TableStorageOutputBinding")]
[return: Table("MyTable")]
public static MyTableEntity RunTableStorageOutputBinding(
    [HttpTrigger(AuthorizationLevel.Function, "post", Route = "table/{partitionKey}/{rowKey}")] HttpRequest req, string partitionKey, string rowKey,
    ILogger log)
{
    // Writes an entity to Azure Table Storage
    string requestBody = new StreamReader(req.Body).ReadToEnd();
    entity = new MyTableEntity { PartitionKey = partitionKey, RowKey = rowKey, Content = requestBody };
    log.LogInformation($"Entity written: {partitionKey} - {rowKey}");
    return entity
}
```

## Working with Azure Functions

```ps
# List the existing application settings
az functionapp config appsettings list --name <FUNCTION_APP_NAME> --resource-group <RESOURCE_GROUP_NAME>

# Add or update an application setting
az functionapp config appsettings set --settings CUSTOM_FUNCTION_APP_SETTING=12345 --name <FUNCTION_APP_NAME> --resource-group <RESOURCE_GROUP_NAME>

# Create a new function app (Consumption)
az functionapp create --resource-group <MY_RESOURCE_GROUP> --name <NEW_CONSUMPTION_APP_NAME> --consumption-plan-location <REGION> --runtime dotnet --functions-version 3 --storage-account <STORAGE_NAME>

# Get the default (host) key that can be used to access any HTTP triggered function in the function app
subName='<SUBSCRIPTION_ID>'
resGroup=AzureFunctionsContainers-rg
appName=glengagtestdocker
path=/subscriptions/$subName/resourceGroups/$resGroup/providers/Microsoft.Web/sites/$appName/host/default/listKeys?api-version=2018-11-01
az rest --method POST --uri $path --query functionKeys.default --output tsv
```

## [Security](https://learn.microsoft.com/en-us/azure/azure-functions/security-concepts)

### [Authorization level](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-http-webhook-trigger#http-auth)

Indicates the kind of authorization key that's required to access the function endpoint, via `code` param: `https://<APP_NAME>.azurewebsites.net/api/<FUNCTION_NAME>?code=<API_KEY>`.

- **Anonymous**: No API key is required.
- **Function** (default): A function-specific or host-wide API key is required.
- **Admin**: The master key is required.

#### Access scopes

- **Function** keys grant access only to the specific function they're defined under.
- **Host** keys allow access to all functions within the function app.
  - **master**. provides administrative access to the runtime REST APIs. This key can't be revoked.

Each key is named, with a `default` key at both levels. If a function and a host key share a name, the function key takes precedence.

#### [Working with access keys](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-http-webhook-trigger#obtaining-keys)

Base URL: `https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Web/sites/{name}/{scope}/{host-or-function-name}/{action}?api-version=2022-03-01`

Scope can be `functions` or `host`. For slots add `/slots/{slot-name}/` before scope.

List keys: `POST`, action: `listkeys`  
Create or update keys: `PUT`, action: `keys/{keyName}`
Delete or revoke keys: `DELETE`, action: `/keys/{keyName}`

### Client identities

`ClaimsPrincipal identities = req.HttpContext.User;` available via `X-MS-CLIENT-PRINCIPAL` [header](https://learn.microsoft.com/en-us/azure/app-service/configure-authentication-user-identities#access-user-claims-in-app-code).

### CORS

```ps
# Add a domain to the allowed origins list
az functionapp cors add --allowed-origins https://contoso.com --name <FUNCTION_APP_NAME> --resource-group <RESOURCE_GROUP_NAME>

# List the current allowed origins
az functionapp cors show
```

## [Monitoring](https://learn.microsoft.com/en-us/azure/azure-functions/functions-monitoring)

Automatic collection of Performance Counters isn't supported when running on Linux.

Application Insights are configured in [host.json](https://learn.microsoft.com/en-us/azure/azure-functions/functions-host-json#applicationinsights) (`logging.applicationInsights` and `aggregator`)

```kusto
# Monitor all functions app logs
FunctionAppLogs
| order by TimeGenerated desc

# Select fields
FunctionAppLogs
| project TimeGenerated, HostInstanceId, Message, _ResourceId
| order by TimeGenerated desc

# Monitor a specific functions app logs
FunctionAppLogs
| where FunctionName == "<Function name>"

# Monitor exceptions on a specific functions app logs
FunctionAppLogs
| where ExceptionDetails != ""
| where FunctionName == "<Function name>"
| order by TimeGenerated asc
```

### [Configure monitorung](https://learn.microsoft.com/en-us/azure/azure-functions/configure-monitoring)

TODO

## CLI

- [az functionapp plan create](https://learn.microsoft.com/en-us/cli/azure/functionapp/plan?view=azure-cli-latest#az-functionapp-plan-create)
- [az functionapp plan update](https://learn.microsoft.com/en-us/cli/azure/functionapp/plan?view=azure-cli-latest#az-functionapp-plan-update)
- [az functionapp plan list](https://learn.microsoft.com/en-us/cli/azure/functionapp/plan?view=azure-cli-latest#az-functionapp-plan-list)
- [az appservice plan list](https://learn.microsoft.com/en-us/cli/azure/appservice/plan?view=azure-cli-latest#az-appservice-plan-list)
- [az functionapp show](https://learn.microsoft.com/en-us/cli/azure/functionapp?view=azure-cli-latest#az-functionapp-show)
- [az functionapp create](https://learn.microsoft.com/en-us/cli/azure/functionapp?view=azure-cli-latest#az-functionapp-create)
- [az functionapp config appsettings](https://learn.microsoft.com/en-us/cli/azure/functionapp/config/appsettings?view=azure-cli-latest)
- [az functionapp cors add](https://learn.microsoft.com/en-us/cli/azure/functionapp/cors?view=azure-cli-latest#az-functionapp-cors-add)
- [az functionapp cors show](https://learn.microsoft.com/en-us/cli/azure/functionapp/cors?view=azure-cli-latest#az-functionapp-cors-show)
- [az resource update](https://learn.microsoft.com/en-us/cli/azure/resource?view=azure-cli-latest#az-resource-update)
- [az rest](https://learn.microsoft.com/en-us/cli/azure/reference-index?view=azure-cli-latest#az-rest)
