# Containers

Question: Which of the following Azure Container Registry options support geo-replication to manage a single registry across multiple regions?

- [ ] Basic
- [ ] Standard
- [x] Premium

Answer: The premium tier adds geo-replication as a feature.

---

Question: Which Azure container registry tiers benefit from encryption-at-rest?

- [x] Basic
- [x] Standard
- [x] Premium

Answer: Encryption-at-rest is supported in all three tiers.

---

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

Question: Which of the following docker images is used to build an ASP.NET app?

- [x] dotnet/core/sdk
- [ ] dotnet/core/aspnet
- [ ] None of these
- [ ] Both

Answer: The `dotnet/core/sdk` image includes the Command Line Tools (CLI) and is optimized for local development, debugging, and unit testing.

---

Question: Which of the following docker images is used to run an ASP.NET app?

- [ ] dotnet/core/sdk
- [x] dotnet/core/aspnet
- [ ] None of these
- [ ] Both

Answer: The `dotnet/core/aspnet` image contains the ASP.NET Core runtime and libraries and is optimized for running apps in production.

---

Question: Which of the following docker images is used to run an ASP.NET app?

- [ ] dotnet/core/sdk
- [x] dotnet/core/aspnet
- [ ] None of these
- [ ] Both

Answer: The `dotnet/core/aspnet` image contains the ASP.NET Core runtime and libraries and is optimized for running apps in production.

---

Question: Define a Dockerfile where build and run in different containers (multi-stage)

```Dockerfile
FROM mcr.microsoft.com/dotnet/core # Fill in details
```

Answer:

```Dockerfile
FROM mcr.microsoft.com/dotnet/core/sdk:3.0 AS build
WORKDIR /app

# copy csproj and restore as distinct layers
COPY *.sln .
COPY aspnetapp/*.csproj ./aspnetapp/
RUN dotnet restore

# copy everything else and build app
COPY aspnetapp/. ./aspnetapp/
WORKDIR /app/aspnetapp
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/core/aspnet:3.0 AS runtime
WORKDIR /app
COPY --from=build /app/aspnetapp/out ./
ENTRYPOINT ["dotnet", "aspnetapp.dll"]
```

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
