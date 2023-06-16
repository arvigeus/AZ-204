# Container Instances

Question: If you're developing a Linux-based ASP.NET Core application that is planned to be deployed via Azure Container Instances, and you need to launch it in a geographic region where your company doesn't have an existing resource group, what sequence of Azure CLI commands would you utilize to correctly deploy your application in that target region?

```ps
location="West Europe"
resourceGroup="WEurope"
containerGroup="WEuropeGroup"
containerName="AspContainer"
containerImage="mcr.microsoft.com/azuredocs/aci-helloworld"

# Code here
```

Answer:

```ps
location="West Europe"
resourceGroup="WEurope"
containerGroup="WEuropeGroup"
containerName="AspContainer"
containerImage="mcr.microsoft.com/azuredocs/aci-helloworld"

# Create a new resource group in the West Europe region
az group create --name $resourceGroup --location "$location"

# Create a container group (ACI) in the new resource group
az container create --name $containerName --resource-group $resourceGroup --image $containerImage --dns-name-label $containerGroup --location $location
```

---

Question: Your organization has opted to use Azure Container Instances (ACI) to deploy an array of microservices for a new application that require large storage capacity, but must be cost effective as well. Which plan would you choose to ensure the best storage capacity for your Azure Container Instances?

- [ ] Basic
- [ ] Standard
- [ ] Premium
- [ ] Any of the listed
- [x] None of the listed

Answer: In Azure Container Instances, the concept of service plans doesn't exist, and storage is based on the container's image size and volume mounts. You're billed based on the resources (CPU and memory) that your containers use.

---
