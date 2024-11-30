# [Azure App Service](https://docs.microsoft.com/en-us/azure/app-service/)

## [Azure App Service plans](https://learn.microsoft.com/en-us/azure/app-service/overview-hosting-plans)

### Features

- Multi-tenant workers: Free and Shared
- Dedicated workers: Basic+
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
- Single-tenant setup (App Service Environment - ASE): Isolated+
- Dedicated Azure Virtual Networks: Isolated+
- Maximum scale-out: Isolated+

The roles that handle incoming HTTP or HTTPS requests are called _front ends_. The roles that host the customer workload are called _workers_.

### Tiers

- **Shared compute**: **Free** (F1) and **Shared** (D1) tiers run apps on the same Azure VM with other customer apps, sharing resources and limited CPU quotas. ⭐: _development_ and _testing_ only. Each app is charged for _CPU quota_.

- **Dedicated compute**: **Basic** ⏺️ (B1), **Standard** (S1), **Premium** (P1V1), **PremiumV2** (P1V2), and **PremiumV3** (P1V3) tiers utilize dedicated Azure VMs. Apps within the same App Service plan share compute resources. Higher tiers provide more VM instances for scale-out capabilities. Scaling out (_autoscale_) simply adds another VM with the same applications and services. _Each VM instance_ is charged.

- **Isolated** (I1): The **Isolated** and **IsolatedV2** tiers run dedicated Azure VMs on _dedicated Azure Virtual Networks_. It provides network isolation on top of compute isolation to your apps. It provides the _maximum scale-out capabilities_. Charging is based on the _number of isolated workers that run your apps_.

App Service plans that have no apps associated with them still incur charges because they continue to reserve the configured VM instances.

Deployment slots, diagnostic logs, perforing backups, apps in the same App Service plan, and WebJobs _run on the same VM instances_.

When to isolate an app into a new App Service plan:

- The app is resource-intensive.
- You want to scale the app independently from the other apps in the existing plan.
- The app needs resource in a different geographical region.

#### [Move App Service plan](https://learn.microsoft.com/en-us/azure/app-service/app-service-plan-manage)

By cloning it. Source plan and destination plan must be in the same resource group, geographical region, same OS type, and supports the currently used features.

```ps
New-AzResourceGroup -Name DestinationAzureResourceGroup -Location $destinationLocation
New-AzAppServicePlan -Location $destinationLocation -ResourceGroupName DestinationAzureResourceGroup -Name DestinationAppServicePlan -Tier Standard

$srcapp = Get-AzWebApp -Name MyAppService -ResourceGroupName SourceAzureResourceGroup
$destapp = New-AzWebApp -SourceWebApp $srcapp -AppServicePlan DestinationAppServicePlan -Location $destinationLocation -ResourceGroupName DestinationAzureResourceGroup -Name MyAppService2
```

### [Scaling](https://learn.microsoft.com/en-us/azure/app-service/manage-automatic-scaling?tabs=azure-portal)

Settings affect all apps in your App Service plan

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

- **Scale out** (increase VM instances): If _any_ of the rules are met
- **Scale in** (decrease VM instances): If _all_ rules are met

Vertical scaling: Scale up/down - when changing app service plan

[**Flapping**](https://learn.microsoft.com/en-us/azure/azure-monitor/autoscale/autoscale-flapping): a loop condition where a scale event triggers its opposite in a series of alternating events.

Setting up a scaling rule:

- Switch the web app to the Standard App Service Plan (for Autoscale you need Premium)
- Activate autoscaling for the Web App
- Create a scaling rule
- Set up a scaling condition

### Continuous integration/deployment

Built-in CI/CD with Git (Azure DevOps, third-party, local), FTP, and container registries (ACR, third-party).

## [Deployment slots](https://learn.microsoft.com/en-us/azure/app-service/deploy-staging-slots)

Require Standard+.

All of the slots for a web app share the same deployment plan and virtual machines. They have different host names.

[Best practices](https://learn.microsoft.com/en-us/azure/app-service/deploy-best-practices): Deploy to staging, then swap slots to warm up instances and eliminate downtime.

- **Swapped**: Settings that define the application's _behavior_. Includes connection strings, authentication settings, public certificates, path mappings, CDN, hybrid connections.
- **Not Swapped**: Settings that define the application's _environment and security_. They are less about the application itself and more about how it interacts with the external world. Examples: Private certificates, managed identities, publishing endpoints, diagnostic logs settings, CORS.

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

Note: **Hybrid Connections**: Lets your Azure App talk to your local server securely without changing firewall settings.

### [Custom deployment](https://github.com/projectkudu/kudu/wiki/Customizing-deployments)

`.deployment` file:

```txt
command = deploy.cmd # Run script before deployment
# project = WebProject/WebProject.csproj
```

### Route production traffic manually

`x-ms-routing-name=`: `self` for production slot, `staging` for staging slot.

Example: `<a href="<webappname>.azurewebsites.net/?x-ms-routing-name=self">Go back to production app</a> | <a href="<webappname>.azurewebsites.net/?x-ms-routing-name=staging">Go back to staging app</a>`

⏺️: All requests go to production. Traffic can be split; new slots start at 0% (no random transfers to other slots).

## [Configuration](https://learn.microsoft.com/en-us/azure/app-service/configure-common?tabs=cli)

App settings are always encrypted when stored (encrypted-at-rest).

App Service passes app settings to the container using the `--env` flag to set the environment variable in the container.

App Settings and Connection Strings are set at app startup and **trigger a restart when changed**. They override settings in `Web.config` or `appsettings.json`.

- **Always On**: Keeps app loaded; off by default and app unloads after 20 mins of inactivity. Needed for Application Insights Profiler, continuous WebJobs or WebJobs triggered by a CRON expression.
- **ARR affinity**: In a multi-instance deployment, ensure that the client is routed to the same instance for the life of the session.

### App Settings

Configuration data is hierarchical (settings can have sub-settings). In Linux, nested setting name like `ApplicationInsights:InstrumentationKey` needs to be configured as `ApplicationInsights__InstrumentationKey` Dots (`.`) will be replaced with `_`.

```cs
// az webapp config appsettings set --settings MySetting="<value>" MyParentSetting__MySubsetting="<value>" ...
string mySettingValue = Configuration["MySetting"];
string myParentSettingValue = Configuration["MyParentSetting/MySubSetting"]; // same as "MyParentSetting:MySubSetting" and "MyParentSetting__MySubSetting"
```

```jsonc
// Save: az webapp config appsettings list --name $appName --resource-group $resourceGroup > settings.json

// settings.json
[
  { "name": "key1", "value": "value1", "slotSetting": false },
  { "name": "key2", "value": "value2" }
  // ...
]

// Load: az webapp config appsettings set --resource-group $resourceGroup --name $appName --settings @settings.json
```

### [Source app settings](https://learn.microsoft.com/en-us/azure/app-service/app-service-key-vault-references?tabs=azure-cli#source-app-settings-from-key-vault)

Key vault: Prerequisites: Grant your app access to a key vault to a managed identity

- `@Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/mysecret/)`
- `@Microsoft.KeyVault(VaultName=myvault;SecretName=mysecret)`

App Configuration: `@Microsoft.AppConfiguration(Endpoint=https://myAppConfigStore.azconfig.io; Key=myAppConfigKey; Label=myKeysLabel)`

### Connection strings

Connection strings are prefixed with connection type. Similar to how they're set in the `Web.config` under `<connectionStrings>`.

```cs
// az webapp config connection-string set --connection-string-type SQLServer --settings MyDb="Server=myserver;Database=mydb;User Id=myuser;Password=mypassword;" ...
string myConnectionString = Configuration.GetConnectionString("MyDb");
string myConnectionStringVerbose = Configuration.GetConnectionString("SQLCONNSTR_MyDb"); // Same as above
string myConnectionStringEnv = Environment.GetEnvironmentVariable("SQLCONNSTR_MyDb"); // Same as above
```

```jsonc
// Save: az webapp config connection-string list --name $appName --resource-group $resourceGroup > conn-settings.json

// conn-settings.json
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

// Load: az webapp config connection-string set --resource-group $resourceGroup --name $appName --settings @conn-settings.json
```

### General Settings

```sh
az webapp config set --name $appName --resource-group $resourceGroup \
    --use-32bit-worker-process [true|false] \
    --web-sockets-enabled [true|false] \
    --always-on [true|false] \
    --http20-enabled \
    --auto-heal-enabled [true|false] \
    --remote-debugging-enabled [true|false] \ # turn itself off after 48 hours
    --number-of-workers

az webapp config appsettings set --name $appName --resource-group $resourceGroup /
    --settings \
        WEBSITES_PORT=8000
        PRE_BUILD_COMMAND="echo foo, scripts/prebuild.sh" \
        POST_BUILD_COMMAND="echo foo, scripts/postbuild.sh" \
        PROJECT="<project-name>/<project-name>.csproj" \ # Deploy multi-project solutions
        ASPNETCORE_ENVIRONMENT="Development"
        # Custom environment variables
        DB_HOST="myownserver.mysql.database.azure.com"
        # Verify at: https://<app-name>.scm.azurewebsites.net/Env
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

// az resource update --set properties.virtualApplications=@json.txt --resource-type Microsoft.Web/sites/config --resource-group $resourceGroup --name $appName
```

This works for both Windows and Linux apps.

### [Local Cache](https://learn.microsoft.com/en-us/azure/app-service/overview-local-cache)

Not supported for function apps or containerized App Service apps. To enable: `WEBSITE_LOCAL_CACHE_OPTION = Always`

## [Persistence](https://learn.microsoft.com/en-us/azure/app-service/configure-custom-container?tabs=debian&pivots=container-linux#use-persistent-shared-storage)

When persistent storage is _on_ (⏺️ for Linux containers), the `/home` directory allows file persistence and sharing. All writes to `/home` are accessible by all instances, but existing files overwrite /home's contents on start.

`/home/LogFiles` always persists if logging is enabled, regardless of persistent storage status.

Disable default persistent storage on Linux containers: `az webapp config appsettings set --settings WEBSITES_ENABLE_APP_SERVICE_STORAGE=false ...`

### [Mount Azure Storage as a local share in App Service](https://learn.microsoft.com/en-us/azure/app-service/configure-connect-to-azure-storage)

- Supports Azure Files (read/write) and Azure Blobs (read-only for Linux).
- App backups don't include storage mounts.
- Custom containers offer lower latency for heavy read-only file access compared to built-in Linux images that use Azure Storage.
- Storage mount changes will restart the app.
- Deleting Azure Storage requires corresponding mount configuration removal.
- Storage failover requires app restart or remounting of Azure Storage.
- Don't use mounts for local databases or apps needing file locks.

Mount: `az webapp config storage-account add --custom-id <custom-id> --storage-type AzureFiles --share-name <share-name> --account-name <storage-account-name> --access-key "<access-key>" --mount-path <mount-path-directory> ...`  
Check: `az webapp config storage-account list ...`

### Limitations

- Don't map to `/`, `/home`, or `/tmp` to avoid issues.
- Storage firewall support via service and private endpoints only.
- No FTP/FTPS for custom-mounted storage.
- Azure Storage billed separately from App Service.

### Best Practices

- Place app and storage in the same Azure region.
- Avoid regenerating access key.

## Deploying apps (gist)

1. Create resource group: `az group create`
1. Create App Service plan: `az appservice plan create --location $location`
1. Create web app: `az webapp create --runtime "DOTNET|6.0"`
1. (optinal) Use managed identity for ACR:
   - Assign managed identity to the web app
   - Assign `AcrPull` role: `az role assignment create --assignee $principalId --scope $registry_resource_id --role "AcrPull"`
   - Set generic config to `{acrUseManagedIdentityCreds:true}` for system identity and `{acrUserManagedIdentityID:id}` for user identity: `az webapp config set --generic-configurations '<json>'`
1. (optional) Create deployment slot (staging) (Standard+): `az webapp deployment slot create`
1. Deploy app (add `--slot staging` to use deployment slot):
   - Git: `az webapp deployment source config --repo-url $gitrepo --branch master --manual-integration`
   - Docker: `az webapp config container set --docker-custom-image-name`
   - Compose (skip step 3): `az webapp create --multicontainer-config-type compose --multicontainer-config-file $dockerComposeFile`
   - Local ZIP file: `az webapp deploy --src-path "path/to/zip"`
   - Remote ZIP file: `az webapp deploy --src-url "<url>"`
1. (optional) Set some settings: `az webapp config appsettings set --settings` (ex: `DEPLOYMENT_BRANCH='main'` for git, `SCM_DO_BUILD_DURING_DEPLOYMENT=true` for build automation)
1. (optional) Swap slots: `az webapp deployment slot swap --slot staging`

### ARM Templates

In JSON format.

`az group export --name $resourceGroup` - create ARM template

`az group deployment export --name $resourceGroup --deployment-name $deployment` - create ARM template for specific deploy

`az deployment group create --resource-group $resourceGroup --template-file $armTemplateJsonFile` - create deployment group from ARM template

## Security

### [Authentication](https://learn.microsoft.com/en-us/azure/app-service/overview-authentication-authorization)

Enabling this feature will automatically redirect all requests to HTTPS. You can either restrict access to authenticated users or allow anonymous requests. Built-in token store for managing tokens.

On Windows, middleware shares your app's IIS sandbox, but on Linux or in containers, it runs separately.

#### [Service Identity](https://learn.microsoft.com/en-us/azure/app-service/overview-managed-identity)

Main topic: [Managed Identities](./Managed%20Identities.md)

Each deployment slot / app has it's own managed identity configuration.

##### REST endpoint reference

An app with a managed identity defines two environment variables to make an endpoint available. This endpoint can be used to request tokens for accessing other Azure services

- `IDENTITY_ENDPOINT` endpoint from which apps can request tokens.
- `IDENTITY_HEADER` - (uuid) used to help mitigate server-side request forgery (SSRF) attacks.

Endpoint parameters:

- Required: `resource`, `api-version`, `X-IDENTITY-HEADER` (header)
- Optional: `client_id`, `principal_id`, `mi_res_id`

For user-assigned identities, include one of the optional properties; without it, a system-assigned identity token is requested.

Example:

```http
GET {IDENTITY_ENDPOINT}?resource=https://vault.azure.net&api-version=2019-08-01&client_id=XXX
X-IDENTITY-HEADER: {IDENTITY_HEADER}
```

##### Authentication flows

OAuth enables apps to access resources via user permissions, bypassing the need for credentials. Azure App Service manages this through its authentication module, which handles sessions and tokens. It can authenticate requests and redirect unauthenticated users (login page or 401). Tokens are stored in a token store when enabled. Note: An Access Rule is required.

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
    [JsonPropertyName("typ")] public string Type { get; set; }
    [JsonPropertyName("val")] public string Value { get; set; }
}

private class ClientPrincipal
{
    [JsonPropertyName("auth_typ")] public string IdentityProvider { get; set; }
    [JsonPropertyName("name_typ")] public string NameClaimType { get; set; }
    [JsonPropertyName("role_typ")] public string RoleClaimType { get; set; }
    [JsonPropertyName("claims")] public IEnumerable<ClientPrincipalClaim> Claims { get; set; }
}

public static ClaimsPrincipal Parse(HttpRequest req)
{
    var principal = new ClientPrincipal();

    if (req.Headers.TryGetValue("x-ms-client-principal", out var header))
    {
        var json = Encoding.UTF8.GetString(Convert.FromBase64String(header[0]));
        principal = JsonSerializer.Deserialize<ClientPrincipal>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
    }

    // Code can now iterate through `principal.Claims` for validation
    // or converts it to a `ClaimsPrincipal` for later use in the request pipeline.

    var identity = new ClaimsIdentity(principal.IdentityProvider, principal.NameClaimType, principal.RoleClaimType);
    identity.AddClaims(principal.Claims.Select(c => new Claim(c.Type, c.Value)));

    return new ClaimsPrincipal(identity);
}
```

### [Certificates](https://learn.microsoft.com/en-us/azure/app-service/configure-ssl-certificate?tabs=apex)

A certificate is accessible to all apps in the same resource group and region combination.

- **Free Managed Certificate**: Auto renewed every 6 months, no wildcard certificates or private DNS, can't be exported (**cannot be used in other apps**), not supported in ASE.
- **App Service Certificate**: A private certificate that is managed by Azure. Automated certificate management, renewal and export options.
- **Using Key Vault**: Store private certificates (same requerenments) in Key Vault. Automatic renewal, except for non-integrated certificates (`az keyvault certificate create ...`, default policy: `az keyvault certificate get-default-policy`)
- **Uploading a Private Certificate**: Requires a password-protected PFX file encrypted with triple DES, with 2048-bit private key and all intermediate/root certificates in the chain.
- **Uploading a Public Certificate**: For accessing remote resources.

[Make certificate accessible](https://learn.microsoft.com/en-us/azure/app-service/configure-ssl-certificate-in-code): `az webapp config appsettings set --settings WEBSITE_LOAD_CERTIFICATES=<comma-separated-certificate-thumbprints>`, then use `X509Store.Certificates.Find(X509FindType.FindByThumbprint, "certificate-thumbprint", true)` to load it.

#### [TLS mutual authentication](https://learn.microsoft.com/en-us/azure/app-service/app-service-web-configure-tls-mutual-auth?tabs=azurecli)

Requires Basic+ plan; set from `Configuration > General Settings`.

TLS termination is handled by frontend load balancer. When enabling client certificates (`az webapp update --set clientCertEnabled=true ...`), `X-ARR-ClientCert` header is added. Accessing client certificate: `HttpRequest.ClientCertificate`:

For NodeJs, client certificate is accessed through request header: `req.get('X-ARR-ClientCert');`

```cs
// Forward the client certificate from the frontend load balancer
services.AddCertificateForwarding(options => { options.CertificateHeader = "X-ARR-ClientCert"; });

// Adds certificate-based authentication to the application.
services.AddAuthentication(CertificateAuthenticationDefaults.AuthenticationScheme).AddCertificate();
```

### [CORS](https://learn.microsoft.com/en-us/azure/app-service/app-service-web-tutorial-rest-api)

For apps: `az webapp cors add --allowed-origins $website ...`

For storage: `az storage cors add --services blob --methods GET POST --origins $website --allowed-headers '*' --exposed-headers '*' --max-age 200 ...`

_To enable the sending of credentials like cookies or authentication tokens in your app_, the browser may require the `ACCESS-CONTROL-ALLOW-CREDENTIALS` header in the response: `az resource update --set properties.cors.supportCredentials=true --namespace Microsoft.Web --resource-type config --parent sites/$appName ...`

## Networking

- **Deployment Types**

  - Multi-tenant setup where your application shares resources with other applications.
  - Single-tenant setup, called App Service Environment (ASE), where your application gets its own dedicated resources within your Azure virtual network.

- [**Networking Features**](https://learn.microsoft.com/en-us/azure/app-service/networking-features): Manage both incoming (inbound) and outgoing (outbound) network traffic.

  | Feature                                      | Type     | Use Cases                                                                                 |
  | -------------------------------------------- | -------- | ----------------------------------------------------------------------------------------- |
  | App-assigned address                         | Inbound  | Support IP-based SSL for your app; Support a dedicated inbound address for your app       |
  | Access restrictions                          | Inbound  | Restrict access to your app from a set of well-defined IP addresses                       |
  | Service endpoints/Private endpoints          | Inbound  | Restrict access to your Azure Service Resources to only your virtual network              |
  | Hybrid Connections                           | Outbound | Access an on-premises system or service securely (from Azure to On-Premises)              |
  | Gateway-required virtual network integration | Outbound | Access Azure or on-premises resources via ExpressRoute or VPN (two way Azure-On-Premises) |
  | Virtual network integration                  | Outbound | Access Azure network resources                                                            |

  Hybrid Connections: from Azure to On-Premises; Gateway: two way Azure-On-Premises.

**Ingress** - manages external access to the services running in a container. It allows you to define how external traffic should be routed to the services within your containerized application. Set "external" to allow public traffic. Ingress configurations typically specify rules for directing HTTP and HTTPS traffic to specific services based on factors like the request path or host header.

- **Default Networking Behavior**: Free and Shared plans use multi-tenant workers, meaning your application shares resources with others. Plans from Basic and above use dedicated workers, meaning your application gets its own resources. If you have a Standard App Service plan, all the apps in that plan run on the same worker.

- **Outbound Addresses**: When your application needs to make a call to an external service, it uses an outbound IP address. This address is shared among all applications running on the same type of worker VM.

  - To find the current outbound IP addresses: `az webapp show --query outboundIpAddresses ...`
  - To find all possible outbound IP addresses: `az webapp show --query possibleOutboundIpAddresses ...`

## [Diagnostics](https://learn.microsoft.com/en-us/azure/app-service/troubleshoot-diagnostic-logs)

| Type                    | Platform       | Location                                           | Notes                                                                                                                              |
| ----------------------- | -------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Application logging     | Windows, Linux | App Service file system and/or Azure Storage blobs | Useful for debugging issues (bugs or unexpected behavior) within application code.                                                 |
| Web server logging      | Windows        | App Service file system or Azure Storage blobs     | Raw HTTP request data. Useful for diagnosing issues related to connectivity, HTTP errors (`404`), and server-level issues (`5xx`). |
| Detailed Error Messages | Windows        | App Service file system                            | Copies of the .htm error pages that would have been sent to the client browser.                                                    |
| Failed request tracing  | Windows        | App Service file system                            |                                                                                                                                    |
| Deployment logging      | Windows, Linux | App Service file system                            | Logs for when you publish content to an app.                                                                                       |

The _App Service file system_ option is for temporary debugging purposes, and turns itself off in 12 hours.  
_The Blob_ option is for long-term logging, includes additional information. .Net apps only.

`az webapp log config --application-logging {azureblobstorage, filesystem, off} --name MyWebapp --resource-group $resourceGroup`

Accessing log files:

- Linux/custom containers: `https://$appName.scm.azurewebsites.net/api/logs/docker/zip`. The ZIP file contains console output logs for both the docker host and the docker container.
- Windows apps: `https://$appName.scm.azurewebsites.net/api/dump`

`AppServiceFileAuditLogs` and `AppServiceAntivirusScanAuditLogs` log types are available only for Premium+.

`AllMetrics` settings are collected by agents on to the App Service and report the usage of host resources. These are items like CPU usage, memory usage, and disk I/O used.

### Stream logs

To stream logs in the Azure portal, navigate to your app and select **Log stream**.

Logs written to .txt, .log, or .htm files in `/home/LogFiles` (or `D:\home\LogFiles` for Windows apps) . Note, some logs may appear out of order due to buffering.

CLI: `az webapp log tail ...`

```sh
# Stream HTTP logs
az webapp log tail --provider http --name $app --resource-group $resourceGroup

# Stream errors
az webapp log tail --filter Error --name $app --resource-group $resourceGroup # filter by word Error
az webapp log tail --only-show-errors --name $app --resource-group $resourceGroup
```

### [Monitoring apps](https://learn.microsoft.com/en-us/azure/app-service/web-sites-monitor)

Metrics: CPU Percentage, Memory Percentage, Data In, Data Out - used across all instances of the plan (**not a single app!**).

Example: `Metric: CPU Percentage; Resource: <AppServicePlanName>`

```sh
az monitor metrics list --resource $app_service_plan_resource_id --metric "Percentage CPU" --time-grain PT1M --output table
```

CPU Time is valuable for apps on Free or Shared plans, where quotas are set by app's CPU minutes usage.  
The CPU percentage is valuable for apps on Basic+, providing insights into usage across scalable instances.

### [Health Checks](https://learn.microsoft.com/en-us/azure/app-service/monitor-instances-health-check?tabs=dotnet)

Health Check pings the specified path every minute. If an instance fails to respond with a valid status code after 10 requests, it's marked unhealthy and removed from the load balancer. If it recovers, it's returned to the load balancer. If it stays unhealthy for an hour, it's replaced (only for Basic+).

For private endpoints check if `x-ms-auth-internal-token` request header equals the hashed value of `WEBSITE_AUTH_ENCRYPTION_KEY` environment variable. You should first use features such as IP restrictions, client certificates, or a Virtual Network to restrict application access.

Configure path: `az webapp config set --health-check-path <Path> --resource-group $resourceGroup --name $webApp`

### [Application Insights Profiler](https://learn.microsoft.com/en-us/azure/azure-monitor/profiler/profiler)

Requires the **Always on** setting is _enabled_.

## Deploying apps (full)

```sh
let "randomIdentifier=$RANDOM*$RANDOM"
location="East US"
resourceGroup="app-service-rg-$randomIdentifier"
tag="deploy-github.sh"
appServicePlan="app-service-plan-$randomIdentifier"
webapp="web-app-$randomIdentifier"
gitrepo="https://github.com/Azure-Samples/dotnet-core-sample"

az group create --name $resourceGroup --location "$location" --tag $tag

az appservice plan create --name $appServicePlan --resource-group $resourceGroup --location $location # --sku B1
# az appservice plan create --name $appServicePlan --resource-group $resourceGroup --sku S1 --is-linux

az webapp create --name $webapp --plan $appServicePlan --runtime "DOTNET|6.0" --resource-group $resourceGroup

# https://learn.microsoft.com/en-us/azure/app-service/scripts/cli-deploy-github
github_deployment() {
    echo "Deploying from GitHub"
    az webapp deployment source config --name $webapp --repo-url $gitrepo --branch master --manual-integration --resource-group $resourceGroup

    # Change deploiment branch to "main"
    # az webapp config appsettings set --name $webapp --settings DEPLOYMENT_BRANCH='main' --resource-group $resourceGroup
}

# https://learn.microsoft.com/en-us/azure/app-service/scripts/cli-deploy-staging-environment
# Use it to avoid locking files
staging_deployment() {
    # Deployment slots require Standard tier, default is Basic (B1)
    az appservice plan update --name $appServicePlan --sku S1 --resource-group $resourceGroup

    echo "Creating a deployment slot"
    az webapp deployment slot create --name $webapp --slot staging --resource-group $resourceGroup

    echo "Deploying to Staging Slot"
    az webapp deployment source config --name $webapp --resource-group $resourceGroup \
      --slot staging \
      --repo-url $gitrepo \
      --branch master --manual-integration \


    echo "Swapping staging slot into production"
    az webapp deployment slot swap --slot staging --name $webapp --resource-group $resourceGroup
}

# https://learn.microsoft.com/en-us/azure/app-service/configure-custom-container?tabs=debian&pivots=container-linux#change-the-docker-image-of-a-custom-container
docker_deployment() {
    # (Optional) Use managed identity: https://learn.microsoft.com/en-us/azure/app-service/configure-custom-container?tabs=debian&pivots=container-linux#change-the-docker-image-of-a-custom-container
    ## Enable the system-assigned managed identity for the web app
    az webapp identity assign --name $webapp --resource-group $resourceGroup
    ## Grant the managed identity permission to access the container registry
    az role assignment create --assignee $principalId --scope $registry_resource_id --role "AcrPull"
    ## Configure your app to use the system managed identity to pull from Azure Container Registry
    az webapp config set --generic-configurations '{"acrUseManagedIdentityCreds": true}' --name $webapp --resource-group $resourceGroup
    ## (OR) Set the user-assigned managed identity ID for your app
    az webapp config set --generic-configurations '{"acrUserManagedIdentityID": "$principalId"}' --name $webapp --resource-group $resourceGroup

    echo "Deploying from DockerHub" # Custom container
    az webapp config container set --name $webapp --resource-group $resourceGroup \
      --docker-custom-image-name <docker-hub-repo>/<image> \
      # Private registry: https://learn.microsoft.com/en-us/azure/app-service/configure-custom-container?tabs=debian&pivots=container-linux#use-an-image-from-a-private-registry
      --docker-registry-server-url <private-repo-url> \
      --docker-registry-server-user <username> \
      --docker-registry-server-password <password>

    # NOTE: Another version of it, using
    # az webapp create --deployment-container-image-name <registry-name>.azurecr.io/$image:$tag
    # https://learn.microsoft.com/en-us/azure/app-service/tutorial-custom-container
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
    az webapp config appsettings set \
      --settings WORDPRESS_DB_HOST="<mysql-server-name>.mysql.database.azure.com" WORDPRESS_DB_USER="adminuser" WORDPRESS_DB_PASSWORD="letmein" WORDPRESS_DB_NAME="wordpress" MYSQL_SSL_CA="BaltimoreCyberTrustroot.crt.pem" \
      --resource-group $resourceGroup \
      --name wordpressApp
}

# https://learn.microsoft.com/en-us/azure/app-service/deploy-zip?tabs=cli
# uses the same Kudu service that powers continuous integration-based deployments
zip_archive() {
  az webapp deploy --src-path "path/to/zip" --name $webapp --resource-group $resourceGroup
  # Zip from url
  # az webapp deploy --src-url "https://storagesample.blob.core.windows.net/sample-container/myapp.zip?sv=2021-10-01&sb&sig=slk22f3UrS823n4kSh8Skjpa7Naj4CG3" --name $webapp --resource-group $resourceGroup

  # (Optional) Enable build automation
  # az webapp config appsettings set --settings SCM_DO_BUILD_DURING_DEPLOYMENT=true --name $webapp --resource-group $resourceGroup
}
```

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
| [az webapp log config](https://learn.microsoft.com/en-us/cli/azure/webapp/log?view=azure-cli-latest#az-webapp-log-config)                | Configure logging for a web app.                          | `az webapp log config --name MyWebApp --resource-group MyResourceGroup --web-server-logging filesystem`                              |
| [az resource update](https://learn.microsoft.com/en-us/cli/azure/resource?view=azure-cli-latest#az-resource-update)                      | Update a resource.                                        | `az resource update --ids RESOURCE_ID --set properties.key=value`                                                                    |
| [az webapp config storage-account](https://learn.microsoft.com/en-us/cli/azure/webapp/config/storage-account?view=azure-cli-latest)      | Manage web app's Azure Storage account configurations.    | `az webapp config storage-account update --name MyApp --custom-id CustomId --storage-type AzureBlob --account-name MyStorageAccount` |
| [az webapp list-runtimes](https://learn.microsoft.com/en-us/cli/azure/webapp?view=azure-cli-latest#az-webapp-list-runtimes)              | List available runtime stacks.                            | `az webapp list-runtimes --linux`                                                                                                    |
| [az monitor metrics](https://learn.microsoft.com/en-us/cli/azure/monitor/metrics?view=azure-cli-latest)                                  | Manage metrics.                                           | `az monitor metrics list --resource RESOURCE_ID --metric-names "Percentage CPU"`                                                     |
