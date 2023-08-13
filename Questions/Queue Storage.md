# Queue Storage

Question: Specify the correct parameter for `QueueClient.SendAsync()` if `text` is of type `string`.

- [ ] No parameter
- [x] `new Message(Encoding.UTF8.GetBytes(text))`
- [ ] `new Message(text)`
- [ ] `Encoding.UTF8.GetBytes(text)`
- [ ] `text`

Answer: `Message` supports `byte[]` only.

---
