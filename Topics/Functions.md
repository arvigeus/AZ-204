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

Consumption is the lowest plan that supports scaling and offer event based scheduling behavior.

Limitations:

- Direct migration to a Dedicated (App Service) plan isn't currently supported
- Migration isn't supported on Linux.
- HTTP triggers get new instances at most every second. Non-HTTP triggers get them at most every 30 seconds.

### Azure Functions Hosting Plans Comparison

| Hosting Plan                                                                                           | Pricing Model                                                  | Ideal For                                                                       | Key Features                                                                   | Limitations                                                                                              |
| ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| [Consumption](https://learn.microsoft.com/en-us/azure/azure-functions/consumption-plan)                | Serverless<br>Pay only for the time your functions are running | Variable or unpredictable workloads                                             | - Pay-per-use<br>- Auto-scaling<br>- Max instances: 100 (Linux), 200 (Windows) | - No Docker support<br>- 5-10 min timeout<br>- No VNET Integration<br>- May scale to zero (_cold start_) |
| [Premium](https://learn.microsoft.com/en-us/azure/azure-functions/functions-premium-plan)              | Hybrid<br>Mix of predictable and variable costs                | Production apps requiring robust scaling (_no cold start_) and VNET Integration | - Pre-warmed instances<br>- More powerful hardware<br>- VNET Integration       | - Must keep one instance warm<br>- Higher cost                                                           |
| [Dedicated](https://learn.microsoft.com/en-us/azure/azure-functions/dedicated-plan)                    | Predictable                                                    | Long-running tasks and full control over environment                            | - Fixed monthly cost<br>- Manual/Auto-scaling (10-20 instances)                | - Higher cost if not continuously running<br>- Manual scaling required                                   |
| [ASE (App Service Environment)](https://learn.microsoft.com/en-us/azure/app-service/environment/intro) | Predictable + Flat                                             | Maximum isolation and control                                                   | - Fully isolated environment<br>- High scale                                   | - Flat monthly rate<br>- Additional cost per vCPU                                                        |
| [Kubernetes](https://learn.microsoft.com/en-us/azure/azure-functions/functions-kubernetes-keda)        | Cluster-Based Costs                                            | Customizable, isolated environment                                              | - Runs on Kubernetes<br>- Highly customizable                                  | - Requires Kubernetes expertise<br>- Variable costs based on cluster                                     |

The _scale controller_ adjusts resources based on event rates and trigger types. It uses heuristics for each trigger type (for Queue storage trigger, it scales based on the queue length and the age of the oldest queue message). The number of host instances can be scaled to zero when no functions are running (_cold start_).

```sh
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
# az functionapp plan create -g $resourceGroup -n MyPlan --min-instances 1 --max-burst 10 --sku EP1

# Get a list of all Consumption plans in your resource group
az functionapp plan list --resource-group $resourceGroup --query "[?sku.family=='Y'].{PlanName:name,Sites:numberOfSites}" -o table

# Get your hosting plan type
appServicePlanId=$(az functionapp show --name $functionApp --resource-group $resourceGroup --query appServicePlanId --output tsv)
az appservice plan list --query "[?id=='$appServicePlanId'].sku.tier" --output tsv

# Get a list of all Premium plans in your resource group
az functionapp plan list --resource-group $resourceGroup --query "[?sku.family=='EP'].{PlanName:name,Sites:numberOfSites}" -o table
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
- `extensions.http.dynamicThrottlesEnabled`: Enabled by default for Consumption only. Throttles on high resource usage.
- `extensions.blobsmaxDegreeOfParallelism`: concurrent invocations allowed for all blob-triggered functions (min: 1, default: 8)
- `extensions.cosmosDB.connectionMode`: _Gateway_ (default) or _Direct_. _Gateway_ is preferable for _Consumption_ plan due to connections limit. _Direct_ has better performance.
- `extensions.cosmosDB.userAgentSuffix`: Appends the given string to all service requests from the trigger or binding, enhancing tracking in Azure Monitor by function app and User Agent filtering.

### [function.json](https://github.com/Azure/azure-functions-host/wiki/function.json)

Auto generated for compiled languages.  
For scripting languages, like `C# Script`, you must provide the config file yourself.

- For triggers, the direction is always `in`
- Input and output bindings use `in` and `out`, or `inout` in some cases.
- `connection`: refers to an environment variable that holds the service connection string. **The property does not contain the actual connection string!**

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

Setting properties: `az resource update --resource-type Microsoft.Web/sites -g $resourceGroup -n <FUNCTION_APP-NAME>/config/web --set properties.XXX`, where `XXX` is the name of the property.

- `functionAppScaleLimit`: 0 or null for unrestricted, or a valid value between 1 and the app maximum (200 for Consumption, 100 for premium).

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
  ConnectionStrings: {
    [key: string]: string;
  };
};
```

## [Triggers and Bindings](https://learn.microsoft.com/en-us/azure/azure-functions/functions-triggers-bindings?tabs=csharp)

Triggers cause a function to run. A trigger defines how a function is invoked and a function must have exactly one trigger. Binding to a function is a way of declaratively connecting another resource to the function; bindings may be connected as _input bindings_ (read), _output bindings_ (write), or both.

Triggers and bindings must be defined in C# (also supported: Python, Java, TypeScript, PS)

Cannot be trigger: _Table Storage_  
Cannot be input binding: _Event Grid_, _Event Hubs_, _HTTP & webhooks_, _IoT Hub_, _Queue storage_, _SendGrid_, _Service Bus_, _Timer_  
Cannot be output binding: _IoT Hub_, _Timer_  
Available by default ([others need to be installed as separate package](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-register)): _Timer_, _HTTP & webhooks_  
Not supported on Consumption plan ([requires runtime-driven triggers](https://learn.microsoft.com/en-us/azure/azure-functions/functions-networking-options?tabs=azure-cli#premium-plan-with-virtual-network-triggers)): _RabbitMQ_, _Kafka_

### Triggers and Bindings Gist

```cs
// https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-http-webhook
// Set Route to a string like "products/{id}" to create a custom URL for the function. This makes it accessible at https://<APP_NAME>.azurewebsites.net/api/<FUNCTION_NAME>/products/{id}
[HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = "blob/{name}")] HttpRequest req, string name;
[HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequestMessage req; // return req.CreateResponse(HttpStatusCode.OK, string);

// https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-storage-blob
[BlobTrigger("container/{name}")] string myBlob, string name;
[Blob("container/{name}", FileAccess.Read)] Stream myBlob; // or BlobContainerCLient, or BlobCLient
[Blob("container/{name}", FileAccess.Write)] Stream myBlob;
[Blob("container/{name}.jpg", FileAccess.Read)] Stream myBlob; // Wildcard in Blob Name: a jpg file
[BlobOutput("test-samples-output/{name}-output.txt")]; // return obj;

// https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-cosmosdb-v2
[CosmosDBTrigger(
            databaseName: "databaseName",
            containerName: "containerName",
            Connection = "CosmosDBConnectionSetting",
            LeaseContainerName = "leases",
            CreateLeaseContainerIfNotExists = true)]IReadOnlyList<ToDoItem> input;
[CosmosDB(databaseName:"myDb", collectionName:"collection", Id = "{id}", PartitionKey ="{partitionKey}")] dynamic document; // input
[CosmosDB(databaseName:"myDb", collectionName:"collection", CreateIfNotExists = true)] out dynamic document; // output

// https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-event-grid
[EventGridTrigger]EventGridEvent ev; // ev.Data
// No Input binding
[return: EventGrid(TopicEndpointUri = "EventGridTopicUriAppSetting", TopicKeySetting = "EventGridTopicKeyAppSetting")] // return new EventGridEvent(...); or new CloudEvent(...)
[EventGrid(TopicEndpointUri = "EventGridTopicUriAppSetting", TopicKeySetting = "EventGridTopicKeyAppSetting")] out eventGridEvent;
[EventGrid(TopicEndpointUri = "EventGridTopicUriAppSetting", TopicKeySetting = "EventGridTopicKeyAppSetting")]IAsyncCollector<EventGridEvent> outputEvents; // (batch processing): outputEvents.AddAsync(myEvent)

// https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-event-hubs
[EventHubTrigger("hub", Connection = "EventHubConnectionAppSetting")] EventData[] events; // var messageBody = Encoding.UTF8.GetString(eventData.Body.Array, eventData.Body.Offset, eventData.Body.Count);
// No Input binding
[return: EventHub("outputEventHubMessage", Connection = "EventHubConnectionAppSetting")] // return string
[EventHub("outputEventHubMessage", Connection = "EventHubConnectionAppSetting")] IAsyncCollector<string> outputEvents; // (batch processing): outputEvents.AddAsync(string)

// https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-event-iot
[IoTHubTrigger("messages/events", Connection = "IoTHubConnectionAppSetting")]EventData message; // Encoding.UTF8.GetString(message.Body.Array)

// https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-storage-queue
[QueueTrigger("queue", Connection = "StorageConnectionAppSetting")]string myQueueItem;
// No Input binding
[return: Queue("queue")] // return string

// https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-service-bus
[ServiceBusTrigger("queue", Connection = "ServiceBusConnectionAppSetting")] string myQueueItem;
// No Input binding
[return: ServiceBus("queue", Connection = "ServiceBusConnectionAppSetting")] // return string


// https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-timer
// The 6-field format for cron jobs is `{second} {minute} {hour} {day} {month} {day-of-week}`. The 5-field format omits the `second` and starts with `{minute}`.
// - Specific value: `5` (exactly the 5th minute)
// - List: `5,10` (5th and 10th minute)
// - Range: `9-17` (from 9 to 17)
// - Step: `*/5` (every 5 units)
// - Any value: `*` (every unit)
// NOTE: Day of week: MON is 1, Sunday is 0 or 7; Day and Month start from 1
// Examples: `*/5 * * * *`: Every 5 minutes,; `0 9-17 * * MON-FRI`: 9 AM to 5 PM on weekdays.
[TimerTrigger("0 */5 * * * *")] TimerInfo myTimer;
// - `WEBSITE_TIME_ZONE` and `TZ` are not currently supported on the Linux Consumption plan.
// - RunOnStartup is not recommended for production (messes up schedule). Schedule, RunOnStartup and UseMonitor can be set in local.settings.json > Values

// https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-cache
[RedisPubSubTrigger("redisConnectionString", "pubsubTest")] string message; // PubSub Not supported on Consumption Plan
[RedisListTrigger("Redis", "listTest")] string entry;
[RedisStreamTrigger("Redis", "streamTest")] string entry;
```

## Working with Azure Functions

```sh
# List the existing application settings
az functionapp config appsettings list --name $name --resource-group $resourceGroup

# Add or update an application setting
az functionapp config appsettings set --settings CUSTOM_FUNCTION_APP_SETTING=12345 --name $name --resource-group $resourceGroup

# Create a new function app (Consumption)
az functionapp create --resource-group $resourceGroup --name $consumptionFunctionName --consumption-plan-location $regionName --runtime dotnet --functions-version 3 --storage-account $storageName

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

### [Client identities](https://learn.microsoft.com/en-us/azure/app-service/overview-managed-identity#rest-endpoint-reference)

`ClaimsPrincipal identity = req.HttpContext.User;` available via `X-MS-CLIENT-PRINCIPAL` [header](https://learn.microsoft.com/en-us/azure/app-service/configure-authentication-user-identities#access-user-claims-in-app-code).

### CORS

```sh
# Add a domain to the allowed origins list
az functionapp cors add --allowed-origins https://contoso.com --name $name --resource-group $resourceGroup

# List the current allowed origins
az functionapp cors show
```

## [Monitoring](https://learn.microsoft.com/en-us/azure/azure-functions/functions-monitoring)

Automatic collection of Performance Counters isn't supported when running on Linux.

## [Enable Application Insights](https://learn.microsoft.com/en-us/azure/azure-functions/configure-monitoring?tabs=v2#enable-application-insights-integration)

Enabled by default for new functions (created in the same or nearest region to your function app), but it may have to be manually enabled for old functions.

To send data, you need the key named `APPINSIGHTS_INSTRUMENTATIONKEY`. `ILogger` is used (not `TelemetryClient`!). Azure Functions use [Adaptive sampling](./Application%20Insights.md).

Application Insights are configured in [host.json](https://learn.microsoft.com/en-us/azure/azure-functions/functions-host-json#applicationinsights) (`logging.applicationInsights` and `aggregator`)

### [Configure monitorung](https://learn.microsoft.com/en-us/azure/azure-functions/configure-monitoring)

Enable SQL query:

```json
{
  "logging": {
    "applicationInsights": {
      "enableDependencyTracking": true,
      "dependencyTrackingOptions": {
        "enableSqlCommandTextInstrumentation": true
      }
    }
  }
}
```

Turn on verbose logging from the scale controller to Application Insights:

```sh
az functionapp config appsettings set --settings SCALE_CONTROLLER_LOGGING_ENABLED=AppInsights:Verbose \
--name $name --resource-group $resourceGroup
```

Disable logging:

```sh
az functionapp config appsettings delete --setting-names SCALE_CONTROLLER_LOGGING_ENABLED \
--name $name --resource-group $resourceGroup
```

#### Categories

Identify which part of the system or user code generated the log.

- `Function.<YOUR_FUNCTION_NAME>`: Relates to dependency data, custom metrics and events, trace logs for function runs, and user-generated logs.
- `Host.Aggregator`: Provides aggregated counts and averages of function invocations.
- `Host.Results`: Records the success or failure of functions.
- `Microsoft`: Reflects a .NET runtime component invoked by the host.
- `Worker`: Logs generated by language worker processes for non-.NET languages.

#### [Solutions with high volume of telemetry](https://learn.microsoft.com/en-us/azure/azure-functions/configure-monitoring?tabs=v2#solutions-with-high-volume-of-telemetry)

```jsonc
{
  "version": "2.0",
  "logging": {
    "logLevel": {
      "default": "Warning",
      "Function": "Error",
      // Be aware of the `flushTimeout` (in aggregator) delay if you set a different value than Information
      "Host.Aggregator": "Error",
      "Host.Results": "Information",
      "Function.Function1": "Information",
      "Function.Function1.User": "Error"
    },
    "applicationInsights": {
      "samplingSettings": {
        "isEnabled": true,
        "maxTelemetryItemsPerSecond": 1,
        "excludedTypes": "Exception"
      }
    }
  }
}
```

## [Custom Handlers](https://learn.microsoft.com/en-us/azure/azure-functions/functions-custom-handlers)

Lightweight web servers that interact with the Azure Functions host. They can be implemented in any language that supports HTTP primitives.

When an event occurs, the Azure Functions host forwards the request to the custom handler's web server, which executes the function and returns the output for further processing by the host.

The custom handler web server needs to start within 60 seconds.

### Application structure

- `host.json` - use the `customHandler.description.defaultExecutablePath` property to set the executable path and arguments
- `local.settings.json` - set `FUNCTIONS_WORKER_RUNTIME` to "custom" for local development
- A command / script / executable, which runs a web server
- A `function.json` file for each function (**inside a folder that matches the function name**). Example: `MyFunctionName/function.json`

### HTTP-only function

`customHandler.enableForwardingHttpRequest` lets your HTTP-triggered function directly handle the original HTTP request and response instead of Azure's custom payloads. This makes your handler act more like a traditional web server. It's handy for simpler setups with no extra bindings or outputs, but keep in mind Azure Functions isn't a full-fledged reverse proxy—some features like HTTP/2 and WebSockets aren't supported. Think of it as giving your handler raw access to the HTTP action without Azure's middleman interference.

## Triggers and Bindings full samples

```cs
[HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = "blob/{name}")] HttpRequest req, string name;

[Blob("container/{name}", FileAccess.Read)] Stream myBlob; // FileAccess.Write

[CosmosDBTrigger(
    databaseName: "database",
    collectionName: "collection",
    ConnectionStringSetting = "CosmosDBConnection", // Note: this refers to env var name, not an actual connection string
    LeaseCollectionName = "leases")]IReadOnlyList<Document> input;
```

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
    ConnectionStringSetting = "CosmosDBConnection", // Note: this refers to env var name, not an actual connection string
    LeaseCollectionName = "leases")]IReadOnlyList<MyObj> input, ILogger log)
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
    var eventGridEvent = new EventGridEvent(subject: "IncomingRequest", eventType: "IncomingRequest", dataVersion: "1.0", data: requestBody);
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
    eventGridEvent = new EventGridEvent(subject: "IncomingRequest", eventType: "IncomingRequest", dataVersion: "1.0", data: requestBody);
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
    var myEvent = new EventGridEvent(subject: "IncomingRequest", eventType: "IncomingRequest", dataVersion: "1.0", data: requestBody);
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

[FunctionName(nameof(AddMessages))]
public static void AddMessages(
[HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequest req,
[Queue("outqueue"), StorageAccount("AzureWebJobsStorage")] ICollector<string> msg,
ILogger log)
{
    msg.Add("First");
    msg.Add("Second");
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
    [TimerTrigger("0 */5 * * * *")] TimerInfo myTimer, ILogger log)
{
    log.LogInformation($"C# Timer trigger function executed at: {DateTime.Now}");
}

// No Input binding

// No Output bindong
```

## CLI

| Command                                                                                                                                     | Brief Explanation                        | Example                                                                                                            |
| ------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| [az functionapp plan create](https://learn.microsoft.com/en-us/cli/azure/functionapp/plan?view=azure-cli-latest#az-functionapp-plan-create) | Create an Azure Function App plan.       | `az functionapp plan create --name MyPlan --resource-group $resourceGroup --sku Y1 --is-linux`                     |
| [az functionapp plan update](https://learn.microsoft.com/en-us/cli/azure/functionapp/plan?view=azure-cli-latest#az-functionapp-plan-update) | Update a Function App plan.              | `az functionapp plan update --name MyPlan --sku Y2`                                                                |
| [az functionapp plan list](https://learn.microsoft.com/en-us/cli/azure/functionapp/plan?view=azure-cli-latest#az-functionapp-plan-list)     | List function app plans.                 | `az functionapp plan list --resource-group $resourceGroup`                                                         |
| [az appservice plan list](https://learn.microsoft.com/en-us/cli/azure/appservice/plan?view=azure-cli-latest#az-appservice-plan-list)        | List app service plans.                  | `az appservice plan list --resource-group $resourceGroup`                                                          |
| [az functionapp show](https://learn.microsoft.com/en-us/cli/azure/functionapp?view=azure-cli-latest#az-functionapp-show)                    | Show the details of a function app.      | `az functionapp show --name MyFunctionApp --resource-group $resourceGroup`                                         |
| [az functionapp create](https://learn.microsoft.com/en-us/cli/azure/functionapp?view=azure-cli-latest#az-functionapp-create)                | Create a function app.                   | `az functionapp create --name MyFunctionApp --storage-account mystorageaccount --consumption-plan-location eastus` |
| [az functionapp config appsettings](https://learn.microsoft.com/en-us/cli/azure/functionapp/config/appsettings?view=azure-cli-latest)       | Manage function app settings.            | `az functionapp config appsettings set --name MyFunctionApp --settings KEY=VALUE`                                  |
| [az functionapp cors add](https://learn.microsoft.com/en-us/cli/azure/functionapp/cors?view=azure-cli-latest#az-functionapp-cors-add)       | Add allowed origins to function app.     | `az functionapp cors add --name MyFunctionApp --allowed-origins 'https://example.com'`                             |
| [az functionapp cors show](https://learn.microsoft.com/en-us/cli/azure/functionapp/cors?view=azure-cli-latest#az-functionapp-cors-show)     | Show details of CORS for a function app. | `az functionapp cors show --name MyFunctionApp`                                                                    |
| [az resource update](https://learn.microsoft.com/en-us/cli/azure/resource?view=azure-cli-latest#az-resource-update)                         | Update a resource.                       | `az resource update --ids RESOURCE_ID --set properties.key=value`                                                  |
| [az rest](https://learn.microsoft.com/en-us/cli/azure/reference-index?view=azure-cli-latest#az-rest)                                        | Invoke a custom request.                 | `az rest --uri /subscriptions/{subscriptionId}/resourcegroups?api-version=2019-10-01`                              |
