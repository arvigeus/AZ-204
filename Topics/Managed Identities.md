# [Azure Managed Identities](https://docs.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/)

Use managed identities if you want to build an app using Azure App Services that accesses another service without having to manage any credentials.

| Property                       | System-assigned managed identity                                                                                                                                       | User-assigned managed identity                                                                                                                                                                                                                                                                                                                                    |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Creation                       | Created as part of an Azure resource (for example, Azure Virtual Machines or Azure App Service).                                                                       | Created as a stand-alone Azure resource.                                                                                                                                                                                                                                                                                                                          |
| Life cycle                     | Shared life cycle with the Azure resource that the managed identity is created with.<br>When the parent resource is deleted, the managed identity is deleted as well.  | Independent life cycle.<br>Must be explicitly deleted.                                                                                                                                                                                                                                                                                                            |
| Sharing across Azure resources | Can’t be shared.<br>It can only be associated with a single Azure resource.                                                                                            | Can be shared.<br>The same user-assigned managed identity can be associated with more than one Azure resource.                                                                                                                                                                                                                                                    |
| Common use cases               | Workloads contained within a single Azure resource.<br>Workloads needing independent identities.<br>For example, an application that runs on a single virtual machine. | Workloads that run on multiple resources and can share a single identity.<br>Workloads needing pre-authorization to a secure resource, as part of a provisioning flow.<br>Workloads where resources are recycled frequently, but permissions should stay consistent.<br>For example, a workload where multiple virtual machines need to access the same resource. |

## Using Managed Identity with an Azure Virtual Machine

User-assigned identities need to be created first before they can be assigned to a VM. System-assigned identities are automatically created when the VM is set up.

1. Azure activates a managed identity for a virtual machine. This could be either system-assigned (automatically created with the VM) or user-assigned (created separately).

1. This identity is given its own "service principal" in Azure Active Directory, which is like its unique ID.

1. Azure updates the VM with the identity's details. If the identity is user-assigned, we can also do this after step 4.

1. The identity is given the needed permissions to access various Azure resources.

1. Code running on the VM can then ask for a "token" from a specific endpoint, proving the identity.

1. Azure Active Directory verifies the request and sends back a token.

1. This token can be used by the code to access other Azure services.

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

- **Contributor**: Grants full access to manage all resources, but does not allow you to assign roles in Azure RBAC, manage assignments in Azure Blueprints, or share image galleries.
- **Owner**: Grants full access to manage all resources, including the ability to assign roles in Azure RBAC.
- **Reader**: Allows you to view all resources, but does not allow you to make any changes.
- **User Access Administrator**: Lets you manage user access to Azure resources.

## Acquiring an Access Token with Azure Managed Identities

**DefaultAzureCredential**: This class attempts multiple methods of authentication based on the available environment or sign-in details, stopping once it's successful. It checks the following sources in order:

1. Environment variables. (`AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`, `AZURE_CLIENT_CERTIFICATE_PATH`)
1. Managed Identity if the application is deployed on an Azure host with this feature enabled.
1. Visual Studio if the developer has authenticated through it.
1. Azure CLI if the developer has authenticated through `az login` command.
1. Azure PowerShell if the developer has authenticated via the `Connect-AzAccount` command.
1. Interactive browser, though this option is disabled by default.

Authenticate a user-assigned identity: `new DefaultAzureCredential(new DefaultAzureCredentialOptions { ManagedIdentityClientId = userAssignedClientId })`

**ChainedTokenCredential**: Enables users to combine multiple credential instances to define a customized chain of credentials.

```csharp
// authenticate using managed identity, and fall back to authenticating via the Azure CLI if managed identity is unavailable in the current environment
var credential = new ChainedTokenCredential(new ManagedIdentityCredential(), new AzureCliCredential());
```
