# az group

:information_source: `--name` is equivalent of `--resource-group`. `-g`, `-n``.

```sh
az group create
    --location # Values from: az `account list-locations`
    --name
    [--managed-by] # The ID of the resource that manages this resource group.
    [--tags] # Space-separated tags: key[=value] [key[=value] ...]. Use "" to clear existing tags.
```

```sh
az group delete
    --name
    [--force-deletion-types {Microsoft.Compute/virtualMachineScaleSets, Microsoft.Compute/virtualMachines}] # The resource types you want to force delete.
    [--no-wait]
    [--yes]
```

```sh
az group exists
    --name
```

```sh
# Captures a resource group as a template.
az group export
    --name
    [--include-comments] # default value: False
    [--include-parameter-default-value] # default value: False
    [--resource-ids] # To export all resources, do not specify this argument or supply "*"
    [--skip-all-params] # default value: False
    [--skip-resource-name-params] # default value: False
```

```sh
az group list
    [--tag]

az group list --query "[?location=='westus']"
```

```sh
az group show
    --name
```

```sh
az group update
    --name
    [--force-string] # When using 'set' or 'add', preserve string literals instead of attempting to convert to JSON. default value: False
    [--set] # Update an object by specifying a property path and value to set. Example: --set property1.property2=. default value: []
    [--tags] # Space-separated tags: key[=value] [key[=value] ...]. Use "" to clear existing tags.
```

```sh
az group wait
    --name
    [--created] # Wait until created with 'provisioningState' at 'Succeeded'. default value: False
    [--custom] # Wait until the condition satisfies a custom JMESPath query. E.g. provisioningState!='InProgress', instanceView.statuses[?code=='PowerState/running'].
    [--deleted] # default value: False
    [--exists] # default value: False
    [--interval] # Polling interval in seconds. default value: 30
    [--timeout] # Maximum wait in seconds. default value: 3600
    [--updated] # Wait until updated with provisioningState at 'Succeeded'. default value: False
```

## Global parameters

- `--output -o` Output format
- `--query` [JMESPath](http://jmespath.org/) query string. Example: `locations[?state == 'WA'].name | sort(@) | {WashingtonCities: join(', ', @)}`
- `--subscription` Name or ID of subscription.
