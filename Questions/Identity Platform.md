# Authentication and authorization

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

Question: Which of the following types of shared access signatures (SAS) applies to Blob storage only?

- [ ] Account SAS
- [ ] Service SAS
- [x] User delegation SAS

Answer: A user delegation SAS is secured with Azure Active Directory credentials and also by the permissions specified for the SAS. A user delegation SAS applies to Blob storage only.  
An account SAS delegates access to resources in one or more of the storage services. All of the operations available via a service or user delegation SAS are also available via an account SAS.  
A service SAS delegates access to a resource in the following Azure Storage services: Blob storage, Queue storage, Table storage, or Azure Files.

---

Question: Which of the following best practices provides the most flexible and secure way to use a service or account shared access signature (SAS)?

- [x] Associate SAS tokens with a stored access policy.
- [ ] Always use HTTPS
- [ ] Implement a user delegation SAS

Answer: The most flexible and secure way to use a service or account SAS is to associate the SAS tokens with a stored access policy.  
A user delegation SAS is the most secure SAS, but isn't highly flexible because you must use Azure Active Directory to manage credentials.  
Using HTTPS prevents man-in-the-middle attacks but isn't the most flexible and secure practice.

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

However, your application is evolving into a service application (daemon) that needs to access Microsoft Graph API on behalf of itself, not on behalf of a user. Additionally, due to varying security requirements across different environments, your application needs to support both client secret and client certificate for authentication. The `authType` parameter in the `CreateAuthorizationProvider` function is intended to determine the authentication method, but it is currently unused.

How should you modify the `appsettings.json` and the code to meet these new requirements?

Answer: You should modify `appsettings.json` to include the client secret, path, and password of your client certificate:

```json
{
  "clientId": "your-client-id",
  "tenantId": "your-tenant-id",
  "clientSecret": "your-client-secret",
  "certificatePath": "path-to-your-certificate.pfx",
  "certificatePassword": "your-certificate-password"
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
        X509Certificate2 certificate = new X509Certificate2(config.certificatePath, config.certificatePassword);
        client = builder.WithCertificate(certificate).Build();
    }
    else
        throw new ArgumentException("Invalid authentication type");

    return MsalAuthenticationProvider.GetInstance(client, scopes.ToArray());
}
```

Remember to upload the certificate to the Azure AD App registration in the Azure portal. This approach is more secure than using a client secret, as the certificate is harder to compromise. However, it requires more setup, as you need to create, manage, and renew the certificate.

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
