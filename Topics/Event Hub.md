# [Azure Event Hub](https://docs.microsoft.com/en-us/azure/event-hubs/)

- **Fully Managed PaaS**, integrating with Apache Kafka.
- **Real-Time and Batch Processing**: Uses partitioned consumer model to process streams concurrently and control processing speed.
- **Capture Event Data**: Stores data in near-real-time in Azure Blob storage or Azure Data Lake Storage.

## Key Concepts

- **Event Hubs Client**: Interface for interacting with Event Hubs.
- **Event Hubs Producer**: Source of various types of data such as telemetry, diagnostics, logs, etc.
- **Event Hubs Consumer**: Reads information from Event Hubs for processing, distribution, or storage.
- **Partition**: Ordered sequence of events in an Event Hub, used for parallelism in data processing.
- **Consumer Group**: Allows multiple applications to read the event stream independently.
- **Event Receivers**: Entities that read event data from Event Hubs, using AMQP 1.0 or Kafka protocol 1.0 and later.
- **Throughput Units**: Pre-purchased units controlling the throughput capacity of Event Hubs.

![Image showing the event processing flow.](https://learn.microsoft.com/en-us/training/wwl-azure/azure-event-hubs/media/event-hubs-stream-processing.png)

## Event Hubs Capture

Allows automatic capturing of streaming data into Azure Blob storage or Azure Data Lake Storage. It can process real-time and batch-based pipelines on the same stream. You can specify the time or size interval for capturing, and it scales automatically with throughput units.

It is a durable buffer for telemetry ingress (similar to a distributed log) with a partitioned consumer model. Data ages off based on retention settings. Captured data is written in Apache Avro format.

Storeage accounts can be in the same region as your event hub or in another region.

Capture allows you to set up a minimum size and time window for capturing data. The "first wins policy" means the first trigger encountered initiates the capture operation. Each partition captures data independently and creates a block blob when the capture interval is reached, named after that time.

Example:

```txt
https://mystorageaccount.blob.core.windows.net/mycontainer/mynamespace/myeventhub/0/2017/12/08/03/03/17.avro
{Namespace}/{EventHub}/{PartitionId}/{Year}/{Month}/{Day}/{Hour}/{Minute}/{Second}
```

## Scaling to throughput units

Traffic is managed by throughput units. One unit permits 1 MB or 1000 events per second incoming (ingress), and twice that outgoing (egress). Standard hubs support 1-20 units (you can buy more). Exceeding your units limit will be throttled. Event Hubs Capture directly copies data and bypasses outgoing limits.

To scale your event processing app, run multiple instances using **EventProcessorClient** and let them balance the load. Event processor instances usually handle data from several partitions (_distributed ownership_). They claim ownership of partitions through entries in a checkpoint store. All processors update this store to manage their state and balance the workload.

Designing large systems:

- **Scale**: Have several readers, each handling some of the event hub partitions.
- **Load Balance**: Adjust the number of readers as needed. If a new type of sensor is added, the operator can increase readers to handle more data.
- **Resume After Failures**: If a reader fails, others take over from where it left off.
- **Consume Events**: There must be code to process the data, like combining it and saving it for the webpage.

## Event Processor

- **Receiving Messages**: Create an event processor to handle specific partition events. Include retry logic to process every message at least once, and use two consumer groups for storage and routing needs.
- **Checkpointing**: The event processor marks the last processed event within a partition, allowing for resiliency. If an event processor disconnects, another can resume at the last checkpoint, and it's possible to return to older data by specifying a lower offset.
- **Thread Safety**: Functions processing events are called sequentially for each partition. Events from different partitions can be processed concurrently, and shared states across partitions must be synchronized.

Minimize processing and be cautious with poisoned messages. Utilize proper retry logic and understand checkpointing to improve efficiency and resilience.

## Control access to events

- [Azure Event Hubs Data Owner](https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#azure-event-hubs-data-owner): _complete access_ to Event Hubs resources.
- [Azure Event Hubs Data Sender](https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#azure-event-hubs-data-sender): _send access_ to Event Hubs resources.
- [Azure Event Hubs Data Receiver](https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#azure-event-hubs-data-receiver): _receiving access_ to Event Hubs resources.

### Authorize Access with Managed Identities

```cs
EventHubProducerClient producerClient = new EventHubProducerClient(
    fullyQualifiedNamespace: "<<Your-Namespace>>",
    eventHubName: "<<EventHub-Name>>",
    new DefaultAzureCredential());

await producerClient.SendAsync(new EventData(Encoding.UTF8.GetBytes("Message body")));
```

### Authorize Access with Microsoft Identity Platform

```cs
var tokenProvider = TokenProvider.CreateAzureActiveDirectoryTokenProvider(
    async (audience, authority, state) =>
    {
        var authContext = new AuthenticationContext(authority);
        var clientCredential = new ClientCredential("<<Your-ClientId>>", "<<Your-ClientSecret>>");
        var result = await authContext.AcquireTokenAsync(audience, clientCredential);
        return result.AccessToken;
    });

var client = new EventHubClient("<<Your-Namespace>>", "<<EventHub-Name>>", tokenProvider);
```

### Authorize with Shared Access Signatures

Clients are assigned unique tokens, signed with a shared key, to send to specific publishers. Shared tokens allow multiple clients to use the same publisher, and tokens are valid until expiration.

Consumers require manage rights or listen privileges at namespace, event hub instance, or topic levels, and data is consumed through consumer groups. SAS policy scope is defined at the entity, not consumer level.

```cs
// Define Shared Access Signature (SAS) details
string sasKeyName = "KeyName";
string sasKeyValue = "KeyValue";
string eventHubNamespace = "<<Your-Namespace>>";
string eventHubName = "<<EventHub-Name>>";
string consumerGroup = "<<Consumer-Group>>";

// Create a SAS Token Provider for authorization
var sasTokenProvider = TokenProvider.CreateSharedAccessSignatureTokenProvider(sasKeyName, sasKeyValue);

// Create an Event Hub Client for sending messages using the SAS Token Provider
var producerClient = new EventHubClient(eventHubNamespace, eventHubName, sasTokenProvider);

// Create a SAS Token for consumption
var sasTokenCredential = new SharedAccessSignatureCredential(
    new SharedAccessSignature(
        eventHubNamespace,
        eventHubName,
        sasKeyName,
        sasKeyValue,
        TimeSpan.FromHours(4)));

// Create an Event Hub Consumer Client using the SAS Token
var consumerClient = new EventHubConsumerClient(
    consumerGroup,
    eventHubNamespace,
    eventHubName,
    new EventHubConsumerClientOptions
    {
        TokenCredential = sasTokenCredential
    });
```

## Working with Event Hubs

```cs
// Connection strings and Event Hub name
var eventHubsConnectionString = "Endpoint=sb://example-namespace.servicebus.windows.net/;SharedAccessKeyName=KeyName;SharedAccessKey=AccessKey";
var eventHubName = "example-event-hub";
var storageConnectionString = "DefaultEndpointsProtocol=https;AccountName=exampleaccount;AccountKey=examplekey;EndpointSuffix=core.windows.net";
var blobContainerName = "example-container";
var consumerGroup = EventHubConsumerClient.DefaultConsumerGroupName;

// Inspect Event Hubs
await using (var producer = new EventHubProducerClient(eventHubsConnectionString, eventHubName))
{
    string[] partitionIds = await producer.GetPartitionIdsAsync(); // Query partition IDs
}

// Publish events to Event Hubs
await using (var producer = new EventHubProducerClient(eventHubsConnectionString, eventHubName))
{
    using EventDataBatch eventBatch = await producer.CreateBatchAsync();
    eventBatch.TryAdd(new EventData(new BinaryData("First")));
    eventBatch.TryAdd(new EventData(new BinaryData("Second")));

    await producer.SendAsync(eventBatch); // Send events

    var eventData = new EventData(Encoding.UTF8.GetBytes("Message body"));
    await producer.SendAsync(eventData);
}

// Read events from Event Hubs
await using (var consumer = new EventHubConsumerClient(consumerGroup, eventHubsConnectionString, eventHubName))
{
    using var cancellationSource = new CancellationTokenSource(TimeSpan.FromSeconds(45));
    await foreach (PartitionEvent receivedEvent in consumer.ReadEventsAsync(cancellationSource.Token)) {} // Wait for events
}

// Read events from an Event Hubs partition
await using (var consumer = new EventHubConsumerClient(consumerGroup, eventHubsConnectionString, eventHubName))
{
    EventPosition startingPosition = EventPosition.Earliest;
    string partitionId = (await consumer.GetPartitionIdsAsync()).First();

    using var cancellationSource = new CancellationTokenSource(TimeSpan.FromSeconds(45));
    await foreach (PartitionEvent receivedEvent in consumer.ReadEventsFromPartitionAsync(partitionId, startingPosition, cancellationSource.Token)) {} // Wait for events in partition
}

// Process events using Event Processor client
var storageClient = new BlobContainerClient(storageConnectionString, blobContainerName);
var processor = new EventProcessorClient(storageClient, consumerGroup, eventHubsConnectionString, eventHubName);
Task processEventHandler(ProcessEventArgs eventArgs) => Task.CompletedTask;
Task processErrorHandler(ProcessErrorEventArgs eventArgs) => Task.CompletedTask;

processor.ProcessEventAsync += processEventHandler;
processor.ProcessErrorAsync += processErrorHandler;

await processor.StartProcessingAsync();
try { await Task.Delay(Timeout.Infinite, new CancellationTokenSource(TimeSpan.FromSeconds(45)).Token); } catch (TaskCanceledException) {}
try { await processor.StopProcessingAsync(); } finally
{
    processor.ProcessEventAsync -= processEventHandler;
    processor.ProcessErrorAsync -= processErrorHandler;
}
```
