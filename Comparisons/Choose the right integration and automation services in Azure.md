# Comparison

## Compare Microsoft Power Automate and Azure Logic Apps

|             | Power Automate                                            | Logic Apps                                                    |
|----------- | ---------------------------------------------------------- | ------------------------------------------------------------- |
| Users       | Office workers, business users, SharePoint administrators | Pro integrators and developers, IT pros                        |
| Scenarios   | Self-service                                               | Advanced integrations                                         |
| Design tool | In-browser and mobile app, UI only                         | In-browser, Visual Studio Code, and Visual Studio with code view available |
| ALM         | Design and test in non-production environments, promote to production when ready | Azure DevOps: source control, testing, support, automation, and manageability in Azure Resource Manager |
| Admin exp.  | Manage Power Automate environments and data loss prevention (DLP) policies, track licensing: Admin center | Manage resource groups, connections, access management, and logging: Azure portal |
| Security    | Microsoft 365 security audit logs, DLP, encryption at rest for sensitive data | Security assurance of Azure: Azure security, Microsoft Defender for Cloud, audit logs |

## Compare Azure Functions and Azure Logic Apps

|             | Durable Functions                  | Azure Logic Apps                                       |
|----------- | ---------------------------------- | ------------------------------------------------------ |
| Development | Code-first (imperative)            | Designer-first (declarative)                           |
| Connectivity| About a dozen built-in binding types, write code for custom bindings | Large collection of connectors, Enterprise Integration Pack for B2B scenarios, build custom connectors |
| Actions     | Each activity is an Azure function; write code for activity functions | Large collection of ready-made actions |
| Monitoring  | Azure Application Insights          | Azure portal, Azure Monitor Logs, Microsoft Defender for Cloud |
| Management  | REST API, Visual Studio             | Azure portal, REST API, PowerShell, Visual Studio       |
| Execution context | Can run locally or in the cloud | Runs in Azure, locally, or on premises. For more information, see What is Azure Logic Apps. |

## Compare Functions and WebJobs

|                       | Functions                                | WebJobs with WebJobs SDK                |
|-----------------------|------------------------------------------|-----------------------------------------|
| Serverless app model  | ✔                                        |                                           |
| Develop in browser     | ✔                                        |                                           |
| Pay-per-use pricing    | ✔                                        |                                           |
| Logic Apps integration | ✔                                        |                                           |
| Trigger events         | Timer                                    | Timer                                     |
|                        | Azure Storage queues and blobs           | Azure Storage queues and blobs           |
|                        | Azure Service Bus queues and topics      | Azure Service Bus queues and topics      |
|                        | Azure Cosmos DB                          | Azure Cosmos DB                          |
|                        | Azure Event Hubs                         | Azure Event Hubs                         |
|                        | HTTP/WebHook (GitHub, Slack)             | File system                              |
|                        | Azure Event Grid                         |                                           |
| Supported languages    | C#                                       | C#                                       |
|                        | F#                                       |                                           |
|                        | JavaScript                               |                                           |
|                        | Java                                     |                                           |
|                        | Python                                   |                                           |
|                        | PowerShell                               |                                           |
| Package managers      | NPM and NuGet                            | NuGet                                    |

Here are two scenarios for which WebJobs may be the best choice:

- You need more control over the code that listens for events, the JobHost object. Functions offers a limited number of ways to customize JobHost behavior in the host.json file. Sometimes you need to do things that can't be specified by a string in a JSON file. For example, only the WebJobs SDK lets you configure a custom retry policy for Azure Storage.
- You have an App Service app for which you want to run code snippets, and you want to manage them together in the same Azure DevOps environment.
