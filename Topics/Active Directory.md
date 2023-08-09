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

[Azure AD Connect](https://en.wikipedia.org/wiki/Azure_AD_Connect) allows you to synchronize an AD tenant with an on-premises AD domain.

[Azure AD Enterprise Application](https://learn.microsoft.com/en-us/azure/active-directory/manage-apps/add-application-portal) allow you to integrate other applications with Azure AD, including your own apps.

## [Multi-Factor Authentication](https://learn.microsoft.com/en-us/azure/active-directory/authentication/concept-mfa-licensing)

All Microsoft 365 plans can enable Azure AD Multi-Factor Authentication for all users.

Premium allows to use Conditional Access features for multi-factor authentication.

[Security defaults in Azure AD](https://learn.microsoft.com/en-us/azure/active-directory/fundamentals/security-defaults) include mandatory multi-factor authentication for **all users** (don't enable this if you want MFA for specific users only).

## [Application manifest](https://learn.microsoft.com/en-us/azure/active-directory/develop/reference-app-manifest)

An application manifest in the context of Azure Active Directory represents an application's identity configuration within an Azure AD tenant. It is used to facilitate OAuth authorization, consent experience, and more. The application manifest contains a definition of all the attributes of an application object in the Microsoft identity platform and serves as a mechanism for updating the application object.

Here are some of the most noteworthy attributes found in the application manifest:

| Attribute Name                   | Brief Explanation                                                                                                                     |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                             | The unique identifier for the app in the directory.                                                                                   |
| `acceptMappedClaims`             | Allows an application to use claims mapping without specifying a custom signing key.                                                  |
| `accessTokenAcceptedVersion`     | Specifies the access token version expected by the resource.                                                                          |
| `addIns`                         | Defines custom behavior that a consuming service can use to call an app in specific contexts.                                         |
| `allowPublicClient`              | Specifies the fallback application type.                                                                                              |
| `appId`                          | Specifies the unique identifier for the app that is assigned to an app by Azure AD.                                                   |
| `appRoles`                       | Specifies the collection of roles that an app may declare.                                                                            |
| `groupMembershipClaims`          | Configures the groups claim issued in a user or OAuth 2.0 access token that the app expects.                                          |
| `optionalClaims`                 | The optional claims returned in the token by the security token service for this specific app.                                        |
| `identifierUris`                 | User-defined URI(s) that uniquely identify a web app within its Azure AD tenant or verified customer owned domain.                    |
| `informationalUrls`              | Specifies the links to the app's terms of service and privacy statement.                                                              |
| `keyCredentials`                 | Holds references to app-assigned credentials, string-based shared secrets and X.509 certificates.                                     |
| `knownClientApplications`        | Used for bundling consent if you have a solution that contains two parts: a client app and a custom web API app.                      |
| `logoUrl`                        | Read only value that points to the CDN URL to logo that was uploaded in the portal.                                                   |
| `logoutUrl`                      | The URL to log out of the app.                                                                                                        |
| `name`                           | The display name for the app.                                                                                                         |
| `oauth2AllowImplicitFlow`        | Specifies whether this web app can request OAuth2.0 implicit flow access tokens.                                                      |
| `oauth2AllowIdTokenImplicitFlow` | Specifies whether this web app can request OAuth2.0 implicit flow ID tokens.                                                          |
| `oauth2Permissions`              | Specifies the collection of OAuth 2.0 permission scopes that the web API (resource) app exposes to client apps.                       |
| `oauth2RequirePostResponse`      | Specifies whether, as part of OAuth 2.0 token requests, Azure AD will allow POST requests, as opposed to GET requests.                |
| `parentalControlSettings`        | Specifies the countries/regions in which the app is blocked for minors and the legal age group rule that applies to users of the app. |
| `passwordCredentials`            | Similar to `keyCredentials`, holds references to app-assigned credentials, string-based shared secrets.                               |
| `preAuthorizedApplications`      | Lists applications and requested permissions for implicit consent.                                                                    |
| `publisherDomain`                | The verified publisher domain for the application.                                                                                    |
| `replyUrlsWithType`              | Holds the list of registered redirect_uri values that Azure AD will accept as destinations when returning tokens.                     |
| `requiredResourceAccess`         | Specifies the resources that the app requires access to.                                                                              |
| `samlMetadataUrl`                | The URL to the SAML metadata for the app.                                                                                             |
| `signInUrl`                      | Specifies the URL to the app's home page.                                                                                             |
| `signInAudience`                 | Specifies what Microsoft accounts are supported for the current application.                                                          |
| `tags`                           | Custom strings that can be used to categorize and identify the application.                                                           |

### Noteworthy attributes

#### groupMembershipClaims

Tenant-specific in Azure AD, groups persist even after the associated app is removed.

- "None"
- "SecurityGroup" (for security groups and Azure AD roles)
- "ApplicationGroup" (this option includes only groups that are assigned to the application)
- "DirectoryRole" (gets the Azure AD directory roles the user is a member of)
- "All" (this will get all of the security groups, distribution groups, and Azure AD directory roles that the signed-in user is a member of).

#### [appRoles](https://learn.microsoft.com/en-us/azure/active-directory/develop/howto-add-app-roles-in-apps)

Defined in the app registration, roles are application-specific and get removed with the app registration.

```jsonc
"appRoles": [
    {
        "allowedMemberTypes": [
            "User"
        ],
        "description": "Read-only access to device information",
        "displayName": "Read Only",
        "id": "601790de-b632-4f57-9523-ee7cb6ceba95",
        "isEnabled": true,
        "value": "ReadOnly" // expected value of the roles claim in the token, which must match the string in the application's code without spaces.
    }
],
```

## [Register your app for automatic Azure AD authentication](https://learn.microsoft.com/en-us/azure/app-service/configure-authentication-provider-aad?tabs=workforce-tenant)

`Portal > app > 'Authentication' > 'Add identity provider' > set provider to Microsoft > 'Add'`
