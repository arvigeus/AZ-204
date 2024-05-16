# [Azure Managed Identities](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/)

Enable Azure App Services-based apps to access other services without handling credentials. These identities are _Azure-exclusive_ and _can't be used with other cloud providers_ like AWS or GCP.

**Mandatory**: In Azure Portal, navigate to `Settings > Access policies > Add Access Policy` to allow your app access. Select permissions and identity name and type. Policy removal may take 24hrs due to caching.

| Property                       | System-assigned managed identity                                                                                                                                       | User-assigned managed identity                                                                                                                                                                                                                                                                                                                                    |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Creation                       | Created as part of an Azure resource (for example, Azure Virtual Machines or Azure App Service).                                                                       | Created as a stand-alone Azure resource.                                                                                                                                                                                                                                                                                                                          |
| Life cycle                     | Shared life cycle with the Azure resource.<br>Deleted when the parent resource is deleted.<br>Cannot be explicitly deleted.                                            | Independent life cycle.<br>Must be explicitly deleted.                                                                                                                                                                                                                                                                                                            |
| Sharing across Azure resources | Can’t be shared.<br>It can only be associated with a single Azure resource.                                                                                            | Can be shared.<br>The same user-assigned managed identity can be associated (shared) with more than one Azure resource.                                                                                                                                                                                                                                           |
| Common use cases               | Workloads contained within a single Azure resource.<br>Workloads needing independent identities.<br>For example, an application that runs on a single virtual machine. | Workloads that run on multiple resources and can share a single identity.<br>Workloads needing pre-authorization to a secure resource, as part of a provisioning flow.<br>Workloads where resources are recycled frequently, but permissions should stay consistent.<br>For example, a workload where multiple virtual machines need to access the same resource. |

**If you have multi-tenant setup, use Application Service Principal!**

## [Role-based access control (Azure RBAC)](https://learn.microsoft.com/en-us/azure/role-based-access-control/role-assignments-portal#assign-a-user-as-an-administrator-of-a-subscription)

Manage access to Azure resources. To assign Azure roles, you must have `Microsoft.Authorization/roleAssignments/write` permissions, such as `User Access Administrator` or `Owner`.

Read access to all resources: `*/read`.

The inheritance order for scope is Management group, Subscription, Resource group, Resource. When assigning access, follow the rule of least previlege. Note: Double check if you are granting permissions for resource or resource group!

## Using Managed Identity with a Virtual Machine

1. **Initiate Managed Identity**: Request to enable (sistem assigned) or create (user assigned) managed identity via ARM.
1. **Create Service Principal**: ARM sets a service principal in the trusted Entra ID tenant for the managed identity.
1. **Configure Identity**: ARM updates [IMDS](https://learn.microsoft.com/en-us/azure/virtual-machines/instance-metadata-service) (VM Specific) with the service principal client ID and certificate.
1. **Assign Roles & Access**: Use service principal information to grant access to Azure resources via RBAC.
1. **Request Token**: Code on Azure resource asks for a token from IMDS: `http://169.254.169.254/metadata/identity/oauth2/token`
1. **Retrieve Token**: By using the configured client ID and certificate, Entra ID returns a JWT access token upon request.
1. **Use Token**: Code uses the token to authenticate with Entra ID-supported services.

## Managing Identities

1. **System-assigned Identity**

   ```sh
   # Creating a resource (like a VM or any other service that supports it) with a system-assigned identity
   az <service> create --resource-group $resourceGroup --name myResource --assign-identity '[system]'

   # Assigning a system-assigned identity to an existing resource
   az <service> identity assign --resource-group $resourceGroup --name myResource --identities '[system]'
   ```

1. **User-assigned Identity**

   ```sh
   # First, create the identity
   az identity create --resource-group $resourceGroup --name identityName

   # Creating a resource (like a VM or any other service that supports it) with a user-assigned identity
   az <service> create --assign-identity $identityName --resource-group $resourceGroup --name $resourceName
   #az <service> create --assign-identity '/subscriptions/<SubId>/resourcegroups/$resourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myIdentity' --resource-group $resourceGroup --name $resourceName

   # Assigning a user-assigned identity to an existing resource
   az <service> identity assign --identities $identityName --resource-group $resourceGroup --name $resourceName
   # az <service> identity assign --identities '/subscriptions/<SubId>/resourcegroups/$resourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myIdentity' --resource-group $resourceGroup --name $resourceName
   ```

Both system-assigned and user-assigned managed identities can be assigned specific Azure roles, allowing them to perform certain actions on specific Azure resources. These roles are part of Azure's Role-Based Access Control ([RBAC](https://docs.microsoft.com/en-us/azure/role-based-access-control/overview)) system, which provides fine-grained access management to Azure resources.

```sh
az role assignment create --assignee <PrincipalId> --role <RoleName> --scope <Scope>
```

## Azure Access Control

- [**Roles**](https://docs.microsoft.com/en-us/azure/role-based-access-control/role-definitions): Define what actions you can perform.
  - **Owner**: Full access, including role assignment.
  - **Contributor**: Full access, no role assignment.
  - **Reader**: View-only.
  - **User Access Administrator**: Manages user access to resources.
- [**Scopes**](https://docs.microsoft.com/en-us/azure/role-based-access-control/scope-overview): Define where actions apply.
  - **Management Group**: All subscriptions and resources.
  - **Subscription**: All resources in subscription.
  - **Resource Group**: All resources in group.
  - **Resource**: Specific resource only.

[Deny assignments](https://docs.microsoft.com/en-us/azure/role-based-access-control/deny-assignments) **override role assignments** to block specific actions.

### Hierarchy for managing a resource (from least to highest permission levels)

- No role: Users or managed identities are granted only permissions they need, like read or write, without using a predefined role.
- Resource `Reader`
- Resource `Contributor`
- Resource `Owner`
- Resource `Administrator`
- Global Administrator

## Acquiring an Access Token with Azure Managed Identities

**DefaultAzureCredential**: This class attempts multiple methods of authentication based on the available environment or sign-in details, stopping once it's successful. It checks the following sources in order:

1. Environment variables ([`EnvironmentCredential`](https://learn.microsoft.com/en-us/dotnet/api/azure.identity.environmentcredential?view=azure-dotnet)) - `AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, in addition to:
   - Service principle with secret ([`ClientSecretCredential`](https://learn.microsoft.com/en-us/dotnet/api/azure.identity.clientsecretcredential?view=azure-dotnet)): `AZURE_CLIENT_SECRET`
   - Service principal with certificate ([`ClientCertificateCredential`](https://learn.microsoft.com/en-us/dotnet/api/azure.identity.clientcertificatecredential?view=azure-dotnet)): `AZURE_CLIENT_SECRET`, `AZURE_CLIENT_CERTIFICATE_PATH`, `AZURE_CLIENT_CERTIFICATE_PASSWORD`, `AZURE_CLIENT_SEND_CERTIFICATE_CHAIN`
   - Username and password ([`UsernamePasswordCredential`](https://learn.microsoft.com/en-us/dotnet/api/azure.identity.usernamepasswordcredential?view=azure-dotnet)): `AZURE_USERNAME`, `AZURE_PASSWORD`
1. Managed Identity if the application is deployed on an Azure host with this feature enabled.

   ```cs
   new ManagedIdentityCredential(); // system-assigned
   new ManagedIdentityCredential(clientId: userAssignedClientId); // user-assigned
   new DefaultAzureCredential(new DefaultAzureCredentialOptions { ManagedIdentityClientId = userAssignedClientId }); // user-assigned
   ```

1. Visual Studio if the developer has authenticated through it.
1. Azure CLI (`AzureCliCredential`) if the developer has authenticated through `az login` command.
1. Azure PowerShell if the developer has authenticated via the `Connect-AzAccount` command.
1. Interactive browser, though this option is disabled by default.

   ```cs
   new InteractiveBrowserCredential();
   new DefaultAzureCredential(includeInteractiveCredentials: true);
   ```

**ChainedTokenCredential**: Enables users to combine multiple credential instances to define a customized chain of credentials.

```csharp
// authenticate using managed identity, and fall back to authenticating via the Azure CLI if managed identity is unavailable in the current environment
var credential = new ChainedTokenCredential(new ManagedIdentityCredential(), new AzureCliCredential());
```

## [Logging](https://github.com/Azure/azure-sdk-for-net/blob/Azure.Identity_1.9.0/sdk/core/Azure.Core/samples/Diagnostics.md#logging)

```cs
// Ensure AzureEventSourceListener is in scope and active while using the client library for log collection.
// Create it as a top-level member of the class using the Event Hubs client.
using AzureEventSourceListener listener = AzureEventSourceListener.CreateConsoleLogger();

DefaultAzureCredentialOptions options = new DefaultAzureCredentialOptions
{
    Diagnostics =
    {
        LoggedHeaderNames = { "x-ms-request-id" },
        LoggedQueryParameters = { "api-version" },
        IsAccountIdentifierLoggingEnabled = true, // enable logging of sensitive information
        IsLoggingContentEnabled = true // log details about the account that was used to attempt authentication and authorization
    }
};
```

Exceptions: Service client methods raise `AuthenticationFailedException` for token issues.

## [Token caching](https://github.com/Azure/azure-sdk-for-net/blob/Azure.Identity_1.9.0/sdk/identity/Azure.Identity/samples/TokenCache.md)

Tokens can be stored in _memory_ (default) or on _disk_ (opt-in). Use `TokenCachePersistenceOptions()` for default cache, specify a `Name` for isolated cache, and `UnsafeAllowUnencryptedStorage` for unencrypted storage. Different credentials support different caching types - CLI: None, Default and Managed - only cache, rest: both.
