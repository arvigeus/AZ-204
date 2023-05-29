# az storage account

```sh
az storage account check-name
    --name
```

```sh
az storage account create
    --name
    --resource-group
    [--access-tier {Cool, Hot, Premium}] # Required for storage accounts where kind = BlobStorage. The "Premium" access tier is the default value for premium block blobs storage account type and it cannot be changed for the premium block blobs storage account type.
    [--account-type]
    [--action] # The action of virtual network rule. default value: Allow
    [--allow-append {false, true}]
    [--allow-blob-public-access {false, true}] # NOTE: The additional step of configuring the public access setting for a container is required to enable anonymous access.
    [--allow-cross-tenant-replication {false, true}] # default value: true
    [--allow-shared-key-access {false, true}] # If false, then all requests, including shared access signatures, must be authorized with Azure Active Directory (Azure AD). default value: true.
    [--assign-identity] # Generate and assign a new Storage Account Identity for this storage account for use with key management services like Azure KeyVault. default value: False
    [--azure-storage-sid] # Required when --enable-files-adds is set to True.
    [--bypass {AzureServices, Logging, Metrics, None}] # Bypass traffic for space-separated uses.
    [--custom-domain]
    [--default-action {Allow, Deny}] # Default action to apply when no rule matches.
    [--default-share-permission {None, StorageFileDataSmbShareContributor, StorageFileDataSmbShareElevatedContributor, StorageFileDataSmbShareReader}]
    [--dns-endpoint-type {AzureDnsZone, Standard}] # Set this to AzureDNSZone to create a large number of accounts in a single subscription
    [--domain-guid] # Required when --enable-files-adds is set to True.
    [--domain-name] # Required when --enable-files-adds is set to True.
    [--domain-sid] # Required when --enable-files-adds is set to True.
    [--edge-zone]
    [--enable-alw {false, true}] # When set to true, it enables object level immutability for all the containers in the account by default. Cannot be changed
    [--enable-files-aadds {false, true}] # Enable Azure Active Directory Domain Services authentication for Azure Files
    [--enable-files-aadkerb {false, true}] # Enable Azure Files Active Directory Domain Service Kerberos Authentication for the storage account.
    [--enable-files-adds {false, true}] # Enable Azure Files Active Directory Domain Service Authentication for storage account. When --enable-files-adds is set to true, Azure Active Directory Properties arguments must be provided.
    [--enable-hierarchical-namespace {false, true}] # Allow the blob service to exhibit filesystem semantics. Only when storage account kind is StorageV2
    [--enable-large-file-share] # More than 5 TiB capacity. Cannot be changed
    [--enable-local-user {false, true}] # Enable local user features.
    [--enable-nfs-v3 {false, true}]
    [--enable-sftp {false, true}]
    [--encryption-key-name]
    [--encryption-key-source {Microsoft.Keyvault, Microsoft.Storage}]
    [--encryption-key-type-for-queue {Account, Service}] # For Queue service. "Account": Queue will be encrypted with account-scoped encryption key. "Service": Queue will always be encrypted with service-scoped keys. default value: "Service".
    [--encryption-key-type-for-table {Account, Service}] # For Table service. "Account": Table will be encrypted with account-scoped encryption key. "Service": Table will always be encrypted with service-scoped keys. default value: "Service".
    [--encryption-key-vault] # The Uri of the KeyVault.
    [--encryption-key-version] # The version of the KeyVault key to use, which will opt out of implicit key rotation. Use "" to opt in key auto-rotation again.
    [--encryption-services {blob, file, queue, table}] # Specifies which service(s) to encrypt.
    [--forest-name] # Specify the Active Directory forest to get. Required when --enable-files-adds is set to True.
    [--https-only {false, true}] # default value: true
    [--identity-type {None, SystemAssigned, SystemAssigned,UserAssigned, UserAssigned}]
    [--immutability-period] # In days
    [--immutability-state {Disabled, Locked, Unlocked}] #Defines the mode of the policy. Disabled state disables the policy, Unlocked state allows increase and decrease of immutability retention time and also allows toggling allow-protected-append-write property, Locked state only allows the increase of the immutability retention time. A policy can only be created in a Disabled or Unlocked state and can be toggled between the two states. Only a policy in an Unlocked state can transition to a Locked state which cannot be reverted.
    [--key-exp-days] # Expiration period in days of the Key Policy assigned to the storage account.
    [--key-vault-federated-client-id] # ClientId of the multi-tenant application to be used in conjunction with the user-assigned identity for cross-tenant customer-managed-keys server-side encryption on the storage account.
    [--key-vault-user-identity-id] # Resource identifier of the UserAssigned identity to be associated with server-side encryption on the storage account.
    [--kind {BlobStorage, BlockBlobStorage, FileStorage, Storage, StorageV2}]
    [--location] # Values from: az account list-locations
    [--min-tls-version {TLS1_0, TLS1_1, TLS1_2}] # default value: TLS 1.0
    [--net-bios-domain-name] # Required when --enable-files-adds is set to True
    [--public-network-access {Disabled, Enabled}]
    [--publish-internet-endpoints {false, true}]
    [--publish-microsoft-endpoints {false, true}]
    [--require-infrastructure-encryption {false, true}]
    [--routing-choice {InternetRouting, MicrosoftRouting}]
    [--sam-account-name] # Specify the Active Directory SAMAccountName for Azure Storage.
    [--sas-exp]
    [--sku {Premium_LRS, Premium_ZRS, Standard_GRS, Standard_GZRS, Standard_LRS, Standard_RAGRS, Standard_RAGZRS, Standard_ZRS}] # default value: Standard_RAGRS
    [--subnet] # If name is supplied, --vnet-name must be supplied.
    [--tags]
    [--user-identity-id] # The key is the ARM resource identifier of the identity. Only 1 User Assigned identity is permitted here.
    [--vnet-name] # Name of a virtual network.
```

```sh
az storage account delete
    [--ids] # One or more resource IDs (space-delimited). It should be a complete resource ID containing all information of 'Resource Id' arguments. You should provide either --ids or other 'Resource Id' arguments.
    [--name]
    [--resource-group]
    [--subscription]
    [--yes] # default value: False
```

```sh
# ailover request can be triggered for a storage account in case of availability issues.
# The failover occurs from the storage account's primary cluster to secondary cluster for (RA-)GRS/GZRS accounts.
# The secondary cluster will become primary after failover.
az storage account failover
    [--failover-type] # The parameter is set to 'Planned' to indicate whether a Planned failover is requested.
    [--ids]
    [--name]
    [--no-wait] # default value: False
    [--resource-group]
    [--subscription]
    [--yes]
```

```sh
# Generate a shared access signature for the storage account.
az storage account generate-sas
    --expiry # Specifies the UTC datetime (Y-m-d'T'H:M'Z') at which the SAS becomes invalid.
    --permissions # The permissions the SAS grants. Allowed values: (a)dd (c)reate (d)elete (f)ilter_by_tags (i)set_immutability_policy (l)ist (p)rocess (r)ead (t)ag (u)pdate (w)rite (x)delete_previous_version (y)permanent_delete. Can be combined.
    --resource-types # The resource types the SAS is applicable for. Allowed values: (s)ervice (c)ontainer (o)bject. Can be combined.
    --services # The storage services the SAS is applicable for. Allowed values: (b)lob (f)ile (q)ueue (t)able. Can be combined.
    [--account-key] # Must be used in conjunction with storage account name or service endpoint. Environment variable: AZURE_STORAGE_KEY.
    [--account-name] # Must be used in conjunction with either storage account key or a SAS token. Environment Variable: AZURE_STORAGE_ACCOUNT.
    [--blob-endpoint] # Must be used in conjunction with either storage account key or a SAS token. You can find each service primary endpoint with az storage account show. Environment variable: AZURE_STORAGE_SERVICE_ENDPOINT.
    [--connection-string] # Environment variable: AZURE_STORAGE_CONNECTION_STRING.
    [--encryption-scope] # A predefined encryption scope used to encrypt the data on the service.
    [--https-only]
    [--ids] # You should provide either --ids or other 'Resource Id' arguments.
    [--ip]
    [--start] # Specifies the UTC datetime (Y-m-d'T'H:M'Z') at which the SAS becomes valid. Defaults to the time of the request.
    [--subscription]
```

```sh
az storage account list
    [--resource-group]
```
