# [Azure Key Vault](https://docs.microsoft.com/en-us/azure/key-vault/)

- Azure Key Vault is a service for securely storing and accessing secrets, keys, and certificates.
- It offers two tiers: Standard (software key encryption) and Premium (hardware security module-protected keys - HSM).
- It centralizes application secrets, reducing the risk of accidental leaks and removing the need to store security information in application code.
- Access to a key vault requires authentication (via Azure Active Directory) and authorization (via Azure RBAC or Key Vault access policy).
- It provides monitoring capabilities, allowing you to track access to your keys and secrets.
- It simplifies administration by scaling to meet demand, ensuring high availability through data replication, and automating tasks on certificates.
- It can integrate with other Azure services for various scenarios, such as disk encryption and database encryption.

Key Vault is managed through Azure Resource Manager. Azure role-based access control (RBAC) controls access to the management layer. The predefined Key Vault Contributor role can grant management access to Key Vault.

`az keyvault create --name <YourKeyVaultName> --resource-group <YourResourceGroupName> --location <YourLocation>`

```cs
KeyVaultSecret secret = await client.GetSecretAsync("<YourSecretName>");
string secretValue = secret.Value;
```

## Security

### Authentication

For applications, there are two ways to obtain a service principal:

- Enable a system-assigned **managed identity** (recommended) for the application. With managed identity, Azure internally manages the application's service principal and automatically authenticates the application with other Azure services. Managed identity is available for applications deployed to various services.
- If you can't use managed identity, you instead register the application with your Azure AD tenant. Registration also creates a second application object that identifies the app across all tenants.

`var client = new SecretClient(new Uri("<YourVaultUri>"), new DefaultAzureCredential());`

#### Authentication to Key Vault with REST

```http
PUT https://<your-key-vault-name>.vault.azure.net/keys/<your-key-name>?api-version=7.2 HTTP/1.1
Authorization: Bearer <access_token> # token obtained from Azure Active Directory
```

### Data Transit Encryption

Azure Key Vault uses Transport Layer Security (TLS) for data transit protection. Perfect Forward Secrecy (PFS - protects connections between customer and cloud services by unique keys) and RSA-based 2,048-bit encryption key lengths secure connections.

## Best Practices

- Use a separate vault for each application and environment.
- Restrict vault access to authorized applications and users. (`az keyvault set-policy --name <YourKeyVaultName> --object-id <PrincipalObjectId> --secret-permissions get list`)
- Regularly backup your vault. (`az keyvault key backup --vault-name <YourKeyVaultName> --name <KeyName> --file <BackupFileName>`)
- Enable logging and alerts.
- Activate soft-delete and purge protection to prevent force deletion of secrets (retention: 90 days; If the object is an HSM-key, a charge applies per key version per month within the last 30 days of usage. Once the object is in a deleted state, no operations can be performed, and no charges will apply).

  ```ps
  az keyvault update --name <YourKeyVaultName> --enable-soft-delete true
  az keyvault update --name <YourKeyVaultName> --enable-purge-protection true
  ```

## Disk Encryption ([Windows](https://learn.microsoft.com/en-us/azure/virtual-machines/windows/disk-encryption-key-vault?tabs=azure-portal), [Linux](https://learn.microsoft.com/en-us/azure/virtual-machines/linux/disk-encryption-key-vault?tabs=azure-portal))

```ps
az login

# A resource group is a logical container into which Azure resources are deployed and managed.
az group create --name "myResourceGroup" --location eastus

# Create a key vault in the same region and tenant as the VMs to be encrypted.
# The key vault will be used to control and manage disk encryption keys and secrets.
az keyvault create --name "<keyvault-id>" --resource-group "myResourceGroup" --location "eastus" --enabled-for-disk-encryption

# Update the key vault's advanced access policies
az keyvault update --name "<keyvault-id>" --resource-group "MyResourceGroup" --enabled-for-disk-encryption "true"
# Enables the Microsoft.Compute resource provider to retrieve secrets from this key vault when this key vault is referenced in resource creation, for example when creating a virtual machine.
az keyvault update --name "<keyvault-id>" --resource-group "MyResourceGroup" --enabled-for-deployment "true"
# Allow Resource Manager to retrieve secrets from the vault.
az keyvault update --name "<keyvault-id>" --resource-group "MyResourceGroup" --enabled-for-template-deployment "true"

# This step is optional. When a key encryption key (KEK) is specified, Azure Disk Encryption uses that key to wrap the encryption secrets before writing to Key Vault.
az keyvault key create --name "myKEK" --vault-name "<keyvault-id>" --kty RSA --size 4096

# Enable disk encryption

# Linux
az vm encryption enable -g "MyResourceGroup" --name "myVM" --disk-encryption-keyvault "<keyvault-id>" --key-encryption-key "myKEK"

# Windows
# Obtain <kek-url>
az keyvault key show --vault-name "<keyvault-id>" --name "myKEK" --query "key.kid"
az vm encryption enable -g "MyResourceGroup" --name "MyVM" --disk-encryption-keyvault "<keyvault-id>" --key-encryption-key-url <kek-url> --volume-type All
```
