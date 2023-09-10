# Azure Event Hubs

Question: Which of the following Event Hubs concepts represents an ordered sequence of events that is held in an Event Hubs?

- [ ] Consumer group
- [x] Partition
- [ ] Event Hubs producer

Answer: A partition is an ordered sequence of events that is held in an Event Hub.  
A consumer group is a view of an entire Event hub.  
An Event Hub producer is a type of client.

---

Question: Which of the following options represents when an event processor marks or commits the position of the last successfully processed event within a partition?

- [x] Checkpointing
- [ ] Scale
- [ ] Load balance

Answer: Checkpointing is a process by which an event processor marks or commits the position of the last successfully processed event within a partition.  
Scale covers the number of consumers and taking ownership of reading partitions.  
Increase or reduce the consumers dynamically. The pool of consumers can rebalance the number of partitions they own, to share the load with the newly added consumers.

---

Question: Which of the following is a valid EventHub connection string?

- [x] `Endpoint=sb://example-namespace.servicebus.windows.net/;SharedAccessKeyName=KeyName;SharedAccessKey=AccessKey`
- [ ] `sb://example-namespace.servicebus.windows.net/;SharedAccessKeyName=KeyName;SharedAccessKey=AccessKey`
- [ ] `https://example-namespace.servicebus.windows.net/;SharedAccessKeyName=KeyName;SharedAccessKey=AccessKey`
- [ ] `Endpoint=https://example-namespace.servicebus.windows.net/;SharedAccessKeyName=KeyName;SharedAccessKey=AccessKey`

Answer: `Endpoint=sb://...`

---

Question: Specify the correct parameter for `EventHubProducerClient.SendAsync()` if `text` is of type `string`.

- [ ] No parameter
- [x] `new EventData(Encoding.UTF8.GetBytes(text))`
- [x] `new EventData(text)`
- [ ] `Encoding.UTF8.GetBytes(text)`
- [ ] `text`

Answer: Prefer using `byte[]` with `EventData`.

---

Question: Which class allows you to send messages in Event Hub?

- [x] `EventHubClient`
- [ ] `EventHubConsumerClient`
- [ ] `EventHubSender`
- [ ] `EventHub`

Answer: `EventHubClient`

---

Question: In a distributed temperature monitoring system, various sensors are sending data to an Event Hub. You need to guarantee that the temperature readings from all sensors are processed in the exact sequence they were sent. How can you achieve this?

- [x] Use a common partition key for all sensors.
- [ ] Utilize the same EventHubClient instance across all sensors.
- [ ] Switch to Premium tier
- [ ] Implement a buffering mechanism within the Event Hub.

Answer: You should use a common partition key for all sensors. By using the same partition key, you ensure that the readings from different sensors are kept together in the same partition and processed in the order in which they arrived.

---

Question: How does Event Hubs Capture handle scalability?

- [ ] It requires manual scaling with throughput units
- [x] It scales automatically with throughput units
- [ ] It does not scale
- [ ] It scales based on the number of partitions

Answer: Event Hubs Capture scales automatically with throughput units

---

Question: Which of the following is true about the storage accounts in Event Hubs Capture?

- [ ] They must be in the same region as your event hub
- [x] They can be in any region
- [ ] They must be in a different region from your event hub

Answer: Storage accounts can be in the same region as your event hub or in another region.

---

Question: What is the format in which captured data is written by Event Hubs Capture?

- [ ] JSON
- [ ] XML
- [x] Apache Avro
- [ ] CSV
- [ ] YAML

Answer: Captured data is written in Apache Avro format

---

Question: A global manufacturing company is deploying thousands of sensors across its facilities. Each sensor generates a continuous stream of data that needs to be captured automatically. The data must be stored in Azure Data Lake V2 storage and organized by sensor type. The solution must also allow processing real-time and batch-based pipelines on the same stream. Which Azure service would be the most suitable for implementing this solution?

- [ ] Azure IoT Hub
- [ ] Azure Stream Analytics
- [x] Event Hubs Capture
- [ ] Azure Data Lake Analytics

Answer: Event Hubs Capture allows automatic capturing of streaming data, can process real-time and batch-based pipelines on the same stream, and scales automatically with throughput units. It also supports storing the captured data in Azure Data Lake Storage.

---

Question: Which should you choose if you publish events frequently and you want higher throuput and lower latency?

- [ ] Use HTTPS protocol
- [ ] Use HTTP protocol
- [x] Use AMQP protocol
- [ ] You need Premium plan to achieve better performance
- [ ] Event Hub is optimized for high throuput, lower latency scenarios by default

Answer: AMQP offers higher performance for frequent publishers.  
Tier does not affect performance.

---

Question: Which protocol should you choose if you want to publish a single event, with minimal network cost?

- [x] Use HTTPS protocol
- [ ] Use HTTP protocol
- [ ] Use AMQP protocol
- [ ] You need Dedicated plan to mimimize costs
- [ ] Network cost is the same regardless of the protocol or tier

Answer: AMQP requires a persistent bidirectional socket plus TLS or SSL/TLS, resulting in higher initial network costs.

---

Question: A healthcare organization is developing a real-time patient monitoring system. The system will monitor vital signs from patients in 5 different wards. The data from the sensors in each ward is sent to Azure Event Hubs for real-time analytics. Three different teams within the organization—Emergency Response, Data Analytics, and Hospital Administration—consume this data through Azure Web Apps for various purposes. You are tasked with setting up the Azure Event Hub for this system. Your goal is to optimize for high data throughput and low latency. How many partitions should you configure in the Azure Event Hub?

- [ ] 3 Partitions
- [x] 5 Partitions
- [ ] 8 Partitions
- [ ] 12 Partitions

Bonus question: What would you use as the partition key?

Answer: To achieve the highest data throughput, it's advisable to allocate an individual partition for each ward. Given that the partitioning should be aligned with the source of incoming data, alternative approaches would be incorrect.  
Bonus answer: Ward. Because we use it for partitioning.

---

Question: Your team is tasked with creating an application to collect data from various IoT devices. You've decided to use Azure Event Hubs for event ingestion. To meet the project requirements, you need to store these events in Azure Blob Storage. Which Azure Event Hubs feature should you utilize to save the data in Azure Blob Storage?

- [ ] Throughput Units
- [ ] Partition Keys
- [x] Event Hubs Capture
- [ ] Event Streams

Answer: To store data in Azure Blob Storage, you would use the Azure Event Hubs Capture feature. Azure Event Hubs Capture allows for the automatic saving of event data to Azure Blob Storage.

---

Question: Complete the following command: `az eventhubs ??? authorization-rule keys list --resource-group MyResourceGroupName --namespace-name MyNamespaceName --eventhub-name MyEventHubName --name SomeName`. What should you put instead of `???`?

- [ ] `namespace`
- [x] `eventhub`
- [ ] `get`
- [ ] `show`

Answer: The command is to get connection string for a specific event hub within a namespace.

---

Question: Complete the following command: `az eventhubs ??? authorization-rule keys list --resource-group MyResourceGroupName --namespace-name MyNamespaceName --name SomeName`. What should you put instead of `???`?

- [x] `namespace`
- [ ] `eventhub`
- [ ] `get`
- [ ] `show`

Answer: The command is to get connection string for a namespace.

---
