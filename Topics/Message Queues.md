# Message Queues

## [Type of queues](https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-azure-and-service-bus-queues-compared-contrasted)

| Features                   | Azure Service Bus                                                          | Azure Queue Storage                                                   |
| -------------------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Purpose                    | A fully managed enterprise integration message broker                      | A service for storing large numbers of messages                       |
| Message size limit         | Up to 100 MB (Premium), up to 256 KB (Standard)                            | Up to 64 KB                                                           |
| Ordering guarantee         | Yes (by using message sessions)                                            | No                                                                    |
| Real-time message delivery | Long-polling via TCP, no need to poll the queue to receive messages        | Traditional polling                                                   |
| Pricing                    | Fixed pricing (Premium), Pay as you go variable pricing (Standard)         | Pay as you go                                                         |
| Throughput                 | High throughput (Premium), Variable throughput (Standard)                  | N/A                                                                   |
| Delivery guarantee         | At-Least-Once (PeekLock)<br/>At-Most-Once (ReceiveAndDelete)               | At-Least-Once                                                         |
| Atomic operation support   | Yes                                                                        | No                                                                    |
| Exclusive access mode      | Lock-based                                                                 | Lease-based                                                           |
| Receive modes              | Receive and delete, Peek lock                                              | Peek & Lease                                                          |
| Lease/Lock precision       | Queue level                                                                | Message level                                                         |
| Automatic dead lettering   | Yes                                                                        | No                                                                    |
| Performance                | Predictable performance (Premium), Variable latency (Standard)             | N/A                                                                   |
| Scale ability              | Ability to scale workload up and down (Premium)                            | N/A                                                                   |
| Message delivery model     | FIFO message delivery, 1:n relationships through topics and subscriptions  | FIFO message delivery (not guaranteed)                                |
| URL format                 | `https://<namespace>.servicebus.windows.net/<queue>`                       | `https://<storage account>.queue.core.windows.net/<queue>`            |
| Message expiration         | N/A                                                                        | Any positive number, or -1 indicating that the message doesn't expire |
| Message groups             | Yes                                                                        | No                                                                    |
| Duplicate Detection        | Yes                                                                        | No                                                                    |
| Global Access              | Part of Azure messaging infrastructure, accessible via supported protocols | Accessible globally through authenticated HTTP or HTTPS calls         |

### [Service Bus Queues](https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-messaging-overview)

Supports AMQP 1.0, enabling applications to work with Service Bus, and on-premises brokers like ActiveMQ or RabbitMQ.

Up to 80 GB only.

- **Queue**: Only one consumer receives and processes each message at a time, and since messages are stored durably in the queue, producers and consumers don't need to handle messages concurrently.
- **Load-leveling**: Effectively buffering against fluctuating system loads, ensuring the system is optimized to manage the average load, instead of peaks.
- **Decoupling**: Seamless and independent upgrades of consumers, without any disruption to the producers.
- **Receive modes**:
  - **Receive and delete**: Messages are immediately consumed and removed.
  - **Peek lock**: Messages are locked for processing, and the application must explicitly complete the processing to mark the message as consumed. If the application fails, the message can be abandoned or automatically unlocked after a timeout (?).
- **Topics:** Publishers send messages to a topic (1:n), and each message is distributed to all subscriptions registered with the topic.
- **Subscriptions:** Subscribers receive message copies from the topic, based on filter rules set on their subscriptions. Subscriptions act like virtual queues and can apply filters to receive specific messages.
- **Rules and actions**: You can configure subscriptions to process messages with specific characteristics differently. This is done using **filter actions**. When a subscription is created, you can define a filter expression that operates on message properties - system (ex. `"Label"`) or custom (ex: `"StoreName"`). This expression allows you to copy only the desired subset of messages to the virtual subscription queue. If no SQL filter expression is provided, the filter action applies to all messages in that subscription.

#### Payload and serialization

In the form of key-value pairs. The payload is always an opaque _binary block_ when stored or in transit. Its format can be described using the `ContentType` property. Applications are advised to manage object serialization themselves.

Each message has two sets of properties: _system-defined broker properties_, and _user-defined properties_. Broker properties, like `To`, `ReplyTo`, `ReplyToSessionId`, `MessageId`, `CorrelationId`, and `SessionId`, aid in message routing, including simple request/reply, multicast request/reply, multiplexing, and multiplexed request/reply.

Routing is managed interally, but applications can also use user properties for routing, as long as they don't use the reserved `To` property.

#### Advanced features

| Feature                    | Description                                                                                   |
| -------------------------- | --------------------------------------------------------------------------------------------- |
| Message sessions           | Enables FIFO guaranteed handling of related messages sequence.                                |
| Parallel Stream Processing | Can process messages as parallel, long-running streams using **session ID**                   |
| Autoforwarding             | Chains a queue or subscription to another within the same namespace.                          |
| Dead-letter queue          | Holds messages that can't be delivered, allows for removal and inspection.                    |
| Scheduled delivery         | Allows delayed processing by scheduling a message for a certain time.                         |
| Message deferral           | Defers message retrieval until a later time, message remains set aside.                       |
| Batching                   | Delays sending a message for a certain period.                                                |
| Transactions               | Groups operations into an execution scope for a single messaging entity.                      |
| Filtering and actions      | Enables subscribers to define received messages using subscription rules.                     |
| Autodelete on idle         | Automatically deletes a queue after a specified idle interval. Minimum duration is 5 minutes. |
| Duplicate detection        | Resends same message or discards any duplicate copies in case of send operation doubt.        |
| Security protocols         | Supports protocols like SAS, RBAC, and Managed identities for Azure.                          |
| Geo-disaster recovery      | Continues data processing in a different region or datacenter during downtime.                |
| Security                   | Supports standard AMQP 1.0 and HTTP/REST protocols.                                           |

[Azure Service Bus for .NET](https://learn.microsoft.com/en-us/dotnet/api/overview/azure/service-bus)

```cs
using Azure.Messaging.ServiceBus;

string queueName = "az204-queue";

ServiceBusClient GetClient()
{
    return new ServiceBusClient(connectionString);

    // Alternatives

    var serviceBusEndpoint = new Uri($"sb://{serviceBusNamespace}.servicebus.windows.net/");

    // SAS
    return new ServiceBusClient(serviceBusEndpoint, new ServiceBusClientOptions
    {
        Credential = new AzureNamedKeyCredential(sharedAccessKeyName, sharedAccessKey)
    });

    // Managed identity
    return new ServiceBusClient(serviceBusEndpoint, new DefaultAzureCredential());
}

using (var client = GetClient())
{
    using (sender = client.CreateSender(queueName))
    using (ServiceBusMessageBatch messageBatch = await sender.CreateMessageBatchAsync())
    {
        for (int i = 1; i <= 3; i++)
            if (!messageBatch.TryAddMessage(new ServiceBusMessage($"Message {i}")))
                throw new Exception($"Exception {i} has occurred.");
        await sender.SendMessagesAsync(messageBatch);
        Console.WriteLine($"A batch of three messages has been published to the queue.");
    }

    using (rocessor = client.CreateProcessor(queueName, new ServiceBusProcessorOptions()))
    {
        processor.ProcessMessageAsync += MessageHandler;
        processor.ProcessErrorAsync += ErrorHandler;
        await processor.StartProcessingAsync();

        Console.WriteLine("Wait for a minute and then press any key to end the processing");
        Console.ReadKey();

        Console.WriteLine("\nStopping the receiver...");
        await processor.StopProcessingAsync();
        Console.WriteLine("Stopped receiving messages");
    }
}

async Task MessageHandler(ProcessMessageEventArgs args)
{
    string body = args.Message.Body.ToString();
    Console.WriteLine($"Received: {body}");
    await args.CompleteMessageAsync(args.Message);
}

Task ErrorHandler(ProcessErrorEventArgs args)
{
    Console.WriteLine(args.Exception.ToString());
    return Task.CompletedTask;
}
```

```ps
az servicebus namespace create --name mynamespace --resource-group myresourcegroup --location eastus
az servicebus queue create --name myqueue --namespace-name mynamespace --resource-group myresourcegroup
az servicebus queue list --namespace-name mynamespace --resource-group myresourcegroup
az servicebus namespace authorization-rule keys list --name RootManageSharedAccessKey --namespace-name mynamespace --resource-group myresourcegroup --query primaryConnectionString
# Send, Peek, Delete - You would use an SDK or other tooling
az servicebus queue delete --name myqueue --namespace-name mynamespace --resource-group myresourcegroup
az servicebus namespace delete --name mynamespace --resource-group myresourcegroup
```

### [Azure Queue Storage](https://learn.microsoft.com/en-us/azure/storage/queues/storage-queues-introduction)

- May contain millions of messages, up to the total capacity limit of a storage account.
- Commonly used to create a backlog of work to process asynchronously.
- TTL: 7 days (default), -1 to never expire.

- [Azure.Core library for .NET](https://www.nuget.org/packages/azure.core/): Shared primitives, abstractions
- [Azure.Storage.Common client library for .NET](https://www.nuget.org/packages/azure.storage.common/): Infrastructure shared by the other Azure Storage client libraries.
- [Azure.Storage.Queues client library for .NET](https://www.nuget.org/packages/azure.storage.queues/): Working with Azure Queue Storage.
- [System.Configuration.ConfigurationManager library for .NET](https://www.nuget.org/packages/system.configuration.configurationmanager/): Configuration files for client applications.

```cs
// Get the connection string from app settings
// Example: DefaultEndpointsProtocol=https;AccountName={your_account_name};AccountKey={your_account_key};EndpointSuffix={endpoint_suffix}
string connectionString = ConfigurationManager.AppSettings["StorageConnectionString"];

// Instantiate a QueueClient which will be used to create and manipulate the queue
QueueClient queueClient = new QueueClient(connectionString, queueName);

// Create the queue if it doesn't already exist
queueClient.CreateIfNotExists();

if (queueClient.Exists())
{
    // Insert a message into a queue
    // A message can be either a string (in UTF-8 format)
    queueClient.SendMessage(message);

    // Peek at the next message
    // If you don't pass a value for the `maxMessages` parameter, the default is to peek at one message.
    PeekedMessage[] peekedMessage = queueClient.PeekMessages();

    // Change the contents of a message in-place
    // This code saves the work state and grants the client an extra minute to continue their message (default is 30 sec).
    QueueMessage[] message = queueClient.ReceiveMessages();
    // PopReceipt must be provided when performing operations to the message
    // in order to prove that the client has the right to do so when locked
    queueClient.UpdateMessage(message[0].MessageId,
            message[0].PopReceipt,
            "Updated contents",
            TimeSpan.FromSeconds(60.0)  // Make it invisible for another 60 seconds
        );

    // Dequeue the next message
    QueueMessage[] retrievedMessage = queueClient.ReceiveMessages();
    Console.WriteLine($"Dequeued message: '{retrievedMessage[0].Body}'");
    queueClient.DeleteMessage(retrievedMessage[0].MessageId, retrievedMessage[0].PopReceipt);

    // Get the queue length
    QueueProperties properties = queueClient.GetProperties();
    int cachedMessagesCount = properties.ApproximateMessagesCount; // >= of actual messages count
    Console.WriteLine($"Number of messages in queue: {cachedMessagesCount}");

    // Delete the queue
    queueClient.Delete();
}
```

```ps
az storage account create --name mystorageaccount --resource-group myresourcegroup --location eastus --sku Standard_LRS
az storage queue create --name myqueue --account-name mystorageaccount
az storage queue list --account-name mystorageaccount --output table
az storage message put --queue-name myqueue --account-name mystorageaccount --content "Hello, World!"
az storage message peek --queue-name myqueue --account-name mystorageaccount
az storage message get --queue-name myqueue --account-name mystorageaccount
az storage message delete --queue-name myqueue --account-name mystorageaccount --message-id <message-id> --pop-receipt <pop-receipt>
az storage queue delete --name myqueue --account-name mystorageaccount
```
