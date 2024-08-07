# Functions

md: Are functions considered "containerized" solutions?

<!-- No -->

---

md: What are the limitations when migrating Functions?

<!-- No migration for Linux and cannot migrate to a dedicated (app service) plan -->

---

md: Describe pricing plans for Functions. Which one is most predictable? Which one to avoid cold boots?

- Consumer
- Premium
- Dedicated
- ASE

<!-- Consumer: pay for usage; Dedicated: App Service plan rates (predictable); Premium: avoid cold boots -->

---

md: Describe scaling in Function plans.

<!-- Consumption: automatically; Premium: pre-warmed instances; Dedicated: manual, autoscale -->

---

md: What are timeouts for Functions?

<!-- Consumption: 5-10 min; 30 to unlimited for others -->

---

md: Which plan if you want Docker containers, or hybrid connections?

<!-- Not Consumption -->

---

md: What is host.json used for?

<!-- Global settings for the function app: logging, concurrency -->

---

md: What is function.json used for?

<!-- Specific to each function and is used to define the bindings and triggers. Example: setup queue settings -->

---

md: What is local.settings.json used for?

<!-- app settings, connection strings, and settings used by local development tools. Not deployed to Azure -->

---

json: Describe a trigger/binding in function.json?

<!-- type: <type>Trigger, direction: in, name, ...props -->

---

sh: How to upgrade property via AZ CLI?

<!-- `az resource update --resource-type Microsoft.Web/sites -g <RESOURCE_GROUP> -n <FUNCTION_APP-NAME>/config/web --set properties.XXX -->

---

md: Where do you setup CORS when developing locally?

<!-- local.settings.json > Host -->

---

md: Describe triggers and bindings?

<!-- A trigger defines how a function is invoked and a function must have exactly one trigger. Binding to a function is a way of declaratively connecting another resource to the function: in, out, inout -->

---

md: Which triggers are not supported in Consumption plan?

<!-- RabbitMQ, Kafka -->

---

md: Describe authorization levels in HTTP triggers?

- Anonymous
- Function
- Admin

<!-- Anonymous: No API key is required; Function (default): A function-specific or host-wide API key is required. Admin: The master key is required. -->

---

md: Describe key access scopes?

- Function
- Host
- Master

<!-- Function: only to specific function; Host: all functions; Master: administrative access, can't be revoked -->

---

md: What is the URL for working with keys? CRUD operations with it?

<!-- https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Web/sites/{name}/{scope}/{host-or-function-name}/{action}?api-version=2022-03-01; POST action=listkeys: get keys; PUT action=keys/{name}: Create or update; DELETE action=keys/{name}: delete/revoke -->

---

md: How to get ClaimsPrincipals identity?

<!-- req.HttpContext.User; X-MS-CLIENT-PRINCIPAL header -->

---

sh: How to add CORS to a function?

<!-- az functionapp cors add --allowed-origins https://contoso.com --name $name --resource-group $resourceGroup -->

---

md: How to collect SQL queries from Functions?

<!-- logging > applicationInsigts > dependencyTrackingOptions > enableSqlCommandTextInstrumentation: true -->

---

sh: How to control login in Functions? To Application Insights, or disabling it?

<!-- az functionapp config appsettings --setting-names SCALE_CONTROLLER_LOGGING_ENABLED -->

---

md: How to reduce high volume of telemetry?

<!-- Set log level to something less verbose -->

---

md: Describe custom handlers in Functions? What limitations they have?

<!-- Web servers in any language that take request from Functions host. They have 60s startup limit. host.json > customHandler; local.settings.json > FUNCTIONS_WORKER_RUNTIME: "custom" -->

---

md: Define HTTP trigger and describe it's properties? How to access it via web request?

<!-- [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = "blob/{name}")] HttpRequest req, string name; string name or other named parameters are taken from Route. Route can be null. Accessible via https://<APP_NAME>.azurewebsites.net/api/<FUNCTION_NAME>/products/{id}?code=<API_KEY> -->

---

md: Define and describe TimerTrigger

<!-- [TimerTrigger("{sec?} {min} {hour} {day} {month} {weekday}")] TimerInfo myTimer; Range: X-Y; List: X,Y; Every: */X -->

---

md: Define and describe Blob trigger?

<!-- [BlobTrigger("container/{name}")] string myBlob, string name; -->

---

md: Define and describe Blob binding: in, out, inout?

<!-- [Blob("container/{name}", FileAccess.Read)] Stream myBlob; FileAccess.Write; FileAccess.ReadWrite -->

---

md: Define and describe Cosmos DB trigger?

<!-- [CosmosDBTrigger(databaseName, collectionName, ConnectionStringSetting, LeaseCollectionName)] IReadOnlyList<Document> input; ConnectionStringSetting is name of env var -->

---

md: Define and describe Cosmos DB input binding?

<!-- [CosmosDB(databaseName, collectionName, Id, PartitionKey)] dynamic document; -->

---

md: Define and describe Cosmos DB output binding?

<!-- [CosmosDB(databaseName, collectionName, Id, CreateIfNotExists)] out dynamic document; -->

---

md: Define and describe EventGrid trigger?

<!-- [EventGridTrigger]EventGridEvent ev; // ev.Data -->

---

md: Define and describe EventGrid output binding?

<!-- [return: EventGrid(TopicEndpointUri, TopicKeySetting)] // return new EventGridEvent(...); or new CloudEvent(...); [EventGrid(TopicEndpointUri, TopicKeySetting) out eventGridEvent; [EventGrid(TopicEndpointUri, TopicKeySetting)]IAsyncCollector<EventGridEvent> outputEvents; -->

---

md: Define and describe EventHub trigger?

<!-- [EventHubTrigger("hub", Connection)] EventData[] events; // var messageBody = Encoding.UTF8.GetString(eventData.Body.Array, eventData.Body.Offset, eventData.Body.Count); -->

---

md: Define and describe EventHub output binding?

<!-- [return: EventHub("outputEventHubMessage", Connection)] // return string; [EventHub("outputEventHubMessage", Connection)] IAsyncCollector<string> outputEvents;  outputEvents.AddAsync(string) -->

---

md: Define and describe Queue trigger?

<!-- [QueueTrigger("queue", Connection)]string myQueueItem; -->

---

md: Define and describe Queue output binding?

<!-- [return: Queue("queue")] // return string -->

---

md: Define and describe ServiceBus trigger?

<!-- [ServiceBusTrigger("queue", Connection)] string myQueueItem; -->

---

md: Define and describe ServiceBus output binding?

<!-- [return: ServiceBus("queue", Connection)] -->

---
