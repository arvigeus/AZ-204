# Container Registry

Question: Given a Dockerfile in your current directory with the following content:

```Dockerfile
FROM mcr.microsoft.com/hello-world
```

You are asked to run an image in Azure from a Container Registry named `myContainerRegistry008`. The image should be tagged as `sample/hello-world:v1`.

Assume that the Azure subscription and Azure CLI have already been configured on your local system. However, the necessary resources for running the image, such as the resource group and container registry, have not yet been created.

Considering all these requirements, write down the sequence of Azure CLI commands necessary to successfully run the image from the specified container registry.

Answer:

```Dockerfile
# Create a resource group named 'myResourceGroup' in 'eastus' location
az group create --name myResourceGroup --location eastus

# Create an Azure container registry named 'myContainerRegistry008' within the 'myResourceGroup'
az acr create --resource-group myResourceGroup --name myContainerRegistry008 --sku Basic

# Authenticate Docker client to the registry
az acr login --name myContainerRegistry008

# Build the Docker image from the Dockerfile in the current directory, tag it as 'sample/hello-world:v1',
# and push it to the 'myContainerRegistry008' registry
az acr build --registry myContainerRegistry008 --image sample/hello-world:v1 .

# Execute the image from the registry
az acr run --registry myContainerRegistry008 --cmd '$Registry/sample/hello-world:v1' /dev/null
```

---

Question: You are managing an Azure Container Registry named `myregistry`. You have a task to publish the most recent `windows/servercore` container image from the Microsoft Container Registry into your registry. After importing, you want the image to be tagged as `servercore:ltsc2019` in your registry. Write the Azure CLI command that would be needed to accomplish this.

```ps
# Code here
```

Answer:

```ps
az acr import \
--name myregistry \ # specifies the name of your Azure Container Registry
--source mcr.microsoft.com/windows/servercore:latest \ # the fully qualified source image reference
--image servercore:ltsc2019 # the new tag you want the image to have in your registry
```

---
