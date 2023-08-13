# Azure Event Hubs

Question: Which of the following Event Hubs concepts represents an ordered sequence of events that is held in an Event Hubs?

- [ ] Consumer group
- [x] Partition
- [ ] Event Hubs producer

---

Answer: A partition is an ordered sequence of events that is held in an Event Hub.  
A consumer group is a view of an entire Event hub.  
An Event Hub producer is a type of client.

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

Which class allows you to send messages in Event Hub?

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
