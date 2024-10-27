# Create a static HTML web app by using Azure Cloud Shell

[Sign it to activate sandbox](https://learn.microsoft.com/en-us/training/modules/introduction-to-azure-app-service/7-create-html-web-app?activate-azure-sandbox=true)

The free sandbox allows you to create resources in a subset of the Azure global regions. Select a region from the following list when you create resources:

- West US 2
- South Central US
- Central US
- East US
- West Europe
- Southeast Asia
- Japan East
- Brazil South
- Australia Southeast
- Central India

In this exercise, you deploy a basic HTML+CSS site to Azure App Service by using the Azure CLI `az webapp up` command. Next, you update the code and redeploy it by using the same command.

The `az webapp up` command makes it easy to create and update web apps. When executed, it performs the following actions:

- Create a default resource group if one isn't specified.
- Create a default app service plan.
- Create an app with the specified name.
- Zip deploy files from the current working directory to the web app.

:bangbang: In order to complete this exercise you need to switch the Cloud Shell to the Classic version. After the Cloud Shell finishes loading select **Settings** from the menu directly at the top of the Cloud Shell and then select **Go to Classic version**.

## Download the sample app

In this section, you use the sandbox to download the sample app and set variables to make some of the commands easier to enter.

1. In the sandbox, create a directory and then navigate to it.

   ```sh
   mkdir htmlapp

   cd htmlapp
   ```

1. Run the following `git` command to clone the sample app repository to your htmlapp directory.

   ```sh
   git clone https://github.com/Azure-Samples/html-docs-hello-world.git
   ```

1. Set variables to hold the resource group and app names by running the following commands.

   ```sh
   resourceGroup=$(az group list --query "[].{id:name}" -o tsv)
   appName=az204app$RANDOM
   ```

## Create the web app

1. Change to the directory that contains the sample code and run the `az webapp up` command.

   ```sh
   cd html-docs-hello-world

   az webapp up -g $resourceGroup -n $appName --html
   ```

   This command might take a few minutes to run. While the command is running, it displays information similar to the following example.

   ```jsonc
   {
     "app_url": "https://<myAppName>.azurewebsites.net",
     "location": "westeurope",
     "name": "<app_name>",
     "os": "Windows",
     "resourcegroup": "<resource_group_name>",
     "serverfarm": "appsvc_asp_Windows_westeurope",
     "sku": "FREE",
     "src_path": "/home/<username>/demoHTML/html-docs-hello-world "
     // < JSON data removed for brevity. >
   }
   ```

1. Open a new tab in your browser and navigate to the app URL `(https://<myAppName>.azurewebsites.net`) and verify the app is running - take note of the title at the top of the page. Leave the browser open on the app for the next section.

   :information_source: You can copy `<myAppName>.azurewebsites.net` from the output of the previous command, or select the URL in the output to open the site in a new tab.

## Update and redeploy the app

1. In the Cloud Shell, type `code index.html` to open the editor. In the `<h1>` heading tag, change _Azure App Service - Sample Static HTML Site_ to _Azure App Service Updated_ - or to anything else that you'd like.

1. Use the commands **CTRL-S** to save and **CTRL-Q** to exit.

1. Redeploy the app with the same `az webapp up` command you used earlier.

   ```sh
   az webapp up -g $resourceGroup -n $appName --html
   ```

   :point_up: You can use the up arrow on your keyboard to scroll through previous commands.

1. After deployment is completed switch back to the browser from step 2 in the "Create the web app" section and refresh the page.
