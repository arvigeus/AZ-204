# [Azure Blob Storage](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blobs-introduction)

- Serving images or documents directly to a browser.
- Storing files for distributed access.
- Streaming video and audio.
- Writing to log files.
- Storing data for backup and restore, disaster recovery, and archiving.
- Storing data for analysis by an on-premises or Azure-hosted service.

## Types of storage accounts

- **Standard**: This is the standard general-purpose v2 account and is recommended for most scenarios using Azure Storage (ex: lower price).
- **Premium**: Premium accounts offer higher performance by using solid-state drives (ex: high transaction rates, using smaller objects, low latency)

## Types of resources

![Diagram showing the relationship between a storage account, containers, and blobs](https://learn.microsoft.com/en-us/azure/storage/blobs/media/storage-blobs-introduction/blob1.png)

- The [**storage account**](Storage%20Account.md)
- A **container** in the storage account: organizes a set of blobs, similar to a directory in a file system. A storage account can include an unlimited number of containers, and a container can store an unlimited number of blobs. Container names are 3-63 chars and must start with a letter or number, and can contain only lowercase letters, numbers, and the dash (-) character (no double dash allowed).
- A **blob** in a container. Blob names are case sensitive and cannot end with dash or dot. Each version of the blob has a unique tag, called an `ETag` that allows to only change a specific instance of the blob.

Endpoint: `https://<storage-account>.blob.core.windows.net/<container>/<blob>`

## Blobs

[Understanding block blobs, append blobs, and page blobs](https://learn.microsoft.com/en-us/rest/api/storageservices/understanding-block-blobs--append-blobs--and-page-blobs)

### Blob Blocks

Store text and binary data. Block blobs are made up of blocks of data that can be managed individually

#### [Access tiers](https://learn.microsoft.com/en-us/azure/storage/blobs/access-tiers-overview)

- Hot tier (default) - Frequently accessed or modified data. Highest storage costs, lowest access costs.

- Cool tier - Infrequently accessed or modified data. Minimum for 30 days.

- Cold tier - same as cool tier, but for 90 days.

- Archive tier - Available only for individual block blobs. Rarely accessed, flexible (very high) latency (in matter of hours) data. Minimum for 180 days.  
  Does not support \*ZRS redundancy.  
  To access data, either [copy](https://learn.microsoft.com/en-us/azure/storage/blobs/archive-rehydrate-overview#copy-an-archived-blob-to-an-online-tier) or [change](https://learn.microsoft.com/en-us/azure/storage/blobs/archive-rehydrate-overview#change-a-blobs-access-tier-to-an-online-tier) data to online tier. Rehydration copy to a different account is supported if the other account is within the same region. Destination cannot be at archive tier. Rehydration can take up to 15 hours (Standard), or up to 1 hour (High). Priority can be upgraded any time. Can be checked by `x-ms-rehydrate-priority` header.

Non-hot is perfect for short-term data backup and disaster recovery. Access tiers are available for block blobs only (other types of blobs are considered "Hot").

There is a penalty for removing data, or moving it to different tier, earlier (copying is fine though). If needs to be kept for at least X days without early deletion penalty, then a tier with <= days should be chosen. Example: for 45 days you choose cool tier - if you delete data on day 45 on cold tier there will be penalty, while there won't be for cool tier.

**Archive** tier is considered _offline_ (requires rehydration to be accessed). All other tiers are considered _online_ (can be accessed at any time).

### Append Blobs

Optimized for append operations. Ideal for scenarios such as logging data from virtual machines.

### [Page blobs](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blob-pageblob-overview)

Stores random access files up to 8 TiB. For virtual hard drive (VHD) files, disks for Azure virtual machines, or databseses.

![A diagram showing the two separate write options.](https://learn.microsoft.com/en-us/azure/storage/blobs/media/storage-blob-pageblob-overview/storage-blob-pageblob-overview-figure2.png)

```cs
// Create an empty page blob of a specified size
var blobServiceClient = new BlobServiceClient(connectionString);
var blobContainerClient = blobServiceClient.GetBlobContainerClient(containerName);
var pageBlobClient = blobContainerClient.GetPageBlobClient("0s4.vhd");
pageBlobClient.Create(16 * 1024 * 1024 * 1024 /* 1GB */);

// Resizing a page blob
pageBlobClient.Resize(32 * 1024 * 1024 * 1024);

// Writing pages to a page blob
pageBlobClient.UploadPages(dataStream, startingOffset);

// Reading pages from a page blob
var pageBlob = pageBlobClient.Download(new HttpRange(bufferOffset, rangeSize));
```

## [Blob storage lifecycle policies](https://learn.microsoft.com/en-us/azure/storage/blobs/lifecycle-management-overview)

Azure Storage lifecycle management offers a rule-based policy that lets you:

- Transition blobs to a cooler storage tier (hot to cool, hot to archive, or cool to archive) to optimize for performance and cost
- Delete blobs at the end of their lifecycles
- Define rules to be run once per day at the storage account level
- Apply rules to containers or a subset of blobs (using prefixes as filters)

Lifecycle management is free of charge and doesn't affect system containers such as the `$logs` or `$web` containers.

```ts
type ActionRunCondition = {
  daysAfterModificationGreaterThan: number;
  daysAfterCreationGreaterThan: number;
  daysAfterLastAccessTimeGreaterThan: number; // requires last access time tracking
};

type RuleAction = {
  tierToCool?: ActionRunCondition;
  tierToArchive?: {
    daysAfterModificationGreaterThan: number;
    daysAfterLastTierChangeGreaterThan: number;
  };
  enableAutoTierToHotFromCool?: ActionRunCondition;
  delete?: ActionRunCondition;
};

type RelesType = {
  rules: [
    {
      enabled: boolean;
      name: string;
      type: "Lifecycle";
      definition: {
        actions: {
          version?: RuleAction;
          baseBlob?: RuleAction;
          snapshopt?: Omit<RuleAction, "enableAutoTierToHotFromCool">;
          appendBlob?: { delete: ActionRunCondition };
        };
        filters?: {
          blobTypes: Array<"appendBlob" | "blockBlob">;
          // Up to 10 case-sensitive prefixes. A prefix string must start with a container name.
          // To match the container or blob name exactly, include the trailing forward slash ('/'), e.g., 'sample-container/' or 'sample-container/blob1/'
          // To match the container or blob name pattern (wildcard), omit the trailing forward slash, e.g., 'sample-container' or 'sample-container/blob1'
          prefixMatch?: string[];
          // Each rule can define up to 10 blob index tag conditions.
          // example, if you want to match all blobs with `Project = Contoso``: `{"name": "Project","op": "==","value": "Contoso"}``
          blobIndexMatch?: Record<string, string>;
        };
      };
    }
  ];
};
```

Once you configure a policy (create/update), it can take _up to 24 hours to go into effect_. Once the policy is in effect, it could take _up to 24 hours_ for some actions to run for the first time.

Data stored in a premium block blob storage account cannot be tiered to Hot, Cool, or Archive using Set Blob Tier or using Azure Blob Storage lifecycle management.

If you define more than one action on the same blob, lifecycle management applies the least expensive action to the blob: `delete < tierToArchive < tierToCool`.

### Creating a new policy

Portal: `All resources > storage account > Data management > Lifecycle management > List view > Add rule > fill out the Action set form fields > add an optional filter`

CLI:

```ps
az storage account management-policy create \
    #--account-name "<storage-account>" \
    #--resource-group "<resource-group>"
    --policy @policy.json \
```

A lifecycle management policy must be read or written in full. Partial updates aren't supported.

### Optionally enable access time tracking

When access time tracking is enabled, a lifecycle management policy can include an action based on the time that the blob was last accessed with a read (tracks only the first in the past 24 hours) or write operation. This adds additional billing.

```ps
az storage account blob-service-properties update \
    #--resource-group <resource-group> \
    #--account-name <storage-account> \
    --enable-last-access-tracking true
```

## Properties and metadata

Metadata name/value pairs are valid HTTP headers, and so should adhere to all restrictions governing HTTP headers. Metadata names must be valid HTTP header names and valid C# identifiers, may contain only ASCII characters, and should be treated as case-insensitive.

### [Manage container properties and metadata by using .NET](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blob-container-properties-metadata)

Blob containers support system properties and user-defined metadata, in addition to the data they contain. Metadata values containing non-ASCII characters should be Base64-encoded or URL-encoded.

- **System properties**: System properties exist on each Blob storage resource. Some of them can be read or set, while others are read-only. Under the covers, some system properties correspond to certain standard HTTP headers.
- **User-defined metadata**: For your own purposes only, and do not affect how the resource behaves.

```cs
/// <exception cref="RequestFailedException">Thrown if a failure occurs.</exception>
Task<Azure.Response<BlobContainerProperties>> GetPropertiesAsync (BlobRequestConditions conditions = default, CancellationToken cancellationToken = default);

/// <exception cref="RequestFailedException">Thrown if a failure occurs.</exception>
Task<Azure.Response<BlobContainerInfo>> SetMetadataAsync (IDictionary<string,string> metadata, BlobRequestConditions conditions = default, CancellationToken cancellationToken = default);
```

If two or more metadata headers with the same name are submitted for a resource, Blob storage comma-separates and concatenates the two values and returns HTTP response code `200 (OK)` (Note: Rest cannot do that!)

Example:

```csharp
private static async Task DemoContainerPropertiesAndMetadataAsync(BlobContainerClient container)
{
    try
    {
        // Fetch some container properties and write out their values.
        var properties = await container.GetPropertiesAsync();
        Console.WriteLine($"Properties for container {container.Uri}");
        Console.WriteLine($"Public access level: {properties.Value.PublicAccess}");
        Console.WriteLine($"Last modified time in UTC: {properties.Value.LastModified}");

        var metadata = new Dictionary<string, string>() { { "docType", "textDocuments" }, { "category", "guidance" } };
        var containerInfo = await container.SetMetadataAsync(metadata); // ETag, LastModified
    }
    catch (RequestFailedException e) {}
}
```

Read more:

- [BlobContainerClient.GetPropertiesAsync](https://learn.microsoft.com/en-us/dotnet/api/azure.storage.blobs.blobcontainerclient.getpropertiesasync)
- [BlobContainerClient.SetMetadataAsync](https://learn.microsoft.com/en-us/dotnet/api/azure.storage.blobs.blobcontainerclient.setmetadataasync)
- [BlobContainerProperties](https://learn.microsoft.com/en-us/dotnet/api/azure.storage.blobs.models.blobcontainerproperties?view=azure-dotnet) (PascalCase properties, `IDictionary<string,string> Metadata` for custom metadata)
- [BlobRequestConditions](https://learn.microsoft.com/en-us/dotnet/api/azure.storage.blobs.models.blobrequestconditions?view=azure-dotnet)

### [Set and retrieve properties and metadata for blob resources by using REST](https://learn.microsoft.com/en-us/rest/api/storageservices/setting-and-retrieving-properties-and-metadata-for-blob-resources)

Endpoint templates:

- Container: `https://<storage-account>.blob.core.windows.net/<container>?restype=container`
- Blob: `https://<storage-account>.blob.core.windows.net/<container>/<blob>?comp=metadata # blob`

Retrieving metadata: `GET` or `HEAD` (example: `GET https://<storage-account>.blob.core.windows.net/<container>/<blob>?comp=metadata`)  
Setting metadata: `PUT` (example: `PUT https://myaccount.blob.core.windows.net/mycontainer?comp=metadata?restype=container`)

If two or more metadata headers with the same name are submitted for a resource, the Blob service returns status code `400 (Bad Request)`.

The total size of all metadata pairs can be up to 8KB in size.

Partial updates are not supported: setting metadata on a resource overwrites any existing metadata values for that resource.

### Standard HTTP Properties for Containers and Blobs

`ETag` and `Last-Modified` are common for containers and blobs.

Containers:

- ETag (`x-ms-meta-etag`)
- Last-Modified (`x-ms-meta-last-modified`)

Blobs:

- ETag (`x-ms-meta-etag`)
- Last-Modified (`x-ms-meta-last-modified`)
- Content-Length (`x-ms-meta-content-length`)
- Content-Type (`x-ms-meta-content-type`)
- Content-MD5 (`x-ms-meta-content-md5`)
- Content-Encoding (`x-ms-meta-content-encoding`)
- Content-Language (`x-ms-meta-content-language`)
- Cache-Control (`x-ms-meta-cache-control`)
- Origin (`x-ms-meta-origin`)
- Range (`x-ms-meta-range`)

## [Encryption Scope](https://learn.microsoft.com/en-us/azure/storage/blobs/encryption-scope-overview)

Blobs use default encryption scope of the container, or the storage account if no default encryption scope is specified for the container. Individual blobs can be uploaded with custom encryption scope. You also cannot change the access tier for a blob that uses an encryption scope. When you disable an encryption scope, any subsequent read or write operations made with the encryption scope will fail with HTTP error code 403 (Forbidden).

When you enable an encryption scope, you are billed for a minimum of one month (30 days). After the first month, charges for an encryption scope are prorated on an hourly basis.

### [Manage Encryption Scope](https://learn.microsoft.com/en-us/azure/storage/blobs/encryption-scope-manage)

Encryption scope for storage account:

- Azure Portal: `storage account > Security + networking > Encryption > Encryption Scopes tab.`
- CLI:

```ps
az storage account encryption-scope create \
    #--resource-group "<resource-group>" \
    #--account-name "<storage-account>" \
    #--name "<scope>" \
    --key-source Microsoft.Storage
```

Encryption scope for storage account:

- Azure Portal: `storage account > containers > Add > Advanced > Encryption scope`
- CLI:

```ps
az storage container create \
    #--account-name "<storage-account>" \
    #--resource-group "<resource-group>" \
    #--name "<container>" \
    --default-encryption-scope "<scope>" \
    --prevent-encryption-scope-override true \ # force all blobs in a container to use the container's default scope
    #--auth-mode login
```

Upload a blob with an encryption scope:

- Azure Portal: `storage account > containers > Upload > Advanced > Encryption scope`
- CLI:

```ps
az storage blob upload \
    #--account-name "<storage-account>" \
    #--container-name "<container>" \
    #--file "<file>" \
    #--name "<file>" \
    --encryption-scope "<scope>"
```

Change the encryption key for a scope:

- Azure Portal: `storage account > Encryption Scopes > More > Edit encryption scope`
- CLI:

```ps
az storage account encryption-scope update \
    #--account-name "<storage-account>" \
    #--resource-group "<resource-group>"
    #--name "<scope>" \
    --key-source Microsoft.Storage

az storage account encryption-scope update \
    #--resource-group "<resource-group>" \
    #--account-name "<storage-account>" \
    #--name "<scope>" \
    --key-source Microsoft.KeyVault \
    --key-uri "<key-uri>"

```

Disable an encryption scope:

- Azure Portal: `storage account > Encryption Scopes > scope > Disable`
- CLI:

```ps
az storage account encryption-scope update \
    #--account-name <storage-account> \
    #--resource-group <resource-group> \
    #--name <scope> \
    --state Disabled
```

## [Leasing](https://learn.microsoft.com/en-us/rest/api/storageservices/lease-blob)

Leasing allows a client to create a lease on a Blob, during which time the Blob cannot be deleted or overwritten. This provides exclusive write access to a Blob for a certain client.

```cs
// Acquire a lease on the blob
string proposedLeaseId = Guid.NewGuid().ToString();
var leaseClient = blobClient.GetBlobLeaseClient(proposedLeaseId);
var lease = leaseClient.Acquire(TimeSpan.FromSeconds(15));
// leaseClient.Renew();
// leaseClient.Change(newLeaseId); // change the ID of an existing lease
// leaseClient.Release();
// leaseClient.Break(); // end the lease, but ensure that another client can't acquire a new lease until the current lease period has expired
```

```ps
leaseId=$(az storage blob lease acquire --connection-string "your_connection_string" --container-name "sample-container" --name "sample-blob" --lease-duration 60 --output tsv)
# az storage blob lease renew --connection-string "your_connection_string" --container-name "sample-container" --name "sample-blob" --lease-id $leaseId
# az storage blob lease change --connection-string "your_connection_string" --container-name "sample-container" --name "sample-blob" --lease-id $leaseId --proposed-lease-id $newLeaseId
# az storage blob lease release --connection-string "your_connection_string" --container-name "sample-container" --name "sample-blob" --lease-id $leaseId
# az storage blob lease break --connection-string "your_connection_string" --container-name "sample-container" --name "sample-blob"
```

```http
PUT https://myaccount.blob.core.windows.net/mycontainer/myblob?comp=lease

Request Headers:
x-ms-version: 2015-02-21
x-ms-lease-action: acquire
x-ms-lease-duration: -1 # In seconds. -1 is infinite
x-ms-proposed-lease-id: 1f812371-a41d-49e6-b123-f4b542e851c5
x-ms-date: <date>
...

Response Status:
HTTP/1.1 201 Created

Response Headers:
Server: Windows-Azure-Blob/1.0 Microsoft-HTTPAPI/2.0
x-ms-request-id: cc6b209a-b593-4be1-a38a-dde7c106f402
x-ms-version: 2015-02-21
x-ms-lease-id: 1f812371-a41d-49e6-b123-f4b542e851c5
Date: <date>
...
```

Lease ID is neede whenever you want to update, delete or change the lease status on this blob. If the lease ID isn't included, these operations fail with `412 – Precondition failed`.

## [Static website hosting](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blob-static-website)

Static website can be enabled/disbled from Azure Portal (`storage account > Static Website`) or CLI (`az storage blob service-properties update --account-name <storage-account> --static-website {true|false}`). This creates a container called `$web`. During deployment/maintenance, it should be disabled to prevent broken site for users (changing container/account access won't have any effect on `web` endpoint, only to `blob` endpoint).

Endpoint: `https://<storage-account>.z[00-50].web.core.windows.net/`

![Screenshot showing the locations of the fields to enable and configure static website hosting.](https://learn.microsoft.com/en-us/training/wwl-azure/explore-azure-blob-storage/media/enable-static-website-hosting.png)

Lifecycle management doesn't affect system containers such as the `$logs` or `$web` containers.

### Limitations

- If you want to configure headers, Azure Content Delivery Network (Azure CDN) is required.
- AuthN and AuthZ are not supported.
- CORS is not supported with static website.

Use [Azure Static Web Apps](https://azure.microsoft.com/services/app-service/static/) if you need these (plus CI/CD)

### [Mapping a custom domain to a static website URL](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-custom-domain-name?tabs=azure-portal)

To enable HTTPS, you'll have to use Azure CDN

- Get the host name of your storage endpoint: Copy value of `Settings > Endpoints > Static website` (**without** `https://`)
- Create a CNAME record
- Register your custom domain with Azure: `az storage account update --custom-domain <custom-domain-name> --use-subdomain false ...` (or `storage account > Networking >  Custom domain > Domain name`)

## Blob operations

```ps
# Upload blob
# az group create --name myresourcegroup --location westus
# az storage account create --name mystorageaccount --resource-group myresourcegroup --location westus --sku Standard_LRS
# az storage container create --name mycontainer --account-name mystorageaccount
az storage blob upload --account-name mystorageaccount --container-name mycontainer --name myblob --type block --file ./local/path/to/file
```

```ps
# Copy blob (example: archive tier to online tier)
az storage blob copy start \
    --source-container "<source-container>" \
    --source-blob "<source-blob>" \
    # For a different storage account or RA-GRS (with "-secondary"), use this instead:
    # --source-uri $srcBlobUri \

    --destination-container "<dest-container>" \
    --destination-blob "<dest-blob>" \
    #--account-name "<storage-account>" \
    --tier hot \
    --rehydrate-priority Standard \
    #--auth-mode login
```

```ps
# Change blob access tier
az storage blob set-tier \
    #--account-name "<storage-account>" \
    #--container-name "<container>" \
    #--name "<archived-blob>" \
    --tier Hot \
    --rehydrate-priority Standard \
    #--auth-mode login
```

```ps
# Update the rehydration priority for a blob.
az storage blob set-tier \
    #--account-name "<storage-account>" \
    #--container-name "<container>" \
    #--name "<blob>" \
    --rehydrate-priority High \
    #--auth-mode login
```

```ps
# Set the default access tier for a storage account
az storage account update \
    #--resource-group "<resource-group>" \
    #--name "<storage-account>" \
    --access-tier Cool
```

```ps
# Set a blob's tier on upload
az storage blob upload \
    #--account-name "<storage-account>" \
    #--container-name "<container>" \
    #--name "<blob>" \
    --file "<file>" \
    --tier "<tier>" \
    #--auth-mode login
```

[AzCopy](https://learn.microsoft.com/en-us/azure/storage/common/storage-use-azcopy-v10):

```ps
# Move data to blob storage
azcopy copy "C:\local\path" "https://<storage-account>.blob.core.windows.net/<container>/<sas-token>" --recursive=true
```

[Working with blobs](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-quickstart-blobs-dotnet)

```cs
var blobServiceClient = new BlobServiceClient(new Uri("https://<storage-account-name>.blob.core.windows.net"), new DefaultAzureCredential());

// Create the container and return a container client object
var containerClient = await blobServiceClient.CreateBlobContainerAsync("quickstartblobs" + Guid.NewGuid().ToString());
// var containerClient = blobServiceClient.GetBlobContainerClient(containerName);
// var containerClient = new BlobContainerClient(new Uri($"https://{accountName}.blob.core.windows.net/{containerName}"), new DefaultAzureCredential(), clientOptions);

var blobClient = containerClient.GetBlobClient(fileName);

await blobClient.UploadAsync(localFilePath, true);

// List all blobs in the container
await foreach (var blobItem in containerClient.GetBlobsAsync()) {}

// Download the blob's contents and save it to a file
await blobClient.DownloadToAsync(downloadFilePath);
```

## [Authorization](https://learn.microsoft.com/en-us/azure/storage/common/authorize-data-access)

Authorization ensures that the client application has the appropriate permissions to access a particular resource in your storage account.

### [Shared Key (storage account key)](https://learn.microsoft.com/en-us/rest/api/storageservices/authorize-with-shared-key)

The shared key authorization scheme provides access to all operations and resources within a storage account, but not to other storage accounts. It's essentially the equivalent of a root user in a Unix system. Because of the security risk, it's usually not recommended for routine access.

The advantage of using shared keys is their simplicity. They are most appropriate for scenarios such as data migration, where you need high privileges and are willing to accept the security trade-off.

You can obtain your account key from the Azure portal: `storage account > Security + networking > Access keys`. There you will see `key1` and `key2`, either of which can be used as the account key. Alternatevely, as table: `az storage account keys list --account-name myaccount --resource-group myresourcegroup --output table`.

```cs
var credential = new StorageSharedKeyCredential("<account-name>", "<account-key>");
var service = new BlobServiceClient(new Uri("<account-url>"), credential);
```

```ps
az storage blob upload --account-name myaccount --account-key mykey --name myblob --type block --file ./local/path/to/file --container-name mycontainer
```

```http
Authorization: SharedKey myaccount:CY1OP3vGZJe6t2iQp6AU7CmbZjNtsQQ5EGGKkqJl+XI=
```

### [Shared Access Signature (SAS)](https://learn.microsoft.com/en-us/azure/storage/common/storage-sas-overview)

A Shared Access Signature (SAS) is a URI that grants restricted access rights to Azure Storage resources. You can provide a SAS to clients who should not be trusted with your storage account key but whom you wish to delegate access to certain storage account resources.

A SAS is appropriate when you need to give precise, limited permissions to a client. For instance, you may want a client to have read-only access to a blob for a specific time period.

1. **User Delegation SAS**: This method uses Azure Active Directory (Azure AD) credentials to create a SAS. It's a secure way to grant limited access to your Azure Storage resources without sharing your account key. It's recommended when you want to provide fine-grained access control to clients who are authenticated with Azure AD.

1. **Service SAS**: This method uses your storage account key to create a SAS. It's a straightforward way to grant limited access to your Azure Storage resources. However, it's less secure than the User Delegation SAS because it involves sharing your account key. It's typically used when you want to provide access to clients who are not authenticated with Azure AD.

```cs
// Using StorageSharedKeyCredential with account name and key directly for authentication.
// This key has full permissions to all operations on all resources in your storage account.
// Works for all SAS types, but less secure.
var credential = new StorageSharedKeyCredential("<account-name>", "<account-key>");

// Using DefaultAzureCredential with Azure AD. More secure, but doesn't work for Service SAS.
// TokenCredential credential = new DefaultAzureCredential();

var service = new BlobServiceClient(new Uri("<account-url>"), credential);
var blobClient = service.GetBlobContainerClient("<container-name>").GetBlobClient("<blob-name>");

var sasBuilder = new BlobSasBuilder
{
    BlobContainerName = blobClient.BlobContainerName,
    BlobName = blobClient.Name,
    Resource = "b",
    StartsOn = DateTimeOffset.UtcNow,
    ExpiresOn = DateTimeOffset.UtcNow.AddDays(1),
    IPRange = new SasIPRange(IPAddress.None, IPAddress.None),
    Protocol = SasProtocol.Https,
};

sasBuilder.SetPermissions(BlobSasPermissions.Read | BlobSasPermissions.Write);

// For User Delegation SAS
UserDelegationKey userDelegationKey = await service.GetUserDelegationKeyAsync(DateTimeOffset.UtcNow, DateTimeOffset.UtcNow.AddDays(1));
BlobUriBuilder uriBuilderUserDelegation = new BlobUriBuilder(blobClient.Uri)
{
    // Specify the user delegation key
    Sas = sasBuilder.ToSasQueryParameters(userDelegationKey, service.AccountName)
};
var blobClientSASUserDelegation = new BlobClient(uriBuilderUserDelegation.ToUri());

// For Service SAS
Uri blobSASURIService = blobClient.GenerateSasUri(sasBuilder);
var blobClientSASService = new BlobClient(blobSASURIService);
```

```ps
az storage blob generate-sas --account-name myaccount --account-key mykey --name myblob --permissions r --expiry 2023-07-04T00:00Z --container-name mycontainer
```

```http
https://myaccount.blob.core.windows.net/mycontainer/myblob?sv=2018-03-28&ss=b&srt=sco&sp=rw&se=2023-07-04T00:00Z&st=2023-07-04T00:00Z&spr=https&sig=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2c3d4e5f6

# sv: version
# ss: services
# srt: resource types
# sp: permissions
# se: expiry time
# st: start time
# spr: protocols
# sig: signature.
```

### [Azure Active Directory (Azure AD)](https://learn.microsoft.com/en-us/azure/storage/blobs/authorize-access-azure-active-directory)

Azure AD provides identity-based access control, so you can use it to authenticate and authorize users and services. This includes built-in features like multi-factor authentication, conditional access, and identity protection.

Azure AD is the best choice when you need to authorize users and services based on their identity and roles, and when you need to utilize advanced security features. For example, it's ideal for enterprise scenarios where you want to allow employees to access Azure Storage, but you need fine-grained control over who has access and what they can do.

```cs
TokenCredential credential = new DefaultAzureCredential();
var service = new BlobServiceClient(new Uri("<account-url>"), credential);
```

```ps
az login
az storage blob upload --account-name myaccount --name myblob --type block --file ./local/path/to/file --container-name mycontainer
```

#### Using app credentials

`Azure Active Directory > App Registrations`

```cs
TokenCredential credential = new ClientSecretCredential("<tenant-id>", "<client-id>", "<client-secret>");
var service = new BlobServiceClient(new Uri("<account-url>"), credential);
```

```ps
az login --service-principal --username <client-id> --password <client-secret> --tenant <tenant-id>
az storage blob upload --account-name myaccount --name myblob --type block --file ./local/path/to/file --container-name mycontainer
```

### [Anonymous public read access](https://learn.microsoft.com/en-us/azure/storage/blobs/anonymous-read-access-prevent?tabs=azure-cli)

Anonymous public access to your data is always prohibited by default. If the storage account doesn't allow public access, then no container within it can have public access, regardless of its own settings. If public access is allowed at the storage account level, then a container's access depends on its own settings (**Public access: Container**, or **Public access: Blob**).
