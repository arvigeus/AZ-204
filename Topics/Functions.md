# Azure Functions

## Explore Azure Functions

Azure Functions lets you develop serverless applications on Microsoft Azure. You can write just the code you need for the problem at hand, without worrying about a whole application or the infrastructure to run it.

After completing this module, you'll be able to:

- Explain functional differences between Azure Functions, Azure Logic Apps, and WebJobs
- Describe Azure Functions hosting plan options
- Describe how Azure Functions scale to meet business needs

### Discover Azure Functions

Azure Functions is a serverless solution that allows you to write less code, maintain less infrastructure, and save on costs. Instead of worrying about deploying and maintaining servers, the cloud infrastructure provides all the up-to-date resources needed to keep your applications running.

We often build systems to react to a series of critical events. Whether you're building a web API, responding to database changes, processing IoT data streams, or even managing message queues - every application needs a way to run some code as these events occur.

Azure Functions supports triggers, which are ways to start execution of your code, and bindings, which are ways to simplify coding for input and output data. There are other integration and automation services in Azure and they all can solve integration problems and automate business processes. They can all define input, actions, conditions, and output.

#### Compare Azure Functions and Azure Logic Apps

Both Functions and Logic Apps are Azure Services that enable serverless workloads. Azure Functions is a serverless compute service, whereas Azure Logic Apps is a serverless workflow integration platform. Both can create complex orchestrations. An orchestration is a collection of functions or steps, called actions in Logic Apps, that are executed to accomplish a complex task.

For Azure Functions, you develop orchestrations by writing code and using the [Durable Functions extension](https://learn.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-overview). For Logic Apps, you create orchestrations by using a GUI or editing configuration files.

The following table lists some of the key differences between Functions and Logic Apps:

|                   | Azure Functions                                                       | Logic Apps                                                                                             |
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
Here's your table in markdown format:

|                                             | Functions                                                                                                                                                                 | WebJobs with WebJobs SDK                                                                                                             |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Serverless app model with automatic scaling | Yes                                                                                                                                                                       | No                                                                                                                                   |
| Develop and test in browser                 | Yes                                                                                                                                                                       | No                                                                                                                                   |
| Pay-per-use pricing                         | Yes                                                                                                                                                                       | No                                                                                                                                   |
| Integration with Logic Apps                 | Yes                                                                                                                                                                       | No                                                                                                                                   |
| Trigger events                              | Timer<br>Azure Storage queues and blobs<br>Azure Service Bus queues and topics<br>Azure Cosmos DB<br>Azure Event Hubs<br>HTTP/WebHook (GitHub, Slack)<br>Azure Event Grid | Timer<br>Azure Storage queues and blobs<br>Azure Service Bus queues and topics<br>Azure Cosmos DB<br>Azure Event Hubs<br>File system |

Azure Functions offers more developer productivity than Azure App Service WebJobs does. It also offers more options for programming languages, development environments, Azure service integration, and pricing. For most scenarios, it's the best choice.

### Compare Azure Functions hosting options

When you create a function app in Azure, you must choose a hosting plan for your app. There are three basic hosting plans available for Azure Functions: [Consumption plan](https://learn.microsoft.com/en-us/azure/azure-functions/consumption-plan), [Premium plan](https://learn.microsoft.com/en-us/azure/azure-functions/functions-premium-plan), and [Dedicated (App service) Dedicated plan](https://learn.microsoft.com/en-us/azure/azure-functions/dedicated-plan). All hosting plans are generally available (GA) on both Linux and Windows virtual machines.

The hosting plan you choose dictates the following behaviors:

- How your function app is scaled.
- The resources available to each function app instance.
- Support for advanced functionality, such as Azure Virtual Network connectivity.

Following is a summary of the benefits of the three main hosting plans for Functions:

| Plan             | Benefits                                                                                                                                                                                                                                              |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Consumption plan | This is the default hosting plan. It scales automatically and you only pay for compute resources when your functions are running. Instances of the Functions host are dynamically added and removed based on the number of incoming events.           |
| Premium plan     | Automatically scales based on demand using pre-warmed workers, which run applications with no delay after being idle, runs on more powerful instances, and connects to virtual networks.                                                              |
| Dedicated plan   | Run your functions within an App Service plan at regular App Service plan rates. Best for long-running scenarios where [Durable Functions](https://learn.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-overview) can't be used. |

There are two other hosting options, which provide the highest amount of control and isolation in which to run your function apps.

| Hosting option                                                                                                                                                                                        | Details                                                                                                                                                                                                                                        |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ASE                                                                                                                                                                                                   | [App Service Environment (ASE)](https://learn.microsoft.com/en-us/azure/app-service/environment/intro) is an App Service feature that provides a fully isolated and dedicated environment for securely running App Service apps at high scale. |
| Kubernetes ([Direct](https://learn.microsoft.com/en-us/azure/azure-functions/functions-kubernetes-keda) or [Azure Arc](https://learn.microsoft.com/en-us/azure/app-service/overview-arc-integration)) | Kubernetes provides a fully isolated and dedicated environment running on top of the Kubernetes platform.                                                                                                                                      |

#### Hosting plans and scaling

The following table compares the scaling behaviors of the various hosting plans. Maximum instances are given on a per-function app (Consumption) or per-plan (Premium/Dedicated) basis, unless otherwise indicated.

| Plan             | Scale out                                                                                                                                                                                                                                                  | Max # instances             |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| Consumption plan | Event driven. Scale out automatically, even during periods of high load. Azure Functions infrastructure scales CPU and memory resources by adding more instances of the Functions host, based on the number of incoming trigger events.                    | Windows: 200, Linux: 100    |
| Premium plan     | Event driven. Scale out automatically, even during periods of high load. Azure Functions infrastructure scales CPU and memory resources by adding more instances of the Functions host, based on the number of events that its functions are triggered on. | Windows: 100, Linux: 20-100 |
| Dedicated plan   | Manual/autoscale                                                                                                                                                                                                                                           | 10-20                       |
| ASE              | Manual/autoscale                                                                                                                                                                                                                                           | 100                         |
| Kubernetes       | Event-driven autoscale for Kubernetes clusters using KEDA.                                                                                                                                                                                                 | Varies by cluster           |

:information_source: The maximum scale out can vary by region and hosting plan. For more information, visit the [Premium plan article](https://learn.microsoft.com/en-us/azure/azure-functions/functions-premium-plan#region-max-scale-out) and [App Service plan limits](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/azure-subscription-service-limits#app-service-limits).

#### Function app timeout duration

The `functionTimeout` property in the _host.json_ project file specifies the timeout duration for functions in a function app. This property applies specifically to function executions. After the trigger starts function execution, the function needs to return/respond within the timeout duration.

The following table shows the default and maximum values (in minutes) for specific plans:

| Plan             | Default | Maximum   |
| ---------------- | ------- | --------- |
| Consumption plan | 5       | 10        |
| Premium plan     | 302     | Unlimited |
| Dedicated plan   | 302     | Unlimited |

#### Storage account requirements

On any plan, a function app requires a general Azure Storage account, which supports Azure Blob, Queue, Files, and Table storage. This is because Functions rely on Azure Storage for operations such as managing triggers and logging function executions, but some storage accounts don't support queues and tables.

The same storage account used by your function app can also be used by your triggers and bindings to store your application data. However, for storage-intensive operations, you should use a separate storage account.

### Scale Azure Functions

In the Consumption and Premium plans, Azure Functions scales CPU and memory resources by adding more instances of the Functions host. The number of instances is determined on the number of events that trigger a function.

Each instance of the Functions host in the Consumption plan is limited to 1.5 GB of memory and one CPU. An instance of the host is the entire function app, meaning all functions within a function app share resource within an instance and scale at the same time. Function apps that share the same Consumption plan scale independently. In the Premium plan, the plan size determines the available memory and CPU for all apps in that plan on that instance.

Function code files are stored on Azure Files shares on the function's main storage account. When you delete the main storage account of the function app, the function code files are deleted and can't be recovered.

#### Runtime scaling

Azure Functions uses a component called the _scale controller_ to monitor the rate of events and determine whether to scale out or scale in. The scale controller uses heuristics for each trigger type. For example, when you're using an Azure Queue storage trigger, it scales based on the queue length and the age of the oldest queue message.

The unit of scale for Azure Functions is the function app. When the function app is scaled out, more resources are allocated to run multiple instances of the Azure Functions host. Conversely, as compute demand is reduced, the scale controller removes function host instances. The number of instances is eventually "scaled in" to zero when no functions are running within a function app.

![Scale controller monitoring events and creating instances](https://learn.microsoft.com/en-us/training/wwl-azure/explore-azure-functions/media/central-listener.png)

:information_source: After your function app has been idle for a number of minutes, the platform may scale the number of instances on which your app runs in to zero. The next request has the added latency of scaling from zero to one. This latency is referred to as a \_cold start\*.

#### Scaling behaviors

Scaling can vary on many factors, and scale differently based on the trigger and language selected. There are a few intricacies of scaling behaviors to be aware of:

- **Maximum instances**: A single function app only scales out to a maximum of 200 instances. A single instance may process more than one message or request at a time though, so there isn't a set limit on number of concurrent executions.
- **New instance rate**: For HTTP triggers, new instances are allocated, at most, once per second. For non-HTTP triggers, new instances are allocated, at most, once every 30 seconds.

#### Limit scale-out

You may wish to restrict the maximum number of instances an app used to scale out. This is most common for cases where a downstream component like a database has limited throughput. By default, Consumption plan functions scale out to as many as 200 instances, and Premium plan functions scales out to as many as 100 instances. You can specify a lower maximum for a specific app by modifying the `functionAppScaleLimit` value. The `functionAppScaleLimit` can be set to `0` or `null` for unrestricted, or a valid value between `1` and the app maximum.

## Develop Azure Functions

Functions share a few core technical concepts and components, regardless of the language or binding you use.

After completing this module, you'll be able to:

- Explain the key components of a function and how they are structured
- Create triggers and bindings to control when a function runs and where the output is directed
- Connect a function to services in Azure
- Create a function by using Visual Studio Code and the Azure Functions Core Tools

### Explore Azure Functions development

A function contains two important pieces - your code, which can be written in various languages, and some config, the _function.json_ file. For compiled languages, this config file is generated automatically from annotations in your code. For scripting languages, you must provide the config file yourself.

The _function.json_ file defines the function's trigger, bindings, and other configuration settings. Every function has one and only one trigger. The runtime uses this config file to determine the events to monitor and how to pass data into and return data from a function execution. Following is an example _function.json_ file.

```json
{
  "disabled": false,
  "bindings": [
    // ... bindings here
    {
      "type": "bindingType",
      "direction": "in",
      "name": "myParamName"
      // ... more depending on binding
    }
  ]
}
```

The `bindings` property is where you configure both triggers and bindings. Each binding shares a few common settings and some settings that are specific to a particular type of binding. Every binding requires the following settings:

| Property    | Types  | Comments                                                                                                                             |
| ----------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| `type`      | string | Name of binding. For example, `queueTrigger`.                                                                                        |
| `direction` | string | Indicates whether the binding is for receiving data into the function or sending data from the function. For example, `in` or `out`. |
| `name`      | string | The name that is used for the bound data in the function. For example, `myQueue`.                                                    |

#### Function app

A function app provides an execution context in Azure in which your functions run. As such, it's the unit of deployment and management for your functions. A function app is composed of one or more individual functions that are managed, deployed, and scaled together. All of the functions in a function app share the same pricing plan, deployment method, and runtime version. Think of a function app as a way to organize and collectively manage your functions.

:information_source: In Functions 2.x all functions in a function app must be authored in the same language. In previous versions of the Azure Functions runtime, this wasn't required.

#### Folder structure

The code for all the functions in a specific function app is located in a root project folder that contains a host configuration file. The [host.json](https://learn.microsoft.com/en-us/azure/azure-functions/functions-host-json) file contains runtime-specific configurations and is in the root folder of the function app. A bin folder contains packages and other library files that the function app requires. Specific folder structures required by the function app depend on language:

- [C# compiled (.csproj)](https://learn.microsoft.com/en-us/azure/azure-functions/functions-dotnet-class-library#functions-class-library-project)
- [C# script (.csx)](https://learn.microsoft.com/en-us/azure/azure-functions/functions-reference-csharp#folder-structure)
- [F# script](https://learn.microsoft.com/en-us/azure/azure-functions/functions-reference-fsharp#folder-structure)
- [Java](https://learn.microsoft.com/en-us/azure/azure-functions/functions-reference-java#folder-structure)
- [JavaScript](https://learn.microsoft.com/en-us/azure/azure-functions/functions-reference-node#folder-structure)
- [Python](https://learn.microsoft.com/en-us/azure/azure-functions/functions-reference-python#folder-structure)

#### Local development environments

Functions make it easy to use your favorite code editor and development tools to create and test functions on your local computer. Your local functions can connect to live Azure services, and you can debug them on your local computer using the full Functions runtime.

The way in which you develop functions on your local computer depends on your language and tooling preferences. See [Code and test Azure Functions locally](https://learn.microsoft.com/en-us/azure/azure-functions/functions-develop-local) for more information.

:warning: Do not mix local development with portal development in the same function app. When you create and publish functions from a local project, you should not try to maintain or modify project code in the portal.

### Create triggers and bindings

Triggers cause a function to run. A trigger defines how a function is invoked and a function must have exactly one trigger. Triggers have associated data, which is often provided as the payload of the function.

Binding to a function is a way of declaratively connecting another resource to the function; bindings may be connected as _input bindings_, _output bindings_, or both. Data from bindings is provided to the function as parameters.

You can mix and match different bindings to suit your needs. Bindings are optional and a function might have one or multiple input and/or output bindings.

Triggers and bindings let you avoid hardcoding access to other services. Your function receives data (for example, the content of a queue message) in function parameters. You send data (for example, to create a queue message) by using the return value of the function.

#### Trigger and binding definitions

Triggers and bindings are defined differently depending on the development language.

| Language                                | Triggers and bindings are configured by...              |
| --------------------------------------- | ------------------------------------------------------- |
| C# class library                        | Decorating methods and parameters with C# attributes    |
| Java                                    | Decorating methods and parameters with Java annotations |
| JavaScript/PowerShell/Python/TypeScript | Updating _function.json_ schema                         |

For languages that rely on _function.json_, the portal provides a UI for adding bindings in the **Integration** tab. You can also edit the file directly in the portal in the **Code + test** tab of your function.

In .NET and Java, the parameter type defines the data type for input data. For instance, use `string` to bind to the text of a queue trigger, a byte array to read as binary, and a custom type to de-serialize to an object. Since .NET class library functions and Java functions don't rely on _function.json_ for binding definitions, they can't be created and edited in the portal. C# portal editing is based on C# script, which uses _function.json_ instead of attributes.

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

The first element in the `bindings` array is the Queue storage trigger. The `type` and `direction` properties identify the trigger. The `name` property identifies the function parameter that receives the queue message content. The name of the queue to monitor is in `queueName`, and the connection string is in the app setting identified by `connection`.

The second element in the `bindings` array is the Azure Table Storage output binding. The `type` and `direction` properties identify the binding. The `name` property specifies how the function provides the new table row, in this case by using the function return value. The name of the table is in `tableName`, and the connection string is in the app setting identified by `connection`.

##### C# script example

Here's C# script code that works with this trigger and binding. Notice that the name of the parameter that provides the queue message content is `order`; this name is required because the `name` property value in _function.json_ is `order`.

```csharp
#r "Newtonsoft.Json"

using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;

// From an incoming queue message that is a JSON object, add fields and write to Table storage
// The method return value creates a new row in Table Storage
public static Person Run(JObject order, ILogger log)
{
    return new Person() {
            PartitionKey = "Orders",
            RowKey = Guid.NewGuid().ToString(),
            Name = order["Name"].ToString(),
            MobileNumber = order["MobileNumber"].ToString() };
}

public class Person
{
    public string PartitionKey { get; set; }
    public string RowKey { get; set; }
    public string Name { get; set; }
    public string MobileNumber { get; set; }
}
```

##### Class library example

In a class library, the same trigger and binding information — queue and table names, storage accounts, function parameters for input and output — is provided by attributes instead of a _function.json_ file. Here's an example:

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

#### Additional resource

For more detailed examples of triggers and bindings please visit:

- [Azure Blob storage bindings for Azure Functions](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-storage-blob)
- [Azure Cosmos DB bindings for Azure Functions 2.x](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-cosmosdb-v2)
- [Timer trigger for Azure Functions](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-timer)
- [Azure Functions HTTP triggers and bindings](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-http-webhook)

### Connect functions to Azure services

Your function project references connection information by name from its configuration provider. It doesn't directly accept the connection details, allowing them to be changed across environments. For example, a trigger definition might include a `connection` property, but you can't set the connection string directly in a _function.json_. Instead, you would set `connection` to the name of an environment variable that contains the connection string.

The default configuration provider uses environment variables that are set in [Application Settings](https://learn.microsoft.com/en-us/azure/azure-functions/functions-how-to-use-azure-function-app-settings?tabs=portal#settings) when running in the Azure Functions service, or from the [local settings file](https://learn.microsoft.com/en-us/azure/azure-functions/functions-develop-local#local-settings-file) when developing locally.

#### Configure an identity-based connection

Some connections in Azure Functions are configured to use an identity instead of a secret. Support depends on the extension using the connection. In some cases, a connection string may still be required in Functions even though the service to which you're connecting supports identity-based connections.

:information_source: Identity-based connections are not supported with Durable Functions.

When hosted in the Azure Functions service, identity-based connections use a [managed identity](https://learn.microsoft.com/en-us/azure/app-service/overview-managed-identity?toc=/azure/azure-functions/toc.json). The system-assigned identity is used by default, although a user-assigned identity can be specified with the `credential` and `clientID` properties. When run in other contexts, such as local development, your developer identity is used instead.

#### Grant permission to the identity

Whatever identity is being used must have permissions to perform the intended actions. This is typically done by assigning a role in Azure RBAC or specifying the identity in an access policy, depending on the service to which you're connecting.

&#x2757; Some permissions might be exposed by the target service that are not necessary for all contexts. Where possible, adhere to the **principle of least privilege**, granting the identity only required privileges.

### Exercise: Create an Azure Function by using Visual Studio Code

In this exercise, you learn how to create a C# function that responds to HTTP requests. After creating and testing the code locally in Visual Studio Code, you'll deploy to Azure.

#### Prerequisites

Before you begin, make sure you have the following requirements in place:

- An **Azure account** with an active subscription. If you don't already have one, you can sign up for a free trial at <https://azure.com/free>.
- The [Azure Functions Core Tools](https://github.com/Azure/azure-functions-core-tools#installing) version 4.x.
- [Visual Studio Code](https://code.visualstudio.com/) on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms).
- [.NET 6](https://dotnet.microsoft.com/download/dotnet/6.0) is the target framework for the steps below.
- The [C# extension](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp) for Visual Studio Code.
- The [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) for Visual Studio Code.

#### Create your local project

In this section, you use Visual Studio Code to create a local Azure Functions project in C#. Later in this exercise, you publish your function code to Azure.

1. Choose the Azure icon in the Activity bar, then in the **Workspace** area, select **Add**.... Finally, select **Create Function**....

   ![Choosing to create a new project.](https://learn.microsoft.com/en-us/training/wwl-azure/develop-azure-functions/media/create-function.png)

   :information_source: A pop-up message will likely appear prompting you to create a new project, if it does select **Create new project**.

2. Choose a directory location for your project workspace and choose **Select**.

   :information_source: Be sure to select a project folder that is outside of an existing workspace.

3. Provide the following information at the prompts:
   - **Select a language**: Choose `C#`.
   - **Select a .NET runtime**: Choose `.NET 6`
   - **Select a template for your project's first function**: Choose `HTTP trigger`.
   - **Provide a function name**: Type `HttpExample`.
   - **Provide a namespace**: Type `My.Function`.
   - **Authorization level**: Choose `Anonymous`, which enables anyone to call your function endpoint.
   - **Select how you would like to open your project**: Choose `Add to workspace`.

Using this information, Visual Studio Code generates an Azure Functions project with an HTTP trigger.

#### Run the function locally

Visual Studio Code integrates with Azure Functions Core tools to let you run this project on your local development computer before you publish to Azure.

1. Make sure the terminal is open in Visual Studio Code. You can open the terminal by selecting **Terminal** and then **New Terminal** in the menu bar.

1. Press **F5** to start the function app project in the debugger. Output from Core Tools is displayed in the **Terminal** panel. Your app starts in the **Terminal** panel. You can see the URL endpoint of your HTTP-triggered function running locally.

   ![The endpoint of your HTTP-triggered function is displayed in the **Terminal** panel.](https://learn.microsoft.com/en-us/training/wwl-azure/develop-azure-functions/media/run-function-local.png)

1. With Core Tools running, go to the **Azure: Functions** area. Under **Functions**, expand **Local Project** > **Functions**. Right-click the `HttpExample` function and choose **Execute Function Now**....

   ![Steps for running the function locally as described in the text.](https://learn.microsoft.com/en-us/training/wwl-azure/develop-azure-functions/media/execute-function.png)

1. In **Enter request body** type the request message body value of `{ "name": "Azure" }`. Press **Enter** to send this request message to your function. When the function executes locally and returns a response, a notification is raised in Visual Studio Code. Information about the function execution is shown in **Terminal** panel.

1. Press **Shift + F5** to stop Core Tools and disconnect the debugger.

After you've verified that the function runs correctly on your local computer, it's time to use Visual Studio Code to publish the project directly to Azure.

#### Sign in to Azure

Before you can publish your app, you must sign in to Azure. If you're already signed in, go to the next section.

1. If you aren't already signed in, choose the Azure icon in the Activity bar, then in the **Azure: Functions** area, choose **Sign in to Azure**....

   ![Sign in to Azure within VS Code](https://learn.microsoft.com/en-us/training/wwl-azure/develop-azure-functions/media/functions-sign-into-azure.png)

1. When prompted in the browser, choose your Azure account and sign in using your Azure account credentials.

1. After you've successfully signed in, you can close the new browser window. The subscriptions that belong to your Azure account are displayed in the Side bar.

#### Create resources in Azure

In this section, you create the Azure resources you need to deploy your local function app.

1. Choose the Azure icon in the Activity bar, then in the **Resources** area select the **Create resource**... button.

   ![Location of the Deploy to Function app button.](https://learn.microsoft.com/en-us/training/wwl-azure/develop-azure-functions/media/create-resource.png)

1. Provide the following information at the prompts:

   - Select **Create Function App in Azure**...
   - **Enter a globally unique name for the function app**: Type a name that is valid in a URL path. The name you type is validated to make sure that it's unique in Azure Functions.
   - **Select a runtime stack**: Use the same choice you made in the _Create your local project_ section above.
   - **Select a location for new resources**: For better performance, choose a region near you.
   - **Select subscription**: Choose the subscription to use. _You won't see this if you only have one subscription._

   The extension shows the status of individual resources as they're being created in Azure in the **AZURE: ACTIVITY LOG** area of the terminal window.

1. When completed, the following Azure resources are created in your subscription, using names based on your function app name:
   - A resource group, which is a logical container for related resources.
   - A standard Azure Storage account, which maintains state and other information about your projects.
   - A consumption plan, which defines the underlying host for your serverless function app.
   - A function app, which provides the environment for executing your function code. A function app lets you group functions as a logical unit for easier management, deployment, and sharing of resources within the same hosting plan.
   - An Application Insights instance connected to the function app, which tracks usage of your serverless function.

#### Deploy the code

1. In the **WORKSPACE** section of the Azure bar select the **Deploy**... button, and then select **Deploy to Function App**....

   ![Image showing location of the **Deploy...** button.](https://learn.microsoft.com/en-us/training/wwl-azure/develop-azure-functions/media/deploy-function-app.png)

1. When prompted to **Select a resource**, choose the function app you created in the previous section.

1. Confirm that you want to deploy your function by selecting **Deploy** on the confirmation prompt.

   &#x2757; Publishing to an existing function overwrites any previous deployments.

#### Run the function in Azure

1. Back in the **Resources** area in the side bar, expand your subscription, your new function app, and Functions. **Right-click** the `HttpExample` function and choose **Execute Function Now**....

   ![Execute function now in Azure from Visual Studio Code](https://learn.microsoft.com/en-us/training/wwl-azure/develop-azure-functions/media/execute-function-now.png)

1. In **Enter request body** you see the request message body value of `{ "name": "Azure" }`. Press Enter to send this request message to your function.

1. When the function executes in Azure and returns a response, a notification is raised in Visual Studio Code.

   ![Executed function notification](https://learn.microsoft.com/en-us/training/wwl-azure/develop-azure-functions/media/executed-function-notification.png)
