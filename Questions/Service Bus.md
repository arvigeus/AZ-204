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
