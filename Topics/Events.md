# Events

## General Comparison

| Feature/Aspect          | Azure Event Hub                                 | Azure Event Grid                                                     |
| ----------------------- | ----------------------------------------------- | -------------------------------------------------------------------- |
| **Purpose**             | Telemetry and event data streaming.             | Event-based architectures, decoupling event producers and consumers. |
| **Data Volume**         | High throughput, millions of events per second. | Lower throughput, suitable for discrete events.                      |
| **Ordering**            | Maintains the order of events.                  | Does not guarantee the order of events.                              |
| **Real-time Analytics** | Suitable for real-time analytics.               | Not suitable for real-time analytics.                                |
| **Protocol Support**    | AMQP, HTTPS.                                    | HTTP/HTTPS.                                                          |

## Unique Features for Event Hub

- **Consumer Groups**: Supports multiple consumer groups for reading the same partitioned stream.
- **Partitioning**: Data is partitioned for better scalability and throughput.
- **Durability**: Offers built-in data retention policies.

## Unique Features for Event Grid

- **Filters**: Supports event filtering at the topic level.
- **Fan-out**: Supports multiple subscribers and can fan-out events.
- **Event Schema**: Uses a specific schema for events.
- **Serverless**: Works well with Azure Functions, Logic Apps.
- **Global Reach**: Can route events to different Azure regions.
