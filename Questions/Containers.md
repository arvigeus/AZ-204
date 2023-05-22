# Containers

Question: Which of the following Azure Container Registry options support geo-replication to manage a single registry across multiple regions?

- [ ] Basic
- [ ] Standard
- [x] Premium

Answer: The premium tier adds geo-replication as a feature.

Question: Which Azure container registry tiers benefit from encryption-at-rest?

- [x] Basic
- [x] Standard
- [x] Premium

Answer: Encryption-at-rest is supported in all three tiers.

Question: Which of the following methods is recommended when deploying a multi-container group that includes only containers?

- [ ] Azure Resource Management template
- [x] YAML file
- [ ] `az container creates` command

Answer: Due to the YAML format's more concise nature, a YAML file is recommended when your deployment includes only container instances.  
`az container creates` isn't specific to this scenario.
