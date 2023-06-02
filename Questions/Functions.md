# Azure Functions

Question: Which of the following Azure Functions hosting plans is best when predictive scaling and costs are required?

- [ ] Functions Premium Plan
- [x] Dedicated plan
- [ ] Consumption plan

Answer: Dedicated plans run in App service which supports setting autoscaling rules based on predictive usage.

---

Question: An organization wants to implement a serverless workflow to solve a business problem. One of the requirements is the solution needs to use a designer-first (declarative) development model. Which of the choices below meets the requirements?

- [ ] Azure Functions
- [x] Azure Logic Apps
- [ ] WebJobs

Answer: Azure Logic Apps enables serverless workloads and uses a designer-first (declarative) development model.

---

Question: Which of the following choices is required for a function to run?

- [ ] Binding
- [x] Trigger
- [ ] Both triggers and bindings

Answer: A trigger defines how a function is invoked and a function must have exactly one trigger.

---

Question: Which of the following choices supports both the `in` and `out` direction settings?

- [x] Bindings
- [ ] Trigger
- [ ] Connection value

Answer: Input and output bindings use `in` and `out`.

---

Question: What is the difference in terms of cost between `Consumption` and `Premium` plans and any of the App Service plans?

Answer: `Consumption` and `Premium` plans can be more cost-efficient if you have sporadic usage patterns. App Service plans could be more predictable in terms of cost and potentially cheaper for continuous heavy usage.

---

Question: Which of the following can trigger an Azure Function:

- [x] Blob storage
- [x] Azure Cosmos DB
- [x] Event Grid
- [x] Event Hubs
- [x] HTTP & webhooks
- [x] IoT Hub
- [ ] Mobile Apps
- [ ] Notification Hubs
- [x] Queue storage
- [ ] SendGrid
- [x] Service Bus
- [x] SignalR
- [ ] Table storage
- [x] Timer

Answer: `Table storage`, `Mobile Apps`, `Notification Hubs`, `SendGrid`, and `Twilio` are not valid triggers.

---

Question: Which triggers in Azure Functions are supported on Consumption plan:

- [x] Blob storage
- [x] Azure Cosmos DB
- [x] Event Grid
- [x] Event Hubs
- [x] IoT Hub
- [ ] Notification Hubs
- [x] Queue storage
- [x] Service Bus
- [ ] RabbitMQ
- [x] SignalR
- [ ] Kafka
- [ ] Table storage
- [x] Timer

Answer: `Table storage` and `Notification Hubs` are not valid triggers. `RabbitMQ` and `Kafka` are not supported on Consumption plan.

---

Question: Which of the following can be input binding in an Azure Function:

- [x] Blob storage
- [x] Azure Cosmos DB
- [ ] Event Grid
- [ ] Event Hubs
- [ ] HTTP & webhooks
- [ ] IoT Hub
- [x] Mobile Apps
- [ ] Notification Hubs
- [ ] Queue storage
- [ ] SendGrid
- [ ] Service Bus
- [x] SignalR
- [x] Table storage
- [ ] Timer

Answer: You can only read from objects that store data, not queues.

---

Question: Which of the following can be output binding in an Azure Function:

- [x] Blob storage
- [x] Azure Cosmos DB
- [x] Event Grid
- [x] Event Hubs
- [x] HTTP & webhooks
- [ ] IoT Hub
- [x] Mobile Apps
- [x] Notification Hubs
- [x] Queue storage
- [x] SendGrid
- [x] Service Bus
- [x] SignalR
- [x] Table storage
- [ ] Timer

Answer: Everything but `Timer` and `IoT` hub.

---

Question: What are the similarities and the differences between input and output binding? Give example for blob storage.

Answer: Both access an external storage object, the difference is input bindings read from it, while output write to it

- `Blob("samples-workitems/{queueTrigger}", FileAccess.Read)` is an input binding (`Read`)
- `Blob("samples-workitems/{queueTrigger}", FileAccess.Write)` is an output binding (`Write`)

---

Question: Write an Azure function that uses HTTP trigger and takes `id` from the url and `text` from request body, then appends the `text` to existing blob with id `id` and logs its new content. Use `Steam` for the blob.

```cs
[FunctionName("BlobAppend")]
public static void Run(
    /* Triggers and Bindings here */
    ILogger log)
{
    // Code here
}
```

Answer:

```cs
[FunctionName("BlobAppend")]
public static void Run(
    [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req,
    [Blob("{id}", FileAccess.ReadWrite)] Stream myBlob,
    ILogger log)
{
    var id = req.Query["id"];
    var requestBody = new StreamReader(req.Body).ReadToEnd();
    dynamic data = JsonConvert.DeserializeObject(requestBody);

    // Read existing content from the blob
    var reader = new StreamReader(myBlob);
    var content = reader.ReadToEnd() + data?.text;
    var contentBytes = System.Text.Encoding.UTF8.GetBytes(content);

    // Write to the blob
    myBlob.Write(contentBytes, 0, contentBytes.Length);
    myBlob.Position = 0;

    log.LogInformation($"Blob: {id}\n Content:{content} \n Size: {myBlob.Length} bytes");
}
```

---

Question: Suppose you're working for an e-commerce company that has high traffic and they're dealing with large amounts of customer orders. The company wants to keep a track of every order received in real-time and then send an automated confirmation email to the customer. Which Azure service would you choose to trigger your Azure function? Fill in the triggers and bindings in the following code:

```cs
[FunctionName("ProcessOrder")]
public static void Run(
    /* Triggers and Bindings here */

    ILogger log)
{
    // Process the incoming order
    // Prepare an email message
    // Assign the message to the 'message' output binding to send email
}
```

Answer: In this case, the Azure function could be triggered by the Service Bus where each order corresponds to a message in a Service Bus Queue or Topic. The function could then use the SendGrid output binding to send a confirmation email to the customer.

```cs
[FunctionName("ProcessOrder")]
public static void Run(
    [ServiceBusTrigger("<queue-name>", Connection = "ServiceBusConnectionString")]
    Order order,

    [SendGrid(ApiKey = "SendGridApiKey")]
    out SendGridMessage message,

    ILogger log)
{
    // Process the incoming order
    // Prepare an email message
    // Assign the message to the 'message' output binding to send email
}
```

---

Question: You've been assigned a project where your task is to create an Azure function that triggers automatically every 10 minutes. The function must access a data source, process the data, and update another source with the processed data. Fill in the triggers and bindings in the following code:

```cs
[FunctionName("ProcessData")]
public static void Run(
    /* Triggers and Bindings here */

    ILogger log)
{
    // Read data from inputData
    // Process the data
    // Write the processed data to outputData
}
```

Answer: For this, you could use a Timer Trigger for the Azure Function which would make it execute every 10 minutes. The function could use an input binding to fetch data from your chosen data source (such as Blob Storage or Cosmos DB), and an output binding to the same (or different) service to store the processed data.

```cs
[FunctionName("ProcessData")]
public static void Run(
    [TimerTrigger("0 */10 * * * *")] TimerInfo myTimer,

    [Blob("<container-name>/<blob-name>", FileAccess.Read, Connection = "BlobStorageConnectionString")]
    Stream inputData,

    [Blob("<container-name>/<blob-name>", FileAccess.Write, Connection = "BlobStorageConnectionString")]
    Stream outputData,

    ILogger log)
{
    // Read data from inputData
    // Process the data
    // Write the processed data to outputData
}
```

---

Question: A company requires a function that can process incoming files automatically. They upload images regularly into a storage service, and they want those images to be resized automatically. Which Azure service could you use to trigger this function? Fill in the triggers and bindings in the following code:

```cs
[FunctionName("ResizeImage")]
public static void Run(
    /* Triggers and Bindings here */

    string name,
    ILogger log)
{
    // Read the inputImage
    // Resize the image
    // Write the resized image to outputImage
}
```

Answer: This scenario is perfect for a Blob Storage trigger. The function could be triggered whenever a new blob (image) is added to the Blob Storage. Inside the function, you could use an image processing library to resize the images.

```cs
[FunctionName("ResizeImage")]
public static void Run(
    [BlobTrigger("<container-name>/{name}", Connection = "BlobStorageConnectionString")]
    Stream inputImage,

    [Blob("<container-name>/{name}", FileAccess.Write, Connection = "BlobStorageConnectionString")]
    Stream outputImage,

    string name,
    ILogger log)
{
    // Read the inputImage
    // Resize the image
    // Write the resized image to outputImage
}
```

---

Question: Imagine you're building a real-time analytics solution for a social media company. They want to monitor and analyze user posts and reactions in real-time. Your job is to design an Azure function that gets triggered by this real-time activity. What would be the most suitable Azure services to achieve this? Fill in the triggers and bindings in the following code:

```cs
[FunctionName("AnalyzeUserActivity")]
public static void Run(
    /* Triggers and Bindings here */

    ILogger log)
{
    // Loop over the events array
    // For each event, analyze the event data
    // Write the analysis results to Cosmos DB using the 'document' output binding
}
```

Answer: Event Hubs would be a great choice for triggering the Azure function for real-time monitoring and analysis. Event Hubs are designed to capture streaming data like the one from social media feeds. You could then process the data as per the company's requirements.

```cs
[FunctionName("AnalyzeUserActivity")]
public static void Run(
    [EventHubTrigger("<event-hub-name>", Connection = "EventHubConnectionString")]
    EventData[] events,

    [CosmosDB("<database-name>", "<collection-name>", ConnectionStringSetting = "CosmosDBConnectionString")]
    out dynamic document,

    ILogger log)
{
    // Loop over the events array
    // For each event, analyze the event data
    // Write the analysis results to Cosmos DB using the 'document' output binding
}
```

---

Question: You are in charge of building a serverless application that needs to communicate with an API. This application will receive data via HTTP requests and based on the data received, it needs to update a database. Can you describe how would you design the Azure Function to serve this purpose? Fill in the triggers and bindings in the following code:

```cs
[FunctionName("UpdateDatabase")]
public static async Task<IActionResult> Run(
    /* Triggers and Bindings here */

    ILogger log)
{
    // Parse the incoming HTTP request
    // Process the data
    // Add the processed data to Cosmos DB using the 'outputDocuments' output binding
    // Return a success response
}
```

Answer: This is an example of an HTTP Trigger. The Azure function can be triggered by an HTTP request containing the data. The function could use an output binding to Azure Cosmos DB (or any other database service) to update the database based on the received data.

```cs
[FunctionName("UpdateDatabase")]
public static async Task<IActionResult> Run(
    [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)]
    HttpRequest req,

    [CosmosDB("<database-name>", "<collection-name>", ConnectionStringSetting = "CosmosDBConnectionString")]
    IAsyncCollector<dynamic> outputDocuments,

    ILogger log)
{
    // Parse the incoming HTTP request
    // Process the data
    // Add the processed data to Cosmos DB using the 'outputDocuments' output binding
    // Return a success response
}
```

---

Question: A logistics company wants to build a system that can handle incoming requests for package pickups and deliveries. They need a function that gets triggered every time a new pickup or delivery request is placed. The function should then push this information to a queue for further processing. How would you approach this requirement? Fill in the triggers and bindings in the following code:

```cs
[FunctionName("HandleDeliveryRequest")]
public static void Run(
    /* Triggers and Bindings here */

    ILogger log)
{
    // Process the incoming deliveryRequest
    // Prepare the outputRequest
    // The outputRequest is automatically added to the queue
}
```

Answer: Queue Storage could be the trigger in this scenario. When a new pickup or delivery request is received, a new message could be added to a Queue Storage, which would trigger the function. The function could then perform necessary processing or further add the information to another queue for further processing.

```cs
[FunctionName("HandleDeliveryRequest")]
public static void Run(
    [QueueTrigger("<queue-name>", Connection = "StorageConnectionString")]
    DeliveryRequest deliveryRequest,

    [Queue("<output-queue-name>", Connection = "StorageConnectionString")]
    out DeliveryRequest outputRequest,

    ILogger log)
{
    // Process the incoming deliveryRequest
    // Prepare the outputRequest
    // The outputRequest is automatically added to the queue
}
```

---

Question: You are working on a project that requires automatic clean-up of older records in a database every day at a specific time. The clean-up task should be an Azure function that gets triggered at the specified time. Can you outline a solution for this? Fill in the triggers and bindings in the following code:

```cs
[FunctionName("CleanUpOldRecords")]
public static void Run(
    /* Triggers and Bindings here */

    ILogger log)
{
    // Loop over oldRecords
    // For each record, mark it for deletion or update it as per your logic
    // Add the updated records to Cosmos DB using the 'outputDocuments' output binding
}
```

Answer: A Timer trigger would be the ideal choice here. You can schedule the Azure function to run at the specified time daily. The function could use input and output bindings to Azure Cosmos DB (or another database service) to fetch and clean-up the older records.

```cs
[FunctionName("CleanUpOldRecords")]
public static void Run(
    [TimerTrigger("0 0 * * *")] TimerInfo myTimer,

    [CosmosDB("<database-name>", "<collection-name>", ConnectionStringSetting = "CosmosDBConnectionString", SqlQuery = "<SQL-query-for-old-records>")]
    IReadOnlyList<dynamic> oldRecords,

    [CosmosDB("<database-name>", "<collection-name>", ConnectionStringSetting = "CosmosDBConnectionString")]
    IAsyncCollector<dynamic> outputDocuments,

    ILogger log)
{
    // Loop over oldRecords
    // For each record, mark it for deletion or update it as per your logic
    // Add the updated records to Cosmos DB using the 'outputDocuments' output binding
}
```

---

Question: Let's consider a case where you're dealing with an IoT project. You're receiving huge amounts of telemetry data from IoT devices, and this data should trigger an Azure function that analyses the data in near real-time. How would you set up the Azure function for this scenario? Fill in the triggers and bindings in the following code:

```cs
[FunctionName("ProcessTelemetryData")]
public static void Run(
    /* Triggers and Bindings here */

    ILogger log)
{
    // Loop over the events array
    // For each event, process the telemetry data
    // Write the processed data to Cosmos DB using the 'document' output binding
}
```

Answer: Event Hubs would again be the right choice for this scenario, given their capability to handle large amounts of data in real-time. The telemetry data could be sent to an Event Hub, which would trigger the function. The function could then analyze the data and use an output binding to store the analysis results.

```cs
[FunctionName("ProcessTelemetryData")]
public static void Run(
    [EventHubTrigger("<event-hub-name>", Connection = "EventHubConnectionString")]
    EventData[] events,

    [CosmosDB("<database-name>", "<collection-name>", ConnectionStringSetting = "CosmosDBConnectionString")]
    out dynamic document,

    ILogger log)
{
    // Loop over the events array
    // For each event, process the telemetry data
    // Write the processed data to Cosmos DB using the 'document' output binding
}
```

---

Question: A news company needs an Azure function to collect real-time news data from different web sources (webhooks) and then store the collected data in a specific format into a database. What strategy would you recommend? Fill in the triggers and bindings in the following code:

```cs
[FunctionName("CollectNewsData")]
public static async Task<IActionResult> Run(
    /* Triggers and Bindings here */

    ILogger log)
{
    // Parse the incoming HTTP request to get the news data
    // Process the news data, if necessary
    // Add the news data to Cosmos DB using the 'outputDocuments' output binding
    // Return a success response
}
```

Answer: An HTTP trigger could be used to collect real-time news data from different web sources. The function could then format the collected data and use an output binding to Azure Cosmos DB (or another database service) to store the data.

```cs
[FunctionName("CollectNewsData")]
public static async Task<IActionResult> Run(
    [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)]
    HttpRequest req,

    [CosmosDB("<database-name>", "<collection-name>", ConnectionStringSetting = "CosmosDBConnectionString")]
    IAsyncCollector<dynamic> outputDocuments,

    ILogger log)
{
    // Parse the incoming HTTP request to get the news data
    // Process the news data, if necessary
    // Add the news data to Cosmos DB using the 'outputDocuments' output binding
    // Return a success response
}
```

---

Question: In a microservice architecture, you have an Azure function that needs to send messages to multiple subscribers. The subscribers then process these messages in their own time. How would you design this system? Fill in the triggers and bindings in the following code:

```cs
[FunctionName("BroadcastMessage")]
public static void Run(
    /* Triggers and Bindings here */

    ILogger log)
{
    // Process the incoming message, if necessary
    // Prepare the outputMessage
    // The outputMessage is automatically sent to the Service Bus topic
}
```

Answer: In this microservice architecture, the Azure function could use the Service Bus topic to send messages to multiple subscribers. Each subscriber could listen to the topic and process the message in their own time. This way, the Azure function doesn't need to know about the subscribers and the subscribers can process messages independently.

```cs
[FunctionName("BroadcastMessage")]
public static void Run(
    [ServiceBusTrigger("<topic-name>", "<subscription-name>", Connection = "ServiceBusConnectionString")]
    Message inputMessage,

    [ServiceBus("<output-topic-name>", Connection = "ServiceBusConnectionString")]
    out Message outputMessage,

    ILogger log)
{
    // Process the incoming message, if necessary
    // Prepare the outputMessage
    // The outputMessage is automatically sent to the Service Bus topic
}
```

---

Question: Imagine you're part of a cloud-based company that manages a large number of resources across multiple Azure subscriptions. The company wants to log all resource state changes for compliance and auditing. Which Azure service would you choose to trigger your Azure function? Fill in the triggers and bindings in the following code:

```cs
[FunctionName("LogResourceChanges")]
public static void Run(
    /* Triggers and Bindings here */

    ILogger log)
{
    // Process the incoming event
    // Prepare the document based on the event data
    // The document is automatically added to Cosmos DB
}
```

Answer: This would be a perfect scenario for an Event Grid trigger. Azure Event Grid can send an event whenever a state change occurs in Azure resources, triggering your Azure Function. The function can then log these changes to a data store using an output binding (like Azure Cosmos DB or Blob Storage).

```cs
[FunctionName("LogResourceChanges")]
public static void Run(
    [EventGridTrigger]
    EventGridEvent eventGridEvent,

    [CosmosDB("<database-name>", "<collection-name>", ConnectionStringSetting = "CosmosDBConnectionString")]
    out dynamic document,

    ILogger log)
{
    // Process the incoming event
    // Prepare the document based on the event data
    // The document is automatically added to Cosmos DB
}
```

---

Question: You've been tasked with developing a system to handle real-time reactions to blog posts on a website. The system needs to notify all registered users whenever a new blog post is published. What Azure services would you recommend to set up the Azure function? Fill in the triggers and bindings in the following code:

```cs
[FunctionName("NotifyUsers")]
public static async void Run(
    /* Triggers and Bindings here */

    ILogger log)
{
    // Process the incoming event
    // Prepare the notification based on the blog post data
    // Use HttpClient to send the notification to all registered users
}
```

Answer: For real-time notifications, you could use an Event Grid trigger. When a new blog post is published, it can trigger an event which in turn triggers the Azure function. The function could then use an output binding to a Service Bus topic to notify all registered users.

```cs
[FunctionName("NotifyUsers")]
public static async void Run(
    [EventGridTrigger]
    EventGridEvent eventGridEvent,

    ILogger log)
{
    // Process the incoming event
    // Prepare the notification based on the blog post data
    // Use HttpClient to send the notification to all registered users
}
```

---

Question: A client wants to set up a system that receives JSON payloads from various services. The payload data is then to be stored in a database. How would you design an Azure Function to cater to this need? Fill in the triggers and bindings in the following code:

```cs
[FunctionName("ProcessPayload")]
public static async Task<IActionResult> Run(
    /* Triggers and Bindings here */

    ILogger log)
{
    // Parse the incoming HTTP request to get the JSON payload
    // Process the payload data
    // Add the processed data to Cosmos DB using the 'outputDocuments' output binding
    // Return a success response
}
```

Answer: In this scenario, you can use an HTTP trigger to receive JSON payloads. Then, you could use an output binding to Azure Cosmos DB to store the payload data into the database.

```cs
[FunctionName("ProcessPayload")]
public static async Task<IActionResult> Run(
    [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)]
    HttpRequest req,

    [CosmosDB("<database-name>", "<collection-name>", ConnectionStringSetting = "CosmosDBConnectionString")]
    IAsyncCollector<dynamic> outputDocuments,

    ILogger log)
{
    // Parse the incoming HTTP request to get the JSON payload
    // Process the payload data
    // Add the processed data to Cosmos DB using the 'outputDocuments' output binding
    // Return a success response
}
```

---

Question: An organization is looking to automate some of their systems. They have a system that triggers an event whenever a new employee is onboarded. The organization wants an Azure Function that responds to this event by creating a welcome email and sending it to the new employee. Can you outline a solution for this? Fill in the triggers and bindings in the following code:

```cs
[FunctionName("WelcomeNewEmployee")]
public static async void Run(
    /* Triggers and Bindings here */

    ILogger log)
{
    // Process the incoming event
    // Prepare the welcome email based on the new employee data
    // Use HttpClient to send the welcome email to the new employee
}
```

Answer: This can be achieved using an Event Grid trigger. The onboarding system can send an event to Event Grid when a new employee is added, which would trigger the Azure function. The function can use the HTTP output binding to call an external email service API to send the welcome email.

```cs
[FunctionName("WelcomeNewEmployee")]
public static async void Run(
    [EventGridTrigger]
    EventGridEvent eventGridEvent,

    ILogger log)
{
    // Process the incoming event
    // Prepare the welcome email based on the new employee data
    // Use HttpClient to send the welcome email to the new employee
}
```
