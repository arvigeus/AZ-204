# [Containers](https://learn.microsoft.com/en-us/azure/containers/)

## [Container Registry](https://learn.microsoft.com/en-us/azure/container-registry/)

Endpoint: `<registry>.azurecr.io/<repository>/<image-or-artifact>:<tag>`

`<repository>` is also known as `<namepsace>`. It allows sharing a single registry across multiple groups within your organization. Can be multiple levels deep. Optional.

## [Working with Azure Container Registry](https://learn.microsoft.com/en-us/azure/container-registry/container-registry-get-started-azure-cli)

```sh
# Login to manage resources
az login

# Create a resource group
az group create --name $resourceGroup --location eastus

# Create Azure Container Registry
## https://learn.microsoft.com/en-us/azure/container-registry/container-registry-skus
## --sku {Basic,Standard,Premium} # 10, 100, 500GB; 💎: Concurrent operations, High volumes (⚡), Customer-Managed Key, Content trust for image tag signing, Private link
## Throttling: May happen if you exceed the registry's limits, causing temporary `HTTP 429` errors and requiring retry logic or reducing the request rate.
##
## [--default-action {Allow, Deny}] # 💎: Default action when no rules apply
##
## https://learn.microsoft.com/en-us/azure/container-registry/zone-redundancy
## [--zone-redundancy {Disabled, Enabled}] # 💎: Min 3 separate zones in each enabled region. The environment must include a virtual network (VNET) with an available subnet.
az acr create --resource-group $resourceGroup --name $registryName --sku Standard # ⭐: Production
# NOTE: High numbers of repositories and tags can impact the performance. Periodically delete unused.

# ACR Login: https://learn.microsoft.com/en-us/azure/container-registry/container-registry-authentication
## - Interactive: Individual Entra ID login, Admin Account
## - Unatended / Headless: Entra ID Service Principal, Managed Identity for Azure Resources
## Roles: https://learn.microsoft.com/en-us/azure/container-registry/container-registry-roles?tabs=azure-cli
##
## 1) Individual login with Entra ID: Interactive push/pull by developers, testers.
## az login - provides the token. It has to be renewed every 3 hours
az acr login --name "$registryName" # Token must be renewed every 3 hours.
##
## 2) Entra ID Service Principal: Unattended push/pull in CI/CD pipelines
### Create service principal
#### Method 1: Short version that will setup and return appId and password in JSON format
az ad sp create-for-rbac --name $ServicePrincipalName --role AcrPush,AcrPull,AcrDelete --scopes /subscriptions/$subscriptionId/resourceGroups/$resourceGroup/providers/Microsoft.ContainerRegistry/registries/$registryName
#### Method 2: Create a service principal and configure roles separately
az ad sp create --id $ServicePrincipalName
az role assignment create --assignee $appId --role AcrPush,AcrPull,AcrDelete --scope /subscriptions/$subscriptionId/resourceGroups/$resourceGroup/providers/Microsoft.ContainerRegistry/registries/$registryName
az ad sp credential reset --name $appId # for method 2 password is not explicitly created, so we need to create (reset) it
#### Note: Password expires in 1 year.
az acr login --name $registryName --username $appId --password $password
##
## 3) Managed identities
az role assignment create --assignee $managedIdentityId --scope $registryName --role AcrPush,AcrPull,AcrDelete
## Now container instances / apps must use that managed identity to access this ACR (pull or push images)
##
## 4) Admin User: ❌. Interactive push/pull by individual developers.
### The admin account is provided with two passwords, both of which can be regenerated
az acr update -n $registryName --admin-enabled true # this is disabled by default
docker login $registryName.azurecr.io

# Tasks: https://learn.microsoft.com/en-us/azure/container-registry/container-registry-tasks-overview
## [--platform Linux {Linux, Windows}] # Linux supports all architectures (ex: Linux/arm), Windows: only amd64 (ex: Windows/amd64) - arch is optional
##
## - Quick task
az acr build --registry $registryName --image $imageName:$tag . # docker build, docker push
az acr run --registry $registryName --cmd '$registryName/$repository/$imageName:$tag' /dev/null # Run image (last param is source location, optional for non-image building tasks)
##
## - Automatically Triggered Task
### [--<operation>-trigger-enabled true] # CI on commit or pull-request
### [--schedule] # CRON schedule (⭐: OS/framework patching): https://learn.microsoft.com/en-us/azure/container-registry/container-registry-tasks-scheduled
az acr task create --name ciTask --registry $registryName --image $imageName:{{.Run.ID}} --context https://github.com/myuser/myrepo.git --file Dockerfile --git-access-token $GIT_ACCESS_TOKEN
az acr task create --name cmdTask --registry $registryName --cmd mcr.microsoft.com/hello-world --context /dev/null
### az acr task run --name mytask --registry $registryName # manually run task
##
## - Multi-step Task: granular control (build, push, when, cmd defined as steps) - https://learn.microsoft.com/en-us/azure/container-registry/container-registry-tasks-reference-yaml
### NOTE: --file is used for both multi-step task and Dockerfile
az acr run --file multi-step.yaml https://github.com/Azure-Samples/acr-tasks.git
az acr task create --file multi-step.yaml --name ciTask --registry $registryName --image $imageName:{{.Run.ID}} --context https://github.com/myuser/myrepo.git --git-access-token $GIT_ACCESS_TOKEN
```

Push and run a Docker image:

```sh
# Push image to registry
## Pull 'hello-world' image from Microsoft's Registry
docker pull mcr.microsoft.com/hello-world
## Tag the image
docker tag mcr.microsoft.com/hello-world $registryName.azurecr.io/$repository/$imageName:$tag
## Push image
docker push $registryName.azurecr.io/$repository/$imageName:$tag

# Run image from registry
docker run $registryName.azurecr.io/$repository/$imageName:$tag
# Alt: az acr run --registry $registryName --cmd '$registryName/$repository/$imageName:$tag' /dev/null
```

List container images and tags:

```sh
az acr repository list --name $registryName --output table
az acr repository show-tags --name $registryName --repository $repository --output table
```

## [Container Instances](https://learn.microsoft.com/en-us/azure/container-instances/)

Enables the deployment of Docker containers (up to 15 GB) without provisioning virtual machines.

**Does not support scaling! Use Container Apps for that!**

NB: If a container group restarts, its IP might change. Avoid using hardcoded IP addresses. For a stable public IP, consider [using Application Gateway](https://learn.microsoft.com/en-us/azure/container-instances/container-instances-application-gateway).

## Working with Azure Container Instances

```sh
# Login to manage resources
az login

# Create a resource group
az group create --name $resourceGroup --location eastus

# (Optional)

# Deployment
##
## NOTE: If using managed identities with ACR, you'll also need --asign-identity param
## or az container identity assign --identities $identityName --resource-group $resourceGroup --name $containerName
##
## From image - simple scenarios
###
### Azure File share: https://learn.microsoft.com/en-us/azure/container-instances/container-instances-volume-azure-files
### Can only be mounted to Linux containers running as root!
### --os-type Linux
### --azure-file-volume-account-name # Azure File Share requires existing storage account and account key
### --azure-file-volume-account-key
### --azure-file-volume-mount-path
### --azure-file-volume-share-name
### NOTE: No direct integration Blob Storage because it lacks SMB support
###
### Public DNS name (must be unique) - accessible from $dnsLabel.<region>.azurecontainer.io
### --dns-name-label $dnsLabel
### --ip-address public
###
### [--restart-policy {Always, Never, OnFailure}] # Default: Always. Never if you only want to run once. Status when stopped: Terminated
###
### Environment variables: https://learn.microsoft.com/en-us/azure/container-instances/container-instances-environment-variables
#### NOTE: Format can be 'key'='value', key=value, 'key=value'
### --environment-variables # ex: 'PUBLIC_ENV_VAR'='my-exposed-value'
### --secure-environment-variables # ex: 'SECRET_ENV_VAR'='my-secret-value' - not visible in your container's properties
###
### Mount secret volumes: https://learn.microsoft.com/en-us/azure/container-instances/container-instances-volume-secret
### --secrets mysecret1="My first secret FOO" mysecret2="My second secret BAR"
### --secrets-mount-path /mnt/secrets
### NB: Restricted to Linux containers
### NOTE: This creates mysecret1 and mysecret2 files in /mnt/secrets with value the content of the secret
###
az container create --name $containerName --image $imageName:$tag --resource-group $resourceGroup
##
## From YAML file - deployment includes only container instances
### Same options as from simple deployment, but in a YAML file. Includes container groups.
az container create --name $containerName --file deploy.yml --resource-group $resourceGroup
##
## ARM template - deploy additional Azure service resources (for example, an Azure Files share)
### No example, but it's good to know this fact

# Verify container is running
az container show --name $containerName --resource-group $resourceGroup --query "{FQDN:ipAddress.fqdn,ProvisioningState:provisioningState}" --out table
```

YAML deployment (`deploy.yml`) (see CLI example above for reference):

```yml
apiVersion: "2019-12-01"
location: eastus
name: containerName
properties:
  # Container groups: https://learn.microsoft.com/en-us/azure/container-instances/container-instances-container-groups
  # Containers use a single host machine, sharing lifecycle, resources, network (share an external IP, ports. DNS), and storage volumes
  # For Windows containers, only single-instance deployment are allowed (NOTE: Here we use two!)
  # The resources allocated for the host are sum of all resources requested (In this case: 2 CPUs and 2.5 GB RAM)
  containers:
    - name: helloworld
      properties:
        environmentVariables:
          - name: "PUBLIC_ENV_VAR"
            value: "my-exposed-value"

          - name: "SECRET_ENV_VAR"
            secureValue: "my-secret-value"
        image: mcr.microsoft.com/hello-world
        ports:
          - port: 443
        resources:
          requests:
            cpu: 1.0
            memoryInGB: 1
        volumeMounts:
          - mountPath: /mnt/secrets
            name: secretvolume
    - name: hellofiles
      properties:
        environmentVariables: []
        image: mcr.microsoft.com/azuredocs/aci-hellofiles
        ports:
          - port: 80
        resources:
          requests:
            cpu: 1.0
            memoryInGB: 1.5
        volumeMounts:
          - mountPath: /aci/logs/
            name: filesharevolume
  osType: Linux # or Windows (for single containers)
  restartPolicy: Always
  ipAddress:
    type: Public
    ports:
      - port: 443
      - port: 80
    dnsNameLabel: containerName
  volumes:
    - name: filesharevolume
      azureFile:
        sharename: acishare
        storageAccountName: <Storage account name>
        storageAccountKey: <Storage account key>
    - name: secretvolume
      secret:
        # NB: The secret values must be Base64-encoded!
        mysecret1: TXkgZmlyc3Qgc2VjcmV0IEZPTwo= # "My first secret FOO"
        mysecret2: TXkgc2Vjb25kIHNlY3JldCBCQVIK # "My second secret BAR"
tags: {}
type: Microsoft.ContainerInstance/containerGroups
```

### Note for Azure File Shares

**Azure Container Instances does not support direct integration Blob Storage** because it lacks SMB support.

To use Azure File Share, you need to:

- Create the storage account
- Create a file share
- From storage account, you need Storage account name, Share name, and Storage account key.

### Container Instances Diagnostics and Logging

`az container attach` Connects your local console to a container's output and error streams in **real time** (example: to debug startup issue).

`az container logs` Displays logs (when no real time monitoring is needed)

## [Azure Container Apps](https://learn.microsoft.com/en-us/azure/container-apps/)

Fully managed (no need to manage other Azure infrastructure) environment. Common use cases:

- Deploying API endpoints
- Hosting background processing applications
- Handling event-driven processing
- Running microservices

Limitations:

- Cannot run privileged containers (no root).
- linux/amd64 container images are required.
- State doesn't persist inside a container due to regular restarts. Use external caches for in-memory cache requirements.

A webhook can be used to notify Azure Container Apps when a new image has been pushed to the ACR, triggering automatic deployment of the updated container.

### [Auth](https://learn.microsoft.com/en-us/azure/container-apps/authentication)

The platform's authentication and authorization middleware component runs as a _sidecar_ container on each application replica, screening all incoming HTTPS (ensure `allowInsecure` is _disabled_ in ingress config) requests before they reach your application. [See more](./App%20Service%20Web%20Apps.md). It requires any identity provider and specified provider within app settings.

### [Managed identities](https://learn.microsoft.com/en-us/azure/container-apps/managed-identity)

Main topic: [Managed Identities](./Managed%20Identities.md)

Not supported in scaling rules.

### [Scaling](https://learn.microsoft.com/en-us/azure/container-apps/scale-app)

Scaling is driven by three different categories of triggers:

- HTTP: Based on the number of concurrent HTTP requests to your revision.
- TCP: Based on the number of concurrent TCP connections to your revision.
- Custom: Based on CPU, memory (_cannot scale to 0_), or supported event-driven data sources such as:
  - Azure Service Bus
  - Azure Event Hubs
  - Apache Kafka
  - Redis

As a container app revision scales out, new instances of the revision are created on-demand. These instances are known as replicas (default: 0-10). Adding or editing scaling rules creates a new revision of the container app. In "multiple revisions" mode, adding a new scale trigger creates a new revision of your application but your old revision remains available with the old scale rules.

Example:

```sh
az containerapp create \
 # ...
 --min-replicas 0 \
 --max-replicas 5 \

 #  HTTP Scaling Rule
 --scale-rule-name http-rule-name \
 --scale-rule-type http \
 --scale-rule-http-concurrency 100

 # TCP Scaling Rule
 --scale-rule-name tcp-rule-name \
 --scale-rule-type tcp \
 --scale-rule-tcp-concurrency 100

 # Custom Scaling rule
 ## Note we use --secrets to define the connection string and reuse it by secret name in --scale-rule-auth
  --secrets "connection-string-secret=<SERVICE_BUS_CONNECTION_STRING>" \
 --scale-rule-auth "connection=connection-string-secret"
 --scale-rule-name servicebus-rule-name \
 --scale-rule-type azure-servicebus \
 --scale-rule-metadata "queueName=my-queue" "namespace=service-bus-namespace" "messageCount=5"
```

Without a scale rule, the default (HTTP, 0-10 replicas) applies to your app. Create a rule or set minReplicas to 1+ if ingress is disabled. Without minReplicas or a custom rule, your app can scale to zero and won't start.

### [Revisions](https://learn.microsoft.com/en-us/azure/container-apps/revisions)

Immutable snapshots of a container app version. The first revision is auto-created upon deployment, new are created on revision scope changes. Up to 100 revisions can be stored for history. Multiple revisions can run at once, with HTTP traffic split among them.

- **Single revision mode**: keeps the old revision active until the new one is ready.
- **Multiple revision mode**: you control revision lifecycle and traffic distribution (via ingress), with traffic only switching to the latest revision when it's ready.

Revision Labels: direct traffic to specific revisions. A label provides a unique URL that you can use to route traffic to the revision that the label is assigned.

Scopes:

- Revision-scope changes via `az containerapp update` trigger a new revision when you deploy your app. Trigger: changing [properties.template](https://learn.microsoft.com/en-us/azure/container-apps/azure-resource-manager-api-spec?tabs=arm-template#propertiestemplate). Example: version suffix, container config, scaling rules. The changes don't affect other revisions.
- Application-scope changes are globally applied to all revisions. A new revision isn't created Trigger: changing [properties.configuration](https://learn.microsoft.com/en-us/azure/container-apps/azure-resource-manager-api-spec?tabs=arm-template#propertiesconfiguration). Example: secrets, revision mode, ingress, credentials, DARP settings.

### [Secrets](https://learn.microsoft.com/en-us/azure/container-apps/manage-secrets?tabs=azure-cli)

Secrets are scoped to an application (`az containerapp create`), outside of any specific revision of an application. Once secrets are defined at the application level, secured values are available to container apps. Adding, removing, or changing secrets doesn't generate new revisions. Apps need to be restarted to reflect updates.

Defining secrets: `--secrets "queue-connection-string=<CONNECTION_STRING>"`

Secrets from Key Vault: `--secrets "kv-connection-string=keyvaultref:<KEY_VAULT_SECRET_URI>,identityref:<USER_ASSIGNED_IDENTITY_ID>"`

Mounting Secrets in a Volume (secret name is filename, secret value is content): `--secret-volume-mount "/mnt/secrets"`

Referencing Secrets in Environment Variables (`secretref:`): `--env-vars "QueueName=myqueue" "ConnectionString=secretref:queue-connection-string"`

### [Logging](https://learn.microsoft.com/en-us/azure/container-apps/log-monitoring)

- System Logs (at the container app level)
- Console Logs (from the `stderr` and `stdout` messages inside container app)

#### Query Log with Log Analytics

```sh
# ContainerAppConsoleLogs_CL or ContainerAppSystemLogs_CL
az monitor log-analytics query --workspace $WORKSPACE_CUSTOMER_ID --analytics-query "ContainerAppConsoleLogs_CL | where ContainerAppName_s == 'album-api' | project Time=TimeGenerated, AppName=ContainerAppName_s, Revision=RevisionName_s, Container=ContainerName_s, Message=Log_s, LogLevel_s | take 5" --out table
```

### [Deployment](https://learn.microsoft.com/en-us/azure/container-apps/get-started)

- `az containerapp create` - Creates a new container app in Azure with specific configurations (CPU, memory, environment variables, etc).
- `az containerapp up` - Quicker and more automated deployment process, ideal for development or testing.

If you anticipate needing more control or specific configurations in the future, `az containerapp create` might be the more suitable choice. If simplicity and speed are the primary concerns, `az containerapp up` might be preferred.

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
az containerapp env create --resource-group $resourceGroup --name prod

# Deploy the API service to the 'prod' environment, using the source code from a repository
# https://learn.microsoft.com/en-us/azure/container-apps/quickstart-code-to-cloud
function deploy_repo() {
  az containerapp up \
    --name MyAPI \
    --resource-group $resourceGroup \
    --location eastus \
    --environment prod \
    --context-path ./src \
    --repo myuser/myrepo \
    --ingress 'external'

  # Display the Fully Qualified Domain Name (FQDN) of the app after it's deployed. This is the URL you would use to access your application.
  az containerapp show --name MyAPI --resource-group $resourceGroup --query properties.configuration.ingress.fqdn
}

# Deploy a containerized application in Azure Container Apps, using an existing public Docker image
# https://learn.microsoft.com/en-us/azure/container-apps/get-started
function deploy_image() {
  az containerapp up \
    --name MyContainerApp \
    --resource-group $resourceGroup \
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

Dapr is activated per container app. Its APIs are accessible via a Dapr sidecar using HTTP or gRPC. Dapr's modular design allows shared or app-specific components, which can connect to external services and securely access configuration metadata. By default Dapr-enabled container apps load the full set of deployed components. To load components only for the right apps, application scopes are used.

Enable Dapr: `az containerapp create --dapr-enabled ...`

Main APIs provided by Dapr:

- [**Service-to-service invocation**](https://docs.dapr.io/developing-applications/building-blocks/service-invocation/service-invocation-overview/): Enables secure, direct service calls.
- [**State management**](https://docs.dapr.io/developing-applications/building-blocks/state-management/state-management-overview/): Manages transactions and CRUD operations.
- [**Pub/sub**](https://docs.dapr.io/developing-applications/building-blocks/pubsub/pubsub-overview): Facilitates communication between container apps via message broker. For event-driven architecture.
- [**Bindings**](https://docs.dapr.io/developing-applications/building-blocks/bindings/bindings-overview/): Communicate with external systems.
- [**Actors**](https://docs.dapr.io/developing-applications/building-blocks/actors/actors-overview/): Supports scalable, message-driven units of work.
- [**Observability**](https://learn.microsoft.com/en-us/azure/container-apps/observability): Sends tracing information to an Application Insights backend.
- [**Secrets**](https://docs.dapr.io/developing-applications/building-blocks/secrets/secrets-overview/): Accesses secrets or references secure values in Dapr components.

## Docker

- `dotnet/core/sdk` - build an ASP.NET app
- `dotnet/core/aspnet` - run an ASP.NET app

```Dockerfile
 # Sets the working directory to `/app`, which is where app files will be copied.
WORKDIR /app
# Copies the contents of the published app to the container's working directory (`/app` in this case).
COPY bin/Release/net6.0/publish/ .
```

### [Multi-stage](https://docs.docker.com/build/building/multi-stage/)

- Compile Stage:
  - Choose a base image suitable for compiling the code.
  - Set the working directory.
  - Copy the source code.
  - Compile the code.
- Runtime Stage:
  - Choose a base image suitable for running the application.
  - Copy compiled binaries or artifacts from the compile stage.
  - Set the command to run the application.

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

# copy csproj and restore as distinct layers
FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build
WORKDIR /src
COPY ["WebApplication1/WebApplication1.csproj", "WebApplication1/"]
RUN dotnet restore "WebApplication1/WebApplication1.csproj"

# copy everything else and build app
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

| Command                                                                                                                                                    | Brief Explanation                                                                   | Example                                                                                                |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| [az acr login](https://learn.microsoft.com/en-us/cli/azure/acr?view=azure-cli-latest#az-acr-login)                                                         | Authenticate with an ACR.                                                           | `az acr login --name MyRegistry`                                                                       |
| [az acr create](https://learn.microsoft.com/en-us/cli/azure/acr?view=azure-cli-latest#az-acr-create)                                                       | Create a new ACR.                                                                   | `az acr create --resource-group $resourceGroup --name MyRegistry --sku Basic`                          |
| [az acr update](https://learn.microsoft.com/en-us/cli/azure/acr?view=azure-cli-latest#az-acr-update)                                                       | Update properties of an ACR.                                                        | `az acr update --name MyRegistry --tags key=value`                                                     |
| [az acr build](https://learn.microsoft.com/en-us/cli/azure/acr?view=azure-cli-latest#az-acr-build)                                                         | Build a container image in ACR.                                                     | `az acr build --image MyImage:tag --registry MyRegistry .`                                             |
| [az acr task create](https://learn.microsoft.com/en-us/cli/azure/acr/task?view=azure-cli-latest#az-acr-task-create)                                        | Create a task for an ACR.                                                           | `az acr task create --registry MyRegistry --name MyTask --image MyImage:tag --context /path/to/source` |
| [az acr repository](https://learn.microsoft.com/en-us/cli/azure/acr/repository?view=azure-cli-latest)                                                      | Manage repositories (image storage) in ACR.                                         | `az acr repository show-tags --name MyRegistry --repository MyImage`                                   |
| [`az acr repository list`](https://learn.microsoft.com/en-us/cli/azure/acr/repository?view=azure-cli-latest#az-acr-repository-list)                        | List repositories / Verify an image has been pushed to ACR                          | `az acr repository list --name MyRegistry`                                                             |
| [az acr run](https://learn.microsoft.com/en-us/cli/azure/acr?view=azure-cli-latest#az-acr-run)                                                             | Queue a run to stream logs for an ACR.                                              | `az acr run --registry MyRegistry --cmd '$Registry/myimage' /dev/null`                                 |
| [az acr show](https://learn.microsoft.com/en-us/cli/azure/acr?view=azure-cli-latest#az-acr-show)                                                           | Get the details of an ACR.                                                          | `az acr show --name MyRegistry --query "loginServer"`                                                  |
| [az container create](https://learn.microsoft.com/en-us/cli/azure/container?view=azure-cli-latest#az-container-create)                                     | Create a container group in ACI (deploy an image).                                  | `az container create --name MyContainer --image myimage:latest`                                        |
| [az container attach](https://learn.microsoft.com/en-us/cli/azure/container?view=azure-cli-latest#az-container-attach)                                     | Attach local standard output and error streams to a container in a container group. | `az container attach --name MyContainer --resource-group $resourceGroup`                               |
| [az container show](https://learn.microsoft.com/en-us/cli/azure/container?view=azure-cli-latest#az-container-show)                                         | Get the details of a container group.                                               | `az container show --name MyContainer --resource-group $resourceGroup`                                 |
| [az container logs](https://learn.microsoft.com/en-us/cli/azure/container?view=azure-cli-latest#az-container-logs)                                         | Fetch the logs for a container in a container group.                                | `az container logs --name MyContainer --resource-group $resourceGroup`                                 |
| [az containerapp create](https://learn.microsoft.com/en-us/cli/azure/containerapp?view=azure-cli-latest#az-containerapp-create)                            | Create a Container App.                                                             | `az containerapp create --name MyContainerApp --resource-group $resourceGroup --image myimage:latest`  |
| [az containerapp up](https://learn.microsoft.com/en-us/cli/azure/containerapp?view=azure-cli-latest#az-containerapp-up)                                    | Create or update a Container App and associated resources.                          | `az containerapp up --name MyContainerApp`                                                             |
| [az containerapp env create](https://learn.microsoft.com/en-us/cli/azure/containerapp/env?view=azure-cli-latest#az-containerapp-env-create)                | Create an environment for a Container App.                                          | `az containerapp env create --name MyEnvironment --resource-group $resourceGroup`                      |
| [az containerapp show](https://learn.microsoft.com/en-us/cli/azure/containerapp?view=azure-cli-latest#az-containerapp-show)                                | Show details of a Container App.                                                    | `az containerapp show --name MyContainerApp --resource-group $resourceGroup`                           |
| [az containerapp identity assign](https://learn.microsoft.com/en-us/cli/azure/containerapp/identity?view=azure-cli-latest#az-containerapp-identity-assign) | Assign managed identities to a Container App.                                       | `az containerapp identity assign --name MyContainerApp --identities [system]`                          |
| [az upgrade](https://learn.microsoft.com/en-us/cli/azure/reference-index?view=azure-cli-latest#az-upgrade)                                                 | Upgrade Azure CLI and extensions.                                                   | `az upgrade`                                                                                           |
| [az identity create](https://learn.microsoft.com/en-us/cli/azure/identity?view=azure-cli-latest#az-identity-create)                                        | Create a managed identity.                                                          | `az identity create --name MyManagedIdentity --resource-group $resourceGroup`                          |
| [az role assignment create](https://learn.microsoft.com/en-us/cli/azure/role/assignment?view=azure-cli-latest#az-role-assignment-create)                   | Create a new role assignment for a user, group, or service principal.               | `az role assignment create --assignee john.doe@domain.com --role Reader`                               |
| [az ad sp](https://learn.microsoft.com/en-us/cli/azure/ad/sp?view=azure-cli-latest)                                                                        | Manage Microsoft Entra ID service principals.                                       | `az ad sp create-for-rbac --name MyServicePrincipal`                                                   |
| [az monitor log-analytics query](https://learn.microsoft.com/en-us/cli/azure/monitor/log-analytics?view=azure-cli-latest#az-monitor-log-analytics-query)   | Query a Log Analytics workspace.                                                    | `az monitor log-analytics query --workspace MyWorkspace --query 'MyQuery'`                             |
| [az acr import](https://learn.microsoft.com/en-us/cli/azure/acr?view=azure-cli-latest#az-acr-import)                                                       | Import an image to an ACR from another registry.                                    | `az acr import --name MyRegistry --source myregistry.azurecr.io/myimage:tag`                           |
| [az containerapp revision list](https://learn.microsoft.com/en-us/cli/azure/containerapp?view=azure-cli-latest#az-containerapp-revision-list)              | List the revisions of a Container App.                                              | `az containerapp revision list --name MyContainerApp --resource-group $resourceGroup`                  |
