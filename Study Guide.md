# Study Guide

## App Service

### App Service Plans

- [Azure App Service plan overview](https://learn.microsoft.com/en-us/azure/app-service/overview-hosting-plans?toc=%2Fazure%2Fapp-service%2Fcontainers%2Ftoc.json)
- [Manage an App Service plan in Azure](https://learn.microsoft.com/en-us/azure/app-service/app-service-plan-manage)
- [Automatic scaling in Azure App Service](https://learn.microsoft.com/en-us/azure/app-service/manage-automatic-scaling?tabs=azure-cli#set-maximum-number-of-web-app-instances)
- [az appservice plan](https://learn.microsoft.com/en-us/cli/azure/appservice/plan?view=azure-cli-latest)

### Deployment

- [Create an App Service app with deployment from GitHub using Azure CLI](https://learn.microsoft.com/en-us/azure/app-service/scripts/cli-deploy-github)
- [Create an App Service app and deploy code to a staging environment using Azure CLI](https://learn.microsoft.com/en-us/azure/app-service/scripts/cli-deploy-staging-environment)
- [Create an ASP.NET Core app in a Docker container from Docker Hub using Azure CLI](https://learn.microsoft.com/en-us/azure/app-service/scripts/cli-linux-docker-aspnetcore)
- [Tutorial: Create a multi-container (preview) app in Web App for Containers](https://learn.microsoft.com/en-us/azure/app-service/tutorial-multi-container-app)
- [az webapp](https://learn.microsoft.com/en-us/cli/azure/webapp?view=azure-cli-latest)
- [az webapp create](https://learn.microsoft.com/en-us/cli/azure/webapp?view=azure-cli-latest#az-webapp-create)
- [az webapp deployment](https://learn.microsoft.com/en-us/cli/azure/webapp/deployment?view=azure-cli-latest)
- [az webapp config](https://learn.microsoft.com/en-us/cli/azure/webapp/config?view=azure-cli-latest)

### App Service Diagnostics

- [Application monitoring for Azure App Service overview](https://learn.microsoft.com/en-us/azure/azure-monitor/app/azure-web-apps)
- [Enable diagnostics logging for apps in Azure App Service](https://learn.microsoft.com/en-us/azure/app-service/troubleshoot-diagnostic-logs)
- [Tutorial: Troubleshoot an App Service app with Azure Monitor](https://learn.microsoft.com/en-us/azure/app-service/tutorial-troubleshoot-monitor)

### Security

- [Configure TLS mutual authentication for Azure App Service](https://learn.microsoft.com/en-us/azure/app-service/app-service-web-configure-tls-mutual-auth?tabs=azurecli)
- [Tutorial: Host a RESTful API with CORS in Azure App Service](https://learn.microsoft.com/en-us/azure/app-service/app-service-web-tutorial-rest-api)

## Azure Functions

- [Azure Functions overview](https://learn.microsoft.com/en-us/azure/azure-functions/functions-overview?pivots=programming-language-csharp)
- [Azure Functions developer guide](https://learn.microsoft.com/en-us/azure/azure-functions/functions-reference?tabs=blob)
- [Work with Azure Functions Core Tools](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=v4%2Clinux%2Ccsharp%2Cportal%2Cbash#local-settings)

### Azure Function Plans

- [Consumption Plan](https://learn.microsoft.com/en-us/azure/azure-functions/consumption-plan)
- [Premium Plan](https://learn.microsoft.com/en-us/azure/azure-functions/functions-premium-plan?tabs=portal)
- [Dedicated Plan](https://learn.microsoft.com/en-us/azure/azure-functions/dedicated-plan)
- [az functionapp plan](https://learn.microsoft.com/en-us/cli/azure/functionapp/plan?view=azure-cli-latest)

### Azure Function Triggers and Bindings

- [Azure Functions triggers and bindings concepts](https://learn.microsoft.com/en-us/azure/azure-functions/functions-triggers-bindings?tabs=csharp)
- [HTTP](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-http-webhook?tabs=in-process%2Cfunctionsv2&pivots=programming-language-csharp)
- [Blob](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-storage-blob?tabs=in-process%2Cextensionv5%2Cextensionv3&pivots=programming-language-csharp)
- [CosmoDB](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-cosmosdb-v2?tabs=in-process%2Cfunctionsv2&pivots=programming-language-csharp)
- [EventGrid](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-event-grid?pivots=programming-language-csharp&tabs=in-process%2Cextensionv3)
- [EventHub](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-event-hubs?tabs=in-process%2Cextensionv5&pivots=programming-language-csharp)
- [Queue](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-storage-queue?tabs=in-process%2Cextensionv5%2Cextensionv3&pivots=programming-language-csharp)
- [ServiceBus](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-service-bus?tabs=in-process%2Cextensionv5%2Cextensionv3&pivots=programming-language-csharp)
- [Time](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-timer?tabs=python-v2%2Cin-process&pivots=programming-language-csharp)

## Azure Containers

### Azure Container Registry

- [Azure Container Registry service tiers](https://learn.microsoft.com/en-us/azure/container-registry/container-registry-skus)
- [Tutorial: Build and deploy container images in the cloud with Azure Container Registry Tasks](https://learn.microsoft.com/en-us/azure/container-registry/container-registry-tutorial-quick-task)
- [Import container images to a container registry](https://learn.microsoft.com/en-us/azure/container-registry/container-registry-import-images?tabs=azure-cli)
- [Push your first image to your Azure container registry using the Docker CLI](https://learn.microsoft.com/en-us/azure/container-registry/container-registry-get-started-docker-cli?tabs=azure-cli)

### Azure Container Apps

- [Deploy Azure Container Apps with the az containerapp up command](https://learn.microsoft.com/en-us/azure/container-apps/containerapp-up)
- [az containerapp](https://learn.microsoft.com/en-us/cli/azure/containerapp?view=azure-cli-latest)
- [Disaster recovery guidance for Azure Container Apps](https://learn.microsoft.com/en-us/azure/container-apps/disaster-recovery?tabs=azure-cli)
- [What are Azure regions and availability zones?](https://learn.microsoft.com/en-us/azure/reliability/availability-zones-overview)
- [Managed identities in Azure Container Apps](https://learn.microsoft.com/en-us/azure/container-apps/managed-identity?tabs=portal%2Cdotnet)

### Azure Container Instances

- [Container groups in Azure Container Instances](https://learn.microsoft.com/en-us/azure/container-instances/container-instances-container-groups)

## Docker

- [Quickstart: Docker in Visual Studio](https://learn.microsoft.com/en-us/visualstudio/containers/container-tools?view=vs-2019)
- [Docker images for ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/docker/building-net-docker-images?view=aspnetcore-3.0)
- [Dockerfile reference](https://docs.docker.com/engine/reference/builder/)
- [Multi-stage builds](https://docs.docker.com/build/building/multi-stage/)

## Azure Resource Groups

- [Manage Azure Resource Groups by using Azure CLI](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/manage-resource-groups-cli)
- [Use Azure portal to export a template](https://learn.microsoft.com/en-us/azure/azure-resource-manager/templates/export-template-portal)

## Azure Active Directory

- [What are managed identities for Azure resources?](https://learn.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/overview)

## Azure Service Bus

### Azure Service Bus Diagnostics

- [Monitoring Azure Service Bus data reference](https://learn.microsoft.com/en-us/azure/service-bus-messaging/monitor-service-bus-reference)

## Azure Monitor

### Autoscale

- [Get started with autoscale in Azure](https://learn.microsoft.com/en-us/azure/azure-monitor/autoscale/autoscale-get-started?toc=%2Fazure%2Fapp-service%2Ftoc.json)
- [Flapping in Autoscale](https://learn.microsoft.com/en-us/azure/azure-monitor/autoscale/autoscale-flapping)
- [Troubleshoot Azure Monitor autoscale](https://learn.microsoft.com/en-us/azure/azure-monitor/autoscale/autoscale-troubleshoot)
- [Autoscale a web app by using custom metrics](https://learn.microsoft.com/en-us/azure/azure-monitor/autoscale/autoscale-custom-metric)
