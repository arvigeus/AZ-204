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
var client = new KeyClient(vaultUri: new Uri(vaultUrl), credential: new DefaultAzureCredential());
KeyVaultSecret secret = await client.GetSecretAsync("<YourSecretName>");
string secretValue = secret.Value;

// The CryptographyClient allows for cryptographic operations (encrypting and decrypting data, signing and verifying signatures, wrapping and unwrapping keys, etc.), using a key stored in Azure Key Vault.
CryptographyClient  cryptoClient = client.GetCryptographyClient(key.Name, key.Properties.Version);
EncryptResult encryptResult = cryptoClient.Encrypt(EncryptionAlgorithm.RsaOaep, Encoding.UTF8.GetBytes(plaintext));
DecryptResult decryptResult = cryptoClient.Decrypt(EncryptionAlgorithm.RsaOaep, encryptResult.Ciphertext);
```

## [Security](https://learn.microsoft.com/en-us/azure/key-vault/general/security-features)

**Network Security**: You can specify which IP addresses have access to your vaults, reducing exposure. This is done through virtual network service endpoints for Azure Key Vault.

**TLS and HTTPS**: Azure Key Vault uses the HTTPS protocol and TLS (min 1.2) for secure communication.

### Access Model

Access to a key vault is controlled through two interfaces: the management plane (for managing Key Vault itself) and the data plane (for working with the data stored in a key vault). Both planes use Azure Active Directory (Azure AD) for authentication. For authorization, the management plane uses Azure role-based access control (Azure RBAC) and the data plane uses a Key Vault access policy and Azure RBAC for Key Vault data plane operations.

### Authentication

Key Vault is associated with the Azure AD tenant of the subscription and all callers must register in this tenant and authenticate to access the key vault.

For applications, there are two ways to obtain a service principal:

- Enable a system-assigned **managed identity** (recommended) for the application. With managed identity, Azure internally manages the application's service principal and automatically authenticates the application with other Azure services. Managed identity is available for applications deployed to various services.
- If you can't use managed identity, you instead register the application with your Azure AD tenant. Registration also creates a second application object that identifies the app across all tenants.

`var client = new SecretClient(new Uri("<YourVaultUri>"), new DefaultAzureCredential());`

#### Authentication to Key Vault with REST

```http
PUT https://<your-key-vault-name>.vault.azure.net/keys/<your-key-name>?api-version=7.2 HTTP/1.1
Authorization: Bearer <access_token> # token obtained from Azure Active Directory
```

### Restricting access

For secure access to Azure Key Vault secrets, restricted to a single Azure resource only, use System Managed Identities. This removes the need to include any credentials in your code. Managed identities (for example Azure AD application) can be used from other resources, thus exposing the Key Vault. Even using environment variable makes them potentially exposed to anyone with an access.

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

## [Logging](https://learn.microsoft.com/en-us/azure/key-vault/key-vault-insights-overview)

```kusto
// Old TLS?
AzureDiagnostics
| where TimeGenerated > ago(90d)
| where ResourceProvider =="MICROSOFT.KEYVAULT"
| where isnotempty(tlsVersion_s) and strcmp(tlsVersion_s,"TLS1_2") <0
| project TimeGenerated,Resource, OperationName, requestUri_s, CallerIPAddress, OperationVersion,clientInfo_s,tlsVersion_s,todouble(tlsVersion_s)
| sort by TimeGenerated desc

// Slow requests?
AzureDiagnostics
| where ResourceProvider =="MICROSOFT.KEYVAULT"
| where DurationMs > 1000
| summarize count() by OperationName, _ResourceId

// How fast is this KeyVault serving requests?
AzureDiagnostics
| where ResourceProvider =="MICROSOFT.KEYVAULT"
| summarize avg(DurationMs) by requestUri_s, bin(TimeGenerated, 1h) // requestUri_s contains the URI of the request
| render timechart

// Failures?
AzureDiagnostics
| where ResourceProvider =="MICROSOFT.KEYVAULT"
| where httpStatusCode_d >= 300 and not(OperationName == "Authentication" and httpStatusCode_d == 401)
| summarize count() by requestUri_s, ResultSignature, _ResourceId
// ResultSignature contains HTTP status, e.g. "OK" or "Forbidden"
// httpStatusCode_d contains HTTP status code returned

// Shows errors caused due to malformed events that could not be deserialized by the job.
AzureDiagnostics
| where ResourceProvider == "MICROSOFT.KEYVAULT" and parse_json(properties_s).DataErrorType in ("InputDeserializerError.InvalidData", "InputDeserializerError.TypeConversionError", "InputDeserializerError.MissingColumns", "InputDeserializerError.InvalidHeader", "InputDeserializerError.InvalidCompressionType")
| project TimeGenerated, Resource, Region_s, OperationName, properties_s, Level, _ResourceId

// How active has this KeyVault been?
AzureDiagnostics
| where ResourceProvider =="MICROSOFT.KEYVAULT"
| summarize count() by bin(TimeGenerated, 1h), OperationName // Aggregate by hour
| render timechart

// Who is calling this KeyVault?
AzureDiagnostics
| where ResourceProvider =="MICROSOFT.KEYVAULT"
| summarize count() by CallerIPAddress
```

### [Monitoring Key Vault with Azure Event Grid](https://learn.microsoft.com/en-us/azure/key-vault/general/event-grid-overview)

`Portal > All Services > Key Vaults > key vault > Events > Event Grid Subscriptions > + Event Subscription` and fill in the details including name, event types, and endpoint (like an Azure Function).

```cs
[FunctionName("KeyVaultMonitoring")]
public static async Task<IActionResult> Run(
    [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req,
    ILogger log)
{
    var requestBody = await new StreamReader(req.Body).ReadToEndAsync();
    var eventGridEvent = EventGridEvent.Parse(new BinaryData(requestBody));

    switch(eventGridEvent.EventType)
    {
        case SystemEventNames.KeyVaultCertificateNewVersionCreated:
        case SystemEventNames.KeyVaultSecretNewVersionCreated:
            log.LogInformation($"New Key Vault secret/certificate version created event. Data: {eventGridEvent.Data}");
            break;
        case SystemEventNames.KeyVaultKeyNewVersionCreated:
            log.LogInformation($"New Key Vault key version created event. Data: {eventGridEvent.Data}");
            break;
        default:
            log.LogInformation($"Event Grid Event of type {eventGridEvent.EventType} occurred, but it's not processed.");
            break;
    }

    return new OkResult();
}
```
