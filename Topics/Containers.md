# [Containers](https://learn.microsoft.com/en-us/azure/containers/)

## [Container Registry](https://learn.microsoft.com/en-us/azure/container-registry/)

Example: `docker pull <registry>/<repository>/<image-or-artifact>:<tag>`

- `<registry>`: name of the Docker registry (for Azure, it would be something like myregistry.azurecr.io).
- `<repository>`: name of the repository where your image is stored.
- `<image-or-artifact>`: name of the image or artifact you want to pull.
- `<tag>`: version tag of the image or artifact.

### [Tiers](https://learn.microsoft.com/en-us/azure/container-registry/container-registry-skus)

All tiers support the same basic features, the main difference is image storage / throughput.

- **Basic**
- **Standard** - For most production scenarios
- **Premium** - highest amount of included storage and concurrent operations, enabling high-volume scenarios (higher image throughput). Additional features: geo-replication, content trust for image tag signing, private link.

**Throttling**: May happen if you exceed the registry's limits, causing temporary `HTTP 429` errors and requiring retry logic or reducing the request rate.

Change tier: `az acr update --name myContainerRegistry --sku Premium`

### [Tasks](https://learn.microsoft.com/en-us/azure/container-registry/container-registry-tasks-overview)

Cloud-based container image building and automated OS/framework patching.

- **Quick Task**: On-demand build and push of a single container image. Use the `az acr build` command to build and push a container image to ACR. (Think `docker build`, `docker push` in the cloud)

- **Automatically Triggered Tasks**: Auto-builds triggered by source code updates, base image updates, or timers. Use the `az acr task create` command to configure a build task that triggers a container image build when code is committed or a pull request is made or updated in a Git repository.

- **Multi-step Task**: Granular control over image building, testing, and patching workflows. These tasks are defined in a YAML file and can automate a sequence of operations.

- **Automate OS/Framework Patching**: Auto-detection and build of application images based on updated base image.

- **Scheduled Tasks**: Run container workloads or maintenance operations on a defined schedule.

CR Tasks primarily builds Linux OS and amd64 architecture images. Use the `--platform` tag to specify other OS or architectures:

```sh
# Linux supports all architectures
az acr build --registry MyRegistry --image MyImage:tag --platform Linux/arm .
# Windows supports only AMD64
az acr build --registry MyRegistry --image MyImage:tag --platform Windows/amd64 .
```

### [Working with Azure Container Registry](https://learn.microsoft.com/en-us/azure/container-registry/container-registry-get-started-azure-cli)

Pushes and run a Docker image

```sh
# Create container registry
# az group create --name myResourceGroup --location eastus
az acr create --name mycontainerregistry --sku Basic --resource-group myResourceGroup

# Login to container registry
## Using Azure ID
az acr login --name "<registry-name>"


# Login using service principal
ACR_REGISTRY_ID=$(az acr show --name $ACR_NAME --query "id" --output tsv)
PASSWORD=$(az ad sp create-for-rbac --name $SERVICE_PRINCIPAL_NAME --scopes $ACR_REGISTRY_ID --role acrpull --query "password" --output tsv)
SERVICE_PRINCIPAL_ID=$(az ad sp list --display-name $SERVICE_PRINCIPAL_NAME --query "[].appId" --output tsv)
az role assignment create --assignee $SERVICE_PRINCIPAL_ID --scope $ACR_REGISTRY_ID --role acrpull # acrpush, or acrowner
docker login myregistry.azurecr.io --username $SP_APP_ID --password $SP_PASSWD


# Push image to registry
## Pull 'hello-world' image from Microsoft's Registry
docker pull mcr.microsoft.com/hello-world
## Tag the image (<login-server>/hello-world:v1)
docker tag mcr.microsoft.com/hello-world <login-server>/hello-world:v1
##. Push image
docker push <login-server>/hello-world:v1

# Run image from registry
docker run <login-server>/hello-world:v1

# List container images abd tags
az acr repository list --name <registry-name> --output table
az acr repository show-tags --name <registry-name> --repository hello-world --output table
```

Build and run a container image:

```sh
# Create a resource group
az group create --name myResourceGroup --location eastus

# Create Azure Container Registry
az acr create --resource-group myResourceGroup --name myAcr --sku Basic --admin-enabled true

# Log in to ACR
az acr login --name myAcr

# Build Docker image and push to ACR
az acr build --registry myAcr --image myimage:latest .

# Run the Docker image from ACR
# Last parameter is the source location for the task. It's not needed when not building an image, so '/dev/null' is used.
az acr run --registry myAcr --cmd '$Registry/myimage:latest' /dev/null
```

## [Container Instances](https://learn.microsoft.com/en-us/azure/container-instances/)

```sh
# Container from image
az container create --name mycontainer --image mycontainerimage --resource-group myResourceGroup

# Container from yaml file
az container create --file mycontainer.yaml --resource-group myResourceGroup

# Create an Azure Container Instance with a public DNS name (must be unique)
# Accessible from <dns-name-label>.<region>.azurecontainer.io
az container create --dns-name-label mydnslabel --ip-address public --name mycontainer --image myImage --resource-group myResourceGroup

# Verify container is running
az container show --resource-group az204-aci-rgb--name mycontainerbb --query "{FQDN:ipAddress.fqdn,ProvisioningState:provisioningState}" --out table
```

**Container Groups** - the top-level resource. It consists of multiple containers scheduled on a single host machine, sharing lifecycle, resources, network, and storage volumes (similar to Kubernetes pod). Multi-container groups support Linux containers. For Windows containers, Azure Container Instances allow only single-instance deployment.

**Restart policies**: `Always`, `Never`, `OnFailure`. When ACI stops a container with a restart policy of `Never` or `OnFailure`, its status is set to **Terminated**.  
Example: `az container create --restart-policy OnFailure ...`.

**Environment variables**: `az container create --environment-variables 'NumWords'='5' 'MinLength'='8' ...`

```yaml
# Define environment variables for the container
environmentVariables:
  # Public environment variable
  - name: "NOTSECRET"
    value: "my-exposed-value"

  # Secure environment variable, externally (Azure portal or Azure CLI) visible only by name
  - name: "SECRET"
    secureValue: "my-secret-value"
```

### Mount an Azure file share in Azure Container Instances

Azure Files shares can only be mounted to _Linux containers_ _running as root_, limited by the requirement of CIFS support.

Azure CLI:

```sh
az container create \
    --azure-file-volume-account-name $ACI_PERS_STORAGE_ACCOUNT_NAME \
    --azure-file-volume-account-key $STORAGE_KEY \
    --azure-file-volume-share-name $ACI_PERS_SHARE_NAME \
    --azure-file-volume-mount-path /aci/logs/ \
    # ...
```

YAML:

```yaml
volumes:
- name: filesharevolume
    azureFile:
    sharename: acishare
    storageAccountName: <Storage account name>
    storageAccountKey: <Storage account key>
properties:
  containers:
      properties:
        # ...
        volumeMounts:
          - mountPath: /aci/logs/
            name: filesharevolume
```

## [Azure Container Apps](https://learn.microsoft.com/en-us/azure/container-apps/)

Fully managed (no need to manage other Azure infrastructure) environment. Common use cases:

- Deploying API endpoints
- Hosting background processing applications
- Handling event-driven processing
- Running microservices

Cannot run privileged containers requiring _root_ access and strictly requires _Linux-based (linux/amd64)_ container images.

### [Auth](https://learn.microsoft.com/en-us/azure/container-apps/managed-identity?tabs=cli%2Cdotnet)

The platform's authentication and authorization middleware component runs as a _sidecar_ container on each application replica, screening all incoming HTTPS (_disable_ `allowInsecure` in ingress config) requests before they reach your application. [See more](./App%20Service%20Web%20Apps.md)

Add a system-assigned identity: `az containerapp identity assign --name myApp --resource-group myResourceGroup --system-assigned`

Add a user-assigned identity:

```sh
# az identity create --resource-group <GROUP_NAME> --name <IDENTITY_NAME> --output json
az containerapp identity assign --user-assigned <IDENTITY_RESOURCE_ID> --resource-group <GROUP_NAME> --name <APP_NAME>
```

### [Scaling](https://learn.microsoft.com/en-us/azure/container-apps/scale-app?pivots=azure-cli)

Scaling is driven by three different categories of triggers:

- HTTP: Based on the number of concurrent HTTP requests to your revision.
- TCP: Based on the number of concurrent TCP connections to your revision.
- Custom: Based on CPU, memory (_cannot scale to 0_), or supported event-driven data sources such as:
  - Azure Service Bus
  - Azure Event Hubs
  - Apache Kafka
  - Redis

As a container app revision scales out, new instances of the revision are created on-demand. These instances are known as replicas (default: 0-10). Adding or editing scaling rules creates a new revision of the container app.

Example:

```sh
az containerapp create \
 # ...
 --min-replicas 0 \
 --max-replicas 5 \

 #  HTTP Scaling Rule
 --scale-rule-name azure-http-rule \
 --scale-rule-type http \
 --scale-rule-http-concurrency 100

 # TCP Scaling Rule
 --scale-rule-name azure-tcp-rule \
 --scale-rule-type tcp \
 --scale-rule-tcp-concurrency 100

 # Custom Scaling rule
  --secrets "connection-string-secret=<SERVICE_BUS_CONNECTION_STRING>" \
 --scale-rule-name azure-servicebus-queue-rule \
 --scale-rule-type azure-servicebus \
 --scale-rule-metadata "queueName=my-queue" \
 "namespace=service-bus-namespace" \
 "messageCount=5" \
 --scale-rule-auth "connection=connection-string-secret"
```

Without a scale rule, the default (HTTP, 0-10) applies to your app. Create a rule or set minReplicas to 1+ if ingress is disabled. Without minReplicas or a custom rule, your app can scale to zero and won't restart.

### [Revisions](https://learn.microsoft.com/en-us/azure/container-apps/revisions)

Immutable snapshots of a container app version. The first revision is auto-created upon deployment. Any revision-scope change triggers a new revision. Up to 100 revisions can be stored for history. Multiple revisions can run at once, with HTTP traffic split among them.

State doesn't persist inside a container due to regular restarts. Use external caches for in-memory cache requirements.

In single revision mode, Container Apps prevents downtime during updates, keeping the old revision active until the new one is ready.  
In multiple revision mode, you control revision activation and traffic distribution, with traffic only switching to the latest revision when it's ready.

Revision Labels: direct traffic to specific revisions. A label provides a unique URL that you can use to route traffic to the revision that the label is assigned.

Scopes:

- Revision-scope changes trigger a new revision when you deploy your app (trigger: changing [properties.template](https://learn.microsoft.com/en-us/azure/container-apps/azure-resource-manager-api-spec?tabs=arm-template#propertiestemplate))
- Application-scope changes are globally applied to all revisions. A new revision isn't created (trigger: changing [properties.configuration](https://learn.microsoft.com/en-us/azure/container-apps/azure-resource-manager-api-spec?tabs=arm-template#propertiesconfiguration))

### [Secrets](https://learn.microsoft.com/en-us/azure/container-apps/manage-secrets?tabs=azure-cli)

Secrets are scoped to an application, outside of any specific revision of an application. Once secrets are defined at the application level, secured values are available to container apps. Adding, removing, or changing secrets doesn't generate new revisions.

Defining secrets: `--secrets "queue-connection-string=<CONNECTION_STRING>"`

Referencing Secrets in Environment Variables (`secretref:`): `--env-vars "QueueName=myqueue" "ConnectionString=secretref:queue-connection-string"`

Mounting Secrets in a Volume (secret name is filename, secret value is content): `--secret-volume-mount "/mnt/secrets"`

### [Logging](https://learn.microsoft.com/en-us/azure/container-apps/log-monitoring?tabs=bash)

- System Logs (at the container app level)
- Console Logs (from the `stderr` and `stdout` messages inside container app)

#### Query Log with Log Analytics

Kusto:

```kusto
ContainerAppConsoleLogs_CL # or ContainerAppSystemLogs_CL
| where ContainerAppName_s == 'album-api'
| project Time=TimeGenerated, AppName=ContainerAppName_s, Revision=RevisionName_s, Container=ContainerName_s, Message=Log_s
| take 100
```

CLI:

```sh
# ContainerAppConsoleLogs_CL or ContainerAppSystemLogs_CL
az monitor log-analytics query --workspace $WORKSPACE_CUSTOMER_ID --analytics-query "ContainerAppConsoleLogs_CL | where ContainerAppName_s == 'album-api' | project Time=TimeGenerated, AppName=ContainerAppName_s, Revision=RevisionName_s, Container=ContainerName_s, Message=Log_s, LogLevel_s | take 5" --out table
```

### [Deployment](https://learn.microsoft.com/en-us/azure/container-apps/get-started?tabs=bash)

```sh
# Upgrade Azure CLI version on the workstation
az upgrade

# Add and upgrade the containerapp extension for managing containerized services
az extension add --name containerapp --upgrade

# Login to Azure
az login

# Register providers for Azure App Services (for hosting APIs) and Azure Operational Insights (for telemetry)
az provider register --namespace Microsoft.App
az provider register --namespace Microsoft.OperationalInsights

# Create an environment 'prod' in Azure Container Apps
az containerapp env create --resource-group MyResourceGroup --name prod

# Deploy the API service to the 'prod' environment, using the source code from a repository
# https://learn.microsoft.com/en-us/azure/container-apps/quickstart-code-to-cloud?tabs=bash
function deploy_repo() {
  az containerapp up \
    --name MyAPI \
    --resource-group MyResourceGroup \
    --location eastus \
    --environment prod \
    --context-path ./src \
    --repo myuser/myrepo

  # Display the Fully Qualified Domain Name (FQDN) of the app after it's deployed. This is the URL you would use to access your application.
  az containerapp show --name MyAPI --resource-group MyResourceGroup --query properties.configuration.ingress.fqdn
}

# Deploy a containerized application in Azure Container Apps, using an existing public Docker image
# https://learn.microsoft.com/en-us/azure/container-apps/get-started?tabs=bash
function deploy_image() {
  # Alt: az containerapp create
  az containerapp up \
    --name MyContainerApp \
    --resource-group MyResourceGroup \
    --environment prod \
    --image mcr.microsoft.com/azuredocs/containerapps-helloworld:latest \
    --target-port 80 \
    --ingress 'external' \ # allows the application to be accessible from the internet.
    # Display the Fully Qualified Domain Name (FQDN) of the app after it's deployed. This is the URL you would use to access your application.
    --query properties.configuration.ingress.fqdn

    # Alt: Deploy from a Docker Image in Azure Container Registry (ACR)
    # --image myAcr.azurecr.io/myimage:latest \
    # --registry-username myAcrUsername \
    # --registry-password myAcrPassword \
}
```

### [Disaster and Recovery](https://learn.microsoft.com/en-us/azure/container-apps/disaster-recovery?tabs=azure-cli)

In the event of a full region outage, you have two strategies:

- **Manual recovery**:
  - Manually deploy to a new region
  - Wait for the region to recover, and then manually redeploy all environments and apps.
- **Resilient recovery**: Deploy your container apps in advance to multiple regions. Use a traffic management service (ex: Azure Front Door) to direct requests to your main region. In case of an outage, reroute traffic from the affected region.

### [Dapr integration with Azure Container Apps](https://learn.microsoft.com/en-us/azure/container-apps/dapr-overview)

Azure Container Apps offers a managed Dapr integration, simplifying version upgrades and developer interaction. Dapr is activated per container app using specific arguments. Its APIs are accessible via a Dapr sidecar using HTTP or gRPC. Dapr's modular design allows shared or app-specific components, which can connect to external services and securely access configuration metadata. To load components only for the right apps, application scopes are used.

Enable Dapr: `az containerapp create --dapr-enabled ...`

Main APIs provided by Dapr:

- [**Service-to-service invocation**](https://docs.dapr.io/developing-applications/building-blocks/service-invocation/service-invocation-overview/): Enables secure, direct service calls.
- [**State management**](https://docs.dapr.io/developing-applications/building-blocks/state-management/state-management-overview/): Manages transactions and CRUD operations.
- [**Pub/sub**](https://docs.dapr.io/developing-applications/building-blocks/pubsub/pubsub-overview): Facilitates communication between container apps via message broker.
- [**Bindings**](https://docs.dapr.io/developing-applications/building-blocks/bindings/bindings-overview/): Triggers apps based on events.
- [**Actors**](https://docs.dapr.io/developing-applications/building-blocks/actors/actors-overview/): Supports scalable, message-driven units of work.
- [**Observability**](https://learn.microsoft.com/en-us/azure/container-apps/observability): Sends tracing information to an Application Insights backend.
- [**Secrets**](https://docs.dapr.io/developing-applications/building-blocks/secrets/secrets-overview/): Accesses secrets or references secure values in Dapr components.

## Docker

- `dotnet/core/sdk` - build an ASP.NET app
- `dotnet/core/aspnet` - run an ASP.NET app

[Multi-stage](https://docs.docker.com/build/building/multi-stage/) (build and run in different containers):

```Dockerfile
FROM mcr.microsoft.com/dotnet/core/sdk:3.0 AS build
WORKDIR /app

# copy csproj and restore as distinct layers
COPY *.sln .
COPY aspnetapp/*.csproj ./aspnetapp/
RUN dotnet restore

# copy everything else and build app
COPY aspnetapp/. ./aspnetapp/
WORKDIR /app/aspnetapp
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/core/aspnet:3.0 AS runtime
WORKDIR /app
COPY --from=build /app/aspnetapp/out ./
ENTRYPOINT ["dotnet", "aspnetapp.dll"]
```

[Serving both secure and non-secure web traffic](https://learn.microsoft.com/en-us/visualstudio/containers/container-tools?view=vs-2019#dockerfile-overview):

```Dockerfile
FROM mcr.microsoft.com/dotnet/core/aspnet:3.1 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build
WORKDIR /src
COPY ["WebApplication1/WebApplication1.csproj", "WebApplication1/"]
RUN dotnet restore "WebApplication1/WebApplication1.csproj"
COPY . .
WORKDIR "/src/WebApplication1"
RUN dotnet build "WebApplication1.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "WebApplication1.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "WebApplication1.dll"]
```

## CLI

- [az acr login](https://learn.microsoft.com/en-us/cli/azure/acr?view=azure-cli-latest#az-acr-login)
- [az acr create](https://learn.microsoft.com/en-us/cli/azure/acr?view=azure-cli-latest#az-acr-create)
- [az acr update](https://learn.microsoft.com/en-us/cli/azure/acr?view=azure-cli-latest#az-acr-update)
- [az acr build](https://learn.microsoft.com/en-us/cli/azure/acr?view=azure-cli-latest#az-acr-build)
- [az acr task create](https://learn.microsoft.com/en-us/cli/azure/acr/task?view=azure-cli-latest#az-acr-task-create)
- [az acr repository](https://learn.microsoft.com/en-us/cli/azure/acr/repository?view=azure-cli-latest)
- [az acr run](https://learn.microsoft.com/en-us/cli/azure/acr?view=azure-cli-latest#az-acr-run)
- [az acr show](https://learn.microsoft.com/en-us/cli/azure/acr?view=azure-cli-latest#az-acr-show)
- [az container create](https://learn.microsoft.com/en-us/cli/azure/container?view=azure-cli-latest#az-container-create)
- [az container show](https://learn.microsoft.com/en-us/cli/azure/container?view=azure-cli-latest#az-container-show)
- [az containerapp create](https://learn.microsoft.com/en-us/cli/azure/containerapp?view=azure-cli-latest#az-containerapp-create)
- [az containerapp up](https://learn.microsoft.com/en-us/cli/azure/containerapp?view=azure-cli-latest#az-containerapp-up)
- [az containerapp env create](https://learn.microsoft.com/en-us/cli/azure/containerapp/env?view=azure-cli-latest#az-containerapp-env-create)
- [az containerapp show](https://learn.microsoft.com/en-us/cli/azure/containerapp?view=azure-cli-latest#az-containerapp-show)
- [az containerapp identity assign](https://learn.microsoft.com/en-us/cli/azure/containerapp/identity?view=azure-cli-latest#az-containerapp-identity-assign)
- [az upgrade](https://learn.microsoft.com/en-us/cli/azure/reference-index?view=azure-cli-latest#az-upgrade)
- [az provider register](https://learn.microsoft.com/en-us/cli/azure/provider?view=azure-cli-latest#az-provider-register)
- [az extension add](https://learn.microsoft.com/en-us/cli/azure/extension?view=azure-cli-latest#az-extension-add)
- [az identity create](https://learn.microsoft.com/en-us/cli/azure/identity?view=azure-cli-latest#az-identity-create)
- [az role assignment create](https://learn.microsoft.com/en-us/cli/azure/role/assignment?view=azure-cli-latest#az-role-assignment-create)
- [az ad sp](https://learn.microsoft.com/en-us/cli/azure/ad/sp?view=azure-cli-latest)
- [az monitor log-analytics query](https://learn.microsoft.com/en-us/cli/azure/monitor/log-analytics?view=azure-cli-latest#az-monitor-log-analytics-query)
