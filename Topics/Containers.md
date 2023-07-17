# [Containers](https://learn.microsoft.com/en-us/azure/containers/)

## [Container Registry](https://learn.microsoft.com/en-us/azure/container-registry/)

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

```ps
# Linux supports all architectures
az acr build --registry MyRegistry --image MyImage:tag --platform Linux/arm .
# Windows supports only AMD64
az acr build --registry MyRegistry --image MyImage:tag --platform Windows/amd64 .
```

### [Working with Azure Container Registry](https://learn.microsoft.com/en-us/azure/container-registry/container-registry-get-started-azure-cli)

```ps
# Create container registry
# az group create --name myResourceGroup --location eastus
az acr create --name mycontainerregistry --sku Basic --resource-group myResourceGroup

# Login to container registry
az acr login --name "<registry-name>"

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

## [Container Instances](https://learn.microsoft.com/en-us/azure/container-instances/)

## CLI

- [az acr update](https://learn.microsoft.com/en-us/cli/azure/acr?view=azure-cli-latest#az-acr-update)
- [az acr build](https://learn.microsoft.com/en-us/cli/azure/acr?view=azure-cli-latest#az-acr-build)
- [az acr task create](https://learn.microsoft.com/en-us/cli/azure/acr/task?view=azure-cli-latest#az-acr-task-create)
