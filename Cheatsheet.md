# Cheatsheet

## Azure Storage

### [Azure Storage Account](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-overview)

TODO

#### Working with Storage Account

[Create](https://learn.microsoft.com/en-us/cli/azure/storage/account?view=azure-cli-latest#az-storage-account-create):

```ps
# az group create --name $resourceGroup --location $location
az storage account create
    --name
    --resource-group # `az configure --defaults $resourceGroup`
    [--location] # `az account list-locations` or `az configure --defaults location=$location`
    [--access-tier {Cool, Hot, Premium}] # Premium
    [--kind {BlobStorage, BlockBlobStorage, FileStorage, Storage, StorageV2}] # StorageV2
    [--sku {Premium_LRS, Premium_ZRS, Standard_GRS, Standard_GZRS, Standard_LRS, Standard_RAGRS, Standard_RAGZRS, Standard_ZRS}] # Standard_RAGRS
    [--default-action {Allow, Deny}]
    [--https-only {false, true}]
    [--tags]
    [--vnet-name]
    ...
```

[Update](https://learn.microsoft.com/en-us/cli/azure/storage/account?view=azure-cli-latest#az-storage-account-update):

```ps
az storage account update
    --name
    [--resource-group] `az account list-locations` or `az configure --defaults location=$location` or attempt to resolve the resource group by storage account name (only if globally unique)
    ...
```

### [Azure Storage Redundancy](https://learn.microsoft.com/en-us/azure/storage/common/storage-redundancy)

Azure Storage employs redundancy to protect data from both planned and unplanned events, hence ensuring data durability and availability. It's worth noting that all storage services in a single account share the same redundancy setting. For varying redundancy requirements, it's advisable to use separate accounts.

#### Redundancy Options

- **Locally Redundant Storage (LRS)**: Data is replicated thrice within a single physical location in the primary region. This is the least costly option and is not designed for high-availability applications. Choose LRS if your _application can reconstruct lost data_, _requires regional replication_ (perhaps due to governance reasons), or uses _Azure unmanaged disks_.
- **Zone-Redundant Storage (ZRS)**: Data is replicated across three Azure availability zones in the primary region. Data write operations are confirmed successful once all the available zones have received the data. This even includes zones that are temporarily unavailable. ZRS is suitable for _high-availability applications_, _regional data replication_, and _Azure Files_ workloads. Additionally, it's supported for all Azure Storage services in standard general-purpose v2 accounts, premium block blobs accounts, and premium file shares (Azure Files) through the FileStorage account.
- **Geo-Redundant Storage (GRS)**: Combines LRS with asynchronous copying to a secondary region, maintaining six copies of the data: three in the primary region and three in the secondary region.
- **Geo-Zone-Redundant Storage (GZRS)**: Combines ZRS with asynchronous copying to a secondary region, maintaining six copies of the data: three across separate availability zones in the primary region and three locally redundant copies in the secondary region. This option is only available for _standard general-purpose v2 accounts_ (including _RA-GZRS_).

The key difference between GRS and GZRS lies in their primary region replication methods (LRS vs ZRS). However, both use LRS in the secondary region. Due to the asynchronous nature of replication, the secondary region might lag in reflecting write operations.

| LRS                                                                                                                   | ZRS                                                                                                                | GRS                                                                                                               | GZRS                                                                                                                    |
| --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| ![LRS](https://learn.microsoft.com/en-us/azure/storage/common/media/storage-redundancy/locally-redundant-storage.png) | ![ZRS](https://learn.microsoft.com/en-us/azure/storage/common/media/storage-redundancy/zone-redundant-storage.png) | ![GRS](https://learn.microsoft.com/en-us/azure/storage/common/media/storage-redundancy/geo-redundant-storage.png) | ![GZRS](https://learn.microsoft.com/en-us/azure/storage/common/media/storage-redundancy/geo-zone-redundant-storage.png) |

#### Read Access to Secondary Region

Users or applications cannot directly access data in the secondary region unless a failover occurs. **Read-Access Geo-Redundant Storage (RA-GRS)** and **Read-Access Geo-Zone-Redundant Storage (RA-GZRS)** provide a higher level of availability by allowing read operations from the replicated data in the secondary region (`https://{accountName}-secondary.<url>`). This can be particularly useful in scenarios where your application needs to continue to read data, even if the primary region experiences an outage. Note, however, that you can only write data to the primary region, and also that _Azure Files are not supported_.

[Example](https://learn.microsoft.com/en-us/azure/storage/common/geo-redundant-design):

```cs
var accountName = "<YOURSTORAGEACCOUNTNAME>";
var primaryAccountUri = new Uri($"https://{accountName}.blob.core.windows.net/");
var secondaryAccountUri = new Uri($"https://{accountName}-secondary.blob.core.windows.net/");

var blobClientOptions = new BlobClientOptions()
{
    // Determines the policy for how the client should retry its requests upon encountering transient errors
    Retry = { /* ... */ },

    // If the secondary Uri response is 404, it won't be used again, indicating possible propagation delay.
    // Otherwise, retries alternate between primary and secondary Uri.
    GeoRedundantSecondaryUri = secondaryAccountUri
};

var blobServiceClient = new BlobServiceClient(primaryAccountUri, new DefaultAzureCredential(), blobClientOptions);
```

#### [Failover Procedure](https://learn.microsoft.com/en-us/azure/storage/common/storage-disaster-recovery-guidance#how-an-account-failover-works)

In case the primary region becomes unavailable, a failover to the secondary region can be manually initiated. During this process, data becomes temporarily inaccessible as Azure Storage updates the DNS entry, transforming the secondary endpoint into the new primary one, and vice versa. This might involve some data loss due to asynchronous copying between regions. Failback can be used to restore the region states.

Note that _Azure virtual machines (VMs) need to be replicated_, _archived blobs need to be rehydrated to an online tier_ (Archive tier is not available for any \*ZRS), and _Azure Storage resource provider cannot fail over_, so operations must still take place in the former primary region.

To prepare for an account failover with unmanaged disks, shut down the VM, delete it while retaining the VHD files, and wait for Last Sync Time to update.

Note: Copying data is an alternative to failover: `azcopy copy "C:\local\path" "https://account.blob.core.windows.net/mycontainer1/..." --recursive=true`

It's crucial to remember that certain features and services, such as _Azure File Sync_, Storage accounts with _hierarchical namespace enabled_, Storage account containing _premium block blobs_, and Storage account containing any _WORM immutability policy_, do not support failover.

##### [Initiate the failover](https://learn.microsoft.com/en-us/azure/storage/common/storage-initiate-account-failover)

[CLI](https://learn.microsoft.com/en-us/cli/azure/storage/account?view=azure-cli-latest#az-storage-account-failover): `az storage account failover --name accountName`

Portal: `storage account > Settings > Geo-replication > Prepare for failover`

#### [Change the redundancy option for a storage account](https://learn.microsoft.com/en-us/azure/storage/common/redundancy-migration?tabs=portal)

Redundancy options can be changed without any data loss or application downtime.

[CLI](https://learn.microsoft.com/en-us/cli/azure/storage/account?view=azure-cli-latest#az-storage-account-update):

```ps
az storage account update \
    --name "<storage-account>"
    --resource-group "<resource_group>" \
    --sku "<sku>" # {Premium_LRS, Premium_ZRS, Standard_GRS, Standard_GZRS, Standard_LRS, Standard_RAGRS, Standard_RAGZRS, Standard_ZRS}
```

Portal: `storage account > Data management > Redundancy`

#### Supported Azure Storage Services

Different redundancy options are supported by various Azure Storage services, including Blob storage, Queue storage, Table storage, Azure Files (which do not support RA-GRS, RA-GZRS, or failover), and Azure managed disks.
