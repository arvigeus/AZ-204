# Blob Storage

## Hierarchy

![Diagram showing the relationship between a storage account, containers, and blobs](https://learn.microsoft.com/en-us/azure/storage/blobs/media/storage-blobs-introduction/blob1.png)

### Container

Requires: [Storage Account](./Storage%20Account.md)

API: [az storage container create](https://learn.microsoft.com/en-us/cli/azure/storage/container?view=azure-cli-latest#az-storage-container-create) | [New-AzStorageContainer](https://learn.microsoft.com/en-us/powershell/module/az.storage/new-azstoragecontainer)

```sh
az storage container create
    --name # Standard naming rules
    [--account-key]
    [--account-name]
    [--auth-mode {key, login}]
    [--blob-endpoint]
    [--connection-string]
    [--default-encryption-scope]
    [--fail-on-exist]
    [--metadata]
    [--prevent-encryption-scope-override {false, true}]
    [--public-access {blob, container, off}]
    [--resource-group]
    [--sas-token]
    [--timeout]
```

### Blob

Requires: [Storage Account](./Storage%20Account.md), Blob Container

API: [az storage blob upload](https://learn.microsoft.com/en-us/cli/azure/storage/blob?view=azure-cli-latest#az-storage-blob-upload) | [Set-AzStorageBlobContent](https://learn.microsoft.com/en-us/powershell/module/az.storage/set-azstorageblobcontent)

```sh
az storage blob upload
    [--account-key]
    [--account-name]
    [--auth-mode {key, login}]
    [--blob-endpoint]
    [--blob-url]
    [--connection-string]
    [--container-name]
    [--content-cache]
    [--content-disposition]
    [--content-encoding]
    [--content-language]
    [--content-md5]
    [--content-type]
    [--data]
    [--encryption-scope]
    [--file]
    [--if-match]
    [--if-modified-since]
    [--if-none-match]
    [--if-unmodified-since]
    [--lease-id]
    [--length]
    [--max-connections]
    [--maxsize-condition]
    [--metadata]
    [--name] # Case sensitive, cannot end with dot (.) or dash (-)
    [--no-progress]
    [--overwrite {false, true}]
    [--sas-token]
    [--socket-timeout]
    [--tags] # Note: Each version of the blob has a unique tag, called an `ETag` that allows to only change a specific instance of the blob.
    [--tags-condition]
    [--tier]
    [--timeout]
    [--type {append, block, page}]
    [--validate-content]
```
