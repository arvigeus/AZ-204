# Azure Functions

## Explore Azure Functions

Azure Functions lets you develop serverless applications on Microsoft Azure. You can write just the code you need for the problem at hand, without worrying about a whole application or the infrastructure to run it.

### Discover Azure Functions

Azure Functions is a serverless solution that allows you to write less code, maintain less infrastructure, and save on costs. Instead of worrying about deploying and maintaining servers, the cloud infrastructure provides all the up-to-date resources needed to keep your applications running.

We often build systems to react to a series of critical events. Whether you're building a web API, responding to database changes, processing IoT data streams, or even managing message queues - every application needs a way to run some code as these events occur.

Azure Functions supports _triggers_, which are ways to start execution of your code, and _bindings_, which are ways to simplify coding for input and output data. There are other integration and automation services in Azure and they all can solve integration problems and automate business processes. They can all define input, actions, conditions, and output.

#### Compare Azure Functions and Azure Logic Apps

Both Functions and Logic Apps are Azure Services that enable serverless workloads. Azure Functions is a serverless compute service, whereas Azure Logic Apps is a serverless workflow integration platform. Both can create complex _orchestrations_. An orchestration is a collection of functions or steps, called actions in Logic Apps, that are executed to accomplish a complex task.

For Azure Functions, you develop orchestrations by writing code and using the [Durable Functions extension](https://learn.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-overview). For Logic Apps, you create orchestrations by using a GUI or editing configuration files.

The following table lists some of the key differences between Functions and Logic Apps:

| Topic             | Azure Functions                                                       | Logic Apps                                                                                             |
| ----------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Development       | Code-first (imperative)                                               | Designer-first (declarative)                                                                           |
| Connectivity      | About a dozen built-in binding types, write code for custom bindings  | Large collection of connectors, Enterprise Integration Pack for B2B scenarios, build custom connectors |
| Actions           | Each activity is an Azure function; write code for activity functions | Large collection of ready-made actions                                                                 |
| Monitoring        | Azure Application Insights                                            | Azure portal, Azure Monitor logs                                                                       |
| Management        | REST API, Visual Studio                                               | Azure portal, REST API, PowerShell, Visual Studio                                                      |
| Execution context | Runs in Azure, or locally                                             | Runs in Azure, locally, or on premises                                                                 |

#### Compare Functions and WebJobs

Like Azure Functions, Azure App Service WebJobs with the WebJobs SDK is a code-first integration service that is designed for developers. Both are built on Azure App Service and support features such as source control integration, authentication, and monitoring with Application Insights integration.

Azure Functions is built on the WebJobs SDK, so it shares many of the same event triggers and connections to other Azure services. Here are some factors to consider when you're choosing between Azure Functions and WebJobs with the WebJobs SDK:

| Factor                                      | Functions                                                                                                                                                                 | WebJobs with WebJobs SDK                                                                                                             |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Serverless app model with automatic scaling | Yes                                                                                                                                                                       | No                                                                                                                                   |
| Develop and test in browser                 | Yes                                                                                                                                                                       | No                                                                                                                                   |
| Pay-per-use pricing                         | Yes                                                                                                                                                                       | No                                                                                                                                   |
| Integration with Logic Apps                 | Yes                                                                                                                                                                       | No                                                                                                                                   |
| Trigger events                              | Timer<br>Azure Storage queues and blobs<br>Azure Service Bus queues and topics<br>Azure Cosmos DB<br>Azure Event Hubs<br>HTTP/WebHook (GitHub, Slack)<br>Azure Event Grid | Timer<br>Azure Storage queues and blobs<br>Azure Service Bus queues and topics<br>Azure Cosmos DB<br>Azure Event Hubs<br>File system |

Azure Functions offers more developer productivity than Azure App Service WebJobs does. It also offers more options for programming languages, development environments, Azure service integration, and pricing. For most scenarios, it's the best choice.

### Compare Azure Functions hosting options

When you create a function app in Azure, you must choose a hosting plan for your app. Azure provides you with these hosting options for your function code:

| Hosting option                                                                                                 | Service              | Availability             | Container support |
| -------------------------------------------------------------------------------------------------------------- | -------------------- | ------------------------ | ----------------- |
| **[Consumption plan](https://learn.microsoft.com/en-us/azure/azure-functions/consumption-plan)**               | Azure Functions      | Generally available (GA) | None              |
| **[Flex Consumption plan](https://learn.microsoft.com/en-us/azure/azure-functions/flex-consumption-plan)**     | Azure Functions      | GA                       | None              |
| **[Premium plan](https://learn.microsoft.com/en-us/azure/azure-functions/functions-premium-plan)**             | Azure Functions      | GA                       | Linux             |
| **[Dedicated plan](https://learn.microsoft.com/en-us/azure/azure-functions/dedicated-plan)**                   | Azure Functions      | GA                       | Linux             |
| **[Container Apps](https://learn.microsoft.com/en-us/azure/azure-functions/functions-container-apps-hosting)** | Azure Container Apps | GA                       | Linux             |

Azure App Service infrastructure facilitates Azure Functions hosting on both Linux and Windows virtual machines. The hosting option you choose dictates the following behaviors:

- How your function app is scaled.
- The resources available to each function app instance.
- Support for advanced functionality, such as Azure Virtual Network connectivity.
- Support for Linux containers.

The plan you choose also impacts the costs for running your function code.

#### Overview of plans

Following is a summary of the benefits of the various hosting options:

##### Consumption plan

The Consumption plan is the default hosting plan. Pay for compute resources only when your functions are running (pay-as-you-go) with automatic scale. On the Consumption plan, instances of the Functions host are dynamically added and removed based on the number of incoming events.

##### Flex Consumption plan

Get high scalability with compute choices, virtual networking, and pay-as-you-go billing. On the Flex Consumption plan, instances of the Functions host are dynamically added and removed based on the configured per instance concurrency and the number of incoming events.

You can reduce cold starts by specifying the number of pre-provisioned (always ready) instances. Scales automatically based on demand.

##### Premium plan

Automatically scales based on demand using prewarmed workers, which run applications with no delay after being idle, runs on more powerful instances, and connects to virtual networks.

Consider the Azure Functions Premium plan in the following situations:

- Your function apps run continuously, or nearly continuously.
- You want more control of your instances and want to deploy multiple function apps on the same plan with event-driven scaling.
- You have a high number of small executions and a high execution bill, but low GB seconds in the Consumption plan.
- You need more CPU or memory options than are provided by consumption plans.
- Your code needs to run longer than the maximum execution time allowed on the Consumption plan.
- You require virtual network connectivity.
- You want to provide a custom Linux image in which to run your functions.

##### Dedicated plan

Run your functions within an App Service plan at regular App Service plan rates. Best for long-running scenarios where Durable Functions can't be used.

Consider an App Service plan in the following situations:

- You must have fully predictable billing, or you need to manually scale instances.
- You want to run multiple web apps and function apps on the same plan
- You need access to larger compute size choices.
- Full compute isolation and secure network access provided by an App Service Environment (ASE).
- High memory usage and high scale (ASE).

##### Container Apps

Create and deploy containerized function apps in a fully managed environment hosted by Azure Container Apps.

Use the Azure Functions programming model to build event-driven, serverless, cloud native function apps. Run your functions alongside other microservices, APIs, websites, and workflows as container-hosted programs.

Consider hosting your functions on Container Apps in the following situations:

- You want to package custom libraries with your function code to support line-of-business apps.
- You need to migrate code execution from on-premises or legacy apps to cloud native microservices running in containers.
- You want to avoid the overhead and complexity of managing Kubernetes clusters and dedicated compute.
- You need the high-end processing power provided by dedicated CPU compute resources for your functions.

#### Function app time-out duration

The `functionTimeout` property in the _host.json_ project file specifies the time-out duration for functions in a function app. This property applies specifically to function executions. After the trigger starts function execution, the function needs to return/respond within the time-out duration.

The following table shows the default and maximum values (in minutes) for specific plans:

| Plan                  | Default | Maximum¹   |
| --------------------- | ------- | ---------- |
| Flex Consumption plan | 30      | Unbounded² |
| Premium plan          | 30⁴     | Unbounded² |
| Dedicated plan        | 30⁴     | Unbounded³ |
| Container Apps        | 30      | Unbounded⁵ |
| Consumption plan      | 5       | 10         |

¹ Regardless of the function app time-out setting, 230 seconds is the maximum amount of time that an HTTP triggered function can take to respond to a request. This is because of the default idle time-out of Azure Load Balancer. For longer processing times, consider using the [Durable Functions async pattern](https://learn.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-overview#async-http) or defer the actual work and return an immediate response.  
² There's no maximum execution time-out duration enforced. However, the grace period given to a function execution is 60 minutes during scale in for the Flex Consumption and Premium plans, and a grace period of 10 minutes is given during platform updates.  
³ Requires the App Service plan be set to [Always On](https://learn.microsoft.com/en-us/azure/azure-functions/dedicated-plan#always-on). A grace period of 10 minutes is given during platform updates.  
⁴ The default time-out for version 1.x of the Functions host runtime is _unbounded_.  
⁵ When the minimum number of replicas is set to zero, the default time-out depends on the specific triggers used in the app.

#### Storage account requirements

On any plan, a function app requires a general Azure Storage account, which supports Azure Blob, Queue, Files, and Table storage. This is because Functions rely on Azure Storage for operations such as managing triggers and logging function executions, but some storage accounts don't support queues and tables.

The same storage account used by your function app can also be used by your triggers and bindings to store your application data. However, for storage-intensive operations, you should use a separate storage account.

### Scale Azure Functions

The following table compares the scaling behaviors of the various hosting plans. Maximum instances are given on a per-function app (Consumption) or per-plan (Premium/Dedicated) basis, unless otherwise indicated.

| Plan                  | Scale out                                                                                                                                                                                                   | Max # instances                                                            |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Consumption plan      | Event driven. Scales out automatically, even during periods of high load. Functions infrastructure scales CPU and memory resources by adding more instances based on the number of incoming trigger events. | Windows: 200<br>Linux: 100¹                                                |
| Flex Consumption plan | Per-function scaling. Event-driven scaling decisions are calculated on a per-function basis, providing a more deterministic way of scaling the functions in your app.                                       | Limited only by total memory usage of all instances across a given region. |
| Premium plan          | Event driven. Scale out automatically based on the number of events that its functions are triggered on.                                                                                                    | Windows: 100<br>Linux: 20-100²                                             |
| Dedicated plan³       | Manual/autoscale                                                                                                                                                                                            | 10-30<br>100 (ASE)                                                         |
| Container Apps        | Event driven. Scale out automatically by adding more instances of the Functions host, based on the number of events that its functions are triggered on.                                                    | 10-300⁴                                                                    |

1. During scale-out, there's currently a limit of 500 instances per subscription per hour for Linux 1. apps on a Consumption plan.
2. In some regions, Linux apps on a Premium plan can scale to 100 instances.
3. For specific limits for the various App Service plan options, see the [App Service plan limits](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/azure-subscription-service-limits#app-service-limits).
4. On Container Apps, you can set the maximum number of replicas, which is honored as long as there's enough cores quota available

## Develop Azure Functions

Functions share a few core technical concepts and components, regardless of the language or binding you use.

### Explore Azure Functions development

A function app provides an execution context in Azure in which your functions run. As such, it's the unit of deployment and management for your functions. A function app is composed of one or more individual functions that are managed, deployed, and scaled together. All of the functions in a function app share the same pricing plan, deployment method, and runtime version. Think of a function app as a way to organize and collectively manage your functions.

:information_source: In Functions 2.x, all functions in a function app must be authored in the same language. In previous versions of the Azure Functions runtime, this wasn't required.

#### Develop and test Azure Functions locally

Functions make it easy to use your favorite code editor and development tools to create and test functions on your local computer. Your local functions can connect to live Azure services, and you can debug them on your local computer using the full Functions runtime.

The way in which you develop functions on your local computer depends on your language and tooling preferences. For more information, see [Code and test Azure Functions locally](https://learn.microsoft.com/en-us/azure/azure-functions/functions-develop-local).

:information_source: Because of limitations on editing function code in the Azure portal, you should develop your functions locally and publish your code project to a function app in Azure. For more information, see [Development limitations in the Azure portal](https://learn.microsoft.com/en-us/azure/azure-functions/functions-how-to-use-azure-function-app-settings#development-limitations-in-the-azure-portal)

##### Local project files

A Functions project directory contains the following files in the project root folder, regardless of language:

- `host.json`
- `local.settings.json`
- Other files in the project depend on your language and specific functions.

The `host.json` metadata file contains configuration options that affect all functions in a function app instance. Other function app configuration options are managed depending on where the function app runs:

- **Deployed to Azure:** in your application settings
- **On your local computer:** in the `local.settings.json` file.

Configurations in `host.json` related to bindings are applied equally to each function in the function app. You can also override or apply settings per environment using application settings. To learn more, see the [host.json reference](https://learn.microsoft.com/en-us/azure/azure-functions/functions-host-json).

The `local.settings.json` file stores app settings, and settings used by local development tools. Settings in the `local.settings.json` file are used only when you're running your project locally. When you publish your project to Azure, be sure to also add any required settings to the app settings for the function app.

:bangbang: Because the `local.settings.json` may contain secrets, such as connection strings, you should never store it in a remote repository.

##### Synchronize settings

When you develop your functions locally, any local settings required by your app must also be present in the app settings of the deployed function app. You can also download current settings from the function app to your local project.

### Create triggers and bindings

A trigger defines how a function is invoked and a function must have exactly one trigger. Triggers have associated data, which is often provided as the payload of the function.

Binding to a function is a way of declaratively connecting another resource to the function; bindings might be connected as _input bindings_, _output bindings_, or both. Data from bindings is provided to the function as parameters.

You can mix and match different bindings to suit your needs. Bindings are optional and a function might have one or multiple input and/or output bindings.

Triggers and bindings let you avoid hardcoding access to other services. Your function receives data (for example, the content of a queue message) in function parameters. You send data (for example, to create a queue message) by using the return value of the function.

When you develop your functions locally, you need to take trigger and binding behaviors into consideration. For HTTP triggers, you can call the HTTP endpoint on the local computer, using `http://localhost/`. For non-HTTP triggered functions, there are several options to run locally:

- The easiest way to test bindings during local development is to use connection strings that target live Azure services. You can target live services by adding the appropriate connection string settings in the `Values` array in the local.settings.json file. When you do this, local executions during testing use live service data. Because of this, consider setting-up separate services to use during development and testing, and then switch to different services during production.
- For storage-based triggers, you can use the local [Azurite emulator](/en-us/azure/storage/common/storage-use-azurite) when testing functions with Azure Storage bindings (Queue Storage, Blob Storage, and Table Storage), without having to connect to remote storage services.
- You can manually run non-HTTP trigger functions by using special administrator endpoints. For more information, see [Manually run a non HTTP-triggered function](/en-us/azure/azure-functions/functions-manually-run-non-http).

#### Trigger and binding definitions

Triggers and bindings are defined differently depending on the development language.

| Language                                | Configure triggers and bindings by...                   |
| --------------------------------------- | ------------------------------------------------------- |
| C# class library                        | Decorating methods and parameters with C# attributes    |
| Java                                    | Decorating methods and parameters with Java annotations |
| JavaScript/PowerShell/Python/TypeScript | Updating _function.json_ schema                         |

For languages that rely on _function.json_, the portal provides a UI for adding bindings in the **Integration** tab. You can also edit the file directly in the portal in the **Code + test** tab of your function.

In .NET and Java, the parameter type defines the data type for input data. For instance, use `string` to bind to the text of a queue trigger, a byte array to read as binary, and a custom type to deserialize to an object. Since .NET class library functions and Java functions don't rely on _function.json_ for binding definitions, they can't be created and edited in the portal. C# portal editing is based on C# script, which uses _function.json_ instead of attributes.

For languages that are dynamically typed such as JavaScript, use the `dataType` property in the _function.json_ file. For example, to read the content of an HTTP request in binary format, set `dataType` to `binary`:

```json
{
  "dataType": "binary",
  "type": "httpTrigger",
  "name": "req",
  "direction": "in"
}
```

Other options for `dataType` are `stream` and `string`.

#### Binding direction

All triggers and bindings have a direction property in the _function.json_ file:

- For triggers, the direction is always `in`
- Input and output bindings use `in` and `out`
- Some bindings support a special direction `inout`. If you use `inout`, only the **Advanced editor** is available via the **Integrate** tab in the portal.

When you use attributes in a class library to configure triggers and bindings, the direction is provided in an attribute constructor or inferred from the parameter type.

#### Azure Functions trigger and binding example

Suppose you want to write a new row to Azure Table storage whenever a new message appears in Azure Queue storage. This scenario can be implemented using an Azure Queue storage trigger and an Azure Table storage output binding.

Here's a _function.json_ file for this scenario.

```json
{
  "disabled": false,
  "bindings": [
    {
      "type": "queueTrigger",
      "direction": "in",
      "name": "myQueueItem",
      "queueName": "myqueue-items",
      "connection": "MyStorageConnectionAppSetting"
    },
    {
      "tableName": "Person",
      "connection": "MyStorageConnectionAppSetting",
      "name": "tableBinding",
      "type": "table",
      "direction": "out"
    }
  ]
}
```

The first element in the `bindings` array is the Queue storage trigger. The `type` and `direction` properties identify the trigger. The `name` property identifies the function parameter that receives the queue message content. The name of the queue to monitor is in `queueName`, and the connection string is in the app setting identified by `connection`.

The second element in the `bindings` array is the Azure Table Storage output binding. The `type` and `direction` properties identify the binding. The `name` property specifies how the function provides the new table row, in this case by using the function return value. The name of the table is in `tableName`, and the connection string is in the app setting identified by `connection`.

##### C# function example

Following is the same example represented in a C# function. The same trigger and binding information, queue and table names, storage accounts, and function parameters for input and output are provided by attributes instead of a _function.json_ file.

```csharp
public static class QueueTriggerTableOutput
{
    [FunctionName("QueueTriggerTableOutput")]
    [return: Table("outTable", Connection = "MY_TABLE_STORAGE_ACCT_APP_SETTING")]
    public static Person Run(
        [QueueTrigger("myqueue-items", Connection = "MY_STORAGE_ACCT_APP_SETTING")]JObject order,
        ILogger log)
    {
        return new Person() {
                PartitionKey = "Orders",
                RowKey = Guid.NewGuid().ToString(),
                Name = order["Name"].ToString(),
                MobileNumber = order["MobileNumber"].ToString() };
    }
}

public class Person
{
    public string PartitionKey { get; set; }
    public string RowKey { get; set; }
    public string Name { get; set; }
    public string MobileNumber { get; set; }
}
```

### Connect functions to Azure services

As a security best practice, Azure Functions takes advantage of the application settings functionality of Azure App Service to help you more securely store strings, keys, and other tokens required to connect to other services. Application settings in Azure are stored encrypted and accessed at runtime by your app as environment variable `name` `value` pairs. For triggers and bindings that require a connection property, you set the application setting name instead of the actual connection string. You can't configure a binding directly with a connection string or key.

The default configuration provider uses environment variables. These variables are defined in application settings when running in the Azure and in the local settings file when developing locally.

#### Configure an identity-based connection

Some connections in Azure Functions are configured to use an identity instead of a secret. Support depends on the extension using the connection. In some cases, a connection string might still be required in Functions even though the service to which you're connecting supports identity-based connections.

:information_source: An app running in a Consumption or Elastic Premium plan, uses the `WEBSITE_AZUREFILESCONNECTIONSTRING` and `WEBSITE_CONTENTSHARE` settings when connecting to Azure Files on the storage account used by your function app. Azure Files doesn't support using managed identity when accessing the file share.

When hosted in the Azure Functions service, identity-based connections use a managed identity. The system-assigned identity is used by default, although a user-assigned identity can be specified with the `credential` and `clientID` properties. Configuring a user-assigned identity with a resource ID is **not** supported. When run in other contexts, such as local development, your developer identity is used instead, although this can be customized.

#### Grant permission to the identity

Identities must have permissions to perform the intended actions. This is typically done by assigning a role in Azure role-based access control or specifying the identity in an access policy, depending on the service to which you're connecting.

:bangbang: Some permissions might be exposed by the target service that aren't necessary for all contexts. Where possible, adhere to the **principle of least privilege**, granting the identity only required privileges.
