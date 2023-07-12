# Azure App Service

Question: Which of the following networking features of App Service can be used to control outbound network traffic?

- [ ] App-assigned address
- [x] Hybrid Connections
- [ ] Service endpoints

Answer: Hybrid Connections are an outbound network feature.

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
