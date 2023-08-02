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
