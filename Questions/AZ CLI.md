# AZ CLI

Question: Create a new resource group in the West US region with name `MyResourceGroup`

```ps
az group # Options here
```

Answer:

```ps
az group create -l westus -n MyResourceGroup
```

---

Question: Delete `MyResourceGroup` resource group.

```ps
az group # Options here
```

Answer:

```ps
az group delete -n MyResourceGroup
```

---

Question: Force delete all the Virtual Machines in `MyResourceGroup` resource group.

```ps
az group # Options here
```

Answer:

```ps
az group delete -n MyResourceGroup --force-deletion-types Microsoft.Compute/virtualMachines
```

---

Question: Check if `MyResourceGroup` exists.

```ps
az group # Options here
```

Answer:

```ps
az group exists -n MyResourceGroup
```

---

Question: List all resource groups located in the West US region.

```ps
az group # Options here
```

Answer:

```ps
az group list --query "[?location=='westus']"
```

---

Question: Update `MyResourceGroup` resource group. Set CostCenter tag to `{"Dept":"IT","Environment":"Test"}`

```ps
az group # Options here
```

Answer:

```ps
az group update --resource-group MyResourceGroup --set tags.CostCenter='{"Dept":"IT","Environment":"Test"}'
```

---

Question: Wait until `MyResourceGroup` resource group is created

```ps
az group # Options here
```

Answer:

```ps
az group wait --created  --resource-group MyResourceGroup
```

---

Question: Wait until `MyResourceGroup` resource group is deleted

```ps
az group # Options here
```

Answer:

```ps
az group wait --deleted --resource-group MyResourceGroup
```

---

Question: Create a storage account `mystorageaccount` in new resource group `MyResourceGroup` in the West US region with locally redundant storage.

```ps
az # Options here
```

Answer:

```ps
az group create -l westus -n MyResourceGroup
az storage account create -n mystorageaccount -g MyResourceGroup -l westus --sku Standard_LRS
```

---

Question: Create a storage account `mystorageaccount` in new resource group `MyResourceGroup` in the eastus2euap region with account-scoped encryption key enabled for Table Service.

```ps
az # Options here
```

Answer:

```ps
az group create -l eastus2euap -n MyResourceGroup
az storage account create -n mystorageaccount -g MyResourceGroup --kind StorageV2 -l eastus2euap -t Account
```

---

Question: Delete `MyStorageAccount` storage account in `MySubscription` subscription in `MyResourceGroup` using a resource ID.

```ps
az storage # Options here
```

Answer:

```ps
az storage account delete --ids /subscriptions/MySubscription/resourceGroups/MyResourceGroup/providers/Microsoft.Storage/storageAccounts/MyStorageAccount
```

---

Question: Delete a storage account using `MyStorageAccount` account name and `MyResourceGroup` resource group.

```ps
az storage # Options here
```

Answer:

```ps
az storage account delete -n MyStorageAccount -g MyResourceGroup
```

---

Question: Failover `mystorageaccount` storage account from resource group `MyResourceGroup`.

```ps
az storage # Options here
```

Answer:

```ps
az storage account failover -n mystorageaccount -g MyResourceGroup
```

---

Question: Failover `mystorageaccount` storage account from resource group `MyResourceGroup` without waiting to complete.

```ps
az storage # Options here
```

Answer:

```ps
az storage account failover -n mystorageaccount -g MyResourceGroup --no-wait
```

---

Question: Generate a sas token for `MyStorageAccount` account that is valid for queue and table services on Linux.

```ps
end=`date -u -d "30 minutes" '+%Y-%m-%dT%H:%MZ'`
az storage # Options here
```

Answer:

```ps
end=`date -u -d "30 minutes" '+%Y-%m-%dT%H:%MZ'`
az storage account generate-sas --permissions cdlruwap --account-name MyStorageAccount --services qt --resource-types sco --expiry $end -o tsv
```

---

Question: Generate a sas token for `MyStorageAccount` account that is valid for queue and table services on MacOS.

```ps
end=`date -v+30M '+%Y-%m-%dT%H:%MZ'`
az storage # Options here
```

Answer:

```ps
end=`date -v+30M '+%Y-%m-%dT%H:%MZ'`
az storage account generate-sas --permissions cdlruwap --account-name MyStorageAccount --services qt --resource-types sco --expiry $end -o tsv
```

---

Question: Generate a shared access signature for `MyStorageAccount` account for resource types container object; permissions: add, create, update, write for all services. Only permit requests made with the HTTPS protocol.

```ps
accountKey='00000000'
expiry='2020-01-01'
az storage # Options here
```

Answer:

```ps
accountKey='00000000'
expiry='2020-01-01'
az storage account generate-sas --account-key $accountKey --account-name MyStorageAccount --expiry $expiry --https-only --permissions acuw --resource-types co --services bfqt
```

---

Question: List all storage accounts in `MyResourceGroup` resource group.

```ps
az storage # Options here
```

Answer:

```ps
az storage account list -g MyResourceGroup
```
