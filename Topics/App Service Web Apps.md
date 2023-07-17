# [Azure App Service Web Apps](https://docs.microsoft.com/en-us/azure/app-service/)

## [Azure App Service plans](https://learn.microsoft.com/en-us/azure/app-service/overview-hosting-plans)

### Features

- Multi-tenant workers: Free and Shared
- Custom DNS Name: Shared+
- Dedicated workers: Basic+
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
- Single-tenant setup (App Service Environment - ASE): Isolated+
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
    az webapp deployment source config \
      --slot staging \
      --repo-url $gitrepo \
      --branch master --manual-integration \
      --name $webapp --resource-group $resourceGroup

    echo "Swapping staging slot into production"
    az webapp deployment slot swap --name $webapp --resource-group $resourceGroup --slot staging
}

# https://learn.microsoft.com/en-us/azure/app-service/configure-custom-container?tabs=debian&pivots=container-linux#change-the-docker-image-of-a-custom-container
docker_deployment() {
    echo "Deploying from DockerHub" # Custom container
    az webapp config container set \
      --docker-custom-image-name <docker-hub-repo>/<image> \
      --name $webapp --resource-group $resourceGroup
}

# https://learn.microsoft.com/en-us/azure/app-service/configure-custom-container?tabs=debian&pivots=container-linux#use-an-image-from-a-private-registry
private_registry_deployment() {
    echo "Deploying from a private registry"
    az webapp config container set \
      --docker-custom-image-name <image-name> \
      --docker-registry-server-url <private-repo-url> \
      --docker-registry-server-user <username> \
      --docker-registry-server-password <password> \
      --name $webapp --resource-group $resourceGroup
}

# https://learn.microsoft.com/en-us/azure/app-service/configure-custom-container?tabs=debian&pivots=container-linux#change-the-docker-image-of-a-custom-container
managed_entity_registry_deployment() {
  # Enable the system-assigned managed identity for the web app
  az webapp identity assign --query principalId --output tsv --resource-group $resourceGroup --name $webapp

  # Get the resource ID of your Azure Container Registry
  az acr show --name <registry-name> --query id --output tsv --resource-group $resourceGroup

  # Grant the managed identity permission to access the container registry
  az role assignment create --assignee <principal-id> --scope <registry-resource-id> --role "AcrPull"

  # Configure your app to use the managed identity to pull from Azure Container Registry
  az webapp config set --generic-configurations '{"acrUseManagedIdentityCreds": true}' --resource-group $resourceGroup --name $webapp

  # (Optional) If your app uses a user-assigned managed identity, get its client ID
  az identity show --name <identity-name> --query clientId --output tsv --resource-group $resourceGroup

  # (Optional) Set the user-assigned managed identity ID for your app
  az  webapp config set --generic-configurations '{"acrUserManagedIdentityID": "<client-id>"}' --resource-group $resourceGroup --name $webapp

  # # Set the web application to use the Docker image from ACR
  az webapp config container set \
    --docker-custom-image-name <acr-login-server>/<image>:<tag> \
    --docker-registry-server-url https://<acr-login-server> \
    --resource-group $resourceGroup --name $webapp
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
      --settings WORDPRESS_DB_HOST="<mysql-server-name>.mysql.database.azure.com" WORDPRESS_DB_USER="adminuser" WORDPRESS_DB_PASSWORD="letmein" WORDPRESS_DB_NAME="wordpress" MYSQL_SSL_CA="BaltimoreCyberTrustroot.crt.pem" \
    az webapp config appsettings set \
      --resource-group $resourceGroup \
      --name wordpressApp

}

az group delete --name $resourceGroup
```

## [Configuration](https://learn.microsoft.com/en-us/azure/app-service/configure-common?tabs=cli)

App settings are always encrypted when stored (encrypted-at-rest).

App Service passes app settings to the container using the `--env` flag to set the environment variable in the container.

### App Settings

Variables passed as environment variables to the application code, injected into app environment at startup. When you add, remove, or edit app settings, App Service triggers an app restart. The values in App Service override the ones in `Web.config` (`<appSettings>`) or `appsettings.json`.

```ps
az webapp config appsettings set --settings <setting-name>="<value>" ...
```

Example:

```cs
// az webapp config appsettings set --settings MySetting="MyValue" --name <app-name> --resource-group <group-name>
string mySettingValue = Configuration["MySetting"];
```

Buk editing:

```jsonc
// Save: az webapp config appsettings list --name <app-name> --resource-group <group-name> > settings.json

// settings.json
[
  {
    "name": "key1",
    "slotSetting": false,
    "value": "value1"
  },
  {
    "name": "key2",
    "value": "value2"
  }
  // ...
]

// Load: az webapp config appsettings set --resource-group <group-name> --name <app-name> --settings @settings.json
```

Configuration data is hierarchical (settings can have sub-settings). In Azure CLI `__` denotes the hierarchy.

Example:

```cs
// az webapp config appsettings set --settings MySetting__MySubSetting="MyValue" --name <app-name> --resource-group <group-name>
Configuration["MySetting__MySubSetting"];
Configuration["MySetting:MySubSetting"];
Configuration["MySetting/MySubSetting"];
```

### Connection Strings

Like setting them in `<connectionStrings>` in `Web.config`. Available as environment variables at runtime, prefixed with the connection types like SQLServer, MySQL, SQLAzure, Custom, PostgreSQL.

```ps
az webapp config connection-string set --connection-string-type <type> --settings <string-name>='<value> ...'
```

Example:

```cs
//az webapp config connection-string set --connection-string-type SQLServer --settings MyDb="Server=myserver;Database=mydb;User Id=myuser;Password=mypassword; --name <app-name> --resource-group <group-name>"
string myConnectionString = Configuration.GetConnectionString("MyDb");
string myConnectionStringEnv = Environment.GetEnvironmentVariable("SQLServer_MyDb");
```

Buk editing:

```jsonc
// Save: az webapp config connection-string list --name <app-name> --resource-group <group-name> > settings.json

// settings.json
[
  {
    "name": "name-1",
    "value": "conn-string-1",
    "type": "SQLServer",
    "slotSetting": false
  },
  {
    "name": "name-2",
    "value": "conn-string-2",
    "type": "PostgreSQL"
  }
  // ...
]

// Load: az webapp config connection-string set --resource-group <group-name> --name <app-name> --settings @settings.json
```

### General Settings

```ps
az webapp config set --name <app-name> --resource-group <resource-group-name> \
    --use-32bit-worker-process [true|false] \
    --web-sockets-enabled [true|false] \
    --always-on [true|false] \
    --http20-enabled \
    --auto-heal-enabled [true|false] \
    --remote-debugging-enabled [true|false] \
    --number-of-workers

az webapp config appsettings set --name <app-name> --resource-group <resource-group-name> /
    --settings \
        WEBSITES_PORT=8000
        PRE_BUILD_COMMAND="echo foo, scripts/prebuild.sh" \
        POST_BUILD_COMMAND="echo foo, scripts/postbuild.sh" \
        PROJECT="<project-name>/<project-name>.csproj" \ # Deploy multi-project solutions
        ASPNETCORE_ENVIRONMENT="Development"
        # Custom environment variables
        DB_HOST="myownserver.mysql.database.azure.com"

```

### ARM Templates

`az group export --name $resourceGroup` - create ARM template

`az group deployment export --name $resourceGroup --deployment-name $deployment` - create ARM template for specific deploy

`az deployment group create --resource-group $resourceGroup --template-file $armTemplateJsonFile` - create deployment group from ARM template

## [Persistence](https://learn.microsoft.com/en-us/azure/app-service/configure-custom-container?tabs=debian&pivots=container-linux#use-persistent-shared-storage)

When persistent storage is _on_ (default for Linux containers), the `/home` directory allows file persistence and sharing. All writes to `/home` are accessible by all instances, but existing files overwrite /home's contents on start.

`/home/LogFiles` always persists if logging is enabled, regardless of persistent storage status.

Disable default persistent storage on Linux containers: `az webapp config appsettings set --settings WEBSITES_ENABLE_APP_SERVICE_STORAGE=false ...`

### [Mount Azure Storage as a local share in App Service](https://learn.microsoft.com/en-us/azure/app-service/configure-connect-to-azure-storage?tabs=cli&pivots=container-linux)

Mount: `az webapp config storage-account add --custom-id <custom-id> --storage-type AzureFiles --share-name <share-name> --account-name <storage-account-name> --access-key "<access-key>" --mount-path <mount-path-directory> ...`  
Check: `az webapp config storage-account list ...`

- Don't map to `/`, `/home`, or `/tmp` to avoid issues.
- App backups don't include storage mounts.
- Storage mount changes will restart the app.
- Keep your app and Azure Storage in the same region.
- Deleting Azure Storage requires corresponding mount configuration removal.
- Don't use mounts for local databases or apps needing file locks.
- Storage failover disconnects the mount until app restart or mount reconfiguration.

## Security

### Authentication

#### [Service Identity](https://learn.microsoft.com/en-us/azure/app-service/overview-managed-identity)

Managed identities from Azure Active Directory (Azure AD) allow your app to access other Azure AD-protected resources without needing to provision or rotate any secrets.

- **System-assigned identity**: Tied to specific application and is deleted if the app gets deleted. An app can only have one system-assigned identity.
- **User-assigned identity**: A standalone Azure resource that can be assigned to any app. An app can have multiple user-assigned identities.

Each deployment slot / app has it's own managed identity configuration.

Managed identities won't behave as expected if your app is migrated across subscriptions or tenants.

Add a system-assigned identity: `az webapp identity assign --name $app --resource-group $resourceGroup`

Add a user-assigned identity:

```ps
az identity create --name $identityName --resource-group $resourceGroup
az webapp identity assign --identities $identityName --resource-group $resourceGroup --name $app
```

##### Connect to Azure services in app code

When you're using managed identities in Azure, you need to configure the target resource to allow access from your app or function.

From Azure Portal: `Settings > Access policies > Add Access Policy` select the permissions you want to grant to the managed identity, then the name of the managed identity (system or user assigned). Removing policy may take up to 24hrs to take effect (cache).

Using SDK:

```cs
// This will return a token using the Managed Identity if available (either System-assigned or User-assigned).
new DefaultAzureCredential();

// This will return a token using the specified User-Assigned Managed Identity.
new DefaultAzureCredential(new DefaultAzureCredentialOptions { ManagedIdentityClientId = "<your managed identity client Id>" });
```

##### REST endpoint reference

`IDENTITY_ENDPOINT` environment variable contains an endpoint from which apps can request tokens.

- Required parameters: `resource`, `api-version`, `X-IDENTITY-HEADE` (header)
- Optional parameters: `client_id`, `principal_id`, `mi_res_id`

For user-assigned identities, include an optional property; without it, a system-assigned identity token is requested.

Example:

```http
GET {IDENTITY_ENDPOINT}?resource=https://vault.azure.net&api-version=2019-08-01&client_id=XXX
X-IDENTITY-HEADER: {IDENTITY_HEADER}
```

#### [On-Behalf-Of (OBO)](https://learn.microsoft.com/en-us/azure/app-service/overview-authentication-authorization)

an OAuth feature allowing an application to access resources using a user's permissions, without needing their credentials. Azure App Service's built-in authentication module manages this process, handling sessions and OAuth tokens. It can authenticate all or specific requests, redirecting unauthenticated users appropriately (login page for web and 401 for mobile). When enabled, user tokens are managed in a token store.

In Linux and containers the auth module runs in a separate container, isolated from application code.

##### Authentication flows

- **Server-directed** (no SDK): handled by App Service, for browser apps
- **Client-directed** (SDK): handled by the app, for non-browser apps

| Step                            | Server-directed                                               | Client-directed                                                                              |
| ------------------------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Sign user in                    | Redirects client to `/.auth/login/aad` (MS Identity Platform) | Client code signs user in directly with provider's SDK and receives an authentication token. |
| Post-authentication             | Provider redirects client to `/.auth/login/aad/callback`      | Client code posts token from provider to `/.auth/login/aad` for validation.                  |
| Establish authenticated session | App Service adds authenticated cookie to response             | App Service returns its own authentication token to client code                              |
| Serve authenticated content     | Client includes authentication cookie in subsequent requests  | Client code presents authentication token in `X-ZUMO-AUTH` header                            |

Access another app: Add header `Authorization: Bearer ${req.headers['x-ms-token-aad-access-token']}`

#### Other Authentication Options

```cs
// Use a Service Principal with its details stored in environment variables: AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET
new EnvironmentCredential(); // or new DefaultAzureCredential() when variables are set

// Use a Service Principal with its details provided directly
new ClientSecretCredential("<Tenant ID>", "<Client ID>", "<Client Secret>");

// Use interactive authentication (a browser window will open for you to log in)
new DefaultAzureCredential(includeInteractiveCredentials: true);
```

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

## Networking

- **Deployment Types**

  - Multi-tenant setup where your application shares resources with other applications.
  - Single-tenant setup, called App Service Environment (ASE), where your application gets its own dedicated resources within your Azure virtual network.

- [**Networking Features**](https://learn.microsoft.com/en-us/azure/app-service/networking-features): Manage both incoming (inbound) and outgoing (outbound) network traffic.

  | Feature                                      | Type     | Use Cases                                                                           |
  | -------------------------------------------- | -------- | ----------------------------------------------------------------------------------- |
  | App-assigned address                         | Inbound  | Support IP-based SSL for your app; Support a dedicated inbound address for your app |
  | Access restrictions                          | Inbound  | Restrict access to your app from a set of well-defined IP addresses                 |
  | Service endpoints/Private endpoints          | Inbound  | Restrict access to your Azure Service Resources to only your virtual network        |
  | Hybrid Connections                           | Outbound | Access an on-premises system or service securely                                    |
  | Gateway-required virtual network integration | Outbound | Access Azure or on-premises resources via ExpressRoute or VPN                       |
  | Virtual network integration                  | Outbound | Access Azure network resources                                                      |

- **Default Networking Behavior**: Free and Shared plans use multi-tenant workers, meaning your application shares resources with others. Plans from Basic and above use dedicated workers, meaning your application gets its own resources.

- **Outbound Addresses**: When your application needs to make a call to an external service, it uses an outbound IP address. This address is shared among all applications running on the same type of worker VM.

  - To find the current outbound IP addresses: `az webapp show --query outboundIpAddresses ...`
  - To find all possible outbound IP addresses: `az webapp show --query possibleOutboundIpAddresses ...`

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

Health Check pings the specified path every minute. If an instance fails to respond with a valid status code after 10 requests, it's marked unhealthy and removed from the load balancer. If it recovers, it's returned to the load balancer. If it stays unhealthy for an hour, it's replaced (only for Basic+).

For private endpoints check if `x-ms-auth-internal-token` request header equals the hashed value of `WEBSITE_AUTH_ENCRYPTION_KEY` environment variable.

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
- [az webapp show](https://learn.microsoft.com/en-us/cli/azure/webapp?view=azure-cli-latest#az-webapp-show)
- [az webapp identity](https://learn.microsoft.com/en-us/cli/azure/webapp/identity?view=azure-cli-latest)
- [az identity](https://learn.microsoft.com/en-us/cli/azure/identity?view=azure-cli-latest)
