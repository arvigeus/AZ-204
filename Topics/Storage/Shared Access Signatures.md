# Shared Access Signatures (SAS)

A Shared Access Signature (SAS) is a URI that grants restricted access rights to Azure Storage resources. It's a signed URI that points to one or more storage resources and includes a token that contains a special set of query parameters.

## Types of SAS

1. [**User Delegation SAS**](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blob-user-delegation-sas-create-dotnet): This method uses Azure Active Directory (Azure AD) credentials to create a SAS. It's a secure way to grant limited access to your Azure Storage resources without sharing your account key. It's recommended when you want to provide fine-grained access control to clients who are authenticated with Azure AD.

1. [**Service SAS**](https://learn.microsoft.com/en-us/azure/storage/blobs/sas-service-create-dotnet): This method uses your storage account key to create a SAS. It's a straightforward way to grant limited access to your Azure Storage resources. However, it's less secure than the User Delegation SAS because it involves sharing your account key. It's typically used when you want to provide access to clients who are not authenticated with Azure AD.

## How SAS Works

A SAS requires two components: a URI to the resource you want to access and a SAS token that you've created to authorize access to that resource.

Example:

- **URI**: `https://medicalrecords.blob.core.windows.net/patient-images/patient-116139-nq8z7f.jpg?`
- **SAS token**: `sp=r&st=2020-01-20T11:42:32Z&se=2020-01-20T19:42:32Z&spr=https&sv=2019-02-02&sr=b&sig=SrW1HZ5Nb6MbRzTbXCaPm%2BJiSEn15tC91Y4umMPwVZs%3D`

[Reference](https://learn.microsoft.com/en-us/rest/api/storageservices/create-service-sas):

| Component | Description                                                                                                                                                                                                |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| sp        | Controls the access rights. Possible values include: (`a`)dd, (`c`)reate, (`d`)elete, (`l`)ist, (`r`)ead, (`w`)rite. For example, `sp=acdlrw` grants all the available rights.                             |
| st        | The date and time when access starts. For example, `st=2023-07-28T11:42:32Z` means the access starts at 11:42:32 UTC on July 28, 2023.                                                                     |
| se        | The date and time when access ends. For example, `se=2023-07-28T19:42:32Z` means the access ends at 19:42:32 UTC on July 28, 2023.                                                                         |
| sv        | The version of the storage API to use. For example, `sv=2020-02-10` means the storage API version 2020-02-10 is used.                                                                                      |
| sr        | The kind of storage being accessed. Possible values include: (`b`)lob, (`f`)ile, (`q`)ueue, (`t`)able, (`c`)ontainer, (`d`)irectory. For example, `sr=b` means a blob is being accessed.                   |
| sig       | The cryptographic signature. For example, `sig=SrW1HZ5Nb6MbRzTbXCaPm%2BJiSEn15tC91Y4umMPwVZs%3D` is a cryptographic signature.                                                                             |
| sip       | (Optional) Allowed IP addresses or IP range. For example, `sip=168.1.5.60-168.1.5.70` means only the IP addresses from 168.1.5.60 to 168.1.5.70 are allowed.                                               |
| spr       | (Optional) Allowed protocols. Possible values include: 'https', 'http,https'. For example, `spr=https` means only HTTPS is allowed.                                                                        |
| si        | (Optional) The name of the stored access policy. For example, `si=MyAccessPolicy` means the stored access policy named "MyAccessPolicy" is used.                                                           |
| rscc      | (Optional) The response header override for cache control. For example, `rscc=public` means the "Cache-Control" header is set to "public".                                                                 |
| rscd      | (Optional) The response header override for content disposition. For example, `rscd=attachment; filename=example.txt` means the "Content-Disposition" header is set to "attachment; filename=example.txt". |
| rsce      | (Optional) The response header override for content encoding. For example, `rsce=gzip` means the "Content-Encoding" header is set to "gzip".                                                               |
| rscl      | (Optional) The response header override for content language. For example, `rscl=en-US` means the "Content-Language" header is set to "en-US".                                                             |
| rsct      | (Optional) The response header override for content type. For example, `rsct=text/plain` means the "Content-Type" header is set to "text/plain".                                                           |

## Best Practices

- Always use HTTPS.
- Use user delegation SAS wherever possible.
- Set your expiration time to the smallest useful value.
- Only grant the access that's required.
- Create a middle-tier service to manage users and their access to storage when there's an unacceptable risk of using a SAS.

## Stored Access Policies

A stored access policy provides an extra level of control over service-level shared access signatures (SAS) on the server side. It supports Blob containers, File shares, Queues, and Tables.

### Creating a Stored Access Policy

Here's how to create a stored access policy using C# .NET:

```csharp
BlobSignedIdentifier identifier = new BlobSignedIdentifier
{
    Id = "stored access policy identifier",
    AccessPolicy = new BlobAccessPolicy
    {
        ExpiresOn = DateTimeOffset.UtcNow.AddHours(1),
        Permissions = "rw"
    }
};

blobContainer.SetAccessPolicy(permissions: new BlobSignedIdentifier[] { identifier });
```

And here's how to do it using Azure CLI:

```ps
az storage container policy create \
    --name <stored access policy identifier> \
    --container-name <container name> \
    --start <start time UTC datetime> \
    --expiry <expiry time UTC datetime> \
    --permissions <(a)dd, (c)reate, (d)elete, (l)ist, (r)ead, or (w)rite> \
    --account-key <storage account key> \
    --account-name <storage account name> \
```

### Modifying or Revoking a Stored Access Policy

To modify the parameters of the stored access policy you can call the access control list operation for the resource type to replace the existing policy. To revoke a stored access policy you can delete it, rename it by changing the signed identifier, or change the expiry time to a value in the past.

## When to Use SAS

Use a SAS when you want to provide secure access to resources in your storage account to any client who doesn't otherwise have permissions to those resources. A common scenario where a SAS is useful is a service where users read and write their own data to your storage account; or you need to copy data within Azure Storage: copying between different types of storage (like from a blob to a file), between different storage accounts, or even within the same storage account.

## Working with SAS

```cs
// Using StorageSharedKeyCredential with account name and key directly for authentication.
// This key has full permissions to all operations on all resources in your storage account.
// Works for all SAS types, but less secure.
var credential = new StorageSharedKeyCredential("<account-name>", "<account-key>");

// Using DefaultAzureCredential with Azure AD. More secure, but doesn't work for Service SAS.
// TokenCredential credential = new DefaultAzureCredential();

var service = new BlobServiceClient(new Uri("<account-url>"), credential);
var blobClient = service.GetBlobContainerClient("<container-name>").GetBlobClient("<blob-name>");

// Create a SAS token for the blob resource that's also valid for 1 day
BlobSasBuilder sasBuilder = new BlobSasBuilder()
{
    BlobContainerName = blobClient.BlobContainerName,
    BlobName = blobClient.Name,
    Resource = "b",
    StartsOn = DateTimeOffset.UtcNow,
    ExpiresOn = DateTimeOffset.UtcNow.AddDays(1),
    Permissions = BlobSasPermissions.Read | BlobSasPermissions.Write
};

////////////////////////////////////////////////////
// User Delegation SAS
////////////////////////////////////////////////////

// Request the user delegation key
// UserDelegationKey is used to sign the SAS token and has its own validity (can be used for multiple SAS)
UserDelegationKey userDelegationKey = await blobServiceClient.GetUserDelegationKeyAsync(
    DateTimeOffset.UtcNow,
    DateTimeOffset.UtcNow.AddDays(1));
// Add the SAS token to the blob URI
BlobUriBuilder uriBuilder = new BlobUriBuilder(blobClient.Uri)
{
    // Specify the user delegation key
    Sas = sasBuilder.ToSasQueryParameters(
        userDelegationKey,
        blobClient
            .GetParentBlobContainerClient()
            .GetParentBlobServiceClient().AccountName)
};
var blobClientSASUserDelegation = new BlobClient(uriBuilderUserDelegation.ToUri());

////////////////////////////////////////////////////
// Service SAS
////////////////////////////////////////////////////

Uri blobSASURIService = blobClient.GenerateSasUri(sasBuilder);
var blobClientSASService = new BlobClient(blobSASURIService);
```

```ps
# Assign the necessary permissions to the user
az role assignment create \
 --role "Storage Blob Data Contributor" \
 --assignee <email> \
 --scope "/subscriptions/<subscription>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>"

# Generate a user delegation SAS for a container
az storage container generate-sas \
 --account-name <storage-account> \
 --name <container> \
 --permissions acdlrw \
 --expiry <date-time> \
 --auth-mode login \
 --as-user

# Generate a user delegation SAS for a blob
az storage blob generate-sas \
 --account-name <storage-account> \
 --container-name <container> \
 --name <blob> \
 --permissions acdrw \
 --expiry <date-time> \
 --auth-mode login \
 --as-user \
 --full-uri

# Revoke all user delegation keys for the storage account
az storage account revoke-delegation-keys \
 --name <storage-account> \
 --resource-group <resource-group>
```
