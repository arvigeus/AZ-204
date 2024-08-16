# Managed Identities

Question: Which of the following managed identity characteristics is indicative of user-assigned identities?

- [ ] Shared lifecycle with an Azure resource
- [x] Independent life-cycle
- [ ] Can only be associated with a single Azure resource

Answer: User-assigned identities exist independently from the resources they're associated with and must be explicitly deleted.  
The same user-assigned managed identity can be associated with more than one Azure resource.

---

Question: Which of the following managed entity types does not require explicit enabling to work?

- [ ] System-assigned identity
- [ ] User-assigned identity
- [ ] Both of these
- [x] None of these

Answer: Both System-assigned and User-assigned managed identities require explicit enabling.

---

Question: A client app requests managed identities for an access token for a given resource. Which of the below is the basis for the token?

- [ ] Oauth 2.0
- [x] Service principal
- [ ] Virtual machine

Answer: The token is based on the managed identities for Azure resources service principal.  
Oauth 2.0 is a protocol that can be used to acquire a token, but isn't the basis for the token.

---

Question: You are the administrator of an Azure SQL database that is set up to allow Entra ID-based access. You want your developers to connect to this database using Microsoft SQL Server Management Studio (SSMS) using their on-premises Entra ID credentials without frequent (minimizing) login prompts. Which approach should you adopt?

- [ ] Entra ID B2C.
- [ ] Azure Conditional Access.
- [x] Entra ID integrated authentication.
- [ ] Entra ID guest user access.
- [ ] Entra ID token.

Answer: Entra ID integrated authentication allows seamless authentication using on-premises Emtra ID credentials.  
Entra ID B2C is designed for customer identity access, not for on-premises Emtra ID integration.  
Azure Conditional Access sets access policies but doesn't ensure seamless on-premises Emtra ID authentication.  
Entra ID guest user access allows external users to access company resources, not related to on-premises Emtra ID authentication.  
Entra ID token can be used for Azure SQL Database, they would not necessarily reduce the number of authentication prompts.

---

Question: You are managing an Azure subscription and want to delegate the management of virtual machines to a user, but you don't want to give them access to other resources. Which role should you assign to the user?

- [ ] Owner
- [ ] Contributor
- [x] Virtual Machine Contributor
- [ ] Reader

Answer: The Virtual Machine Contributor role allows a user to create and manage virtual machines, but not the virtual network or storage account they're connected to. The Owner and Contributor roles would give the user access to all resources, not just virtual machines. The Reader role would only allow the user to view resources, not manage them.

---

Question: You have assigned a user the Reader role at the subscription scope. Later, you decide to assign the same user the Contributor role at a resource group scope within that subscription. However, you want to limit their Contributor access to only certain resources within the resource group. What should you do?

- [x] Assign the Contributor role at the resource scope for the specific resources.
- [ ] Remove the Reader role at the subscription scope.
- [ ] Assign the Contributor role at the subscription scope.
- [ ] Assign the Reader role at the resource scope for the specific resources.

Answer: Assigning the Contributor role at the resource scope for the specific resources would limit the user's Contributor access to those resources. The other options would either broaden the user's access or limit their access too much.

---

Question: What is the effect of assigning the Reader role at the subscription scope to a user who already has the Contributor role at a resource group scope within that subscription?

- [x] The user will have Contributor access to the resource group and Reader access to the rest of the subscription.
- [ ] The user will have Reader access to the entire subscription, including the resource group.
- [ ] The user will have Contributor access to the entire subscription.
- [ ] The user will have both Reader and Contributor access to the entire subscription.

Answer: Azure RBAC is an additive model, so a user's effective permissions are the sum of their role assignments. However, a more specific scope (like a resource group) takes precedence over a broader scope (like a subscription). So in this case, the user would have Contributor access to the resource group and Reader access to the rest of the subscription.

---

Question: What is a security principal in Azure RBAC?

- [ ] A collection of permissions
- [ ] The set of resources that the access applies to
- [x] An object that represents a user, group, service principal, or managed identity
- [ ] The process of attaching a role definition to a user, group, service principal, or managed identity

Answer: A security principal in Azure RBAC is an object that represents a user, group, service principal, or managed identity that is requesting access to Azure resources. It's not a collection of permissions (that's a role definition), it's not the set of resources that the access applies to (that's scope), and it's not the process of attaching a role definition to a user, group, service principal, or managed identity (that's a role assignment).

---

Question: You have assigned a user the Contributor role at the resource group scope. Later, you decide to assign a deny assignment at the subscription scope that blocks the user from deleting resources. However, you want to allow the user to delete resources within a specific resource group. What should you do?

- [ ] Assign the Contributor role at the subscription scope.
- [ ] Remove the deny assignment at the subscription scope.
- [ ] Assign the Owner role at the resource group scope.
- [ ] Allow delete operations for the resource group.
- [x] None of the listed.

Answer: Deny assignments in Azure RBAC take precedence over role assignments. Therefore, even if the user has the Contributor or Owner role at the resource group scope, the deny assignment at the subscription scope would still block them from deleting resources. The only way to allow the user to delete resources within the specific resource group would be to remove (not applicable per requirement) or change the scope of the deny assignment at the subscription scope (not listed). Allowing delete operations for the resource group would not override the deny assignment at the subscription scope.

---

Question: You have developed a web API hosted on Azure App Services. You are required to secure this web API using OAuth 2.0 and integrate it with your organization's Entra ID tenant. Which two actions should you take?

- [x] Register an application in Entra ID.
- [x] Configure an Azure API Management instance.
- [ ] Create an application proxy.
- [ ] Establish an Azure VPN Gateway.
- [ ] Implement Azure Traffic Manager.

Answer:

- **Register an application in Entra ID**: Essential for setting up OAuth 2.0 authentication.
- **Configure an Azure API Management instance**: Can validate OAuth tokens and manage APIs.

Incorrect options:

- **Create an application proxy**: Used for accessing on-premises web applications remotely, not for OAuth 2.0 setup.
- **Establish an Azure VPN Gateway**: Connects on-premises networks to Azure, not used for OAuth 2.0 setup.
- **Implement Azure Traffic Manager**: Manages distribution of user traffic, not related to OAuth 2.0 setup.

---

Question: You are managing various applications across different platforms, and you have implemented both user-assigned and system-assigned managed identities in Azure. You need to determine which of the following statements accurately describes the capabilities of these managed identities:

- [ ] User-assigned managed identities can be assigned to resources hosted in any cloud platform, while system-assigned managed identities can only be assigned to Azure resources.
- [ ] Both user-assigned and system-assigned managed identities can be assigned to resources hosted in any cloud platforms.
- [x] Both user-assigned and system-assigned managed identities can only be assigned to resources hosted in the Azure cloud.

Answer: Managed identities can only be assigned to resources hosted in the Azure cloud. You cannot assign a managed identity to instances of any AWS services.

---

Question: Which of the following workflows are suitable for using system-assigned identities in Azure?

- [x] A single-instance web application hosted on an Azure Virtual Machine, requiring access to an Azure SQL Database for storing user data. The identity is used to authenticate and authorize the VM to access the database without storing credentials in the code.
- [x] Three separate Azure Functions, each with a unique task such as processing orders, sending notifications, and generating reports. Each function requires access to different Azure resources, and the identity is used to manage permissions independently for each function.
- [x] An analytics application running exclusively on a single Azure VM, tasked with retrieving and processing data from Azure Blob Storage. The identity is used to authenticate the VM to the Blob Storage, allowing secure access without manual credential management.
- [ ] A distributed e-commerce application running on multiple Azure VMs, all needing to access the same Azure Key Vault to retrieve encryption keys for securing customer data. The identity is shared across all VMs.
- [ ] An Azure Logic App designed to automate the provisioning of new VMs for a development environment, requiring pre-authorization to a specific Azure Storage Account where deployment scripts are stored. The identity is used to grant immediate access to the storage account upon VM creation.
- [ ] A containerized microservices application running on Azure Kubernetes Service, where containers are frequently scaled up and down. The identity ensures that permissions to access a shared Azure Queue remain consistent across all containers.
- [ ] A cluster of VMs running a big data processing application, all needing to read and write data to the same Azure Data Lake for a weather analysis project. The identity is shared across all VMs, allowing them to collectively access the Data Lake with the same permissions.

Answer: Common use cases for system-assigned identities:

- Workloads contained within a single Azure resource.
- Workloads needing independent identities.
- For example, an application that runs on a single virtual machine.

---

Question: Which of the following workflows are suitable for using user-assigned identities in Azure?

- [ ] A single-instance web application hosted on an Azure Virtual Machine, requiring access to an Azure SQL Database for storing user data. The identity is used to authenticate and authorize the VM to access the database without storing credentials in the code.
- [ ] Three separate Azure Functions, each with a unique task such as processing orders, sending notifications, and generating reports. Each function requires access to different Azure resources, and the identity is used to manage permissions independently for each function.
- [ ] An analytics application running exclusively on a single Azure VM, tasked with retrieving and processing data from Azure Blob Storage. The identity is used to authenticate the VM to the Blob Storage, allowing secure access without manual credential management.
- [x] A distributed e-commerce application running on multiple Azure VMs, all needing to access the same Azure Key Vault to retrieve encryption keys for securing customer data. The identity is shared across all VMs.
- [x] An Azure Logic App designed to automate the provisioning of new VMs for a development environment, requiring pre-authorization to a specific Azure Storage Account where deployment scripts are stored. The identity is used to grant immediate access to the storage account upon VM creation.
- [x] A containerized microservices application running on Azure Kubernetes Service, where containers are frequently scaled up and down. The identity ensures that permissions to access a shared Azure Queue remain consistent across all containers.
- [x] A cluster of VMs running a big data processing application, all needing to read and write data to the same Azure Data Lake for a weather analysis project. The identity is shared across all VMs, allowing them to collectively access the Data Lake with the same permissions.

Answer: Common use cases for user-assigned identities:

- Workloads that run on multiple resources and can share a single identity.
- Workloads needing pre-authorization to a secure resource, as part of a provisioning flow.
- Workloads where resources are recycled frequently, but permissions should stay consistent.
- For example, a workload where multiple virtual machines need to access the same resource.

---

Question: Which managed entity requirest minimum effort to use?

- [x] System-assigned identity
- [ ] User-assigned identity

Answer: A system-assigned identity is tied to your container app and is deleted when your container app is deleted.

---

Question: You have an existing container app with a system assigned identity. What happens when you finish using that app and delete it?

- [ ] You can reuse this identity for another container app
- [x] The system assigned identity gets deleted, thus cannot be reused
- [ ] You cannot delete a container app before deleting it system assigned identity

Answer: A system-assigned identity is tied to your container app and is deleted when your container app is deleted.

---

Question: You have an existing container map with a user assigned identity. What happens when you finish using that app and delete it?

- [x] You can reuse this identity for another container app
- [ ] The user assigned identity gets deleted, thus cannot be reused
- [ ] You cannot delete a container app before deleting it user assigned identity

Answer: A user-assigned identity is a standalone Azure resource that can be assigned to your container app and other resources.

---

Question: You want to use managed identity across multiple container apps. Which one would you choose?

- [ ] System-assigned identity
- [x] User-assigned identity
- [ ] Any
- [ ] None

Answer: A user-assigned identity is a standalone Azure resource that can be assigned to your container app and other resources.

---

Question: You want to use multiple managed identities for your container app. Which ones can you use?

- [ ] System-assigned identities only
- [x] User-assigned identities only
- [ ] Both
- [ ] None

Answer: A container app can have multiple user-assigned identities.

---

Question: An e-commerce company is planning to migrate their monolithic application to a microservices architecture. They want to leverage Azure Container Apps for this purpose. The application needs to interact with Azure Key Vault to retrieve secrets and Azure SQL Database for storing and retrieving data. The company wants to avoid storing and managing credentials in their application code. Which type of managed identity would fit this scenario?

- [x] System-assigned identity
- [ ] User-assigned identity
- [ ] Any of these
- [ ] None of these

Answer: This scenario is best suited for a System-assigned managed identity. System-assigned managed identities are tied to the lifecycle of the Azure resource (in this case, the Azure Container App) and are automatically cleaned up by Azure when the resource is deleted. The application can use the System-assigned managed identity to authenticate to any service that supports Entra ID authentication without having any credentials in the code. The Azure Container App can be granted access to the Azure Key Vault and Azure SQL Database using Azure role-based access control (RBAC).

---

Question: A software company is developing a multi-tenant SaaS application that will be hosted on Azure Container Apps. Each tenant will have their own Azure Storage account for storing data. The application needs to access these storage accounts on behalf of the tenants. The company wants to manage the identities separately from the Azure Container Apps and wants to have one or more pre-configured entities for each tenant. Which type of managed identity would fit this scenario?

- [ ] System-assigned identity
- [x] User-assigned identity
- [ ] Any of these
- [ ] None of these

Answer: This scenario is best suited for User-assigned managed identities. User-assigned managed identities are standalone Azure resources that can be assigned to one or more instances of an Azure service. In this case, each tenant can have a User-assigned managed identity that is granted access to their Azure Storage account. The Azure Container App can then use these identities to authenticate to the storage accounts on behalf of the tenants. When a tenant leaves, the User-assigned managed identity can be removed from the Azure Container App and deleted.

---

Question: What is the primary purpose of `ChainedTokenCredential` in Azure?

- [x] Combines multiple credentials, attempting each in sequence until successful authentication.
- [ ] Binds multiple Entra ID groups into a single token.
- [ ] Creates a chain of Entra ID users for fallback authentication.
- [ ] Encrypts a token using a chain of cryptographic keys.

Answer: It combines multiple credentials for flexible authentication.

---

Question: You are tasked with assigning Azure roles and want to ensure that you have the necessary permissions. Which of the following roles would grant you the ability to assign Azure roles?

- [ ] `Reader`
- [ ] `Contributor`
- [x] `User Access Administrator`
- [x] `Owner`

Answer: Both the `User Access Administrator` and `Owner` roles include the `Microsoft.Authorization/roleAssignments/write` permission, which is required to assign Azure roles.  
The other roles listed do not inherently include the necessary permission for role assignment.

---

Question: You are an administrator for a company with various Azure resources. Different teams require different levels of access to these resources. Which of the following options should be used to manage access according to the specific needs of each team?

- [ ] Microsoft Entra ID
- [ ] Azure Resource Manager Templates (ARM Templates)
- [x] Azure Role-Based Access Control (Azure RBAC)
- [ ] Azure Virtual Network (VNet)

Answer: Azure Role-Based Access Control (Azure RBAC) is the authorization system used to manage access to Azure resources. It allows administrators to assign permissions to users, groups, and applications at different scopes, providing the flexibility to grant access according to specific needs.  
The other options listed, such as Entra ID, ARM Templates, and VNet, are important Azure services but do not provide the specific functionality needed to manage access to Azure resources based on roles.

---

Question: In ASP.NET Core 3, in which file do you configure Authentication and Authorization?

- [ ] `Program.cs`
- [x] `Startup.cs`
- [ ] `App.config`
- [ ] `Web.config`

Answer: In ASP.NET Core 3, the `Startup.cs` file is where you configure various services, including authentication and authorization. The `ConfigureServices` method is used to register services, and the `Configure` method is used to add middleware to the request pipeline, including authentication middleware.  
`Program.cs` - This file is used for configuring services in ASP.NET Core 6.0 and later, not in version 3.

---

Question: What is the minimum required role to assign an access policy in Azure Key Vault, adhering to the principle of least privilege?

- [x] Key Vault Owner
- [ ] Global Administrator
- [ ] Key Vault Administrator
- [ ] Azure Subscription Owner

Answer: `The Key Vault Owner` has the necessary permissions to assign access policies within the Key Vault.  
Other roles listed grant more permissions than required for this specific task, violating the principle of least privilege.

---

Question: Within the context of assigning access policies in Azure Key Vault, what is the minimum required permission, ensuring that only the necessary rights are granted?

- [x] User with Access Policy Permissions
- [ ] Key Vault Owner
- [ ] Global Administrator
- [ ] Azure Subscription Owner

Answer: A user with specific permissions like "Set" and "Delete" on the access policies of the Key Vault has the minimum required permissions to assign access policies.  
Other roles listed grant broader permissions, which is not necessary for this specific task.

---

Question: If you want to manage access policies in Azure Key Vault without granting unnecessary additional permissions, what is the minimum required built-in role?

- [x] Key Vault Contributor Role
- [ ] Global Administrator
- [ ] Key Vault Owner
- [ ] Azure Subscription Owner

Answer: The Key Vault Contributor Role is a built-in role that allows you to manage access policies in the Key Vault without granting additional unnecessary permissions.  
Other roles listed grant more permissions than required for this specific task, which is not aligned with the principle of least privilege.

---

Question: In the Azure Portal, where do you navigate to assign roles and grant access to specific Azure resources?

- [ ] Microsoft Entra ID
- [ ] Access Policies
- [x] Access control (IAM)
- [ ] Resource Configuration
- [ ] Microsoft Identity Platform

Answer: Access control (IAM) is the specific section within the Azure Portal where you can manage access to Azure resources by assigning roles.

---

Question: A new web application has been deployed in a specific Azure subscription. The DevOps team will be responsible for monitoring the application and executing future deployments. You need to set up Role-Based Access Control (RBAC) for the DevOps team to allow them to view and manage deployment pipelines within the subscription. What RBAC role should you assign to the DevOps team?

- [ ] `*/write`
- [ ] Microsoft.Pipelines/write
- [x] Microsoft.DevOps//write
- [ ] Microsoft.Management/write
- [ ] Microsoft.Management/read

Answer: The correct option is `Microsoft.DevOps/write` because to manage deployment pipelines and monitor the application, the DevOps team would require write access to DevOps resources within the subscription. This role allows them to view and manage DevOps resources, including deployment pipelines.  
`*/write`: Provides write access to all resources within the subscription, which could be overly permissive and pose a security risk.

---

Question: A freshly deployed application service exists within a specific subscription. When the application goes live and gains users, a support team will oversee logs and assist with subsequent deployments. To enable the support team to view subscription details via RBAC, which access roles should be granted?

- [x] `*/read`
- [ ] `Microsoft.Support/*/read`
- [ ] `Microsoft.Compute/*`
- [ ] `Microsoft.Insights/diagnosticSettings/*/read`

Answer: `*/read` grants read access to all resources within the subscription.  
`Microsoft.Insights/diagnosticSettings/*/read` is incorrect because it only allows read access to Microsoft Insights, but support team wants all resources.

---

Question: Your organization utilizes Azure for various resources. The development team creates web applications and forwards the builds to the deployment team for implementation on Azure. You need to ensure that your development team can view Azure resources and also create support tickets for all subscriptions. You are tasked with creating a new custom role based on an existing role definition. What actions should you include in the "Actions" section of this custom role?

- [x] `*/read`
- [ ] `*/write`
- [ ] `Microsoft.Support/*/read`
- [x] `Microsoft.Support/*`

Answer: `*/read` grants read permissions for resources. Adding `Microsoft.Support/*` allows the team to create support tickets for all subscriptions.

---
