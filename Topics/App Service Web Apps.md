# [Azure App Service Web Apps](https://docs.microsoft.com/en-us/azure/app-service/)

## [Azure App Service plans](https://learn.microsoft.com/en-us/azure/app-service/overview-hosting-plans)

### Features

- Custom DNS Name: Shared+
- Scalability (scaling out): Basic+
- TLS Bindings: Basic+
- Always On: Basic+
- Free managed certificate: Basic+
- Autoscale: Standard+
- Staging environments (deployment slots): Standard+
- Linux: Standard+
- AppServiceFileAuditLogs: Premium
- Automatic scaling: PremiumV2+
- Dedicated Azure Virtual Networks: Isolated+
- Maximum scale-out: Isolated+

### Overview

- **Shared compute**: **Free** and **Shared** tiers run apps on the same Azure VM with other customer apps, sharing resources and limited CPU quotas. They are suitable for _development_ and _testing_ only. Each app is charged for _CPU quota_.

- **Dedicated compute**: **Basic** (_default_), **Standard**, **Premium**, **PremiumV2**, and **PremiumV3** tiers utilize dedicated Azure VMs. Apps within the same App Service plan share compute resources. Higher tiers provide more VM instances for scale-out capabilities. Scaling out (_autoscale_) simply adds another VM with the same applications and services. _Each VM instance_ is charged.

- **Isolated**: The **Isolated** and **IsolatedV2** tiers run dedicated Azure VMs on _dedicated Azure Virtual Networks_. It provides network isolation on top of compute isolation to your apps. It provides the _maximum scale-out capabilities_. Charging is based on the _number of isolated workers that run your apps_.

You can move an app to another App Service plan, as long as the source plan and the target plan are in the same resource group, geographical region, and of the same OS type, and supports the currently used features.

App Service plans that have no apps associated with them still incur charges because they continue to reserve the configured VM instances.

Deployment slots (deploy to staging, then swap slots to warm up instances and eliminate downtime), diagnostic logs, perforing backups, and WebJobs _run on the same VM instances_.

When to isolate an app into a new App Service plan:

- The app is resource-intensive.
- You want to scale the app independently from the other apps in the existing plan.
- The app needs resource in a different geographical region.

```ps
# Move web app to another location by cloning it

New-AzResourceGroup -Name DestinationAzureResourceGroup -Location $destinationLocation
New-AzAppServicePlan -Location $destinationLocation -ResourceGroupName DestinationAzureResourceGroup -Name DestinationAppServicePlan -Tier Standard

$srcapp = Get-AzWebApp -ResourceGroupName SourceAzureResourceGroup -Name MyAppService
$destapp = New-AzWebApp -ResourceGroupName DestinationAzureResourceGroup -Name MyAppService2 -Location $destinationLocation -AppServicePlan DestinationAppServicePlan -SourceWebApp $srcapp
```

### [Scaling](https://learn.microsoft.com/en-us/azure/app-service/manage-automatic-scaling?tabs=azure-portal)

- **Manual scaling** (Basic+) - one time events (example: doing X on this date)
- **Autoscale** (Standard+) - for predictable changes of application load, based on schedules (every X days/weeks/months) or resources
- **Automatic scaling** (PremiumV2+) - like autoscale, but allows avoiding _cold start_ issues with _pre-warmed_ and _always ready_ instances

  ```ps
  az appservice plan update --name $appServicePlanName --resource-group resourceGroup
      # enables automatic scaling
      --elastic-scale true --max-elastic-worker-count <YOUR_MAX_BURST>
      # disable automatic scaling
      --elastic-scale false
  ```

**Scale out**: If _any_ of the rules are met  
**Scale in**: If _all_ rules are met

## [Deployment](https://learn.microsoft.com/en-us/azure/app-service/deploy-best-practices)

| Settings that are swapped                                           | Settings that aren't swapped                            |
| ------------------------------------------------------------------- | ------------------------------------------------------- |
| General settings, such as framework version, 32/64-bit, web sockets | Publishing endpoints                                    |
| App settings (can be configured to stick to a slot)                 | Custom domain names                                     |
| Connection strings (can be configured to stick to a slot)           | Non-public certificates and TLS/SSL settings            |
| Handler mappings                                                    | Scale settings                                          |
| Public certificates                                                 | WebJobs schedulers                                      |
| WebJobs content                                                     | IP restrictions                                         |
| Hybrid connections \*                                               | Always On                                               |
| Azure Content Delivery Network \*                                   | Diagnostic log settings                                 |
| Service endpoints \*                                                | Cross-origin resource sharing (CORS)                    |
| Path mappings                                                       | Virtual network integration                             |
|                                                                     | Managed identities                                      |
|                                                                     | Settings that end with the suffix `\_EXTENSION_VERSION` |

`x-ms-routing-name=`: `self` for production slot, `staging` for staging slot.

By default, new slots are given a routing rule of `0%` (users won't randomly be transfered to other slot).

```ps
let "randomIdentifier=$RANDOM*$RANDOM"
location="East US"
resourceGroup="app-service-rg-$randomIdentifier"
tag="deploy-github.sh"
appServicePlan="app-service-plan-$randomIdentifier"
webapp="web-app-$randomIdentifier"

az group create --name $resourceGroup --location "$location" --tag $tag

az appservice plan create --name $appServicePlan --resource-group $resourceGroup --location "$location" # --sku B1
# az appservice plan create --name $appServicePlan --resource-group $resourceGroup --sku S1 --is-linux

az webapp create --name $webapp --plan $appServicePlan --resource-group $resourceGroup --runtime "DOTNET|6.0"

# https://learn.microsoft.com/en-us/azure/app-service/scripts/cli-deploy-github
github_deployment() {
    echo "Deploying from GitHub"
    gitrepo=https://github.com/Azure-Samples/dotnet-core-sample
    az webapp deployment source config --name $webapp --resource-group $resourceGroup --repo-url $gitrepo --branch master --manual-integration

    # Change deploiment branch to "main"
    # az webapp config appsettings set --name $webapp --resource-group $resourceGroup --settings DEPLOYMENT_BRANCH='main'
}

# https://learn.microsoft.com/en-us/azure/app-service/scripts/cli-deploy-staging-environment
staging_deployment() {
    # Deployment slots require Standard tier, default is Basic (B1)
    az appservice plan update --name $appServicePlan --resource-group $resourceGroup --sku S1

    echo "Creating a deployment slot"
    az webapp deployment slot create --name $webapp --resource-group $resourceGroup --slot staging

    echo "Deploying to Staging Slot"
    gitrepo=https://github.com/Azure-Samples/dotnet-core-sample
    az webapp deployment source config --name $webapp --resource-group $resourceGroup --slot staging --repo-url $gitrepo --branch master --manual-integration

    echo "Swapping staging slot into production"
    az webapp deployment slot swap --name $webapp --resource-group $resourceGroup --slot staging
}

# https://learn.microsoft.com/en-us/azure/app-service/scripts/cli-linux-docker-aspnetcore
docker_deployment() {
    echo "Deploying from DockerHub"
    dockerHubContainerPath="mcr.microsoft.com/dotnet/samples:aspnetapp" #format: <username>/<container-or-image>:<tag>
    az webapp config container set --docker-custom-image-name $dockerHubContainerPath --name $webapp --resource-group $resourceGroup
}

# https://learn.microsoft.com/en-us/azure/app-service/tutorial-multi-container-app
compose_deployment() {
    echo "Creating webapp with Docker Compose configuration"
    $dockerComposeFile=docker-compose-wordpress.yml
    # Note that az webapp create is different
    az webapp create --resource-group $resourceGroup --plan $appServicePlan --name wordpressApp --multicontainer-config-type compose --multicontainer-config-file $dockerComposeFile

    echo "Setup database"
    az mysql server create --resource-group $resourceGroup --name wordpressDb  --location $location --admin-user adminuser --admin-password letmein --sku-name B_Gen5_1 --version 5.7
    az mysql db create --resource-group $resourceGroup --server-name <mysql-server-name> --name wordpress

    echo "Setting app settings for WordPress"
    az webapp config appsettings set --resource-group $resourceGroup --name wordpressApp --settings WORDPRESS_DB_HOST="<mysql-server-name>.mysql.database.azure.com" WORDPRESS_DB_USER="adminuser" WORDPRESS_DB_PASSWORD="letmein" WORDPRESS_DB_NAME="wordpress" MYSQL_SSL_CA="BaltimoreCyberTrustroot.crt.pem"

}

az group delete --name $resourceGroup
```

## Read more

- [Manage an App Service plan in Azure](https://learn.microsoft.com/en-us/azure/app-service/app-service-plan-manage)

## CLI

- [az appservice plan](https://learn.microsoft.com/en-us/cli/azure/appservice/plan?view=azure-cli-latest)
- [az appservice plan update](https://learn.microsoft.com/en-us/cli/azure/appservice/plan?view=azure-cli-latest#az-appservice-plan-update)
- [az webapp](https://learn.microsoft.com/en-us/cli/azure/webapp?view=azure-cli-latest)
- [az webapp create](https://learn.microsoft.com/en-us/cli/azure/webapp?view=azure-cli-latest#az-webapp-create)
- [az webapp deployment](https://learn.microsoft.com/en-us/cli/azure/webapp/deployment?view=azure-cli-latest)
- [az webapp config](https://learn.microsoft.com/en-us/cli/azure/webapp/config?view=azure-cli-latest)
