# [Azure Key Vault](https://docs.microsoft.com/en-us/azure/key-vault/)

Endpoint: `https://vault.azure.net`

- Azure Key Vault securely stores secrets, keys, and certificates.
- Available in two tiers: **Standard** for software encryption, **Premium** for HSM-protected keys.
- Centralizes security data to minimize leaks and avoid storing sensitive info in code.
- Offers monitoring to track key and secret access.
- Scales automatically and ensures high availability through data replication.
- Automates certificate tasks.
- Integrates with other Azure services for disk and database encryption.

`az keyvault create --name <YourKeyVaultName> --resource-group $resourceGroup --location <YourLocation>`

Set secret: `az keyvault secret set --vault-name $myKeyVault --name "ExamplePassword" --value "hVFkk965BuUv"`

Retrieve secret (in _JSON_ format): `az keyvault secret show --name "ExamplePassword" --vault-name $myKeyVault` (`value` property contains the secret value)

Get secret version: `GET {vaultBaseUrl}/secrets/{secret-name}/{secret-version}?api-version=7.4`

## [Security](https://learn.microsoft.com/en-us/azure/key-vault/general/security-features)

## Key operations

Rotating secrets:

- `az keyvault key rotate`: manual rotation.
- `az keyvault key rotation-policy`: automated rotation (ex: time).

Removing keys:

- `az keyvault key delete`: put key in soft delete state (if enabled, or simply removes it)
- `az keyvault key purge`: permanently removes soft deleted key (**only**)

### Access Model

- **Management plane**: for managing the Key Vault itself
- **Data plane**: for working with the data stored in the Key Vault

Both planes use Azure Microsoft Entra ID for authentication, and [RBAC](https://learn.microsoft.com/en-us/azure/key-vault/general/rbac-guide?tabs=azure-cli) for authorization (access control). _Data plane_ also uses a [access policies](https://learn.microsoft.com/en-us/azure/key-vault/general/assign-access-policy?tabs=azure-portal) (legacy) for authorization. Minimum standard role for granting management and data (policies) access: `Contributor`.

```sh
az keyvault set-policy --name myKeyVault --object-id <object-id> --secret-permissions <secret-permissions> --key-permissions <key-permissions> --certificate-permissions <certificate-permissions>
```

### Authentication

Key Vault is associated with the Entra ID tenant of the subscription and all callers must register in this tenant and authenticate to access the key vault.

For applications, there are two ways to obtain a service principal:

- Enable a system-assigned **managed identity** (recommended) for the application. With managed identity, Azure internally manages the application's service principal and automatically authenticates the application with other Azure services. Managed identity is available for applications deployed to various services.
- If you can't use managed identity, you instead register the application with your Entra ID tenant. Registration also creates a second application object that identifies the app across all tenants.

`var client = new SecretClient(new Uri("<YourVaultUri>"), new DefaultAzureCredential());`

Authentication using REST:

```http
PUT https://<your-key-vault-name>.vault.azure.net/keys/<your-key-name>?api-version=7.2 HTTP/1.1
Authorization: Bearer <access_token> # token obtained from Microsoft Entra ID
```

If Authorization token is missing or rejected:

```http
401 Not Authorized
WWW-Authenticate: Bearer authorization="…", resource="…"
```

The `WWW-Authenticate` header parameters are:

- `authorization`: OAuth2 authorization service address.
- `resource`: Resource name (`https://vault.azure.net`) for the authorization request.

### Restricting access

For secure, single-resource access to Azure Key Vault secrets, use System Managed Identities to avoid hardcoding credentials. Using managed identities or environment variables can expose them in your code.

Limit vault access to specific IPs via **virtual network service endpoints**.

### Data Transit Encryption

Secure communication through **HTTPS** and **TLS** (min 1.2).

**Perfect Forward Secrecy** (PFS - protects connections between customer and cloud services by unique keys) and RSA-based 2,048-bit encryption key lengths secure connections.

## [Certificates](https://learn.microsoft.com/en-us/azure/key-vault/certificates/quick-create-net)

Create an access policy for your key vault that grants certificate permissions to your user account:

```sh
az keyvault set-policy --name <your-key-vault-name> --upn user@domain.com --certificate-permissions delete get list create purge
```

Store and retieve certificates:

```cs
var client = new CertificateClient(new Uri($"https://{keyVaultName}.vault.azure.net"), new DefaultAzureCredential());

// Create certificate
var operation = await client.StartCreateCertificateAsync(certificateName, CertificatePolicy.Default);
await operation.WaitForCompletionAsync();

// Retrieve
var certificate = await client.GetCertificateAsync(certificateName);
```

## Best Practices

- Use a separate vault for each application and environment (production, test, staging).
- Restrict vault access to authorized applications and users. (`az keyvault set-policy --name <YourKeyVaultName> --object-id <PrincipalObjectId> --secret-permissions get list`)
- Regularly backup your vault. (`az keyvault key backup --vault-name <YourKeyVaultName> --name <KeyName> --file <BackupFileName>`)
- Enable logging and alerts.
- Enable **soft-delete** and **purge protection** to keep secrets for 7-90 days and prevent forced deletion. Charges apply for HSM-keys in the last 30 days of use. Operations are disabled on deleted objects, and no charges apply. (NOTE: _soft-delete_ increased security, but also _increases storage cost_!)

  ```sh
  az keyvault update --name <YourKeyVaultName> --enable-soft-delete true
  az keyvault update --name <YourKeyVaultName> --enable-purge-protection true
  ```

## [Disaster and recovery](https://learn.microsoft.com/en-us/azure/key-vault/general/disaster-recovery-guidance)

Redundancy: Data is usually replicated within the primary region and to a secondary region (except for some countries where data regulation require to keep it in the seame region with ZRS). For AKV Premium, data from HSMs is replicated to only two regions. If a primary Azure region becomes unavailable, requests are automatically rerouted to a secondary region. Note that some regions don't support failover and the key vault becomes read-only during this time. Users in these regions should prepare for recovery plans.

## Disk Encryption ([Windows](https://learn.microsoft.com/en-us/azure/virtual-machines/windows/disk-encryption-key-vault?tabs=azure-portal), [Linux](https://learn.microsoft.com/en-us/azure/virtual-machines/linux/disk-encryption-key-vault?tabs=azure-portal))

```sh
az login

# A resource group is a logical container into which Azure resources are deployed and managed.
az group create --name $resourceGroup --location eastus

# Create a key vault in the same region and tenant as the VMs to be encrypted.
# The key vault will be used to control and manage disk encryption keys and secrets.
az keyvault create --name "<keyvault-id>" --resource-group $resourceGroup --location "eastus"

# Update the key vault's advanced access policies
az keyvault update --name "<keyvault-id>" --resource-group $resourceGroup --enabled-for-disk-encryption "true"
# Enables the Microsoft.Compute resource provider to retrieve secrets from this key vault when this key vault is referenced in resource creation, for example when creating a virtual machine.
az keyvault update --name "<keyvault-id>" --resource-group $resourceGroup --enabled-for-deployment "true"
# Allow Resource Manager to retrieve secrets from the vault.
az keyvault update --name "<keyvault-id>" --resource-group $resourceGroup --enabled-for-template-deployment "true"

# This step is optional. When a key encryption key (KEK) is specified, Azure Disk Encryption uses that key to wrap the encryption secrets before writing to Key Vault.
az keyvault key create --name "myKEK" --vault-name "<keyvault-id>" --kty RSA --size 4096

# Enable disk encryption:
## Optionally use KEK by name
az vm encryption enable -g $resourceGroup --name "myVM" --disk-encryption-keyvault "<keyvault-id>" --key-encryption-key "myKEK"
## Optionally use KEK by url
## Obtain <kek-url>
## az keyvault key show --vault-name "<keyvault-id>" --name "myKEK" --query "key.kid"
## az vm encryption enable -g $resourceGroup --name "MyVM" --disk-encryption-keyvault "<keyvault-id>" --key-encryption-key-url <kek-url> --volume-type All
```

## [Logging](https://learn.microsoft.com/en-us/azure/key-vault/key-vault-insights-overview)

### [Monitoring Key Vault with Azure Event Grid](https://learn.microsoft.com/en-us/azure/key-vault/general/event-grid-overview)

`Portal > All Services > Key Vaults > key vault > Events > Event Grid Subscriptions > + Event Subscription` and fill in the details including name, event types, and endpoint (like an Azure Function).

```cs
[FunctionName("KeyVaultMonitoring")]
public static async Task<IActionResult> Run(
    [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req, ILogger log)
{
    var requestBody = await new StreamReader(req.Body).ReadToEndAsync();
    var eventGridEvent = EventGridEvent.Parse(new BinaryData(requestBody));

    switch(eventGridEvent.EventType)
    {
        case SystemEventNames.KeyVaultCertificateNewVersionCreated:
        case SystemEventNames.KeyVaultSecretNewVersionCreated:
            log.LogInformation($"New Key Vault secret/certificate version created event. Data: {eventGridEvent.Data}"); break;
        case SystemEventNames.KeyVaultKeyNewVersionCreated:
            log.LogInformation($"New Key Vault key version created event. Data: {eventGridEvent.Data}"); break;
        default:
            log.LogInformation($"Event Grid Event of type {eventGridEvent.EventType} occurred, but it's not processed."); break;
    }

    return new OkResult();
}
```

## Working with KeyVault

```cs
// Fetching a secret
var secretClient = new SecretClient(vaultUri: new Uri(vaultUrl), credential: new DefaultAzureCredential());
KeyVaultSecret secret = await secretClient.GetSecretAsync("YourSecretName");

var keyClient = new KeyClient(vaultUri: new Uri(vaultUrl), credential: new DefaultAzureCredential());
// Creating a new key
KeyVaultKey key = await keyClient.GetKeyAsync("YourKeyName");
// Encrypting and decrypting data using the key via CryptographyClient
CryptographyClient cryptoClient = keyClient.GetCryptographyClient(key.Name, key.Properties.Version);
EncryptResult encryptResult = cryptoClient.Encrypt(EncryptionAlgorithm.RsaOaep, Encoding.UTF8.GetBytes(plaintext));
DecryptResult decryptResult = cryptoClient.Decrypt(EncryptionAlgorithm.RsaOaep, encryptResult.Ciphertext);
```

## CLI

- [az keyvault set-policy](https://learn.microsoft.com/en-us/cli/azure/keyvault?view=azure-cli-latest#az-keyvault-set-policy)
- [az keyvault secret](https://learn.microsoft.com/en-us/cli/azure/keyvault/secret?view=azure-cli-latest)
- [az keyvault key](https://learn.microsoft.com/en-us/cli/azure/keyvault/key?view=azure-cli-latest)
