# Azure Event Grid

Question: Which of the following event schema properties requires a value?

- [ ] Topic
- [ ] Data
- [x] Subject

Answer: The subject property specifies the publisher-defined path to the event subject and is required.  
Event Grid will provide Topic.  
A value isn't required for Data

---

Question: Which of the following Event Grid built-in roles is appropriate for managing Event Grid resources?

- [x] Event Grid Contributor
- [ ] Event Grid Subscription Contributor
- [ ] Event Grid Data Sender

Answer: The Event Grid Contributor role has permissions to manage resources.  
The Event Grid Subscription Contributor role has permissions to manage subscription operations.  
The Event Grid Data Sender role has permissions to send events to topics.

---

You are trying to send a 130KB event from Event Hub to Event Grid. Which of the following statements are true:

- [ ] Event is covered by the Service Level Agreement (SLA)
- [ ] Event contains `lastTimeModified` property
- [x] Event contains Capture file URL property
- [ ] You'll receive `413 Payload Too Large` error
- [x] You be charged for 3 separate events

Answer: Only events up to 64KB are covered by SLA.  
`lastTimeModified` is a property for Azure Storage.  
`413 Payload Too Large` happens only for events over 1MB.  
Math.roof(130 / 64) = 3

---
