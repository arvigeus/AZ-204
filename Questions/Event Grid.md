# Azure Event Grid

Question: Which of the following event schema properties requires a value?

- [ ] Topic
- [ ] Data
- [x] Subject

Answer: The subject property specifies the publisher-defined path to the event subject and is required.  
Event Grid will provide Topic.  
A value isn't required for Data

---

Question: You are tasked with creating and deploying an Azure Function App that will handle events from a custom Azure Event Grid topic. To allow subscribers to effectively filter and route these events, which event schema property should you leverage?

- [ ] `eventTime`
- [ ] `eventType`
- [x] `subject`
- [ ] `data`

Answer: Explanation: The `subject` property is used by subscribers to filter and route events when dealing with custom topics in Azure Event Grid. You can include the path where the event occurred in the `subject` property, enabling subscribers to filter events based on segments of that path. This flexibility allows subscribers to filter events either narrowly or broadly.

---

Question: You are responsible for monitoring various Azure resources in your organization. You want to set up an Azure Event Grid subscription to specifically receive only failure messages for any type of resource. Which of the following options should you configure in your Event Grid subscription to achieve this?

- [ ] Subject begins with or ends with
- [ ] Advanced fields and operators
- [ ] ResourceType
- [x] EventType

Answer: In Azure Event Grid, you can configure your subscription to filter events based on `EventType`. This allows you to specifically receive failure messages for any type of Azure resource. By setting up your Event Grid subscription to only pass along events of a certain type, such as failure messages, you can effectively monitor the health of various resources in your organization.

---

Question: You manage Azure Virtual Machines, SQL Databases, and Blob Storage. Each resource type requires a unique action when an event occurs: VMs need restarting, SQL Databases need backups, and Blob Storage needs old log deletion. To route events to specific actions based on the Azure resource involved, which Event Grid option should you configure?

- [ ] Subject begins with or ends with
- [ ] Advanced fields and operators
- [x] ResourceType
- [ ] EventType

Answer: By using `ResourceTypes`, you can ensure that each type of resource triggers its corresponding action, allowing for targeted and efficient automated responses.

---

Question: You are managing an Azure Blob Storage account that contains multiple containers. One of these containers is critical and stores time-sensitive data. You need to set up an alerting mechanism to receive messages whenever objects are added to this specific container. To receive messages specifically when objects are added to a particular container in Azure Blob Storage, which Event Grid option should you configure?

- [x] Subject begins with or ends with
- [ ] Advanced fields and operators
- [ ] ResourceType
- [ ] EventType

Answer: By using "Subject begins with or ends with," you can precisely target events related to the specific container in Azure Blob Storage, ensuring that you receive messages only when objects are added to that container. This allows for targeted alerting and monitoring.

---

Question: Which of the following Event Grid built-in roles is appropriate for managing Event Grid resources?

- [x] Event Grid Contributor
- [ ] Event Grid Subscription Contributor
- [ ] Event Grid Data Sender

Answer: The Event Grid Contributor role has permissions to manage resources.  
The Event Grid Subscription Contributor role has permissions to manage subscription operations.  
The Event Grid Data Sender role has permissions to send events to topics.

---

Question: You are trying to send a 130KB event from Event Hub to Event Grid. Which of the following statements are true:

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

Question: What best describes the optimistic batching behavior in Azure Event Grid?

- [ ] Optimistic batching ensures that the batch size is always equal to the requested maximum events per batch.
- [x] Optimistic batching respects policy settings on a best-effort basis, often leading to smaller batch sizes at low event rates.
- [ ] Optimistic batching operates with flexible semantics, allowing partial success of a batch delivery.
- [ ] Optimistic batching is responsible for handling events that cannot be delivered to the endpoint.
- [ ] Optimistic batching requires both the Maximum events per batch and Approximate batch size in kilobytes to be specified.

Answer: Optimistic batching results in smaller batch sizes at low event rates.  
Event Grid works on _All-or-None_ policy, no partial delivery allowed when batching.  
It's not necessary to specify both the settings (Maximum events per batch and Approximate batch size in kilobytes).

---

Question: What command you need to run to enable your Azure subscription to send events to Event Grid?

- [x] `az provider register --namespace Microsoft.EventGrid`
- [ ] `az group create --name Microsoft.EventGrid`
- [ ] `az eventgrid topic create --name "ServiceBus, BlobStorage"`
- [ ] `az subscription --enable Microsoft.EventGrid`

Answer: It will take some minutes. You need to run this only once per subscription.

---

Question: Which event format can be used to represent events in a standardized way across different cloud providers and platforms?

- [ ] EventGridEvent
- [x] CloudEvent
- [ ] AzureBlobEvent
- [ ] CustomEvent

Answer: CloudEvent is a standardized specification designed to provide interoperability across services, platforms, and systems. It can be used across different cloud providers and platforms, unlike EventGridEvent, which is specific to Azure.

---

Question: If you are working specifically within the Azure ecosystem and want to take advantage of Azure-specific features, which event format would you likely use?

- [ ] CustomEvent
- [ ] CloudEvent
- [x] EventGridEvent
- [ ] AzureQueueEvent

Answer: EventGridEvent is specific to Azure Event Grid and is designed to work seamlessly with Azure services. It includes additional features specific to Azure, like support for Event Domains, making it the suitable choice for Azure-specific implementations. CloudEvent, on the other hand, is a more generalized standard and doesn't include Azure-specific features.

---

Question: What is the minimum number of subscribers a publisher in Event Grid must have?

- [x] 0
- [ ] 1
- [ ] 3
- [ ] 5

Answer: Publishers emit events, but have no expectation about how the events are handled.

---

Question: Does Event Grid allow Azure Functions to respond to Azure Blob storage events, such as generating thumbnails for newly uploaded images?

- [x] Yes
- [ ] No

Answer: It's a valid use case.

---

Question: Fill in "XXX" and "YYY" for this Event Grid filter:

```jsonc
{
  "XXX": [
    {
      "operatorType": "StringContains",
      "key": "Subject",
      "YYY": ["container1", "container2"]
    }
  ]
}
```

Answer:

```jsonc
{
  "advancedFilters": [
    {
      "operatorType": "StringContains",
      "key": "Subject",
      "values": ["container1", "container2"]
    }
  ]
}
```

Question: Configure Azure Event Grid service to send events to an Azure Event Hub instance.

```ps
topicName="<Topic_Name>"
location="<Location>"
resourceGroupName="<Resource_Group_Name>"
namespaceName="<Namespace_Name>"
eventHubName="<Event_Hub_Name>"

# Code here
```

Answer:

```ps
topicName="<Topic_Name>"
location="<Location>"
resourceGroupName="<Resource_Group_Name>"
namespaceName="<Namespace_Name>"
eventHubName="<Event_Hub_Name>"

az eventgrid topic create --name $topicName --location $location --resource-group $resourceGroupName

# az eventgrid topic show --name $topicName --resource-group $resourceGroupName --query "{endpoint:endpoint, primaryKey:primaryKey}" --output json

# Create a namespace
az eventhubs namespace create --name $namespaceName --location $location --resource-group $resourceGroupName

# Create an event hub
az eventhubs eventhub create --name $eventHubName --namespace-name $namespaceName --resource-group $resourceGroupName

topicId=$(az eventgrid topic show --name $topicName --resource-group $resourceGroupName --query "id" --output tsv)
hubId=$(az eventhubs eventhub show --name $eventHubName --namespace-name $namespaceName --resource-group $resourceGroupName --query "id" --output tsv)

# Link the Event Grid Topic to the Event Hub
az eventgrid event-subscription create \
  --name "<Event_Subscription_Name>" \
  --source-resource-id $topicId \
  --endpoint-type eventhub \
  --endpoint $hubId
```

---
