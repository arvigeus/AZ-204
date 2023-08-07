# Azure Event Hubs

Question: Which of the following Event Hubs concepts represents an ordered sequence of events that is held in an Event Hubs?

- [ ] Consumer group
- [x] Partition
- [ ] Event Hubs producer

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
