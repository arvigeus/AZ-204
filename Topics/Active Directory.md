# [Microsoft Azure Active Directory (Azure AD)](https://docs.microsoft.com/en-us/azure/active-directory/)

## Azure Active Directory (AD) vs Role-Based Access Control (RBAC)

| Feature              | Azure AD                                                                                                            | Azure RBAC                                                                                                                                        |
| -------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Description**      | Identity & access management service for internal & external resources.                                             | Authorization system managing user access to Azure resources.                                                                                     |
| **Focus**            | Grants permissions to manage access to Azure Active Directory resources.                                            | Grants permissions to manage access to Azure resources.                                                                                           |
| **Scope**            | Tenant level.                                                                                                       | Multiple levels: management group, subscription, resource group, and resource.                                                                    |
| **Roles**            | Important built-in roles: Global Admin, User Admin, Billing Admin; Supports custom roles; Multiple roles on a user. | Fundamental built-in roles: Owner, Contributor, Reader, User Access Admin; Supports custom roles in P1 and P2 licenses; Multiple roles on a user. |
| **Role Information** | Accessible in Azure Portal, Microsoft 365 admin center, Microsoft Graph, AzureAD PowerShell.                        | Accessible in Azure Portal, CLI, PowerShell, Resource Manager templates, REST API.                                                                |
| **Pricing**          | Three editions: Free, Premium P1, Premium P2; P1 & P2 charged monthly.                                              | Free and included in Azure subscription.                                                                                                          |

[Azure AD B2B](https://learn.microsoft.com/en-us/azure/active-directory/external-identities/what-is-b2b) allows you to share your company's applications with external users in a secure manner.

[Azure AD Application Proxy](https://learn.microsoft.com/en-us/azure/active-directory/app-proxy/what-is-application-proxy) provides secure remote access to on-premises applications.

## [Multi-Factor Authentication](https://learn.microsoft.com/en-us/azure/active-directory/authentication/concept-mfa-licensing)

All Microsoft 365 plans can enable Azure AD Multi-Factor Authentication for all users.

Premium allows to use Conditional Access features for multi-factor authentication.

[Security defaults in Azure AD](https://learn.microsoft.com/en-us/azure/active-directory/fundamentals/security-defaults) include mandatory multi-factor authentication for **all users** (don't enable this if you want MFA for specific users only).
