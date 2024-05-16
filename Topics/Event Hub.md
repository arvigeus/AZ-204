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
- **Throughput Units** (**processing units**): Pre-purchased units controlling the throughput capacity of Event Hubs.

![Image showing the event processing flow.](https://learn.microsoft.com/en-us/training/wwl-azure/azure-event-hubs/media/event-hubs-stream-processing.png)

## AMQP vs. HTTPS

- **Initialization**: AMQP requires a persistent bidirectional socket plus TLS or SSL/TLS, resulting in _higher initial network costs_. HTTPS has extra TLS overhead for each request.
- **Performance**: AMQP offers _higher throughput and lower latency_ for frequent publishers. HTTPS can be slower due to the extra overhead.

## [Features](https://learn.microsoft.com/en-us/azure/event-hubs/event-hubs-features)

### Namespace

An Event Hubs namespace is a management container for event hubs. It provides DNS-integrated network endpoints and a range of access control and network integration management features such as IP filtering, virtual network service endpoint, and Private Link.

### Event Retention

Published events are removed from an event hub based on a configurable, time-based retention policy. The default value and shortest possible retention period is 1 hour.

Max retention perios:

- Standard: 7 days
- Premium and Dedicated: 90 days.

If you need to archive events beyond the allowed retention period, you can have them automatically stored in Azure Storage or Azure Data Lake by turning on the Event Hubs Capture feature.

### [Event Hubs Capture](https://learn.microsoft.com/en-us/azure/event-hubs/event-hubs-capture-overview)

Allows automatic capturing of streaming data into **Azure Blob storage** or **Azure Data Lake Storage**. It can process real-time and batch-based pipelines on the same stream. You can specify the time or size interval for capturing, and it scales automatically with throughput units.

It is a durable buffer for telemetry ingress (similar to a distributed log) with a partitioned consumer model. Captured data is written in Apache Avro format.

Storeage accounts can be in the same region as your event hub or in another region.

Capture allows you to set up a minimum size and time window for capturing data (_capture windowing_). The "first wins policy" means the first trigger encountered initiates the capture operation. Each partition captures data independently and creates a block blob when the capture interval is reached, named after that time.

Example:

```txt
https://mystorageaccount.blob.core.windows.net/mycontainer/mynamespace/myeventhub/0/2017/12/08/03/03/17.avro
{Namespace}/{EventHub}/{PartitionId}/{Year}/{Month}/{Day}/{Hour}/{Minute}/{Second}
```

Integration with Event Grid: Create an Event Grid subscription with an Event Hubs namespace as its source.

Azure Storage account as a destination: Needs write permissions on blobs and containers level. The `Storage Blob Data Owner` is a built-in role with above permissions.

### Log Compaction

Azure Event Hubs supports compacting event log to retain the latest events of a given event key. With compacted event hubs/Kafka topic, you can use key-based retention rather than using the coarser-grained time-based retention.

## [Scaling to throughput units](https://learn.microsoft.com/en-us/azure/event-hubs/event-hubs-quotas)

Traffic is managed by throughput units. One unit permits 1 MB or 1000 events per second incoming (ingress), and twice that outgoing (egress). Standard hubs support 1-20 units (you can buy more). Exceeding your units limit will be throttled. Event Hubs Capture directly copies data and bypasses outgoing limits.

To scale your event processing app, run multiple instances using **EventProcessorClient** and let them balance the load. Event processor instances usually handle data from several partitions (_distributed ownership_). They claim ownership of partitions through entries in a checkpoint store. All processors update this store to manage their state and balance the workload.

Designing large systems:

- **Scale**: Have several readers, each handling some of the event hub partitions.
- **Load Balance**: Adjust the number of readers as needed. If a new type of sensor is added, the operator can increase readers to handle more data.
- **Resume After Failures**: If a reader fails, others take over from where it left off.
- **Consume Events**: There must be code to process the data, like combining it and saving it for the webpage.

## [Event Processor](https://learn.microsoft.com/en-us/azure/event-hubs/event-hubs-event-processor-host)

- **Receiving Messages**: Create an event processor to handle specific partition events. Include retry logic to process every message at least once, and use two consumer groups for storage and routing needs.
- **Checkpointing**: The event processor marks the last processed event within a partition, allowing for resiliency. If an event processor disconnects, another can resume at the last checkpoint, and it's possible to return to older data by specifying a lower offset.

## Partitions

They serve as "commit logs" for organizing sequences of events, with **new events added in the order they were received**. 4 by default. They enhance raw IO throughput by allowing multiple parallel logs and streamline processing by assigning clear ownership, thus efficiently handling large volumes of events. The number of partitions, set within an allowed tier range at creation, influences throughput but not cost, and cannot be changed later. While increasing partitions can boost throughput, it may complicate processing. Balancing scaling units and partitions, with a guideline of 1 MB/s per partition, is recommended for optimal scale. The key directs events to specific partition, allowing related events to be grouped together by attributes like unique identity or geography.

## Control access to events

- [Azure Event Hubs Data Owner](https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#azure-event-hubs-data-owner): _complete access_ to Event Hubs resources.
- [Azure Event Hubs Data Sender](https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#azure-event-hubs-data-sender): _send access_ to Event Hubs resources.
- [Azure Event Hubs Data Receiver](https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#azure-event-hubs-data-receiver): _receiving access_ to Event Hubs resources.

## [Working with Event Hubs](https://learn.microsoft.com/en-us/azure/event-hubs/event-hubs-dotnet-standard-getstarted-send)

```cs
// Connection strings and Event Hub name
var eventHubsConnectionString = "Endpoint=sb://example-namespace.servicebus.windows.net/;SharedAccessKeyName=KeyName;SharedAccessKey=AccessKey";
var eventHubName = "example-event-hub";
var storageConnectionString = "DefaultEndpointsProtocol=https;AccountName=exampleaccount;AccountKey=examplekey;EndpointSuffix=core.windows.net";
var blobContainerName = "example-container";
var consumerGroup = EventHubConsumerClient.DefaultConsumerGroupName;

// Alt to connection string: ClientSecretCredential, DefaultAzureCredential with fullyQualifiedNamespace

// Application Groups: You can connect via SAS or Entra ID (just pass credential to EventHubProducerClient), allowing you to use access policies, throttling, etc.
await using (var producerClient = new EventHubProducerClient(eventHubsConnectionString, eventHubName))
{
    string[] partitionIds = await producerClient.GetPartitionIdsAsync(); // Query partition IDs

    // Publish events to Event Hubs

    // Create a batch of events
    using EventDataBatch eventBatch = await producerClient.CreateBatchAsync();
    // Add events to the batch. An event is represented by a collection of bytes and metadata.
    eventBatch.TryAdd(new EventData(Encoding.UTF8.GetBytes("First event")));
    eventBatch.TryAdd(new EventData(Encoding.UTF8.GetBytes("Second event")));
    // Use the producer client to send the batch of events to the event hub
    await producerClient.SendAsync(eventBatch);
}

// Using buffer
// EventHubBufferedProducerClient abstracts away the complexities of batching and sending events, making it easier to use but with less control.
using(var bufferedProducerClient = new EventHubBufferedProducerClient(connectionString, eventHubName))
{
    await bufferedProducerClient.EnqueueEventAsync(new EventData(Encoding.UTF8.GetBytes("First event")));
    await bufferedProducerClient.EnqueueEventAsync(new EventData(Encoding.UTF8.GetBytes("Second event")));
}

// Read events from Event Hubs
await using (var consumer = new EventHubConsumerClient(consumerGroup, eventHubsConnectionString, eventHubName))
{
    using var cancellationSource = new CancellationTokenSource(TimeSpan.FromSeconds(45));
    await foreach (PartitionEvent receivedEvent in consumer.ReadEventsAsync(cancellationSource.Token)) {} // Wait for events
}

// Read events from an Event Hubs partition
// The events will be returned in the order they were added to that partition
await using (var consumer = new EventHubConsumerClient(consumerGroup, eventHubsConnectionString, eventHubName))
{
    EventPosition startingPosition = EventPosition.Earliest;
    string partitionId = (await consumer.GetPartitionIdsAsync()).First();

    using var cancellationSource = new CancellationTokenSource(TimeSpan.FromSeconds(45));
    await foreach (PartitionEvent receivedEvent in consumer.ReadEventsFromPartitionAsync(partitionId, startingPosition, cancellationSource.Token)) // Wait for events in partition
    {
        string readFromPartition = partitionEvent.Partition.PartitionId;
        byte[] eventBody = partitionEvent.Data.EventBody.ToArray();
    }
}

// Process events using Event Processor client
// NOTE: You need Blob Storage for checkpointing
var storageClient = new BlobContainerClient(storageConnectionString, blobContainerName);
var processor = new EventProcessorClient(storageClient, consumerGroup, eventHubsConnectionString, eventHubName);
Task processEventHandler(ProcessEventArgs eventArgs) => {
    // Checkpointing: Update checkpoint in the blob storage so that you can resume from this point if the processor restarts
    await eventArgs.UpdateCheckpointAsync();
};
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

### CLI

```sh
# Create a resource group
az group create --name $resourceGroup --location eastus

# Create an Event Hubs namespace
# Throughput units are specified here
az eventhubs namespace create --name $eventHubNamespace --sku Standard --location eastus --resource-group $resourceGroup

# Get the connection string for a namespace
az eventhubs namespace authorization-rule keys list --namespace-name $eventHubNamespace --name RootManageSharedAccessKey --resource-group $resourceGroup

# Create an Event Hub inside the namespace
# Partition count and retention days are specified here
az eventhubs eventhub create --name $eventHub --namespace-name $eventHubNamespace --partition-count 2 --message-retention 1 --resource-group $resourceGroup

# Get the connection string for a specific event hub within a namespace
az eventhubs eventhub authorization-rule keys list --namespace-name $eventHubNamespace --eventhub-name $eventHubName --name MyAuthRuleName --resource-group $resourceGroup

# Create a Consumer Group (Consumer Groups)
az eventhubs eventhub consumer-group create --eventhub-name $eventHub --name MyConsumerGroup --namespace-name $eventHubNamespace --resource-group $resourceGroup

# Capture Event Data (Event Hubs Capture)
# Enable capture and specify the storage account and container
az eventhubs eventhub update --name $eventHub --namespace-name $eventHubNamespace --enable-capture True --storage-account sasurl --blob-container containerName --resource-group $resourceGroup

# Scale the throughput units (Throughput Units)
az eventhubs namespace update --name $eventHubNamespace --sku Standard --capacity 2 --resource-group $resourceGroup

# Get Event Hub details (Partitions, Consumer Groups)
az eventhubs eventhub show --name $eventHub --namespace-name $eventHubNamespace --resource-group $resourceGroup

# Delete the Event Hub Namespace (this will delete the Event Hub and Consumer Groups within it)
az eventhubs namespace delete --name $eventHubNamespace --resource-group $resourceGroup
```
