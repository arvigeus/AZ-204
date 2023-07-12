# [Azure App Service Web Apps](https://docs.microsoft.com/en-us/azure/app-service/)

## [Azure App Service plans](https://learn.microsoft.com/en-us/azure/app-service/overview-hosting-plans)

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
# az group create --name $resourceGroup --location $location
az appservice plan create --name $appServicePlanName --resource-group $resourceGroup --sku $sku
```

### Scaling

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

### Features

- Custom DNS Name: Shared+
- Scalability (scaling out): Basic+
- TLS Bindings: Basic+
- Always On: Basic+
- Staging environments (deployment slots): Standard+
- Linux: Standard+
- AppServiceFileAuditLogs: Premium
- Dedicated Azure Virtual Networks: Isolated+
- Maximum scale-out: Isolated+

### Working with Web apps

```ps
az webapp create --name $appName --resource-group $resourceGroup --plan $appServicePlanName
```

```ps
# Move web app to another location by cloning it

New-AzResourceGroup -Name DestinationAzureResourceGroup -Location $destinationLocation

New-AzAppServicePlan -Location $destinationLocation -ResourceGroupName DestinationAzureResourceGroup -Name DestinationAppServicePlan -Tier Standard

$srcapp = Get-AzWebApp -ResourceGroupName SourceAzureResourceGroup -Name MyAppService
$destapp = New-AzWebApp -ResourceGroupName DestinationAzureResourceGroup -Name MyAppService2 -Location $destinationLocation -AppServicePlan DestinationAppServicePlan -SourceWebApp $srcapp
```
