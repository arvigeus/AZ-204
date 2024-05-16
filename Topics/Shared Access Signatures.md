# [Shared Access Signatures (SAS)](https://learn.microsoft.com/en-us/azure/storage/common/storage-sas-overview)

A Shared Access Signature (SAS) is a URI that grants restricted access rights to Azure Storage resources. It's a signed URI that points to one or more storage resources and includes a token that contains a special set of query parameters.

Use a SAS for secure, temporary access to your storage account, especially when users need to read/write their own data or for copying data within Azure Storage.

Note: You should prefer Entra ID

## Types of SAS

1. [**User Delegation SAS**](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blob-user-delegation-sas-create-dotnet): This method uses Microsoft Entra ID credentials to create a SAS. It's a secure way to grant limited access to your Azure Storage resources without sharing your account key. It's recommended when you want to provide fine-grained access control to clients who are authenticated with Entra ID. The account _must have_ `generateUserDelegationKey` permisison, or `Contributor` role.

1. [**Service SAS**](https://learn.microsoft.com/en-us/azure/storage/blobs/sas-service-create-dotnet): This method uses your storage account key to create a SAS. It's a straightforward way to grant limited access to your Azure Storage resources. However, it's less secure than the User Delegation SAS because it involves sharing your account key. It's typically used when you want to provide access to clients who are not authenticated with Entra ID.

1. [**Account SAS**](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-sas-create-dotnet): This method uses your storage account key to create a SAS. It's created at the storage account level, allowing access to multiple services within the account. It's typically used when you need to provide access to several services in your storage account. However, it involves sharing your account key, similar to the Service SAS.

   - Ad hoc SAS: Defines start, expiry, and permissions in the SAS URI. Any SAS can be an ad hoc SAS.
   - Service SAS: Uses a stored policy on resources to inherit start, expiry, and permissions.

## How SAS Works

A SAS requires two components: a URI to the resource you want to access and a SAS token that you've created to authorize access to that resource.

- **URI**: `https://<account>.blob.core.windows.net/<container>/<blob>?`
- **SAS token**: `sp=r&st=2020-01-20T11:42:32Z&se=2020-01-20T19:42:32Z&spr=https&sv=2019-02-02&sr=b&sig=SrW1HZ5Nb6MbRzTbXCaPm%2BJiSEn15tC91Y4umMPwVZs%3D`

[Reference](https://learn.microsoft.com/en-us/rest/api/storageservices/create-service-sas):

| Component | Friendly Name                           | Description                                                                                                                                                                                       |
| --------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| sp        | `S`hared `P`ermissions                  | Controls the access rights. Possible values include: `a`dd, `c`reate, `d`elete, `l`ist, `r`ead, `w`rite. Ex: `sp=acdlrw` grants all the available rights.                                         |
| st        | `S`hared Access Signature Start `T`ime  | The date and time when access starts. Ex: `st=2023-07-28T11:42:32Z` means the access starts at 11:42:32 UTC on July 28, 2023.                                                                     |
| se        | `S`hared Access Signature `E`xpiry Time | The date and time when access ends. Ex: `se=2023-07-28T19:42:32Z` means the access ends at 19:42:32 UTC on July 28, 2023.                                                                         |
| sv        | `S`torage API `V`ersion                 | The version of the storage API to use. Ex: `sv=2020-02-10` means the storage API version 2020-02-10 is used.                                                                                      |
| sr        | `S`torage `R`esource                    | The kind of storage being accessed. Possible values include: `b`lob, `f`ile, `q`ueue, `t`able, `c`ontainer, `d`irectory. Ex: `sr=b` means a blob is being accessed.                               |
| sig       | `Sig`nature                             | The cryptographic signature. Ex: `sig=SrW1HZ5Nb6MbRzTbXCaPm%2BJiSEn15tC91Y4umMPwVZs%3D` is a cryptographic signature.                                                                             |
| sip       | `S`ource `IP` Range                     | (Optional) Allowed IP addresses or IP range. Ex: `sip=168.1.5.60-168.1.5.70` means only the IP addresses from 168.1.5.60 to 168.1.5.70 are allowed.                                               |
| spr       | `S`upported `Pr`otocols                 | (Optional) Allowed protocols. Possible values include: 'https', 'http,https'. Ex: `spr=https` means only HTTPS is allowed.                                                                        |
| si        | `S`tored Access **Policy** `I`dentifier | (Optional) The name of the stored access policy. Ex: `si=MyAccessPolicy` means the stored access policy named "MyAccessPolicy" is used.                                                           |
| rscc      | `R`e`s`ponse `C`ache `C`ontrol          | (Optional) The response header override for cache control. Ex: `rscc=public` means the "Cache-Control" header is set to "public".                                                                 |
| rscd      | `R`e`s`ponse `C`ontent `D`isposition    | (Optional) The response header override for content disposition. Ex: `rscd=attachment; filename=example.txt` means the "Content-Disposition" header is set to "attachment; filename=example.txt". |
| rsce      | `R`e`s`ponse `C`ontent `E`ncoding       | (Optional) The response header override for content encoding. Ex: `rsce=gzip` means the "Content-Encoding" header is set to "gzip".                                                               |
| rscl      | `R`e`s`ponse `C`ontent `L`anguage       | (Optional) The response header override for content language. Ex: `rscl=en-US` means the "Content-Language" header is set to "en-US".                                                             |
| rsct      | `R`e`s`ponse `C`ontent `T`ype           | (Optional) The response header override for content type. Ex: `rsct=text/plain` means the "Content-Type" header is set to "text/plain".                                                           |

Note: All 2-letter parameters are required, except `si` (Access Policy)

## Best Practices

- Always use HTTPS.
- Use user delegation SAS wherever possible.
- Set your expiration time to the smallest useful value.
- Only grant the access that's required.
- Create a middle-tier service to manage users and their access to storage when there's an unacceptable risk of using a SAS.

## [Stored Access Policies](https://learn.microsoft.com/en-us/rest/api/storageservices/define-stored-access-policy)

Allow you to group SAS and set additional constraints like start time, expiry time, and permissions. Work on **container** level.

Use `SetAccessPolicy` on `BlobContainer` to apply an array containing a single `BlobSignedIdentifier` that has a configured `BlobAccessPolicy` for the `AccessPolicy` property.

```cs
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

```sh
az storage container policy create \
    --name <stored access policy identifier> \
    --container-name <container name> \
    --start <start time UTC datetime> \
    --expiry <expiry time UTC datetime> \
    --permissions <(a)dd, (c)reate, (d)elete, (l)ist, (r)ead, or (w)rite> \
    --account-key <storage account key> \
    --account-name <storage account name> \
```

To cancel (revoke) a policy, you can either delete it, rename it, or set its expiration time to a past date.

To remove all access policies from the resource, call the `Set ACL` operation with an empty request body.

## Working with SAS

Gist:

- Service SAS and Account SAS use `StorageSharedKeyCredential`; User delegation SAS use `DefaultAzureCredential` or similar Entra ID
- Service SAS and User delegation SAS use `BlobSasBuilder`; Account SAS uses `AccountSasBuilder`
- Set permissions: `BlobSasPermissions` for user and service; `AccountSasPermissions` for account
- Obtaining URI:
  - User delegation SAS: Use key generated from `BlobServiceClient.GetUserDelegationKeyAsync` as first param of `BlobSasBuilder.ToSasQueryParameters(key, accountName)`; pass it to `BlobUriBuilder(BlobClient.Uri).Sas`
  - Service SAS: `BlobClient.GenerateSasUri(BlobSasBuilder)`
  - Account SAS: `BlobSasBuilder.ToSasQueryParameters(sharedKeyCredential)` and construct Uri from it at root level (`https://{accountName}.blob.core.windows.net?{sasToken}`)

```cs
// Using StorageSharedKeyCredential with account name and key directly for authentication.
// This key has full permissions to all operations on all resources in your storage account.
// Works for all SAS types, but less secure.
var credential = new StorageSharedKeyCredential("<account-name>", "<account-key>");

// Using DefaultAzureCredential with Entra ID. More secure, but doesn't work for Service SAS.
// TokenCredential credential = new DefaultAzureCredential();

var serviceClient = new BlobServiceClient(new Uri("<account-url>"), credential);
var blobClient = serviceClient.GetBlobContainerClient("<container-name>").GetBlobClient("<blob-name>");

// Create a SAS token for the blob resource that's also valid for 1 day
BlobSasBuilder sasBuilder = new BlobSasBuilder()
{
    BlobContainerName = blobClient.BlobContainerName,
    BlobName = blobClient.Name,
    Resource = "b", // HINT: in case of missing BlobName property, then Resource = "c"
    StartsOn = DateTimeOffset.UtcNow,
    ExpiresOn = DateTimeOffset.UtcNow.AddDays(1)
};
sasBuilder.SetPermissions(BlobSasPermissions.Read | BlobSasPermissions.Write);

////////////////////////////////////////////////////
// User Delegation SAS
////////////////////////////////////////////////////

// Request the user delegation key
// UserDelegationKey is used to sign the SAS token and has its own validity (can be used for multiple SAS)
UserDelegationKey userDelegationKey = await serviceClient.GetUserDelegationKeyAsync(
    DateTimeOffset.UtcNow,
    DateTimeOffset.UtcNow.AddDays(1));
var userSas = sasBuilder.ToSasQueryParameters(userDelegationKey, serviceClient.AccountName);
// Add the SAS token to the blob URI
BlobUriBuilder uriBuilder = new BlobUriBuilder(blobClient.Uri) { Sas = userSas };
var blobClientSASUserDelegation = new BlobClient(uriBuilder.ToUri());

////////////////////////////////////////////////////
// Service SAS
////////////////////////////////////////////////////

Uri blobSASURIService = blobClient.GenerateSasUri(sasBuilder);
var blobClientSASService = new BlobClient(blobSASURIService);
```

Account SAS:

````cs
var sharedKeyCredential = new StorageSharedKeyCredential("<account-name>", "<account-key>");

// Create a SAS token that's valid for one day
var sasBuilder = new AccountSasBuilder()
{
    Services = AccountSasServices.Blobs | AccountSasServices.Queues,
    ResourceTypes = AccountSasResourceTypes.Service,
    ExpiresOn = DateTimeOffset.UtcNow.AddDays(1),
    Protocol = SasProtocol.Https
};
sasBuilder.SetPermissions(AccountSasPermissions.Read | AccountSasPermissions.Write);

// Use the key to get the SAS token
// NOTE: You can pass sharedKeyCredential to ToSasQueryParameters (also valid for Service SAS)
var sasToken = sasBuilder.ToSasQueryParameters(sharedKeyCredential).ToString();

// Create a BlobServiceClient object with the account SAS appended
var blobServiceURI = $"https://{accountName}.blob.core.windows.net";
var blobServiceClientAccountSAS = new BlobServiceClient(
    new Uri($"{blobServiceURI}?{sasToken}"));
    ```

```sh
# Assign the necessary permissions to the user
az role assignment create \
 --role "Storage Blob Data Contributor" \
 --assignee <email> \
 --scope "/subscriptions/<subscription>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>"

# Account Level SAS: --account-name and --account-key
# Service Level SAS: --resource-types + same as above
# User Level SAS: --auth-mode login
# (applicable for Stored Access Policies as well)

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
 --resource-group $resourceGroup
````
