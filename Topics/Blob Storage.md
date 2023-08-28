# [Azure Blob Storage](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blobs-introduction)

Endpoint: `https://<storage-account>.blob.core.windows.net/<container>/<blob>`

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

## [Azure Storage Account](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-overview)

Azure Storage Account is a unique namespace in Azure for your data objects, including blobs, files, queues, and tables. It's accessible from anywhere in the world over HTTP or HTTPS.

Recommended: `General-purpose v2`.

### Types of Storage Accounts

1. **Standard general-purpose v2**: Recommended for most scenarios using Azure Storage, except for network file system (NFS) in Azure Files. It supports all redundancy options.

1. [**Premium block blobs**](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blob-block-blob-premium): For block blobs and append blobs. Recommended for scenarios with high transaction rates or those that use smaller objects or require consistently low storage latency (Interactive workloads, IoT/ streaming analytics, AI/ML, fast data hydration - load). Supports only LRS and ZRS redundancy options.

1. **Premium file shares**: For file shares only - Server Message Block (SMB) and NFS file shares. Recommended for enterprise or high-performance scale applications. Supports only LRS and ZRS redundancy options.

1. **Premium page blobs**: For page blobs only. LRS redundancy only.

Premium performance storage accounts use solid-state drives (SSDs) for low latency and high throughput (lots of writes). They have a higher storage cost, they have a lower transaction cost.

### Storage Account Name and Endpoints

Storage account names must be unique within Azure, alphanumeric (lowercase), 3-24 chars.

In one subscription, you can have accounts with both standard or Azure DNS Zone endpoints. This means maximum 250 (500 with quota increase) for Standard + 5000 Azure DNS Zone = 5250-5500 accounts per region.

#### Standard Endpoints

| Storage service               | Endpoint                                           |
| ----------------------------- | -------------------------------------------------- |
| Blob Storage                  | `https://<storage-account>.blob.core.windows.net`  |
| Static website (Blob Storage) | `https://<storage-account>.web.core.windows.net`   |
| Data Lake Storage Gen2        | `https://<storage-account>.dfs.core.windows.net`   |
| Azure Files                   | `https://<storage-account>.file.core.windows.net`  |
| Queue Storage                 | `https://<storage-account>.queue.core.windows.net` |
| Table Storage                 | `https://<storage-account>.table.core.windows.net` |

Example: `https://<mystorageaccount>.blob.core.windows.net/<mycontainer></<myblob>`

#### Azure DNS Zone Endpoints

Storage accounts dynamically get assigned n Azure DNS zone (`z[00-50]`) when created: `https://<storage-account>.z[00-50].<storage-service>b.core.windows.net`

#### Retrieve Endpoints

`GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Storage/storageAccounts/{accountName}?api-version=2022-09-01`

#### [Increase Quota](https://learn.microsoft.com/en-us/azure/quotas/storage-account-quota-requests)

`Azure Portal > Quotas > Storage > <subscription> > <region> > Request increase`

View: `az storage account show-usage --location` or `Azure portal > Quotas > Storage > <subscription> > <region>`

### Migrate Storage Account

#### Change Storage Account Type

**You can't change a storage account to a different type after it's created.** To move your data to a storage account of a different type, you must create a new account and copy the data to the new account.

```ps
# create new storage account with the same settings as the old one
az storage account create --name $new_account_name --resource-group $resource_group --location $location --sku $new_account_type

# get connection strings for the old and new storage accounts
old_account_conn_string=$(az storage account show-connection-string --name $old_account_name --resource-group $resource_group --query connectionString --output tsv)
new_account_conn_string=$(az storage account show-connection-string --name $new_account_name --resource-group $resource_group --query connectionString --output tsv)

# get the list of all blob containers in the old storage account
old_account_containers=$(az storage container list --connection-string $old_account_conn_string --output tsv --query [].name)

# for each container in the old storage account, create a container with the same name in the new storage account, then copy all blobs to it
for container in $old_account_containers
do
    az storage container create --name $container --connection-string $new_account_conn_string

    az storage blob copy start-batch --source-container $container --destination-container $container --connection-string $old_account_conn_string --destination-connection-string $new_account_conn_string
done

```

#### [Move Storage Account to a Different Resource Group (or Subscription)](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/move-resource-group-and-subscription)

```ps
$webapp=$(az resource show -g OldRG -n ExampleSite --resource-type "Microsoft.Web/sites" --query id --output tsv)
$plan=$(az resource show -g OldRG -n ExamplePlan --resource-type "Microsoft.Web/serverfarms" --query id --output tsv)
az resource move --destination-group newgroup --ids $webapp $plan
```

Add `--destination-subscription-id $newSubscription` to change subsription

#### [Move Storage Account to a Different Region](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-move?tabs=azure-portal)

```ps
Get-AzSubscription
New-AzResourceGroup -Name $resourceGroupName -Location "$location"
New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri "<name of your local template file>"
```

#### [Upgrade to a General-Purpose V2 Storage Account](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-upgrade?tabs=azure-portal)

Azure Portal: `storage account > Settings > Configuration > Account kind > Upgrade`

CLI: `az storage account update -g <resource-group> -n <storage-account> --set kind=StorageV2 --access-tier=<Hot/Cool>`

### #[Migrate Classic Storage Account to Azure Resource Manager](https://learn.microsoft.com/en-us/azure/virtual-machines/migration-classic-resource-manager-overview#migration-of-storage-accounts)

TODO

#### Transfer data into a storage account

- Discovery phase (determine all sources that need to be migrated)

- Assessment phase

  | Assessment phase steps                     | Options                                                                                                                                 |
  | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
  | Choose a target storage service            | - Azure Blob Storage (REST API) <br>- Azure Files (NFS/SMB) <br>- Azure NetApp Files (low latency or older NFS/NSB) <br>- ISV solutions |
  | Choose the right plan                      | Latency sensitive ? Premium : Standard                                                                                                  |
  | Select a migration method                  | - Online <br>- Offline <br>- Combination of both                                                                                        |
  | Choose the best migration tool for the job | - Commercial tools (Azure and ISV) <br>- Open source (AzCopy)                                                                           |

- Migration phase: Initial migration, Resync, Switchover

### [Azure Storage Account Encryption](https://learn.microsoft.com/en-us/azure/storage/common/storage-service-encryption)

Data and metadata are encrypted and decrypted transparently for free using 256-bit AES server side encryption (SSE), regardless of plan (Standard, Premium), access tier (hot, cold), deployment model (ARM, classic), redundancy, resource type. For greater security, infrastructure can also be encrypted (optionally, with separate Microsoft-managed keys); [CLI](https://learn.microsoft.com/en-us/azure/storage/common/infrastructure-encryption-enable?tabs=azure-cli): `az storage account create --require-infrastructure-encryption`.

| Key management parameter         | Microsoft-managed keys (default)      | Customer-managed keys                 | Customer-provided keys   |
| -------------------------------- | ------------------------------------- | ------------------------------------- | ------------------------ |
| Azure Storage services supported | All                                   | Blob Storage, Azure Files             | Blob Storage             |
| Key storage                      | Microsoft key store                   | Azure Key Vault or Key Vault HSM      | Customer's own key store |
| Key scope                        | Account (default), container, or blob | Account (default), container, or blob | N/A                      |

NOTE: Customer-managed keys can be optionally enabled for [Queue and Table storage](https://learn.microsoft.com/en-us/azure/storage/common/account-encryption-key-create?tabs=azure-cli) (`az storage account create --encryption-key-type-for-{queue,table} Account`) at higher cost

By default, a storage account is encrypted with a key that is scoped to the entire storage account (can be scoped for blobs).

#### [Customer-managed Keys for Azure Storage Encryption](https://learn.microsoft.com/en-us/azure/storage/common/customer-managed-keys-overview)

![Diagram showing how customer-managed keys work in Azure Storage ](https://learn.microsoft.com/en-us/azure/storage/common/media/customer-managed-keys-overview/encryption-customer-managed-keys-diagram.png)

An Azure Key Vault admin provides access to encryption keys to a managed identity, which can be user or system controlled. Then, an Azure Storage admin implements encryption using a customer-managed key for the storage account. Azure Storage uses this granted identity to verify access to Azure Key Vault via Azure AD. This customer-managed key from the Key Vault is then used to secure the storage account's encryption key. Whenever read or write operations occur, Azure Storage communicates with Azure Key Vault to unlock the encryption key, enabling data to be encrypted or decrypted.

#### Client Side Encryption

- [For queues](https://learn.microsoft.com/en-us/azure/storage/queues/client-side-encryption)

- [For blobs](https://learn.microsoft.com/en-us/azure/storage/blobs/client-side-encryption?tabs=dotnet)

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

  // Create blob client with client-side encryption enabled.
  // Client-side encryption options are passed from service clients to container clients,
  // and from container clients to blob clients.
  // Attempting to construct a BlockBlobClient, PageBlobClient, or AppendBlobClient from a BlobContainerClient
  // with client-side encryption options present will throw, as this functionality is only supported with BlobClient.
  var blob = new BlobServiceClient(connectionString, options).GetBlobContainerClient("my-container").GetBlobClient("myBlob");

  // Upload the encrypted contents to the blob.
  blob.Upload(stream);

  // Download and decrypt the encrypted contents from the blob.
  var outputStream = new MemoryStream();
  blob.DownloadTo(outputStream);
  ```

### Storage Account Billing

Based on your storage account usage, with costs calculated according to factors like region, account type, access tier, capacity, redundancy, transactions, and data egress (download).

### Legacy Storage Account Types

- Standard general-purpose v1: Not recommended by Microsoft. For classic deployment model or transaction-intensive apps.

### Working with Storage Account

[Create](https://learn.microsoft.com/en-us/cli/azure/storage/account?view=azure-cli-latest#az-storage-account-create):

```ps
# az login
# az group create --name $resourceGroup --location $location
az storage account create
    --name # ^[0-9a-z]{3,24}$
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

```sh
az storage account update
    --name
    [--resource-group] `az account list-locations` or `az configure --defaults location=$location` or attempt to resolve the resource group by storage account name (only if globally unique)
    ...
```

(You can't change a storage account to a different type after it's created)

Create an account with Azure DNS zone endpoints:

```sh
az extension add --name storage-preview

az storage account create \
    #--name "<account-name>" \
    #--resource-group "<resource-group>" \
    #--location "<location>" \
    --dns-endpoint-type AzureDnsZone
```

[Delete](https://learn.microsoft.com/en-us/cli/azure/storage/account?view=azure-cli-latest#az-storage-account-delete)

```sh
az storage account delete --name "<storage-account>" --resource-group "<resource-group>"
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

In case the primary region becomes unavailable, a failover to the secondary region can be _manually_ initiated. During this process, data becomes temporarily inaccessible as Azure Storage updates the DNS entry, transforming the secondary endpoint into the new primary one, and vice versa. This might involve some data loss due to asynchronous copying between regions. Failback can be used to restore the region states.

Note that _Azure virtual machines (VMs) need to be replicated_, _archived blobs need to be rehydrated to an online tier_ (Archive tier is not available for any \*ZRS), and _Azure Storage resource provider cannot fail over_, so operations must still take place in the former primary region.

To prepare for an account failover with unmanaged disks, shut down the VM, delete it while retaining the VHD files, and wait for Last Sync Time to update.

Note: Copying data is an alternative to failover: `azcopy copy "C:\local\path" "https://account.blob.core.windows.net/mycontainer1/..." --recursive=true`

_Azure File Sync_, Storage accounts with _hierarchical namespace enabled_, Storage account containing _premium block blobs_, and Storage account containing any _WORM immutability policy_, do not support failover.

##### [Initiate the failover](https://learn.microsoft.com/en-us/azure/storage/common/storage-initiate-account-failover)

[CLI](https://learn.microsoft.com/en-us/cli/azure/storage/account?view=azure-cli-latest#az-storage-account-failover): `az storage account failover --name accountName`

Portal: `storage account > Settings > Geo-replication > Prepare for failover`

#### [Change the redundancy option for a storage account](https://learn.microsoft.com/en-us/azure/storage/common/redundancy-migration?tabs=portal)

Redundancy options can be changed without any data loss or application downtime.

[CLI](https://learn.microsoft.com/en-us/cli/azure/storage/account?view=azure-cli-latest#az-storage-account-update):

```sh
az storage account update \
    --name "<storage-account>"
    --resource-group "<resource_group>" \
    --sku "<sku>" # {Premium_LRS, Premium_ZRS, Standard_GRS, Standard_GZRS, Standard_LRS, Standard_RAGRS, Standard_RAGZRS, Standard_ZRS}
```

Portal: `storage account > Data management > Redundancy`

#### Supported Azure Storage Services

Different redundancy options are supported by various Azure Storage services, including Blob storage, Queue storage, Table storage, Azure Files (which do not support RA-GRS, RA-GZRS, or failover), and Azure managed disks.

## Containers

A set of blobs, similar to a directory in a file system. A container name must be a valid DNS name (3 to 63 chars), as it forms part of the unique URI.

```txt
https://myaccount.blob.core.windows.net/mycontainer
```

## Blobs

[Understanding block blobs, append blobs, and page blobs](https://learn.microsoft.com/en-us/rest/api/storageservices/understanding-block-blobs--append-blobs--and-page-blobs)

### Blob Blocks

Store text and binary data. Block blobs are made up of blocks of data that can be managed individually

#### [Access tiers](https://learn.microsoft.com/en-us/azure/storage/blobs/access-tiers-overview)

- Hot tier (default) - Frequently accessed or modified data. Highest storage costs, lowest access costs.
- Cool tier - Infrequently accessed or modified data. Minimum for 30 days.
- Cold tier - same as cool tier, but for 90 days.
- Archive tier - Available only for individual block blobs. Rarely accessed, very high ("flexible") latency (in matter of hours). Minimum for 180 days.  
  Does not support \*ZRS redundancy.  
  To access data, either [copy](https://learn.microsoft.com/en-us/azure/storage/blobs/archive-rehydrate-overview#copy-an-archived-blob-to-an-online-tier) or [change](https://learn.microsoft.com/en-us/azure/storage/blobs/archive-rehydrate-overview#change-a-blobs-access-tier-to-an-online-tier) data to online tier. Rehydration copy to a different account is supported if the other account is within the same region. Destination cannot be at archive tier. Rehydration can take up to 15 hours (Standard Priority), or 1 hour (High Priority, not guaranteed) for objects less than 10GB. Priority can be upgraded any time. Can be checked by `x-ms-rehydrate-priority` header.

Non-hot is perfect for short-term data backup and disaster recovery. Access tiers are available for block blobs only (other types of blobs are considered "Hot").

Non-archive have access latency of ms. If access needs to be within an hour, optimized for cost, then Cold/Cool is recommended.

There is a penalty for removing data, or moving it to different tier, earlier (copying is fine though). If needs to be kept for at least X days without early deletion penalty, then a tier with <= days should be chosen. Example: for 45 days you choose cool tier - if you delete data on day 45 on cold tier there will be penalty, while there won't be for cool tier.

**Archive** tier is considered _offline_ (requires rehydration to be accessed). All other tiers are considered _online_ (can be accessed at any time).

Changing a blob's tier leaves its last modified time untouched. If a lifecycle policy is active, using **Set Blob Tier** to rehydrate may cause the blob to return to the archive tier if the last modified time exceeds the policy's threshold.

#### [Blob storage lifecycle policies](https://learn.microsoft.com/en-us/azure/storage/blobs/lifecycle-management-overview)

Supported in `General Purpose v2`.

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

##### Creating a new policy

Portal: `All resources > storage account > Data management > Lifecycle management > List view > Add rule > fill out the Action set form fields > add an optional filter`

CLI:

```sh
az storage account management-policy create \
    #--account-name "<storage-account>" \
    #--resource-group "<resource-group>"
    --policy @policy.json \
```

A lifecycle management policy must be read or written in full. Partial updates aren't supported.

##### Optionally enable access time tracking

When access time tracking is enabled, a lifecycle management policy can include an action based on the time that the blob was last accessed with a read (tracks only the first in the past 24 hours) or write operation. This adds additional billing.

```sh
az storage account blob-service-properties update \
    #--resource-group <resource-group> \
    #--account-name <storage-account> \
    --enable-last-access-tracking true
```

### Type of blobs

#### Block blobs

Store text and binary data in individual blocks, with a capacity of up to 190.7 TiB.

#### Append Blobs

Optimized for append operations. Ideal for scenarios such as logging data from virtual machines.

#### [Page blobs](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blob-pageblob-overview)

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

### Access conditions

```cs
BlobServiceClient blobServiceClient = new BlobServiceClient(connectionString);
BlobContainerClient containerClient = blobServiceClient.GetBlobContainerClient("mycontainer");
BlobClient blobClient = containerClient.GetBlobClient("myblob");

BlobProperties properties = await blobClient.GetPropertiesAsync();

BlobRequestConditions conditions = new BlobRequestConditions
{
    // Limit requests to resources that have not be modified since they were last fetched.
    IfMatch = properties.Value.ETag,
    // Limit requests to resources modified since this time.
    IfModifiedSince = DateTimeOffset.UtcNow.AddHours(-1),
    // Limit requests to resources that do not match the ETag.
    IfNoneMatch = new Azure.ETag("some-etag-value"),
    // Limit requests to resources that have remained unmodified.
    IfUnmodifiedSince = DateTimeOffset.UtcNow.AddHours(-2),
    // Limit requests to resources with an active lease matching this Id.
    LeaseId = "some-lease-id",
    // Optional SQL statement to apply to the Tags of the Blob.
    TagConditions = "tagKey = 'tagValue'"
};

BlobUploadOptions options = new BlobUploadOptions
{
    Metadata = new Dictionary<string, string> { { "key", "value" } },
    Conditions = conditions // Apply BlobRequestConditions
};

// Upload blob only if mathcing conditions
await blobClient.UploadAsync(BinaryData.FromString("data"), options);
```

### Read more

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

The format for the header is: `x-ms-meta-name:string-value`.

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

## Data Protection

| Feature            | [Snapshots](https://learn.microsoft.com/en-us/azure/storage/blobs/snapshots-overview) | [Versioning](https://learn.microsoft.com/en-us/azure/storage/blobs/versioning-overview) |
| ------------------ | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Creation           | Manually                                                                              | Automatically (when enbled)                                                             |
| Immutability       | Read-only once created.                                                               | Previous versions are read-only.                                                        |
| URI                | DateTime value appended to base blob URI.                                             | Unique version ID for each version.                                                     |
| Deletion           | Must be deleted explicitly or with the base blob.                                     | Automatically managed; older versions can be deleted based on policies.                 |
| Flexibility        | More manual control, suitable for point-in-time backups.                              | Easier to manage, better for frequent changes.                                          |
| Tiers              | Not in Archive.                                                                       | All.                                                                                    |
| Soft Delete Impact | Soft-deleted along with the base blob; can be recovered during retention period.      | Current version becomes a previous version, and there's no longer a current version     |

```cs
BlobSnapshotInfo snapshotInfo = await blobClient.CreateSnapshotAsync();
Uri snapshotUri = snapshotInfo.SnapshotUri;
// If you attempt to delete a blob that has snapshots, the operation will fail unless you explicitly specify that you also want to delete the snapshots
await blobClient.DeleteIfExistsAsync(DeleteSnapshotsOption.IncludeSnapshots);
```

## Encryption

ata in Azure Storage is encrypted and decrypted transparently using 256-bit AES encryption (similar to BitLocker). Enforced for all tiers. Object metadata is also encrypted.

### Encryption Key Management

1. **Microsoft Keys**: All operations handled by Azure, supporting all services. Keys are stored by Microsoft, who also handles rotation and access.

2. **Customer-Managed Keys**: Handled by Azure but you have more control. Supports some services, stored in Azure Key Vault. You handle key rotation and both you and Microsoft can access.

3. **Customer-Provided Keys**: Even more control, mainly for Blob storage. Can be stored in Azure or elsewhere, and you're responsible for key rotation. Only you can access.

So, you can choose Microsoft keys for simplicity, or your own keys if you need more control over encryption.

### [Encryption Scope](https://learn.microsoft.com/en-us/azure/storage/blobs/encryption-scope-overview)

Blobs use default encryption scope of the container, or the storage account if no default encryption scope is specified for the container. Individual blobs can be uploaded with custom encryption scope. You also cannot change the access tier for a blob that uses an encryption scope. When you disable an encryption scope, any subsequent read or write operations made with the encryption scope will fail with HTTP error code 403 (Forbidden).

When you enable an encryption scope, you are billed for a minimum of one month (30 days). After the first month, charges for an encryption scope are prorated on an hourly basis.

#### [Manage Encryption Scope](https://learn.microsoft.com/en-us/azure/storage/blobs/encryption-scope-manage)

Encryption scope for storage account:

- Azure Portal: `storage account > Security + networking > Encryption > Encryption Scopes tab.`
- CLI:

```sh
az storage account encryption-scope create --key-source Microsoft.Storage ...
```

Encryption scope for storage account:

- Azure Portal: `storage account > containers > Add > Advanced > Encryption scope`
- CLI:

```sh
az storage container create \
    --default-encryption-scope "<scope>" \
    --prevent-encryption-scope-override true \ # force all blobs in a container to use the container's default scope
    ...
    #--auth-mode login
```

Upload a blob with an encryption scope:

- Azure Portal: `storage account > containers > Upload > Advanced > Encryption scope`
- CLI:

```sh
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

```sh
az storage account encryption-scope update --key-source Microsoft.Storage ...

az storage account encryption-scope update --key-source Microsoft.KeyVault --key-uri "<key-uri>" ...
```

Disable an encryption scope:

- Azure Portal: `storage account > Encryption Scopes > scope > Disable`
- CLI:

```sh
az storage account encryption-scope update \
    #--account-name <storage-account> \
    #--resource-group <resource-group> \
    #--name <scope> \
    --state Disabled
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

```sh
az storage blob upload --account-name myaccount --account-key mykey --name myblob --type block --file ./local/path/to/file --container-name mycontainer
```

```http
Authorization: SharedKey myaccount:CY1OP3vGZJe6t2iQp6AU7CmbZjNtsQQ5EGGKkqJl+XI=
```

### [Azure Active Directory (Azure AD)](https://learn.microsoft.com/en-us/azure/storage/blobs/authorize-access-azure-active-directory)

Azure AD provides identity-based access control, so you can use it to authenticate and authorize users and services. This includes built-in features like multi-factor authentication, conditional access, and identity protection.

Azure AD is the best choice when you need to authorize users and services based on their identity and roles, and when you need to utilize advanced security features. For example, it's ideal for enterprise scenarios where you want to allow employees to access Azure Storage, but you need fine-grained control over who has access and what they can do.

```cs
TokenCredential credential = new DefaultAzureCredential();
var service = new BlobServiceClient(new Uri("<account-url>"), credential);
```

```sh
az login
az storage blob upload --account-name myaccount --name myblob --type block --file ./local/path/to/file --container-name mycontainer
```

#### Using app credentials

`Azure Active Directory > App Registrations`

```cs
TokenCredential credential = new ClientSecretCredential("<tenant-id>", "<client-id>", "<client-secret>");
var service = new BlobServiceClient(new Uri("<account-url>"), credential);
```

```sh
az login --service-principal --username <client-id> --password <client-secret> --tenant <tenant-id>
az storage blob upload --account-name myaccount --name myblob --type block --file ./local/path/to/file --container-name mycontainer
```

### [Use OAuth access tokens for authentication](https://learn.microsoft.com/en-us/rest/api/storageservices/authorize-with-azure-active-directory#use-oauth-access-tokens-for-authentication)

**Delegation Scope**: Use `user_impersonation` to allow applications to perform actions permitted by the user.

**Resource ID**: Use `https://storage.azure.com/` to request tokens.

**Making API Calls**: Use `Authorization: Bearer [Your_Token]` and `x-ms-version: [Date]` headers.

### [Manage access rights with RBAC](https://learn.microsoft.com/en-us/rest/api/storageservices/authorize-with-azure-active-directory#manage-access-rights-with-rbac)

In addition to `Storage Blob Data [Standard Role]` there also is `Storage Blob Delegator` for getting user delegation key.

Permissions for Blob service operations: `Microsoft.Storage/storageAccounts/blobServices/<op>` for top level operations, sub `containers/<op>` and `containers/blobs/<op>` for fine grained control. `<op>` can be `read`, `write`, `delete`, `filter/action` (find blobs, blob level only).

### [Anonymous public read access](https://learn.microsoft.com/en-us/azure/storage/blobs/anonymous-read-access-prevent?tabs=azure-cli)

Anonymous public access to your data is always prohibited by default. If the storage account doesn't allow public access, then no container within it can have public access, regardless of its own settings. If public access is allowed at the storage account level, then a container's access depends on its own settings (**Public access: Container**, or **Public access: Blob**).

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
leaseId=$(az storage blob lease acquire --lease-duration 60 --output tsv ...)
# az storage blob lease renew --lease-id $leaseId ...
# az storage blob lease change --lease-id $leaseId --proposed-lease-id $newLeaseId ...
# az storage blob lease release --lease-id $leaseId ...
# az storage blob lease break ...
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

Default pages: `_index.html` and `_404.html`.

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
# Note: cannot copy from archive to archive
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
az storage blob set-tier  --tier Hot --rehydrate-priority Standard ... #--auth-mode login
```

```ps
# Update the rehydration priority for a blob.
az storage blob set-tier --rehydrate-priority High ... #--auth-mode login
```

```ps
# Set the default access tier for a storage account
az storage account update --access-tier Cool ...
```

```ps
# Set a blob's tier on upload
az storage blob upload --file "<file>" --tier "<tier>" ... #--auth-mode login
```

```ps
# Change the storage Tier Level of Blobs older than 6 months to Archive Tier.
# Note: The code is for Powershell, with AZ CLI bellow

# Step 1: Connect to Azure Account
Connect-AzAccount
# az login

# Step 2: Get Storage Account details
$storageaccount = Get-AzStorageAccount -Name $storageaccountname -ResourceGroupName $storageresourcegroup

# Step 3: Get Storage Account credentials
$key = (Get-AzStorageAccountKey -ResourceGroupName $storageaccount.ResourceGroupName -Name $storageaccount.StorageAccountName).Value[0]
# key=$(az storage account keys list --resource-group $storageresourcegroup --account-name $storageaccountname --query '[0].value' --output tsv)

# Step 4: Get the storage account context
$context = New-AzStorageContext -StorageAccountName $storageaccount.StorageAccountName -StorageAccountKey $key

# Step 5: Get the storage account container to perform the operation
$containers = Get-AzStorageContainer -Context $context
# containers=$(az storage container list --account-name $storageaccountname --account-key $key --query '[].name' --output tsv)

# Step 6: Iterate through each blob in each container
foreach ($container in $containers) {
# for container in $containers
    $blobs = Get-AzStorageBlob -Container $container.Name -Context $context
    # blobs=$(az storage blob list --container-name $container --account-name $storageaccountname --account-key $key --query '[].name' --output tsv)
    foreach ($blob in $blobs) {
    # for blob in $blobs
        $blobCreatedTime = $blob.ICloudBlob.Properties.Created.Value
        # blobCreatedTime=$(az storage blob show --name $blob --container-name $container --account-name $storageaccountname --account-key $key --query 'properties.creationTime' --output tsv)
        $currentDate = Get-Date
        # currentTime=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
        $timeDifference = $currentDate - $blobCreatedTime
        # timeDifference=$(( ( $(date -u -d "$currentTime" +%s) - $(date -u -d "$blobCreatedTime" +%s) )/(60*60*24) ))

        # Check if the blob is older than 6 months
        if ($timeDifference.Days -gt 180) {
        # if [ $timeDifference -gt 180 ]; then
            # Set its access tier to "Archive"
            $blob.ICloudBlob.SetStandardBlobTier("Archive")
            # az storage blob set-tier --name $blob --container-name $container --account-name $storageaccountname --account-key $key --tier Archive
        }
    }
}
```

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

### [Working with blobs](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-quickstart-blobs-dotnet)

```cs
var blobServiceClient = new BlobServiceClient(new Uri("https://<storage-account-name>.blob.core.windows.net"), new DefaultAzureCredential());

// Enumerate containers
await foreach (BlobContainerItem container in blobServiceClient.GetBlobContainersAsync()) {}

// Create the container and return a container client object
BlobContainerClient containerClient = await blobServiceClient.CreateBlobContainerAsync("quickstartblobs" + Guid.NewGuid().ToString());
// var containerClient = blobServiceClient.GetBlobContainerClient(containerName);
// var containerClient = new BlobContainerClient(new Uri($"https://{accountName}.blob.core.windows.net/{containerName}"), new DefaultAzureCredential(), clientOptions);
// Note: BlobContainerClient allows you to manipulate both Azure Storage containers and their blobs

BlobClient blobClient = containerClient.GetBlobClient(fileName);

await blobClient.UploadAsync(localFilePath, true);

// List all blobs in the container
await foreach (var blobItem in containerClient.GetBlobsAsync()) {}

// Download the blob's contents and save it to a file
await blobClient.DownloadToAsync(downloadFilePath);
// Alternatively
// Download the blob's contents and save it to a file
BlobDownloadInfo download = await blobClient.DownloadAsync();

using (FileStream downloadFileStream = File.OpenWrite(downloadFilePath))
{
   await download.Content.CopyToAsync(downloadFileStream);
}

// Copy from one container to another, without downloading locally
BlobContainerClient sourceContainer = blobServiceClient.GetBlobContainerClient("sourcecontainer");
BlobClient sourceBlob = sourceContainer.GetBlobClient("sourceblob.txt");
BlobContainerClient targetContainer = blobServiceClient.GetBlobContainerClient("targetcontainer");
BlobClient targetBlob = targetContainer.GetBlobClient("targetblob.txt");
await targetBlob.StartCopyFromUriAsync(sourceBlob.Uri);
```
