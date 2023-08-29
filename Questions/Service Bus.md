# Service Bus

Question: You are a .Net developer working on an application that needs to send a notification to queue "iot-devices" in Azure Service Bus. Write a code snippet in C# that sends the text "data".

```cs
var connectionString = "some-value";
// Code here
```

Answer:

```cs
var connectionString = "some-value";
using (var client = new ServiceBusClient(connectionString))
{
    using (var sender = client.CreateSender(queueName))
    {
        sender.SendMessagesAsync(new ServiceBusMessage($"Messages complete"));
    }
}
```

---

Question: Specify the correct parameter for `ServiceBusSender.SendMessagesAsync()` if `text` is of type `string`.

- [ ] No parameter
- [x] `new ServiceBusMessage(Encoding.UTF8.GetBytes(text))`
- [x] `new ServiceBusMessage(text)`
- [ ] `Encoding.UTF8.GetBytes(text)`
- [ ] `text`

Answer: `ServiceBusMessage` can be both `string` and `byte[]`.

---

Question: Write an az cli script that creates an isntance of Azure Service Bus:

```ps
namespace=mynamespace
resourceGroup=myresourcegroup

# Code here
```

Answer:

```ps
namespace=mynamespace
resourceGroup=myresourcegroup

az servicebus namespace create --name $namespace --resource-group $resourceGroup --location eastus
az servicebus queue create --name myqueue --namespace-name $namespace --resource-group $resourceGroup
```

---

Question: You are managing a Service Bus namespace in Azure and need to retrieve the primary connection string for the "RootManageSharedAccessKey" authorization rule within the namespace named "mynamespace" and the resource group named "myresourcegroup". Write the Azure CLI command to achieve this.

```ps
# Code here
```

Answer:

```ps
az servicebus namespace authorization-rule keys list --name RootManageSharedAccessKey --namespace-name mynamespace --resource-group myresourcegroup --query primaryConnectionString
```

This command lists the keys for the specified authorization rule within the Service Bus namespace. By specifying the name of the authorization rule, namespace, and resource group, and using the --query parameter to filter the output, you can retrieve the primary connection string for the specified rule.

---

Question: You are designing a notification system using Azure Service Bus. Messages contain the following properties:

- `Temperature`: the temperature reading.
- `Location`: the location of the reading.

You need to create a subscription that handles messages that are not generated from South America and not above 40 degrees. Which filter type should you implement?

- [x] SqlRuleFilter
- [ ] CorrelationRuleFilter
- [ ] TrueRuleFilter
- [ ] FalseRuleFilter
- [ ] No filter

Answer: An SQL Filter allows you to write complex conditions using SQL-like expressions. In this scenario, you need to filter messages based on multiple conditions related to temperature, and location. An SQL Filter can handle this complexity, such as `new SqlRuleFilter("Temperature < 40 AND AND Location <> 'South America'")`.

---

Question: You are building a ticketing system where messages contain:

- `EventID`: the unique identifier for an event.
- `Category`: the category of the event (e.g., Music, Sports).
- `Priority`: the priority level (e.g., High, Low).

You need to create a subscription that handles only high-priority sports events. Which filter type should you implement?

- [ ] SqlRuleFilter
- [x] CorrelationRuleFilter
- [ ] TrueRuleFilter
- [ ] FalseRuleFilter
- [ ] No filter

Answer: A Correlation Filter is suitable for matching messages based on specific properties without complex logic. In this case, you are matching messages based on two specific properties: `Category` and `Priority`. A Correlation Filter can efficiently handle this, such as `new CorrelationRuleFilt- [ ] {Category = "Sports", Priority = "High"}`.

---

Question: You are developing a logging system that captures all messages in Azure Service Bus for auditing purposes. The system must store every single message without any filtering. Which filter type should you implement?

- [ ] SqlRuleFilter
- [ ] CorrelationRuleFilter
- [x] TrueRuleFilter
- [ ] FalseRuleFilter
- [x] No filter

Answer: A TrueFilter is a special filter that always returns true, meaning it selects all arriving messages without any conditions. In this scenario, where you need to capture every single message without any filtering, a TrueFilter is the appropriate choice, such as `new TrueRuleFilter()`. It ensures that all messages are selected for the subscription, fulfilling the requirement for complete logging.

---

Question: You are developing a logging system that captures all messages in Azure Service Bus for auditing purposes. The system will be used in the future and should not accept any messages at the moment.

- [ ] SqlRuleFilter
- [ ] CorrelationRuleFilter
- [ ] TrueRuleFilter
- [x] FalseRuleFilter
- [ ] No filter

Answer: A FalseRuleFilter is a specific filter that always returns false, meaning it will not select any incoming messages. In this case, where the system should not accept any messages at the moment, a FalseRuleFilter is the most suitable option, such as new `FalseRuleFilter()`. This ensures that no messages are selected for the subscription, aligning with the requirement to not capture any messages currently.

---

Question: You are designing a notification system for a large organization using Azure Service Bus. The system must send updates to multiple subscribers whenever a new policy is published. Which feature of Azure Service Bus should you utilize to ensure that all subscribers receive the new policy notifications?

- [ ] Queues
- [x] Topics
- [ ] Relay
- [ ] Event Hub

Answer: Topics in Azure Service Bus are designed for one-to-many communication scenarios where a single message can be sent to multiple subscribers. Queues are used for point-to-point connections, Relay is for hybrid connections, and Event Hub is for event streaming. Therefore, Topics are the correct choice for this scenario.

---

Question: You are building a customer support system where each support ticket must be processed by exactly one support agent. You want to use Azure Service Bus to handle the distribution of support tickets. Which feature of Azure Service Bus would be most appropriate for ensuring that each ticket is processed by only one agent?

- [ ] Topics
- [x] Queues
- [ ] Event Hub
- [ ] Relay

Answer: Queues in Azure Service Bus are used for point-to-point connections, ensuring that each message (in this case, a support ticket) is processed by only one receiver (support agent). Topics are for one-to-many scenarios, Event Hub is for event streaming, and Blob Storage is for unstructured data storage. Therefore, Queues are the correct choice for this scenario.

---

Question: You are developing a ticket booking system where the order of ticket booking messages is crucial. You want to ensure that the messages related to a single booking are processed in the order they were sent. Which Azure Service Bus feature should you use?

- [x] Message sessions
- [ ] Batching
- [ ] Scheduled delivery
- [ ] Transactions

Answer: Message sessions enable First-In-First-Out (F- [ ] guaranteed handling of related messages sequence. This ensures that messages related to a single booking are processed in the order they were sent.

---

Question: You are building a real-time analytics system that needs to process messages as parallel, long-running streams. Which feature should you use?

- [ ] Autoforwarding
- [ ] Transactions
- [ ] Message deferral
- [ ] Batching
- [x] Parallel Stream Processing

Answer: Parallel Stream Processing can process messages as parallel, long-running streams using session ID.

---

Question: You want to chain a queue to another queue within the same namespace for better message routing. Which feature should you use?

- [x] Autoforwarding
- [ ] Transactions
- [ ] Message deferral
- [ ] Batching
- [ ] Parallel Stream Processing

Answer: Autoforwarding allows you to chain a queue or subscription to another within the same namespace.

---

Question: You are building a system where you need to hold messages that can't be delivered for later inspection. Which feature should you use?

- [x] Dead-letter queue
- [ ] Message deferral
- [ ] Transactions
- [ ] Autoforwarding
- [ ] Scheduled delivery

Answer: Dead-letter queue holds messages that can't be delivered and allows for their removal and inspection.

---

Question: You are developing a system where certain messages should not be processed immediately but should remain in the queue for later retrieval. Which Azure Service Bus feature should you use?

- [x] Message deferral
- [ ] Scheduled delivery
- [ ] Autoforwarding
- [ ] Parallel Stream Processing
- [ ] Batching

Answer: Message deferral allows you to defer the retrieval of a message until a later time, while the message remains set aside in the queue.  
Scheduled delivery allows for delayed processing but doesn't set the message aside for later retrieval.

---

Question: You are building a financial system where multiple operations like debit and credit need to be executed as a single unit of work. Which feature should you use?

- [x] Transactions
- [ ] Batching
- [ ] Autoforwarding
- [ ] Message deferral
- [ ] Scheduled delivery

Answer: Transactions allow you to group multiple operations into an execution scope for a single messaging entity, ensuring that all operations are executed as a single unit of work.  
Batching delays sending a message for a certain period but doesn't group operations.

---

Question: You are responsible for ensuring that your messaging system continues to function even if a datacenter goes down. Which feature should you use?

- [x] Geo-disaster recovery
- [ ] Security
- [ ] Autodelete on idle
- [ ] Parallel Stream Processing

Answer: Geo-disaster recovery allows for the continuation of data processing in a different region or datacenter during downtime, ensuring high availability.  
Parallel Stream Processing is for parallel, long-running streams but doesn't handle datacenter downtime.

---

Question: You are developing a logging system that needs to accumulate messages for a short period before sending them to reduce the number of network calls. Which Azure Service Bus feature should you use?

- [x] Batching
- [ ] Message sessions
- [ ] Message deferral
- [ ] Autoforwarding
- [ ] Transactions

Answer: Batching delays the sending of a message for a certain period, allowing you to accumulate multiple messages and send them together, thereby reducing the number of network calls.  
Message sessions enable FIFO handling but don't delay sending messages.

---

Question: You are tasked with building a component that will delay the activation of messages sent to an Azure Service Bus queue. Which of the following options should you use to achieve this functionality?

- [ ] Configure the `LockDuration` property for the queue
- [x] Configure the `ScheduledEnqueueTimeUtc` property for the messages
- [ ] Configure the `TimeToLive` property for the queue messages
- [ ] Configure the `Label` property for the messages

Answer: The `ScheduledEnqueueTimeUtc` property allows you to specify the time at which the message should be activated and made available in the queue. This ensures that messages are only moved to the Active state after a specified period of time.  
The TimeToLive property sets the duration for which a message will be available in the queue before it is automatically removed. It doesn't control the activation time of the message.  
The LockDuration property is used to define how long a message is locked for processing and is not related to delaying the activation of messages.

---

Question: Which of the following strategies would be effective for optimizing a high-throughput queue in Azure Service Bus?

- [x] Use asynchronous operations.
- [ ] Use synchronous operations.
- [x] Use multiple message factories per process.
- [ ] Use single message factories per process.
- [x] Enable batched store access.
- [ ] Disable batched store access.
- [x] Set a high prefetch count.
- [ ] Disable prefetching.

Answer: Per [best practices](https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-performance-improvements?tabs=net-standard-sdk-2#high-throughput-queue)

---

Answer: Which of the following would be effective for optimizing multiple high-throughput queues?

- [ ] Use a single message factory for all queues.
- [x] Use different factories for clients interacting with different queues.
- [x] Enable batched store access.
- [ ] Disable batched store access.
- [ ] Use synchronous operations.
- [x] Utilize asynchronous operations.

Answer: Per [best practices](https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-performance-improvements?tabs=net-standard-sdk-2#multiple-high-throughput-queues)

---

Question: What strategies would minimize latency for a queue with small or moderate throughput when using a single client?

- [ ] Use synchronous operations.
- [x] Use asynchronous operations.
- [ ] Enable client-side batching.
- [ ] Enable batched store access.
- [x] Disable client-side batching and batched store access.
- [x] Set a high prefetch count.
- [ ] Disable prefetching.

Answer: Per [best practices](https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-performance-improvements?tabs=net-standard-sdk-2#low-latency-queue)

---

Question: What strategies would minimize latency for a queue with small or moderate throughput when using a multiple clients?

- [ ] Use synchronous operations.
- [x] Use asynchronous operations.
- [ ] Enable client-side batching.
- [ ] Enable batched store access.
- [x] Disable client-side batching and batched store access.
- [ ] Set a high prefetch count.
- [x] Set the prefetch count to 0.

Answer: Per [best practices](https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-performance-improvements?tabs=net-standard-sdk-2#low-latency-queue)

---

Question: Which strategies would be effective for a queue with a large number of senders?

- [x] Use a single factory per process for each sender.
- [ ] Use a multiple factory per process for each sender.
- [ ] Disable batched store access.
- [x] Enable batched store access.
- [x] Use asynchronous operations.
- [ ] Use synchronous operations.
- [x] Set a high prefetch count.
- [ ] Set a low prefetch count.

Answer: Per [best practices](https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-performance-improvements?tabs=net-standard-sdk-2#queue-with-a-large-number-of-senders)

---

Question: What strategies would be effective for a queue with a large number of receivers?

- [x] Use a single factory per process for each receiver.
- [ ] Use a multiple factory per process for each receiver.
- [ ] Disable batched store access.
- [x] Enable batched store access.
- [x] Use asynchronous operations.
- [ ] Use synchronous operations.
- [x] Set the prefetch count to 20 times the processing rate of the receiver.
- [ ] Set a low prefetch count.

Answer: Per [best practices](https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-performance-improvements?tabs=net-standard-sdk-2#queue-with-a-large-number-of-receivers)

---

Question: In the engineering firm BuildMasters, various project proposals and contract opportunities are managed. Their custom .NET Core application, known as BidMonitor, notifies a message queue whenever there's a change in the status of any proposal or contract. In line with new security standards, all system-to-system interactions must be password-less. What should be the configuration string for the message queue topic in the BidMonitor application for optimal connectivity?

- [ ] `Endpoint=sb://sample-namespace.servicebus.windows.net/;Authentication=ManagedIdentity;TransportType=Sbmp`
- [ ] `Endpoint=sb://sample-namespace.servicebus.windows.net/;SharedAccessKeyName=KeyName;SharedAccessKey=AccessKey`
- [ ] `Endpoint=sb://sample-namespace.servicebus.windows.net/;Authentication=ManagedIdentity;TransportType=NetMessaging`
- [x] `Endpoint=sb://sample-namespace.servicebus.windows.net/;Authentication=ManagedIdentity;TransportType=Amqp`

Answer: This option utilizes Managed Identity for secure, password-less authentication and AMQP for efficient data transfer, meeting the security standards.  
`SharedAccessKeyName=KeyName;SharedAccessKey=AccessKey` utilizes Shared Access Keys, which require passwords.

---

Question: A healthcare provider is developing a telemedicine application. The application is designed to connect patients with doctors for online consultations. The application needs to follow this workflow:

1. A patient selects the medical specialty they need consultation in (e.g., Cardiology, Dermatology).
1. Consultation requests are sent to all available doctors in that specialty.
1. Only consultation requests for the selected specialty will appear for the doctor.
1. The first doctor to accept the consultation removes it from the list of available consultations.

Which of the following actions would you implement for this requirement?

- [x] Create a single Service Bus Namespace.
- [ ] Create a Service Bus Namespace for each medical specialty for which a doctor can receive messages.
- [x] Create a single Service Bus topic.
- [ ] Create a Service Bus topic for each medical specialty for which a doctor can receive messages.
- [ ] Create a single Service Bus subscription.
- [x] Create a Service Bus Subscription for each medical specialty for which a doctor can receive messages.

Answer: You should first create a Service Bus Namespace. A single namespace is sufficient to manage all the topics and subscriptions. Creating a namespace for each medical specialty would be a maintenance overhead and difficult to manage programmatically.

A single Service Bus topic is ideal. If you create multiple topics for each medical specialty, you would have to send a consultation request to all topics. Removing a consultation once accepted would become complicated.

Create a Service Bus Subscription for each medical specialty: This allows doctors to subscribe to topics that are relevant to their specialty. You can create rules based on the doctor's specialty and area to filter messages.

---
