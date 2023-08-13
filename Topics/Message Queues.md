# [Message Queues](https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-azure-and-service-bus-queues-compared-contrasted)

## Use Cases

### Storage Queues

- **Large Message Storage**: Suitable for storing over 80 gigabytes of messages in a queue.
- **Progress Tracking**: Useful for tracking progress for processing a message, especially if a worker crashes.
- **Server-Side Logs**: If you require server-side logs of all transactions executed against your queues.
- **Large Queue Size**: If you need queues that can be larger than 80 GB in size.

### Service Bus Queues

- **Real-Time Messaging**: When your solution needs to receive messages without polling the queue.
- **Ordered Delivery**: If your solution requires guaranteed first-in-first-out (FIFO) ordered delivery.
- **Duplicate Detection**: When you want automatic duplicate detection.
- **Transactional Behavior**: If your solution requires transactional behavior and atomicity when sending or receiving multiple messages.
- **Role-Based Access**: If you need a role-based access model to the queues with different rights/permissions for senders and receivers.
- **Advanced Features**: If you're building a hybrid application or require advanced features like sessions, transactions, duplicate detection, automatic dead-lettering, and durable publish and subscribe capabilities.

The choice between Storage Queues and Service Bus Queues depends on the specific needs of your application and its architecture. Storage Queues are generally more suitable for basic communication and large storage needs, while Service Bus Queues offer more advanced features and real-time capabilities.

## Comparison

Azure Service Bus supports "Receive and Delete" mode, where messages are immediately consumed and removed from the queue.  
Messages in Event Hubs are retained for a configured retention period, and consumers are responsible for tracking their position in the stream.  
In Queue Storage messages are hidden for a specified visibility timeout period, and if not deleted within that time, they become visible again.

### Foundational Capabilities

| Comparison Criteria      | Storage Queues                                                  | Service Bus Queues                                                                 |
| ------------------------ | --------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Ordering guarantee       | No                                                              | FIFO (by using message sessions)                                                   |
| Atomic operation support | No                                                              | Yes                                                                                |
| Receive behavior         | Non-blocking (completes immediately if no new message is found) | Blocking with or without a timeout (offers long polling) / Non-blocking            |
| Push-style API           | No                                                              | Yes                                                                                |
| Receive mode             | Peek & Lease                                                    | Peek & Lock / Receive & Delete                                                     |
| Exclusive access mode    | Lease-based                                                     | Lock-based                                                                         |
| Lease/Lock duration      | 30 seconds (default) / 7 days (maximum)                         | 30 seconds (default)                                                               |
| Lease/Lock precision     | Message level                                                   | Queue level                                                                        |
| Batched receive          | Yes (up to 32 messages)                                         | Yes (implicitly enabling a pre-fetch property or explicitly by using transactions) |
| Batched send             | No                                                              | Yes (by using transactions or client-side batching)                                |

### Advanced Capabilities

| Comparison Criteria         | Storage Queues | Service Bus Queues                |
| --------------------------- | -------------- | --------------------------------- |
| Automatic dead lettering    | No             | Yes                               |
| Server-side transaction log | Yes            | No                                |
| State management            | No             | Yes                               |
| Message autoforwarding      | No             | Yes                               |
| Purge queue function        | Yes            | No                                |
| Message groups              | No             | Yes (by using messaging sessions) |
| Duplicate detection         | No             | Yes                               |

### Capacity and Quotas

| Comparison Criteria                  | Storage Queues                                        | Service Bus Queues                                                         |
| ------------------------------------ | ----------------------------------------------------- | -------------------------------------------------------------------------- |
| Maximum queue size                   | 500 TB (limited to a single storage account capacity) | 1 GB to 80 GB (defined upon creation of a queue and enabling partitioning) |
| Maximum message size                 | 64 KB (48 KB when using Base64 encoding)              | 256 KB or 100 MB (depends on the service tier)                             |
| Maximum number of queues             | Unlimited                                             | 10,000 (per service namespace)                                             |
| Maximum number of concurrent clients | Unlimited                                             | 5,000                                                                      |

### Management and Operations

| Comparison Criteria        | Storage Queues                                       | Service Bus Queues                                 |
| -------------------------- | ---------------------------------------------------- | -------------------------------------------------- |
| Management protocol        | REST over HTTP/HTTPS                                 | REST over HTTPS                                    |
| Runtime protocol           | REST over HTTP/HTTPS                                 | REST over HTTPS / AMQP 1.0 Standard (TCP with TLS) |
| Arbitrary metadata support | Yes                                                  | No                                                 |
| Queue naming rules         | Up to 63 characters long (Letters must be lowercase) | Up to 260 characters long (case-insensitive)       |
