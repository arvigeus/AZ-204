# [Azure Queue Storage](https://docs.microsoft.com/en-us/azure/storage/queues/)

Endpoint: `https://queue.core.windows.net`

- May contain millions of messages, up to the total capacity limit of a storage account.
- Commonly used to create a backlog of work to process asynchronously.
- Max size: 64KB
- TTL: 7 days (⏺️), -1 to never expire.
- Applications can scale indefinitely to meet demand.

- [Azure.Core library for .NET](https://www.nuget.org/packages/azure.core/): Shared primitives, abstractions
- [Azure.Storage.Common client library for .NET](https://www.nuget.org/packages/azure.storage.common/): Infrastructure shared by the other Azure Storage client libraries.
- [Azure.Storage.Queues client library for .NET](https://www.nuget.org/packages/azure.storage.queues/): Working with Azure Queue Storage.
- [System.Configuration.ConfigurationManager library for .NET](https://www.nuget.org/packages/system.configuration.configurationmanager/): Configuration files for client applications.

```cs
// Get the connection string from app settings
// Example: DefaultEndpointsProtocol=https;AccountName={your_account_name};AccountKey={your_account_key};EndpointSuffix={endpoint_suffix}
string connectionString = ConfigurationManager.AppSettings["StorageConnectionString"];

// Instantiate a QueueClient which will be used to create and manipulate the queue
QueueClient queueClient = new QueueClient(connectionString, queueName);

// Create the queue if it doesn't already exist
await queueClient.CreateIfNotExistsAsync();

if (await queueClient.ExistsAsync())
{
    await queueClient.SendMessageAsync("message");

    // Peek at the next message
    // If you don't pass a value for the `maxMessages` parameter, the default is to peek at one message.
    PeekedMessage[] peekedMessage = await queueClient.PeekMessagesAsync();

    // Change the contents of a message in-place
    // This code saves the work state and grants the client an extra minute to continue their message (default is 30 sec).
    QueueMessage[] message = await queueClient.ReceiveMessagesAsync();
    // PopReceipt must be provided when performing operations to the message
    // in order to prove that the client has the right to do so when locked
    queueClient.UpdateMessage(message[0].MessageId,
            message[0].PopReceipt,
            "Updated contents",
            TimeSpan.FromSeconds(60.0)  // Make it invisible for another 60 seconds
        );

    // Dequeue the next message
    QueueMessage[] retrievedMessage = await queueClient.ReceiveMessagesAsync();
    Console.WriteLine($"Dequeued message: '{retrievedMessage[0].Body}'");
    await queueClient.DeleteMessageAsync(retrievedMessage[0].MessageId, retrievedMessage[0].PopReceipt);

    // Get the queue length
    QueueProperties properties = await queueClient.GetPropertiesAsync();
    int cachedMessagesCount = properties.ApproximateMessagesCount; // >= of actual messages count
    Console.WriteLine($"Number of messages in queue: {cachedMessagesCount}");

    // Delete the queue
    await queueClient.DeleteAsync();
}
```

```sh
az storage account create --name mystorageaccount --resource-group $resourceGroup --location eastus --sku Standard_LRS
az storage queue create --name myqueue --account-name mystorageaccount
az storage queue list --account-name mystorageaccount --output table
az storage message put --queue-name myqueue --account-name mystorageaccount --content "Hello, World!"
az storage message peek --queue-name myqueue --account-name mystorageaccount
az storage message get --queue-name myqueue --account-name mystorageaccount
az storage message delete --queue-name myqueue --account-name mystorageaccount --message-id <message-id> --pop-receipt <pop-receipt>
az storage queue delete --name myqueue --account-name mystorageaccount
```
