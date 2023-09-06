# AZ CLI

## Prerequisites

```sh
# Upgrade the Azure CLI to the latest version
az upgrade
```

### Extensions

```sh
 az extension add --name <name> --upgrade
```

- `containerapp`
- `storage-preview`

### Providers

```sh
# Only needed on subscriptions that haven't previously used it (takes some time for changes to propagate)
az provider register --namespace <name>

# Check status
az provider show --namespace <name> --query "registrationState"
```

- `Microsoft.App` (App Services - hosting APIs)
- `Microsoft.EventGrid`
- `Microsoft.CDN`
- `Microsoft.OperationalInsights` (telemetry)
- `Microsoft.OperationsManagement`
