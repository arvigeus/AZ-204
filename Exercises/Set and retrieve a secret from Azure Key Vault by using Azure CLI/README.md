# Set and retrieve a secret from Azure Key Vault by using Azure CLI

In this exercise you learn how to perform the following actions by using the Azure CLI:

- Create a Key Vault
- Add and retrieve a secret

## Prerequisites

- An **Azure account** with an active subscription. If you don't already have one, you can sign up for a free trial at <https://azure.com/free>

## Sign in to Azure and start the Cloud Shell

1. Sign in to the [Azure portal](https://portal.azure.com/) and open the Cloud Shell.

   ![The location of Cloud Shell launch button.](https://learn.microsoft.com/en-us/training/wwl-azure/implement-azure-key-vault/media/cloud-shell-menu.png)

1. When the shell opens be sure to select the Bash environment.

   [Selecting the Bash environment.](https://learn.microsoft.com/en-us/training/wwl-azure/implement-azure-key-vault/media/shell-bash-selection.png)

## Create a Key Vault

1. Let's set some variables for the CLI commands to use to reduce the amount of retyping. Replace the `<myLocation>` variable string with a region that makes sense for you. The Key Vault name needs to be a globally unique name, and the following script generates a random string.

   ```sh
   myKeyVault=az204vault-$RANDOM
   myLocation=<myLocation>
   ```

1. Create a resource group.

   ```sh
   az group create --name az204-vault-rg --location $myLocation
   ```

1. Create a Key Vault by using the `az keyvault create` command.

   ```sh
   az keyvault create --name $myKeyVault --resource-group az204-vault-rg --location $myLocation
   ```

   :information_source: This can take a few minutes to run.

## Add and retrieve a secret

To add a secret to the vault, you just need to take a couple of extra steps.

1. Create a secret. Let's add a password that could be used by an app. The password is called **ExamplePassword** and will store the value of **hVFkk965BuUv** in it.

   ```sh
   az keyvault secret set --vault-name $myKeyVault --name "ExamplePassword" --value "hVFkk965BuUv"
   ```

1. Use the `az keyvault secret show` command to retrieve the secret.

   ```sh
   az keyvault secret show --name "ExamplePassword" --vault-name $myKeyVault
   ```

   This command returns some JSON. The last line contains the password in plain text.

   ```json
   "value": "hVFkk965BuUv"
   ```

You've created a Key Vault, stored a secret, and retrieved it.

## Clean up resources

If you no longer need the resources in this exercise use the following command to delete the resource group and associated Key Vault.

```sh
az group delete --name az204-vault-rg --no-wait
```
