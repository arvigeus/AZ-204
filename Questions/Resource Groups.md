# Resource Groups

Question: You are managing a resource group named `MyResourceGroup` in Azure. You need to add `environment:production` tag this resource group. After adding the tag, you need to apply a read-only lock to all resource groups with this tag. Write the Azure CLI commands that would be needed to accomplish this.

```ps
# Add tag to resource group
# Lock all resource groups with this tag
```

Answer:

```ps
az group update --name MyResourceGroup --set tags.environment=production

# List all resource groups with the 'environment:production' tag and store the names in an array
resource_groups=$(az group list --query "[?tags.environment=='production'].name" -o tsv)

# Loop through the array and apply a read-only lock to each resource group
for rg in $resource_groups
do
  az lock create --lock-type ReadOnly --name LockForProd --resource-group $rg
done
```

---
