# Active Directory

Question: You are tasked with providing secure remote access to an on-premises application for your organization's employees. Which action should you perform?

- [x] Activate application proxy in Azure AD.
- [ ] Upgrade the staff accounts to Azure AD Premium P1.
- [ ] Establish a new conditional access policy in Azure AD.
- [ ] Set up the portal to utilize Azure AD business-to-consumer (B2C).

Answer: The correct action is to activate application proxy in Azure AD. Azure AD Application Proxy provides secure remote access to on-premises applications.

---

Question: Your organization is planning to collaborate with a partner company on a project. You need to provide the partner company's users with access to certain applications in your Azure AD. Which action should you perform?

- [ ] Activate application proxy in Azure AD.
- [ ] Upgrade the staff accounts to Azure AD Premium P1.
- [ ] Establish a new conditional access policy in Azure AD.
- [x] Configure the applications to use Azure AD business-to-business (B2B).

Answer: The correct action is to configure the applications to use Azure AD business-to-business (B2B). Azure AD B2B allows you to share your company's applications with external users in a secure manner.

---

Question: As an administrator for a startup utilizing Azure AD for identity and access management, you're tasked with implementing mandatory multi-factor authentication for all users. What is the most appropriate step to take?

- [ ] Implement Azure AD business-to-consumer (B2C).
- [ ] Upgrade to Azure AD Premium P1 for all user accounts.
- [ ] Establish a new conditional access policy in Azure AD.
- [x] Activate security defaults in Azure AD.
- [ ] Set up an application proxy in Azure AD.

Answer: The most appropriate step is to activate security defaults in Azure AD. This feature provides a basic level of security, including mandatory multi-factor authentication for all users, at no additional cost. The other options, while useful in certain scenarios, do not directly address the requirement of enabling mandatory multi-factor authentication for all users.

---

Question: Your organization uses Azure AD for identity management. You want to implement a policy that triggers multi-factor authentication (MFA) when a sign-in is deemed risky. Which two actions should you perform?

- [ ] Activate application proxy in Azure AD.
- [ ] Upgrade the staff accounts to Azure AD Premium P1.
- [x] Upgrade the staff accounts to Azure AD Premium P2.
- [x] Establish a new risk-based conditional access policy in Azure AD.
- [ ] Enable security defaults in Azure AD.
- [ ] Configure the applications to use Azure AD business-to-business (B2B).

Answer: The correct actions are to upgrade the staff accounts to Azure AD Premium P2 and establish a new risk-based conditional access policy in Azure AD. Risk-based policies require access to Azure AD Identity Protection, which is an Azure AD Premium P2 feature.

---

Question: In Azure AD, what happens to Conditional Access policies when the licenses required for them expire?

- [ ] The policies are automatically disabled.
- [ ] The policies are automatically deleted.
- [x] The policies remain active and can be viewed and deleted, but no longer updated.
- [ ] Nothing changes for existing conditional policies.
- [ ] The policies are automatically replaced with default security policies.

Answer: When licenses required for Conditional Access expire, the policies aren't automatically disabled or deleted. They remain active and can be viewed and deleted, but they can no longer be updated.

---

Question: You are developing an application that uses Azure Active Directory for authentication. The application needs to authorize users based on their group membership in the organization. The application should receive this information in the user's token when they authenticate. How would you configure your application in Azure AD to achieve this?

- [ ] Enable the `OAuth2AllowImplicitFlow` attribute in the application manifest.
- [ ] Set the `requiredResourceAccess` attribute in the application manifest to include the group IDs.
- [x] Configure the `groupMembershipClaims` attribute in the application manifest.
- [ ] Add the group IDs to the `knownClientApplications` attribute in the application manifest.

Answer: `groupMembershipClaims` is used to emit group claims in the token that the application receives when a user authenticates. The other options do not directly influence the emission of group claims in the token.

---

Question: You are developing an application that uses Azure Active Directory for authentication. The application needs to authorize users based on their group membership in the organization. However, due to the large number of groups in your organization, you want to limit the groups included in the user's token to only Security Groups. How would you configure the `groupMembershipClaims` attribute in your application's manifest in Azure AD to achieve this?

- [ ] Set `groupMembershipClaims` to `All`
- [ ] Set `groupMembershipClaims` to `None`
- [x] Set `groupMembershipClaims` to `SecurityGroup`
- [ ] Set `groupMembershipClaims` to `DirectoryRole`

Answer: Set `groupMembershipClaims` to `SecurityGroup` will ensure that only Security Group memberships are included in the user's token. The other options either include too many groups ("All"), no groups ("None"), or a different type of group ("DirectoryRole").

---

Question: In the context of Azure Active Directory, which of the following statements correctly describes the difference between AppRoles and Groups?

- [ ] AppRoles and Groups are both specific to an application and are removed when the application is removed.
- [ ] AppRoles are specific to an Azure AD tenant, while Groups are specific to an application.
- [x] AppRoles are specific to an application and are removed with the app registration, while Groups are tenant-specific and persist even after the app is removed.
- [ ] Groups are removed with the app registration, while AppRoles are tenant-specific and persist even after the app is removed.

Answer: AppRoles are specific to an application and are removed with the app registration, while Groups are tenant-specific and persist even after the app is removed.

---

Question: Which of the types of permissions supported by the Microsoft identity platform is used by apps that have a signed-in user present?

- [x] Delegated permissions
- [ ] App-only access permissions
- [ ] Both delegated and app-only access permissions

Answer: Delegated permissions are used by apps that have a signed-in user present. The app is delegated with the permission to act as a signed-in user when it makes calls to the target resource.  
App-only access permissions are used by apps that run without a signed-in user present, for example, apps that run as background services or daemons.

---

Question: Which of the following app scenarios require code to handle Conditional Access challenges?

- [ ] Apps performing the device-code flow
- [x] Apps performing the on-behalf-of flow
- [ ] Apps performing the Integrated Windows authentication flow

Answer: Apps performing the on-behalf-of flow require code to handle Conditional Access challenges.  
The Integrated Windows authentication flow allows applications on domain or Azure Active Directory (Azure AD) joined computers to acquire a token silently.

---

Question: Which of the following MSAL libraries supports single-page web apps?

- [ ] MSAL Node
- [x] MSAL.js
- [ ] MSAL.NET

Answer: MSAL.js supports single-page applications.

---

Question: What does the Microsoft Identity platform assume if the resource identifier is omitted in the scope parameter during requests to authorization, token, or consent endpoints?

- [ ] The resource is Microsoft Outlook.
- [ ] The resource is Microsoft Azure.
- [x] The resource is Microsoft Graph.
- [ ] The resource is Microsoft Office 365.
- [ ] The resource is Key Vault.

Answer: if the resource identifier is omitted in the scope parameter, the resource is assumed to be Microsoft Graph.

---

Question: In the context of the Microsoft Identity platform, what is the function of the `scope` parameter?

- [ ] It sets the access level of the user.
- [x] It indicates the type of resource being requested.
- [ ] It determines the user's authentication mechanism.
- [ ] It manages the duration of the session.

Answer: It indicates the type of resource being requested.

---

What happens if a user attempts to access Microsoft Key Vault with `scope=User.Read` in the Microsoft Identity platform?

- [ ] The request is successful and the user can access Key Vault data.
- [x] The request fails because User.Read will assume wrong resource type.
- [ ] The request fails due to insufficient user permissions.
- [ ] The request is successful but the user the user can only see key names, not the key values.

Answer: Use `https://vault.azure.net/.default` instead

---

Question: Which of the following authorization flows are primarily utilized by Public client applications:

- [x] Authorization code
- [ ] Client credentials
- [x] On-behalf-of
- [x] Implicit
- [x] Device code
- [x] Integrated Windows
- [x] Interactive
- [x] Username/password

Answer: User-facing apps without the ability to securely store secrets

---

Question: Which of the following authorization flows are primarily utilized by Confidential client applications:

- [ ] Authorization code
- [x] Client credentials
- [x] On-behalf-of
- [ ] Implicit
- [ ] Device code
- [x] Integrated Windows
- [ ] Interactive
- [x] Username/password

Answer: Server-based apps that can securely handle secrets

---

Question: You are tasked to build an application that will run on mobile devices and web browsers. This application needs to securely obtain tokens in the name of the user, using an Authorization Code flow. Which application builder should you use?

- [x] `PublicClientApplicationBuilder`
- [ ] `ConfidentialClientApplicationBuilder`

Answer: User-facing apps without the ability to securely store secrets

---

Question: Your company is developing a service application that will run without user interaction. It will make use of the Client Credentials flow to access resources. Which application builder should you use?

- [ ] `PublicClientApplicationBuilder`
- [x] `ConfidentialClientApplicationBuilder`

Answer: Server-based apps that can securely handle secrets

---

Question: Which of the following is NOT a function of the Microsoft Authentication Library (MSAL)?

- [ ] Manages token cache and automatically refreshes tokens when needed.
- [ ] Assists in multi-factor authentication process.
- [x] Provides proactive security threat alerts for user accounts.
- [ ] Obtains tokens for users or applications when applicable.
- [ ] Assists with application setup from configuration files.
- [ ] Enables Single Sign-On (SSO) across multiple applications.
- [ ] Supports application to application communication through On-Behalf-Of (OBO) flow.
- [x] Automatically resolves API versioning conflicts.
- [x] Provides optimized API depending on the platform (.Net, Node, Android, Python, etc.)

Answer: MSAL does not provide proactive security threat alerts as this is typically handled by dedicated security tools or systems, and it doesn't automatically resolve API versioning conflicts as this is typically a function of the API management or the individual application logic. The API is unified across platforms.

---

Question: You have an application registered in Azure AD and you have configured `appsettings.json` as follows:

```json
{
  "clientId": "your-client-id",
  "tenantId": "your-tenant-id"
}
```

Your application is currently configured to perform requests to Microsoft Graph API on behalf of a user. Here is the relevant code snippet:

```cs
private static IAuthenticationProvider CreateAuthorizationProvider(string authType)
{
    var config = new ConfigurationBuilder()
        .SetBasePath(System.IO.Directory.GetCurrentDirectory())
        .AddJsonFile("appsettings.json", false, true).Build();

    List<string> scopes = new List<string>();
    scopes.Add(clientId + "/.default");

    IPublicClientApplication client;
    string authority = $"https://login.microsoftonline.com/{config.tenantId}/v2.0";

    client = PublicClientApplicationBuilder.Create(config.clientId)
                .WithAuthority(new Uri(authority))
                .Build();

    return MsalAuthenticationProvider.GetInstance(client, scopes.ToArray());
}
```

However, your application is evolving into a service application (daemon) that needs to access Microsoft Graph API on behalf of itself, not on behalf of a user. Additionally, due to varying security requirements across different environments, your application needs to support both client secret and client certificate for authentication. The `authType` parameter in the `CreateAuthorizationProvider` function is intended to determine the authentication method, but it is currently unused. Certificate must by obtained by name (`MyCertificate.pfx` - stored in configuration) from KeyVault account `cert-holder`.

How should you modify the `appsettings.json` and the code to meet these new requirements?

Answer: You should modify `appsettings.json` to include the client secret, path, and password of your client certificate:

```json
{
  "clientId": "your-client-id",
  "tenantId": "your-tenant-id",
  "clientSecret": "your-client-secret",
  "certificateName": "MyCertificate.pfx"
}
```

The code should be modified as follows:

```cs
private static IAuthenticationProvider CreateAuthorizationProvider(string authType)
{
    var config = new ConfigurationBuilder()
        .SetBasePath(System.IO.Directory.GetCurrentDirectory())
        .AddJsonFile("appsettings.json", false, true).Build();

    List<string> scopes = new List<string>();
    scopes.Add(clientId + "/.default");

    IConfidentialClientApplication client;
    string authority = $"https://login.microsoftonline.com/{config.tenantId}/v2.0";

    ConfidentialClientApplicationBuilder builder = ConfidentialClientApplicationBuilder.Create(config.clientId)
                .WithAuthority(new Uri(authority));

    if (authType == "secret")
        client = builder.WithClientSecret(config.clientSecret).Build();
    else if (authType == "certificate")
    {
        var client = new CertificateClient(new Uri("https://cert-holder.vault.azure.net"), new DefaultAzureCredential());
        var certificate = await client.GetCertificateAsync(config.certificateName);
        // Alt: X509Certificate2 certificate = new X509Certificate2(config.certificatePath, config.certificatePassword);
        client = builder.WithCertificate(certificate).Build();
    }
    else
        throw new ArgumentException("Invalid authentication type");

    return MsalAuthenticationProvider.GetInstance(client, scopes.ToArray());
}
```

---

Question: You have a Microsoft Azure subscription in which you want to deploy a .NET Core v3.1 model-view controller (MVC) application. You add the following authorization policies in your Startup.ConfigureServices method:

```csharp
services.AddAuthorization(options =>
{
    options.AddPolicy("EmployeePolicy", policy =>
    {
        policy.RequireAuthenticatedUser();
        policy.RequireRole("Employee");
    });
    options.AddPolicy("ReatailPolicy", policy =>
    {
        policy.RequireAuthenticatedUser();
        policy.RequireRole("Manager");
        policy.RequireClaim("Department", "Sales");
    });
    options.AddPolicy("AreaPolicy", policy =>
    {
        policy.RequireAuthenticatedUser();
        policy.RequireClaim("Department");
    });
});
```

How should you assign the authorization directives in the code, based on requirements stated in comments? Fill in the blanks:

```cs
// All users with both the `Employee` and `Manager` roles should always be allowed
[Authorize(/* ... */)]
public class EmployeeController : Controller
{
    public IActionResult Index() => Content("Employee Controller");
}

public class SalesController : Controller
{
    // Users with the `Manager` role and with a `Department` claim of `Sales`
    [Authorize(/* ... */)]
    public IActionResult ManageSales() => Content("Sales Management");
}

public class DepartmentController : Controller
{
    // Users with `Department` claim
    [Authorize(/* ... */)]
    public IActionResult ManageDepartment() => Content("Department Management");
}
```

Answer:

```cs
[Authorize(Roles = "Employee")]
[Authorize(Roles = "Manager")]
public class EmployeeController : Controller
{
    public IActionResult Index() => Content("Employee Controller");
}

public class SalesController : Controller
{
    [Authorize(Policy = "ReatailPolicy")]
    public IActionResult ManageSales() => Content("Sales Management");
}

public class DepartmentController : Controller
{
    [Authorize(Policy = "AreaPolicy")]
    public IActionResult ManageDepartment() => Content("Department Management");
}
```

---

Question: You are creating an internal portal for staff members to access confidential financial reports. The portal uses Azure AD for user authentication. The staff accounts are currently on Azure AD Basic licenses. You are tasked with setting up multi-factor authentication (MFA) for a specific team of staff members. Which two steps should you take?

- [ ] Activate application proxy in Azure AD.
- [ ] Set up the portal to utilize Azure AD business-to-consumer (B2C).
- [ ] Enable security defaults in Azure AD.
- [x] Upgrade the staff accounts to Azure AD Premium P1.
- [x] Establish a new conditional access policy in Azure AD.

Answer: Conditional access policies require Azure AD Premium P1 licenses.  
Security defaults enable MFA for **ALL** users, which does not meat requirenments for specific staff members.

---
