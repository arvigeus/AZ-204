# Workflows

## Choose the best Azure service to automate your business processes

Learning objectives: Evaluate Azure services for integration and process automation scenarios

Scenario: You're a developer at a bike rental company that just acquired rights to operate at another university. You'll need to integrate with their existing bike rental system, including tracking, inventory, and rental registration. The new system must be ready before students arrive in August. Your company uses Azure and needs a cost-efficient way to scale as you expand to other universities without heavy upfront costs.

### Identify the technology options

**NB:** _Workflows: Business processes modeled in software are often called workflows_

| Workflow                 | Type         | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------------------ | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Logic Apps               | Design-first | Automates and integrates different parts of an application. You can create workflows visually or in code using JSON. It has over 200 connectors, including pre-built ones for Twitter and Office 365 Outlook. If your system isn't covered, you can create your own connector if it exposes a REST API.                                                                                                                                                                                                                                                                                                                                                                                       |
| Microsoft Power Automate | Design-first | Allows anyone to create workflows that integrate and orchestrate different components using UI. There are four types of flows available: automated (trigger from some event), button, scheduled, and business process. The service is built on Logic Apps, so it supports the same range of connectors and actions as Logic Apps, including custom connectors. The code generated cannot be eidted.                                                                                                                                                                                                                                                                                           |
| WebJobs                  | Code-first   | A feature of Azure App Service (a cloud-based hosting service for web apps, mobile back-ends, and RESTful APIs). Used to run a program or script automatically. There are two types: continuous and triggered (starts based on an event or schedule). You can write WebJob code in various languages. The WebJobs SDK reduces the amount of code needed to interact with Azure App Service and is only available for C# and the NuGet package manager.                                                                                                                                                                                                                                        |
| Azure Functions          | Code-first   | Allows you to run small pieces of code without worrying about the infrastructure needed to host it. You can write code in many supported languages. With the consumption plan option, you only pay for the time the code runs, and Azure automatically scales the function based on demand. You can write the code in the portal or use GitHub or Azure DevOps Services for source code management. It offers various templates, including HTTPTrigger, TimerTrigger, BlobTrigger, and CosmosDBTrigger, for executing code based on different events. It can integrate with various services within Azure or from third parties, which can trigger or receive data output from your function. |

These technologies have common features such as accepting inputs, running actions, including conditions, and producing outputs. Workflows created with these technologies can be either scheduled or triggered by an external event.

#### Design-first technologies compared

|                                  | Microsoft Power Automate                                    | Logic Apps                                                                                |
| -------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Intended users                   | Office workers and business analysts                        | Developers and IT pros                                                                    |
| Intended scenarios               | Self-service workflow creation                              | Advanced integration projects                                                             |
| Design tools                     | GUI only. Browser and mobile app                            | Browser and Visual Studio designer. Code editing is possible                              |
| Application Lifecycle Management | Power Automate includes testing and production environments | Logic Apps source code can be included in Azure DevOps and source code management systems |

#### Code-first technologies compared

|                                           | Azure WebJobs                         | Azure Functions                             |
| ----------------------------------------- | ------------------------------------- | ------------------------------------------- |
| Supported languages                       | C# if you're using the WebJobs SDK    | C#, Java, JavaScript, PowerShell, and so on |
| Automatic scaling                         | No                                    | Yes                                         |
| Development and testing in a browser      | No                                    | Yes                                         |
| Pay-per-use pricing                       | No                                    | Yes                                         |
| Integration with Logic Apps               | No                                    | Yes                                         |
| Package managers                          | NuGet if you're using the WebJobs SDK | NuGet and NPM                               |
| Can be part of an App Service application | Yes                                   | Yes (hosted under App Service plan)         |
| Provides close control of JobHost         | Yes                                   | No                                          |

#### Questions

Question: What are the four Azure technologies that can be used to build and implement workflows that integrate multiple systems?  
Answer: The four Azure technologies are Logic Apps, Microsoft Power Automate, WebJobs, and Azure Functions.

Question: What are the similarities between Logic Apps, Microsoft Power Automate, WebJobs, and Azure Functions?  
Answer: They can all accept inputs, run actions, include conditions, and produce outputs. They can also be triggered by a schedule or some external event.

Question: What is the main difference between design-first and code-first technologies in Azure?  
Answer: Design-first technologies, like Logic Apps and Microsoft Power Automate, involve a user interface for designing workflows and are more suitable for non-technical staff. Code-first technologies, like WebJobs and Azure Functions, are more suitable for developers who prefer writing code to orchestrate and integrate different applications into a single workflow.

Question: What is the main difference between Logic Apps and Microsoft Power Automate?  
Answer: Logic Apps is designed for developers and IT pros and is suitable for advanced integration projects. Microsoft Power Automate is intended for office workers and business analysts and is suitable for self-service workflow creation.

Question: What are the two types of WebJobs in Azure?  
Answer: The two types of WebJobs are Continuous and Triggered.

Question: How is the WebJobs SDK related to WebJobs in Azure?  
Answer: The WebJobs SDK is a set of classes and tools that makes it easier to program WebJobs using the .NET Framework or .NET Core Framework, specifically in C#. It reduces the amount of code required to interact with the Azure App Service.

Question: What are some examples of Azure Function templates?  
Answer: Examples of Azure Function templates include HTTPTrigger, TimerTrigger, BlobTrigger, and CosmosDBTrigger.

Question: What are the main reasons to choose WebJobs over Azure Functions?  
Answer: You might choose WebJobs over Azure Functions if you want the code to be part of an existing App Service application and be managed as part of that application, or if you need close control over the object that listens for events that trigger the code (the JobHost class).

Question: What are connectors in the context of Logic Apps?  
Answer: Connectors are Logic Apps components that provide an interface to external services, allowing integration with various systems. They can be pre-built connectors, such as Twitter or Office 365 Outlook, or custom connectors created for unique systems that expose a REST API.

Question: What are the four different types of flow that can be created with Microsoft Power Automate?  
Answer: The four types of flow are Automated, Button, Scheduled, and Business process.

Question: What are the main differences between Azure WebJobs and Azure Functions?  
Answer: Azure Functions support multiple languages, offer automatic scaling, allow development and testing in a browser, provide pay-per-use pricing, and have integration with Logic Apps, while Azure WebJobs primarily support C# and do not offer these features.

Question: How does the consumption plan in Azure Functions affect billing?  
Answer: With the consumption plan option, you only pay for the time when the code runs, providing a cost-effective solution as Azure automatically scales your function in response to user demand.

Question: How can Azure Functions integrate with other services?  
Answer: Azure Functions can integrate with many different services both within Azure and from third parties. These services can trigger your function, send data input to your function, or receive data output from your function.

Question: How does Microsoft Power Automate's relationship with Logic Apps affect its capabilities?  
Answer: Since Microsoft Power Automate is built on Logic Apps, it supports the same range of connectors and actions as Logic Apps, allowing for similar integration capabilities. Custom connectors can also be used in Microsoft Power Automate.

Question: What are some examples of external events that can trigger Azure workflows?  
Answer: Examples of external events that can trigger Azure workflows include the arrival of a new tweet, a new file being uploaded, a new blob being added to an Azure Storage account, or new or updated documents in a NoSQL database.

Question: What are the supported languages for writing code in WebJobs?  
Answer: WebJobs support scripting using Shell Script (Windows, PowerShell, Bash) and programming languages such as PHP, Python, Java, or JavaScript. Additionally, you can use .NET Framework or .NET Core Framework with .NET languages like C# or VB.NET.

Question: In which scenarios would a design-first approach be more suitable than a code-first approach for implementing workflows in Azure?  
Answer: A design-first approach, using Logic Apps or Microsoft Power Automate, would be more suitable when the workflow designers are non-technical staff, office workers, or business analysts who prefer a user interface for designing workflows and are not experienced with writing code.

Question: Can you explain the difference between Continuous and Triggered WebJobs?  
Answer: Continuous WebJobs start immediately when created and run in a continuous loop, whereas Triggered WebJobs start based on a binding event, on a schedule, or when triggered manually (on demand).

Question: What are some advantages of using Azure Functions over traditional web applications for specific tasks?  
Answer: Azure Functions provide automatic scaling, pay-per-use pricing, easier integration with other services, and simplified administration, making them a more cost-effective and manageable solution for certain tasks compared to traditional web applications.

Question: Can you use Azure Functions in conjunction with Logic Apps?  
Answer: Yes, Azure Functions can be integrated with Logic Apps, allowing you to create more versatile and powerful workflows that leverage the capabilities of both services.

Question: What is the purpose of using the design-first approach with Logic Apps and Microsoft Power Automate?  
Answer: The design-first approach allows users to visually draw out complex workflows that model business processes, making it easier for non-technical staff to create and understand the workflow. This approach mimics the way business analysts discuss and plan business processes by drawing flow diagrams on paper.

Question: How does the design-first approach in Microsoft Power Automate differ from that of Logic Apps?  
Answer: While both Microsoft Power Automate and Logic Apps use design-first approaches, Microsoft Power Automate is designed for non-technical staff, like office workers and business analysts, who prefer a graphical user interface (GUI) for creating workflows. Logic Apps, on the other hand, is designed for developers and IT pros who work on advanced integration projects and may also prefer to work with code.

Question: What is the role of bindings in Azure Functions?  
Answer: Bindings in Azure Functions are used to connect the function to data within other services. They simplify the integration between the function and other components by automatically handling data input and output, making it easier to read from or write to various services without writing additional code.

Question: How can Azure DevOps be used with Logic Apps?  
Answer: Logic Apps source code can be included in Azure DevOps and source code management systems, allowing for better application lifecycle management, collaboration, and version control of the Logic Apps workflows. This integration is particularly useful for IT professionals, developers, and DevOps practitioners who work on advanced integration projects.

Question: Is it possible to mix different Azure technologies for implementing various parts of a workflow?  
Answer: Yes, it is possible to mix different Azure technologies for implementing various parts of a workflow. You can call one workflow from another, for example, a workflow implemented in Microsoft Power Automate can easily call another that is built as an Azure Function.

Question: What is one reason to mix technologies used in your business processes?  
Answer: One reason to mix technologies in your business processes is to give users control over a small section of a complete workflow by implementing that section in Microsoft Power Automate and then calling that flow from a Logic App, Web Job, or Function.

Question: In what situations might WebJobs be a better choice than Azure Functions for implementing workflows?  
Answer: WebJobs might be a better choice when: You have an existing Azure App Service application, and you want to model the workflow within the application. You have specific customizations that you want to make to the JobHost that aren't supported by Azure Functions.

Question: Why should you consider Azure Functions as the default choice for a code-first approach?  
Answer: Azure Functions should be considered the default choice due to the extra features it offers, including a wider range of trigger events and supported languages, the ability to develop test code in the browser, and the pay-per-use pricing model.

Question: Which tools for creating workflows support code editing?  
Answer: Logic Apps (supports both UI and code), Azure Functions, WebJobs.

Question: Which tools for creating workflows does not support code editing?  
Answer: There is no way to edit the source code that Microsoft Power Automate creates. Extra help and templates are provided for common types of workflow.

Question: Which would be cheaper: Azure Functions or WebJobs?  
Answer: Azure Function can run on a consumption plan, so you only pay when the function runs. With Web Jobs, you pay for the entire VM or App Service Plan that hosts the job.

Question: You have on-premises SharePoint server, which isn't as reliable as a cloud-based server would be, developers want to carefully control the way the workflow retries this connection, if there's a failure. Which would you choose?  
Answer: Azure WebJobs permits developers to control retry policies.

#### Further reading

- [Choose the right integration and automation services in Azure](https://learn.microsoft.com/en-us/azure/azure-functions/functions-compare-logic-apps-ms-flow-webjobs)
- [What is Azure Logic Apps?](https://learn.microsoft.com/en-us/azure/logic-apps/logic-apps-overview)
- [Get started with Power Automate](https://learn.microsoft.com/en-us/power-automate/getting-started)
- [Run Background tasks with WebJobs in Azure App Service](https://learn.microsoft.com/en-us/azure/app-service/webjobs-create)
- [An introduction to Azure Functions](https://learn.microsoft.com/en-us/azure/azure-functions/functions-overview)
- [Create a function that integrates with Azure Logic Apps](https://learn.microsoft.com/en-us/azure/azure-functions/functions-twitter-email)