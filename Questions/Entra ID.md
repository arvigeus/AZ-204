# Entra ID

Question: You are tasked with providing secure remote access to an on-premises application for your organization's employees. Which action should you perform?

- [x] Activate application proxy in Microsoft Entra ID.
- [ ] Upgrade the staff accounts to Microsoft Entra ID Premium P1.
- [ ] Establish a new conditional access policy in Microsoft Entra ID.
- [ ] Set up the portal to utilize Microsoft Entra ID business-to-consumer (B2C).

Answer: The correct action is to activate application proxy in Microsoft Entra ID. Microsoft Entra ID Application Proxy provides secure remote access to on-premises applications.

---

Question: Your organization is planning to collaborate with a partner company on a project. You need to provide the partner company's users with access to certain applications in your Microsoft Entra ID. Which action should you perform?

- [ ] Activate application proxy in Microsoft Entra ID.
- [ ] Upgrade the staff accounts to Microsoft Entra ID Premium P1.
- [ ] Establish a new conditional access policy in Microsoft Entra ID.
- [x] Configure the applications to use Microsoft Entra ID business-to-business (B2B).

Answer: The correct action is to configure the applications to use Microsoft Entra ID business-to-business (B2B). Microsoft Entra ID B2B allows you to share your company's applications with external users in a secure manner.

---

Question: As an administrator for a startup utilizing Microsoft Entra ID for identity and access management, you're tasked with implementing mandatory multi-factor authentication for all users. What is the most appropriate step to take?

- [ ] Implement Microsoft Entra ID business-to-consumer (B2C).
- [ ] Upgrade to Microsoft Entra ID Premium P1 for all user accounts.
- [ ] Establish a new conditional access policy in Microsoft Entra ID.
- [x] Activate security defaults in Microsoft Entra ID.
- [ ] Set up an application proxy in Microsoft Entra ID.

Answer: The most appropriate step is to activate security defaults in Microsoft Entra ID. This feature provides a basic level of security, including mandatory multi-factor authentication for all users, at no additional cost. The other options, while useful in certain scenarios, do not directly address the requirement of enabling mandatory multi-factor authentication for all users.

---

Question: Your organization uses Microsoft Entra ID for identity management. You want to implement a policy that triggers multi-factor authentication (MFA) when a sign-in is deemed risky. Which two actions should you perform?

- [ ] Activate application proxy in Microsoft Entra ID.
- [ ] Upgrade the staff accounts to Microsoft Entra ID Premium P1.
- [x] Upgrade the staff accounts to Microsoft Entra ID Premium P2.
- [x] Establish a new risk-based conditional access policy in Microsoft Entra ID.
- [ ] Enable security defaults in Microsoft Entra ID.
- [ ] Configure the applications to use Microsoft Entra ID business-to-business (B2B).

Answer: The correct actions are to upgrade the staff accounts to Microsoft Entra ID Premium P2 and establish a new risk-based conditional access policy in Microsoft Entra ID. Risk-based policies require access to Microsoft Entra ID Identity Protection, which is an Microsoft Entra ID Premium P2 feature.

---

Question: In Microsoft Entra ID, what happens to Conditional Access policies when the licenses required for them expire?

- [ ] The policies are automatically disabled.
- [ ] The policies are automatically deleted.
- [x] The policies remain active and can be viewed and deleted, but no longer updated.
- [ ] Nothing changes for existing conditional policies.
- [ ] The policies are automatically replaced with default security policies.

Answer: When licenses required for Conditional Access expire, the policies aren't automatically disabled or deleted. They remain active and can be viewed and deleted, but they can no longer be updated.

---

Question: You are developing an application that uses Microsoft Entra ID for authentication. The application needs to authorize users based on their group membership in the organization. The application should receive this information in the user's token when they authenticate. How would you configure your application in Microsoft Entra ID to achieve this?

- [ ] Enable the `OAuth2AllowImplicitFlow` attribute in the application manifest.
- [ ] Set the `requiredResourceAccess` attribute in the application manifest to include the group IDs.
- [x] Configure the `groupMembershipClaims` attribute in the application manifest.
- [ ] Add the group IDs to the `knownClientApplications` attribute in the application manifest.

Answer: `groupMembershipClaims` is used to emit group claims in the token that the application receives when a user authenticates. The other options do not directly influence the emission of group claims in the token.

---

Question: You are developing an application that uses Microsoft Entra ID for authentication. The application needs to authorize users based on their group membership in the organization. However, due to the large number of groups in your organization, you want to limit the groups included in the user's token to only Security Groups. How would you configure the `groupMembershipClaims` attribute in your application's manifest in Microsoft Entra ID to achieve this?

- [ ] Set `groupMembershipClaims` to `All`
- [ ] Set `groupMembershipClaims` to `None`
- [x] Set `groupMembershipClaims` to `SecurityGroup`
- [ ] Set `groupMembershipClaims` to `DirectoryRole`

Answer: Set `groupMembershipClaims` to `SecurityGroup` will ensure that only Security Group memberships are included in the user's token. The other options either include too many groups ("All"), no groups ("None"), or a different type of group ("DirectoryRole").

---

Question: In the context of Microsoft Entra ID, which of the following statements correctly describes the difference between AppRoles and Groups?

- [ ] AppRoles and Groups are both specific to an application and are removed when the application is removed.
- [ ] AppRoles are specific to an Microsoft Entra ID tenant, while Groups are specific to an application.
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
The Integrated Windows authentication flow allows applications on domain or Microsoft Entra ID joined computers to acquire a token silently.

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

Question: What happens if a user attempts to access Microsoft Key Vault with `scope=User.Read` in the Microsoft Identity platform?

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

Question: You have an application registered in Microsoft Entra ID and you have configured `appsettings.json` as follows:

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

Question: You are creating an internal portal for staff members to access confidential financial reports. The portal uses Microsoft Entra ID for user authentication. The staff accounts are currently on Microsoft Entra ID Basic licenses. You are tasked with setting up multi-factor authentication (MFA) for a specific team of staff members. Which two steps should you take?

- [ ] Activate application proxy in Microsoft Entra ID.
- [ ] Set up the portal to utilize Microsoft Entra ID business-to-consumer (B2C).
- [ ] Enable security defaults in Microsoft Entra ID.
- [x] Upgrade the staff accounts to Microsoft Entra ID Premium P1.
- [x] Establish a new conditional access policy in Microsoft Entra ID.

Answer: Conditional access policies require Microsoft Entra ID Premium P1 licenses.  
Security defaults enable MFA for **ALL** users, which does not meat requirenments for specific staff members.

---

Question: Which component is responsible for directing the user to the location defined by the redirect URI or reply URL, following successful authorization of the app and the granting of an authorization code or access token?

- [ ] Client Application
- [x] Authorization Server
- [ ] Resource Server
- [ ] User's Browser

Answer: The authorization Server is the specific component in the OAuth process that directs the user to the designated location (either a redirect URI or reply URL) after the app has been successfully authorized and an authorization code or access token has been granted.

---

Question: In Microsoft Entra ID, what is the requirement for applications to delegate identity and access management?

- [ ] Applications can optionally register with Microsoft Entra ID.
- [ ] Applications must register with a third-party identity provider.
- [x] Applications must register with Microsoft Entra ID.
- [ ] Registration with Microsoft Entra ID is discouraged for client applications.

Answer: In Microsoft Entra ID, all applications must register to delegate identity and access management. This registration process allows the application to be integrated with Microsoft Entra ID, enabling features like authentication, authorization, and more.

---

Question: You are developing a web application using ASP.Net Core. The application needs to authenticate users via Microsoft Entra ID and also needs to access Azure Blob Storage on behalf of the authenticated users. What settings should you set in API permissions pane to allow this?

Answer:

Microsoft Graph: Set `User.Read` to "Delegate" to allow application to read the user's profile only when the user is signed in.

Azure Storage: Set `user_impersonation` to "Delegate" to allow the application to access Azure Storage only when the user is signed in.

---

Question: You are developing a web application using ASP.Net Core. The application needs to authenticate users via Microsoft Entra ID and also access Azure Blob Storage on behalf of the authenticated users. Which of the following permissions should be set to "Delegated" in the Azure Portal to meet these requirements?

- [x] `Microsoft Graph > User.Read`
- [ ] `Microsoft Graph > User.ReadWrite`
- [ ] `Microsoft Graph > user_impersonation`
- [ ] `Microsoft Graph > Microsoft Greaph Reader`
- [x] `Azure Storage > user_impersonation`
- [ ] `Azure Storage > Storage Blob Data Reader`
- [ ] `Azure Storage > Files.Read`
- [ ] `Microsoft Graph > Files.Read`

Answer:

Microsoft Graph > User.Read should be set to "Delegated". This allows the application to authenticate users and read their basic profile on their behalf.

Azure Storage > user_impersonation should be set to "Delegated". This allows the application to access Azure Blob Storage on behalf of the authenticated users.

---

Question: You are developing a web application using ASP.Net Core. The application needs to authenticate users via Microsoft Entra ID. What value should be set for the `Microsoft Graph > User.Read` permission in the Azure Portal to meet this requirement?

- [ ] None
- [ ] Application
- [x] Delegated
- [ ] Admin

Answer: "Delegated" allows the application to authenticate users and read their basic profile on their behalf.

---

Question: Your ASP.Net Core web application also needs to access Azure Blob Storage on behalf of the authenticated users. What value should be set for the `Azure Storage > user_impersonation` permission in the Azure Portal to meet this requirement?

- [ ] None
- [ ] Application
- [x] Delegated
- [ ] Admin

Answer: "Delegated" allows the application to access Azure Blob Storage on behalf of the authenticated users.

---

Question: You are a solutions architect for 'StreamBox,' a video streaming service. The company wants to implement a feature that allows users to quickly sign in using their social media credentials like Instagram, Reddit, or Google, in addition to their regular email accounts. Which Azure service should be utilized to meet this requirement?

- [ ] Microsoft Entra ID B2B
- [ ] Azure Multi-Factor Authentication
- [x] Microsoft Entra ID B2C
- [ ] Microsoft Entra ID Single Tenant Authentication

Answer: Emtra ID B2C supports authentication through a variety of social media platforms and email accounts, making it the most suitable choice for this scenario.

---

Question: Click on the following steps in the correct order to integrate authentication and authorization working with the Microsoft identity platform for Web API:

- [x] Store token cache
- [x] Register app
- [x] Control access to web API (authorization)
- [x] Configure app with code sample
- [x] Configure permission & call API of choice
- [x] Validate access token
- [x] Configure secrets & certificates

Answer:

1. Register app
1. Configure app with code sample
1. Validate access token
1. Configure secrets & certificates
1. Configure permission & call API of choice
1. Control access to web API (authorization)
1. Store token cache

---

Question: Click on the following steps in the correct order to protect an API in Azure API Management with Microsoft Entra ID:

- [x] Register the backend API application in Microsoft Entra ID.
- [x] Register the web App (website containing summarized results) in Microsoft Entra ID so that it can call the backend API.
- [x] Allow permissions between the website app to call the backend API app. Add the configurations in Microsoft Entra ID.
- [x] Enable OAuth 2.0 user authorization and add the validate-jwt policy to validate the OAuth token for API calls.

Answer:

1. Register the backend API application in Microsoft Entra ID.
1. Register the web App (website containing summarized results) in Microsoft Entra ID so that it can call the backend API.
1. Allow permissions between the website app to call the backend API app. Add the configurations in Microsoft Entra ID.
1. Enable OAuth 2.0 user authorization and add the validate-jwt policy to validate the OAuth token for API calls.

---

Question: You need to implement authentication for two applications: a web application and an API. Only users from a specific Entra ID tenant should be able to access both applications. Which of the following account types should you select to meet the security requirements?

- [ ] Accounts in any organizational directory (Any Microsoft Entra ID directory - Multitenant)
- [ ] Accounts in any organizational directory (Any Microsoft Entra ID directory - Multitenant) and personal Microsoft accounts
- [x] Accounts in this organizational directory only (Single tenant)
- [ ] Personal Microsoft accounts only

Answer: This option restricts access to only users in the specific Entra ID tenant, meeting the requirement.  
Allowing accounts from any organizational directory would violate the requirements.  
Personal Microsoft accounts are related to Skype, Xbox, etc accounts.

---

Question: You are tasked with developing a web-based solution that will be hosted on Azure. The application should enforce secure access through Microsoft Entra ID. The requirements are as follows:

- Users should authenticate using their Microsoft Entra ID accounts.
- The application should offer personalized experiences based on the user's Entra ID group memberships.

How would you modify the Microsoft Entra ID application manifest file to meet these requirements?

```jsonc
{
  "appId": "your-app-id-here",
  "displayName": "Your App Name"
  // Write related properties here
}
```

Answer:

```jsonc
{
  "appId": "your-app-id-here",
  "displayName": "Your App Name",
  "groupMembershipClaims": "SecurityGroup",
  "oauth2AllowImplicitFlow": true
}
```

`groupMembershipClaims` will include the user's security group memberships in the claims whenever a token is requested. `oauth2AllowImplicitFlow` is often relevant when you're working with SPAs or other scenarios where the Implicit Grant Flow is used.

---

Question : You created a new user account named AppAdmin. You must assign the role of Application Administrator to the AppAdmin user account. What should you do?

- [x] Assign the `Administrator` role
- [ ] Add to `Administrators` group
- [ ] Add "Request Admin" access policy

Answer: Administrator is a role.  
Adding the user to the admin group doesn’t mean that the Application Administrator’s role is automatically assigned to the user account.

---
