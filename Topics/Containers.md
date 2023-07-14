# [Containers](https://learn.microsoft.com/en-us/azure/containers/)

`az group export --name $resourceGroup` - create ARM template

`az group deployment export --name $resourceGroup --deployment-name $deployment` - create ARM template for specific deploy

`az deployment group create --resource-group $resourceGroup --template-file $armTemplateJsonFile` - ???

## [Settings](https://learn.microsoft.com/en-us/azure/app-service/configure-custom-container)

App Service passes app settings to the container using the `--env` flag to set the environment variable in the container.

```ps
az webapp config container set --name <app-name> --resource-group <group-name> \
    # Change the Docker image
    --docker-custom-image-name <docker-hub-repo>/<image> \
    # Use an image from a private registry
    --docker-custom-image-name <image-name>
    --docker-registry-server-url <private-repo-url>
    --docker-registry-server-user <username>
    --docker-registry-server-password <password>

```
