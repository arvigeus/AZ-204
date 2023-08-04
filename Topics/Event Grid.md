# [Azure Event Grid](https://docs.microsoft.com/en-us/azure/event-grid/)

Azure Event Grid is a serverless broker for integrating applications through events. It sends events from sources like applications and Azure services to subscribers. Subscribers choose events to handle; publishers emit without expectations.

Event Grid supports events from Azure and custom topics, allowing easy creation of event-based applications. You can filter and route events to multiple endpoints, ensuring reliable delivery.

## Concepts

- **Events** - What happened. An event describes something that occurred, with common details like source, time, and unique identifier, and specific details relevant to the event type (example: in Azure Storage, a new file event includes details like `lastTimeModified` value, and in Event Hubs, it contains the Capture file URL). Events up to 64 KB are covered by the Service Level Agreement (SLA), and larger events are charged in increments.

- **Event sources** - Where the event took place. Each source is related to one or more event types, such as Azure Storage for blob creation, IoT Hub for device created events. Event sources send events to Event Grid.

- **Topics** - The endpoint where publishers send events. Topics are used for related events, and subscribers choose which to subscribe to. **System topics** are built-in and , while **custom topics** are application and third-party specific. You don't see system topics in your Azure subscription, but you can subscribe to them.

- **Event subscriptions** - The endpoint or mechanism to route events, sometimes to multiple handlers. Subscriptions filter incoming events by type or subject pattern and can be set with an expiration for temporary needs (_no need of cleanup_).

- **Event handlers** - Receives and processes events. Handlers can be Azure services or custom webhooks. Event Grid ensures event delivery based on handler type. Webhooks are retried until 200 - OK, and Azure Storage Queue retries until successful processing.

## Schemas

The header values for CloudEvents and Event Grid schemas are identical except for the `content-type`. In CloudEvents, it's `"content-type":"application/cloudevents+json; charset=utf-8"`, while in Event Grid, it's `"content-type":"application/json; charset=utf-8"`.

### Event Schemas

Azure Event Grid receives events in an array from event sources. The array's total size can be up to 1 MB, with each event limited to 1 MB. If the event or array exceeds these limits, you'll get a `413 Payload Too Large` response. Charges are applied in 64 KB increments - a 130 KB event is charged as three separate events.

```ts
type EventSchema = {
  // Full resource path to the event source.
  // If not included, Event Grid stamps onto the event.
  // If included, it must match the Event Grid topic Azure Resource Manager ID exactly.
  topic?: string;
  // Publisher-defined path to the event subject.
  subject: string;
  // One of the registered event types for this event source.
  eventType: string;
  // The time the event is generated based on the provider's UTC time.
  eventTime: string;
  // Unique identifier for the event.
  id: string;
  // Event data specific to the resource provider.
  data?: {
    // Object unique to each publisher.
    // Place your properties specific to the resource provider here.
  };
  // The schema version of the data object. The publisher defines the schema version.
  // If not included, it is stamped with an empty value.
  dataVersion?: string;
  // The schema version of the event metadata. Event Grid defines the schema of the top-level properties.
  // If not included, Event Grid will stamp onto the event.
  // If included, must match the metadataVersion exactly (currently, only 1)
  metadataVersion?: string;
};
```

When creating subjects for publishing events to custom topics, it helps subscribers filter and route events based on where they happened. Include the path in the subject for better filtering.

- Example 1: With a path like `/A/B/C`, subscribers can filter by `/A` for a broad set, getting events like `/A/B/C` or `/A/D/E`. For a narrower set, they can filter by `/A/B`.
- Example 2: The **Storage Accounts** publisher provides `/blobServices/default/containers/<container-name>/blobs/<file>` when adding a file. Subscribers can filter by `/blobServices/default/containers/testcontainer` for events from that container or use `.txt` to only work with text files.

### Cloud Event Schema

Event Grid manages input and output in the CloudEvents schema. CloudEvents handles system (like those from Blob Storage and IoT Hub) and custom events. It can also transform these events as needed.

```ts
interface CloudEvent {
  // Identifies the event. Producers must ensure it's unique. Consumers can assume same source+id means duplicates.
  id: string;

  // Identifies the context in which an event happened.
  // Syntax defined by the producer, preferably an absolute URI
  source: string;

  // The version of the CloudEvents specification used. Compliant producers MUST use value "1.0".
  specversion: string;

  // Describes the type of event related to the originating occurrence.
  // Should be prefixed with a reverse-DNS name.
  type: string;

  subject?: string; // Required in EventSchema, but optional here

  // eventType is now "type"
  // eventTime is now "time" and is optional

  // ...
}
```

Example of an Azure Blob Storage event in CloudEvents format:

```json
{
  "specversion": "1.0",
  "type": "Microsoft.Storage.BlobCreated",
  "source": "/subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.Storage/storageAccounts/{storage-account}",
  "id": "9aeb0fdf-c01e-0131-0922-9eb54906e209",
  "time": "2019-11-18T15:13:39.4589254Z",
  "subject": "blobServices/default/containers/{storage-container}/blobs/{new-file}",
  "dataschema": "#",
  "data": {
    "api": "PutBlockList",
    "clientRequestId": "4c5dd7fb-2c48-4a27-bb30-5361b5de920a",
    "requestId": "9aeb0fdf-c01e-0131-0922-9eb549000000",
    "eTag": "0x8D76C39E4407333",
    "contentType": "image/png",
    "contentLength": 30699,
    "blobType": "BlockBlob",
    "url": "https://gridtesting.blob.core.windows.net/testcontainer/{new-file}",
    "sequencer": "000000000000000000000000000099240000000000c41c18",
    "storageDiagnostics": {
      "batchId": "681fe319-3006-00a8-0022-9e7cde000000"
    }
  }
}
```

## Event Delivery Durability

- **Delivery Attempts**: Event Grid attempts to deliver each event at least once for each matching subscription immediately.
- **Single Event Payload**: By default, one event is delivered at a time, and the payload is an array with a single event.
- **Event Order**: Event Grid does not guarantee the order of event delivery.

Event subscriptions support custom headers for delivered events. _Up to 10 headers_ can be set, with each value _limited to 4,096 bytes_. Can be applied to events sent to:

- Webhooks
- Azure Service Bus topics and queues
- Azure Event Hubs
- Relay Hybrid Connections.

### [delivery and retry](https://learn.microsoft.com/en-us/azure/event-grid/delivery-and-retry)

#### Retry schedule

Event Grid handles errors during event delivery by deciding based on the error type whether to retry, dead-letter (only if enabled), or drop the event. Timeout is 30 sec, then event is rescheduled for retry (exponentially). Retries may be skipped or delayed (up to several hours) for consistently unhealthy endpoints (**delayed delivery**). If the endpoint responds within 3 minutes, Event Grid tries to remove the event from the retry queue. Duplicates may occur due to how things work.

| Endpoint Type   | Error Codes with no retries (immediate dead-lettering)                                        |
| --------------- | --------------------------------------------------------------------------------------------- |
| Azure Resources | 400 Bad Request, 413 Request Entity Too Large, 403 Forbidden                                  |
| Webhook         | 400 Bad Request, 413 Request Entity Too Large, 403 Forbidden, 404 Not Found, 401 Unauthorized |

#### Retry policy

An event is dropped if either of the limits of the retry policy is reached.

- **Maximum number of attempts** - 1 - 30 (default: 30)
- **Event time-to-live (TTL)** - 1 - 1440 minutes. (default 1440)

```sh
az eventgrid event-subscription create \
  -g gridResourceGroup \
  --topic-name <topic_name> \
  --name <event_subscription_name> \
  --endpoint <endpoint_URL> \
  --max-delivery-attempts 18
```

#### [Dead-Letter Events](https://learn.microsoft.com/en-us/azure/event-grid/manage-event-delivery)

Occurs if the event isn't delivered within the retry policy limits. To enable, specify a storage account for undelivered events, and provide the endpoint for this container during event subscription creation. A five-minute delay exists between the last attempt and delivery to the dead-letter location, to reduce Blob storage operations.

The time-to-live expiration is checked **only** at the next scheduled delivery attempt.

```ps
az eventgrid event-subscription create \
  --source-resource-id $topicid \
  --name <event_subscription_name> \
  --endpoint <endpoint_URL> \
  # To turn off dead-lettering, rerun this command, but don't provide a value for deadletter-endpoint
  --deadletter-endpoint $storageid/blobServices/default/containers/$containername
```

#### Output Batching

For better HTTP performance in handling a large number of events. _Off by default_. It doesn't support partial success of a batch delivery (_All or None_). The settings for batching are not strict and are respected on a best-effort basis, possibly resulting in smaller batches at low event rates (_Optimistic Batching_).

Settings:

- **Max events per batch**: 1 - 5,000 (default: 1?). If no other events are available at the time of publishing, fewer events may be delivered.
- **Preferred batch size in kilobytes**: 1 - 1024 (default: 64KB?). Smaller if not enough events are available. If a single event is larger than the preferred size, it will be delivered as its own batch.

```ps
az eventgrid event-subscription create \
  --resource-id $storageid \
  --name <event_subscription_name> \
  --endpoint $endpoint \
  --max-events-per-batch 1000 \
  --preferred-batch-size-in-kilobytes 512
```

## Control access to events

### Built-in roles

| Role                                | Description                                               |
| ----------------------------------- | --------------------------------------------------------- |
| Event Grid Subscription Reader      | Lets you read Event Grid event subscriptions.             |
| Event Grid Subscription Contributor | Lets you manage Event Grid event subscription operations. |
| Event Grid Contributor              | Lets you create and manage Event Grid resources.          |
| Event Grid Data Sender              | Lets you send events to Event Grid topics.                |

Subscriptions roles don't grant access for actions such as creating topics.

To subscribe to event handlers (except WebHooks), you need **Microsoft.EventGrid/EventSubscriptions/Write** permission to the corresponding resource (for system topics and custom topics).

| Topic Type | Permission to write a new event subscription at scope | Description                                                                                                                           |
| ---------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| System     | Resource publishing the event                         | `/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/{resource-provider}/{resource-type}/{resource-name}` |
| Custom     | Event grid topic                                      | `/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.EventGrid/topics/{topic-name}`             |

## Webhooks

When a new event is ready, Event Grid service POSTs an HTTP request to the configured endpoint with the event in the request body.

Validation is automatically handled for:

- Azure Logic Apps with Event Grid Connector
- Azure Automation via webhook
- Azure Functions with Event Grid Trigger

### Endpoint validation with Event Grid events

When using an endpoint like an HTTP-triggered Azure function with Event Grid, you'll need to validate the subscription through handshake:

1. Webhook endpoint must return an HTTP 200 status code.
1. One of the following properties must be available in the response
   - `validationCode` to complete **Synchronous handshake**
   - `validationUrl` to transition to manual validation mode (**Asynchronous handshake**). Event subscription status changes to `AwaitingManualAction`. You must perform a GET request to this URL within 5 minutes, otherwise, status will change to `Failed`, and you must restart the process.

Note: Self-signed certificates are not supported for validation; a signed certificate from a commercial CA is required.

## [Filtering](https://learn.microsoft.com/en-us/azure/event-grid/event-filtering)

```json
"filter": {
  "subjectBeginsWith": "/blobServices/default/containers/mycontainer/log",
  "subjectEndsWith": ".jpg"
}
```

```json
"filter": {
  "includedEventTypes": [
    "Microsoft.Resources.ResourceWriteFailure",
    "Microsoft.Resources.ResourceWriteSuccess"
  ]
}
```

### Advanced

```jsonc
"filter": {
  // enableAdvancedFilteringOnArrays: true // Allow array keys
  "advancedFilters": [ // AND operation
    {
      "operatorType": "NumberGreaterThanOrEquals",
      "key": "Data.Key1", // The field in the event data that you're using for filtering (number, boolean, string)
      "value": 5
    },
    {
      "operatorType": "StringContains",
      "key": "Subject",
      "values": ["container1", "container2"] // OR operation
    }
  ]
}
```

Limitations:

- 25 advanced filters and 25 filter values across all the filters per Event Grid subscription
- 512 characters per string value
- No support for escape characters in keys
