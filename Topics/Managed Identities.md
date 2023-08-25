# [Azure Managed Identities](https://docs.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/)

Use managed identities if you want to build an app using Azure App Services that accesses another service without having to manage any credentials.

Managed identities are specific to the Azure cloud and _cannot be directly assigned to instances of any other cloud provider_, such as AWS, Google Cloud Platform (GCP), or any other third-party cloud services.

| Property                       | System-assigned managed identity                                                                                                                                       | User-assigned managed identity                                                                                                                                                                                                                                                                                                                                    |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Creation                       | Created as part of an Azure resource (for example, Azure Virtual Machines or Azure App Service).                                                                       | Created as a stand-alone Azure resource.                                                                                                                                                                                                                                                                                                                          |
| Life cycle                     | Shared life cycle with the Azure resource that the managed identity is created with.<br>When the parent resource is deleted, the managed identity is deleted as well.  | Independent life cycle.<br>Must be explicitly deleted.                                                                                                                                                                                                                                                                                                            |
| Sharing across Azure resources | Can’t be shared.<br>It can only be associated with a single Azure resource.                                                                                            | Can be shared.<br>The same user-assigned managed identity can be associated with more than one Azure resource.                                                                                                                                                                                                                                                    |
| Common use cases               | Workloads contained within a single Azure resource.<br>Workloads needing independent identities.<br>For example, an application that runs on a single virtual machine. | Workloads that run on multiple resources and can share a single identity.<br>Workloads needing pre-authorization to a secure resource, as part of a provisioning flow.<br>Workloads where resources are recycled frequently, but permissions should stay consistent.<br>For example, a workload where multiple virtual machines need to access the same resource. |

## [Role-based access control (Azure RBAC)](https://learn.microsoft.com/en-us/azure/role-based-access-control/role-assignments-portal#assign-a-user-as-an-administrator-of-a-subscription)

Azure RBAC is the authorization system you use to manage access to Azure resources. To assign Azure roles, you must have `Microsoft.Authorization/roleAssignments/write` permissions, such as `User Access Administrator` or `Owner`.

## Using Managed Identity with an Azure Virtual Machine

User-assigned identities need to be created first before they can be assigned to a VM. System-assigned identities are automatically created when the VM is set up.

- ARM receives a request to enable the system-assigned managed identity or to create a user-assigned managed identity on a virtual machine.
- A service principal is created in the Azure Active Directory tenant that's trusted by the subscription.
- System-assigned configures the identity directly on the virtual machine, while user-assigned requires a request to configure the identity, both updating the Azure Instance Metadata Service with the respective service principal details.
- The managed identity uses the service principal information to grant access to Azure resources. RBAC in Azure AD is used to assign the appropriate role to the service principal. For Key Vault access, the code is granted access to the specific secret or key.
- Request a Token from the Azure Instance Metadata Service Endpoint, accessible only from within the virtual machine: `http://169.254.169.254/metadata/identity/oauth2/token`.
- Request an Access Token from Azure Active Directory using the client ID and certificate configured earlier. Azure Active Directory returns a JSON Web Token (JWT) access token.
- Send the Access Token to a Service Supporting Azure Active Directory Authentication

A _security principal_ in Azure RBAC is an object that represents a user, group, service principal, or managed identity that is requesting access to Azure resources.

## Managing Azure Managed Identities

1. **System-assigned Identity**

```sh
# Creating a resource (like a VM or any other service that supports it) with a system-assigned identity
az <service> create --resource-group myGroup --name myResource --assign-identity '[system]'

# Assigning a system-assigned identity to an existing resource
az <service> identity assign --resource-group myGroup --name myResource --identities '[system]'
```

1. **User-assigned Identity**

User-assigned identities are standalone Azure resources that can be assigned to one or more instances of an Azure service.

```sh
# First, create the identity
az identity create --resource-group myGroup --name myIdentity

# Creating a resource (like a VM or any other service that supports it) with a user-assigned identity
az <service> create --resource-group myGroup --name myResource --assign-identity '/subscriptions/<SubId>/resourcegroups/myGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myIdentity'

# Assigning a user-assigned identity to an existing resource
az <service> identity assign --resource-group myGroup --name myResource --identities '/subscriptions/<SubId>/resourcegroups/myGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myIdentity'
```

Both system-assigned and user-assigned managed identities can be assigned specific Azure roles, allowing them to perform certain actions on specific Azure resources. These roles are part of Azure's Role-Based Access Control ([RBAC](https://docs.microsoft.com/en-us/azure/role-based-access-control/overview)) system, which provides fine-grained access management to Azure resources.

```sh
az role assignment create --assignee <PrincipalId> --role <RoleName> --scope <Scope>
```

[Roles](<(https://docs.microsoft.com/en-us/azure/role-based-access-control/role-definitions)>) can be high-level, like owner, or specific, like virtual machine reader.

- **Owner**: Grants full access to manage all resources, including the ability to assign roles in Azure RBAC.
- **Contributor**: Grants full access to manage all resources, but does not allow you to assign roles in Azure RBAC, manage assignments in Azure Blueprints, or share image galleries.
- **Reader**: Allows you to view all resources, but does not allow you to make any changes.
- **User Access Administrator**: Lets you manage user access to Azure resources.

Roles can be assigned at different [scopes](https://docs.microsoft.com/en-us/azure/role-based-access-control/scope-overview), which could be a management group, a subscription, a resource group, or a single resource. Scope is the set of resources that the access applies to. When you assign a role, you can further limit the actions allowed by defining a scope. This is helpful if you want to make someone a Website Contributor, but only for one resource group. The scope at which the role is assigned determines what resources the user, group, or application has access to.

- **Management Group Scope**: This is the highest level of scope. When you assign a role at this level, the access is applied to all the subscriptions and resources under that management group. It's useful for providing access across many subscriptions.
- **Subscription Scope**: When you assign a role at the subscription level, the access is applied to all resource groups and resources within that subscription. It's useful when you want to provide access across all resources in a single subscription.
- **Resource Group Scope**: When you assign a role at the resource group level, the access is applied to all resources within that resource group. It's useful when you want to provide access to a specific group of resources organized within the same resource group.
- **Resource Scope**: This is the lowest level of scope. When you assign a role at this level, the access is applied only to that specific resource. It's useful when you want to limit access to a single resource, like a virtual machine, storage account, or database.

[Deny assignments](https://docs.microsoft.com/en-us/azure/role-based-access-control/deny-assignments) block users from performing specified actions even if a role assignment grants them access. **Deny assignments take precedence over role assignments**.

Hierarchy for managing a resource (from least to highest permission levels):

- User with access policy to resource
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
