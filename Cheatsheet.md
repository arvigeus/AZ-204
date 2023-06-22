# Cheatsheet

## Azure Storage

### Azure Storage Redundancy

#### Purpose

Azure Storage uses redundancy to protect data from planned and unplanned events, ensuring availability and durability.

All storage services within a single account share the same redundancy setting. For different redundancy needs, consider using separate accounts.

#### Redundancy Options

- **Locally Redundant Storage (LRS)**: Data is copied three times within a single physical location in the primary region. Least expensive but not for high availability applications. Opt for LRS if your _app can rebuild lost data_, _needs regional replication_ due to (country) governance, or uses _Azure unmanaged disks_.
- **Zone-Redundant Storage (ZRS)**: Data is copied across three Azure availability zones in the primary region. Write is successful after data is written to all available zones, waiting for temporarily unavailable zones. Ideal for _high availability_ apps, _regional data replication_ for country governance, or _Azure Files_ workloads. ZRS is supported for _all Azure Storage services_ in standard general-purpose v2 accounts, _premium block blobs accounts_, and _premium file shares (Azure Files)_ through the FileStorage account.
- **Geo-Redundant Storage (GRS)**: Combines LRS with asynchronous copying to a secondary region. 6 copies in total: 3 in the primary region and 3 in the secondary region.
- **Geo-Zone-Redundant Storage (GZRS)**: Combines ZRS with asynchronous copying to a secondary region. 6 copies in total: 3 across separate availability zones in the primary region and 3 locally redundant copies in the secondary region. Only for _standard general-purpose v2 accounts_ (including _RA-GZRS_).

The main difference between **GRS** and **GZRS** is the primary region replication method (LRS vs ZRS). In the secondary region they both use LRS.

Due to asynchronous replication, the secondary region might lag behind in terms of write operations.

#### Read Access to Secondary Region

Data in the secondary region is not directly accessible to users or applications, unless a failover occurs. For high availability, use Read-Access Geo-Redundant Storage (RA-GRS) or Read-Access Geo-Zone-Redundant Storage (RA-GZRS).

Note: _Azure Files_ is not supported.

Example:

```cs
var accountName = "<YOURSTORAGEACCOUNTNAME>";
var primaryAccountUri = new Uri($"https://{accountName}.blob.core.windows.net/");
var secondaryAccountUri = new Uri($"https://{accountName}-secondary.blob.core.windows.net/");

var blobClientOptions = new BlobClientOptions()
{
    Retry = { /* ... */ },

    // If the secondary Uri response is 404, it won't be used again, indicating possible propagation delay.
    // Otherwise, retries alternate between primary and secondary Uri.
    GeoRedundantSecondaryUri = secondaryAccountUri
};

var blobServiceClient = new BlobServiceClient(primaryAccountUri, new DefaultAzureCredential(), blobClientOptions);
```

#### Failover

In case of primary region unavailability, _manually_ initiate a failover to the secondary region. Data is temporarily inaccessible as Azure Storage updates the DNS entry, making the secondary endpoint the new primary, and vice versa. This usually involves some data loss (because async copy). Use failback to restore region states.

Note: Copying data is an alternative to failover: `azcopy copy "C:\local\path" "https://account.blob.core.windows.net/mycontainer1/..." --recursive=true`

- Azure virtual machines (VMs) needs to be replicated
- Archived blobs need to be rehydrated to an online tier (Note: Archive tier not available for any _\*ZRS_!)
- Azure Storage resource provider cannot fail over, so operations must still take place in the former primary region

##### Initiate the failover

CLI: `az storage account failover --name accountName`

Portal: `storage account > Settings > Geo-replication > Prepare for failover`

Unsupported features and services:

- `Azure File Sync`
- Storage accounts with hierarchical namespace enabled
- Storage account containing premium block blobs
- Storage account containing any WORM immutability policy

#### Supported Azure Storage Services

Different redundancy options are supported by each Azure Storage service including Blob storage, Queue storage, Table storage, Azure Files (does not support RA-GRS, RA-GZRS, or failover), and Azure managed disks.

#### Change the redundancy option for a storage account

During a conversion, there is no data loss or application downtime required.

CLI:

```ps
az storage account update \
    --name <storage-account>
    --resource-group <resource_group> \
    --sku <sku> # {Premium_LRS, Premium_ZRS, Standard_GRS, Standard_GZRS, Standard_LRS, Standard_RAGRS, Standard_RAGZRS, Standard_ZRS}
```

Portal: `storage account > Data management > Redundancy`
