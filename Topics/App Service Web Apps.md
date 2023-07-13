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
- AppServiceFileAuditLogs: Premium+
- AppServiceAntivirusScanAuditLogs: Premium+
- Automatic scaling: PremiumV2+
- Dedicated Azure Virtual Networks: Isolated+
- Maximum scale-out: Isolated+

### Overview

- **Shared compute**: **Free** and **Shared** tiers run apps on the same Azure VM with other customer apps, sharing resources and limited CPU quotas. They are suitable for _development_ and _testing_ only. Each app is charged for _CPU quota_.

- **Dedicated compute**: **Basic** (_default_), **Standard**, **Premium**, **PremiumV2**, and **PremiumV3** tiers utilize dedicated Azure VMs. Apps within the same App Service plan share compute resources. Higher tiers provide more VM instances for scale-out capabilities. Scaling out (_autoscale_) simply adds another VM with the same applications and services. _Each VM instance_ is charged.

- **Isolated**: The **Isolated** and **IsolatedV2** tiers run dedicated Azure VMs on _dedicated Azure Virtual Networks_. It provides network isolation on top of compute isolation to your apps. It provides the _maximum scale-out capabilities_. Charging is based on the _number of isolated workers that run your apps_.

You can move an app to another App Service plan, as long as the source plan and the target plan are in the same resource group, geographical region, and of the same OS type, and supports the currently used features.

App Service plans that have no apps associated with them still incur charges because they continue to reserve the configured VM instances.

Deployment slots, diagnostic logs, perforing backups, and WebJobs _run on the same VM instances_.

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

Deploy to staging, then swap slots to warm up instances and eliminate downtime. Requires Standard+.

| Settings that are swapped                      | Settings that aren't swapped                            |
| ---------------------------------------------- | ------------------------------------------------------- |
| General settings: framework, arch, web sockets | Publishing endpoints                                    |
| App settings: authentication (can be disabled) | Custom domain names                                     |
| Connection strings (can be disabled)           | Non-public certificates and TLS/SSL settings            |
| Handler mappings                               | Scale settings                                          |
| Public certificates                            | WebJobs schedulers                                      |
| WebJobs content                                | IP restrictions                                         |
| Hybrid connections                             | Always On                                               |
| Azure Content Delivery Network                 | Diagnostic log settings                                 |
| Service endpoints                              | Cross-origin resource sharing (CORS)                    |
| Path mappings                                  | Virtual network integration                             |
|                                                | Managed identities                                      |
|                                                | Settings that end with the suffix `\_EXTENSION_VERSION` |

`x-ms-routing-name=`: `self` for production slot, `staging` for staging slot.

By default, new slots are given a routing rule of `0%` (users won't randomly be transfered to other slot).

By default, all client requests go to the production slot. You can route a portion of the traffic to another slot. The default rule for a new deployment slot is 0% (no random transfers to other slots).

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

## Security

### [Certificates](https://learn.microsoft.com/en-us/azure/app-service/configure-ssl-certificate?tabs=apex)

A certificate is accessible to all apps in the same resource group and region combination.

- **Free Managed Certificate**: Auto renewed every 6 months, no wildcard certificates or private DNS, and can't be exported.
- **App Service Certificate**: A private certificate that is managed by Azure. Automated certificate management, renewal and export options.
- **Using Key Vault**: Store private certificates (same requerenments) in Key Vault. Automatic renewal, except for non-integrated certificates (`az keyvault certificate create ...`)
- **Uploading a Private Certificate**: Requires a password-protected PFX file encrypted with triple DES, with 2048-bit private key and all intermediate/root certificates in the chain.
- **Uploading a Public Certificate**: For accessing remote resources.

#### [TLS mutual authentication](https://learn.microsoft.com/en-us/azure/app-service/app-service-web-configure-tls-mutual-auth?tabs=azurecli)

Requires Basic+ plan; set from `Configuration > General Settings`.

TLS termination is handled by frontend load balancer. When enabling client certificates (`az webapp update --set clientCertEnabled=true ...`), `X-ARR-ClientCert` header is added. Accessing client certificate: `HttpRequest.ClientCertificate`:

```cs
// Configure the application to client certificate forwarded the frontend load balancer
services.AddCertificateForwarding(options => { options.CertificateHeader = "X-ARR-ClientCert"; });

// Add certificate authentication so when authorization is performed the user will be created from the certificate
services.AddAuthentication(CertificateAuthenticationDefaults.AuthenticationScheme).AddCertificate();
```

### CORS

For apps: `az webapp cors add --allowed-origins $website ...`

For storage: `az storage cors add --services blob --methods GET POST --origins $website --allowed-headers '*' --exposed-headers '*' --max-age 200 ...`

To enable the sending of credentials like cookies or authentication tokens in your app, the browser may require the `ACCESS-CONTROL-ALLOW-CREDENTIALS` header in the response: `az resource update --set properties.cors.supportCredentials=true --namespace Microsoft.Web --resource-type config --parent sites/<app-name> ...`

## [Diagnostics](https://learn.microsoft.com/en-us/azure/app-service/troubleshoot-diagnostic-logs)

| Type                    | Platform       | Location                                           | Notes                                                                           |
| ----------------------- | -------------- | -------------------------------------------------- | ------------------------------------------------------------------------------- |
| Application logging     | Windows, Linux | App Service file system and/or Azure Storage blobs |                                                                                 |
| Web server logging      | Windows        | App Service file system or Azure Storage blobs     | Raw HTTP request data.                                                          |
| Detailed Error Messages | Windows        | App Service file system                            | Copies of the .htm error pages that would have been sent to the client browser. |
| Failed request tracing  | Windows        | App Service file system                            |                                                                                 |
| Deployment logging      | Windows, Linux | App Service file system                            | Logs for when you publish content to an app.                                    |

The _App Service file system_ option is for temporary debugging purposes, and turns itself off in 12 hours.  
_The Blob_ option is for long-term logging, includes additional information. Only available for .Net application.

Accessing log files:

- Linux/custom containers: `https://<app-name>.scm.azurewebsites.net/api/logs/docker/zip`
- Windows apps: `https://<app-name>.scm.azurewebsites.net/api/dump`

`AppServiceFileAuditLogs` and `AppServiceAntivirusScanAuditLogs` log types are available only for Premium+.

### [Health Checks](https://learn.microsoft.com/en-us/azure/app-service/monitor-instances-health-check?tabs=dotnet)

TODO

## Read more

- [Manage an App Service plan in Azure](https://learn.microsoft.com/en-us/azure/app-service/app-service-plan-manage)

## CLI

- [az appservice plan](https://learn.microsoft.com/en-us/cli/azure/appservice/plan?view=azure-cli-latest)
- [az appservice plan update](https://learn.microsoft.com/en-us/cli/azure/appservice/plan?view=azure-cli-latest#az-appservice-plan-update)
- [az webapp](https://learn.microsoft.com/en-us/cli/azure/webapp?view=azure-cli-latest)
- [az webapp create](https://learn.microsoft.com/en-us/cli/azure/webapp?view=azure-cli-latest#az-webapp-create)
- [az webapp deployment](https://learn.microsoft.com/en-us/cli/azure/webapp/deployment?view=azure-cli-latest)
- [az webapp config](https://learn.microsoft.com/en-us/cli/azure/webapp/config?view=azure-cli-latest)
- [az webapp cors](https://learn.microsoft.com/en-us/cli/azure/webapp/cors?view=azure-cli-latest)
