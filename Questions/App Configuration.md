# Azure App Configuration

Question: Which type of encryption does Azure App Configuration use to encrypt data at rest?

- [ ] 64-bit AES
- [ ] 128-bit AES
- [x] 256-bit AES

Answer: Azure App Configuration encrypts sensitive information at rest using a 256-bit AES encryption key provided by Microsoft.

---

Question: Which of the following options evaluates the state of a feature flag?

- [ ] Feature flag
- [ ] Feature manager
- [x] Filter

Answer: A filter is a rule for evaluating the state of a feature flag. A user group, a device or browser type, a geographic location, and a time window are all examples of what a filter can represent.  
A feature manager is an application package that handles the lifecycle of all the feature flags in an application.  
A feature flag is a variable with a binary state of on or off.

---

Question: What is the primary difference between Azure App Configuration and Azure Key Vault in terms of encryption?

- [ ] App Configuration does not support encryption at rest.
- [ ] App Configuration does not support encryption at transit.
- [x] App Configuration does not support hardware-level encryption.

Answer: Azure Key Vault offers hardware-level encryption (available in Premium tier), while Azure App Configuration does not.

---

Question: Which of the following features is NOT provided by Azure App Configuration?

- [ ] Real-time control of feature availability.
- [ ] Dynamic application settings adjustments without redeployment or restart.
- [x] Granular access policies.
- [ ] Hierarchical configuration data management.
- [ ] Capability to import and export configuration information between Azure App Configuration and separate files.

Answer: Azure App Configuration does not offer granular access policies, unlike Key Vault.

---
