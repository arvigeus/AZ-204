# Container Registry plans

Question: Which of the following Azure Container Registry options support geo-replication to manage a single registry across multiple regions?

- [ ] Basic
- [ ] Standard
- [x] Premium

Answer: The premium tier adds geo-replication as a feature.

---

Question: Which Azure container registry tiers benefit from encryption-at-rest?

- [x] Basic
- [x] Standard
- [x] Premium

Answer: Encryption-at-rest is supported in all three tiers.

---

Question: You exceed your Azure Container Registry plan limit, what happens?

- [x] HTTP 429 error (Too many requests)
- [ ] Have to upgrade tier to continue
- [ ] Services will run slower

Answer: You might experience [throttling](https://learn.microsoft.com/en-us/azure/container-registry/container-registry-skus#throttling)
