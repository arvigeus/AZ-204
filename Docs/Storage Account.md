# Storage Account

Requires: [Resource Group](./Resource%20Group.md)

API: [az storage account create](https://learn.microsoft.com/en-us/cli/azure/storage/account?view=azure-cli-latest#az-storage-account-create) | [New-AzStorageAccount](https://learn.microsoft.com/en-us/powershell/module/az.storage/new-azstorageaccount)

```sh
az storage account create
    --name
    --resource-group
    [--access-tier {Cool, Hot, Premium}]
    [--account-type]
    [--action]
    [--allow-append {false, true}]
    [--allow-blob-public-access {false, true}]
    [--allow-cross-tenant-replication {false, true}]
    [--allow-shared-key-access {false, true}]
    [--assign-identity]
    [--azure-storage-sid]
    [--bypass {AzureServices, Logging, Metrics, None}]
    [--custom-domain]
    [--default-action {Allow, Deny}]
    [--default-share-permission {None, StorageFileDataSmbShareContributor, StorageFileDataSmbShareElevatedContributor, StorageFileDataSmbShareReader}]
    [--dns-endpoint-type {AzureDnsZone, Standard}]
    [--domain-guid]
    [--domain-name]
    [--domain-sid]
    [--edge-zone]
    [--enable-alw {false, true}]
    [--enable-files-aadds {false, true}]
    [--enable-files-aadkerb {false, true}]
    [--enable-files-adds {false, true}]
    [--enable-hierarchical-namespace {false, true}]
    [--enable-large-file-share]
    [--enable-local-user {false, true}]
    [--enable-nfs-v3 {false, true}]
    [--enable-sftp {false, true}]
    [--encryption-key-name]
    [--encryption-key-source {Microsoft.Keyvault, Microsoft.Storage}]
    [--encryption-key-type-for-queue {Account, Service}]
    [--encryption-key-type-for-table {Account, Service}]
    [--encryption-key-vault]
    [--encryption-key-version]
    [--encryption-services {blob, file, queue, table}]
    [--forest-name]
    [--https-only {false, true}]
    [--identity-type {None, SystemAssigned, SystemAssigned,UserAssigned, UserAssigned}]
    [--immutability-period]
    [--immutability-state {Disabled, Locked, Unlocked}]
    [--key-exp-days]
    [--key-vault-federated-client-id]
    [--key-vault-user-identity-id]
    [--kind {BlobStorage, BlockBlobStorage, FileStorage, Storage, StorageV2}]
    [--location]
    [--min-tls-version {TLS1_0, TLS1_1, TLS1_2}]
    [--net-bios-domain-name]
    [--public-network-access {Disabled, Enabled}]
    [--publish-internet-endpoints {false, true}]
    [--publish-microsoft-endpoints {false, true}]
    [--require-infrastructure-encryption {false, true}]
    [--routing-choice {InternetRouting, MicrosoftRouting}]
    [--sam-account-name]
    [--sas-exp]

    [--sku {Premium_LRS, Premium_ZRS, Standard_GRS, Standard_GZRS, Standard_LRS, Standard_RAGRS, Standard_RAGZRS, Standard_ZRS}] # Standard_RAGRS
    # <Type>_<Redundancy>
    # Type (immutable, to change it data must be copied to another account):
    # - Standard (General-purpose v2): Recommended. Supports all redundancy options. Not suitable for network file system (NFS) in Azure Files.
    # - (Legacy) Standard (General-purpose v1): For classic deployment model or transaction-intensive apps. Update to v2: --set kind=StorageV2 [storage account > Settings > Configuration > Account kind > Upgrade]
    # - Premium: Uses SSD. Good for: high transaction rates, using smaller objects, low latency. No global redundancy support.
    #   - Block blobs: High transactions / low latency
    #   - File shares: High performance scalable apps
    #   - Page blobs: Random R/W operations
    # Redundancy (can be changed within the same type, no data loss or downtime): [storage account > Data management > Redundancy]
    # - Locally Redundant Storage (LRS): Data is replicated 3 times within a single physical location in the primary region. Cheap, not suitable for high-availability applications.
    #   Choose LRS if your application can reconstruct lost data, requires regional replication (perhaps due to governance reasons), or uses Azure unmanaged disks.
    # - Zone-Redundant Storage (ZRS): Data is replicated across 3 Azure availability zones in the primary region.
    #   Data write operations are confirmed successful once all the available zones have received the data. This even includes zones that are temporarily unavailable.
    #   Suitable for high-availability applications, regional data replication, and Azure Files workloads.
    # - Geo-Redundant Storage (GRS): LRS with asynchronous copying to a secondary region, maintaining six copies of the data: 3 in the primary region and 3 in the secondary region.
    # - Geo-Zone-Redundant Storage (GZRS): ZRS with asynchronous copying to a secondary region, maintaining six copies of the data: 3 across separate availability zones in the primary region and 3 locally redundant copies in the secondary region. Standard only.

    [--subnet]
    [--tags]
    [--user-identity-id]
    [--vnet-name]
```
