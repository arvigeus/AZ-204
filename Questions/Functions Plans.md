# Functions Plans

Question: Which of the following Azure Functions hosting plans is best when predictive scaling and costs are required?

- [ ] Functions Premium Plan
- [x] Dedicated plan
- [ ] Consumption plan

Answer: Dedicated plans run in App service which supports setting autoscaling rules based on predictive usage.

---

Question: You are assigned to create a function app in Azure which has to automatically scale based on the workload and you don't want to worry about capacity planning. Write down the Azure CLI commands you would use to create such a function app starting from scratch, assuming no resources or prerequisites have been set up.

```ps
# Code here

```

Answer:

```ps
# Variables
resourceGroupName="MyResourceGroup"
storageName="mystorageaccount"
functionAppName="myfunctionappconsumption"
location="westus2"

# Create a resource group
az group create --name $resourceGroupName --location $location

# Create an Azure Storage Account
az storage account create --name $storageName --location $location --resource-group $resourceGroupName --sku Standard_LRS

# Create a consumption plan function app
az functionapp create --resource-group $resourceGroupName --consumption-plan-location $location --runtime node --functions-version 3 --name $functionAppName --storage-account $storageName
```

---

Question: Your team is working on an application that requires data to be processed immediately. You decide Azure Functions would be an excellent fit for this application. Provide a list of Azure CLI commands you would execute to set up the function app from the ground up, given that there are no pre-existing resources or configurations.

```ps
# Code here

```

Answer: `"data to be processed immediately"` requires pre-warmed instances, supported in `Premium` plan.

```ps
# Variables
resourceGroupName="MyResourceGroup"
storageName="mystorageaccount"
planName="MyPremiumPlan"
functionAppName="myfunctionapppremium"
location="westus2"

# Create a resource group
az group create --name $resourceGroupName --location $location

# Create an Azure Storage Account
az storage account create --name $storageName --location $location --resource-group $resourceGroupName --sku Standard_LRS

# Create a premium plan
az functionapp plan create --name $planName --resource-group $resourceGroupName --location $location --sku EP1

# Create a function app with the premium plan
az functionapp create --resource-group $resourceGroupName --plan $planName --name $functionAppName --storage-account $storageName --runtime node --functions-version 3
```

---

Question: Suppose you are asked to create a function app in Azure where you want to have dedicated compute resources and you don't want the function app to be paused during periods of inactivity. How would you set up such an Azure function app using Azure CLI? Assume you are starting from scratch and you need to take care of any required setup or prerequisites in your CLI commands.

```ps
# Code here

```

Answer: Dedicated plan with `"Always on"` set.

```ps
# Variables
resourceGroupName="MyResourceGroup"
storageName="mystorageaccount"
planName="MyAppServicePlan"
functionAppName="myfunctionappservice"
location="westus2"

# Create a resource group
az group create --name $resourceGroupName --location $location

# Create an Azure Storage Account
az storage account create --name $storageName --location $location --resource-group $resourceGroupName --sku Standard_LRS

# Create an App Service plan
az appservice plan create --name $planName --resource-group $resourceGroupName --location $location --sku S1

# Create a function app with the App Service plan
az functionapp create --resource-group $resourceGroupName --plan $planName --name $functionAppName --storage-account $storageName --runtime node --functions-version 3

# Set the function app to always be on
az functionapp config set --name $functionAppName --resource-group $resourceGroupName --always-on true
```

---

Question: Your company is deploying an Azure Function that will be requiring advanced features like Azure Virtual Network (VNet) for secure and reliable network connectivity to Azure resources. Which of the following plans support VNet?

- [x] EP1
- [x] EP2
- [x] EP3
- [ ] F1
- [ ] D1
- [ ] B1
- [ ] B2
- [ ] B3
- [x] S1
- [x] P1V2
- [x] P2V2
- [x] P3V2
- [x] P1V3
- [x] P2V3
- [x] P3V3
- [x] I1
- [x] I2
- [x] I3
- [x] I1V2
- [x] I2V2
- [x] I3V2

Answer:

Supports:

- Premium plan: `EP1`, `EP2`, `EP3`
- Standard App Service plan: `S1`
- Premium App Service plan: `P1V2`, `P2V2`, `P3V2`, `P1V3`, `P2V3`, `P3V3`
- Isolated App Service plan: `I1`, `I2`, `I3`, `I1V2`, `I2V2`, `I3V2`

Does not support:

- Free App Service plan: `F1`
- Shared App Service plan: `D1`
- Basic App Service plan: `B1`, `B2`, `B3`

---

Question: What is the difference in terms of cost between `Consumption` and `Premium` plans and any of the App Service plans?

Answer: `Consumption` and `Premium` plans can be more cost-efficient if you have sporadic usage patterns. App Service plans could be more predictable in terms of cost and potentially cheaper for continuous heavy usage.

---

Question: Which triggers in Azure Functions are supported on Consumption plan:

- [x] Blob storage
- [x] Azure Cosmos DB
- [x] Event Grid
- [x] Event Hubs
- [x] IoT Hub
- [ ] Notification Hubs
- [x] Queue storage
- [x] Service Bus
- [ ] RabbitMQ
- [x] SignalR
- [ ] Kafka
- [ ] Table storage
- [x] Timer

Answer: `Table storage` and `Notification Hubs` are not valid triggers. `RabbitMQ` and `Kafka` are not supported on Consumption plan.

---
