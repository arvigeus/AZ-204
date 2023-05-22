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

Questions: Which of the following options is true about the built-in authentication feature in Azure Container Apps?

- [ ] It can only be configured to restrict access to authenticated users.
- [x] It allows for out-of-the-box authentication with federated identity providers.
- [ ] It requires the use of a specific language or SDK.

Answer: Azure Container Apps provides built-in authentication and authorization features to secure your external ingress-enabled container app with minimal or no code.  
The built-in authentication feature can be configured to handle authenticated and non-authenticated users.

Question: What is a revision in Azure Container Apps?

- [ ] A dynamic snapshot of a container app version.
- [ ] A version of a container app that is actively being used.
- [x] An immutable snapshot of a container app version.

Answer: A revision is an immutable snapshot of a container app version.  
The security container running the authentication and authorization module doesn't run in-process, so no direct integration with a specific language is possible.
