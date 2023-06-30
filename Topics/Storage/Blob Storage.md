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

```ps
# az group create --name myresourcegroup --location westus
az storage account create --name mystorageaccount --resource-group myresourcegroup --location westus --sku Standard_LRS
az storage container create --name mycontainer --account-name mystorageaccount
az storage blob upload --account-name mystorageaccount --container-name mycontainer --name myblob --type block --file ./local/path/to/file
```

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
  To access data, either [copy](https://learn.microsoft.com/en-us/azure/storage/blobs/archive-rehydrate-overview#copy-an-archived-blob-to-an-online-tier) or [change](https://learn.microsoft.com/en-us/azure/storage/blobs/archive-rehydrate-overview#change-a-blobs-access-tier-to-an-online-tier) data to online tier. Rehydration copy to a different account is supported if the other account is within the same region. Rehydration can take up to 15 hours (Standard), or up to 1 hour (High). Can be changed any time. Can be checked by `x-ms-rehydrate-priority` header.

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
var blobContainerClient = blobServiceClient.GetBlobContainerClient(Constants.containerName);
var pageBlobClient = blobContainerClient.GetPageBlobClient("0s4.vhd");
pageBlobClient.Create(16 * 1024 * 1024 * 1024 /* 1GB */);

// Resizing a page blob
pageBlobClient.Resize(32 * 1024 * 1024 * 1024);

// Writing pages to a page blob
pageBlobClient.UploadPages(dataStream, startingOffset);

// Reading pages from a page blob
var pageBlob = pageBlobClient.Download(new HttpRange(bufferOffset, rangeSize));
```

## [Setting and retrieving properties and metadata](https://learn.microsoft.com/en-us/rest/api/storageservices/setting-and-retrieving-properties-and-metadata-for-blob-resources)

TODO

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

TODO

## [Static website hosting](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blob-static-website)

Static website can be enabled/disbled from Azure Portal (`storage account > Static Website`) or CLI (`az storage blob service-properties update --account-name <storage-account> --static-website {true|false}`). This creates a container called `$web`. During deployment/maintenance, it should be disabled to prevent broken site for users.

![Screenshot showing the locations of the fields to enable and configure static website hosting.](https://learn.microsoft.com/en-us/training/wwl-azure/explore-azure-blob-storage/media/enable-static-website-hosting.png)

TODO

### Disabling access to static website

## Blob operations

```ps
# Copy blob (example: archive tier to online tier)
az storage blob copy start \
    --source-container "<source-container>" \
    --source-blob "<source-blob>" \
    # For a different storage account or RA-GRS (with "-secondary"), use this instead:
    # --source-uri $srcBlobUri \

    --destination-container "<dest-container>" \
    --destination-blob "<dest-blob>" \
    --account-name "<storage-account>" \
    --tier hot \
    --rehydrate-priority Standard \
    --auth-mode login
```

```ps
# Change blob access tier
az storage blob set-tier \
    --account-name "<storage-account>" \
    --container-name "<container>" \
    --name "<archived-blob>" \
    --tier Hot \
    --rehydrate-priority Standard \
    --auth-mode login
```

```ps
# Update the rehydration priority for a blob.
az storage blob set-tier \
    --account-name "<storage-account>" \
    --container-name "<container>" \
    --name "<blob>" \
    --rehydrate-priority High \
    --auth-mode login
```

```ps
# Set the default access tier for a storage account
az storage account update \
    --resource-group "<resource-group>" \
    --name "<storage-account>" \
    --access-tier Cool
```

```ps
# Set a blob's tier on upload
az storage blob upload \
    --account-name "<storage-account>" \
    --container-name "<container>" \
    --name "<blob>" \
    --file "<file>" \
    --tier "<tier>" \
    --auth-mode login
```

[AzCopy](https://learn.microsoft.com/en-us/azure/storage/common/storage-use-azcopy-v10):

```ps
# Move data to blob storage
azcopy copy "C:\local\path" "https://<storage-account>.blob.core.windows.net/<container>/<sas-token>" --recursive=true
```

[Working with blobs](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-quickstart-blobs-dotnet)

```cs
var blobServiceClient = new BlobServiceClient(
        new Uri("https://<storage-account-name>.blob.core.windows.net"),
        new DefaultAzureCredential());

// Create the container and return a container client object
var containerClient = await blobServiceClient.CreateBlobContainerAsync("quickstartblobs" + Guid.NewGuid().ToString());

var blobClient = containerClient.GetBlobClient(fileName);

await blobClient.UploadAsync(localFilePath, true);

// List all blobs in the container
await foreach (var blobItem in containerClient.GetBlobsAsync()) {}

// Download the blob's contents and save it to a file
await blobClient.DownloadToAsync(downloadFilePath);
```

## [Custom Domains Name](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-custom-domain-name)

TODO

## [Remediate anonymous public read access](https://learn.microsoft.com/en-us/azure/storage/blobs/anonymous-read-access-prevent?tabs=azure-cli)

TODO
