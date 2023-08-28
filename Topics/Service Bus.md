# [Azure Service Bus](https://docs.microsoft.com/en-us/azure/service-bus-messaging/)

Endpoint: `https://servicebus.azure.net`

Supports AMQP 1.0, enabling applications to work with Service Bus, and on-premises brokers like ActiveMQ or RabbitMQ.

Up to 80 GB only.

- **Queue**: Only one consumer receives and processes each message at a time (_point-to-point_ connection), and since messages are stored durably in the queue, producers and consumers don't need to handle messages concurrently.
- **Load-leveling**: Effectively buffering against fluctuating system loads, ensuring the system is optimized to manage the average load, instead of peaks.
- **Decoupling**: Client and service don't have to be online at the same time.
- [**Receive modes**](https://learn.microsoft.com/en-us/azure/service-bus-messaging/message-transfers-locks-settlement):
  - **Receive and delete**: Messages are immediately consumed and removed.
  - **Peek lock**: Messages are locked for processing, and the application must explicitly complete the processing to mark the message as consumed. If the application fails, the message can be abandoned or automatically unlocked after a timeout (1min default).
- **Topics:** Publishers send messages to a topic (1:n), and each message is distributed to all subscriptions registered with the topic.
- **Subscriptions:** Subscribers receive message copies from the topic, based on filter rules set on their subscriptions. Subscriptions act like virtual queues and can apply filters to receive specific messages.
- **Rules and actions**: You can configure subscriptions to process messages with specific characteristics differently. This is done using **filter actions**. When a subscription is created, you can define a filter expression that operates on message properties - system (ex. `"Label"`) or custom (ex: `"StoreName"`). This expression allows you to copy only the desired subset of messages to the virtual subscription queue. If no SQL filter expression is provided, the filter action applies to all messages in that subscription.

| Premium                               | Standard                       |
| ------------------------------------- | ------------------------------ |
| High throughput                       | Variable throughput            |
| Predictable performance               | Variable latency               |
| Fixed pricing                         | Pay as you go variable pricing |
| Ability to scale workload up and down | N/A                            |
| Message size up to 100 MB             | Message size up to 256 KB      |

## Payload and serialization

In the form of key-value pairs. The payload is always an opaque _binary block_ when stored or in transit. Its format can be described using the `ContentType` property. Applications are advised to manage object serialization themselves.

The AMQP protocol serializes objects into an AMQP object, retrievable by the receiver using `GetBody<T>()`. Objects are serialized into an AMQP graph of `ArrayList` and `IDictionary<string,object>`.

Each message has two sets of properties: _system-defined broker properties_, and _user-defined properties_. Broker properties, like `To`, `ReplyTo`, `ReplyToSessionId`, `MessageId`, `CorrelationId`, and `SessionId`, aid in message routing, including simple request/reply, multicast request/reply, multiplexing, and multiplexed request/reply.

### Message Routing and Correlation

Broker properties like `To`, `ReplyTo`, `ReplyToSessionId`, `MessageId`, `CorrelationId`, and `SessionId` assist in message routing. The routing patterns are:

- **Simple request/reply**: Publishers send messages and await replies in a queue. Replies are addressed using `ReplyTo` and correlated with `MessageId`. Multiple replies are possible.
- **Multicast request/reply**: Similar to the simple pattern, but messages are sent to a topic, and multiple subscribers can respond. Responses can be distributed if `ReplyTo` points to a topic.
- **Multiplexing**: Streams of related messages are directed through one queue or subscription using matching `SessionId` values.
- **Multiplexed request/reply**: Multiple publishers share a reply queue, and replies are guided by `ReplyToSessionId` and `SessionId`.

Routing is managed interally, but applications can also use user properties for routing, as long as they don't use the reserved `To` property.

## Advanced features

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

## Security

RBAC:

- Azure Service Bus Data Owner
- Azure Service Bus Data Sender
- Azure Service Bus Data Receiver

Also supports SAS and Managed Identities

## [Topic filters and actions](https://learn.microsoft.com/en-us/azure/service-bus-messaging/topic-filters)

### Filters

- **SQL Filters** (`SqlRuleFilter`):

  - **Use**: Complex conditions using SQL-like expressions.
  - **Example**: Filtering messages having specific property value (or not) and quantities.
  - **Impact**: Lower throughput compared to Correlation Filters.

- **Boolean Filters** (`TrueRuleFilter` and `FalseRuleFilter`):

  - **Use**: Select all (TrueFilter) or none (FalseFilter) of the messages.
  - **Example**: `new TrueRuleFilter()` for all messages.

- **Correlation Filters** (`CorrelationRuleFilter`):
  - **Use**: Match messages based on specific properties like CorrelationId.
  - **Example**: Filtering messages with a specific subject and correlation ID.
  - **Impact**: More efficient in processing, preferred over SQL filters.

### Actions

- **Use**: Modify message properties after matching and before selection.
- **Example**: Setting a new quantity value if property matches a value (or not).

### Usage Patterns

- **Broadcast Pattern**: Every subscription gets a copy of each message.
- **Partitioning Pattern**: Distributes messages across subscriptions in a mutually exclusive manner.
- **Routing Pattern**: Distributes messages predictably but not exclusively.

## [Azure Service Bus for .NET](https://learn.microsoft.com/en-us/dotnet/api/overview/azure/service-bus)

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

        sender.SendMessagesAsync(new ServiceBusMessage($"Messages complete"));
    }

    using (processor = client.CreateProcessor(queueName, new ServiceBusProcessorOptions()))
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

```sh
az servicebus namespace create --name mynamespace --resource-group myresourcegroup --location eastus
az servicebus queue create --name myqueue --namespace-name mynamespace --resource-group myresourcegroup

az servicebus queue list --namespace-name mynamespace --resource-group myresourcegroup

az servicebus namespace authorization-rule keys list --name RootManageSharedAccessKey --namespace-name mynamespace --resource-group myresourcegroup --query primaryConnectionString

# Send, Peek, Delete - You would use an SDK or other tooling

az servicebus queue delete --name myqueue --namespace-name mynamespace --resource-group myresourcegroup
az servicebus namespace delete --name mynamespace --resource-group myresourcegroup
```

```ps
New-AzServiceBusNamespace -ResourceGroupName myResourceGroup -Name myNamespace -SkuName Premium -Location northeurope -IdentityType UserAssigned
```
