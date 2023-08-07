# Azure Key Vault

Question: Which of the below methods of authenticating to Azure Key Vault is recommended for most scenarios?

- [ ] Service principal and certificate
- [ ] Service principal and secret
- [x] Managed identities

Answer: The benefit of this approach is that Azure automatically rotates the identity.  
Service principal and secret is not recommended because the application owner or developer must rotate the certificate.  
Service principal and certificate is not recommended because it is difficult to automatically rotate the bootstrap secret that's used to authenticate to Key Vault.

---

Question: Azure Key Vault protects data when it's traveling between Azure Key Vault and clients. What protocol does it use for encryption?

- [ ] Secure Sockets Layer
- [x] Transport Layer Security
- [ ] Presentation Layer

Answer: Azure Key Vault enforces Transport Layer Security protocol to protect data when it’s traveling between Azure Key Vault and clients.  
The Secure Sockets Layer protocol has been replaced with the Transport Layer Security protocol.  
Presentation Layer is part of the Open Systems Interconnection model and is not a security protocol.

---

Question You're designing a cloud-based microservice architecture using Azure Functions. One of the functions requires access to sensitive configuration data stored in Azure Key Vault. To maintain a high level of security, you want to ensure that only the Azure Function has the ability to retrieve secrets from the Key Vault. How should you configure access to the sensitive information in the Key Vault?

- [ ] Create an Azure Active Directory (Azure AD) application, assign it 'get' and 'list' permissions for the Key Vault, and embed the application's client ID and client secret in function's environment variables.
- [ ] Generate a User-assigned Managed Identity, assign it 'get' and 'list' permissions for the Key Vault, and embed the identity's client ID and client secret in function's environment variables.
- [x] Enable a System-assigned Managed Identity for the function and assign it 'get' and 'list' permissions for the Key Vault.
- [ ] Generate an access token to the Key Vault, and store the Key Vault's URI and the access token in the function's environment variables.
- [ ] Store the Key Vault's URI in the function's environment variables and use a shared access signature (SAS) token to authenticate.
- [ ] Create a service principal, assign it 'get' and 'list' permissions for the Key Vault, and store the service principal's credentials in the function's environment variables.
- [ ] Enable Azure AD authentication for the function and assign the function's user identity 'get' and 'list' permissions for the Key Vault.
- [ ] Use Azure AD B2C to create a user identity, assign it 'get' and 'list' permissions for the Key Vault, and store the user identity's credentials in the function's environment variables.

Answer: Enable a System-assigned Managed Identity for 'mySensitiveFunction' and assign it 'get' and 'list' permissions for the Key Vault.

System-assigned Managed Identities are automatically managed by Azure and provide an identity for your Azure resource. This ensures that only the Azure resource can access the secrets in the Key Vault, without any risk of credential exposure. The other options involve storing sensitive information in environment variables, which can potentially be accessed by unauthorized users, thus they are not secure.

---

Question: You have downloaded an Azure Functions codebase that is set to be triggered by an HTTP request. This function needs to access a database, and for that, it requires a connection string. You need to ensure the connection string is not stored in plain text within the code or configuration files. You are preparing to create the necessary components to achieve your goal. Which of the following should you create to achieve your goal? Answer by selecting the correct options from the list below.

- [x] Azure Key Vault
- [x] Access Policy
- [ ] Azure Active Directory Identity Protections
- [ ] Azure Storage Account
- [ ] Azure Policy

Answer: **Azure Key Vault**: Provides secure storage for secrets like connection strings. **Access Policy**: Determines access to secrets in Azure Key Vault.  
Azure Active Directory Identity Protections: Focuses on risk-based conditional access, not secret storage.  
Azure Storage Account: Used for data storage, not secret storage.  
Azure Policy: Evaluates resource properties against business rules, not for secret storage.

---

Question: Your organization is migrating sensitive data to Azure and has decided to use Azure Key Vault for secure storage. To enhance data protection, the IT team wants to ensure that if any key vault or its associated objects are unintentionally deleted, they can be recovered. Moreover, they want to ensure that once an item is marked as deleted, it cannot be permanently removed until a specified retention period elapses. Which Azure CLI commands should the IT team execute to implement these protective measures?

- [x] `az keyvault update --name <YourKeyVaultName> --enable-soft-delete true`
- [x] `az keyvault update --name <YourKeyVaultName> --enable-purge-protection true`
- [ ] `az keyvault create --name <YourKeyVaultName> --retention-days 90`
- [ ] `az keyvault set-policy --name <YourKeyVaultName> --object-id <ObjectId> --key-permissions purge`
- [ ] `az keyvault backup --name <YourKeyVaultName> --file <BackupFileName>`
- [ ] `az keyvault delete --name <YourKeyVaultName> --force-immediate`

Answer: You need to enablesoft delete (`--enable-soft-delete true`) and purge protection (`--enable-purge-protection true`)  
`az keyvault create --name <YourKeyVaultName> --retention-days 90` is not a valid command  
`az keyvault set-policy --name <YourKeyVaultName> --object-id <ObjectId> --key-permissions purge` grants a user the permission to purge objects from the Key Vault. However, it doesn't prevent purging during the retention period.  
`az keyvault delete --name <YourKeyVaultName> --force-immediate` is not a valid command
