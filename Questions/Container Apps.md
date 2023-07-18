# Container Apps

As a developer in a startup, you're helping your team transition to Microsoft Azure. Your task is to deploy a containerized API service, `MyAPI`, on Azure from an older Linux workstation. The source code for `MyAPI` is stored locally in the `./src` directory and is also tracked on the GitHub repository `myuser/myrepo`.

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

Question: Which managed entity requirest minimum effort to use?

- [x] System-assigned identity
- [ ] User-assigned identity

Answer: A system-assigned identity is tied to your container app and is deleted when your container app is deleted.

---

Question: You have an existing container map with a system assigned identity. What happens when you finish using that app and delete it?

- [ ] You can reuse this identity for another container app
- [x] The system assigned identity gets deleted, thus cannot be reused
- [ ] You cannot delete a container app before deleting it system assigned identity

Answer: A system-assigned identity is tied to your container app and is deleted when your container app is deleted.

---

Question: You have an existing container map with a user assigned identity. What happens when you finish using that app and delete it?

- [x] You can reuse this identity for another container app
- [ ] The user assigned identity gets deleted, thus cannot be reused
- [ ] You cannot delete a container app before deleting it system assigned identity

Answer: A user-assigned identity is a standalone Azure resource that can be assigned to your container app and other resources.

---

Question: You want to use managed identity across multiple container apps. Which one would you choose?

- [ ] System-assigned identity
- [x] User-assigned identity
- [ ] Both
- [ ] None

Answer: A user-assigned identity is a standalone Azure resource that can be assigned to your container app and other resources.

---

Question: You want to use multiple managed identities for your container app. Which ones can you use?

- [ ] System-assigned identities only
- [x] User-assigned identities only
- [ ] Both
- [ ] None

Answer: A container app can have multiple user-assigned identities.

---

Question: You want to use managed identities in the scaling rules for your container app. Which ones can you use?

- [ ] System-assigned identities only
- [ ] User-assigned identities only
- [ ] Both
- [x] None

Answer: Using managed identities in scale rules isn't supported.

---

Question: Which of the following managed entity types does not require explicit enabling to work?

- [ ] System-assigned identity
- [ ] User-assigned identity
- [ ] Both of these
- [x] None of these

Answer: Both System-assigned and User-assigned managed identities require explicit enabling.

---

Question: An e-commerce company is planning to migrate their monolithic application to a microservices architecture. They want to leverage Azure Container Apps for this purpose. The application needs to interact with Azure Key Vault to retrieve secrets and Azure SQL Database for storing and retrieving data. The company wants to avoid storing and managing credentials in their application code. Which type of managed identity would fit this scenario?

- [x] System-assigned identity
- [ ] User-assigned identity
- [ ] Any of these
- [ ] None of these

Answer: This scenario is best suited for a System-assigned managed identity. System-assigned managed identities are tied to the lifecycle of the Azure resource (in this case, the Azure Container App) and are automatically cleaned up by Azure when the resource is deleted. The application can use the System-assigned managed identity to authenticate to any service that supports Azure AD authentication without having any credentials in the code. The Azure Container App can be granted access to the Azure Key Vault and Azure SQL Database using Azure role-based access control (RBAC).

---

Question: A software company is developing a multi-tenant SaaS application that will be hosted on Azure Container Apps. Each tenant will have their own Azure Storage account for storing data. The application needs to access these storage accounts on behalf of the tenants. The company wants to manage the identities separately from the Azure Container Apps and wants to have one or more pre-configured entities for each tenant. Which type of managed identity would fit this scenario?

- [ ] System-assigned identity
- [x] User-assigned identity
- [ ] Any of these
- [ ] None of these

Answer: This scenario is best suited for User-assigned managed identities. User-assigned managed identities are standalone Azure resources that can be assigned to one or more instances of an Azure service. In this case, each tenant can have a User-assigned managed identity that is granted access to their Azure Storage account. The Azure Container App can then use these identities to authenticate to the storage accounts on behalf of the tenants. When a tenant leaves, the User-assigned managed identity can be removed from the Azure Container App and deleted.

---
