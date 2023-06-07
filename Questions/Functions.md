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

Answer: Everything but `Timer` and `IoT Hub`.

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

Question: You've been assigned a project where your task is to design an Azure function that activates automatically every 10 minutes. This function has to interact with a vast amount of unstructured data such as text or binary data from a source, perform necessary computations, and subsequently modify another source with the outcome. Now, in the context of this task, provide the appropriate triggers and bindings in the following code:

```cs
[FunctionName("ProcessData")]
public static void Run(
    /* Triggers and Bindings here */

    ILogger log)
{
    // Read data from input
    // Process the data
    // Write the processed data to output
}
```

Answer: To accomplish this, you could utilize a Timer Trigger for the Azure Function, enabling it to initiate every 10 minutes. This function could be configured with an input binding to retrieve data from the data source, in this case, Blob Storage, which is apt for handling unstructured data. Once the data processing is completed, an output binding to Blob Storage can be used to deposit the processed data.

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
    // Read data from input
    // Process the data
    // Write the processed data to output
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
    // Read the input image
    // Resize the image
    // Write the resized image to output image
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
    // Read the input image
    // Resize the image
    // Write the resized image to output image
}
```

---

Question: Imagine you're devising a real-time analytics solution for a social media company. They desire to oversee and scrutinize user posts and reactions instantaneously. Your assignment is to develop an Azure function that is activated by this live activity. Considering the company's requirement for low-latency data access, complex querying, and globally distributed data, which Azure services would you utilize to accomplish this task? Please provide the triggers and bindings in the given code:

```cs
[FunctionName("AnalyzeUserActivity")]
public static void Run(
    /* Triggers and Bindings here */

    ILogger log)
{
    // Loop over the events array
    // For each event, analyze the event data
    // Write the analysis results to globally distributed storage
}
```

Answer: Event Hubs would be a great choice for triggering the Azure function for real-time monitoring and analysis. Event Hubs are designed to capture streaming data like the one from social media feeds. After capturing this real-time data, it can then be processed using Azure Cosmos DB. Cosmos DB, a globally-distributed multi-model database service, would provide the required low-latency data access and support for handling large amounts of data, making it an excellent choice for processing this real-time data according to the company's requirements.

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
    // Write the analysis results to globally distributed storage
}
```

---

Question: You are responsible for creating a serverless application that communicates with an API. This application will ingest data through HTTP requests and, dependent on the received data, it must modify a structured NoSQL database in the cloud. This database should have a key/attribute store with a schemaless design. Could you outline how you would construct the Azure Function to fulfill this purpose? Please provide the triggers and bindings in the code below:

```cs
[FunctionName("UpdateDatabase")]
public static async Task<IActionResult> Run(
    /* Triggers and Bindings here */

    ILogger log)
{
    // Parse the incoming data
    // Add the processed data to storage
    // Return a success response
}
```

Answer: This is an example of an HTTP Trigger. The Azure function can be activated by an HTTP request containing the data. In response to the data received, the function could use an output binding to a structured NoSQL service, Azure Table Storage in this case, to modify the database accordingly.

```cs
[FunctionName("UpdateDatabase")]
public static async Task<IActionResult> Run(
    [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)]
    HttpRequest req,

    [Table("<table-name>", Connection = "<storage-connection-string>")]
    IAsyncCollector<dynamic> outputTable,

    ILogger log)
{
    // Parse the incoming data
    // Add the processed data to storage
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
    // Process the incoming delivery request
    // Prepare the output request
    // The output request is automatically added to the queue
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
    // Process the incoming delivery request
    // Prepare the output request
    // The output request is automatically added to the queue
}
```

---

Question: You are working on a project that requires automatic clean-up of older records in a database every day at a specific time. The clean-up task should be an Azure function that gets triggered at the specified time. The target database has high-throughput transactional capacity, and tunable consistency levels, can you delineate a solution for this task? Please provide the triggers and bindings in the given code.

```cs
[FunctionName("CleanUpOldRecords")]
public static void Run(
    /* Triggers and Bindings here */

    ILogger log)
{
    // Loop over oldRecords
    // For each record, mark it for deletion or update it as per your logic
    // Add the updated records to database
}
```

Answer: A Timer trigger would be the optimal selection in this scenario. This allows for the scheduling of an Azure function to execute at a specified time each day. The function should utilize input and output bindings to Azure Cosmos DB, which provides specified capabilities. Its role would be to retrieve and clear out older records.

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
    // Add the updated records to database
}
```

---

Question: Let's consider a case where you're dealing with an IoT project. You're receiving huge amounts of telemetry data from IoT devices, and this data should trigger an Azure function that analyses the data in near real-time. Assuming you would need a service that can handle vast amounts of data with millisecond response times, storage should provide low latency at any scale. How would you structure the Azure function for this situation? Please provide the triggers and bindings in the given code.

```cs
[FunctionName("ProcessTelemetryData")]
public static void Run(
    /* Triggers and Bindings here */

    ILogger log)
{
    // Loop over the events array
    // For each event, process the telemetry data
    // Write the processed data to storage
}
```

Answer: Event Hubs would again be the right choice for this scenario, given their capability to handle large amounts of data in real-time. The telemetry data could be sent to an Event Hub, which would trigger the function. The function could then analyze the data and use an output binding to store the analysis results. Cosmos DB's capabilities to provide low latency at any scale and its global distribution n

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
    // Write the processed data to storage
}
```

---

Question: A media company requires an Azure function to accumulate real-time news data from various online sources (webhooks) and subsequently deposit the collected data in a particular format into a database. Given the need to store large amounts of unstructured data that will be accessed infrequently, what approach would you suggest? Please provide the triggers and bindings in the provided code:

```cs
[FunctionName("CollectNewsData")]
public static async Task<IActionResult> Run(
    /* Triggers and Bindings here */

    ILogger log)
{
    // Parse the incoming data
    // Process the news data, if necessary
    // Add the news data to storage
    // Return a success response
}
```

Answer: To gather real-time news data from diverse web sources, an HTTP trigger could be utilized. The function could then reformat the amassed data and employ an output binding to a service that specializes in storing large amounts of unstructured data and is cost-effective for infrequent data access - Azure Blob Storage - to deposit the data.

```cs
[FunctionName("CollectNewsData")]
public static async Task<IActionResult> Run(
    [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)]
    HttpRequest req,

    [Blob("<container-name>/<blob-name>", FileAccess.Write, Connection = "<storage-connection-string>")]
    Stream outputBlob,

    ILogger log)
{
    // Parse the incoming data
    // Process the news data, if necessary
    // Add the news data to storage
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
    // Prepare the output message
    // The output message is automatically sent for the subscribers to read later
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
    // Prepare the output message
    // The output message is automatically sent for the subscribers to read later
}
```

---

Question: Imagine you're part of an organization that operates in the cloud and manages numerous resources across a wide variety of Azure subscriptions. For compliance and auditing purposes, the company aims to log all changes to resource states. Considering that your organization operates worldwide, requiring the data to be available without significant latency regardless of the location, which Azure service would you recommend to trigger your Azure Function? Fill in the triggers and bindings in the code provided:

```cs
[FunctionName("LogResourceChanges")]
public static void Run(
    /* Triggers and Bindings here */

    ILogger log)
{
    // Process the incoming event
    // Prepare the document based on the event data
    // The document is automatically added to storage
}
```

Answer: For this scenario, an Event Grid trigger would be ideal. Azure Event Grid is capable of dispatching an event whenever there is a state change in Azure resources, which in turn triggers your Azure Function. Following activation, the function could log these changes to a data service that can offer seamless access to data from any corner of the world, such as Azure Cosmos DB, using an output binding. This would ensure that no matter where the request is coming from, data access will remain consistent and fast, supporting your global operations.

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
    // The document is automatically added to storage
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

Question: A customer is keen on setting up a system that is capable of accepting JSON payloads from an assortment of services. This payload data is then intended to be stored in a database that is optimal for storing large amounts of structured, non-relational data, such as metadata, user data, and diagnostic data. How would you structure an Azure Function to accommodate this need? Please provide the triggers and bindings in the following code.

```cs
[FunctionName("ProcessPayload")]
public static async Task<IActionResult> Run(
    /* Triggers and Bindings here */

    ILogger log)
{
    // Process incoming JSON payload data
    // Add the processed data to designated storage
    // Return a success response
}
```

Answer: In this circumstance, an HTTP trigger could be employed to receive the JSON payloads. The payload data could then be stored into a database service that is designed for storing structured NoSQL data using an output binding - in this case, Azure Table Storage.

```cs
[FunctionName("ProcessPayload")]
public static async Task<IActionResult> Run(
    [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)]
    HttpRequest req,

    [Table("<table-name>", Connection = "StorageConnectionAppSetting")]
    IAsyncCollector<dynamic> outputTable,

    ILogger log)
{
    // Process incoming JSON payload data
    // Add the processed data to designated storage
    // Return a success response
}
```

---

Question: How to define an HTTP output binding in Azure Function?

- [ ] Using `[Http(AuthorizationLevel.Function, "post", Route = null)]` parameter
- [x] Returning `Task<IActionResult>` result from the function
- [ ] There is only HTTP input binding, output binding does not exist

Answer: This binding requires an HTTP trigger and allows you to customize the response associated with the trigger's request.

---

Question: Write an Azure function that is invoked when there are inserts or updates in the `Items` collection of `ToDoItems` database for CosmoDB.

```cs
[FunctionName("CosmosTrigger")]
public static async Task<IActionResult> Run(
    /* Triggers and Bindings here */

    ILogger log)
{
    // TODO: List modified documents
}
```

Answer:

```cs
[FunctionName("CosmosTrigger")]
public static async Task<IActionResult> Run(
    [CosmosDBTrigger(databaseName: "ToDoItems", collectionName: "Items", ConnectionStringSetting = "CosmosDBConnection",LeaseCollectionName = "leases", CreateLeaseCollectionIfNotExists = true)]
    IReadOnlyList<Document> documents,

    ILogger log)
{
    if (documents != null && documents.Count > 0)
    {
        log.LogInformation($"Documents modified: {documents.Count}");
        for (var i = 0; i < documents.Count; i++)
            log.LogInformation($"First document Id: {documents[0].Id}");
    }
}
```

---

Question: You're part of a large digital library that digitizes and stores thousands of books. Once a book is digitized and stored in Blob Storage, a process is triggered to generate metadata for the digitized book. After the metadata is generated, an event should be fired to notify other services for further processing (e.g., updating the search index, notifying users who requested this book). How would you set up the Azure function to handle this situation?

```cs
[FunctionName("ProcessDigitizedBook")]
public static void Run(
    /* Triggers and Bindings here */

    string name,
    ILogger log)
{
    // Process the inputBook to generate metadata
    // Prepare an EventGridEvent with the metadata
    // Add the event to the 'outputEvents' output binding, which will send it to Event Grid
}
```

Answer:

```cs
[FunctionName("ProcessDigitizedBook")]
public static void Run(
    [BlobTrigger("<container-name>/{name}", Connection = "BlobStorageConnectionString")]
    Stream inputBook,

    [EventGrid(TopicEndpointUri = "<topic-endpoint>", TopicKeySetting = "<topic-key>")]
    ICollector<EventGridEvent> outputEvents,

    string name,
    ILogger log)
{
    // Process the inputBook to generate metadata
    var metadata = GenerateMetadata(inputBook);

    // Prepare an EventGridEvent with the metadata
    var event = new EventGridEvent("/subject/path", "Book.Digitized", "1.0", metadata);

    // Send the event
    await outputEvents.AddAsync(event);

    log.LogInformation($"Processed blob\n Name:{name} \n Size: {inputBook.Length} Bytes");
}
```

---

Question: Write a cron schedule expression that will execute a command every 30th minute of every two hours, for the first 15 days of the summer months (June, July, and August), on weekdays (Monday through Friday).

Answer: 30 \*/2 1-15 6-8 1-5

---

Question: Which of the following cron schedules will be executed every five minutes?

- [x] `0 */5 * * * *`
- [x] `*/5 * * * *`
- [ ] `*/5 * * * * *`
- [ ] `* */5 * * *`
- [ ] `0 5 * * * *`
- [ ] `5 * * * *`
- [ ] `5 * * * * *`
- [ ] `* 5 * * *`

Answer: Cron schedules supports both 5 and 6 fields (`{minute} {hour} {day} {month} {day-of-week}` or `{second} {minute} {hour} {day} {month} {day-of-week}`). To make them run at every 5 minutes, `*/5` is used.

---

Question: In your e-commerce system, you've built two Azure Functions to handle order processing and retrieval. The `OrderProcessingFunction` is triggered when an order is placed by a customer. The details of this order are then processed and stored into a cloud storage system for later reference. The `OrderRetrievalFunction` is invoked on-demand via a web request, which fetches and returns the previously stored order details.

Given this setup, which bindings are you most likely to use in the `OrderProcessingFunction`? There may be more than one correct answer.

- [x] ServiceBus trigger binding
- [ ] HTTP trigger binding
- [ ] Blob trigger binding
- [ ] Blob input binding
- [x] Blob output binding
- [ ] Blob input output binding

Answer: The OrderProcessingFunction uses the ServiceBus trigger binding because it is triggered by new messages (orders) arriving in the Azure Service Bus. It uses the Blob output binding to store the processed order details into Azure Blob Storage, a cloud storage system.

---

Question: In your e-commerce system, you've built two Azure Functions to handle order processing and retrieval. The `OrderProcessingFunction` is triggered when an order is placed by a customer. The details of this order are then processed and stored into a cloud storage system for later reference. The `OrderRetrievalFunction` is invoked on-demand via a web request, which fetches and returns the previously stored order details.

Given this setup, which bindings are you most likely to use in the `OrderRetrievalFunction`? There may be more than one correct answer.

- [ ] ServiceBus trigger binding
- [x] HTTP trigger binding
- [ ] Blob trigger binding
- [x] Blob input binding
- [ ] Blob output binding
- [ ] Blob input output binding

Answer: The OrderRetrievalFunction is invoked on-demand via a web request, which corresponds to the HTTP trigger binding. This function fetches the stored order details from a cloud storage system, which corresponds to the Blob input binding.

---
