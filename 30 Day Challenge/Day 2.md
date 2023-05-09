# Create serverless logic with Azure Functions

Learning objectives:

- Decide if serverless computing is right for your business needs.
- Create an Azure function app in the Azure portal.
- Execute a function using triggers.
- Monitor and test your Azure function from the Azure portal.

Serverless computing, also known as function as a service (FaaS), is a cloud-based microservice that runs your business logic as functions. With Azure Functions, you can write your code in the language of your choice, and the cloud provider handles infrastructure scaling automatically, billing only for resources used. This avoids over-allocating infrastructure and simplifies your code by letting you focus on the business logic. Functions are event-driven and can be triggered by HTTP requests or messages added to a queue. They can also be used in traditional compute environments. However, functions have a default timeout of 5 minutes and a maximum timeout of 10 minutes, so they may not be suitable for long-running processes. If you expect clients to execute your function continuously, it may be cheaper to host your service on a virtual machine, or use durable functions. While scaling, only one function app instance can be created every 10 seconds, for up to 200 total instances.

Azure offers three hosting plans for function apps: Consumption, Premium, and Dedicated (App Service). The Consumption plan is recommended for serverless computing, as it provides automatic scaling and bills only when functions are running. The Premium plan also offers dynamic scaling and lets you specify a minimum number of VM instances to reduce cold starts, while the Dedicated plan allows functions to run continuously on a user-defined VM. The default timeout for the Consumption plan is 5 minutes, which can be increased to 10 minutes, while the Premium plan has a default of 30 minutes and essentially no limit. All function apps must be linked to a storage account, which is used for logging and managing execution triggers. On the Consumption plan, the storage account also stores function code and configuration files.

Azure Functions are event-driven and are executed in response to a trigger. Each function requires one trigger that can be an HTTP request, scheduled timer, or events from various Azure services. Bindings connect data and services to functions and handle input and output data processed by the function. Supported languages that use the function.json file can create and edit functions directly in the Azure portal, while other languages must be developed outside of the portal and deployed to Azure. Function templates provide predefined triggers and generate default code and configuration information. To test a function, you can use the Azure portal or manually trigger it with tools like Postman or cURL. Application Insights integration enables monitoring of function operations with metrics, failure diagnosis, and logging.

## Create a function app

1) Sign in to the Azure portal using your Azure account.
2) Under Azure services, select Create a resource.
3) The Create a resource pane appears.
4) In the menu, select Compute, and then search for and select Function App. Select the Create button. The Create Function App pane appears.
5) On the Basics tab, enter values for each setting.
6) Select Review + create, and then select Create. Deployment takes a few minutes. You receive a notification when deployment is completed.

## Questions

Question: What is serverless compute?  
Answer: Serverless compute is a cloud-hosted service where business logic runs as functions, with the cloud provider managing the infrastructure.

Question: What is Azure Functions?  
Answer: Azure Functions is a serverless platform that hosts business logic, supports various programming languages, and scales automatically.

Question: How does serverless computing prevent over-allocation?  
Answer: Serverless computing automatically scales resources based on demand, meaning you only pay for what you use.

Question: What triggers functions in serverless computing?  
Answer: Functions are event-driven, executing in response to triggers like an HTTP request or a message being added to a queue.

Question: Can serverless functions be used in non-serverless environments?  
Answer: Yes, functions can be deployed in non-serverless environments, providing flexibility in scaling and network configurations.

Question: What are the time limitations of Azure Functions?  
Answer: Functions have a default timeout of five minutes, extendable to ten. For HTTP requests, the timeout is 2.5 minutes.

Question: What if the execution time exceeds the serverless limit?  
Answer: Functions with longer execution times can be hosted on a virtual machine.

Question: How does execution frequency affect serverless computing cost?  
Answer: Continuous execution may make hosting on a virtual machine more cost-effective.

Question: Is there a limit to the traffic a single instance can handle?  
Answer: While new instance creation is limited, each instance can handle multiple executions concurrently. Different triggers, though, may have different scaling requirements.

Question: What is meant by "stateless logic" in serverless computing?  
Answer: Stateless logic means functions are created and destroyed on demand. If state is required, it can be stored in a separate storage service.

Question: What are the benefits of event-driven functions?  
Answer: Event-driven functions simplify code as you only need to specify where data comes from and where it goes, not to watch for triggers like queues or blobs.

Question: What is the flexibility provided by functions in traditional compute environments?  
Answer: Functions can be taken from a serverless environment and deployed in a non-serverless one, allowing you to manage scaling, run on virtual networks, or isolate your functions.

Question: Are there drawbacks to serverless computing?  
Answer: Yes, functions have a maximum timeout and there are limitations on instance creation during scaling. Also, continuous execution may be more cost-effective on a virtual machine.

Question: What is a Durable Function in Azure?  
Answer: Durable Functions allow you to orchestrate the executions of multiple functions without any timeout, useful for tasks that exceed the normal Azure Functions timeout.

Question: How does the choice of trigger impact the scalability of functions?  
Answer: Different types of triggers have different scaling requirements, so it's important to research your choice of trigger and its limits.

Question: What are Azure Logic Apps?  
Answer: Azure Logic Apps are one of the ways to build serverless architecture on Azure, similar to Azure Functions.

Question: Why would one consider Azure Functions for hosting business logic code?  
Answer: Azure Functions provides automatic scaling, no server management, and charges only based on resource usage, making it a good option for hosting business logic.

Question: What's the limit on the number of instances that can be created while scaling?  
Answer: While scaling, one function app instance can be created every 10 seconds, up to a total of 200 instances.

Question: How are costs calculated in serverless computing?  
Answer: In serverless computing, you're billed only when your function is processing work, based on the resources used.

Question: Why might serverless computing not be the right choice for some businesses?  
Answer: If functions require more execution time than the serverless limit or are executed continuously, it may be more cost-effective to host the service on a virtual machine.

Question: What are the three hosting plans for Function apps?  
Answer: Function apps can be hosted on a Consumption plan, Premium plan, or Dedicated (App Service) plan.

Question: What is the Consumption plan?  
Answer: The Consumption plan is a serverless plan that offers automatic scaling and charges only when functions are running. It has a configurable timeout period for function execution.

Question: How does the Premium plan differ from the Consumption plan?  
Answer: The Premium plan dynamically scales resources like the Consumption plan, but also allows a minimum number of VM instances to stay warm to reduce "cold starts." It also allows functions to connect to and run inside virtual networks.

Question: What's unique about the timeout for apps in a Premium plan?  
Answer: Apps in a Premium plan have a default timeout of 30 minutes, but they can essentially run for an unlimited time, depending on server availability.

Question: What is the Dedicated (App Service) plan?  
Answer: The Dedicated plan allows a function to run continuously on a defined VM, avoiding timeout periods. However, it requires management of app resources, making it technically not a serverless plan.

Question: When might the Dedicated (App Service) plan be a better choice?  
Answer: The Dedicated plan might be a better choice when there are excess App Service resources available to also run your functions.

Question: What is required when creating a function app?  
Answer: When creating a function app, it must be linked to a storage account for internal operations like logging function executions and managing execution triggers.

Question: Where is the function code and configuration file stored in the Consumption plan?  
Answer: In the Consumption plan, the function code and configuration file are stored in the linked storage account.

Question: What triggers the execution of Functions?  
Answer: Functions are event driven and are triggered by various events like HTTP requests, a scheduled timer, or events from Azure services like Blob Storage, Cosmos DB, Event Grid, Event Hubs, Queue Storage, and Service Bus.

Question: What are bindings in Azure Functions?  
Answer: Bindings are a way to connect data and services to your function without needing to write the code to manage these connections. They can be input (data read by your code) or output (data written by your code).

Question: How does a trigger relate to bindings?  
Answer: A trigger is a type of input binding that initiates the execution of the function.

Question: How do you define a binding?  
Answer: A binding is defined in the function.json file of a function. An example could be a function triggered by a message in Azure Queue Storage and outputting to Azure Table Storage.

Question: What languages does the Azure portal support for creating functions?  
Answer: The Azure portal supports JavaScript, PowerShell, Python, and C# Script (.csx) for creating and editing functions.

Question: What languages are not supported by the portal for creating functions?  
Answer: Languages that are not supported by the portal and must be developed outside of it include C#, Java, Python (v2 programming model), and JavaScript/TypeScript (Node.js v4 programming model).

Question: What are function templates?  
Answer: Function templates are predefined structures based on specific triggers that help you get started with creating your first function.

Question: How can you test your Azure function?  
Answer: You can test your Azure function either in the Azure portal or manually by triggering the configured trigger.

Question: What tool can be used for monitoring Azure functions?  
Answer: Azure functions can be monitored using the Azure portal's monitoring dashboard, which is enabled by integrating Application Insights.

Question: How can you add logging statements to your function?  
Answer: Logging statements can be added to your function by writing to the log method on the context object which is passed to the handler. For example: context.log('Enter your logging statement here').

Question: How are Azure Functions triggered?  
Answer: Azure Functions are event-driven, meaning they run in response to an event. The event type that starts a function is called a trigger. Triggers can be HTTP requests, a scheduled timer, or events from Azure services like Blob Storage, Cosmos DB, Event Grid, Event Hubs, Queue Storage, and Service Bus.

Question: What is the purpose of bindings in Azure Functions?  
Answer: Bindings in Azure Functions are used to connect data and services to your function. They manage the input and output data processed by the function. A function can have zero or more bindings.

Question: What is the difference between a trigger and a binding in Azure Functions?  
Answer: A trigger in Azure Functions initiates the execution of code, while a binding is used to connect data and services to your function. A trigger is a special type of input binding.

Question: How can you define a binding in Azure Functions?  
Answer: You can define a binding in the function.json file of your Azure Function. This file includes details about the trigger and any input and output bindings the function has.

Question: Which programming languages are supported in the Azure portal for creating functions?  
Answer: The Azure portal supports creating and editing functions in JavaScript, PowerShell, Python, and C# Script (.csx).

Question: What are function templates in Azure Functions?  
Answer: Function templates in Azure Functions are predefined structures based on a specific type of trigger. They provide default code and configuration information to help you create your first function.

Question: How do you test Azure Functions?  
Answer: You can test Azure Functions in the Azure portal or manually by triggering the configured trigger. For instance, you can use a tool like Postman or cURL to initiate an HTTP request to your function endpoint URL.

Question: What monitoring tools are available for Azure Functions?  
Answer: Azure Functions can be monitored using the Azure portal's monitoring dashboard, which can be enabled by integrating with Application Insights.

Question: How do you log statements in Azure Functions?  
Answer: You can log statements in Azure Functions by using the log method on the context object. This allows you to add log information that can be viewed in the Logs pane when running a test.
