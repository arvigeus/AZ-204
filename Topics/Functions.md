# [Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/)

## [Introduction](https://learn.microsoft.com/en-us/azure/azure-functions/functions-overview)

Azure Functions is a service that allows you to run code without worrying about servers. It works by triggering your code when certain events happen and makes it easier to handle input and output data.

## [Azure Functions vs Azure Logic Apps vs WebJobs](https://docs.microsoft.com/en-us/azure/azure-functions/functions-compare-logic-apps-ms-flow-webjobs)

| Feature          | Azure Functions                                                                        | Azure Logic Apps                                                         | Azure WebJobs                                                                                                      |
| ---------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| Development      | Code-first approach                                                                    | Designer-first approach                                                  | Code-first approach                                                                                                |
| Monitoring       | Azure Application Insights                                                             | Azure portal and Azure Monitor logs                                      | Application Insights                                                                                               |
| Execution        | Can run in Azure or locally                                                            | Can run in Azure, locally, or on premises                                | Runs in the context of an App Service web app                                                                      |
| Pricing          | Pay-per-use                                                                            | Based on execution and connector usage                                   | Part of the App Service plan                                                                                       |
| Unique Strengths | Flexibility and cost-effectiveness, many supported languages, built on the WebJobs SDK | Extensive integration capabilities with a large collection of connectors | Ideal for tasks related to an existing App Service app and need more control over the code that listens for events |

## [Hosting Options](https://learn.microsoft.com/en-us/azure/azure-functions/functions-scale)

The hosting plan you choose determines the following behaviors:

- How your function app is scaled based on demand and how instances allocation is managed.
- The resources available to each function app instance.
  Support for advanced functionality, such as Azure Virtual Network connectivity.

Limitations:

- Direct migration to a Dedicated (App Service) plan isn't currently supported
- Migration isn't supported on Linux.

| Hosting Plan                                                                                               | Unique Features                                                                                                                                                                               | Limitations                                                                                                                                                                                                                                                                                                                                                                                                  |
| ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [**Consumption**](https://learn.microsoft.com/en-us/azure/azure-functions/consumption-plan)                | - Default hosting plan.<br>- Pay only when your functions are running.<br>- Scales automatically (instances: 100 Linux, 200 Windows), even during periods of high load.                       | - Does not support Docker containers.<br>- Maximum timeout duration is 10 minutes (unlimited for others).<br>- Does not support inbound private endpoints, virtual network integration, virtual network triggers, and hybrid connections.<br>- Apps may scale to zero when idle (_cold startup_).<br>-Limited to 1.5 GB memory and one CPU per function app.<br>- Shared resources and simultaneous scaling. |
| [**Premium**](https://learn.microsoft.com/en-us/azure/azure-functions/functions-premium-plan)              | - Automatically scales based on demand using pre-warmed workers, which run applications with no delay after being idle.<br>- Runs on more powerful instances.                                 | - At least one instance per plan must always be kept warm.                                                                                                                                                                                                                                                                                                                                                   |
| [**Dedicated**](https://learn.microsoft.com/en-us/azure/azure-functions/dedicated-plan)                    | - Run your functions within an App Service plan at regular App Service plan rates.<br>- Best for long-running scenarios where Durable Functions can't be used.                                | - Manual/autoscale (10-20 instances).<br>- You pay the same as you would for other App Service resources, like web apps.                                                                                                                                                                                                                                                                                     |
| [**ASE (App Service Environment)**](https://learn.microsoft.com/en-us/azure/app-service/environment/intro) | - Provides a fully isolated and dedicated environment for securely running App Service apps at high scale.                                                                                    | - There's a flat monthly rate for an ASE that pays for the infrastructure and doesn't change with the size of the ASE. There's also a cost per App Service plan vCPU.                                                                                                                                                                                                                                        |
| [**Kubernetes**](https://learn.microsoft.com/en-us/azure/azure-functions/functions-kubernetes-keda)        | - Provides a fully isolated and dedicated environment running on top of the Kubernetes platform.<br>- You pay only the costs of your Kubernetes cluster; no additional billing for Functions. | - Depends on the configuration of the Kubernetes cluster.                                                                                                                                                                                                                                                                                                                                                    |

```ps
az functionapp plan create
    --name
    --resource-group
    --sku # F1(Free), D1(Shared), B1(Basic Small), B2(Basic Medium), B3(Basic Large), S1(Standard Small), P1V2(Premium V2 Small), I1 (Isolated Small), I2 (Isolated Medium), I3 (Isolated Large), K1 (Kubernetes)
    [--is-linux {false, true}]
    [--location]
    [--max-burst]
    [--min-instances]
    [--tags]
    [--zone-redundant] # Cannot be changed after plan creation. Minimum instance count is 3.
# az functionapp plan create -g MyResourceGroup -n MyPlan --min-instances 1 --max-burst 10 --sku EP1

az functionapp plan update
    [--add]
    [--force-string]
    [--ids]
    [--max-burst]
    [--min-instances]
    [--name]
    [--remove]
    [--resource-group]
    [--set]
    [--sku]
    [--subscription]
# az functionapp plan update -g MyResourceGroup -n MyPlan --max-burst 20 --sku EP2

# Get a list of all Consumption plans in your resource group
az functionapp plan list --resource-group <MY_RESOURCE_GROUP> --query "[?sku.family=='Y'].{PlanName:name,Sites:numberOfSites}" -o table

# Get your hosting plan type
appServicePlanId=$(az functionapp show --name $functionApp --resource-group $resourceGroup --query appServicePlanId --output tsv)
az appservice plan list --query "[?id=='$appServicePlanId'].sku.tier" --output tsv

# Get a list of all Premium plans in your resource group
az functionapp plan list --resource-group <MY_RESOURCE_GROUP> --query "[?sku.family=='EP'].{PlanName:name,Sites:numberOfSites}" -o table

```

## [Storage Considerations](https://learn.microsoft.com/en-us/azure/azure-functions/storage-considerations?tabs=azure-cli)

- Function code and configuration files are stored in Azure Files in the linked storage account. Deleting this account will result in the loss of these files.
- Azure Functions requires an Azure Storage account for services like Azure Blob Storage, Azure Files, Azure Queue Storage, and Azure Table Storage.
- Storage accounts used by function apps must support Blob, Queue, and Table storage.
- The storage account should be in the same region as the function app for performance optimization.
- Each function app should use a separate storage account for best performance.
- Azure Storage encrypts all data in a storage account at rest.
- Functions use a host ID value to uniquely identify a function app in stored artifacts. Host ID collisions can occur and should be avoided.

## [Configuration](https://learn.microsoft.com/en-us/azure/azure-functions/functions-how-to-use-azure-function-app-settings)

### [host.json](https://learn.microsoft.com/en-us/azure/azure-functions/functions-host-json)

- `functionTimeout`: Default: 5 min for Consumption, 30 for rest.

### [function.json](https://github.com/Azure/azure-functions-host/wiki/function.json)

Auto generated for compiled languages.

```jsonc
{
  "disabled": false,
  "bindings": [
    // ... bindings here
    {
      "type": "bindingType", // ex: queueTrigger
      "direction": "in", // out, inout
      "name": "myParamName"
      // ... more depending on binding
    }
  ]
}
```

### Configuration via CLI

Setting properties: `az resource update --resource-type Microsoft.Web/sites -g <RESOURCE_GROUP> -n <FUNCTION_APP-NAME>/config/web --set properties.XXX`, where `XXX` is the name of the property.

- `functionAppScaleLimit`: 0 or null for unrestricted, or a valid value between 1 and the app maximum.

### [local.settings.json](https://learn.microsoft.com/en-us/azure/azure-functions/functions-develop-local) (code and test locally)

```ts
type LocalSettings = {
  // When true, all values are encrypted with a local machine key.
  IsEncrypted: boolean; // false

  // Correspond to application settings in your function app in Azure.
  Values: {
    [key: string]: string;
  };

  // Customize the Functions host process
  Host: {
    LocalHttpPort: number;

    CORS: string; // supports wildcard value (*)

    // When set to true, allows withCredentials requests
    CORSCredentials: boolean;
  };

  // Used by frameworks that get connection strings from the ConnectionStrings section of a config file
   */
  ConnectionStrings: {
    [key: string]: string;
  };
};
```

## [Triggers and Bindings](https://learn.microsoft.com/en-us/azure/azure-functions/functions-triggers-bindings?tabs=csharp)

Triggers cause a function to run. A trigger defines how a function is invoked and a function must have exactly one trigger. Binding to a function is a way of declaratively connecting another resource to the function; bindings may be connected as _input bindings_, _output bindings_, or both.

## Working with Azure Functions

```ps
# List the existing application settings
az functionapp config appsettings list --name <FUNCTION_APP_NAME> --resource-group <RESOURCE_GROUP_NAME>

# Add or update an application setting
az functionapp config appsettings set --settings CUSTOM_FUNCTION_APP_SETTING=12345 --name <FUNCTION_APP_NAME> --resource-group <RESOURCE_GROUP_NAME>

# Create a new function app (Consumption)
az functionapp create --resource-group <MY_RESOURCE_GROUP> --name <NEW_CONSUMPTION_APP_NAME> --consumption-plan-location <REGION> --runtime dotnet --functions-version 3 --storage-account <STORAGE_NAME>

# Get the default (host) key that can be used to access any HTTP triggered function in the function app
subName='<SUBSCRIPTION_ID>'
resGroup=AzureFunctionsContainers-rg
appName=glengagtestdocker
path=/subscriptions/$subName/resourceGroups/$resGroup/providers/Microsoft.Web/sites/$appName/host/default/listKeys?api-version=2018-11-01
az rest --method POST --uri $path --query functionKeys.default --output tsv
```

## [Security](https://learn.microsoft.com/en-us/azure/azure-functions/security-concepts)

TODO

```ps
# Add a domain to the allowed origins list
az functionapp cors add --allowed-origins https://contoso.com --name <FUNCTION_APP_NAME> --resource-group <RESOURCE_GROUP_NAME>

# List the current allowed origins
az functionapp cors show
```

## [Monitoring](https://learn.microsoft.com/en-us/azure/azure-functions/functions-monitoring)

TODO

## CLI

- [az functionapp plan create](https://learn.microsoft.com/en-us/cli/azure/functionapp/plan?view=azure-cli-latest#az-functionapp-plan-create)
- [az functionapp plan update](https://learn.microsoft.com/en-us/cli/azure/functionapp/plan?view=azure-cli-latest#az-functionapp-plan-update)
