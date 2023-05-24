# Azure Event Grid

Question: Which of the following event schema properties requires a value?

- [ ] Topic
- [ ] Data
- [x] Subject

Answer: The subject property specifies the publisher-defined path to the event subject and is required.  
Event Grid will provide Topic.  
A value isn't required for Data

Question: Which of the following Event Grid built-in roles is appropriate for managing Event Grid resources?

- [x] Event Grid Contributor
- [ ] Event Grid Subscription Contributor
- [ ] Event Grid Data Sender

Answer: The Event Grid Contributor role has permissions to manage resources.  
The Event Grid Subscription Contributor role has permissions to manage subscription operations.  
The Event Grid Data Sender role has permissions to send events to topics.
