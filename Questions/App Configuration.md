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

Question: What is the purpose of labels in Azure App Configuration?

- [x] Labels are used to differentiate key-values with the same key in App Configuration.
- [ ] Labels are used to encrypt key-values in App Configuration.
- [ ] Labels are used to limit the size of key-values in App Configuration.

Answer: Labels in Azure App Configuration are used to create variants of a key and differentiate key-values with the same key.

---

What is the role of a feature manager in managing application features?

- [ ] A feature manager is a rule for evaluating the state of a feature flag.
- [ ] A feature manager is a variable with a binary state of on or off.
- [x] A feature manager is an application package that handles the lifecycle of all the feature flags in an application.

Answer: A feature manager provides extra functionality, such as caching feature flags and updating their states.  
A feature flag is a variable with a binary state of on or off.  
A filter is a rule for evaluating the state of a feature flag.

---

Question: What is the purpose of using customer-managed keys in Azure App Configuration?

- [ ] To enable authentication with Microsoft Entra ID
- [ ] To permanently store the unwrapped encryption key
- [x] To encrypt sensitive information at rest

Answer: Customer-managed keys are used to encrypt sensitive information in key-value pairs at rest.  
While a managed identity is used for authentication, it's not the primary purpose of customer-managed keys.  
The unwrapped encryption key is cached within App Configuration for one hour, not stored permanently.

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

Question: In Azure App Configuration, when loading configuration and using multiple `.Select()` calls, how does the order of these calls affect the values that are used if a key with the same name exists in both labels? Consider the following code snippet used to load configuration from Azure App Configuration:

```csharp
builder.Configuration.AddAzureAppConfiguration(options =>
{
    options.Connect(connectionString)
           // Select a subset of the configuration keys
           .Select("TestApp:*", LabelFilter.Null)
           .Select("TestApp:*", "dev");
});
```

- [ ] Only the last `.Select()` is considered. Values with keys starting with "TestApp:" and the label "dev" will be used; all values with no label will be discarded.
- [ ] Only the first `.Select()` is considered. Values with keys starting with "TestApp:" and the label "dev" will not be loaded.
- [ ] Both labeled and unlabeled values will be merged; if the same key exists in both, only the value from the first `.Select()` (no label) will be considered, and "dev" will not override them.
- [x] Both labeled and unlabeled values will be merged; if the same key exists in both, values from the last `Select()` ("dev" label) will override the existing (no label).
- An exception will be thrown

Answer: Merge and override previous values

---
