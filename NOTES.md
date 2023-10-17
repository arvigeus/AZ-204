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

- Winners: First - Event Hub Capture; Last - CosmoDB automatic conflic resolution;
- Message queues: storage - simple, lease-based, small messages (64KB), big capacity; service bus: feature rich, lock-based, big messages, small storage (80GB)
- To use the custom key stored in KeyVault, the identity assigned to AppConfig needs to have `GET`, `WRAP`, and `UNWRAP` permissions to the custom key
- Consistent Prefix: update operations made as a batch within a transaction are always visible together
- Dashes are not allowed in account names. Probably because MS uses them to differentiate between primary `<account>.<url>` and secondary `<account>-secondary.<url>`.
- Bet on Azure Portal if a question asks "What is the easiest way to achive X?" or "From where you can manage Y?" (except for automations). Not always true, but at least it's something.
- You need to use some sort of storage for something (app service web app, container)? Then you'll need storage account and storage account key.
- `az ? deployment` or `az webapp` means you are using [App Service](./Topics/App%20Service.md) (needs App Service Account). `az containerapp` means you are using Container Apps. `az container` means Container Instance. May sound obvious, but I want to point that out.
- `az acr create` creates registry, doesn't run anything. To run docker image use `az acr build` (quick task)
- Changing SKU is scaling up/down operation. Autoscaling is scale in/out operation.
- A storage account connection string contains all the information needed to connect to Blob storage, most importantly the account name and the account key.
- Acquiring: Authorization Code: `GET /oauth2/authorize`; Access Token: `POST /oauth2/token`
- Setting blob information longer than 2000 chars: `PUT` request to metadata. **ALL** blob oerations are either `PUT` or `GET`.
- Read an Azure Cosmos DB change feed by using a reactive model: Azure Functions with an Azure Cosmos DB trigger, Change feed pull model.
- Changing secrets does not restart Container Apps.
- App Service metrics: At App Service Plan level, not per individual app (`$webAppId`) or resource group (`$resourceGroupId`)
- Grant App Service web app permission to access the Microsoft Graph API in multi-tenant application: use `application` service principal.
- API Management: If you don't want to require approval for every API, the least scope is either Product (based on functionality) or Workspace (based on teams)
- In production, the version must be pinned: Prefer `{major}.{minor}.{patch}` or `{major}.{minor}`, instead of `{major}` or `latest`.
- Azure App Service Local Cache: `WEBSITE_LOCAL_CACHE_OPTION = Always`
- Azure Functions hosting plans: **Consumption**: serverless pricing, **Dedicated**: App Service, **App Service Environment (ASE)**: Isolation
- Microsoft Defender for Cloud: Min: Basic plan; Custom Domains: Premium
- Static website custom domain: HTTP: Add the custom domain under networking in the Azure Storage account; HTTPS: Use Azure CDN
- Mandatory headers for Graph: `request-id`; during throttling: `Retry-After`; for long running operations: `Location`.
- Both Event Hub and Service Bus support AMQP
- Avro: Event Hub capturing; Grid has Cloud/Event schema
- Consuming messages: EventHub: retained for period; ServiceBus: deleted; Queue storage: hidden;
- Message ordering: ServiceBus: per session; EventHub: per partition;
- `EventProcessorClient`: Balance the load, checkpointing, handles multiple partitions (distributed ownership)
- `EventHubConsumerClient`: read data from specific consumer group
- Contributor is the minimum role to create managed identities? Not sure here, but saw this on a practice question. Maybe choose Admin (unless it's Admin Login or whatever)
