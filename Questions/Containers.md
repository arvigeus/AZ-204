# Containers

Question: Which of the following methods is recommended when deploying a multi-container group that includes only containers?

- [ ] Azure Resource Management template
- [x] YAML file
- [ ] `az container create` command

Answer: Due to the YAML format's more concise nature, a YAML file is recommended when your deployment includes only container instances.  
`az container creates` isn't specific to this scenario.

---

Question: Which of the following methods is recommended when deploying a multi-container group that includes containers and additional Azure service resources (for example, an Azure Files share)?

- [x] Azure Resource Management template
- [ ] YAML file
- [ ] `az container create` command

Answer: Due to the YAML format's more concise nature, a YAML file is recommended when your deployment includes only container instances.  
`az container create` isn't specific to this scenario.

---

Question: Which of the following options is true about the built-in authentication feature in Azure Container Apps?

- [ ] It can only be configured to restrict access to authenticated users.
- [x] It allows for out-of-the-box authentication with federated identity providers.
- [ ] It requires the use of a specific SDK.

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

- [ ] Linux only
- [x] Windows only
- [ ] Linux or Windows

Answer: The .NET Framework is Windows-specific, so when creating a container for a .NET Framework application, -OsType "Windows" must be used.

---

Question: You are planning to containerize a .NET Core application for deployment on Azure. When creating the Azure Container Group to host this application, which operating system types are viable options?

- [ ] Linux only
- [ ] Windows only
- [x] Linux or Windows

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
- [ ] Microsoft Entra ID is required as an Identity provider

Answer: Auth works only with HTTPS, requires any identity provider and specified provider within app settings. Authough Entra ID is a valid option, it's incorrect to state it's required.

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

Question: Your team has developed a new microservices-based application, and you need to deploy these services on Azure. Which command allows you to deploy these applications with scaling and orchestration features?

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

Question: What is the recommended solution if you need a stable public IP address for your container group, especially considering potential container group restarts?

- [ ] Use a hardcoded IP address in your container group configuration.
- [ ] Configure a different subnet for your container group.
- [ ] Utilize Azure Load Balancer to manage IP address changes.
- [x] Use Application Gateway to ensure a static public IP address.

Answer: To address the potential IP changes when a container group restarts, it's advisable to use Application Gateway. Application Gateway provides a stable public IP address that remains consistent even if the container group's IP changes due to restarts or other factors.

---

Question: If a container group restarts, what will happen to its IP address?

- [ ] The IP address will always remain the same.
- [ ] The IP address will change to a different subnet.
- [x] The IP address might change.
- [ ] The IP address will change only if a new image is deployed.

Answer: When a container group restarts, there's a possibility that its IP address might change. This uncertainty is due to the dynamic nature of container group deployments. It's important not to rely on hardcoded IP addresses in such scenarios.

---

Question: What happens when you update an application secret in Azure Container App?

- [ ] A new revision is created
- [ ] The application restarts to reflect the updated value
- [x] Nothing happens

Answer: Adding, removing, or changing secrets doesn't generate new revisions. Apps need to be restarted to reflect updates.

---

Question: You have deployed a container using the following YAML configuration:

```yaml
apiVersion: 2018-10-01
location: eastus
name: securetest
properties:
  containers:
    - name: mycontainer
      properties:
        environmentVariables:
          - name: "EXPOSED"
            value: "my-exposed-value"
          - name: "SECRET"
            secureValue: "my-secret-value"
  osType: Linux
  restartPolicy: Always
tags: null
type: Microsoft.ContainerInstance/containerGroups
```

You want to retrieve the value of the environment variable "SECRET" using the Azure CLI and execute the following command:

```bash
az container show --resource-group myResourceGroup --name securetest --query "properties.containers[0].properties.environmentVariables[?name=='SECRET']"
```

What should you expect from this command?

- [ ] The value "my-secret-value" will be displayed.
- [ ] An error will be thrown since the secret value cannot be accessed.
- [x] Only the variable's name "SECRET" will be displayed, not its value.
- [ ] The entire container's properties will be displayed.

Answer: The given YAML configuration demonstrates how to set a secure environment variable named "SECRET" with the `secureValue` property. When viewing container properties through the Azure portal or Azure CLI, only the secure variable's name is displayed, not its value. Therefore, executing the given command will show the name of the secure variable "SECRET", but not its actual value.

---

Question: You have deployed a container using the following YAML configuration:

```yaml
apiVersion: 2018-10-01
location: eastus
name: securetest
properties:
  containers:
    - name: mycontainer
    properties:
      image: mcr.microsoft.com/azuredocs/hello-world
      ports:
      - port: 80
      resources:
        requests:
          cpu: 1.0
          memoryInGB: 1.5
  osType: ¯\_(ツ)_/¯
  restartPolicy: Always
tags: null
type: Microsoft.ContainerInstance/containerGroups
```

What should you use for `osType`?

- [ ] AMD64
- [ ] Linux
- [ ] Windows
- [x] Both Linux and Windows will work
- [ ] Neither option will work

Answer: Since this is a single container instance, both Windows and Linux would work. Two or more is for multi-containers, thus Linux only.

---

Question: You have declared a connection string to a queue storage account in the `--secrets` parameter of a container app. Now you need to reference this secret in an environment variable when creating a new revision in your container app.

Which of the following commands correctly references the secret `queue-connection-string` in an environment variable in the Azure CLI?

- [x] `--env-vars "ConnectionString=secretref:queue-connection-string"`
- [ ] `--env-vars "ConnectionString=queue-connection-string"`
- [ ] `--env-vars "ConnectionString=$CONNECTION_STRING"`
- [ ] `--env-vars "ConnectionString=$queue-connection-string"`

Answer: The correct way to reference a secret in an environment variable in the Azure CLI is to set its value to `secretref:`, followed by the name of the secret.

---

Question: You are using the Standard plan of Azure Container Registry, and you've recently noticed an increased delay in the performance of your system. You've been actively using the service for various projects. What could be the possible solutions to address this issue?

- [ ] Upgrade to a more powerful local machine.
- [ ] Upgrade to the Premium plan.
- [x] Delete unused repositories and tags.
- [ ] Increase the bandwidth of your internet connection.
- [ ] Call Azure support.

Answer: Periodically delete unused repositories and tags to improve performance.

---

Question: Which container registry tier has the highest throughput?

- [ ] Basic
- [ ] Standard
- [x] Premium

Answer: Premium has the highest throughput.

---

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

Question: You exceed your Azure Container Registry plan limit, what happens?

- [x] HTTP 429 error (Too many requests)
- [ ] Have to upgrade tier to continue
- [ ] Services will run slower

Answer: You might experience [throttling](https://learn.microsoft.com/en-us/azure/container-registry/container-registry-skus#throttling)

---

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

---

Question: As a developer in a startup, you're helping your team transition to Microsoft Azure. Your task is to deploy a containerized API service, `MyAPI`, on Azure from an older Linux workstation. The source code for `MyAPI` is stored locally in the `./src` directory and is also tracked on the GitHub repository `myuser/myrepo`.

Before deploying, you'll need to create a production environment named `prod`. The Azure CLI on your workstation should be up-to-date, but given its age and the type of service you're deploying, you're unsure if all necessary tools and extensions are available.

`MyAPI` utilizes services that allow for hosting of RESTful APIs and collection and analysis of telemetry data. So, ensure to configure your Azure account accordingly before deployment. Once your local setup is prepared, deploy `MyAPI` to a resource group named `MyResourceGroup` in the `eastus` region using the `prod` environment.

Can you draft an Azure CLI script to achieve these tasks?

```ps
# Code here
```

Answer:

```ps
# Check the current Azure CLI version on the old Linux workstation, and upgrade if needed
az upgrade

# The nature of the application (a containerized service) hints at the need for the containerapp extension. So, add and upgrade it.
az extension add --name containerapp --upgrade

# It's time to connect to Azure once all the local tasks are completed.
# However, you could technically log in at any time before this.
az login

# Register the necessary providers as the application uses services for hosting APIs and telemetry analysis
az provider register --namespace Microsoft.App
az provider register --namespace Microsoft.OperationalInsights

# Create the 'prod' environment
az containerapp env create --resource-group MyResourceGroup --name prod

# Deploy the API service
az containerapp up \
  --name MyAPI \
  --resource-group MyResourceGroup \
  --location eastus \
  --environment prod \
  --context-path ./src \
  --repo myuser/myrepo
```

In the context of deploying containerized applications on Azure, the command `az extension add --name containerapp --upgrade` is essential to interact with Azure Container Apps service. The `--upgrade` flag is used to ensure that you have the latest version of the extension. This is especially critical when your workstation is older, and there's uncertainty regarding the presence and version of the necessary tools and extensions.

The `az login` command logs you into your Azure account. Although we performed all the local tasks like upgrading the Azure CLI and adding the necessary extension before logging into Azure, technically you could log into Azure at any time. The reason why we log in after performing local tasks is just to make sure that we've done everything we can do locally before initiating a connection to Azure. This could help avoid unnecessary delays or connection timeouts, especially if you're on a slow or unreliable network.

- `Microsoft.App`: This namespace is typically used when your application leverages Azure App Services. Azure App Services provide a platform to host web apps, mobile app back ends, RESTful APIs, or automated business processes. If your application doesn't use any of the services provided by Azure App Service, you may not need to register this provider.

- `Microsoft.OperationalInsights`: This namespace is associated with Azure Log Analytics. If your application uses Azure Monitor Log Analytics to collect and analyze telemetry and other data, you need to register this provider. Log Analytics can provide insights about your applications, infrastructure, and network. If you don't use these services, you might not need this provider.

  Note: Explicit provider registration is not typically necessary for Azure services. It's often handled automatically when you create a resource that belongs to a provider, although there can be exceptions.

The command `az containerapp env create` is used to create an environment in Azure Container Apps. This command creates an environment under a specific resource group with a given name. An environment is a space where you can deploy container apps. You can have different environments for different stages of your app like development, staging, and production. Each environment can have its own configuration like compute resources, networking settings, etc. For your use case, we've assumed that the prod environment has been already configured as per your production specifications.

---

Question: As a DevOps engineer at ABC Industries, you are in charge of deploying a Node.js web service that communicates with a MongoDB database to Microsoft Azure. This service relies on environment variables `DB_URL` and `SECRET_TOKEN` for database connection and secure interactions, respectively. The service's Docker image is hosted on Docker Hub under `abcindustries/ai-service-app`.

For deployment, an Azure Container App should be created under the name `ai-service-app`, located in the `westus2` region within the `abc-industries` resource group. The app will run on port 8000 and needs DB_URL and SECRET_TOKEN set to `mongodb://username:password@dbhost:27017/dbname` and `sometoken` respectively. The container instance should have suitable CPU and memory specifications.

Considering these requirements, how would you employ Azure CLI to set up this Azure Container App?

```ps
# Code here
```

Answer:

```ps
# Log into the Azure account
az login

# Upgrade the Azure CLI to the latest version
az upgrade

# Add and upgrade the containerapp extension
az extension add --name containerapp --upgrade

# Register the necessary providers as the microservice uses services for hosting APIs
az provider register --namespace Microsoft.App

# Create the 'dev' environment
az containerapp env create --resource-group MyResourceGroup --name dev

# Create the container application
az containerapp create \
  --name ai-service-app \
  --resource-group abc-industries \
  --environment-variables DB_URL=mongodb://username:password@dbhost:27017/dbname SECRET_TOKEN=sometoken \
  --docker-image abcindustries/ai-service-app \
  --region westus2 \
  --target-port 8000 \
  --cpu <CPU_CORES> \
  --memory <MEMORY_GB>
```

`az containerapp create` gives you more control over the configuration and is suitable for setting up a new application or when making changes to an existing application in a production environment.

---

Question: What is the recommended strategy in the event of a full region outage?

- [x] Wait for the region to recover and then manually redeploy all environments and apps.
- [x] Manually deploy to a new region
- [x] Deploy container apps in advance to multiple regions and use Azure Front Door or Azure Traffic Manager to handle incoming requests.
- [ ] Do nothing and hope for the best.

Answer: All actions are recommended strategies.

---

Question: What is the requirement for enabling zone redundancy in your Container Apps environment?

- [x] The environment must include a virtual network (VNET) with an available subnet.
- [ ] The environment must have at least 10 replicas.
- [ ] The environment must be located in a specific region.
- [ ] The environment must have a specific number of applications running.

Answer: The environment must include a virtual network (VNET) with an available subnet.

---

Question: How can you maintain the availability of a crucial website hosted on Azure Container Apps, even if a single Azure datacenter goes down, while keeping the solution simple and using the least number of Azure services?

- [x] Activate zone redundancy in the Container Apps setting.
- [ ] Set up automatic Azure DevOps deployment pipelines to shift to a new region if the primary datacenter fails.
- [ ] Use multiple regions and route requests via Azure Front Door.

Answer: The optimal solution is to activate zone redundancy in the Container Apps setting. This distributes Azure Container Apps replicas across multiple availability zones, ensuring the website stays operational even if a datacenter fails. Using multiple regions and Azure Front Door or setting up automatic Azure DevOps deployment pipelines would either involve additional services or cause temporary downtime, making them less ideal.

---

Question: You want to use managed identities in the scaling rules for your container app. Which ones can you use?

- [ ] System-assigned identities only
- [ ] User-assigned identities only
- [ ] Both
- [x] None

Answer: Using managed identities in scale rules isn't supported.

---

Question: What is ACR Tasks?

- [ ] A tool for managing virtual machines in Azure
- [x] A suite of features within Azure Container Registry for container image building and patching
- [ ] A service for managing Kubernetes clusters
- [ ] A tool for network monitoring in Azure

Answer: ACR Tasks is a suite of features within Azure Container Registry that provides cloud-based container image building and can automate OS and framework patching for Docker containers.

---

Question: What is the default platform for building images with ACR Tasks?

- [ ] Windows/amd64
- [ ] Linux/arm64
- [x] Linux/amd64
- [ ] Linux/arm

Answer: By default, ACR Tasks builds images for the Linux OS and the amd64 architecture.

---

Question: The az acr build command in Azure Container Registry is used to build and push a container image to ACR. To which of the following Docker commands is this Azure command equivalent? (Choose two)

- [ ] docker run
- [x] docker build
- [x] docker push
- [ ] docker pull
- [ ] docker compose

Answer: The az acr build command is equivalent to the combination of docker build, which builds the Docker image, and docker push, which pushes the image to a registry.

---

Question: What is the default restart policy in Azure Containers?

- [x] Always
- [ ] On failure
- [ ] Never

Answer: Always restart

---

Question: In Azure Container Instances, which restart policy should you choose if you want the containers in the container group to execute only once and not restart?

- [x] Never
- [ ] OnFailure
- [ ] Always

Answer: `Never` policy ensures that the containers in the container group will not be restarted. It aligns with the requirement of running the containers at most once.

---

Question: Which command will set environment variable `MinLength` to `8`?

- [x] `az container create --environment-variables 'MinLength'='8'`
- [x] `az container create --environment-variables 'MinLength=8'`
- [x] `az container create --environment-variables MinLength=8`
- [ ] `az container create --environment-variables {'MinLength':8}`
- [ ] `az container create --environment-variable-name 'MinLength' --environment-variable-value 8`

Answer: `az container create --environment-variables 'MinLength'='8' 'NumWords'='5' ...`

---

Question: You are working on a project that requires deploying a containerized application in Azure. The application has two key requirements: It needs to run a process that requires root access, and it must be hosted on a Windows-based operating system. You are considering Azure Container Apps as a hosting option. Which of the following statements is correct regarding the feasibility of using Azure Container Apps for this project?

- [ ] Azure Container Apps can fulfill both requirements.
- [ ] Azure Container Apps can only fulfill the requirement of running a process that requires root access but not the Windows-based operating system requirement.
- [ ] Azure Container Apps can only fulfill the Windows-based operating system requirement but not the requirement of running a process that requires root access.
- [x] Azure Container Apps cannot fulfill either of the requirements for this project.

Answer: Azure Container Apps can't run privileged containers, and if a process requires root access, it will cause a runtime error. This rules out fulfilling the first requirement. It also only support Linux-based (linux/amd64) container images, which rules out hosting on a Windows-based operating system.

---

Question: What will happen if you change `template.scale.maxReplicas` from 3 to 5?

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [
    {
      "properties": {
        "template": {
          "scale": {
            "minReplicas": 1,
            "maxReplicas": 3
          }
        }
      }
    }
  ]
}
```

- [ ] All existing revisions will have max 5 replicas now.
- [ ] A new revision is created. All revisions now have 5 max replicas now.
- [x] A new revision is created with 5 max replicas. All existing revisions remain unchanged.

Answer: Changes made to the `template` section are revision-scope changes, which triggers a new revision. The changes are limited to the revision in which they're deployed, and don't affect other revisions.

---

Question: What will happen if you change `configuration.ingress.allowInsecure` from `false` to `true`?

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [
    {
      "properties": {
        "configuration": {
          "ingress": {
            "external": true,
            "targetPort": 80,
            "allowInsecure": false
          }
        }
      }
    }
  ]
}
```

- [x] All existing revisions will now allow insecure traffic.
- [ ] A new revision is created. All revisions will now allow insecure traffic.
- [ ] A new revision is created that allows insecure traffic. All existing revisions remain unchanged.

Answer: Changes made to the `configuration` section are application-scope changes, which does not triggers a new revision, but affects all existing revisions.

---

Question: What command should you execute to verify if your image has been successfully pushed to Azure Container Registry?

- [x] `az acr repository list`
- [ ] `docker images`
- [ ] `az acr show`
- [ ] `az acr login`
- [ ] `az acr task list`

Answer: `az acr repository list` lists the repositories in the specified Azure Container Registry, allowing you to verify if your image is present.  
`docker images` lists the images available on your local machine, not in the Azure Container Registry.  
`az acr show` retrieves detailed information about the specified container registry, but does not list the images or repositories.  
`az acr task list` lists all the tasks for a specified container registry, which are used for automated container image building.

---

Question: Which command is used to deploy an image in Azure Container Instances (ACI)?

- [ ] `az container push`
- [x] `az container create`
- [ ] `az container export`
- [ ] `docker build`

Answer: `az container create` is the correct command to deploy a container in Azure Container Instances (ACI)  
`az container push` is not a valid Azure CLI command.  
`az container export` exports a container group in yaml format.  
`docker build` builds a Docker image from a Dockerfile, not related to deploying a container.

---

Question: You are planning to use Azure Container Registry for your application. Which identity type should you use to ensure both headless authentication and role-based access control (RBAC)?

- [ ] Individual Entra ID Identity
- [ ] Managed Identity for Azure Resources
- [x] Entra ID Service Principal
- [ ] Admin User

Answer: Service principals are designed for headless authentication and can be assigned specific Azure roles, making them ideal for both requirements.  
Individual Entra ID Identity and Admin User are used for interactive push/pull operations.  
Managed Identity for Azure Resources: While it supports unattended operations, it's limited to select Azure services and may not offer the full range of RBAC options.

---

Question: You need to attach the standard output and standard error streams of a running container in Azure to your terminal. Which Azure CLI command should you use?

- [ ] `az container logs`
- [ ] `az container exec`
- [x] `az container attach`
- [ ] `az container start`

Answer: `az container attach` is used to attach the standard output and standard error streams of a running container to your terminal.  
`az container logs` is used to fetch the logs for a container in a container group.

---

Question: You need to mount Azure Files in `/aci/logs/`. Under which property in the YAML file `mountPath: /mnt/secrets/` will go?

- [ ] volumes
- [x] volumesMounts

Answer: `volumesMounts` - Where to mount.

---

Question: You need to mount Azure Files in `/aci/logs/`. Under which property in the YAML file `azureFile:` will go?

- [x] volumes
- [ ] volumesMounts

Answer: `volumes` - What to mount.

---

Question:

Your organization utilizes an Azure container registry. What is the most restrictive role you should assign to developers so they can upload/publish images to the registry without granting excessive permissions?

- [ ] `Owner`
- [ ] `Contributor`
- [x] `AcrPush`
- [ ] `AcrPull`

Answer: The `AcrPush` role allows developers to push images to the Azure container registry while adhering to the principle of least privilege.

---

Question: You are using Azure Container Instances (ACI) to run a container that requires access to an Azure File Share. Which of the following is required to mount the Azure File Share to the ACI?

- [x] Storage Account Key
- [ ] Shared Access Signature (SAS) Token
- [ ] OAuth Token
- [ ] Entra ID Credentials

Answer: To mount an Azure File Share to an Azure Container Instance, you need the Storage Account Key. SAS Tokens, OAuth Tokens, and Entra ID Credentials are not used for this specific operation.

---

Question: You have a containerized application that requires automatic updates whenever the image in Azure Container Registry (ACR) is updated. What should you configure?

- [ ] Azure DevOps Pipeline
- [x] Webhooks
- [ ] Azure Event Hub
- [ ] Azure Event Grid

Answer: Webhooks in Azure Container Registry allow you to trigger actions in response to events like image pushes or pulls, making it suitable for automating updates.

---

What storage service should you utilize to ensure persistent storage for a new Azure container instance running a SQL Server database within a Docker image?

- [ ] Azure Table storage
- [ ] Azure Queue storage
- [ ] Azure Blob storage
- [x] Azure Files

Answer:

- Azure Files is the correct choice as it offers SMB protocol support, making it suitable for persistent storage for SQL Server instances in containers.
- Azure Blob storage lacks SMB support needed for SQL Server instances in containers.
- Azure Table storage is for NoSQL data and not suitable for SQL Server persistent storage.
- Azure Queue storage is for message queuing and not for persistent storage.
