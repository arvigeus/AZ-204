# App Service

md: How App Service Plans are charged?

- Shared and Free
- Dedicated
- Isolated

<!-- Shared: CPU quota; Dedicated: per VM instance; Isolated: number of isolated workers -->

---

md: Describe fornt ends and workers in App Service? What is their networking behavior in different App Service Plans?

<!-- Front ends: Handle incoming HTTP(S) requests; Workers: host customer workload. Free and Shared: multi-tenant (shared) workers. Basic+ use dedicated workers. Standard runs on the same worker. -->

---

md: Which App Service Plan provides maximum scale out capabilities?

<!-- Isolated -->

---

md: What you must know when it comes to App Service Plan charging?

<!-- Having 0 apps will still incur charges -->

---

md: Deployment slots, diagnostic logs, perforing backups, apps in the same App Service plan: how they behave together?

<!-- Run on the same VM instances -->

---

md: When to isolate an app into a new App Service Plan?

<!-- Resource intensive apps, scaling app independently, need different geographical region -->

---

md: How to move an App Service Plan? What are the prerequisites and requirenments?

<!-- Source plan and destination plan must be in the same resource group, geographical region, same OS type, and supports the currently used features. -->

---

md: Describe different scaling methods. What plans do they require? How they behave? When to choose one over the other?

- Manual
- Autoscale
- Automatic scale

<!-- Manual: Basic+. Predictable one-off events; Autoscale: Standard+. Predictable periodic events or based on resource; Automatic scaling: PremiumV2+. Like Autoscale, but with pre-warmed instances. Use to avoid cold boots. -->

---

md: What are the differences between horizontal and vertical scaling?

<!-- Horizontal: scale out/in - adding VM instances; Vertical: scale up/down - changing plan -->

---

md: How to setup a scaling rule?

<!-- Switch to appropriate scaling plan; Activate autoscaling from web app; Create scaling rule; Set scaling condition -->

---

md: What is "flapping"?

<!-- a loop condition where a scale event triggers its opposite in a series of alternating events. -->

---

md: If you want to use `--is-linux`, what requirenments and limitations there are?

<!-- Standard+ plan; persistent storage is on by default, mounted blob storage is read-only, auth middleware runs separately, only app and deployment logging -->

---

md: What are staging environments and what are the prerequisites to use them?

<!-- Deployment slots. Standard+ plan -->

---

md: Which settings get swapped in deployment slots and which don't? Examples?

<!-- Swapped: define the application's behavior; Not Swapped: define the application's environment and security -->

---

md: How to enable settings swapping in deployment slots?

<!-- WEBSITE_OVERRIDE_PRESERVE_DEFAULT_STICKY_SLOT_SETTINGS=false -->

---

md: What are best practices when using deployment slots? What are prerequisites?

<!-- Standard+ plan. Deploy to staging, then swap slots to warm up instances and eliminate downtime. -->

---

md: How to define custom deployment?

<!-- .deployment file; command and (optional) project settings -->

---

md: How to route traffic to different deployment slots manually? What happens when routing is automatic?

<!-- `x-ms-routing-name=`: `self` for production slot, `staging` for staging slot; Automatically all traffic is set to production -->

---

md: How App Settings works?

<!-- Overrides appsettings.json; Triggers a restart on change -->

---

md: What is "Always On"? When is needed? What are prerequisites to enable it?

<!-- Prevents app from sleeping after 20 mins of inactivity. Needed for Application Insights Profiler and avoiding cold boots; Basic+ -->

---

md: What are Hybrid Connections?

<!-- Lets your Azure App talk to your local server securely without changing firewall settings. Swappable -->

---

md: How to use hierarchical settings in AZ CLI?

<!-- az webapp config appsettings set --settings Metting__Subsetting="<value> -->

---

cs: How to access hierarchical setting in C#?

<!-- Configuration["MyParentSetting/MySubSetting"]; // or __ or : -->

---

sh: How to export App Settings using AZ CLI?

<!-- az webapp config appsettings list > settings.json -->

---

sh: How to load App Settings using AZ CLI?

<!-- az webapp config appsettings set --settings @settings.json -->

---

json: What is the format of App Settings stored in json file?

<!-- [{name, value, slotSetting?}] -->

---

md: What differentiates Connection String from other App Settings and what is in common?

<!-- It needs Type argument. Also causes restart. Also can be accessed from Configuration and env vars. Both use az webapp config, but with appsettings and connection-string -->

---

sh: How to set connection string using AZ CLI?

<!-- az webapp config connection-string set --connection-string-type SQLServer --settings MyDb="Server=myserver;Database=mydb;User Id=myuser;Password=mypassword;" -->

---

cs: How to access connection string in C#?

<!-- Configuration.GetConnectionString("MyDb") or Environment.GetEnvironmentVariable("SQLCONNSTR_MyDb") -->

---

sh: How to exportConnection Strings using AZ CLI?

<!-- az webapp config  connection-string list > settings.json -->

---

sh: How to loadConnection Strings using AZ CLI?

<!-- az webapp config  connection-string set --settings @settings.json -->

---

json: What is the format of Connection Strings stored in json file?

<!-- [{name, value, type, slotSetting?}] -->

---

md: How would you configure things like port, pre/post build command, environment?

<!-- Env vars -->

---

md: What you need to know if you want to use remote debugging?

<!-- It gets disabled after 48 hours -->

---

md: What are handler mappings? What properties they have?

<!-- Add custom script processors to handle requests for specific file extensions. (File) Extension (wildcard or full name), Script Preprocesor, Arguments -->

---

json: How would you change files to be served from root dir to `public` dir inside root dir?

<!-- { "physicalPath"':' "site\\wwwroot\\public" } -->

---

md: What you need to know if you want to use persistent storage? For Windows and Linux?

<!-- Billed separately. Linux: Standard+ plan, it's on by default, maps to /home, /home/LogFiles is not affected by this setting, it's afected by logging being enabled, Blobs are read-only, higher latency for Storage -->

---

md: What you need to know if you want to use Azure Storage? What should you avoid?

<!-- Azure Files (RW) and Blobs (R for Linux) are supported. Not included in backups. For Linux there is higher latency compared to custom images; Don't mount to /home directly. Billed separately. Don't use for local databases or locked files -->

---

md: What happens if you modify your Azure Storage?

<!-- Triggers restart. Deleting Storage requires config to be modified as well -->

---

md: Best practices for using Azure Storage?

<!-- Use same region, avoid regenerating access key -->

---

md: What are the general steps when deploying an app from scratch using App Service?

<!-- Create resource group; Create appservice plan; Create webapp; (opt) Use managed identity with AcrPull permissions by setting it into generic config with acrUseManagedIdentityCreds (system) or acrUserManagedIdentityID (user); (opt) Create deployment slot; Deploy; (opt) Swap slots -->

---

sh: How to create ARM template, ARM template for specific deploy, deployment group?

<!-- az group export --name $resourceGroup; az group deployment export --name $resourceGroup --deployment-name $deployment; az deployment group create --resource-group $resourceGroup --template-file $armTemplateJsonFile -->

---

md: What happens if you enable authentication module? What options it gives you? How it runs in Linux and Windows?

<!-- Automatic HTTPS; allows auth and ann users; Windows: IIS in app, Linux: separately -->

---

md: How managed identities are handled in deployment slots?

<!-- Cannot be swapped, each app has it's own config -->

---

md: How to request tokens for accessing other Azure services?

<!-- Define IDENTITY_ENDPOINT and IDENTITY_HEADER env vars; GET {IDENTITY_ENDPOINT}?resource=<resource-url> with client_id param if using user assigned identity, using X-IDENTITY-HEADER header -->

---

md: Describe Server-directed authentication flow?

<!-- Sign in by redirecting to /.auth/login/aad; Redirect to callback /.auth/login/aad/callback; Establish authenticated session by adding auth cookie; Client includes authentication cookie in subsequent requests -->

---

md: Describe Server-directed authentication flow?

<!-- Sign in using SDK and receives an authentication token; Client code posts token from provider to /.auth/login/aad for validation; App Service returns its own authentication token to client code; Client code presents authentication token in X-ZUMO-AUTH header -->

---

md: How to parse request principal and its claim from C#?

<!-- Parse base-64 header "x-ms-client-principal"; Deserialize; Construct ClaimsPrincipal by using ClaimsIdentity  -->

---

md: Using certificates with Application Service: general specifics and when to use (or not) each:

- Free Managed Certificate
- App Service Certificate
- Using Key Vault

<!-- Accessible to all apps in the same resource group and region; Free Managed: Basic+, does not support wildcart ASE, and exporting; AppService: can be exported; KeyVault: can be used for private (no automated reneval) or managed cert -->

---

md: When to use public certificate?

<!-- Accessing remote resources -->

---

md: What are the requirenments to have TLS mutial authentications?

<!-- Basic+ plan. Enable client certificates; X-ARR-ClientCert header is added. AddCertificateForwarding AddAuthentication must be used to use cert for auth. To access cert: C#: HttpRequest.ClientCertificate, NodeJs: req.get('X-ARR-ClientCert') -->

---

cs: How to configure C# app to use certificates for authentication

<!-- services.AddCertificateForwarding(options => { options.CertificateHeader = "X-ARR-ClientCert"; }); services.AddAuthentication(CertificateAuthenticationDefaults.AuthenticationScheme).AddCertificate(); -->

---

sh: How to Allow Cross-Domain Requests in Azure App Service?

<!-- az webapp cors add --allowed-origins $website; az storage cors add --services blob --methods GET POST --origins $website --allowed-headers '*' -->

---

sh: How to enable the sending of credentials like cookies or authentication tokens in your app?

<!-- Adding ACCESS-CONTROL-ALLOW-CREDENTIALS header: az resource update --set properties.cors.supportCredentials=true --namespace Microsoft.Web --resource-type config --parent sites/$appName -->

---

md: When to use Hybrid Connections and when to use Gateway-required virtual network integration?

<!-- Hybrid Connections: from Azure to On-Premises; Gateway: two way Azure-On-Premises -->

---

md: What are Outbound Addresses?

<!-- IP address used by the worker to make a call to an external service. This address is shared among all applications -->

---

md: Describe the following types of logging:

- Application logging
- Web server logging
- Detailed Error Messages
- Deployment logging

Which support Linux? Which support Storage Blobs?

<!-- App: app itself; Web: 4xx, 5xx errors; Detailed: html error page; Deployment: on publishing content. Blobs are supported on .Net apps only, so App and Web loging. Linux on App and Deployment -->

---

md: When would you choose App Service file system option and when Blob option? What limitations they have?

<!-- file system option: temporary debugging, auto off in 12 hours; Blob: long-term logging, .Net apps only -->

---

sh: How to set App Service / Blog option for application logging?

<!-- az webapp log config --application-logging {azureblobstorage, filesystem, off} -->

---

md: How to access log files?

<!-- Linux: (docker) https://$appName.scm.azurewebsites.net/api/logs/docker/zip; Windows: (dump) https://$appName.scm.azurewebsites.net/api/dump-->

---

md: What kind of logs are reserved for Premium+ only?

<!-- Audits -->

---

md: What is `AllMetrics` logs?

<!-- CPU usage, memory usage, and disk I/O used -->

---

md: Where are stream logs saved?

<!-- Linux: /home/LogFiles; Windows: D:\home\LogFiles -->

---

sh: How to access stream logs for HTTP AZ CLI?

<!-- az webapp log tail --provider http -->

---

sh: How to access stream logs for errors via AZ CLI?

<!-- az webapp log tail --filter Error -->

---

md: What's the difference between `az webapp log tail --filter Error` and `az webapp log tail --only-show-errors`

<!-- --filter Error filters logs containing this word, --only-show-errors is for all error level logs -->

---

sh: What AZ CLI command to use to measure CPU % and RAM for a single app?

<!-- Cannot. Metrics are across all instances -->

---

sh: What AZ CLI command to use to measure CPU % across all instances?

<!-- az monitor metrics list --resource $app_service_plan_resource_id --metric "Percentage CPU" --time-grain PT1M -->

---

md: When you can measure CPU % and when - CPU time?

<!-- %: Basic+; Time: Free & Shared -->

---

md: Describe Health Check behavior of App Service?

<!-- ping path every min; 10 failed req remove the instance from load balancer (returned later if recovers); Basic+: instance is replaced after 1 hour unhealthy -->

---

md: How Health check is performed on private endpoints in App Service? How to harden protection?

<!-- check `x-ms-auth-internal-token` request header equals the hashed value of `WEBSITE_AUTH_ENCRYPTION_KEY` environment variable; restrict by IP, certificate, or VNet -->

---

sh: How to set Health Check path via AZ CLI?

<!-- az webapp config set --health-check-path <Path> -->

---

sh: How to create App Service Plan and prerequisites via AZ CLI (and what is default)?

<!-- az group create; az appservice plan create -->

---

sh: How to create App Service Plan via AZ CLI for Linux?

<!-- az appservice plan create --sku S1 --is-linux -->

---

sh: How to create deployment slot in App Service and its prerequisites via AZ CLI?

<!-- az group create; az appservice plan create --sku S1; az webapp create --name $webapp --plan $appServicePlan; az webapp deployment slot create --name $webapp --slot staging; az webapp --slot staging -->

---

sh: How to swap staging and deployment slot?

<!-- az webapp deployment slot swap --slot staging -->

---

sh: How to create .Net web app using AZ CLI?

<!-- az webapp create --name $webapp --plan $appServicePlan --runtime "DOTNET|6.0" -->

---

sh: How to enable web app to use image from ACR using user managed identity in AZ CLI?

<!-- create identity; role assign AcrPull; az webapp config set --generic-configurations '{"acrUserManagedIdentityID": "$principalId"}' -->

---

sh: How to enable web app to use image from ACR using system managed identity in AZ CLI?

<!-- az webapp identity assign --query principalId --output tsv; az role assignment create --assignee $principalId --scope $registryResourceId --role "AcrPull"; az webapp config set --generic-configurations '{"acrUseManagedIdentityCreds": true}'
 -->

---

sh: How to deploy an image from ACR to App Service using AZ CLI?

<!-- az webapp create --resource-group $resourceGroup --plan $appServicePlan --name $webApp --deployment-container-image-name <registry-name>.azurecr.io/$image:$tag -->

---

sh: How to deploy docker-compose to App Service using AZ CLI?

<!-- az webapp create --resource-group $resourceGroup --plan $appServicePlan --name wordpressApp --multicontainer-config-type compose --multicontainer-config-file $dockerComposeFile -->

---

sh: How to deploy local ZIP archive to App Service using AZ CLI?

<!-- az webapp deploy --src-path "path/to/zip" --name $webapp --resource-group $resourceGroup -->

---

sh: How to deploy ZIP from url to App Service using AZ CLI?

<!-- az webapp deploy --src-url $url --name $webapp -->

---
