# [Azure Storage Account](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-overview)

Azure Storage Account is a unique namespace in Azure for your data objects, including blobs, files, queues, and tables. It's accessible from anywhere in the world over HTTP or HTTPS.

## Types of Storage Accounts

1. **Standard general-purpose v2**: Recommended for most scenarios using Azure Storage, except for network file system (NFS) in Azure Files. It supports all redundancy options.

1. [**Premium block blobs**](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blob-block-blob-premium): For block blobs and append blobs. Recommended for scenarios with high transaction rates or those that use smaller objects or require consistently low storage latency (Interactive workloads, IoT/ streaming analytics, AI/ML, fast data hydration - load). Supports only LRS and ZRS redundancy options.

1. **Premium file shares**: For file shares only - Server Message Block (SMB) and NFS file shares. Recommended for enterprise or high-performance scale applications. Supports only LRS and ZRS redundancy options.

1. **Premium page blobs**: For page blobs only. LRS redundancy only.

Premium performance storage accounts use solid-state drives (SSDs) for low latency and high throughput (lots of writes). They have a higher storage cost, they have a lower transaction cost.

## Storage Account Name and Endpoints

Storage account names must be unique within Azure, alphanumeric (lowercase), 3-24 chars.

In one subscription, you can have accounts with both standard or Azure DNS Zone endpoints. This means maximum 250 (500 with quota increase) for Standard + 5000 Azure DNS Zone = 5250-5500 accounts per region.

### Standard Endpoints

| Storage service               | Endpoint                                           |
| ----------------------------- | -------------------------------------------------- |
| Blob Storage                  | `https://<storage-account>.blob.core.windows.net`  |
| Static website (Blob Storage) | `https://<storage-account>.web.core.windows.net`   |
| Data Lake Storage Gen2        | `https://<storage-account>.dfs.core.windows.net`   |
| Azure Files                   | `https://<storage-account>.file.core.windows.net`  |
| Queue Storage                 | `https://<storage-account>.queue.core.windows.net` |
| Table Storage                 | `https://<storage-account>.table.core.windows.net` |

Example: `https://<mystorageaccount>.blob.core.windows.net/<mycontainer></<myblob>`

### Azure DNS Zone Endpoints

Storage accounts dynamically get assigned n Azure DNS zone (`z[00-50]`) when created: `https://<storage-account>.z[00-50].<storage-service>b.core.windows.net`

### Retrieve Endpoints

`GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Storage/storageAccounts/{accountName}?api-version=2022-09-01`

### [Increase Quota](https://learn.microsoft.com/en-us/azure/quotas/storage-account-quota-requests)

`Azure Portal > Quotas > Storage > <subscription> > <region> > Request increase`

View: `az storage account show-usage --location` or `Azure portal > Quotas > Storage > <subscription> > <region>`

## Migrate Storage Account

### Change Storage Account Type

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

### [Move Storage Account to a Different Resource Group (or Subscription)](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/move-resource-group-and-subscription)

```ps
$webapp=$(az resource show -g OldRG -n ExampleSite --resource-type "Microsoft.Web/sites" --query id --output tsv)
$plan=$(az resource show -g OldRG -n ExamplePlan --resource-type "Microsoft.Web/serverfarms" --query id --output tsv)
az resource move --destination-group newgroup --ids $webapp $plan
```

Add `--destination-subscription-id $newSubscription` to change subsription

### [Move Storage Account to a Different Region](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-move?tabs=azure-portal)

```ps
Get-AzSubscription
New-AzResourceGroup -Name $resourceGroupName -Location "$location"
New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri "<name of your local template file>"
```

### [Upgrade to a General-Purpose V2 Storage Account](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-upgrade?tabs=azure-portal)

Azure Portal: `storage account > Settings > Configuration > Account kind > Upgrade`

CLI: `az storage account update -g <resource-group> -n <storage-account> --set kind=StorageV2 --access-tier=<Hot/Cool>`

### [Migrate Classic Storage Account to Azure Resource Manager](https://learn.microsoft.com/en-us/azure/virtual-machines/migration-classic-resource-manager-overview#migration-of-storage-accounts)

TODO

### Transfer data into a storage account

- Discovery phase (determine all sources that need to be migrated)

- Assessment phase

  | Assessment phase steps                     | Options                                                                                                                                 |
  | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
  | Choose a target storage service            | - Azure Blob Storage (REST API) <br>- Azure Files (NFS/SMB) <br>- Azure NetApp Files (low latency or older NFS/NSB) <br>- ISV solutions |
  | Choose the right plan                      | Latency sensitive ? Premium : Standard                                                                                                  |
  | Select a migration method                  | - Online <br>- Offline <br>- Combination of both                                                                                        |
  | Choose the best migration tool for the job | - Commercial tools (Azure and ISV) <br>- Open source (AzCopy)                                                                           |

- Migration phase: Initial migration, Resync, Switchover

## [Azure Storage Account Encryption](https://learn.microsoft.com/en-us/azure/storage/common/storage-service-encryption)

Data and metadata are encrypted and decrypted transparently for free using 256-bit AES server side encryption (SSE), regardless of plan (Standard, Premium), access tier (hot, cold), deployment model (ARM, classic), redundancy, resource type. For greater security, infrastructure can also be encrypted (optionally, with separate Microsoft-managed keys); [CLI](https://learn.microsoft.com/en-us/azure/storage/common/infrastructure-encryption-enable?tabs=azure-cli): `az storage account create --require-infrastructure-encryption`.

| Key management parameter         | Microsoft-managed keys (default)      | Customer-managed keys                 | Customer-provided keys   |
| -------------------------------- | ------------------------------------- | ------------------------------------- | ------------------------ |
| Azure Storage services supported | All                                   | Blob Storage, Azure Files             | Blob Storage             |
| Key storage                      | Microsoft key store                   | Azure Key Vault or Key Vault HSM      | Customer's own key store |
| Key scope                        | Account (default), container, or blob | Account (default), container, or blob | N/A                      |

NOTE: Customer-managed keys can be optionally enabled for [Queue and Table storage](https://learn.microsoft.com/en-us/azure/storage/common/account-encryption-key-create?tabs=azure-cli) (`az storage account create --encryption-key-type-for-{queue,table} Account`) at higher cost

By default, a storage account is encrypted with a key that is scoped to the entire storage account. For [blob storage scope only](https://learn.microsoft.com/en-us/azure/storage/blobs/encryption-scope-overview):

- Azure Portal: `storage account > Security + networking > Encryption > Encryption Scopes tab.`
- [CLI](https://learn.microsoft.com/en-us/azure/storage/blobs/encryption-scope-manage?tabs=cli): `az storage account encryption-scope create --resource-group <resource-group> --account-name <storage-account> --name <scope> --key-source Microsoft.Storage`

### [Customer-managed Keys for Azure Storage Encryption](https://learn.microsoft.com/en-us/azure/storage/common/customer-managed-keys-overview)

![Diagram showing how customer-managed keys work in Azure Storage ](https://learn.microsoft.com/en-us/azure/storage/common/media/customer-managed-keys-overview/encryption-customer-managed-keys-diagram.png)

An Azure Key Vault admin provides access to encryption keys to a managed identity, which can be user or system controlled. Then, an Azure Storage admin implements encryption using a customer-managed key for the storage account. Azure Storage uses this granted identity to verify access to Azure Key Vault via Azure AD. This customer-managed key from the Key Vault is then used to secure the storage account's encryption key. Whenever read or write operations occur, Azure Storage communicates with Azure Key Vault to unlock the encryption key, enabling data to be encrypted or decrypted.

### Client Side Encryption

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

## Storage Account Billing

Based on your storage account usage, with costs calculated according to factors like region, account type, access tier, capacity, redundancy, transactions, and data egress (download).

## Legacy Storage Account Types

- Standard general-purpose v1: Not recommended by Microsoft. For classic deployment model or transaction-intensive apps.

## Working with Storage Account

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

```ps
az storage account update
    --name
    [--resource-group] `az account list-locations` or `az configure --defaults location=$location` or attempt to resolve the resource group by storage account name (only if globally unique)
    ...
```

(You can't change a storage account to a different type after it's created)
