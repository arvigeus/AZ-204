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

![Diagram showing the relationship between a storage account, containers, and blobs](https://learn.microsoft.com/en-us/azure/storage/blobs/media/storage-blobs-introduction/blob1.png)  
Endpoint: `https://<storage-account>.blob.core.windows.net/<container>/<blob>`  
`<container>` and `<blob>` are organized akin to filesystem. Container names are 3-63 chars and must start with a letter or number, and can contain only lowercase letters, numbers, and the dash (-) character (no double dash allowed). Blob names are case sensitive and cannot end with dash or dot.

Each version of the blob has a unique tag, called an `ETag` that allows to only change a specific instance of the blob.

[Understanding block blobs, append blobs, and page blobs](https://learn.microsoft.com/en-us/rest/api/storageservices/understanding-block-blobs--append-blobs--and-page-blobs)

## Blob Blocks

### [Access tiers](https://learn.microsoft.com/en-us/azure/storage/blobs/access-tiers-overview)

- Hot tier - Frequently accessed or modified data. Highest storage costs.

- Cool tier - Infrequently accessed or modified data. Minimum for 30 days.

- Cold tier - same as cool tier, but for 90 days.

- Archive tier - Rarely accessed, flexible (very high) latency (in matter of hours) data. Minimum for 180 days.  
  Does not support \*ZRS redundancy.  
  To access data, either [copy](https://learn.microsoft.com/en-us/azure/storage/blobs/archive-rehydrate-overview#copy-an-archived-blob-to-an-online-tier) or [change](https://learn.microsoft.com/en-us/azure/storage/blobs/archive-rehydrate-overview#change-a-blobs-access-tier-to-an-online-tier) data to online tier. Rehydration copy to a different account is supported if the other account is within the same region. Rehydration can take up to 15 hours (Standard), or up to 1 hour (High). Can be changed any time. Can be checked by `x-ms-rehydrate-priority` header,

Non-hot is perfect for short-term data backup and disaster recovery. There is a penalty for removing data, or moving it to different tier, earlier (copying is fine though). Access tiers are available for block blobs only (other types of blobs are considered "Hot").

## Append Blobs

Example: for log files

## [Page blobs](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blob-pageblob-overview)

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
