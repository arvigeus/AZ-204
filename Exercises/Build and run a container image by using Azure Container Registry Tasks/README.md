# Build and run a container image by using Azure Container Registry Tasks

In this exercise, you use ACR Tasks to perform the following actions:

- Create an Azure Container Registry (ACR)
- Build and push image from a Dockerfile
- Verify the results
- Run the image in the ACR

## Prerequisites

- An **Azure account** with an active subscription. If you don't already have one, you can sign up for a free trial at <https://azure.com/free>

## Sign in to Azure and start the Cloud Shell

1. Sign in to the [Azure portal](https://portal.azure.com/) and open the Cloud Shell.

   [The location of Cloud Shell launch button.](https://learn.microsoft.com/en-us/training/wwl-azure/publish-container-image-to-azure-container-registry/media/cloud-shell-menu.png)

1. When the shell opens select the **Bash** environment.

   ![Selecting the Bash environment.](https://learn.microsoft.com/en-us/training/wwl-azure/publish-container-image-to-azure-container-registry/media/shell-bash-selection.png)

## Create an Azure Container Registry

1. Create a resource group for the registry. Replace `<myLocation>` in the following command with a location near you.

   ```sh
   az group create --name az204-acr-rg --location <myLocation>
   ```

1. Create a basic container registry. The registry name must be unique within Azure, and contain 5-50 alphanumeric characters. Replace `<myContainerRegistry>` in the following command with a unique value.

   ```sh
   az acr create --resource-group az204-acr-rg \
       --name <myContainerRegistry> --sku Basic
   ```

   :information*source: The command creates a \_Basic* registry, a cost-optimized option for developers learning about Azure Container Registry.

## Build and push image from a Dockerfile

Now use Azure Container Registry to build and push an image based on a local Dockerfile.

1. Create, or navigate, to a local directory and then use the following command to create the Dockerfile. The Dockerfile contains a single line that references the `hello-world` image hosted at the Microsoft Container Registry.

   ```sh
   echo FROM mcr.microsoft.com/hello-world > Dockerfile
   ```

1. Run the `az acr build` command, which builds the image and, after the image is successfully built, pushes it to your registry. Replace `<myContainerRegistry>` with the name you used earlier.

   ```sh
   az acr build --image sample/hello-world:v1  \
       --registry <myContainerRegistry> \
       --file Dockerfile .
   ```

   Following is a shortened sample of the output from the previous command showing the last few lines with the final results. You can see in the `repository` field the `sample/hello-word` image is listed.

   ```txt
   - image:
       registry: <myContainerRegistry>.azurecr.io
       repository: sample/hello-world
       tag: v1
       digest: sha256:92c7f9c92844bbbb5d0a101b22f7c2a7949e40f8ea90c8b3bc396879d95e899a
     runtime-dependency:
       registry: mcr.microsoft.com
       repository: hello-world
       tag: latest
       digest: sha256:92c7f9c92844bbbb5d0a101b22f7c2a7949e40f8ea90c8b3bc396879d95e899a
     git: {}


   Run ID: cf1 was successful after 11s
   ```

## Verify the results

1. Use the `az acr repository list` command to list the repositories in your registry. Replace `<myContainerRegistry>` with the name you used earlier.

   ```sh
   az acr repository list --name <myContainerRegistry> --output table
   ```

   Output:

   ```txt
   Result
   ----------------
   sample/hello-world
   ```

1. Use the `az acr repository show-tags` command to list the tags on the **sample/hello-world** repository. Replace `<myContainerRegistry>` with the name you used earlier.

   ```sh
   az acr repository show-tags --name <myContainerRegistry> \
       --repository sample/hello-world --output table
   ```

   Output:

   ```txt
   Result
   --------
   v1
   ```

## Run the image in the ACR

1. Run the `sample/hello-world:v1` container image from your container registry by using the `az acr run` command. The following example uses `$Registry` to specify the registry where you run the command. Replace `<myContainerRegistry>` with the name you used earlier.

   ```sh
   az acr run --registry <myContainerRegistry> \
       --cmd '$Registry/sample/hello-world:v1' /dev/null
   ```

   The `cmd` parameter in this example runs the container in its default configuration, but `cmd` supports other `docker run` parameters or even other `docker` commands.

   The following sample output is shortened:

   ```txt
   Packing source code into tar to upload...
   Uploading archived source code from '/tmp/run_archive_ebf74da7fcb04683867b129e2ccad5e1.tar.gz'...
   Sending context (1.855 KiB) to registry: mycontainerre...
   Queued a run with ID: cab
   Waiting for an agent...
   2019/03/19 19:01:53 Using acb_vol_60e9a538-b466-475f-9565-80c5b93eaa15 as the home volume
   2019/03/19 19:01:53 Creating Docker network: acb_default_network, driver: 'bridge'
   2019/03/19 19:01:53 Successfully set up Docker network: acb_default_network
   2019/03/19 19:01:53 Setting up Docker configuration...
   2019/03/19 19:01:54 Successfully set up Docker configuration
   2019/03/19 19:01:54 Logging in to registry: mycontainerregistry008.azurecr.io
   2019/03/19 19:01:55 Successfully logged into mycontainerregistry008.azurecr.io
   2019/03/19 19:01:55 Executing step ID: acb_step_0. Working directory: '', Network: 'acb_default_network'
   2019/03/19 19:01:55 Launching container with name: acb_step_0

   Hello from Docker!
   This message shows that your installation appears to be working correctly.

   2019/03/19 19:01:56 Successfully executed container: acb_step_0
   2019/03/19 19:01:56 Step ID: acb_step_0 marked as successful (elapsed time in seconds: 0.843801)

   Run ID: cab was successful after 6s
   ```

## Clean up resources

When no longer needed, you can use the `az group delete` command to remove the resource group, the container registry, and the container images stored there.

```sh
az group delete --name az204-acr-rg --no-wait
```
