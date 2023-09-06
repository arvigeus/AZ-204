# [Resource group](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/manage-resource-groups-portal)

Resource group is a logical container into which Azure resources (web apps, databases, storage aacounts) are deployed and managed.

**Required** by all services/resources to be created.  
Updating resource requires resource group to be passed (unless resource name is unique).

API: [az group create](https://learn.microsoft.com/en-us/cli/azure/group?view=azure-cli-latest#az-group-create) | [New-AzResourceGroup](https://learn.microsoft.com/en-us/powershell/module/az.resources/new-azresourcegroup)

```sh
az group create
    --name
    --location
```

Move to different resource group / subscription:

```sh
$res1=$(az resource show -g OldRG -n res1Name --resource-type "<type>" --query id --output tsv)
# res2=... another related resource
az resource move --destination-group NewRG --ids $res1 # res2 res3 ...
# Add `--destination-subscription-id $newSubscription` to change subsription
```

- `Microsoft.Web/sites`: Web app
- `Microsoft.Web/serverfarms`: App service plan
