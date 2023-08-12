# [Azure Queue Storage](https://docs.microsoft.com/en-us/azure/storage/queues/)

Endpoint: `https://queue.core.windows.net`

- May contain millions of messages, up to the total capacity limit of a storage account.
- Commonly used to create a backlog of work to process asynchronously.
- TTL: 7 days (default), -1 to never expire.

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
queueClient.CreateIfNotExists();

if (queueClient.Exists())
{
    // Insert a message into a queue
    // A message can be either a string (in UTF-8 format)
    queueClient.SendMessage(message);

    // Peek at the next message
    // If you don't pass a value for the `maxMessages` parameter, the default is to peek at one message.
    PeekedMessage[] peekedMessage = queueClient.PeekMessages();

    // Change the contents of a message in-place
    // This code saves the work state and grants the client an extra minute to continue their message (default is 30 sec).
    QueueMessage[] message = queueClient.ReceiveMessages();
    // PopReceipt must be provided when performing operations to the message
    // in order to prove that the client has the right to do so when locked
    queueClient.UpdateMessage(message[0].MessageId,
            message[0].PopReceipt,
            "Updated contents",
            TimeSpan.FromSeconds(60.0)  // Make it invisible for another 60 seconds
        );

    // Dequeue the next message
    QueueMessage[] retrievedMessage = queueClient.ReceiveMessages();
    Console.WriteLine($"Dequeued message: '{retrievedMessage[0].Body}'");
    queueClient.DeleteMessage(retrievedMessage[0].MessageId, retrievedMessage[0].PopReceipt);

    // Get the queue length
    QueueProperties properties = queueClient.GetProperties();
    int cachedMessagesCount = properties.ApproximateMessagesCount; // >= of actual messages count
    Console.WriteLine($"Number of messages in queue: {cachedMessagesCount}");

    // Delete the queue
    queueClient.Delete();
}
```

```ps
az storage account create --name mystorageaccount --resource-group myresourcegroup --location eastus --sku Standard_LRS
az storage queue create --name myqueue --account-name mystorageaccount
az storage queue list --account-name mystorageaccount --output table
az storage message put --queue-name myqueue --account-name mystorageaccount --content "Hello, World!"
az storage message peek --queue-name myqueue --account-name mystorageaccount
az storage message get --queue-name myqueue --account-name mystorageaccount
az storage message delete --queue-name myqueue --account-name mystorageaccount --message-id <message-id> --pop-receipt <pop-receipt>
az storage queue delete --name myqueue --account-name mystorageaccount
```
