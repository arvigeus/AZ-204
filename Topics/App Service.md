# [Azure App Service](https://docs.microsoft.com/en-us/azure/app-service/)

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

### Tiers

- **Shared compute**: **Free** (F1) and **Shared** (D1) tiers run apps on the same Azure VM with other customer apps, sharing resources and limited CPU quotas. They are suitable for _development_ and _testing_ only. Each app is charged for _CPU quota_.

- **Dedicated compute**: **Basic** (_default_) (B1), **Standard** (S1), **Premium** (P1V1), **PremiumV2** (P1V2), and **PremiumV3** (P1V3) tiers utilize dedicated Azure VMs. Apps within the same App Service plan share compute resources. Higher tiers provide more VM instances for scale-out capabilities. Scaling out (_autoscale_) simply adds another VM with the same applications and services. _Each VM instance_ is charged.

- **Isolated** (I1): The **Isolated** and **IsolatedV2** tiers run dedicated Azure VMs on _dedicated Azure Virtual Networks_. It provides network isolation on top of compute isolation to your apps. It provides the _maximum scale-out capabilities_. Charging is based on the _number of isolated workers that run your apps_.

You can move an app to another App Service plan, as long as the source plan and the target plan are in the same resource group, geographical region, and of the same OS type, and supports the currently used features.

App Service plans that have no apps associated with them still incur charges because they continue to reserve the configured VM instances.

Deployment slots, diagnostic logs, perforing backups, apps in the same App Service plan, and WebJobs _run on the same VM instances_.

When to isolate an app into a new App Service plan:

- The app is resource-intensive.
- You want to scale the app independently from the other apps in the existing plan.
- The app needs resource in a different geographical region.

```sh
# Move web app to another location by cloning it

New-AzResourceGroup -Name DestinationAzureResourceGroup -Location $destinationLocation
New-AzAppServicePlan -Location $destinationLocation -ResourceGroupName DestinationAzureResourceGroup -Name DestinationAppServicePlan -Tier Standard

$srcapp = Get-AzWebApp -ResourceGroupName SourceAzureResourceGroup -Name MyAppService
$destapp = New-AzWebApp -ResourceGroupName DestinationAzureResourceGroup -Name MyAppService2 -Location $destinationLocation -AppServicePlan DestinationAppServicePlan -SourceWebApp $srcapp
```

### [Scaling](https://learn.microsoft.com/en-us/azure/app-service/manage-automatic-scaling?tabs=azure-portal)

The scale settings affect all apps in your App Service plan

- **Manual scaling** (Basic+) - one time events (example: doing X on this date)
- **Autoscale** (Standard+) - for predictable changes of application load, based on schedules (every X days/weeks/months) or resources
- **Automatic scaling** (PremiumV2+) - like autoscale, but allows avoiding _cold start_ issues with _pre-warmed_ and _always ready_ instances

  ```sh
  az appservice plan update --name $appServicePlanName --resource-group $resourceGroup \
      # enables automatic scaling
      --elastic-scale true --max-elastic-worker-count <YOUR_MAX_BURST> \
      # disable automatic scaling
      --elastic-scale false
  ```

Horizontal scaling: Adding/removing virtual machines.

**Scale out** (increase VM instances): If _any_ of the rules are met  
**Scale in** (decrease VM instances): If _all_ rules are met

[**Flapping**](https://learn.microsoft.com/en-us/azure/azure-monitor/autoscale/autoscale-flapping): a loop condition where a scale event triggers its opposite in a series of alternating events.

## [Deployment slots](https://learn.microsoft.com/en-us/azure/app-service/deploy-staging-slots)

Require Standard+.

[Best practices](https://learn.microsoft.com/en-us/azure/app-service/deploy-best-practices): Deploy to staging, then swap slots to warm up instances and eliminate downtime.

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

To enable settings swapping, add `WEBSITE_OVERRIDE_PRESERVE_DEFAULT_STICKY_SLOT_SETTINGS` as an app setting in every slot and set it to 0 or false. All settings are either swappable or not. Managed identities are never swapped.

### Route production traffic manually

`x-ms-routing-name=`: `self` for production slot, `staging` for staging slot.

Example: `<a href="<webappname>.azurewebsites.net/?x-ms-routing-name=self">Go back to production app</a> | <a href="<webappname>.azurewebsites.net/?x-ms-routing-name=staging">Go back to staging app</a>`

By default, all client requests go to the production slot. You can route a portion of the traffic to another slot. The default rule for a new deployment slot is 0% (no random transfers to other slots).

```sh
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

# https://learn.microsoft.com/en-us/azure/app-service/deploy-zip?tabs=cli
# uses the same Kudu service that powers continuous integration-based deployments
zip_archive() {
  az webapp deploy --resource-group <group-name> --name <app-name> --src-path <zip-package-path>
  # Zip from url
  # az webapp deploy --resource-group <group-name> --name <app-name> --src-url "https://storagesample.blob.core.windows.net/sample-container/myapp.zip?sv=2021-10-01&sb&sig=slk22f3UrS823n4kSh8Skjpa7Naj4CG3

  # (Optional) Enable build automation
  # az webapp config appsettings set --resource-group <group-name> --name <app-name> --settings SCM_DO_BUILD_DURING_DEPLOYMENT=true
}
```

## [Configuration](https://learn.microsoft.com/en-us/azure/app-service/configure-common?tabs=cli)

App settings are always encrypted when stored (encrypted-at-rest).

App Service passes app settings to the container using the `--env` flag to set the environment variable in the container.

### App Settings

Variables passed as environment variables to the application code, injected into app environment at startup. When you add, remove, or edit app settings, App Service triggers an app restart. The values in App Service override the ones in `Web.config` (`<appSettings>`) or `appsettings.json`.

```sh
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

```sh
az webapp config connection-string set --connection-string-type <type> --settings <string-name>='<value> ...'
```

Example:

```cs
//az webapp config connection-string set --connection-string-type SQLServer --settings MyDb="Server=myserver;Database=mydb;User Id=myuser;Password=mypassword;" --name <app-name> --resource-group <group-name>
string myConnectionString = Configuration.GetConnectionString("MyDb");
string myConnectionStringVerbose = Configuration.GetConnectionString("SQLCONNSTR_MyDb"); // Same as above
string myConnectionStringEnv = Environment.GetEnvironmentVariable("SQLCONNSTR_MyDb"); // Same as above
```

Bulk editing:

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

```sh
az webapp config set --name <app-name> --resource-group <resource-group-name> \
    --use-32bit-worker-process [true|false] \
    --web-sockets-enabled [true|false] \
    --always-on [true|false] \
    --http20-enabled \
    --auto-heal-enabled [true|false] \
    --remote-debugging-enabled [true|false] \ # turn itself off after 48 hours
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

### Handler Mappings

Add custom script processors to handle requests for specific file extensions.

- **Extension**: The file extension you want to handle, such as _\*.php_ or _handler.fcgi_.
- **Script processor**: The absolute path of the script processor. Requests to files that match the file extension are processed by the script processor. Use the path `D:\home\site\wwwroot` to refer to your app's root directory.
- **Arguments**: Optional command-line arguments for the script processor.

### Map a URL path to a directory

```jsonc
// json.txt
[
  {
    "physicalPath"':' "site\\wwwroot\\public", // serve app from /public instead of root (site\\wwwroot)
    "preloadEnabled"':' false,
    "virtualDirectories"':' null,
    "virtualPath"':' "/" // any path can be mapped
  }
]

// az resource update --set properties.virtualApplications=@json.txt --resource-type Microsoft.Web/sites/config --resource-group <group-name> --name <app-name>
```

This works for both Windows and Linux apps.

### ARM Templates

In JSON format.

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

Linux containers: Azure Files are read/write, Azure blobs are read only. Up to 5 mount points per app. Code deployed to built-in images uses Azure Storage with higher disk latency.

- Don't map to `/`, `/home`, or `/tmp` to avoid issues.
- App backups don't include storage mounts.
- Storage mount changes will restart the app.
- Keep your app and Azure Storage in the same region.
- Deleting Azure Storage requires corresponding mount configuration removal.
- Don't use mounts for local databases or apps needing file locks.
- Storage failover disconnects the mount until app restart or mount reconfiguration.

## Security

### Authentication

In Linux and containers the auth module runs in a separate container, isolated from application code.

#### [Service Identity](https://learn.microsoft.com/en-us/azure/app-service/overview-managed-identity)

Managed identities from Azure Active Directory (Azure AD) allow your app to access other Azure AD-protected resources without needing to provision or rotate any secrets.

- **System-assigned identity**: Tied to specific application and is deleted if the app gets deleted. An app can only have one system-assigned identity.
- **User-assigned identity**: A standalone Azure resource that can be assigned to any app. An app can have multiple user-assigned identities.

Each deployment slot / app has it's own managed identity configuration.

Managed identities won't behave as expected if your app is migrated across subscriptions or tenants.

Add a system-assigned identity: `az webapp identity assign --name $app --resource-group $resourceGroup`

Add a user-assigned identity:

```sh
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

An app with a managed identity makes this endpoint available by defining two environment variables:

- `IDENTITY_ENDPOINT` endpoint from which apps can request tokens.
- `IDENTITY_HEADER` - used to help mitigate server-side request forgery (SSRF) attacks.

Endpoint parameters:

- Required: `resource`, `api-version`, `X-IDENTITY-HEADER` (header)
- Optional: `client_id`, `principal_id`, `mi_res_id`

For user-assigned identities, include one of the optional properties; without it, a system-assigned identity token is requested.

Example:

```http
GET {IDENTITY_ENDPOINT}?resource=https://vault.azure.net&api-version=2019-08-01&client_id=XXX
X-IDENTITY-HEADER: {IDENTITY_HEADER}
```

#### [On-Behalf-Of (OBO)](https://learn.microsoft.com/en-us/azure/app-service/overview-authentication-authorization)

An OAuth feature allowing an application to access resources using a user's permissions, without needing their credentials. Azure App Service's built-in authentication module manages this process, handling sessions and OAuth tokens. It can authenticate all or specific requests, redirecting unauthenticated users appropriately (login page for web and 401 for mobile). When enabled, user tokens are managed in a token store.

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

##### Access user claims in app code

```cs
private class ClientPrincipalClaim
{
    [JsonPropertyName("typ")]
    public string Type { get; set; }
    [JsonPropertyName("val")]
    public string Value { get; set; }
}

private class ClientPrincipal
{
    [JsonPropertyName("auth_typ")]
    public string IdentityProvider { get; set; }
    [JsonPropertyName("name_typ")]
    public string NameClaimType { get; set; }
    [JsonPropertyName("role_typ")]
    public string RoleClaimType { get; set; }
    [JsonPropertyName("claims")]
    public IEnumerable<ClientPrincipalClaim> Claims { get; set; }
}

public static ClaimsPrincipal Parse(HttpRequest req)
{
    var principal = new ClientPrincipal();

    if (req.Headers.TryGetValue("x-ms-client-principal", out var header))
    {
        var data = header[0];
        var decoded = Convert.FromBase64String(data);
        var json = Encoding.UTF8.GetString(decoded);
        principal = JsonSerializer.Deserialize<ClientPrincipal>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
    }

    /**
      *  At this point, the code can iterate through `principal.Claims` to
      *  check claims as part of validation. Alternatively, we can convert
      *  it into a standard object with which to perform those checks later
      *  in the request pipeline. That object can also be leveraged for
      *  associating user data, etc. The rest of this function performs such
      *  a conversion to create a `ClaimsPrincipal` as might be used in
      *  other .NET code.
      */

    var identity = new ClaimsIdentity(principal.IdentityProvider, principal.NameClaimType, principal.RoleClaimType);
    identity.AddClaims(principal.Claims.Select(c => new Claim(c.Type, c.Value)));

    return new ClaimsPrincipal(identity);
}
```

### [Certificates](https://learn.microsoft.com/en-us/azure/app-service/configure-ssl-certificate?tabs=apex)

A certificate is accessible to all apps in the same resource group and region combination.

- **Free Managed Certificate**: Auto renewed every 6 months, no wildcard certificates or private DNS, can't be exported, not supported in ASE.
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

For NodeJs, client certificate is accessed through request header: `req.get('X-ARR-ClientCert');`

### CORS

For apps: `az webapp cors add --allowed-origins $website ...`

For storage: `az storage cors add --services blob --methods GET POST --origins $website --allowed-headers '*' --exposed-headers '*' --max-age 200 ...`

To enable the sending of credentials like cookies or authentication tokens in your app, the browser may require the `ACCESS-CONTROL-ALLOW-CREDENTIALS` header in the response: `az resource update --set properties.cors.supportCredentials=true --namespace Microsoft.Web --resource-type config --parent sites/<app-name> ...`

The roles that handle incoming HTTP or HTTPS requests are called _front ends_. The roles that host the customer workload are called _workers_.

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

- **Default Networking Behavior**: Free and Shared plans use multi-tenant workers, meaning your application shares resources with others. Plans from Basic and above use dedicated workers, meaning your application gets its own resources. If you have a Standard App Service plan, all the apps in that plan run on the same worker.

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

- Linux/custom containers: `https://<app-name>.scm.azurewebsites.net/api/logs/docker/zip`. The ZIP file contains console output logs for both the docker host and the docker container.
- Windows apps: `https://<app-name>.scm.azurewebsites.net/api/dump`

`AppServiceFileAuditLogs` and `AppServiceAntivirusScanAuditLogs` log types are available only for Premium+.

`AllMetrics` settings are collected by agents on to the App Service and report the usage of host resources. These are items like CPU usage, memory usage, and disk I/O used.

### Stream logs

To stream logs in the Azure portal, navigate to your app and select **Log stream**.

Logs written to .txt, .log, or .htm files in `/home/LogFiles` (or `D:\home\LogFiles` for Windows apps) . Note, some logs may appear out of order due to buffering.

CLI: `az webapp log tail ...`

### [Monitoring apps](https://learn.microsoft.com/en-us/azure/app-service/web-sites-monitor)

Metrics: CPU Percentage, Memory Percentage, Data In, Data Out - used across all instances of the plan (**not a single app!**).

Example: `Metric: CPU Percentage; Resource: <AppServicePlanName>`

```sh
az monitor metrics list --resource <app_service_plan_resource_id> --metric "Percentage CPU" --time-grain PT1M --output table
```

CPU Time is valuable for apps on Free or Shared plans, where quotas are set by app's CPU minutes usage.  
The CPU percentage is valuable for apps on Basic, Standard, and Premium plans, providing insights into usage across scalable instances.

### [Health Checks](https://learn.microsoft.com/en-us/azure/app-service/monitor-instances-health-check?tabs=dotnet)

Health Check pings the specified path every minute. If an instance fails to respond with a valid status code after 10 requests, it's marked unhealthy and removed from the load balancer. If it recovers, it's returned to the load balancer. If it stays unhealthy for an hour, it's replaced (only for Basic+).

For private endpoints check if `x-ms-auth-internal-token` request header equals the hashed value of `WEBSITE_AUTH_ENCRYPTION_KEY` environment variable. You should first use features such as IP restrictions, client certificates, or a Virtual Network to restrict application access.

Configure path: `az webapp config set --health-check-path <Path> --resource-group <ResourceGroup> --name <AppName>`

## [Mount Azure Storage as a local share in App Service](https://learn.microsoft.com/en-us/azure/app-service/configure-connect-to-azure-storage)

- Built-in Linux images use Azure Storage with higher latency. For heavy read-only file access, custom containers are better as they reduce latency by storing files in the container filesystem.
- Supports Azure Files (read/write) and Azure Blobs (read-only for Linux).
- Storage failover requires app restart or remounting of Azure Storage.

- Use `az webapp config storage-account add` to mount.
- Use `az webapp config storage-account list` to verify.

### Limitations

- Storage firewall support via service and private endpoints only.
- No FTP/FTPS for custom-mounted storage.
- Mapping restrictions.
- Azure Storage billed separately from App Service.

### Best Practices

- Place app and storage in the same Azure region.
- Avoid regenerating access key.
- Don't use for local databases or apps relying on file handles and locks.

## Read more

- [Manage an App Service plan in Azure](https://learn.microsoft.com/en-us/azure/app-service/app-service-plan-manage)

## CLI

| Command                                                                                                                                  | Brief Explanation                                         | Example                                                                                                                              |
| ---------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| [az appservice plan](https://learn.microsoft.com/en-us/cli/azure/appservice/plan?view=azure-cli-latest)                                  | Manage App Service Plans.                                 | `az appservice plan create --name MyPlan --resource-group MyResourceGroup --sku FREE`                                                |
| [az appservice plan update](https://learn.microsoft.com/en-us/cli/azure/appservice/plan?view=azure-cli-latest#az-appservice-plan-update) | Update an App Service Plan.                               | `az appservice plan update --name MyPlan --sku STANDARD`                                                                             |
| [az webapp](https://learn.microsoft.com/en-us/cli/azure/webapp?view=azure-cli-latest)                                                    | Manage web apps.                                          | `az webapp list`                                                                                                                     |
| [az webapp create](https://learn.microsoft.com/en-us/cli/azure/webapp?view=azure-cli-latest#az-webapp-create)                            | Create a web app.                                         | `az webapp create --name MyApp --plan MyPlan --resource-group MyResourceGroup`                                                       |
| [az webapp deployment](https://learn.microsoft.com/en-us/cli/azure/webapp/deployment?view=azure-cli-latest)                              | Manage web app deployments.                               | `az webapp deployment list-publishing-profiles --name MyApp`                                                                         |
| [az webapp config](https://learn.microsoft.com/en-us/cli/azure/webapp/config?view=azure-cli-latest)                                      | Manage web app configurations.                            | `az webapp config set --name MyApp --ftps-state AllAllowed`                                                                          |
| [az webapp config appsettings](https://learn.microsoft.com/en-us/cli/azure/webapp/config/appsettings?view=azure-cli-latest)              | Manage web app appsettings.                               | `az webapp config appsettings set --name MyApp --settings KEY=VALUE`                                                                 |
| [az webapp config connection-string](https://learn.microsoft.com/en-us/cli/azure/webapp/config/connection-string?view=azure-cli-latest)  | Manage web app connection strings.                        | `az webapp config connection-string set --name MyApp --connection-string-type SQLAzure --settings NAME=CONNECTION_STRING`            |
| [az webapp cors](https://learn.microsoft.com/en-us/cli/azure/webapp/cors?view=azure-cli-latest)                                          | Manage Cross-Origin Resource Sharing (CORS) for web apps. | `az webapp cors add --name MyApp --allowed-origins 'https://example.com'`                                                            |
| [az webapp show](https://learn.microsoft.com/en-us/cli/azure/webapp?view=azure-cli-latest#az-webapp-show)                                | Get details of a web app.                                 | `az webapp show --name MyApp --resource-group MyResourceGroup`                                                                       |
| [az webapp identity](https://learn.microsoft.com/en-us/cli/azure/webapp/identity?view=azure-cli-latest)                                  | Manage web app's managed service identity.                | `az webapp identity assign --name MyApp --resource-group MyResourceGroup`                                                            |
| [az identity](https://learn.microsoft.com/en-us/cli/azure/identity?view=azure-cli-latest)                                                | Manage Managed Service Identities (MSI).                  | `az identity create --resource-group MyResourceGroup --name MyIdentity`                                                              |
| [az webapp log](https://learn.microsoft.com/en-us/cli/azure/webapp/log?view=azure-cli-latest)                                            | Manage web app logs.                                      | `az webapp log tail --name MyApp --resource-group MyResourceGroup`                                                                   |
| [az resource update](https://learn.microsoft.com/en-us/cli/azure/resource?view=azure-cli-latest#az-resource-update)                      | Update a resource.                                        | `az resource update --ids RESOURCE_ID --set properties.key=value`                                                                    |
| [az webapp config storage-account](https://learn.microsoft.com/en-us/cli/azure/webapp/config/storage-account?view=azure-cli-latest)      | Manage web app's Azure Storage account configurations.    | `az webapp config storage-account update --name MyApp --custom-id CustomId --storage-type AzureBlob --account-name MyStorageAccount` |
| [az webapp list-runtimes](https://learn.microsoft.com/en-us/cli/azure/webapp?view=azure-cli-latest#az-webapp-list-runtimes)              | List available runtime stacks.                            | `az webapp list-runtimes --linux`                                                                                                    |
| [az monitor metrics](https://learn.microsoft.com/en-us/cli/azure/monitor/metrics?view=azure-cli-latest)                                  | Manage metrics.                                           | `az monitor metrics list --resource RESOURCE_ID --metric-names "Percentage CPU"`                                                     |
