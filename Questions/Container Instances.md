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

Question: Suppose you have an ASP.NET Core application running within an Azure Container Instance (ACI) and your monitoring team has a unique container image loaded with their monitoring tools. To ensure compliance, you have been tasked with attaching a "sidecar" container (an auxiliary container that works alongside the main application container) from the same host. However, you must take into account that the solution should be cost-effective and require minimal changes to the current application, keeping the setup simple. What Azure service would you employ to realize this objective?

- [x] ACI Container Groups
- [ ] Azure Kubernetes Service (AKS)
- [ ] Azure App Services
- [ ] Azure Container Registry
- [ ] Azure Service Fabric

Answer: The most suitable service to accomplish this is Azure Container Instances (ACI) Container Groups. This service allows you to run multiple containers, maintained by different teams, deployed together as a group on the same host. Each deployed container instance will share the resources of the host and are able to communicate which each other (in this case: your application and the monitoring sidecar). This offers an economical solution without the need for significant changes to your existing application, and it aligns with the sidecar container model.  
Azure Kubernetes Service (AKS) allows running multiple containers on the same host, which supports the sidecar pattern. However, it introduces additional complexity and potential cost increases due to the need for managing clusters and implementing scaling features.  
Azure App Services provides a platform for hosting web applications and RESTful APIs, including those in containers. The downside is that it does not natively support the sidecar pattern and can lead to higher costs as the scale of operations increases.  
Azure Container Registry serves as a storage and management solution for container images. It is primarily a storage service and does not provide the functionalities to deploy containers or implement the sidecar pattern.  
Azure Service Fabric is a platform that provides orchestration of microservices and containers, and could technically support the sidecar pattern. However, it requires a deeper understanding of the microservices architecture and might not be the most cost-effective or simple solution for running a single application with a monitoring sidecar.
