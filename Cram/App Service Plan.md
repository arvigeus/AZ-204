# App Service Plan

Requires: [Resource Group](./Resource%20Group.md)

API: [az appservice plan create](https://learn.microsoft.com/en-us/cli/azure/appservice/plan?view=azure-cli-latest#az-appservice-plan-create) | [New-AzAppServicePlan](https://learn.microsoft.com/en-us/powershell/module/az.websites/new-azappserviceplan)

```sh
az appservice plan create
    --name
    --resource-group
    [--app-service-environment]
    [--is-linux]
    [--location]
    [--number-of-workers]
    [--per-site-scaling]
    [--sku {B1, B2, B3, D1, F1, FREE, I1, I1v2, I2, I2v2, I3, I3v2, I4v2, I5v2, I6v2, P0V3, P1MV3, P1V2, P1V3, P2MV3, P2V2, P2V3, P3MV3, P3V2, P3V3, P4MV3, P5MV3, S1, S2, S3, SHARED, WS1, WS2, WS3}]
    [--zone-redundant]
```
