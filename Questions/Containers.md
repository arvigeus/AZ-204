# Containers

Question: Which of the following methods is recommended when deploying a multi-container group that includes only containers?

- [ ] Azure Resource Management template
- [x] YAML file
- [ ] `az container creates` command

Answer: Due to the YAML format's more concise nature, a YAML file is recommended when your deployment includes only container instances.  
`az container creates` isn't specific to this scenario.

---

Question: Which of the following methods is recommended when deploying a multi-container group that includes containers and additional Azure service resources (for example, an Azure Files share)?

- [x] Azure Resource Management template
- [ ] YAML file
- [ ] `az container creates` command

Answer: Due to the YAML format's more concise nature, a YAML file is recommended when your deployment includes only container instances.  
`az container creates` isn't specific to this scenario.

---

Question: Which of the following options is true about the built-in authentication feature in Azure Container Apps?

- [ ] It can only be configured to restrict access to authenticated users.
- [x] It allows for out-of-the-box authentication with federated identity providers.
- [ ] It requires the use of a specific language or SDK.

Answer: Azure Container Apps provides built-in authentication and authorization features to secure your external ingress-enabled container app with minimal or no code.  
The built-in authentication feature can be configured to handle authenticated and non-authenticated users.

---

Question: What is a revision in Azure Container Apps?

- [ ] A dynamic snapshot of a container app version.
- [ ] A version of a container app that is actively being used.
- [x] An immutable snapshot of a container app version.

Answer: A revision is an immutable snapshot of a container app version.  
The security container running the authentication and authorization module doesn't run in-process, so no direct integration with a specific language is possible.

---

Question: You are tasked with deploying a legacy application written in .NET Framework on Azure. This application's container image is stored in an Azure Container Registry with the address `myAcrRegistry.azurecr.io/myNetApp:latest`.

You need to ensure that the application is properly isolated and manageable within Azure's infrastructure. To do this, write the necessary PowerShell commands to host this application in a container group named `"myContainerGroup"` using Azure Container Instances (ACI).

```ps
# Code here
```

Answer: Because the application needs to be isolated, you need to create a new resource group.

Because .Net Framework is specific to Windows only, you'll need `-OsType "Windows"`

```ps
# Create a new resource group "myResourceGroup"
New-AzResourceGroup -Name "myResourceGroup" -Location "West US"

# Create a new container group "myContainerGroup"
New-AzContainerGroup -ResourceGroupName "myResourceGroup" -Name "myContainerGroup" -Image "myAcrRegistry.azurecr.io/myNetApp:latest" -OsType "Windows"
```

---

Question: You are planning to deploy a legacy application built using .NET Framework as a containerized solution on Azure. Which operating system type should be specified when creating the Azure Container Group for this application?

- [ ] Linux
- [x] Windows
- [ ] Both

Answer: The .NET Framework is Windows-specific, so when creating a container for a .NET Framework application, -OsType "Windows" must be used.

---

Question: You are planning to containerize a .NET Core application for deployment on Azure. When creating the Azure Container Group to host this application, which operating system types are viable options?

- [ ] Linux
- [ ] Windows
- [x] Both

Answer: As .NET Core is a cross-platform framework, it is capable of running on multiple operating systems, including both Linux and Windows. Therefore, both of these options could be potentially specified when creating the Azure Container Group.

---

Question: You are tasked with deploying a .NET Core application on Azure, and you plan to use Azure Container Instances for this purpose. Which PowerShell command should you use to create the necessary resources for hosting this application?

- [ ] `New-AzContainerService`
- [x] `New-AzContainerGroup`
- [ ] First `New-AzContainerGroup`, then `New-AzContainerService`
- [ ] Either `New-AzContainerGroup` or `New-AzContainerService`
- [ ] None of the mentioned

Answer: Azure Container Instances (ACI) are created and managed using the `New-AzContainerGroup` cmdlet. The `New-AzContainerService` cmdlet is used for creating an Azure Kubernetes Service (AKS), which is a different service from ACI.

---

Question: Which command is used for creating a container image?

- [ ] `az acr create`
- [x] `az acr build`
- [ ] `az acr build` then `az acr create`

Answer: `az acr build` is used to create container image  
`az acr create` is used to create Azure Container registry

---

Question: You are working with a resource group, `MultiContainerGroup1`, which contains several services such as Azure Functions, a CosmosDB instance, and multiple container instances. You need to export this resource group for future deployment. Write the Azure CLI command to export the template for this resource group.

```ps
# Code here
```

Answer: You should use a Resource Manager (ARM) template because this format allows the inclusion of multiple Azure services along with the container instances.

```ps
az group export --name MultiContainerGroup1 --output-template-file "./MultiContainerGroup1.json"
az deployment group create --resource-group MultiContainerGroup1 --template-file "./MultiContainerGroup1.json"
```

---

Question: You have just deployed several Azure resources within the `DemoResourceGroup` resource group and you want to capture the template that Azure Resource Manager used for the deployment for future use. How can you accomplish this efficiently?

- [ ] `az group export --name DemoResourceGroup`
- [x] `az group deployment export --name DemoResourceGroup --deployment-name Deployment1`
- [ ] Use the Azure portal to manually inspect and copy the JSON of the deployment template.
- [ ] `Export-AzResourceGroup -Name DemoResourceGroup`

Answer: The `az group deployment export` command is used to export the template that was used for a specific deployment. This command allows you to capture the exact template used by Azure Resource Manager for that particular deployment.  
Using the Azure portal to manually copy the JSON of the deployment template also is valid way to do it, but is a manual process and inefficient.  
`az group export --name DemoResourceGroup` and `Export-AzResourceGroup -Name DemoResourceGroup` export the resource group (which may include many deployments)  
is a manual process that doesn't provide the convenience or automation of a CLI command

---

Question: What is needed to enable authentication on your Azure Container App?

- [x] A configured ingress rule with `allowInsecure` set to disabled
- [x] Any Identity provider
- [x] A specified Authentication / Authorization provider within the app settings
- [ ] A secret key to be embedded in the app's code
- [ ] A Premium Azure service tier subscription
- [ ] An Azure Container App certificate issued by Microsoft
- [ ] Azure Active Directory is required as an Identity provider

Answer: Auth works only with HTTPS, requires any identity provider and specified provider within app settings. Authough AAD is a valid option, it's incorrect to state it's required.

---

Question: You want to store and manage private Docker images that your application will use. Which Azure CLI command would be most appropriate to achieve this?

- [ ] `az containerapp create`
- [x] `az acr create`
- [ ] `az container create`
- [ ] `az containerapp up`

Answer: `az acr create` - The Azure Container Registry (ACR) service stores and manages private Docker container images. Using the `az acr create` command creates a new ACR, allowing you to handle and manage your Docker images.

---

Question: You have a single-container application that doesn't require advanced orchestration features like scaling or networking with other containers. Which Azure CLI command would be the most suitable for this purpose?

- [ ] `az acr create`
- [x] `az container create`
- [ ] `az containerapp create`
- [ ] `az acr build`
- [ ] `az containerapp up`

Answer: `az container create` - Azure Container Instances (ACI) is a service that allows you to run containers directly without the need for any orchestration service. The `az container create` command is used to create these instances, which are ideal for single, isolated workloads.

---

Question 3: Your team has developed a new microservices-based application, and you need to deploy these services on Azure. Which command allows you to deploy these applications with scaling and orchestration features?

- [ ] `az container create`
- [ ] `az acr create`
- [ ] `az acr build`
- [x] `az containerapp create`

Answer: `az containerapp create` - Azure Container Apps is a serverless container service that provides advanced features such as scaling and orchestration. The `az containerapp create` command is used to create a new Azure Container App, which is ideal for deploying microservices.

---

Question: In the context of Dapr, what is the purpose of a Dapr sidecar and how does it interact with a container app?

- [ ] The Dapr sidecar is used to manage the lifecycle of the container app and has no direct interaction with the app itself.
- [x] The Dapr sidecar is used to expose Dapr APIs to the container app, which can be invoked via HTTP or gRPC.
- [ ] The Dapr sidecar is used to provide a user interface for managing the container app and can be accessed via a web browser.
- [ ] The Dapr sidecar is used to store the state of the container app and periodically syncs this state with the app.

Answer: A Dapr sidecar exposes Dapr's APIs to your application, enabling features like service invocation and state management over HTTP or gRPC.  
While Dapr does provide state management capabilities, it's not the sidecar's responsibility to store the state of the container app and periodically sync it.

---

Question: What is the default behavior of Dapr-enabled container apps regarding the loading of Dapr components?

- [ ] They load no components by default.
- [ ] They load only the components specified in the application's configuration.
- [x] They load the full set of deployed components.
- [ ] They load components based on the runtime context.

Answer: They load the full set of deployed components.

---

Question: What is the primary function of the "Observability" feature in Dapr?

- [ ] It provides a user interface for monitoring the state of your application.
- [x] It sends tracing information to an Application Insights backend.
- [ ] It allows you to observe the behavior of other services in your application.
- [ ] It provides a dashboard for visualizing the performance of your application.

Answer: It sends tracing information to an Application Insights backend.

---
