# [Microsoft Identity Platform](https://docs.microsoft.com/en-us/azure/active-directory/develop/)

Implements [OAuth 2.0](https://learn.microsoft.com/en-us/azure/active-directory/develop/active-directory-v2-protocols) authorization protocol, allowing third-party apps to access web-hosted resources on behalf of users. These resources have a unique _application ID URI_.

## [Service principals](https://learn.microsoft.com/en-us/azure/active-directory/develop/app-objects-and-service-principals?tabs=browser)

Azure AD uses application and service principal objects for identity and access management.

You can use the **Enterprise applications** page in the Azure portal to list and manage the service principals in a tenant.

### Application Registration

Applications must register with Azure AD to delegate identity and access management. This creates an application object and a globally unique ID (app/client ID).

- **Application Object**: Resides in the Azure AD tenant where the application was registered. It's a template for creating service principal objects and defines how the service can issue tokens, the resources the application might need, and the actions it can take.

- **Service Principal Object**: Represents the entity requiring access to resources secured by an Azure AD tenant. There are three types:

  - **Application** - A local representation of a global application object in a tenant, defining the app's capabilities, access, and resources. A service principal object is created when an application gets permission to access resources.

  - **Managed Identity** - It provides an identity for applications connecting to resources supporting Azure AD authentication. A service principal for the managed identity is created when enabled, which can be granted access and permissions but can't be directly modified.

  - **Legacy** - Represents a legacy app, created before app registrations or through legacy experiences. It can only be used in the tenant where it was created.

### Relationship between Application Objects and Service Principals

The application object is the global representation of your application for use across all tenants, and the service principal is the local representation for use in a specific tenant. The application object serves as the template from which common and default properties are derived for use in creating corresponding service principal objects. A service principal must be created in each tenant where the application is used.

An application object has:

- A one-to-one relationship with the software application
- A one-to-many relationship with its corresponding service principal object(s)

### Modifying and Deleting Applications

Any changes made to your application object are also reflected in its service principal object in the application's home tenant only. Deleting an application object will also delete its home tenant service principal object. However, restoring that application object won't restore its corresponding service principal.

### Examples

List service principals associated with an app: `az ad sp list --filter "appId eq '{AppId}'"`

## Permissions and consent

### [Permissions (Scopes)](https://learn.microsoft.com/en-us/azure/active-directory/develop/permissions-consent-overview)

An app requests the permissions it needs by specifying the permission in the `scope` query parameter. if the resource identifier is omitted in the scope parameter, the resource is assumed to be Microsoft Graph. For example, `scope=User.Read` is equivalent to `https://graph.microsoft.com/User.Read`.

| Permission types | Delegated permissions                                                                               | Application permissions                            |
| ---------------- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| Types of apps    | Web / Mobile / single-page app (SPA)                                                                | Web / Daemon                                       |
| Access context   | Get access on behalf of a user                                                                      | Get access without a user                          |
| Who can consent  | - Users can consent for their data<br>- Admins can consent for all users                            | Only admin can consent                             |
| Consent methods  | - Static: configured list on app registration<br>- Dynamic: request individual permissions at login | - Static ONLY: configured list on app registration |
| Other names      | - Scopes<br>- OAuth2 permission scopes                                                              | - App<br>- App-only permissions roles              |

### [Consent](https://learn.microsoft.com/en-us/azure/active-directory/manage-apps/user-admin-consent-overview)

- **Static user consent**: requires specifying all app permissions in Azure portal config. If users haven't consented, they're prompted. Issues: long permission lists and knowing all resources in advance.

- **Incremental user consent**: lets you request permissions gradually using Microsoft identity platform endpoint. Specify scopes when requesting access token without predefining them. Only for delegated permissions, not app-only access.

- **Admin consent**: needed for high-privilege permissions. Admins authorize apps to access privileged data. Requires static permissions registration.

#### Requesting individual user consent

```http
GET https://login.microsoftonline.com/common/oauth2/v2.0/authorize?
client_id=6731de76-14a6-49ae-97bc-6eba6914391e
&response_type=code
&redirect_uri=http%3A%2F%2Flocalhost%2Fmyapp%2F
&response_mode=query
&scope=
https%3A%2F%2Fgraph.microsoft.com%2Fcalendars.read%20
https%3A%2F%2Fgraph.microsoft.com%2Fmail.send
&state=12345
```

If permissions haven't been granted before by the user or the administrator on behalf of the organization, the Microsoft identity platform prompts the user to grant the requested permissions.

## [Conditional Access](https://learn.microsoft.com/en-us/azure/active-directory/conditional-access/overview)

It allows you to set extra security measures or conditions before users can access a service or app. This could mean multi-factor authentication, device restrictions (enrolled in Microsoft's Intune service), or certain physical locations or IP ranges.

Apps typically don't require any changes to adhere to these conditions. However, in certain instances, especially when an app must access a service indirectly or silently, code modifications may be necessary.

Examples:

1. A Conditional Access policy that prompts additional verification (e.g., second password or fingerprint) when users sign in.

1. Using a middle tier service to access an API with Conditional Access policy: The app communicates with the middle tier, which in turn interacts with the API presenting a "challenge." The app must meet this challenge according to the policy.

## MSAL (Microsoft Authentication Library)

Enables secure access to various APIs, with a unified API across platforms.

- Obtains tokens for users or applications (when applicable).
- Manages token cache and refreshes tokens automatically.
- Helps specify the desired audience for application sign-in.
- Assists with application setup from configuration files.
- Provides actionable exceptions, logging, and telemetry for troubleshooting.

### Authentication flows

| Flow               | Description                                                                   | Application Type |
| ------------------ | ----------------------------------------------------------------------------- | ---------------- |
| Authorization code | Native and web apps securely obtain tokens in the name of the user            | Public           |
| Client credentials | Service applications run without user interaction                             | Confidential     |
| On-behalf-of       | The application calls a service/web API, which in turn calls Microsoft Graph  | Both             |
| Implicit           | Used in browser-based applications                                            | Public           |
| Device code        | Enables sign-in to a device by using another device that has a browser        | Public           |
| Integrated Windows | Windows computers silently acquire an access token when they're domain joined | Both             |
| Interactive        | Mobile and desktop applications call Microsoft Graph in the name of a user    | Public           |
| Username/password  | The application signs in a user by using their username and password          | Both             |

- **Public client applications**: User-facing apps without the ability to securely store secrets. They interact with web APIs on the user's behalf.
- **Confidential client applications**: Server-based apps that can securely handle secrets. Each instance maintains a unique configuration, including identifiers and secrets.

### Working with MSAL

When building web apps or public client apps that require a broker, ensure to set the `redirectUri`. This URL is used by the identity provider to return security tokens to your application.

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

| Modifier                                              | Description                                                                                                                                                                                                                    |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `.WithAuthority()`                                    | Sets the application default authority to an Azure Active Directory authority, with the possibility of choosing the Azure Cloud, the audience, the tenant (tenant ID or domain name), or providing directly the authority URI. |
| `.WithTenantId(string tenantId)`                      | Overrides the tenant ID, or the tenant description.                                                                                                                                                                            |
| `.WithClientId(string)`                               | Overrides the client ID.                                                                                                                                                                                                       |
| `.WithRedirectUri(string redirectUri)`                | Overrides the default redirect URI (ex: for scenarios requiring a broker)                                                                                                                                                      |
| `.WithComponent(string)`                              | Sets the name of the library using MSAL.NET (for telemetry reasons).                                                                                                                                                           |
| `.WithDebugLoggingCallback()`                         | If called, the application calls Debug.Write simply enabling debugging traces.                                                                                                                                                 |
| `.WithLogging()`                                      | If called, the application calls a callback with debugging traces.                                                                                                                                                             |
| `.WithTelemetry(TelemetryCallback telemetryCallback)` | Sets the delegate used to send telemetry.                                                                                                                                                                                      |

Confidential client application only:

| Modifier                                         | Description                                                                                    |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| `.WithCertificate(X509Certificate2 certificate)` | Sets the certificate identifying the application with Azure Active Directory.                  |
| `.WithClientSecret(string clientSecret)`         | Sets the client secret (app password) identifying the application with Azure Active Directory. |

## ASP.NET Core Authorization: Working with Roles, Claims, and Policies

- [**Roles**](https://learn.microsoft.com/en-us/aspnet/core/security/authorization/roles?view=aspnetcore-3.1): A role represents a group of users that have certain privileges as defined by the role.
- [**Claims**](https://learn.microsoft.com/en-us/aspnet/core/security/authorization/claims?view=aspnetcore-3.1): A claim is a name-value pair that represents what the subject is, not what the subject can do.
- [**Policies**](https://learn.microsoft.com/en-us/aspnet/core/security/authorization/policies?view=aspnetcore-3.1): A policy is a function that can look at a user's identity and decide whether they are authorized to perform a given action.

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

// ClientController.cs
[Authorize(Policy = "ClientsOnly")] // Allow premium clients only
public class AdminController : Controller
{
    public IActionResult Index() => Content("Client Panel");
}

// CorporateController.cs
[Authorize(Role = "CorporateClient")] // Allow corporate clients only
public class AdminController : Controller
{
    public IActionResult Index() => Content("Corporate Panel");
}

// WorkController.cs
[Authorize(Policy = "EmployeeOnly")] // Apply EmployeeOnly policy
public class WorkController : Controller
{
    public IActionResult Index() => Content("Work Details");
}

// AdminController.cs
[Authorize(Policy = "AdminOnly")] // Apply AdminOnly policy
public class AdminController : Controller
{
    public IActionResult Index() => Content("Admin Panel");
}

[Authorize(Policy = "ClientsOnly")] // Clients only that also have "Administrator" role (AND)
[Authorize(Roles = "Administrator")]
public class ClientAdminController : Controller
{
    public IActionResult Index() => Content("ClientAdmin Panel");
}
```
