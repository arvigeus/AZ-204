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

Question: You are building a web application that uses Azure App Configuration to manage feature rollouts. You want to introduce a new feature and gradually enable it for a subset of users based on specific conditions. Which components must you define in Azure App Configuration to support this feature flag behavior?

- [x] Name
- [ ] Keys and Values
- [x] List of Filters
- [ ] Labels

Answer:

- **Name** – Required to identify the feature flag.
- **List of Filters** – Used to define conditions for feature activation (e.g., % rollout, user targeting).

Incorrect options:

- Keys and Values – Used for general configuration, not feature flags.
- Labels – Optional; useful for versioning but not required for a flag.

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

Question: In Azure App Configuration, how can you explicitly reference a key-value that does not have a label?

- [ ] Use the label "unlabeled"
- [x] Use the label "\0"
- [ ] Use the label "%00"
- [ ] Use the label "null"
- [ ] Leave the label field blank

Answer: To explicitly reference a key-value without a label, use `\0` (URL encoded as `%00`). This acts as a placeholder to indicate that the key-value in question is unlabeled, allowing you to differentiate it from key-values that might have been assigned specific labels.

---

Question: You are setting up resources in Azure App Configuration and have the following entries:

- Key = `AppName:Region1:DbEndpoint`
- Key = `AppName:region1:dbendpoint`
- Key = `AppName:Service1:ApiEndpoint`
- Key = `AppName:Service1:ApiEndpoint` with Label = `\0`
- Key = `AppName:Service1:ApiEndpoint` with Label = `Test`

What is the total count of distinct keys that will be saved in Azure App Configuration?

- [ ] 2
- [ ] 3
- [ ] 4
- [x] 5

Answer:

- `AppName:Region1:DbEndpoint` and `AppName:region1:dbendpoint` are considered two unique keys because they differ in case.
- `AppName:Service1:ApiEndpoint` appears three times with different label variations:
  - No label (default label)
  - Label `\0` (acts as no label, but explicitly specified, and is also considered distinct)
  - Label `Test`

Since different labels create different versions of the same key, these are considered distinct entries.

Therefore, the total number of unique keys stored in Azure App Configuration is: **5**.

---

Question: A financial services company is deploying a compliance-sensitive application to Azure. The app is hosted in a virtual network (VNet) and retrieves its runtime settings from Azure App Configuration.
To meet internal security requirements, the company mandates that all configuration traffic must stay entirely within the Azure backbone network and avoid exposure to the public internet.
Which solution meets this requirement?

- [ ] Use a system-assigned managed identity
- [ ] Use a user-assigned managed identity
- [x] Configure a private endpoint for the App Configuration store
- [ ] Use a customer-managed key for encryption

Answer: Private endpoint assigns a VNet IP to the App Configuration store, ensuring all traffic flows over the Azure backbone via a private link—never crossing the public internet.

---

Question: You are configuring an Azure App Configuration standard tier to use a customer-managed key from Azure Key Vault. What are the essential actions you must perform to ensure secure key access and compliance? Choose all that apply.

- [x] Enable purge protection on the Azure Key Vault.
- [ ] Connect the Azure App Configuration to a virtual network.
- [x] Assign a managed identity to the Azure App Configuration instance.
- [x] Grant the managed identity appropriate permissions on the Azure Key Vault.
- [ ] Enable public network access for the Azure App Configuration.

Answer: Virtual network connection is not required for customer-managed key integration. The focus is on permissions and identity, not network settings.  
Public network access is unrelated to key integration and could pose security risks. Key integration relies on identity and access control, not public accessibility.

---

Question: Which Azure CLI command option would correctly configure key access permissions for a managed identity in your Key Vault?

- [x] `az keyvault set-policy --vault-name 'MyVault' --object-id 'userObjectId' --key-permissions get wrapKey unwrapKey`
- [ ] `az keyvault policy-update --vault 'MyVault' --object-id 'userObjectId' --permissions keys read write`
- [ ] `az keyvault set-policy --name 'MyVault' --identity-id 'userObjectId' --key-access get list`
- [ ] `az keyvault update-policy --vault 'MyVault' --object-id 'userObjectId' --permissions keys get list`

Answer: This command correctly sets the necessary permissions: `GET`, `WRAP`, and `UNWRAP`.

---
