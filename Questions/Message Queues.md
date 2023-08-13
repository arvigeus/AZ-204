# Azure message queues

Question: Which of the following advanced features of Azure Service Bus creates a first-in, first-out (FIFO) guarantee?

- [ ] Transactions
- [ ] Scheduled delivery
- [x] Message sessions

Answer: To create a first-in, first-out (FIFO) guarantee in Service Bus, use sessions. Message sessions enable joint and ordered handling of unbounded sequences of related messages.  
Scheduled delivery: Messages can be submitted to a queue or topic for delayed processing, but that doesn't guarantee a FIFO.  
A transaction groups two or more operations together into an execution scope.

---

Question: In Azure Service Bus messages are durably stored which enables a load-leveling benefit. Which of the following correctly describes the load-leveling benefit relative to a consuming application's performance?

- [ ] Performance needs to handle peak load
- [x] Performance needs to handle average load
- [ ] Performance needs to handle low loads

Answer: Intermediating message producers and consumers with a queue means that the consuming application only has to be able to handle average load instead of peak load.

---

Question: You are building a logging system for a large-scale manufacturing automation system. You want to send a message to a centralized monitoring system whenever a specific machine error occurs. Once the error has been logged and the necessary maintenance team has been alerted, the message must be removed so that the monitoring system will not attempt to log it again. Which service should you use?

- [ ] Azure Event Hubs
- [ ] Azure Queue Storage
- [x] Azure Service Bus

Answer: Azure Service Bus supports "Receive and Delete" mode, where messages are immediately consumed and removed from the queue.  
Messages in Event Hubs are retained for a configured retention period, and consumers are responsible for tracking their position in the stream.  
In Queue Storage messages are hidden for a specified visibility timeout period, and if not deleted within that time, they become visible again.

---

Question: For which cases `param` could be of type `string`?

- [x] `ServiceBusSender.SendMessagesAsync(new ServiceBusMessage(param)`
- [ ] `QueueClient.SendAsync(new Message(param))`
- [x] `EventHubProducerClient.SendAsync(new EventData(param))`
- [ ] None of the listed

Answer: `EventData` and `ServiceBusMessage` support both `string` and `byte[]`, `Message` is for `byte[]` only. Prefer `byte[]` for `EventData`.

---

Question: For which cases `param` could be of type `byte[]`?

- [x] `ServiceBusSender.SendMessagesAsync(new ServiceBusMessage(param)`
- [x] `QueueClient.SendAsync(new Message(param))`
- [x] `EventHubProducerClient.SendAsync(new EventData(param))`
- [ ] None of the listed

Answer: All work with `byte[]`.

---
