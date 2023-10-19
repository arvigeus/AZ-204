# Notes

## Exam strategies

[How to take a Microsoft Exam](https://github.com/mscerts/hub/blob/main/The%20Ultimate%20Certification%20Guide/6.%20How%20to%20take%20Microsoft%20exams.md)

## Open book shortcuts

From Microsoft Learn main URL, type these for quick access:

- `cli` then select Reference on bottom left for AZ CLI
- `dotnet/api/`: C#
- `powershell/module`: Powershell

## General (applicable to many modules)

- Soft-delete is considered best practice in terms of security, but it also increases cost. If question asks to minimize costs, choose the option that disables or doesn't enable soft-delete.

## DOUBLE!! TRIPLE!!! QUADRUPLE!!!! check each question

Answer my seem obvious or familiar, but the question might be a trick one. For example talking about C# **script** instead of _C#_, or resource **group** instead of _resource_.

## Trick questions

- Same command with update and create: if question is "You have X", then choose "update".
- The question may require something cheap and easy, but then sneakily insert a condition that disqualifies the cheapest option. Example: cheap no-hassle auto renewed certificates - usually you can go with the free option, but if it requires to be used for multiple apps, then free is not applicable.
- `C#` is not the same as `C# script`! Threat it like it's some weird cousin of JS.
- Sending message to topic: if you have to send a message to topic, but you are unable because of settings or permissions, create a new topic in a different namespace, with the same name. The idea is only the topic name has to match.

## Breadcrumb trail

If question requires to figure out the order of commands, look for hints in code: for example Step X is using a variable initialized in Step Y, it means the order is Y, X.

## Case Studies

Read the question first to understand what's being asked. Then, skim the case study to find relevant keywords or sections that answer the question. This approach helps you quickly locate the information you need while avoiding unnecessary details.

## Learn your craft

You should be able to not only learn commands, but also explain them - what they do, what they require. Example: To mount an Azure File Share to an Azure Container Instance, you need the Storage Account Key.

## Powershell

All commands use `AZ<COMMAND>` format, not `Azure<COMMAND>`. Examples: `New-AzKeyVault`, `Add-AzKeyVaultCertificate`. Usually create operations are `New-Az<Service>`, update operations are `Set-Az<Service>`.

## Save for later

All questions you have doubts on, **mark them for review** as you can't go back to them if you don't. **If you go to the bathroom / take a break, you cannot go back to previous questions!!!**

## Encryption

Everything is encrypted at rest with 256-bit AES, and in-transit with TLS. You can use your own encryption - provided by Azure (they manage it), or third party (you manage it).

## RBAC permission scopes

Double check in the question if you are asked to grant permissions for resource or resource group! In other words: `Resource` scope is not always the right answer!

## Random thoughts

### Apps

- `az ? deployment` or `az webapp` means you are using [App Service](./Topics/App%20Service.md) (needs App Service Account). `az containerapp` means you are using Container Apps. `az container` means Container Instance. May sound obvious, but I want to point that out.
- Changing secrets does not restart Container Apps.
- App Service metrics: At App Service Plan level, not per individual app (`$webAppId`) or resource group (`$resourceGroupId`)
- Azure App Service Local Cache: `WEBSITE_LOCAL_CACHE_OPTION = Always`
- `az acr create` creates registry, doesn't run anything. To run docker image use `az acr build` (quick task)
- Microsoft Defender for Cloud: Min: Basic plan; Custom Domains: Premium
- Private Health checks: `x-ms-auth-internal-token` request header must equals the hashed value of `WEBSITE_AUTH_ENCRYPTION_KEY`
- `az webapp log tail`
- Container Instance mount: `--azure-file-volume` acc name, key, mount path, share name. Root linux, Azure Files
- The secret values must be Base64-encoded!
- Mount storage for App Service: Azure Blobs (read-only for Linux); Avoid regenerating access key.

### Functions

- Azure Functions hosting plans: **Consumption**: serverless pricing, **Dedicated**: App Service, **App Service Environment (ASE)**: Isolation
- Functions: POST to get keys; PUT to update

### Security

- Acquiring: Authorization Code: `GET /oauth2/authorize`; Access Token: `POST /oauth2/token`
- Contributor is the minimum role to create managed identities? Not sure here, but saw this on a practice question. Maybe choose Admin (unless it's Admin Login or whatever)
- Grant App Service web app permission to access the Microsoft Graph API in multi-tenant application: use `application` service principal.
- You'll need to provide the ClientID and Secret when you're setting up an application to authenticate against Azure AD
- When registering, you need to setup identity provider (ex. Microsoft) and then click "Add"
- `az ad app permission add --id <WebApp-Application-Id> --api <Backend-API-Application-Id> --api-permissions <Scope-Permission-UUID>=Scope`
- Changes to your application object also affect its service principals in the home tenant only.
- Deleting the application also deletes its home tenant service principal (no restore service principal)
- `IPublicClientApplication app = PublicClientApplicationBuilder.Create("your_client_id");  AuthenticationResult result = await app.AcquireTokenInteractive(scopes).ExecuteAsync();`
- `IConfidentialClientApplication app = ConfidentialClientApplicationBuilder.Create("your_client_id").WithClientSecret("your_client_secret"); AuthenticationResult result = await app.AcquireTokenForClient(scopes).ExecuteAsync();`
- Other `app.AcquireTokenXXX()` as well.

### SAS

- Use HTTPS, monitor and logs, min access and time
- Generate SAS: `--account-name`; Service & Account `--account-key`; Service: `--resource-types`; User: `--auth-mode login`

### Storage

- A storage account connection string contains all the information needed to connect to Blob storage, most importantly the account name and the account key.
- Setting blob information longer than 2000 chars: `PUT` request to metadata. **ALL** blob oerations are either `PUT` or `GET`.
- Static website custom domain: HTTP: Add the custom domain under networking in the Azure Storage account; HTTPS: Use Azure CDN
- restype=container, comp=block, comp=appendblock, comp=page, comp=lease, comp=metadata, comp=list
- Delegation Scope: Use `user_impersonation`; Resource ID: Use `https://storage.azure.com/`
- StorageSharedKeyCredential, ClientSecretCredential (AD through app registration), DefaultAzureCredential
- Append: only delete policy

### CosmoDB

- Hierarchy: Account -> Databese (consistency) -> Container (partition key) -> Item
- Consistent Prefix: update operations made as a batch within a transaction are always visible together
- Change feed: Order only per partition; For deletions, use a "deleted" attribute and set TTL.
- Read an Azure Cosmos DB change feed by using a reactive model: Azure Functions with an Azure Cosmos DB trigger, Change feed pull model.
- Cosmo: Best use latest SDK and single CosmoClient.
- Stored procedures: get context; getResponse() or getCollection(); response.getBody() or container.createDocument();

### Caching

- Cache aside: when a cache doesn't provide native read-through and write-through operations, or when resource demand is unpredictable
- `using var redis = ConnectionMultiplexer.Connect("your-redis-connection-string"); var cache = redis.GetDatabase();`
- To ensure users receive the latest version of a file, include a version string

### KeyVault

- To use the custom key stored in KeyVault, the identity assigned to AppConfig needs to have `GET`, `WRAP`, and `UNWRAP` permissions to the custom key
- Use a separate vault for each application and environment (production, test, staging).
- Backup, restrict access, logging and alerts (`... Events > Event Grid Subscriptions > + Event Subscription`), del protection
- Encryption: from `KeyClient`

### Graph

- Mandatory headers for Graph: `request-id`; during throttling: `Retry-After`; for long running operations: `Location`.
- Metadata: `https://graph.microsoft.com/v1.0/$metadata`
- My photo: `https://graph.microsoft.com/v1.0/me/photo/$value`
- My photo metadata: `https://graph.microsoft.com/v1.0/me/photo/`
- Filter: `?filter=<name> eq '<value>'`
- Limit: `?top=5`
- Connectors: deliver external to Graph
- Data Connect: deliver to other Azure Services

### Insights

- Log-based metrics: thorough, complete sets of events.
- Standard: pre-aggregated, use backend for better accuracy. For real time, sampling/filtering
- Activity Log: subscription-level events. Log to _Log Analytics_, Storage, EventHub
- `TrackAvailability` for custom track availability tests
- `telemetry.GetMetric("metricId");` pre-aggregation; lowers cost; no sampling

### Api management

- If you don't want to require approval for every API, the least scope is either Product (based on functionality) or Workspace (based on teams)
- `{{<name-value>}}` and `@{<code>}`

### Messaging

- EventGrid: Messages as array, 1MB max total, charged per 64KB
- EventGrid: Subject is mandatory, Topic is not; CloudEvent doesn't have Topic, and Subject is optional
- Message ordering: ServiceBus: per session; EventHub: per partition;
- Hierarchy
  - EventGrid: Topic -> Subscription -> EventGridEvent / CloudEvent
  - EventHub: Namespace -> Event Hub -> Consumer Group -> EventData;
  - Service Bus: Namespace -> Queue -> ServiceBusMessage;
  - Queue Storage: Storage Account -> Queue -> Message
- Message queues: storage - simple, lease-based, small messages (64KB), big capacity; service bus: feature rich, lock-based, big messages, small storage (80GB)
- Consuming messages: EventHub: retained for period; ServiceBus: deleted/locked; Queue storage: hidden;
- ServiceBus premium: 100MB, predictable pricing (serverless for Standard);
- Queue storage: progress tracking; `message.PopReceipt` to update when using `ReceiveMessagesAsync()` - leasing
- Both Event Hub and Service Bus support AMQP
- Avro: Event Hub capturing; Grid has Cloud/Event schema
- `EventProcessorClient`: Balance the load with multiple instances, checkpointing (requires storage accouny), handles multiple partitions (distributed ownership)
- `EventHubConsumerClient`: read data from specific consumer group; requires partition key (`EventProcessorClient` does not)
- `EventProcessorClient` and `EventHubConsumerClient`: both read, both need a consumer group, connection string (`$"Endpoint=sb://{serviceBusEndpoint};SharedAccessKeyName=KeyName;SharedAccessKey=AccessKey"`) and event hub name.
- Dead Lettering: For EventGrid and Service bus, specify storage endpoint.
- Service Bus routing: Multiplexing uses SessionId, Simple and Multicast: MessageId
- `var client = new ServiceBusClient(connectionString)`; then `client.CreateSender(queueName) / client.CreateReceiver(queueName) / client.CreateProcessor(queueName)` - processor to manually complete messages

### Misc

- Winners: First - Event Hub Capture; Last - CosmoDB automatic conflic resolution;
- Dashes are not allowed in account names. Probably because MS uses them to differentiate between primary `<account>.<url>` and secondary `<account>-secondary.<url>`.
- Bet on Azure Portal if a question asks "What is the easiest way to achive X?" or "From where you can manage Y?" (except for automations). Not always true, but at least it's something.
- You need to use some sort of storage for something (app service web app, container)? Then you'll need storage account and storage account key.
- Changing SKU is scaling up/down operation. Autoscaling is scale in/out operation.
- In production, the version must be pinned: Prefer `{major}.{minor}.{patch}` or `{major}.{minor}`, instead of `{major}` or `latest`.
