# [Azure Blob Storage](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blobs-introduction)

Endpoint: `https://<storage-account>.blob.core.windows.net/<container>/<blob>`

- Serving images or documents directly to a browser.
- Storing files for distributed access.
- Streaming video and audio.
- Writing to log files.
- Storing data for backup and restore, disaster recovery, and archiving.
- Storing data for analysis by an on-premises or Azure-hosted service.

## Types of resources

![Diagram showing the relationship between a storage account, containers, and blobs](https://learn.microsoft.com/en-us/azure/storage/blobs/media/storage-blobs-introduction/blob1.png)

### [Storage Account](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-overview)

```sh
az storage account create
    --name # valid DNS name, 3-24 chars
    --resource-group

    # Pricing tiers (<Type>_<Redundancy>)
    # Changing type: Copy to another account.
    # Changing redundancy: Instantly applied
    [--sku {Standard_GRS, Standard_GZRS, Standard_LRS, Standard_RAGRS, Standard_ZRS, Standard_RAGZRS, Premium_LRS, Premium_ZRS}]
    # Type 🧊:
    # - Standard: ⏺️⭐
    # - Premium: ⚡💲 (SSD). ⭐: using smaller objects
    # Redundancy:
    # - LRS: 🏷️, ❌: 🙋‍♂️.
    #   ⭐: your application can reconstruct lost data, requires regional replication (perhaps due to governance reasons), or uses Azure unmanaged disks.
    # - ZRS: Data write operations are confirmed successful once all the available zones have received the data. This even includes zones that are temporarily unavailable.
    #   ⭐: 🙋‍♂️, regional data replication, Azure Files workloads.
    # - GRS: LRS + async copy to a secondary region.
    # - GZRS: ZRS + async copy to a secondary region. 🦺
    # Read Access (RA): 🙋‍♂️ Allow read-only from `https://{accountName}-secondary.<url>`
    # Failover: manually initialized, swaps primary and secondary regions.
    # - C#: BlobClientOptions.GeoRedundantSecondaryUri (will not attempt again if 404).
    # - Alt: Copy data.
    # - ❌: Azure Files, BlockBlobStorage

    [--access-tier {Cool, Hot, Premium}] # Premium is inherited by SKU

    [--kind {BlobStorage, BlockBlobStorage, FileStorage, Storage, StorageV2}]
    # - BlobStorage: Simple blob-only scenarios.
    # - BlockBlobStorage: ⚡💎
    # - FileStorage: High-scale or high IOPS file shares. 💎
    # - Storage (General-purpose v1): Legacy. ⭐: classic deployment model or 🏋🏿 apps
    # - StorageV2: ⏺️⭐

    [--dns-endpoint-type {AzureDnsZone, Standard}] # Requires storage-preview extension
    # In one subscription, you can have accounts with both
    # - Standard: 250 accounts (500 with quota increase)
    # - AzureDnsZone: 5000 accounts
    # https://<storage-account>.z[00-50].<storage-service>.core.windows.net
    # Retrieve endpoints: GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Storage/storageAccounts/{accountName}?api-version=2022-09-01

    [--enable-hierarchical-namespace {false, true}]
    # Filesystem semantics. StorageV2 only. ❌ failover
```

Redundancy:

| LRS                                                                                                                   | ZRS                                                                                                                | GRS                                                                                                               | GZRS                                                                                                                    |
| --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| ![LRS](https://learn.microsoft.com/en-us/azure/storage/common/media/storage-redundancy/locally-redundant-storage.png) | ![ZRS](https://learn.microsoft.com/en-us/azure/storage/common/media/storage-redundancy/zone-redundant-storage.png) | ![GRS](https://learn.microsoft.com/en-us/azure/storage/common/media/storage-redundancy/geo-redundant-storage.png) | ![GZRS](https://learn.microsoft.com/en-us/azure/storage/common/media/storage-redundancy/geo-zone-redundant-storage.png) |

Pricing: ⏫ is not charged.

### Container

Organizes a set of blobs, similar to a directory in a file system. A storage account can include an unlimited number of containers, and a container can store an unlimited number of blobs.

```sh
az storage container create
    --name # Valid lowercase DNS name (3-63) with no double dashes
    [--resource-group]
    [--metadata]
    [--public-access {blob, container, off}]
```

### [Blob](https://learn.microsoft.com/en-us/rest/api/storageservices/understanding-block-blobs--append-blobs--and-page-blobs)

Each version of the blob has a unique tag, called an `ETag` that allows to only change a specific instance of the blob. Set type: `--type {block, append, page}`

- **Block blobs**: Store text and binary data in individual blocks, with a capacity of up to 190.7 TiB. `PUT <url>?comp=block&blockid=id`

- [**Append Blobs**](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blob-append): ⭐: append operations (ex: logging data from virtual machines). `PUT <url>?comp=appendblock`. `Add` permission is only applicable to this type of blob.

  ```cs
  AppendBlobClient appendBlobClient = containerClient.GetAppendBlobClient(logBlobName);
  // Read appendBlobClient.AppendBlobMaxAppendBlockBytes bytes of data
  await appendBlobClient.AppendBlockAsync(memoryStream);
  ```

- [**Page blobs**](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blob-pageblob-overview): Stores random access files up to 8 TiB. ⭐: VHD files, disks for Azure virtual machines, or databseses. `PUT <url>?comp=page`

  ![A diagram showing the two separate write options.](https://learn.microsoft.com/en-us/azure/storage/blobs/media/storage-blob-pageblob-overview/storage-blob-pageblob-overview-figure2.png)

  ```cs
  var pageBlobClient = blobContainerClient.GetPageBlobClient("0s4.vhd");
  pageBlobClient.Create(16 * 1024 * 1024 * 1024 /* 1GB */); // create an empty page blob of a specified size
  pageBlobClient.Resize(32 * 1024 * 1024 * 1024); // resize a page blob
  pageBlobClient.UploadPages(dataStream, startingOffset); // write pages to a page blob
  var pageBlob = pageBlobClient.Download(new HttpRange(bufferOffset, rangeSize)); // read pages from a page blob
  ```

## [Access tiers](https://learn.microsoft.com/en-us/azure/storage/blobs/access-tiers-overview)

```sh
# Account level
az storage account create --access-tier {Cool, Hot, Premium} # Premium is inherited by SKU

# Individual blob level
az storage blob set-tier
    --tier {Archive, Cool, Hot}

    [--rehydrate-priority {Standard, High}] # For archived objects < 10GB, 1-15 hours
    # Can be checked by `x-ms-rehydrate-priority` header.

    [--type {block, page}] # append is considered always "hot"
```

- Hot: Frequently accessed or modified data. ⚡💲
- Not-hot: Infrequently accessed or modified data (ex: short-term data backup and disaster recovery). Penalty for early removal of data. 🏷️
- Archive: Only for individual blob blocks. 🐌. _Offline_ (requires rehydration to be accessed, at least an hour). To access data, either [copy](https://learn.microsoft.com/en-us/azure/storage/blobs/archive-rehydrate-overview#copy-an-archived-blob-to-an-online-tier) or [change](https://learn.microsoft.com/en-us/azure/storage/blobs/archive-rehydrate-overview#change-a-blobs-access-tier-to-an-online-tier) data to online tier. Rehydration copy to a different account is supported if the other account is within the same region. Destination cannot be at archive tier. ❌: \*ZRS redundancy.
- Non-archive: _Online_ (can be accessed at any time). ❌: append blobs. ⚡

Min retention period (in days): 30 (Cool), 90 (Cold), Archive (180). To avoid penalty, choose a tier with less than required days.

Changing a blob's tier leaves its last modified time untouched. If a lifecycle policy is active, using **Set Blob Tier** to rehydrate may cause the blob to return to the archive tier if the last modified time exceeds the policy's threshold.

## [Lifecycle policies](https://learn.microsoft.com/en-us/azure/storage/blobs/lifecycle-management-overview)

`General Purpose v2` only.  
❌: `$logs` or `$web` containers

- Transition blobs to a cooler storage tier for 🏷️
- Delete blobs at the end of their lifecycles
- Define rules to be run once per day at the storage account level
- Apply rules to containers or a subset of blobs (using prefixes as filters)

```sh
az storage account management-policy create \
    #--account-name "<storage-account>" \
    #--resource-group $resourceGroup
    --policy @policy.json \
```

```ts
type RelesType = {
  rules: [
    {
      enabled: boolean;
      name: string;
      type: "Lifecycle";
      definition: {
        actions: {
          // NOTE: Delete is the only action available for all blob types; snapshots cannot auto set to hot
          version?: RuleAction;
          /* blobBlock */ baseBlob?: RuleAction;
          snapshopt?: Omit<RuleAction, "enableAutoTierToHotFromCool">;
          appendBlob?: { delete: ActionRunCondition }; // only one lifecycle policy
        };
        filters?: {
          blobTypes: Array<"appendBlob" | "blockBlob">;
          // A prefix string must start with a container name.
          // To match the container or blob name exactly, include the trailing forward slash ('/'), e.g., 'sample-container/' or 'sample-container/blob1/'
          // To match the container or blob name pattern (wildcard), omit the trailing forward slash, e.g., 'sample-container' or 'sample-container/blob1'
          prefixMatch?: string[];
          // Each rule can define up to 10 blob index tag conditions.
          // example, if you want to match all blobs with `Project = Contoso``: `{"name": "Project","op": "==","value": "Contoso"}``
          // https://learn.microsoft.com/en-us/azure/storage/blobs/storage-manage-find-blobs?tabs=azure-portal
          blobIndexMatch?: Record<string, string>;
        };
      };
    }
  ];
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

type ActionRunCondition = {
  daysAfterModificationGreaterThan: number;
  daysAfterCreationGreaterThan: number;
  daysAfterLastAccessTimeGreaterThan: number; // requires last access time tracking
};
```

It takes _up to 24 hours to go into effect_. Then it could take additional _up to 24 hours_ for some actions to run for the first time.

Data stored in a premium block blob storage account cannot be tiered to Hot, Cool, or Archive using Set Blob Tier or using Azure Blob Storage lifecycle management.

If you define more than one action on the same blob, lifecycle management applies the least 💲 action to the blob: `delete < tierToArchive < tierToCool`.

❌: partial updates

Access time tracking: when is enabled (`az storage account blob-service-properties update --enable-last-access-tracking true`), a lifecycle management policy can include an action based on the time that the blob was last accessed with a read (tracks only the first in the past 24 hours) or write operation. 💲

## Transient error handling (retry strategy)

```cs
var options = new BlobClientOptions();
options.Retry.MaxRetries = 10;
opions.Retry.Delay = TimeSpan.FromSeconds(20);
var client = new BlobClient(new Uri("..."), options);
```

## Data Protection

| Feature            | [Snapshots](https://learn.microsoft.com/en-us/azure/storage/blobs/snapshots-overview) | [Versioning](https://learn.microsoft.com/en-us/azure/storage/blobs/versioning-overview) |
| ------------------ | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Creation           | Manually                                                                              | Automatically (when enbled)                                                             |
| Immutability       | Read-only once created.                                                               | Previous versions are read-only.                                                        |
| URI                | DateTime value appended to base blob URI.                                             | Unique version ID for each version.                                                     |
| Flexibility        | More manual control, suitable for point-in-time backups.                              | Easier to manage, better for frequent changes.                                          |
| Tiers              | Not in Archive.                                                                       | All.                                                                                    |
| Deletion           | Must be deleted explicitly or with the base blob.                                     | Automatically managed; older versions can be deleted based on policies.                 |
| Soft Delete Impact | Soft-deleted along with the base blob; can be recovered during retention period.      | Current version becomes a previous version, and there's no longer a current version     |

```cs
BlobSnapshotInfo snapshotInfo = await blobClient.CreateSnapshotAsync();
// If you attempt to delete a blob that has snapshots, the operation will fail unless you explicitly specify that you also want to delete the snapshots
await blobClient.DeleteIfExistsAsync(DeleteSnapshotsOption.IncludeSnapshots);
```

## [Leasing](https://learn.microsoft.com/en-us/rest/api/storageservices/lease-blob)

Provides temporary exclusive write access to a Blob for a certain client with a lease key. Modifying the lease also requires that key (else `412 – Precondition failed` error)

```sh
leaseId=$(az storage blob lease acquire --lease-duration 60 --output tsv ...)
az storage blob lease {renew, change, release, break}
```

```cs
// Acquire a lease on the blob
string proposedLeaseId = Guid.NewGuid().ToString();
var leaseClient = blobClient.GetBlobLeaseClient(proposedLeaseId);
var lease = leaseClient.Acquire(TimeSpan.FromSeconds(15));
// leaseClient.Renew();
// leaseClient.Change(newLeaseId); // change the ID of an existing lease
// leaseClient.Release();
// leaseClient.Break(); // end the lease, but ensure that another client can't acquire a new lease until the current lease period has expired

// proposedLeaseId can now be passed as option in order to work with the blob
BlobUploadOptions uploadOptions = new BlobUploadOptions { Conditions = new BlobRequestConditions { LeaseId = proposedLeaseId } };
using (var stream = new MemoryStream(Encoding.UTF8.GetBytes("New content")));
await blobClient.UploadAsync(stream, uploadOptions);

BlobRequestConditions conditions = new BlobRequestConditions { LeaseId = proposedLeaseId };
await blobClient.SetMetadataAsync(newMetadata, conditions);
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

# Working with leased blob
PUT https://myaccount.blob.core.windows.net/mycontainer/myblob?comp=metadata

Request Headers:
x-ms-meta-name:string-value
x-ms-lease-id:[lease_id]
```

## Encryption

Data in Azure Storage is encrypted and decrypted transparently using 256-bit AES encryption (similar to BitLocker). Enforced for all tiers. Object metadata is also encrypted.

- **Microsoft Keys**: 🙂 All operations handled by Azure, supporting all services. Keys are stored by Microsoft, who also handles rotation and access.
- **Customer-Managed Keys**: Handled by Azure but you have more control. Supports some services, stored in Azure Key Vault. You handle key rotation and both you and Microsoft can access.
  ![Diagram showing how customer-managed keys work in Azure Storage ](https://learn.microsoft.com/en-us/azure/storage/common/media/customer-managed-keys-overview/encryption-customer-managed-keys-diagram.png)
- **Customer-Provided Keys**: Even more control, mainly for Blob storage. Can be stored in Azure or elsewhere, and you're responsible for key rotation. Only you can access.

### [Storage Account encryption](https://learn.microsoft.com/en-us/azure/storage/common/storage-service-encryption)

```sh
az storage account <create/update>
    [--encryption-key-source {Microsoft.Keyvault, Microsoft.Storage}]
    [--encryption-services {blob, file, queue, table}] # queue / table with customer-managed keys = 💲
    [--encryption-key-type-for-queue {Account, Service}]
    [--encryption-key-type-for-table {Account, Service}]
    # When using Microsoft.Keyvault:
    #   [--encryption-key-name]
    #   [--encryption-key-vault] # URL
    #   [--encryption-key-version]

    # 🧊 Optionally encrypt infrastructure with separate Microsoft managed key. StorageV2 or BlockBlobStorage only.
    [--require-infrastructure-encryption {false, true}] # false
```

### [Container / Blob encryption (Encryption Scope)](https://learn.microsoft.com/en-us/azure/storage/blobs/encryption-scope-overview)

```sh
az storage account encryption-scope create
    --account-name
    --name "<scope-name>"
    [--key-source {Microsoft.KeyVault, Microsoft.Storage}] # Same rules like encryption at account level
    [--key-uri] # For KeyVault
    [--require-infrastructure-encryption {false, true}] # Inherited from storage account level, if set

# Optional
az storage container create
    --default-encryption-scope "<scope-name>"
    --prevent-encryption-scope-override true # force all blobs in a container to use the container's default scope

az storage <type> <operation>
    --encryption-scope "<scope-name>" # if not set, inherited from container or storage account
    # EncryptionScope property for BlobOptions in C#
```

Encryption makes Access tier 🧊.

Using disabled encryption scope will result in `403 Forbidden`.

### Client Side Encryption

```cs
// Your key and key resolver instances, either through Azure Key Vault SDK or an external implementation.
IKeyEncryptionKey key;
IKeyEncryptionKeyResolver keyResolver;

// Create the encryption options to be used for upload and download.
var encryptionOptions = new ClientSideEncryptionOptions(ClientSideEncryptionVersion.V2_0)
{
    KeyEncryptionKey = key,
    KeyResolver = keyResolver,
    // String value that the client library will use when calling IKeyEncryptionKey.WrapKey()
    KeyWrapAlgorithm = "some algorithm name"
};

// Set the encryption options on the client options.
var options = new SpecializedBlobClientOptions() { ClientSideEncryption = encryptionOptions };
// pass options to BlobServiceClient instance
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
// Fetch some container properties and write out their values.
var properties = await container.GetPropertiesAsync();
Console.WriteLine($"Properties for container {container.Uri}");
Console.WriteLine($"Public access level: {properties.Value.PublicAccess}");
Console.WriteLine($"Last modified time in UTC: {properties.Value.LastModified}");

var metadata = new Dictionary<string, string>() { { "docType", "textDocuments" }, { "category", "guidance" } };
var containerInfo = await container.SetMetadataAsync(metadata); // ETag, LastModified
```

### [Set and retrieve properties and metadata for blob resources by using REST](https://learn.microsoft.com/en-us/rest/api/storageservices/setting-and-retrieving-properties-and-metadata-for-blob-resources)

Endpoint templates:

- Container: `https://<storage-account>.blob.core.windows.net/<container>?restype=container`
- Blob: `https://<storage-account>.blob.core.windows.net/<container>/<blob>?comp=metadata`

Retrieving metadata: `GET` or `HEAD` (example: `GET https://<storage-account>.blob.core.windows.net/<container>/<blob>?comp=metadata`)  
Setting metadata: `PUT` (example: `PUT https://myaccount.blob.core.windows.net/mycontainer?comp=metadata?restype=container`)

The format for the header is: `x-ms-meta-name:string-value`.

If two or more metadata headers with the same name are submitted for a resource, the Blob service returns status code `400 (Bad Request)`.

The total size of all metadata pairs can be up to 8KB in size.

Partial updates are not supported: setting metadata on a resource overwrites any existing metadata values for that resource.

### Standard Properties for Containers and Blobs

`ETag` and `Last-Modified` are common for containers and blobs.

For HTTP names start with `x-ms-meta`.

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

### Access conditions

```cs
BlobProperties properties = await blobClient.GetPropertiesAsync();

BlobRequestConditions conditions = new BlobRequestConditions
{
    IfMatch = properties.Value.ETag, // Limit requests to resources that have not be modified since they were last fetched.
    IfModifiedSince = DateTimeOffset.UtcNow.AddHours(-1), // Limit requests to resources modified since this time.
    IfNoneMatch = new Azure.ETag("some-etag-value"), // Limit requests to resources that do not match the ETag.
    IfUnmodifiedSince = DateTimeOffset.UtcNow.AddHours(-2), // Limit requests to resources that have remained unmodified.
    LeaseId = "some-lease-id", // Limit requests to resources with an active lease matching this Id.
    TagConditions = "tagKey = 'tagValue'" // Optional SQL statement to apply to the Tags of the Blob.
};

BlobUploadOptions options = new BlobUploadOptions
{
    Metadata = new Dictionary<string, string> { { "key", "value" } },
    Conditions = conditions
};

// Upload blob only if mathcing conditions
await blobClient.UploadAsync(BinaryData.FromString("data"), options);
```

```sh
az storage blob <operation>
    # ETag value, or the wildcard character (*)
    [--if-match]
    [--if-none-match]

    [--if-modified-since]
    [--if-unmodified-since]

    # SQL clause to check tags
    [--tags-condition]
```

## [Authorization](https://learn.microsoft.com/en-us/azure/storage/common/authorize-data-access)

- [Shared Key (storage account key)](https://learn.microsoft.com/en-us/rest/api/storageservices/authorize-with-shared-key) (`StorageSharedKeyCredential`): A secret password that gives full access to your Azure Storage account. ⭐: programmatic access (ex: data migration)
- [Microsoft Entra ID](https://learn.microsoft.com/en-us/azure/storage/blobs/authorize-access-azure-active-directory) (`DefaultAzureCredential`): Identity-based, role-based authorization with advanced security. ⭐: fine-grained enterprise access control.
- App credentials (`ClientSecretCredential`): App needs to be registered first.

### [Use OAuth access tokens for authentication](https://learn.microsoft.com/en-us/rest/api/storageservices/authorize-with-azure-active-directory#use-oauth-access-tokens-for-authentication)

- **Delegation Scope**: Use `user_impersonation` to allow applications to perform actions permitted by the user.
- **Resource ID**: Use `https://storage.azure.com/` to request tokens.

### [Manage access rights with RBAC](https://learn.microsoft.com/en-us/rest/api/storageservices/authorize-with-azure-active-directory#manage-access-rights-with-rbac)

In addition to `Storage Blob Data [Standard Role]` there also is `Storage Blob Delegator` for getting user delegation key.

Permissions for Blob service operations: `Microsoft.Storage/storageAccounts/blobServices/<op>` for top level operations, sub `containers/<op>` and `containers/blobs/<op>` for fine grained control. `<op>` can be `read`, `write`, `delete`, `filter/action` (find blobs, blob level only).

### [Anonymous public read access](https://learn.microsoft.com/en-us/azure/storage/blobs/anonymous-read-access-prevent?tabs=azure-cli)

Anonymous public access to your data is always prohibited by default. If the storage account doesn't allow public access, then no container within it can have public access, regardless of its own settings. If public access is allowed at the storage account level, then a container's access depends on its own settings (**Public access: Container**, or **Public access: Blob**).

## Working with blobs

### AZ CLI

```sh
az storage blob <command>
    # Authenticate:
    ## By Storage Account Key
    --account-key # az storage account keys list -g $resourcegroup -n $accountname --query '[0].value' -o tsv
    ## By Entra ID Login
    --auth-mode login # Use credentials from az login
    ## By Connection String
    --connection-string
    ## By SAS token
    --sas-token

    # Select target blob
    ## By name
    [--blob-endpoint] # https://<storage-account>.blob.core.windows.net
    [--account-name] # When using storage account key or a SAS token
    --container-name
    --name # Case sensitive, cannot end with dot (.) or dash (-)
    ## By URL
    --blob-url "https://<storage-account>.blob.core.windows.net/<container>/<blob>?<SAS>" # Use <SAS> only if unauthenticated.

    # <command>
    ## upload
    --file "/path/to/file" # for file uploads
    --data "some data" # for text uploads
    ## copy start-batch
    ## use -source-<prop> and --destination-<prop>

# Example
az storage blob upload --file /path/to/file --container mycontainer --name MyBlob
az storage container list --account-name $storageaccountname # get containers
```

### [C#](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-quickstart-blobs-dotnet)

```cs
// Authorization
//// Storage Account Key
TokenCredential credential = new StorageSharedKeyCredential(accountName, "<account-key>");
//// Entra ID Login
TokenCredential credential = new DefaultAzureCredential();
//// App registration
TokenCredential credential = new ClientSecretCredential("<tenant-id>", "<client-id>", "<client-secret>");

// Select account
var blobServiceClient = new BlobServiceClient(new Uri($"https://${accountName}.blob.core.windows.net"), credential);

// Enumerate containers
await foreach (BlobContainerItem container in blobServiceClient.GetBlobContainersAsync()) {}

// Get container
// Note: BlobContainerClient allows you to manipulate both Azure Storage containers and their blobs
BlobContainerClient containerClient = blobServiceClient.GetBlobContainerClient(containerName);
// BlobContainerClient containerClient = await blobServiceClient.CreateBlobContainerAsync(containerName);
// BlobContainerClient containerClient = new BlobContainerClient(new Uri($"https://{accountName}.blob.core.windows.net/{containerName}"), credential, clientOptions);

BlobClient blobClient = containerClient.GetBlobClient(fileName);
// Getting a blob reference does not make any calls to Azure Storage, it simply creates an object locally that can work with a stored blob.

await blobClient.UploadAsync(localFilePath, true);

// List all blobs in the container
await foreach (var blobItem in containerClient.GetBlobsAsync()) {}

// Download the blob's contents and save it to a file
await blobClient.DownloadToAsync(downloadFilePath);
// Alternative version:
BlobDownloadInfo download = await blobClient.DownloadAsync();
using (FileStream downloadFileStream = File.OpenWrite(downloadFilePath));
await download.Content.CopyToAsync(downloadFileStream);

// Copy from one container to another, without downloading locally
BlobContainerClient sourceContainer = blobServiceClient.GetBlobContainerClient("sourcecontainer");
BlobClient sourceBlob = sourceContainer.GetBlobClient("sourceblob.txt");
BlobContainerClient targetContainer = blobServiceClient.GetBlobContainerClient("targetcontainer");
BlobClient targetBlob = targetContainer.GetBlobClient("targetblob.txt");
await targetBlob.StartCopyFromUriAsync(sourceBlob.Uri);
```

### HTTP

`PUT`: upload file, create container.

Headers:

- Optional: `x-ms-date`, `x-ms-version`
- `Authorization`:
  - Storage Account Key: `[Storage_Account_Key]`
  - Shared key: `SharedKey [your_account]:[signature]`
  - Entra ID: `Bearer [access_token]`

SAS GET param may be used instead of `Authorization` header.

```http
GET https://<account>.blob.core.windows.net/?comp=list # list containers
PUT https://<account>.blob.core.windows.net/<container>?restype=container # create container
GET https://<account>.blob.core.windows.net/<container>?restype=container&comp=list # list blobs in container
PUT https://<account>.blob.core.windows.net/<container>/<blob> # upload file
GET https://<account>.blob.core.windows.net/<container>/<blob> # download file
```

### [Object replication](https://learn.microsoft.com/en-us/azure/storage/blobs/object-replication-overview)

Asynchronously copies block blobs from a source to a destination account. To use this feature, you'll need to enable **Change Feed** and **Blob Versioning**, and it's compatible only with **general-purpose v2** and **premium block blob accounts**. However, it doesn't support append blobs, page blobs, or custom encryption keys.

The process involves 2 main steps:

1. Creating a replication policy.
1. Setting rules to specify which blobs to replicate.

### [AzCopy](https://learn.microsoft.com/en-us/azure/storage/common/storage-use-azcopy-v10)

```sh
# Move local data to blob storage
azcopy copy "C:\local\path" "https://<storage-account>.blob.core.windows.net/<container>/<sas-token>" --recursive=true

# Syncronize (avoid copying existing files again, when running multiple times)
azcopy sync \
  "https://<source-storage-account>.blob.core.windows.net/<container>/<sas-token>" \
  "https://<destination-storage-account>.blob.core.windows.net/<container>/<sas-token>" \
  --recursive=true
```

Destination needs `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/add/action` permission when adding new lob to the destination.  
If copying existing blob, source needs `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read` permission.

You can also use [AZ CLI](https://learn.microsoft.com/en-us/cli/azure/storage/blob/copy?view=azure-cli-latest), [Powershell](https://learn.microsoft.com/en-us/powershell/module/az.storage/start-azstorageblobcopy?view=azps-10.2.0&viewFallbackFrom=azps-4.6.0), or [SDK](https://learn.microsoft.com/en-us/dotnet/api/microsoft.azure.storage.blob.cloudblockblob.startcopyasync?view=azure-dotnet).

When copying, for destination you need SAS or OAuth authentication (Azure Files only supports SAS).

## [Static website hosting](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blob-static-website)

Static website can be enabled/disbled from Azure Portal (`storage account > Static Website`) or CLI (`az storage blob service-properties update --account-name <storage-account> --static-website {true|false}`). This creates a container called `$web`. During deployment/maintenance, it should be disabled to prevent broken site for users (changing container/account access won't have any effect on `web` endpoint, only to `blob` endpoint).

Default pages: `_index.html` and `_404.html`.

Endpoint: `https://<storage-account>.web.core.windows.net/`

![Screenshot showing the locations of the fields to enable and configure static website hosting.](https://learn.microsoft.com/en-us/training/wwl-azure/explore-azure-blob-storage/media/enable-static-website-hosting.png)

Lifecycle management doesn't affect system containers such as the `$logs` or `$web` containers.

### Limitations

- If you want to configure headers, or use custom HTTPS domain, Azure Content Delivery Network (Azure CDN) is required.
- AuthN and AuthZ are not supported.
- CORS is not supported with static website.

Use [Azure Static Web Apps](https://azure.microsoft.com/services/app-service/static/) if you need these (plus CI/CD)

### [Mapping a custom domain to a static website URL](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-custom-domain-name?tabs=azure-portal)

NOTE: You need to add `index.html` and `error.html` to the `$web` container first

### HTTP Only

- Get the host name of your storage endpoint: Copy value of `Settings > Endpoints > Static website` (**without** `https://`)
- Create a CNAME record
- Register your custom domain with Azure via either:
  - `az storage account update --custom-domain <custom-domain-name> --use-subdomain false ...`
  - Add the custom domain under networking in the Azure Storage account (`storage account > Networking >  Custom domain > Domain name`).

### HTTPS (and/or headers)

- Integrate the static website with Azure Content Delivery Network (CDN)

## [Network Access Rules](https://learn.microsoft.com/en-us/azure/storage/common/storage-network-security?tabs=azure-portal)

By default, Azure Storage Accounts accept connections from clients on any network.

Steps to Change the Default Network Access Rule:

- Disable All Public Network Access
- Enable Access from Selected Networks
- Apply Network Rules
