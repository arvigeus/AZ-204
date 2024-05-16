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

Question: You're designing a cloud-based microservice architecture using Azure Functions. One of the functions requires access to sensitive configuration data stored in Azure Key Vault. To maintain a high level of security, you want to ensure that only the Azure Function has the ability to retrieve secrets from the Key Vault. How should you configure access to the sensitive information in the Key Vault?

- [ ] Create an Microsoft Entra ID application, assign it 'get' and 'list' permissions for the Key Vault, and embed the application's client ID and client secret in function's environment variables.
- [ ] Generate a User-assigned Managed Identity, assign it 'get' and 'list' permissions for the Key Vault, and embed the identity's client ID and client secret in function's environment variables.
- [x] Enable a System-assigned Managed Identity for the function and assign it 'get' and 'list' permissions for the Key Vault.
- [ ] Generate an access token to the Key Vault, and store the Key Vault's URI and the access token in the function's environment variables.
- [ ] Store the Key Vault's URI in the function's environment variables and use a shared access signature (SAS) token to authenticate.
- [ ] Create a service principal, assign it 'get' and 'list' permissions for the Key Vault, and store the service principal's credentials in the function's environment variables.
- [ ] Enable Entra ID authentication for the function and assign the function's user identity 'get' and 'list' permissions for the Key Vault.
- [ ] Use Entra ID B2C to create a user identity, assign it 'get' and 'list' permissions for the Key Vault, and store the user identity's credentials in the function's environment variables.

Answer: Enable a System-assigned Managed Identity for 'mySensitiveFunction' and assign it 'get' and 'list' permissions for the Key Vault.

System-assigned Managed Identities are automatically managed by Azure and provide an identity for your Azure resource. This ensures that only the Azure resource can access the secrets in the Key Vault, without any risk of credential exposure. The other options involve storing sensitive information in environment variables, which can potentially be accessed by unauthorized users, thus they are not secure.

---

Question: You have downloaded an Azure Functions codebase that is set to be triggered by an HTTP request. This function needs to access a database, and for that, it requires a connection string. You need to ensure the connection string is not stored in plain text within the code or configuration files. You are preparing to create the necessary components to achieve your goal. Which of the following should you create to achieve your goal? Answer by selecting the correct options from the list below.

- [x] Azure Key Vault
- [x] Access Policy
- [ ] Microsoft Entra ID Identity Protections
- [ ] Azure Storage Account
- [ ] Azure Policy

Answer: **Azure Key Vault**: Provides secure storage for secrets like connection strings. **Access Policy**: Determines access to secrets in Azure Key Vault.  
Microsoft Entra ID Identity Protections: Focuses on risk-based conditional access, not secret storage.  
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

---

Question: Your organization is developing a secure application that involves handling confidential data. You have been tasked with the following requirements:

1. Establish a connection to a remote vault service to manage sensitive keys and secrets.
1. Retrieve a designated secret from the vault.
1. Obtain a specific cryptographic key from the vault.
1. Use the obtained key to perform the following cryptographic operations:
   - Add the secret value to a given plaintext message, then encrypt it using an asymmetric encryption algorithm.
   - Decrypt the resulting ciphertext using the same algorithm.

Provide the code to fulfill these requirements, adhering to industry standards for secure communication and cryptographic practices.

```cs
var vaultUrl = "https://<your-key-vault-name>.vault.azure.net/";
var credential = new DefaultAzureCredential();
var secretKeyName = "<YourSecretName>";
var plaintext = "<To be encrypted>";
var encryptionAlgorithm = EncryptionAlgorithm.RsaOaep;

// Code here
```

Answer:

```cs
var vaultUrl = "https://<your-key-vault-name>.vault.azure.net/";
var credential = new DefaultAzureCredential();
var secretKeyName = "<YourSecretName>";
var plaintext = "<To be encrypted>";
var encryptionAlgorithm = EncryptionAlgorithm.RsaOaep;

var client = new KeyClient(vaultUri: new Uri(vaultUrl), credential: credential);
KeyVaultSecret secret = await client.GetSecretAsync(secretKeyName;
string secretValue = secret.Value;

var keyResponse = await client.GetKeyAsync(secretKeyName);
KeyVaultKey key = keyResponse.Value;
CryptographyClient cryptoClient = client.GetCryptographyClient(key.Name, key.Properties.Version);
EncryptResult encryptResult = cryptoClient.Encrypt(encryptionAlgorithm, Encoding.UTF8.GetBytes(plaintext + secretValue));
DecryptResult decryptResult = cryptoClient.Decrypt(encryptionAlgorithm, encryptResult.Ciphertext);
```

---

Question: You are an Azure administrator responsible for managing a Key Vault named 'SecureVault'. A new application needs to securely store, retrieve, and manage cryptographic keys within 'SecureVault'. The application must be able to encrypt keys before storing them, decrypt keys when retrieving them, and also have the ability to retrieve key information. You need to configure the appropriate permissions for the application's managed identity using the az keyvault set-policy command. Which permissions should you grant to the application's managed identity in the Key Vault's access policy?

- [x] WRAP
- [x] UNWRAP
- [x] GET
- [ ] LIST
- [ ] UPDATE
- [ ] RECOVER
- [ ] RESTORE
- [ ] SIGN
- [ ] VERIFY

Answer: `az keyvault set-policy --name 'SecureVault' --object-id 'applicationObjectId' --key-permissions wrapKey unwrapKey get`

---

Question: Your company is preparing to deploy an application on an Azure Linux virtual machine (VM) named myLinuxVM, and there is a requirement to configure Azure Disk Encryption. You have created a resource group named myResourceGroup in the East US region.

To achieve the desired configuration, you need to use a key encryption key (KEK) to protect the encryption secret and enable the Key Vault for both disk encryption and template deployments.

```ps
# Code here
```

Answer:

```ps
az keyvault create --name "<keyvault-id>" --resource-group "myResourceGroup" --location "eastus"
az keyvault update --name "<keyvault-id>" --resource-group "MyResourceGroup" --enabled-for-disk-encryption "true"
az keyvault update --name "<keyvault-id>" --resource-group "MyResourceGroup" --enabled-for-template-deployment "true"
az keyvault key create --name "myKEK" --vault-name "<keyvault-id>" --kty RSA --size 4096
az vm encryption enable -g "MyResourceGroup" --name "myLinuxVM" --disk-encryption-keyvault "<keyvault-id>" --key-encryption-key "myKEK"
```

---

Question: How to create an access policy for your key vault that grants certificate permissions to your user account?

```ps
az keyvault
```

Answer:

```ps
az keyvault set-policy --name <your-key-vault-name> --upn user@domain.com --certificate-permissions delete get list create purge
```

---

Question: What format the response of this command is: `az keyvault secret show --name "ExamplePassword" --vault-name $myKeyVault`?

- [x] JSON
- [ ] XML
- [ ] YAML
- [ ] Plain text

Answer: JSON.

---

Question: You have configured an Azure Key Vault and stored a secret in it. The secret has multiple versions. You need to retrieve a particular version of the secret using a REST API call. What should you include in the REST API call to specify the version you want to retrieve?

- [ ] A session variable
- [x] A query string parameter
- [ ] A JSON payload
- [ ] A POST parameter

Answer: To retrieve a specific version of the secret, you would include it as a query string argument in the REST API call: `GET {vaultBaseUrl}/secrets/{secret-name}/{secret-version}?api-version=7.4`. This allows you to specify which version of the secret you wish to retrieve from the Azure Key Vault.

---

Question: Write the Azure CLI commands to perform the following tasks:

1. Create a Key Vault in Azure.
1. Add a certificate to the newly created Key Vault using the default policy.

```ps
kvName="<your-unique-keyvault-name>"
rgName="myResourceGroup"
locationName="EastUS"
certName="ExampleCertificate"

# Code here
```

Answer:

```bash
kvName="<your-unique-keyvault-name>"
rgName="myResourceGroup"
locationName="EastUS"
certName="ExampleCertificate"

# Create a key vault
az keyvault create --name $kvName --resource-group $rgName --location $locationName

# Add a certificate to Key Vault
az keyvault certificate create --vault-name $kvName -n $certName -p "$(az keyvault certificate get-default-policy)"
```

---
