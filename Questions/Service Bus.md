# Service Bus

Question: You are a .Net developer working on an application that needs to send a notification to queue "iot-devices" in Azure Service Bus. Write a code snippet in C# that sends the text "data".

```cs
var connectionString = "some-value";
// Code here
```

Answer:

```cs
var connectionString = "some-value";
using (var client = new ServiceBusClient(connectionString))
{
    using (var sender = client.CreateSender(queueName))
    {
        sender.SendMessagesAsync(new ServiceBusMessage($"Messages complete"));
    }
}
```

---

Question: Specify the correct parameter for `ServiceBusSender.SendMessagesAsync()` if `text` is of type `string`.

- [ ] No parameter
- [x] `new ServiceBusMessage(Encoding.UTF8.GetBytes(text))`
- [x] `new ServiceBusMessage(text)`
- [ ] `Encoding.UTF8.GetBytes(text)`
- [ ] `text`

Answer: `ServiceBusMessage` can be both `string` and `byte[]`.

---

Question: Write an az cli script that creates an isntance of Azure Service Bus:

```ps
namespace=mynamespace
resourceGroup=myresourcegroup

# Code here
```

Answer:

```ps
namespace=mynamespace
resourceGroup=myresourcegroup

az servicebus namespace create --name $namespace --resource-group $resourceGroup --location eastus
az servicebus queue create --name myqueue --namespace-name $namespace --resource-group $resourceGroup
```

---

Question: You are managing a Service Bus namespace in Azure and need to retrieve the primary connection string for the "RootManageSharedAccessKey" authorization rule within the namespace named "mynamespace" and the resource group named "myresourcegroup". Write the Azure CLI command to achieve this.

```ps
# Code here
```

Answer:

```ps
az servicebus namespace authorization-rule keys list --name RootManageSharedAccessKey --namespace-name mynamespace --resource-group myresourcegroup --query primaryConnectionString
```

This command lists the keys for the specified authorization rule within the Service Bus namespace. By specifying the name of the authorization rule, namespace, and resource group, and using the --query parameter to filter the output, you can retrieve the primary connection string for the specified rule.

---

Question: You are designing a notification system using Azure Service Bus. Messages contain the following properties:

- `Temperature`: the temperature reading.
- `Location`: the location of the reading.

You need to create a subscription that handles messages that are not generated from South America and not above 40 degrees. Which filter type should you implement?

- [x] SqlRuleFilter
- [ ] CorrelationRuleFilter
- [ ] TrueRuleFilter
- [ ] FalseRuleFilter
- [ ] No filter

Answer: An SQL Filter allows you to write complex conditions using SQL-like expressions. In this scenario, you need to filter messages based on multiple conditions related to temperature, and location. An SQL Filter can handle this complexity, such as `new SqlRuleFilter("Temperature < 40 AND AND Location <> 'South America'")`.

---

Question: You are building a ticketing system where messages contain:

- `EventID`: the unique identifier for an event.
- `Category`: the category of the event (e.g., Music, Sports).
- `Priority`: the priority level (e.g., High, Low).

You need to create a subscription that handles only high-priority sports events. Which filter type should you implement?

- [ ] SqlRuleFilter
- [x] CorrelationRuleFilter
- [ ] TrueRuleFilter
- [ ] FalseRuleFilter
- [ ] No filter

Answer: A Correlation Filter is suitable for matching messages based on specific properties without complex logic. In this case, you are matching messages based on two specific properties: `Category` and `Priority`. A Correlation Filter can efficiently handle this, such as `new CorrelationRuleFilter() {Category = "Sports", Priority = "High"}`.

---

Question: You are developing a logging system that captures all messages in Azure Service Bus for auditing purposes. The system must store every single message without any filtering. Which filter type should you implement?

- [ ] SqlRuleFilter
- [ ] CorrelationRuleFilter
- [x] TrueRuleFilter
- [ ] FalseRuleFilter
- [x] No filter

Answer: A TrueFilter is a special filter that always returns true, meaning it selects all arriving messages without any conditions. In this scenario, where you need to capture every single message without any filtering, a TrueFilter is the appropriate choice, such as `new TrueRuleFilter()`. It ensures that all messages are selected for the subscription, fulfilling the requirement for complete logging.

---

Question: You are designing a notification system for a large organization using Azure Service Bus. The system must send updates to multiple subscribers whenever a new policy is published. Which feature of Azure Service Bus should you utilize to ensure that all subscribers receive the new policy notifications?

- [ ] Queues
- [x] Topics
- [ ] Relay
- [ ] Event Hub

Answer: Topics in Azure Service Bus are designed for one-to-many communication scenarios where a single message can be sent to multiple subscribers. Queues are used for point-to-point connections, Relay is for hybrid connections, and Event Hub is for event streaming. Therefore, Topics are the correct choice for this scenario.

---

Question: You are building a customer support system where each support ticket must be processed by exactly one support agent. You want to use Azure Service Bus to handle the distribution of support tickets. Which feature of Azure Service Bus would be most appropriate for ensuring that each ticket is processed by only one agent?

- [ ] Topics
- [x] Queues
- [ ] Event Hub
- [ ] Relay

Answer: Queues in Azure Service Bus are used for point-to-point connections, ensuring that each message (in this case, a support ticket) is processed by only one receiver (support agent). Topics are for one-to-many scenarios, Event Hub is for event streaming, and Blob Storage is for unstructured data storage. Therefore, Queues are the correct choice for this scenario.

---
