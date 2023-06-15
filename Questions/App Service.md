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

Question: Suppose you are a developer tasked with deploying a new .NET web application `using` on Microsoft Azure. Your first task is to create a new resource group `myResourceGroup` located in the South Central US region. Following that, you need to establish a deployment user for the web application. You are then required to create `myAppServicePlan` App Service plan within a Linux environment that is cost-efficient. The web application should be created within this resource group and App Service plan, using .NET as its runtime. You are also required to configure the application settings to set the deployment branch to 'main'. Lastly, you are provided with a sample application from GitHub. You need to clone this application, rename the default branch to 'main', add the Azure remote repository using the URL from the webapp create command, and push the code to the Azure repository. How would you accomplish these tasks using Azure CLI commands?

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
az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name MyApp --runtime "DOTNET|5.0" --deployment-local-git

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
