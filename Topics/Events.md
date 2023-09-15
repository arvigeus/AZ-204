# Events

## General Comparison

| Feature         | Azure Event Hubs                           | Azure Event Grid                          |
| --------------- | ------------------------------------------ | ----------------------------------------- |
| **Data**        | Handles high-volume data                   | Focuses on event, not payload             |
| **Integration** | Works with Azure Stream Analytics          | Built-in Azure service integration        |
| **Pricing**     | Charges by data ingested                   | Charges per operation, 🏷️ for low payload |
| **Scalability** | Millions of events/sec, ideal for big data | Auto-scales, limited max throughput       |
| **Use Case**    | Real-time analytics, large data volumes    | Real-time event processing                |
