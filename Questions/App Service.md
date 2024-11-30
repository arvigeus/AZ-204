# Azure App Service

Question: Which of the following networking features of App Service can be used to control outbound network traffic?

- [ ] App-assigned address
- [x] Hybrid Connections
- [ ] Service endpoints

Answer: Hybrid Connections are an outbound network feature.

---

Question: Which of the following networking features of App Service are outbound?

- [ ] App-assigned address
- [x] Hybrid Connections
- [ ] Service endpoints
- [x] Virtual network integration
- [x] Gateway-required virtual network integration
- [ ] Access restrictions
- [ ] Private endpoints

Answer: What's listed.

---

Question: Which of the following networking features of App Service are inbound?

- [x] App-assigned address
- [ ] Hybrid Connections
- [x] Service endpoints
- [ ] Virtual network integration
- [ ] Gateway-required virtual network integration
- [x] Access restrictions
- [x] Private endpoints

Answer: What's listed.

---

Question: When would you use the App-assigned address feature?

- [ ] To access an on-premises database server.
- [x] To support IP-based SSL for your app.
- [ ] To access resources in your Azure virtual network.
- [ ] To restrict access to your app from a set of well-defined IP addresses.
- [x] To support a dedicated inbound address for your app.

Answer: To support IP-based SSL for your app, To support a dedicated inbound address for your app.

---

Question: When would you use Access restrictions feature?

- [x] To restrict access to your app from a set of well-defined IP addresses.
- [ ] To access an on-premises system securely.
- [ ] To access resources in your Azure virtual network.
- [ ] To support IP-based SSL for your app.
- [ ] To restrict access to your Azure Service Resources to only your virtual network.

Answer: To restrict access to your app from a set of well-defined IP addresses.

---

Question: When would you use Service endpoints/Private endpoints feature?

- [x] To restrict access to your Azure Service Resources to only your virtual network.
- [ ] To support IP-based SSL for your app.
- [ ] To access an on-premises system securely.
- [ ] To access resources in your Azure virtual network or on-premises network over ExpressRoute or site-to-site VPN.
- [ ] To restrict access to your app from a set of well-defined IP addresses.

Answer: To restrict access to your Azure Service Resources to only your virtual network.

---

Question: When would you use Private endpoints features?

- [x] To restrict access to your Azure Service Resources to only your virtual network.
- [x] To expose your app on a private IP in your virtual network
- [ ] To support IP-based SSL for your app.
- [ ] To access an on-premises system securely.
- [ ] To access resources in your Azure virtual network or on-premises network over ExpressRoute or site-to-site VPN.
- [ ] To restrict access to your app from a set of well-defined IP addresses.

Answer: To restrict access to your Azure Service Resources to only your virtual network; to expose your app on a private IP in your virtual network.

---

Question: When would you use Hybrid Connections feature?

- [x] To access an on-premises system or service securely.
- [ ] To restrict access to your app from a set of well-defined IP addresses.
- [ ] To support IP-based SSL for your app.
- [ ] To restrict access to your Azure Service Resources to only your virtual network.
- [ ] To access resources in your Azure virtual network.

Answer: To access an on-premises system or service securely.

---

Question: When would you use Gateway-required virtual network integration feature?

- [x] To access resources in your Azure virtual network or on-premises network over ExpressRoute or site-to-site VPN.
- [ ] To restrict access to your Azure Service Resources to only your virtual network.
- [ ] To support IP-based SSL for your app.
- [ ] To access an on-premises system securely.
- [ ] To support a dedicated inbound address for your app.

Answer: To access resources in your Azure virtual network or on-premises network over ExpressRoute or site-to-site VPN.

---

Question: When would you use Virtual network integration feature?

- [x] To access resources in your Azure virtual network.
- [ ] To restrict access to your app from a set of well-defined IP addresses.
- [ ] To access an on-premises system securely.
- [ ] To support IP-based SSL for your app.
- [ ] To restrict access to your Azure Service Resources to only your virtual network.

Answer: To access resources in your Azure virtual network.

---

Question: In which of the following app configuration settings categories would you set the language and SDK version?

- [ ] Application settings
- [ ] Path mappings
- [x] General settings

Answer: General Settings is used to configure stack, platform, debugging, and incoming client certificate settings.

---

Question: By default, all client requests to the app's production URL (`http://<app_name>.azurewebsites.net`) are routed to the production slot. One can automatically route a portion of the traffic to another slot. What is the default routing rule applied to new deployment slots?

- [x] 0%
- [ ] 10%
- [ ] 20%
- [ ] 50%

Answer: By default, new slots are given a routing rule of `0%`

---

Question: Some configuration elements follow the content across a swap (not slot specific), whereas other configuration elements stay in the same slot after a swap (slot specific). Which of the following settings are swapped?

- [ ] Publishing endpoints
- [x] WebJobs content
- [ ] WebJobs schedulers

Answer: WebJobs content is swapped.

---

Question: Suppose you are a developer tasked with deploying a new .NET web application using on Microsoft Azure. Your first task is to create a new resource group `myResourceGroup` located in the South Central US region. Following that, you need to establish a deployment user for the web application. You are then required to create `myAppServicePlan` App Service plan within a Linux environment that is cost-efficient. The web application should be created within this resource group and App Service plan, using .NET as its runtime. You are also required to configure the application settings to set the deployment branch to `main`. Lastly, you are provided with a sample application from GitHub: `https://github.com/Azure-Samples/App-Service-Troubleshoot-Azure-Monitor`. You need to clone this application, rename the default branch to `main`, add the Azure remote repository using the URL from the webapp create command, and push the code to the Azure repository. How would you accomplish these tasks using Azure CLI commands?

```ps
# Code here
```

Answer:

```ps
# Create a new resource group in the South Central US region
az group create --name myResourceGroup --location "South Central US"

# Set up a deployment user for the web application
az webapp deployment user set --user-name <username> --password <password>

# Create an App Service plan with a Linux environment. The SKU B1 is chosen for its cost efficiency.
az appservice plan create --name myAppServicePlan --resource-group myResourceGroup --sku B1 --is-linux

# Create the web application within the resource group and the App Service plan, using .NET as its runtime
az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name MyApp --runtime "DOTNET|6.0" --deployment-local-git

# Capture the Git URL from the output of the previous command
git_url=$(az webapp show --name MyApp --resource-group myResourceGroup --query gitUrl --output tsv)

# Configure the application settings to set the deployment branch to 'main'
az webapp config appsettings set --name MyApp --resource-group myResourceGroup --settings DEPLOYMENT_BRANCH='main'

# Clone the sample application from GitHub
git clone https://github.com/Azure-Samples/App-Service-Troubleshoot-Azure-Monitor

# Navigate into the cloned repository
cd App-Service-Troubleshoot-Azure-Monitor

# Rename the default branch to 'main'
git branch -m main

# Add the Azure remote repository using the URL from the webapp create command
git remote add azure $git_url

# Push the code to the Azure repository
git push azure main
```

---

Question: You're an Azure developer with the task of deploying a PHP web app from a GitHub repo to Azure App Services. As a part of your workflow, you want to test the new features of your app in a safe, isolated environment before making it live.

Your task is to script the process to deploy the app to an Azure App Service, using a staging deployment slot to validate updates before they go live. This involves creating all necessary resources in Azure, such as a resource group and an App Service plan. After verifying the new version of the app works as expected, swaps the staging slot into production. It should be optimized for cost efficiency.

```ps
let "randomIdentifier=$RANDOM*$RANDOM"
location="East US"
resourceGroup="msdocs-app-service-rg-$randomIdentifier"
tag="deploy-deployment-slot.sh"
appServicePlan="msdocs-app-service-plan-$randomIdentifier"
webapp="msdocs-web-app-$randomIdentifier"
gitrepo=https://github.com/Azure-Samples/php-docs-hello-world

# Code here
```

Answer:

```ps
let "randomIdentifier=$RANDOM*$RANDOM"
location="East US"
resourceGroup="msdocs-app-service-rg-$randomIdentifier"
tag="deploy-deployment-slot.sh"
appServicePlan="msdocs-app-service-plan-$randomIdentifier"
webapp="msdocs-web-app-$randomIdentifier"
gitrepo=https://github.com/Azure-Samples/php-docs-hello-world

# Create a resource group.
az group create --name $resourceGroup --location "$location" --tag $tag

# Create an App Service plan in STANDARD tier (minimum required by deployment slots).
echo "Creating $appServicePlan"
az appservice plan create --name $appServicePlan --resource-group $resourceGroup --location "$location" \
--sku S1

# Create a web app
az webapp create --name $webapp --plan $appServicePlan --resource-group $resourceGroup

# Create a deployment slot with the name "staging".
az webapp deployment slot create --name $webapp --resource-group $resourceGroup --slot staging

# Deploy sample code to "staging" slot from GitHub.
az webapp deployment source config --name $webapp --resource-group $resourceGroup --slot staging --repo-url $gitrepo --branch master --manual-integration

# Swap the verified/warmed up staging slot into production.
az webapp deployment slot swap --name $webapp --resource-group $resourceGroup \
    --slot staging
```

Note: If there was no deployment slots requirenments, `az webapp deployment slot create` and `az webapp deployment slot swap` (and `--slot staging` in `az webapp deployment source config`) could be dropped, and app service plan can go as low as FREE.

---

Question: You're an Azure developer working on a hobby project, deploying a PHP web app from a GitHub repo to Azure App Services. As part of your hands-on learning, you aim to automate the entire deployment process using a script.

Your mission is to script the deployment of the app to an Azure App Service. This process involves spinning up all the necessary resources in Azure, such as a resource group and an App Service plan. The goal is to have your application live and running on the Azure App Service at the end of the script execution, avoiding unnecessary costs.

```ps
let "randomIdentifier=$RANDOM*$RANDOM"
location="East US"
resourceGroup="msdocs-app-service-rg-$randomIdentifier"
tag="deploy-github.sh"
gitrepo=https://github.com/Azure-Samples/php-docs-hello-world
appServicePlan="msdocs-app-service-plan-$randomIdentifier"
webapp="msdocs-web-app-$randomIdentifier"

# Code here
```

Answer:

```ps
let "randomIdentifier=$RANDOM*$RANDOM"
location="East US"
resourceGroup="msdocs-app-service-rg-$randomIdentifier"
tag="deploy-github.sh"
gitrepo=https://github.com/Azure-Samples/php-docs-hello-world
appServicePlan="msdocs-app-service-plan-$randomIdentifier"
webapp="msdocs-web-app-$randomIdentifier"

# Create a resource group.
az group create --name $resourceGroup --location "$location" --tag $tag

# Create an App Service plan in `FREE` tier.
az appservice plan create --name $appServicePlan --resource-group $resourceGroup --sku FREE

# Create a web app.
az webapp create --name $webapp --resource-group $resourceGroup --plan $appServicePlan

# Deploy code from a public GitHub repository.
az webapp deployment source config --name $webapp --resource-group $resourceGroup \
    --repo-url $gitrepo --branch master --manual-integration
```

Note: If there is deployment slots requirenment, then `az webapp deployment slot create` and `az webapp deployment slot swap` (and `--slot staging` in `az webapp deployment source config`) should be added. Also the app service plan should be bumped to STANDARD.

---

Question: You're building an ASP.NET Core Linux application utilizing Azure App Service Web App for Containers. You aim to deploy the application in a region in which your company's subscription does not currently have a resource group in there. What are the necessary Azure command-line interface (CLI) commands to deploy the application in that appropriate region?

```ps
location="West Europe"
resourceGroup="WEurope"
appServicePlan="WEuropePlan"
appName="AspApp"
containerImage="mcr.microsoft.com/dotnet/samples:aspnetapp"

# Code here
```

Answer:

```ps
location="West Europe"
resourceGroup="WEurope"
appServicePlan="WEuropePlan"
appName="AspApp"
containerImage="mcr.microsoft.com/dotnet/samples:aspnetapp"

# Create a new resource group in the West Europe region
az group create --name $resourceGroup --location "$location"

# Create an App Service plan in the West Europe region
az appservice plan create --name $appServicePlan --resource-group $resourceGroup --location "$location" --is-linux

# Create a web app in the new App Service Plan
az webapp create --name $appName --resource-group $resourceGroup --plan $appServicePlan --deployment-container-image-name $containerImage
```

---

Question: Imagine you are tasked with setting up a WordPress application for your company's blog. The application should run in a Docker multi-container environment, with the configuration provided in the `docker-compose-wordpress.yml` file. The WordPress application should connect to a new MySQL database, both to be hosted on Microsoft Azure. After the initial setup, you need to accommodate changes in your WordPress configuration, which will be done by modifying the Docker compose file and applying the changes. How would you handle this?

```ps

location="West Europe"
resourceGroup="WEurope"
appServicePlan="WEuropePlan"
appName="WpApp"
wordpressDbServer="wp-database"
wordpressDb="wordpress"
wordpressAdmin="adminuser"
wordpressPassword="My5up3rStr0ngPaSw0rd!"

# Code here
```

Answer:

```ps
location="West Europe"
resourceGroup="WEurope"
appServicePlan="WEuropePlan"
appName="WpApp"
wordpressDbServer="wp-database"
wordpressDb="wordpress"
wordpressAdmin="adminuser"
wordpressPassword="My5up3rStr0ngPaSw0rd!"

# Create a new resource group
az group create --name $resourceGroup --location "$location"

# Create a new App Service plan
az appservice plan create --name $appServicePlan --resource-group $resourceGroup --location "$location" --is-linux

# Create a new MySQL server
az mysql server create --resource-group $resourceGroup --name $wordpressDbServer --location "$location" --admin-user $wordpressAdmin --admin-password wordpressPassword
az mysql db create --resource-group $resourceGroup --server-name $wordpressDbServer --name $wordpressDb

# Create a web app
az webapp create --resource-group $resourceGroup --plan $appServicePlan --name $appName --multicontainer-config-type compose --multicontainer-config-file docker-compose-wordpress.yml
# Set environment variables
az webapp config appsettings set --resource-group $resourceGroup --name $appName --settings WORDPRESS_DB_HOST="$wordpressDbServer.mysql.database.azure.com" WORDPRESS_DB_USER="$wordpressAdmin" WORDPRESS_DB_PASSWORD="wordpressPassword" WORDPRESS_DB_NAME="$wordpressDb"

# Update app after editing docker-compose-wordpress.yml
az webapp config container set --resource-group $resourceGroup --name $appName --multicontainer-config-type compose --multicontainer-config-file docker-compose-wordpress.yml
```

---

Question: Suppose you're responsible for migrating your company's online store application to a Kubernetes environment hosted on Azure (AKS). This application has a set of microservices, each defined in `serviceA.yaml`, `serviceB.yaml`, and `serviceC.yaml` YAML files. You need to ensure the successful deployment and management of these microservices. Also, let's say you are required to monitor the performance and health of your application, for which you decide to integrate Azure Monitor for containers. How would you accomplish this task?

```ps
# Variables
resourceGroup="MyResourceGroup"
AKSClusterName="MyAKSCluster"
location="West Europe"
monitorWorkspace="MyMonitorWorkspace"
```

Answer:

```ps
# Variables
resourceGroup="MyResourceGroup"
AKSClusterName="MyAKSCluster"
location="West Europe"
monitorWorkspace="MyMonitorWorkspace"

# Create a new resource group in the specified location
az group create --name $resourceGroup --location "$location"

# Create a new AKS cluster in the resource group
az aks create --resource-group $resourceGroup --name $AKSClusterName --generate-ssh-keys

# Get the credentials for the AKS cluster
az aks get-credentials --resource-group $resourceGroup --name $AKSClusterName

# Deploy the microservices to the AKS cluster using their respective YAML files
kubectl apply -f serviceA.yaml
kubectl apply -f serviceB.yaml
kubectl apply -f serviceC.yaml

# Create Log Analytics workspace
az monitor log-analytics workspace create --resource-group $resourceGroup --workspace-name $monitorWorkspace --location $location

# Enable Azure Monitor for containers
az aks enable-addons --resource-group $resourceGroup --name $AKSClusterName --addons monitoring --workspace-resource-id $monitorWorkspace
```

---

Question: Imagine you are tasked with deploying a web application on Azure App Service. As part of the task, you are also expected to set up Application Insights for monitoring the performance and usage data of the application, located in resource group `$resourceGroup` and app service plan `$appServicePlan` in location `$location`. All of these activities should be performed using the Azure CLI. How would you go about accomplishing this?

```ps
appName="MyWebApp"
appInsightsName="MyAppInsights"
```

Answer:

```ps
appName="MyWebApp"
appInsightsName="MyAppInsights"

# Create a web app
az webapp create --name $appName --resource-group $resourceGroup --plan $appServicePlan

# Create a new Application Insights resource in the resource group
az monitor app-insights component create --app $appInsightsName --location "$location" --resource-group $resourceGroup

# Enable Application Insights for the web app
az webapp config appsettings set --name $appName --resource-group $resourceGroup --settings APPINSIGHTS_INSTRUMENTATIONKEY="$(az monitor app-insights component show --app $appInsightsName --resource-group $resourceGroup --query instrumentationKey --output tsv)"
```

In the last command, we are using the Azure CLI to get the Instrumentation Key of the newly created Application Insights resource. The `--query` parameter allows us to specify the data to extract, and `--output tsv` is used to format the output as Tab-separated values, which gives us a clean output to use in setting the `APPINSIGHTS_INSTRUMENTATIONKEY` setting.

---

Question: As an Azure Cloud Engineer, your company needs you to streamline the deployment process of their web applications. To help achieve this, they've asked you to automate the process using a bash script.

Here's your mission: the script needs to set up an environment in Azure that pulls a Docker container named `companywebapp:latest` from your company's private registry and deploys it to an Azure App Service in the East US region.

The resources that need to be created include a resource group (tagged with `deploy-linux-docker-app-only.sh`), an app service plan, and a web app. Can you write a script that fulfills these requirements?

```ps
let "randomIdentifier=$RANDOM*$RANDOM"
resourceGroup="msdocs-app-service-rg-$randomIdentifier"
appServicePlan="msdocs-app-service-plan-$randomIdentifier"
webapp="msdocs-web-app-$randomIdentifier"
registryUrl="https://yourCompanyRegistry.azurecr.io"

# Code here
```

Answer:

```ps
let "randomIdentifier=$RANDOM*$RANDOM"
resourceGroup="msdocs-app-service-rg-$randomIdentifier"
appServicePlan="msdocs-app-service-plan-$randomIdentifier"
webapp="msdocs-web-app-$randomIdentifier"
registryUrl="https://yourCompanyRegistry.azurecr.io"

location="East US"
tag="deploy-linux-docker-app-only.sh"
dockerHubContainerPath="simplewebapp:latest"

# Create a resource group.
az group create --name $resourceGroup --location "$location" --tag $tag

# Create an App Service plan
az appservice plan create --name $appServicePlan --resource-group $resourceGroup

# Create a web app.
az webapp create --name $webapp --resource-group $resourceGroup --plan $appServicePlan  --runtime "NODE|14-lts"

# Configure the web app to use the Docker container image from your company's custom registry
az webapp config container set --name $webapp --resource-group $resourceGroup --docker-custom-image-name $dockerHubContainerPath --docker-registry-server-url $registryUrl
```

Note: `--docker-registry-server-url` is not needed if the image is on DockerHub

---

Question: How to access client certificate for Asp.Net app?

- [x] `HttpRequest.ClientCertificate` property
- [ ] Through the HTTPS request header
- [ ] Through a URL query string
- [ ] Through the client cookie

Answer: For ASP.NET, the client certificate is available through the `HttpRequest.ClientCertificate` property.  
For other application stacks (Node.js, PHP, etc.), the client cert is available in your app through a base64 encoded value in the `X-ARR-ClientCert` request header.

---

Question: How to access client certificate for Node.js app?

- [ ] `HttpRequest.ClientCertificate` property
- [x] Through the HTTPS request header
- [ ] Through a URL query string
- [ ] Through the client cookie

Answer: For Node.js, the client cert is available in your app through a base64 encoded value in the `X-ARR-ClientCert` request header.
For ASP.NET, the client certificate is available through the `HttpRequest.ClientCertificate` property.

---

Question: How to enable client certificates through interface?

Answer: `Configuration > General Settings`. Set `Client certificate mode` to **Require**

---

Question: How to require client certificates for a webapp?

```ps
# Code here
```

Answer:

```ps
az webapp update --set clientCertEnabled=true --name <app-name> --resource-group <group-name>
```

---

Question: As an Azure Cloud Engineer, you received a complaint from a client who is running tests on your web application from `http://localhost:5000`. They reported an error stating: `Access to XMLHttpRequest at 'http://myWebApp.azurewebsites.net' from origin 'http://localhost:5000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.` Fix that!

The web application resides in a resource group named `myResourceGroup`.

```ps
# Code here
```

Answer:

```ps
az webapp cors add --resource-group myResourceGroup --name myWebApp --allowed-origins 'http://localhost:5000'
```

---

Question: As an Azure Cloud Engineer, you received an email from a client who's trying to access data in one of your Blob Storage accounts from their local machine at `http://localhost:5000`. They've been encountering an error message that says: `Access to XMLHttpRequest at 'https://myStorageAccount.blob.core.windows.net' from origin 'http://localhost:5000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.`. Fix that!

```ps
# Code here
```

Answer:

```ps
az storage cors add --services blob --methods GET POST --origins 'http://localhost:5000' --allowed-headers '*' --exposed-headers '*' --max-age 200 --account-name myStorageAccount
```

---

Question: Several users have reported receiving HTTP 500 errors when attempting to connect to the web app you have developed using Azure App Service. To allow developers to see the connection error details in real-time, what action is required on your part?

- [x] Enable the Web Server Logging feature.
- [ ] Create a security playbook.
- [ ] Enable the Application Logging feature.
- [ ] Create resource health alerts.

Answer: You must enable Web Server Logging in Azure App Service when handling raw HTTP requests data. The logs contain details like HTTP method, resource URI, client IP and port, user agent, response code, etc. You can save these logs in storage or a file system, and specify the number of days for retaining them.

---

Question: Which of the following types of application logging is supported on the Linux platform?

- [ ] Web server logging
- [ ] Failed request tracing
- [ ] Detailed Error Messages
- [x] Deployment logging
- [x] Application logging

Answer: Deployment and Application logging are supported on the Linux platform.

---

Question: Which of the following types of application logging supporteds blob storage?

- [x] Web server logging
- [ ] Failed request tracing
- [ ] Detailed Error Messages
- [ ] Deployment logging
- [x] Application logging

Answer: Web server and Application logging are support blob storage.

---

Question: Which of the following statements are true for application logging?

- [ ] You can choose App Service file system or Blob storage logging, but not both
- [x] Only .NET application logs can be written to the blob storage
- [x] You can use other Azure services for logging and monitoring
- [x] App Service file system (Filesystem) will turn itself off in 12 hours
- [ ] Blob storage logging will turn itself off in 12 hours
- [x] Blob storage is for long-term logging
- [ ] App Service file system logging is more detailed than Blob storage logging
- [x] Logs can be reatained for specified amount of days
- [x] For logs stored in the App Service file system, you can download the ZIP file in the browser
- [ ] Filesystem and storage Blob storage are supported for both Windows and Linux apps.

Answer:

- App Service file system logging is temporary logging, Blob storage logging is for long term
- Blob storage is only applicable for Web server and Application logging
- Blob storage logging is more detailed than App Service file system
- Filesystem storage is the only available option for Linux. Windows supports both filesystem and blob storage
- ZIP file of logs is stored at:
  - For Linux/custom containers: `https://<app-name>.scm.azurewebsites.net/api/logs/docker/zip`
  - For Windows apps: `https://<app-name>.scm.azurewebsites.net/api/dump`

---

Question: Imagine you are a developer who needs to set up monitoring for a .NET web application named `myApp` deployed on Microsoft Azure. Your task is to leverage Azure Monitor by creating a Log Analytics workspace within an existing resource group named `myResourceGroup`. After creating the workspace, you need to retrieve the resource ID of the web application and the workspace ID of the newly created Log Analytics workspace. With these IDs, you are then tasked with creating diagnostic settings for the web application to enable Azure Monitor to collect console logs and HTTP logs. How would you perform these tasks using Azure CLI commands?

```ps
# Code here
```

Answer:

```ps
# Create a Log Analytics workspace within the existing resource group named 'myResourceGroup'
az monitor log-analytics workspace create --resource-group myResourceGroup --workspace-name myMonitorWorkspace

# Retrieve the resource ID of the web application named 'myApp'
resourceID=$(az webapp show -g myResourceGroup -n myApp --query id --output tsv)

# Retrieve the workspace ID of the newly created Log Analytics workspace
workspaceID=$(az monitor log-analytics workspace show -g myResourceGroup --workspace-name myMonitorWorkspace --query id --output tsv)

# Create diagnostic settings for the web application to enable Azure Monitor to collect console logs and HTTP logs
az monitor diagnostic-settings create --resource $resourceID \
 --workspace $workspaceID \
 -n myMonitorLogs \
 --logs '[{"category": "AppServiceConsoleLogs", "enabled": true},
  {"category": "AppServiceHTTPLogs", "enabled": true}]'
```

---

Question: How to stream HTTP logs for `myApp` in `myResourceGroup` resource group, using Cloud Shell?

```ps
# Code here
```

Answer:

To filter specific log types, such as HTTP, use the `--provider` parameter

```ps
az webapp log tail --name myApp --resource-group myResourceGroup --provider http
```

---

Question: How to stream errors from `myApp` in `myResourceGroup` resource group, using Cloud Shell?

```ps
# Code here
```

Answer:

To filter logs by errror, such as HTTP, use the `--filter Error` parameter

```ps
az webapp log tail --name myApp --resource-group myResourceGroup --filter Error
```

---

Question: You are managing an Azure Subscription named `SubscriptionA`, where an Azure App Service named `myAppService` is deployed and running on a Linux environment. The monitoring team requires access to query logs generated by `myAppService`. How should you configure the system to meet this requirement?

- [ ] Enable `AppServiceAppLogs` under Diagnostics settings and set the destination to send logs to the App Service file system.
- [ ] Enable `AppServiceAppLogs` under Diagnostics settings and set the destination to send logs to a Blob Storage Account.
- [x] Enable `AppServiceAppLogs` under Diagnostics settings and set the destination to send logs to Log Analytics.
- [ ] Enable `AppServiceConsoleLogs` under Diagnostics settings and set the destination to send logs to Log Analytics.
- [ ] Enable `AppServiceConsoleLogs` under Diagnostics settings and set the destination to send logs to a Blob Storage Account.
- [ ] Enable `AppServiceConsoleLogs` under Diagnostics settings and set the destination to send logs to Log Analytics.
- [ ] Enable `AllMetrics` under Diagnostics settings and set the destination to send logs to Log Analytics.
- [ ] Enable `AllMetrics` under Diagnostics settings and set the destination to send logs to a Blob Storage Account.
- [ ] Enable `AllMetrics` under Diagnostics settings and set the destination to send logs to Log Analytics.

Answer: Enable `AppServiceAppLogs` sent to `Log Analytics`.

The `Azure Log Analytics` service provides a platform for comprehensive log management and analytics. By enabling `AppServiceAppLogs` under `Diagnostics` settings and setting the destination to send logs to `Log Analytics`, you allow the monitoring team to query and analyze these logs. The other `AppServiceAppLogs` options, while valid Azure services, do not provide the same level of log querying and analysis capabilities as `Log Analytics`.  
`AppServiceConsoleLogs` is incorrect because it is not the appropriate setting for this requirement.  
`AllMetrics` settings are collected by agents on to the App Service and report the usage of host resources. These are items like CPU usage, memory usage, and disk I/O used.

---

Question: Which of the following App Service plan categories provides the maximum scale-out capabilities?

- [ ] Dedicated compute
- [x] Isolated
- [ ] Shared compute

Answer: The Isolated category provides network and compute isolation, and has the maximum scale-out capability.

---

Question: Which of these statements best describes autoscaling?

- [ ] Autoscaling requires an administrator to actively monitor the workload on a system.
- [x] Autoscaling is a scale out/scale in solution.
- [ ] Scaling up/scale down provides better availability than autoscaling.

Answer: The system can scale out when specified resource metrics indicate increasing usage, and scale in when these metrics drop.

---

Question: Which of these scenarios is a suitable candidate for autoscaling?

- [x] The number of users requiring access to an application varies according to a regular schedule. For example, more users use the system on a Friday than other days of the week.
- [ ] The system is subject to a sudden influx of requests that grinds your system to a halt.
- [ ] Your organization is running a promotion and expects to see increased traffic to their web site for the next couple of weeks.

Answer: Changes in application load that are predictable are good candidates for autoscaling.  
Organization running a promotion: Manual scaling is a better option here since this is a one-off event with a known duration.  
Sudden influx of requests: The increasing burst of activity could be caused by a Denial of Service attack that is attempting to overwhelm your system. Autoscaling wouldn't solve the problem.

---

Question: Create an App Service web app `MyAppService` and its prerequisites. The service will be located in West US and must scale if usage is increased. Should be outimized for cost.

```ps
# Code here
```

Answer: `Standard`, `Premium`, `PremiumV2`, and `PremiumV3` all support autoscale, but `Standard` is most cost effective in this scenario.

```ps
az group create --name MyResourceGroup --location "West US"

az appservice plan create --name MyAppServicePlan --resource-group MyResourceGroup --sku S1

az webapp create --name MyAppService --resource-group MyResourceGroup --plan MyAppServicePlan
```

---

Question: Create an App Service web app `MyAppService` and its prerequisites. The service will be located in West US and would scale occasionally when some promotion is running. Should be outimized for cost.

```ps
# Code here
```

Answer: All plans support manual scaling, but `Basic` is most cost effective in this scenario.

```ps
az group create --name MyResourceGroup --location "West US"

az appservice plan create --name MyAppServicePlan --resource-group MyResourceGroup --sku B1

az webapp create --name MyAppService --resource-group MyResourceGroup --plan MyAppServicePlan
```

---

Question: Which of the following properties of an App Service plan can be set via Azure CLI:

- [x] Set minimum number of web app instances
- [ ] Set maximum number of web app instances
- [x] Number of preWarmed instances.

Answer: [You can't change the maximum scale limit in Azure CLI](https://learn.microsoft.com/en-us/azure/app-service/manage-automatic-scaling?tabs=azure-cli#set-maximum-number-of-web-app-instances), you must instead use the Azure portal.

```ps
az webapp update --minimum-elastic-instance-count X --prewarmed-instance-count Y
```

---

Question: Your company has developed a web application that experiences intermittent high traffic volumes. However, the company has noticed that during the sudden traffic spikes, the performance of their application temporarily degrades before it starts to stabilize. The degradation is especially apparent when the application hasn't received any significant traffic for a while. How can you mitigate this performance degradation issue?

- [ ] Manually adjust the number of instances when traffic increases.
- [ ] Set up custom scaling rules based on traffic using Azure Autoscale.
- [x] Implement Azure Automatic Scaling with prewarming of instances.
- [ ] Monitor performance using Azure Application Insights Live Metrics.

Bonus question: You are running on a `Standard` plan, do you need to chenge it in order to implement your solution?

Answer: The problem your company experiences is called _cold boot_. In order to mitigate it, you need Automatic Scaling with pre-warmed/always ready instances. This requires at least `PremiumV2` plan.  
Azure Manual Scaling lacks real-time adjustment capabilities, making it inefficient for sudden traffic spikes.  
Although Azure Autoscale scales based on traffic, it can still experience "cold starts" during sudden traffic spikes.  
Azure Application Insights Live Metrics: This is a monitoring tool, not a scaling solution.

---

Question: Which of the following App Service plans supports pre-warmed instances:

- [ ] Free
- [ ] Shared
- [ ] Basic
- [ ] Standard
- [x] Premium
- [ ] Isolated

Answer: Pre-warmed instances is a feature of Automatic scaling, which is supported only on `PremiumV2` and `PremiumV3` plans.

---

Question: Which of the following App Service plans you can have always ready instances?

- [ ] Free
- [ ] Shared
- [ ] Basic
- [ ] Standard
- [ ] Premium
- [x] PremiumV2
- [ ] Isolated

Answer:

- `PremiumV2` and `PremiumV3`: yes (default 1)
- `Standard` and `Premium`: No, your web app runs on other instances available during the scale out operation, based on threshold defined for autoscale rules.
- `Basic`: No, your web app runs on the number of manually scaled instances.

---

Question: Which of the following App Service plans supports schedule based scaling:

- [ ] Free
- [ ] Shared
- [ ] Basic
- [x] Standard
- [x] Premium
- [ ] Isolated

Answer: Only `Standard` to `Premium` support schedule based scaling.

---

Question: Which of the following App Service plans does not supports scaling out:

- [x] Free
- [x] Shared
- [ ] Basic
- [ ] Standard
- [ ] Premium
- [ ] Isolated

Answer: `Free` and `Shared` tiers run apps on a common Azure VM, shared with other users' apps.

---

Question: How apps are charged in Shared App Service plan:

- [x] Each app is charged for CPU quota
- [ ] Each VM instance in the App Service plan is charged
- [ ] The number of isolated workers that run your apps

Answer: CPU quota

---

Question: How apps are charged in Dedicated compute App Service plan:

- [ ] Each app is charged for CPU quota
- [x] Each VM instance in the App Service plan is charged
- [ ] The number of isolated workers that run your apps

Answer: VM instances

---

Question: How apps are charged in Isolated App Service plan:

- [ ] Each app is charged for CPU quota
- [ ] Each VM instance in the App Service plan is charged
- [x] The number of isolated workers that run your apps

Answer: The number of isolated workers that run your apps

---

Question: You want to move to another App Service plan. Which of following statements are true:

- [x] You can always move from lower-tiered plan to a higher-tiered plan
- [ ] You can always move from higher-tiered plan to a lower-tiered plan
- [x] You can move from higher-tiered plan to a lower-tiered plan only in certain scenarios
- [x] You can move an app to another App Service plan only in the same resouce group
- [ ] You can move an app to another App Service plan in any resouce group
- [x] You can move an app to another App Service plan only in the same geographical region
- [ ] You can move an app to another App Service plan in any geographical region
- [x] You can move an app to another App Service plan only of the same OS type
- [ ] You can move an app to another App Service plan of any OS type

Answer: You can move an app to another App Service plan, as long as the source plan and the target plan are in the same resource group, geographical region, and of the same OS type, and supports the currently used features.

---

Question: Which App Service plans support custom DNS name:

- [ ] Free
- [x] Shared
- [x] Basic
- [x] Standard
- [x] Premium
- [x] Isolated

Answer: You cannot have custom DNS name on the `Free` tier.

---

Question: You want a Linux App Service web app on an App Service plan that supports custom DNS name. Which App Service plans satisfy these requirenments?

- [ ] Free
- [ ] Shared
- [x] Basic
- [x] Standard
- [x] Premium
- [x] Isolated

Answer: Although `Shared` supports custom DNS name, it does not support Linux. Lowest is `Basic`.

---

Question: Which App Service plans support custom TLS bindings:

- [ ] Free
- [ ] Shared
- [x] Basic
- [x] Standard
- [x] Premium
- [x] Isolated

Answer: You cannot have custom TLS bindings on the `Free` and `Shared` tiers.

---

Question: Which App Service plans support Always On:

- [ ] Free
- [ ] Shared
- [x] Basic
- [x] Standard
- [x] Premium
- [x] Isolated

Answer: You cannot have Always On on the `Free` and `Shared` tiers.

---

Question: A corporation has an Azure-based web application that triggers an email alert during specific events. Users have noticed that alerts for irregular activities are sometimes delayed by several minutes. What should be done to address this delay?

- [ ] Configure the Azure Function to operate on an App Service plan.
- [ ] Disable the Always On feature.
- [ ] Switch the Azure Function to a consumption-based plan.
- [x] Enable the Always On feature.

Answer: The problem arises because the Azure Web App goes into an idle state when not in use, causing delays in sending anomaly detection emails. To prevent this, the Always On feature should be enabled. This ensures that the Web App is always running, thereby eliminating the delay.

---

Question: Which App Service plans support staging environments (deployment slots):

- [ ] Free
- [ ] Shared
- [ ] Basic
- [x] Standard
- [x] Premium
- [x] Isolated

Answer: You cannot have staging environments on the `Free`, `Shared`, and `Basic` tiers.

---

Question: You have existing App Service web app `MyAppService` in West US running on `Basic` plan. You want to add support for staging environments and move it to North Central US region region. What steps you need to take?

```ps
# Code here
```

Answer: You cannot move web app from one region to other. Also `Basic` plan does not support staging environments. The app needs to be cloned into a new region.

```ps
# Create new resource group with location 'North Central US'
New-AzResourceGroup -Name DestinationAzureResourceGroup -Location "North Central US"

# Create new 'Standard' App Service plan for that group (and set staging environments leter)
New-AzAppServicePlan -Location "North Central US" -ResourceGroupName DestinationAzureResourceGroup -Name DestinationAppServicePlan -Tier Standard

# Clone `MyAppService` into new web app and place it in the new App Service plan
$srcapp = Get-AzWebApp -ResourceGroupName SourceAzureResourceGroup -Name MyAppService
$destapp = New-AzWebApp -ResourceGroupName DestinationAzureResourceGroup -Name MyAppService2 -Location "North Central US" -AppServicePlan DestinationAppServicePlan -SourceWebApp $srcapp
```

---

Question: Where the setting for cloning existing App Service web app is located?

- [ ] Application settings
- [x] Development Tools
- [ ] General settings

Answer: General Settings is used to configure stack, platform, debugging, and incoming client certificate settings.

---

Question: You have `MyAppServicePlan` App Service plan that have no apps associated with it. Which of the following statements is true:

- [x] MyAppServicePlan still incurs charges even if unused
- [ ] MyAppServicePlan will not incur any charges if it is not used

Answer: App Service plans that have no apps associated with them still incur charges because they continue to reserve the configured VM instances.

---

Question: You want an App Service web app which runs on dedicated Azure Virtual Networks. Which App Service plans satisfies this requirenment?

- [ ] Free
- [ ] Shared
- [ ] Basic
- [ ] Standard
- [ ] Premium
- [x] Isolated

Answer: The `Isolated` and `IsolatedV2` tiers run dedicated Azure VMs on dedicated Azure Virtual Networks.

---

Question: When should you isolate your app into a new App Service plan?

Answer:

- The app is resource-intensive.
- You want to scale the app independently from the other apps in the existing plan.
- The app needs resource in a different geographical region.

---

Question: Which of the following statements are true:

- [ ] You can independently scale apps placed in the same App Service plan
- [x] An app runs on all the VM instances configured in the App Service plan.
- [x] If multiple apps are in the same App Service plan, they all share the same VM instances.
- [x] All deployment slots also run on the same VM instances as the app in given App Service plan
- [ ] Diagnostic logs, backups, and WebJobs don't use CPU cycles and memory from VM instances on an App Service plan
- [x] You can improve app's performance if you put it in a new, empty App Service plan

Answer: App Service is set of VMs that run one or group of applications and their services together in the same VM. Scaling out simply adds another VM with the same applications and services.

---

Question: What App Service plan the following command will create:

```powershell
az appservice plan create --name $planName --resource-group $resourceGroupName --location $location
```

- [ ] Free
- [ ] Shared
- [x] Basic
- [ ] Standard
- [ ] Premium
- [ ] Isolated

Answer: Default SKU is `B1` (Basic)

---

Question: Which Azure Monitor log types are only supported on `Premium` (and above) plan?

- [ ] AppServiceConsoleLogs
- [ ] AppServiceHTTPLogs
- [ ] AppServiceEnvironmentPlatformLogs
- [ ] AppServiceAuditLogs
- [x] AppServiceFileAuditLogs
- [ ] AppServiceAppLogs
- [ ] AppServiceIPSecAuditLogs
- [ ] AppServicePlatformLogs
- [x] AppServiceAntivirusScanAuditLogs

Answer: Anti-virus scan logs using Microsoft Defender and File changes made to the site content

---

Question: When you execute the following command `az webapp create --name MyWebApp --plan D1 --resource-group MyResourceGroup` you notice that page load times are longer during peak traffic hours. You aim to automate scaling when the CPU load surpasses 80 percent, ensuring minimal costs. Which az cli command should you execute first?

- [ ] `az monitor autoscale create --resource MyWebApp --condition "Percentage CPU > 80 avg 5m`
- [ ] `az appservice plan update --name <YourPlanName> --resource-group MyResourceGroup --sku P1v2`
- [x] `az appservice plan update --name <YourPlanName> --resource-group MyResourceGroup --sku S1`
- [ ] None of the listed. You need to switch to Consumption plan first.

Answer: The app is on Shared plan, Standard is the minimum for autoscale (`--sku S1`).

---

Question: When you set `WEBSITE_OVERRIDE_PRESERVE_DEFAULT_STICKY_SLOT_SETTINGS=false` for an app in Azure App Service, what happens to managed identities during the swap process?

- [ ] They are always swapped, regardless of this setting
- [ ] They are not swapped, because this setting needs to be true
- [ ] They are swapped because the setting is set to false
- [x] They are never swapped
- [ ] They are swapped only in the production slot

Answer: They are never swapped, regardless of the setting

---

Question: Where will this link `<webappname>.azurewebsites.net/?x-ms-routing-name=self` will take you if you set routing rules to `10%`?

- [ ] Same deployment slot
- [ ] To `self` deployment slot
- [ ] To staging deployment slot
- [x] To production deployment slot
- [ ] Unable to determine, because default routing rules will switch you to random deployment slot

Answer: `?x-ms-routing-name=self` will send you to production deployment slot regardless of the routing rules.

---

Question: Where will this link `<webappname>.azurewebsites.net/` will take you if you haven't set any routing rules?

- [ ] To staging deployment slot
- [x] To production deployment slot
- [ ] Unable to determine, because default routing rules will switch you to random deployment slot

Answer: Default routing rules give 0% chance for random slot, and by default you are directed to production slot.

---

Question: You set connection string via `az webapp config connection-string set --connection-string-type SQLServer --settings MyDb="Server=myserver;Database=mydb;User Id=myuser;Password=mypassword;"`. Which are the valid ways to obtain it?

- [x] `Configuration.GetConnectionString("MyDb")`
- [x] `Configuration.GetConnectionString("SQLCONNSTR_MyDb")`
- [ ] `Configuration.GetConnectionString("SQLServer")`
- [ ] `Configuration.GetConnectionString("SQLCONNSTR_SQLServer")`
- [x] `Environment.GetEnvironmentVariable("SQLCONNSTR_MyDb")`
- [ ] `Environment.GetEnvironmentVariable("MyDb")`
- [ ] `Environment.GetEnvironmentVariable("SQLServer")`
- [ ] `Environment.GetEnvironmentVariable("SQLCONNSTR_SQLServer")`

Answer: GetEnvironmentVariable has to use `<connection_type>CONNSTR_<name>`, GetConnectionString can use it as well, or just `<name>`

---

Question: What is the effect on the `/home/LogFiles` directory when enabling application logging with the File System option?

- [ ] It will persist only if `WEBSITES_ENABLE_APP_SERVICE_STORAGE=true`.
- [ ] It will not persist across app restarts.
- [x] It will always persist upon app restarts, regardless of the persistent storage setting.
- [ ] It will be overwritten by existing files on persistent storage.

Answer: The `/home/LogFiles` directory always persists upon app restarts if application logging is enabled with the File System option, independently of the persistent storage being enabled or disabled.

---

Question: What action is required if you initiate a storage failover when the storage account is mounted to the app?

- [x] The app must be restarted or the storage must be remounted.
- [ ] `WEBSITES_ENABLE_APP_SERVICE_STORAGE` must be set to `false`.
- [ ] No action is required. The app will automatically reconnect to the storage mount.

Answer: Storage failover requires app restart or remounting of Azure Storage.

---

Question: You want to mount an Azure Storage as a local share in App Service in a Linux container. Which of the following statements are true:

- [ ] Azure Files are mounted in read only mode.
- [x] Azure Files are mounted in read and write mode.
- [x] Azure blobs are mounted in read only mode.
- [ ] Azure blobs are mounted in read and write mode.
- [x] The app may only have 5 mount points.
- [ ] The app may only have 1 mount point.
- [ ] The app may have unlimeted mount points.
- [x] Storage mount changes will restart the app.
- [ ] Storage mount changes will not restart the app.

Answer: Azure Files are read/write, Azure blobs are read only. Up to 5 mount points per app. Restart on chaning storage mount.

---

Question: Finnish this command to enable automatic scaling with max burst of 5:

```ps
  az appservice plan update --name $appServicePlanName --resource-group $resourceGroup # Code here
```

Answer:

```ps
  az appservice plan update --name $appServicePlanName --resource-group $resourceGroup --elastic-scale true --max-elastic-worker-count 5
```

---

Question: When does scale out occur?

- [ ] When all of the conditions are met
- [x] When at least one of the conditions is met
- [ ] Only scale in can occur

Answer: When any of the conditions is met

---

Question: Which of the following certificates can be exported?

- [ ] Free Managed Certificate
- [x] App Service Certificate
- [x] Certificates stored in Key Vault

Answer: Free Managed certificated - No wildcard certificates or private DNS, can't be exported.

---

Question: You have multiple web apps in Standard plan. Which of the following statements is true?

- [ ] All apps in theat plan use shared workers
- [ ] Each app has its own worker
- [x] All apps in that plan run on the same worker

Answer: If you have a Standard App Service plan, all the apps in that plan run on the same worker.

---

Question: What are outbound addresses in the context of Azure App Service Web Apps?

- [ ] IP addresses used to identify inbound traffic to the application.
- [x] IP addresses used by the application to make calls to external services.
- [ ] A set of firewall rules to control inbound and outbound traffic.
- [ ] A set of IP addresses that application can make calls to
- [ ] A feature to map custom domain names to IP addresses.

Answer: Outbound addresses in Azure App Service Web Apps are the IP addresses used by the application to make calls to external services. They are shared among all applications running on the same type of worker VM.

---

Question: For logs stored in the App Service file system of Windows apps, the easiest way is to download the ZIP file in the browser at:

- [ ] `https://<app-name>.scm.azurewebsites.net/api/logs/docker/zip`
- [x] `https://<app-name>.scm.azurewebsites.net/api/dump`
- [ ] `https://<app-name>.scm.azurewebsites.net/api/logs`
- [ ] `https://<app-name>.scm.azurewebsites.net/logs`
- [ ] `https://<app-name>.scm.azurewebsites.net/api/home/LogFiles`
- [ ] `https://<app-name>.scm.azurewebsites.net/home/LogFiles`

Answer: For Windows is in `/api/dump`, for Linux is `/api/logs/docker/zip`

---

Question: In Azure App Service, the metrics such as CPU Percentage, Memory Percentage, Data In, and Data Out are used to monitor:

- [ ] A single app within the plan.
- [x] All instances of the plan, not a single app.
- [ ] Individual virtual machines within the app service plan.
- [ ] The performance of the underlying infrastructure supporting the app service plan.

Answer: These metrics are used across all instances of the plan, not for monitoring a single app within the plan.

---

Question: In Azure App Service running on Basic plan, the Health Check feature pings a specified path every minute. What actions are taken if an instance fails to respond with a valid status code?

- [ ] It's marked unhealthy and immediately replaced.
- [x] It's marked unhealthy and removed from the load balancer, and if it stays unhealthy for an hour, it's replaced.
- [ ] It's marked unhealthy, and has to be manually fixed.
- [ ] It's marked unhealthy, and the x-ms-auth-internal-token request header is checked against the WEBSITE_AUTH_ENCRYPTION_KEY environment variable to confirm status.

Answer: An instance is marked unhealthy and removed from the load balancer if it fails to respond with a valid status code after 10 requests. If it stays unhealthy for an hour, it's replaced (only for Basic+).

---

Question: In Azure App Service Health Checks, when using your own authentication system, how can you authenticate the health check request and ensure that it is originating from the App?

- [ ] By allowing anonymous access to the Health check path and validating that the `x-ms-auth-internal-token` request header matches the SHA256 hash of the `WEBSITE_AUTH_ENCRYPTION_KEY` environment variable.
- [ ] By allowing anonymous access to the Health check path and validating that the `x-ms-auth-internal-token` request header matches the `WEBSITE_AUTH_ENCRYPTION_KEY` environment variable.
- [x] By restricting application access through IP restrictions and validating that the `x-ms-auth-internal-token` request header matches the SHA256 hash of the `WEBSITE_AUTH_ENCRYPTION_KEY` environment variable.
- [ ] By restricting application access through IP restrictions and validating that the `x-ms-auth-internal-token` request header matches the `WEBSITE_AUTH_ENCRYPTION_KEY` environment variable.
- [ ] By encrypting the `WEBSITE_AUTH_ENCRYPTION_KEY` environment variable with a client certificate.
- [ ] By restricting application access through IP restrictions.
- [ ] By allowing anonymous access to the Health check path
- [ ] By using a Virtual Network to restrict application access and validating that the `x-ms-auth-internal-token` request header is present.

Answer: For private endpoints check if `x-ms-auth-internal-token` request header equals the hashed value of `WEBSITE_AUTH_ENCRYPTION_KEY` environment variable. You should first use features such as IP restrictions, client certificates, or a Virtual Network to restrict application access.

---

Question: When mounting Azure Storage as a local share in Azure App Service, what is something you should NOT do?

- [ ] Place app and storage in the same Azure region.
- [x] Use Azure Storage for local databases or apps relying on file handles and locks.
- [ ] Use Azure Files for read/write operations in Linux containers.
- [ ] Use Azure Files for read/write operations in Windows apps.
- [x] Use Azure Storage for read/write operations in Linux containers.
- [ ] Use Azure Storage for read/write operations in Windows apps.
- [x] Regenerate your access key often.

Answer: Avoid using Azure Storage for local databases or apps dependent on file handles and locks, refrain from using it for read/write actions in Linux containers, and minimize frequent regeneration of your access key.

---

Question: Which of the following scenarios is best suited for using a Free Managed Certificate in Azure App Service?

- [ ] Securing a custom domain with wildcard certificates
- [ ] Storing in Azure App Service Environment (ASE)
- [x] Securing a public website with auto-renewal every 6 months
- [ ] Exporting the certificate for use in another environment

Answer: Free Managed Certificates are auto-renewed but don't support wildcard certificates, can't be exported, and are not supported in ASE.

---

Question: Which of the following is NOT a feature of the App Service Certificate in Azure?

- [ ] Automated certificate management
- [ ] Renewal and export options
- [x] Requires a password-protected PFX file
- [ ] Managed by Azure as a private certificate

Answer: This requirement is related to uploading a private certificate, not the App Service Certificate.

---

Question: When uploading a private certificate to Azure App Service, what is a mandatory requirement?

- [ ] Can be used for accessing remote resources
- [ ] Supports private DNS in Free Managed Certificate
- [x] Requires a password-protected PFX file encrypted with triple DES
- [ ] Auto-renewed every 6 months

Answer: This is a specific requirement for uploading a private certificate.

---

Question: You want to secure a public domain in Azure App Service without needing wildcard certificates or private DNS, and you want the certificate to be auto-renewed. Which option should you choose?

- [x] Free Managed Certificate
- [ ] App Service Certificate
- [ ] Upload a Private Certificate
- [ ] Upload a Public Certificate

---

Question: You need to manage a private certificate in Azure with automated renewal that can also be exported. Which option should you choose?

- [ ] Free Managed Certificate
- [x] App Service Certificate
- [ ] Upload a Private Certificate
- [ ] Upload a Public Certificate

Answer: App Service Certificate provides automated certificate management, renewal, and export options for private certificates.

---

Question: You need to access remote resources in Azure App Service. Which certificate option should you choose?

- [ ] Use Free Managed Certificate
- [ ] App Service Certificate
- [ ] Private Certificate
- [x] Public Certificate

Answer: Public Certificate is used for accessing remote resources.

---

Question: Which of the following steps is necessary to secure a custom domain using a certificate?

- [x] Upload a private certificate to the App Service, ensuring that it meets all the requirements for private certificates.
- [ ] Upload a private certificate to the App Service, ensuring that it meets all the requirements for public certificates.
- [ ] Upload a public certificate to the App Service, ensuring that it meets all the requirements for private certificates.
- [ ] Upload a public certificate to the App Service, ensuring that it meets all the requirements for public certificates.

Answer: You must upload a private certificate that satisfies all the requirements for a private certificate.

---

Question: What is Transient Fault Handling in the context of cloud applications?

- [ ] A permanent error handling mechanism that requires manual intervention to resolve issues.
- [x] A technique to handle temporary service interruptions by implementing smart retry/back-off logic, possibly using circuit breakers.
- [ ] A security protocol to handle unauthorized access to cloud services.
- [ ] A method for handling user interface glitches in cloud-based applications.

Answer: A technique to handle temporary service interruptions by implementing smart retry/back-off logic, possibly using circuit breakers.

---

Question: You are managing a web application hosted on an Azure Web App. The application is expected to experience a significant increase in traffic soon. You are tasked with configuring auto-scaling for the web app. The requirement is to scale out when the CPU usage goes above 85% for a period of 10 minutes and to scale in when the CPU usage drops below 70%. Which two Azure CLI commands would you use to set up the required auto-scaling rules?

- [x] `az monitor autoscale rule create -g ResourceGroup --resource WebAppName --autoscale-name AutoScaleName --scale out 1 --condition "Percentage CPU > 85 avg 10m"`
- [ ] `az webapp autoscale rule create -g ResourceGroup --resource WebAppName --autoscale-name AutoScaleName --scale out 1 --condition "Percentage CPU > 85 avg 10m"`
- [x] `az monitor autoscale rule create -g ResourceGroup --resource WebAppName --autoscale-name AutoScaleName --scale in 1 --condition "Percentage CPU < 70 avg 10m"`
- [ ] `az webapp autoscale rule create -g ResourceGroup --resource WebAppName --autoscale-name AutoScaleName --scale in 1 --condition "Percentage CPU < 70 avg 10m"`

Answer: `az monitor autoscale rule create`, not `az webapp autoscale rule create`

---

Question: To utilize Application Insights Profiler in an Azure Web App, which configuration must be enabled?

- [ ] Cross-Origin Resource Sharing (CORS)
- [x] Always On Feature
- [ ] Identity Activation
- [ ] Custom Domain Configuration

Answer: The "Always On" setting is required to enable Application Insights Profiler for an Azure Web App. This setting keeps the app loaded even when there's no incoming traffic, allowing the profiler to collect data effectively.

---

Question: Your company is evaluating Azure App Services Basic plan and needs to have some continuous WebJobs and WebJobs triggered by a CRON expression. What steps must be taken, while staying cost effective?

- [ ] Activate Deployment Slots
- [x] Turn on "Always On" Feature
- [ ] Disable IP Restrictions
- [ ] Switch to Standard Plan
- [ ] Switch to Premium Plan
- [ ] Configure a free managed certificate

Answer: To run Continuous WebJobs or WebJobs triggered by a CRON expression in Azure App Service, you must enable the "Always On" feature and have at least a "Basic Plan". The "Always On" setting ensures that the WebJobs continue running even when there is no incoming traffic, and the "Basic Plan" or higher is required to support these operations.

---

Question: Your organization has a web app deployed on Azure using the D1 App Service Plan. You are tasked with setting up the infrastructure to automatically scale when CPU utilization hits 85%, while also keeping costs low. Which of the following actions should you take to meet these objectives?

- [x] Activate autoscaling for the Web App
- [x] Set up a scaling condition
- [x] Switch the web app to the Standard App Service Plan
- [ ] Upgrade the web app to the Premium App Service Plan
- [x] Create a scaling rule

Answer: The D1 App Service Plan is a Shared Service Plan, which doesn't support autoscaling. Therefore, you would need to switch the web app to the Standard App Service Plan.

---

Question: You are an Azure developer responsible for maintaining a web application hosted on Azure App Service. Users are reporting unexpected behavior within the application, and you need to diagnose the issue by capturing errors and trace information from your application code. What should you do?

- [ ] Configure Azure Monitor to capture telemetry data.
- [ ] Enable the Web Server Logging feature.
- [x] Enable the Application Logging feature.
- [ ] Create resource health alerts.

Answer: Enabling the Application Logging feature allows you to capture application-level events and errors, which is useful for debugging issues within your application code.  
Azure Monitor is more for monitoring performance metrics and not specifically tailored for application-level logging.  
Web Server Logging captures HTTP-level information, not application-level issues.  
Resource health alerts are for monitoring the health of Azure resources, not for application-level debugging.

---

Question: Your Azure App Service-hosted web application named `webapp-prod` is experiencing issues. Users are complaining about receiving HTTP `404` errors when trying to access certain pages. You need to diagnose these issues by capturing detailed information about each HTTP request. What should you do?

- [ ] Enable Azure Application Insights.
- [ ] Enable the Application Logging feature.
- [x] Enable the Web Server Logging feature.
- [ ] Set up Azure Network Watcher.

Answer: Enabling the Web Server Logging feature captures all HTTP requests and responses, which is useful for diagnosing issues like HTTP 404 errors.  
Azure Application Insights is more focused on application performance monitoring and not specifically tailored for capturing all HTTP requests and responses.  
Application Logging is for capturing application-level events and errors, not HTTP-level information.  
Azure Network Watcher is for monitoring, diagnosing, and viewing metrics for Azure networking resources, not specifically for HTTP-level logging.

---

Questions: Which of the following won't trigger a restart?

- [ ] Changes in App Settings
- [ ] Changes in Connection strings
- [ ] Changes in Storage Mounts
- [x] Storage failover

Answer: Storage failover requires app restart or remounting of Azure Storage.

---

Question: Which of the following can be used for Continuous Integration and Deployment (CI/CD) with Azure App Service? Select all that apply.

- [x] Azure DevOps Services
- [x] GitLab or other third party git repository
- [x] Local git repository
- [x] FTP
- [ ] Azure File Sync
- [x] Azure Container Registry
- [x] Docker Hub or other third party container registries
- [ ] Azure Pipelines Artifacts
- [ ] Azure Blob Storage

Answer: Out-of-the-box CI/CD is available through Azure Portal with Git (Azure DevOps, third party, local), FTP, Container Registry (ACR, third-party).

- **Azure File Sync**: Used for synchronizing files between servers and Azure, not for code deployment.
- **Azure Pipelines Artifacts**: Primarily used for storing artifacts produced by CI/CD pipelines, not directly for deployment.
- **Azure Blob Storage**: Typically used for general storage purposes, not specifically for CI/CD targeting web apps.

---
