# Create a backend API

In this exercise you learn how to perform the following actions:

- Create an API Management (APIM) instance
- Import an API
- Configure the backend settings
- Test the API

## Prerequisites

- An **Azure account** with an active subscription. If you don't already have one, you can sign up for a free trial at <https://azure.com/free>.

## Sign in to Azure

1. Sign in to the Azure portal and open the Cloud Shell.

   ![The location of Cloud Shell launch button.](https://learn.microsoft.com/en-us/training/wwl-azure/explore-api-management/media/cloud-shell-menu.png)

1. After the shell opens, be sure to select the **Bash** environment.

   ![Selecting the Bash environment.](https://learn.microsoft.com/en-us/training/wwl-azure/explore-api-management/media/shell-bash-selection.png)

## Create an API Management instance

1. Let's set some variables for the CLI commands to use to reduce the amount of retyping. Replace `<myLocation>` with a region that makes sense for you. The APIM name needs to be a globally unique name, and the following script generates a random string. Replace `<myEmail>` with an email address you can access.

   ```sh
   myApiName=az204-apim-$RANDOM
   myLocation=<myLocation>
   myEmail=<myEmail>

   ```

1. Create a resource group. The following commands create a resource group named az204-apim-rg.

   ```sh
   az group create --name az204-apim-rg --location $myLocation
   ```

1. Create an APIM instance. The `az apim create` command is used to create the instance. The `--sku-name Consumption` option is used to speed up the process for the walkthrough.

   ```sh
   az apim create -n $myApiName \
       --location $myLocation \
       --publisher-email $myEmail  \
       --resource-group az204-apim-rg \
       --publisher-name AZ204-APIM-Exercise \
       --sku-name Consumption
   ```

   :information_source: The operation should complete in about five minutes.

## Import a backend API

This section shows how to import and publish an OpenAPI specification backend API.

1. In the Azure portal, search for and select **API Management services**.

1. On the **API Management** screen, select the API Management instance you created.

1. In the **API management service** navigation pane, under **APIs**, select **APIs**.

   ![Select APIs in the service navigation pane.](https://learn.microsoft.com/en-us/training/wwl-azure/explore-api-management/media/select-apis-navigation-pane.png)

1. Select **OpenAPI** from the list and select Full in the pop-up.

   ![The OpenAPI dialog box. Fields are detailed in the following table.](https://learn.microsoft.com/en-us/training/wwl-azure/explore-api-management/media/create-api.png)

   Use the values from the following table to fill out the form. You can leave any fields not mentioned their default value.

   | Setting               | Value                                      | Description                                                                                                                                                                         |
   | --------------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | OpenAPI Specification | `https://bigconference.azurewebsites.net/` | References the service implementing the API, requests are forwarded to this address. Most of the necessary information in the form is automatically populated after you enter this. |
   | Display name          | _Big Conference API_                       | This name is displayed in the Developer portal.                                                                                                                                     |
   | Name                  | _big-conference-api_                       | Provides a unique name for the API.                                                                                                                                                 |
   | Description           | Automatically populated                    | Provide an optional description of the API.                                                                                                                                         |

## Configure the API settings

The _Big Conference API_ is created. Configure the API settings.

1. Select **Settings** in the blade to the right.

1. Confirm that `https://bigconference.azurewebsites.net/` is in the **Web service URL** field.

1. Deselect the **Subscription required** checkbox.

   ![Specify the backend URL for the API.](https://learn.microsoft.com/en-us/training/wwl-azure/explore-api-management/media/api-settings-backend.png)

1. Select **Save**.

## Test the API

Now that the API has been imported and configured it's time to test the API.

1. Select **Test**.

   ![Select test in the right pane.](https://learn.microsoft.com/en-us/training/wwl-azure/explore-api-management/media/select-test.png)

1. Select **Speakers_Get**. The page shows **Query parameters** and **Headers**, if any.

1. Select **Send**.

   Backend responds with **200 OK** and some data.

## Clean up Azure resources

When you're finished with the resources you created in this exercise you can use the following command to delete the resource group and all related resources.

```sh
az group delete --name az204-apim-rg
```
