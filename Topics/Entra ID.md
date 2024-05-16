# [Microsoft Entra ID](https://learn.microsoft.com/en-us/entra/identity/)

Implements [OAuth 2.0](https://learn.microsoft.com/en-us/entra/identity-platform/v2-protocols) authorization protocol, allowing third-party apps to access web-hosted resources on behalf of users. These resources have a unique _application ID URI_.

## Microsoft Entra ID vs Role-Based Access Control (RBAC)

| Feature        | Entra ID                                                            | Azure RBAC                                                                                   |
| -------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| **Purpose**    | Authentication. Identity & Access Management                        | Authorization                                                                                |
| **Focus**      | Entra ID Resources                                                  | Azure Resources                                                                              |
| **Scope**      | Tenant                                                              | Management Group, Subscription, Resource Group, Resource                                     |
| **Roles**      | Global, User, Billing Admins; Custom roles; Multiple roles per user | Owner, Contributor, Reader, User Access Admin; Custom roles (P1/P2); Multiple roles per user |
| **Access Via** | Azure Portal, MS 365 Admin, Graph, PowerShell                       | Azure Portal, CLI, PowerShell, ARM templates, REST API                                       |
| **Pricing**    | Free, P1, P2 (Monthly charged)                                      | Free (With Azure subscription)                                                               |

## Use case: App Service web app accessing Microsoft Graph API (or other service)

- For multi-tenant applications, an _application service principal_ is utilized to grant permissions. This enables the app to access Microsoft Graph API resources across multiple tenants without relying on a specific user identity.
- For single-tenant scenarios where the app only needs to access resources within a specific tenant, a _Managed Identity_ could be more appropriate.
- When the app needs to perform actions specific to an individual user (_on behalf of the user_), delegated permissions are used, requiring user authentication and consent.
- If the permissions required by the application can change dynamically based on runtime conditions, leveraging _Entra ID roles and policies_ would be more suitable.
- For short-lived operations that don't require persistent permissions, _token-based or key-based temporary access methods_ could be more fitting.

## Application Registration

All applications _must [register with Entra ID](https://learn.microsoft.com/en-us/azure/app-service/configure-authentication-provider-aad?tabs=workforce-tenant)_ to delegate identity and access management: `Portal > app > 'Authentication' > 'Add identity provider' > set provider to Microsoft > 'Add'`. This creates an application object and a globally unique ID (app/client ID).

- **Application Object**: Resides in the Entra ID tenant where the app is registered. It serves as the _global representation_ of your application for use across all tenants. This object has:

  - A 1:1 relationship with the Software Application.
  - A 1:N relationship with _Service Principal Objects_, meaning one Application Object can have multiple corresponding _Service Principal Objects_.

- **[Service principals](https://learn.microsoft.com/en-us/azure/active-directory/develop/app-objects-and-service-principals?tabs=browser) Objects**: These are _local representations_ within each tenant (use **Enterprise applications** page in the Azure portal to manage). They are derived from the Application Object and come in three types:
  - **Application**: Created when an app gains resource access permissions.
  - **Managed Identity**: Automatically created when enabled. It grants access but is not directly modifiable.
  - **Legacy**: For apps created before modern registration methods, restricted to the tenant where created.

Changes to your application object also affect its service principals in the home tenant only. Deleting the application also deletes its home tenant service principal, but restoring that application object won't recover its service principals.

List service principals associated with an app: `az ad sp list --filter "appId eq '{AppId}'"`

| [Integrate authentication and authorization](https://learn.microsoft.com/en-us/azure/active-directory/develop/v2-overview) | Web App | Backend API                                               | Daemon |
| -------------------------------------------------------------------------------------------------------------------------- | ------- | --------------------------------------------------------- | ------ |
| 1. Register in Entra ID                                                                                                    | ✓       | ✓                                                         | ✓      |
| 2. Configure app with code sample                                                                                          | ✕       | ✓                                                         | ✕      |
| 3. Validate token                                                                                                          | ID      | Access                                                    | ✕      |
| 4. Configure secrets & certificates                                                                                        | ✓       | ✓                                                         | ✓      |
| 5. Configure permission & call API of choice                                                                               | ✓       | ✓                                                         | ✓      |
| 6. Control access (authorization)                                                                                          | ✓       | ✓ (add `validate-jwt` policy to validate the OAuth token) | ✕      |
| 7. Store token cache                                                                                                       | ✓       | ✓                                                         | ✓      |

To [protect an API in Azure API Management](https://learn.microsoft.com/en-us/azure/api-management/api-management-howto-protect-backend-with-aad), register both the backend API and web app, configure permissions to allow the web app to call the backend API (`az ad app permission add --id <WebApp-Application-Id> --api <Backend-API-Application-Id> --api-permissions <Permission-Id>=Scope`), and enable OAuth 2.0 user authorization along with adding the `validate-jwt` policy for token validation.

- `<Permission-Id>=Scope`: Delegated permissions
- `<Permission-Id>=Role`: Application permissions

## [Permissions (Scopes)](https://learn.microsoft.com/en-us/azure/active-directory/develop/permissions-consent-overview)

The app specifies required permissions using the `scope` query parameter, which defines the resource type. If unspecified, the default resource is Microsoft Graph. For instance, `scope=User.Read` is the same as `https://graph.microsoft.com/User.Read`.

| Permission types | Delegated permissions                                                    | Application permissions                    |
| ---------------- | ------------------------------------------------------------------------ | ------------------------------------------ |
| Access context   | Get access on behalf of a user (a signed-in user is present)             | Get access without a user (signed-in user) |
| Types of apps    | Web / Mobile / single-page app (SPA)                                     | Web / Daemon / Background services         |
| Other names      | Scopes / OAuth2 permission scopes                                        | App / App-only permissions roles           |
| Who can consent  | - Users can consent for their data<br>- Admins can consent for all users | Only admin can consent                     |
| Consent methods  | Static or Dynamic                                                        | Static ONLY                                |

`az ad app permission add --id {appId} --api {apiID} --api-permissions {permissionId}={Scope,Role}`

- Scope: Defines **what the application is allowed to do** on behalf of a user.
- Role: Defines more privileged **operations that the application can perform**, often without a user

### [Consent](https://learn.microsoft.com/en-us/azure/active-directory/manage-apps/user-admin-consent-overview)

- **Static user consent**: Requires all permissions to be specified in the Azure portal during app registration. Users or admins are prompted for consent if not previously granted. Issues: requires long lists of permissions and knowing all resources in advance.
- **Incremental (Dynamic) user consent**: Allows permissions to be requested gradually. Scopes can be specified during runtime without predefinition in Azure portal.
- **Admin consent**: needed for high-privilege permissions. Admins authorize apps to access privileged data. Requires static permissions registration. `az ad app permission admin-consent`

Requesting individual user consent:

```http
GET https://login.microsoftonline.com/common/oauth2/v2.0/authorize?
client_id=6731de76-14a6-49ae-97bc-6eba6914391e
&response_type=code
&redirect_uri=http%3A%2F%2Flocalhost%2Fmyapp%2F
&response_mode=query
&scope=https%3A%2F%2Fgraph.microsoft.com%2Fcalendars.read%20https%3A%2F%2Fgraph.microsoft.com%2Fmail.send
&state=12345
```

## [Conditional Access](https://learn.microsoft.com/en-us/azure/active-directory/conditional-access/overview) (Premium P1 tier)

- Prompt additional verification (e.g., second password or fingerprint) when users sign in
- Using a middle tier to solve a "challenge" presented by API
- [Multi-Factor Authentication](https://learn.microsoft.com/en-us/azure/active-directory/authentication/concept-mfa-licensing) (**all Microsoft 365 plans**). When [Security Defaults](https://learn.microsoft.com/en-us/azure/active-directory/fundamentals/security-defaults) is enabled, MFA is activated for **all users**. To apply MFA to specific users only, _disable Security Defaults_.
- Risk-based policies (require Entra ID Identity Protection - **Premium P2** tier)
- Device restrictions (enrolled in Microsoft's Intune service)
- Certain physical locations or IP ranges

When Conditional Access licenses expire, policies stay active but can't be updated.

Apps don't need to be changed, unless they need silent or indirect services access, or on-behalf-of flow.

## Other Entra ID features

- [Entra ID B2C](https://learn.microsoft.com/en-us/azure/active-directory-b2c/overview) supports multiple login methods, including social media, email/password.
- [Entra ID B2B](https://learn.microsoft.com/en-us/azure/active-directory/external-identities/what-is-b2b) allows you to share your company's applications with external users in a secure manner.
- [Entra ID Application Proxy](https://learn.microsoft.com/en-us/azure/active-directory/app-proxy/what-is-application-proxy) provides secure remote access to on-premises applications.
- [Entra ID Connect](https://en.wikipedia.org/wiki/Azure_AD_Connect) allows you to synchronize an AD tenant with an on-premises AD domain.
- [Entra ID Enterprise Application](https://learn.microsoft.com/en-us/azure/active-directory/manage-apps/add-application-portal) allow you to integrate other applications with Entra ID, including your own apps.

## MSAL (Microsoft Authentication Library)

Enables secure access to various APIs, with a unified API across platforms.

- Obtains tokens for users or applications (when applicable).
- Manages token cache and refreshes tokens automatically.
- Helps specify the desired audience for application sign-in.
- Assists with application setup from configuration files.
- Provides actionable exceptions, logging, and telemetry for troubleshooting.

### [Authentication flows](https://learn.microsoft.com/en-us/azure/active-directory/develop/msal-authentication-flows)

| Flow               | Application Type | Use Case                                          | Token Acquisition Method                    |
| ------------------ | ---------------- | ------------------------------------------------- | ------------------------------------------- |
| Authorization code | Both             | SPA, Native, Web Apps                             | Exchanges an authorization code for a token |
| Client credentials | Confidential     | Daemon, Backend                                   | App Secret/Certificate                      |
| On-behalf-of       | Both             | Service-to-Service, Service-to-API, Microservices | Uses an existing token to get another       |
| Device code        | Public           | IoT, CLI                                          | Polls the endpoint until user authenticates |
| Implicit           | Public           | Legacy SPAs                                       | Token in URI fragment                       |
| Integrated Windows | Both             | Intranet Apps                                     | Auto auth on domain / Entra ID-joined PCs   |
| Interactive        | Public           | User Interactive Apps                             | Requires user action                        |
| Username/password  | Both             | Legacy, Testing                                   | Direct with Credentials                     |

- **Public client applications**: User-facing apps without the ability to securely store secrets. They interact with web APIs on the user's behalf.
- **Confidential client applications**: Server-based apps and daemons that can securely handle secrets. Each instance maintains a unique configuration, including identifiers and secrets.

### Working with MSAL

When building web apps or public client apps that require a broker, ensure to set the `redirectUri`. This URL is used by the identity provider to return security tokens to your application.

Integrating Entra ID authentication into an ASP.NET Core application:

```cs
builder.Services.AddAuthentication(OpenIdConnectDefaults.AuthenticationScheme)
  .AddMicrosoftIdentityWebApp(builder.Configuration.GetSection("AzureAd"));

builder.Services.AddRazorPages()
  .AddMicrosoftIdentityUI();

// OpenIdConnectDefaults.AuthenticationScheme: Enables OpenID Connect authentication, best for OAuth 2.0 and Single Sign-On (SSO).
// JwtBearerDefaults.AuthenticationScheme: Used for authenticating APIs via JSON Web Tokens (JWT), suitable for stateless and scalable APIs.
// CookieAuthenticationDefaults.AuthenticationScheme: Employs cookies for session-based authentication, optimal for traditional web apps that manage user sessions server-side.
// Custom Authentication Scheme: Allows for custom string identifiers for authentication middleware, ideal for specialized or unique authentication scenarios.
```

```cs
// Sign in users in the Microsoft Azure public cloud using their work and school accounts or personal Microsoft accounts.
IPublicClientApplication app = PublicClientApplicationBuilder.Create(clientId).Build();

// Confidential application that handles tokens from Microsoft Azure users using a shared client secret for identification.
// Example: A daemon application that does not interact with the user and acts on its own behalf, like a service accessing Graph API
IConfidentialClientApplication app = ConfidentialClientApplicationBuilder.Create(clientId)
    .WithClientSecret(clientSecret)
    .WithRedirectUri(redirectUri )
    .Build();
```

Common modifiers:

| Modifier                                              | Description                                                                                                                                                                                                                                                                                     |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.WithAuthority()`                                    | Sets the application default authority to an Microsoft Entra ID authority, with the possibility of choosing the Azure Cloud, the audience, the tenant (tenant ID or domain name), or providing directly the authority URI. Example: `.WithAuthority(AzureCloudInstance.AzurePublic, _tenantId)` |
| `.WithTenantId(string tenantId)`                      | Overrides the tenant ID, or the tenant description.                                                                                                                                                                                                                                             |
| `.WithClientId(string)`                               | Overrides the client ID.                                                                                                                                                                                                                                                                        |
| `.WithRedirectUri(string redirectUri)`                | Overrides the default redirect URI (ex: for scenarios requiring a broker)                                                                                                                                                                                                                       |
| `.WithComponent(string)`                              | Sets the name of the library using MSAL.NET (for telemetry reasons).                                                                                                                                                                                                                            |
| `.WithDebugLoggingCallback()`                         | If called, the application calls Debug.Write simply enabling debugging traces.                                                                                                                                                                                                                  |
| `.WithLogging()`                                      | If called, the application calls a callback with debugging traces.                                                                                                                                                                                                                              |
| `.WithTelemetry(TelemetryCallback telemetryCallback)` | Sets the delegate used to send telemetry.                                                                                                                                                                                                                                                       |

Confidential client application only:

| Modifier                                         | Description                                                                                |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| `.WithCertificate(X509Certificate2 certificate)` | Sets the certificate identifying the application with Microsoft Entra ID.                  |
| `.WithClientSecret(string clientSecret)`         | Sets the client secret (app password) identifying the application with Microsoft Entra ID. |

Acquiring Token:

```cs
string[] scopes = { "user.read" };
AuthenticationResult result = await app.AcquireTokenInteractive(scopes).ExecuteAsync();
Console.WriteLine($"Token: {result.AccessToken}");
```

## [Application manifest](https://learn.microsoft.com/en-us/azure/active-directory/develop/reference-app-manifest)

An Entra ID application manifest configures an app's identity and attributes, facilitating OAuth authorization and user consent. It serves as a mechanism for updating the application object in the Microsoft identity platform.

- `signInAudience`:

  - `AzureADMyOrg` - Users with a Microsoft work or school account in my organization's Microsoft Entra tenant (for example, single tenant)
  - `AzureADMultipleOrgs` - Users with a Microsoft work or school account in any organization's Microsoft Entra tenant (for example, multi-tenant)
  - `AzureADandPersonalMicrosoftAccount` - Users with a personal Microsoft account, or a work or school account in any organization's Microsoft Entra tenant
  - `PersonalMicrosoftAccount` - Personal accounts that are used to sign in to services like Xbox and Skype.

- `groupMembershipClaims`: (_Tenant-specific_) Groups claim issued in access token that the app expects. Groups persist even after the associated app is removed.

  - "None"
  - "SecurityGroup" (will include security groups and Entra ID roles)
  - "ApplicationGroup" (this option includes only groups that are assigned to the application)
  - "DirectoryRole" (gets the Entra ID directory roles the user is a member of)
  - "All" (this will get all of the security groups, distribution groups, and Entra ID directory roles that the signed-in user is a member of).

- [`appRoles`](https://learn.microsoft.com/en-us/azure/active-directory/develop/howto-add-app-roles-in-apps) (_Application-specific_): Collection of roles that an app may declare. Defined in the app registration, and will get removed with it. Correspond to `Role` in `--api-permissions`

  ```jsonc
  "appRoles": [{
      "allowedMemberTypes": [ "User" ],
      "value": "ReadOnly" // expected value of the roles claim in the token, which must match the string in the application's code without spaces.
  }]
  ```

- `oauth2Permissions`: Specifies the collection of OAuth 2.0 permission scopes that the web API (resource) app exposes to client apps. Correspond to `Scope` in `--api-permissions`.

- `oauth2AllowImplicitFlow` - If the web app can request implicit flow access tokens (`oauth2AllowIdTokenImplicitFlow` for ID tokens). ⭐: SPAs, when using Implicit Grant Flow.

| Attribute Name               | Brief Explanation                                                                                                                     |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `requiredResourceAccess`     | Specifies the resources that the app requires access to.                                                                              |
| `keyCredentials`             | Holds references to app-assigned credentials, string-based shared secrets and X.509 certificates.                                     |
| `acceptMappedClaims`         | Allows an application to use claims mapping without specifying a custom signing key.                                                  |
| `optionalClaims`             | The optional claims returned in the token by the security token service for this specific app.                                        |
| `addIns`                     | Defines custom behavior that a consuming service can use to call an app in specific contexts.                                         |
| `allowPublicClient`          | Specifies the fallback application type.                                                                                              |
| `knownClientApplications`    | Used for bundling consent if you have a solution that contains two parts: a client app and a custom web API app.                      |
| `oauth2RequirePostResponse`  | Specifies whether, as part of OAuth 2.0 token requests, Entra ID will allow POST requests, as opposed to GET requests.                |
| `passwordCredentials`        | Similar to `keyCredentials`, holds references to app-assigned credentials, string-based shared secrets.                               |
| `preAuthorizedApplications`  | Lists applications and requested permissions for implicit consent.                                                                    |
| `replyUrlsWithType`          | Holds the list of registered redirect_uri values that Entra ID will accept as destinations when returning tokens.                     |
| `signInAudience`             | Specifies what Microsoft accounts are supported for the current application.                                                          |
| `identifierUris`             | User-defined URI(s) that uniquely identify a web app within its Entra ID tenant or verified customer owned domain.                    |
| `tags`                       | Custom strings that can be used to categorize and identify the application.                                                           |
| `parentalControlSettings`    | Specifies the countries/regions in which the app is blocked for minors and the legal age group rule that applies to users of the app. |
| `accessTokenAcceptedVersion` | Specifies the access token version expected by the resource.                                                                          |
| `logoutUrl`                  | The URL to log out of the app.                                                                                                        |
| `signInUrl`                  | Specifies the URL to the app's home page.                                                                                             |
| `logoUrl`                    | Read only value that points to the CDN URL to logo that was uploaded in the portal.                                                   |
| `samlMetadataUrl`            | The URL to the SAML metadata for the app.                                                                                             |
| `publisherDomain`            | The verified publisher domain for the application.                                                                                    |
| `informationalUrls`          | Specifies the links to the app's terms of service and privacy statement.                                                              |
| `appId`                      | Specifies the unique identifier for the app that is assigned to an app by Entra ID.                                                   |
| `name`                       | The display name for the app.                                                                                                         |
| `id`                         | The unique identifier for the app in the directory.                                                                                   |

## ASP.NET Core Authorization: Working with Roles, Claims, and Policies

- [**Policies**](https://learn.microsoft.com/en-us/aspnet/core/security/authorization/policies?view=aspnetcore-3.1): A policy is a function that can look at a user's identity and decide whether they are authorized to perform a given action.
- [**Roles**](https://learn.microsoft.com/en-us/aspnet/core/security/authorization/roles?view=aspnetcore-3.1): A role represents a group of users that have certain privileges as defined by the role.
- [**Claims**](https://learn.microsoft.com/en-us/aspnet/core/security/authorization/claims?view=aspnetcore-3.1): A claim is a name-value pair that represents what the subject is, not what the subject can do.

```cs
// Startup.cs
public void ConfigureServices(IServiceCollection services)
{
    // Define policies
    services.AddAuthorization(options =>
    {
        options.AddPolicy("ClientsOnly", policy =>
        {
            policy.RequireAuthenticatedUser(); // Requires the user to be authenticated
            policy.RequireRoles("PrivateClient", "CorporateClient"); // Requires ANY of these listed roles
            policy.RequireClaim("SubscriptionTier", "free", "basic", "premium"); // Requires ANY of the values for SubscriptionTier
        });
        options.AddPolicy("FreeloadersOnly", policy =>
        {
            policy.RequireAuthenticatedUser();
            policy.RequireRole("PrivateClient");
            policy.RequireClaim("SubscriptionTier", "free");
        });
        options.AddPolicy("EmployeeOnly", policy => policy.RequireClaim("EmployeeNumber")); // Requires EmployeeNumber claim
        options.AddPolicy("AdminOnly", policy => policy.RequireRole("Administrator")); // Requires Administrator role
    });
}

// LoginController.cs
[HttpPost]
public async Task<IActionResult> Login(LoginViewModel model)
{
  // Checks omitted for brevity
  var user = await _userManager.FindByNameAsync(model.Username);
  var claim = new Claim("EmployeeNumber", "123");
  await _userManager.AddClaimAsync(user, claim);
}

[Authorize(Policy = "ClientsOnly")] // Allow premium clients only
public class AdminController : Controller { }

[Authorize(Role = "CorporateClient")] // Allow corporate clients only
public class AdminController : Controller { }

[Authorize(Policy = "EmployeeOnly")] // Apply EmployeeOnly policy
public class WorkController : Controller { }

[Authorize(Policy = "AdminOnly")] // Apply AdminOnly policy
public class AdminController : Controller { }

[Authorize(Policy = "ClientsOnly")] // Clients only that also have "Administrator" role (AND)
[Authorize(Roles = "Administrator")]
public class ClientAdminController : Controller { }
```
