# [Containers](https://learn.microsoft.com/en-us/azure/containers/)

`az group export --name $resourceGroup` - create ARM template

`az group deployment export --name $resourceGroup --deployment-name $deployment` - create ARM template for specific deploy

`az deployment group create --resource-group $resourceGroup --template-file $armTemplateJsonFile` - ???
