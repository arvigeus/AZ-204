# Case Study: Entra ID Application Manifest

Contoso Corp is a multinational company that has recently decided to move its applications to Azure. The company has a web application that is used by both employees and external vendors. The application is registered in Microsoft Entra ID.

Requirements:

- The application should be multi-tenant, allowing users from other organizations to sign in.
- External vendors should be able to access only a specific part of the application.
- All external vendors must go through Multi-Factor Authentication (MFA)
- The application should be able to read basic profile information of the signed-in user.
- The application should support roles like "Employee" (Contoso Corp only) and "Vendor" (external vendors) to differentiate access levels.
- dynamically assign users to the "Employee" or "Vendor" role based on their department information in Microsoft Entra ID
- Add custom claims for department and job title in Microsoft Entra ID tokens

---

## Question 1

Which of the following manifest settings should you modify to allow users from other organizations to sign in?

- [ ] `"signInAudience": "AzureADMyOrg"`
- [ ] `"signInAudience": "AzureADandPersonalMicrosoftAccount"`
- [ ] `"signInAudience": "AzureADMultipleOrgs"`
- [ ] `"groupMembershipClaims": "SecurityGroup"`
- [ ] `"availableToOtherTenants": true`

## Question 2

To differentiate between employees and vendors, you decide to implement role-based access control (RBAC) in the application. You need to define "Employee" and "Vendor" roles in the Microsoft Entra ID application manifest.

Which property should you set and what value should it have?

```jsonc
{
  "???": [
    {
      "description": "Employees of Contoso Corp",
      "displayName": "Employee"
      // properties here
    },
    {
      "description": "External vendors",
      "displayName": "Vendor"
      // properties here
    }
  ]
}
```

## Question 3

Which of the following approaches can be used to restrict external vendors to a specific part of the application based on their role?

- [ ] Use Microsoft Entra ID Conditional Access policies.
- [ ] Implement role checks in the application code.
- [ ] Use Microsoft Entra ID B2C custom policies.
- [ ] Modify the oauth2AllowImplicitFlow setting in the application manifest.

## Question 4

Which of the following methods can be used to make roles like "Employee" and "Vendor" specific to Contoso Corp and external vendors?

- [ ] Use Microsoft Entra ID custom roles and claims.
- [ ] Implement domain and role checks in the application code.
- [ ] Modify the groupMembershipClaims in the application manifest.
- [ ] Use Microsoft Entra ID Privileged Identity Management (PIM).

## Question 5

Which of the following permissions should be granted to the application in Microsoft Entra ID to read the user's basic profile information?

- [ ] User.Read
- [ ] User.ReadWrite
- [ ] Directory.Read.All
- [ ] User.ReadBasic.All

## Question 6

Which Azure feature would you use to dynamically assign users to roles based on their department?

- [ ] Microsoft Entra ID Conditional Access
- [ ] Microsoft Entra ID Group-based Licensing
- [ ] Microsoft Entra ID Privileged Identity Management (PIM)
- [ ] Microsoft Entra ID Dynamic User Groups

## Question 7

Contoso Corp wants to include custom claims in the tokens issued by Microsoft Entra ID for the application. These custom claims should include the user's department and job title from Microsoft Entra ID.

Which Azure feature would you use to include custom claims in the tokens?

- [ ] Microsoft Entra ID Conditional Access
- [ ] Microsoft Entra ID Token Configuration
- [ ] Microsoft Entra ID B2C Custom Policies
- [ ] Microsoft Entra ID OAuth 2.0 Authorization Code Flow

## Question 8

How to include user's department and job title custom claims into the application manifest?

## Question 9

What are pre-requisites for enabling Multi-Factor Authentication (MFA)? Solution should be cost effective.

- [ ] Configure Microsoft Entra ID B2C with social identity providers only.
- [ ] Use Microsoft Entra ID B2B and only allow guest users to access the application.
- [ ] Use to Microsoft Entra ID Premium P1 plan
- [ ] Use to Microsoft Entra ID Premium P2 plan

## Question 10

For all external vendors to go through Multi-Factor Authentication (MFA) when accessing the application, which configurations must be set?
Options:

- [ ] Configure `Microsoft Entra ID -> Security -> Conditional Access -> New Policy`
- [ ] Configure `Microsoft Entra ID -> Enterprise applications -> Your Application -> Conditional Access`
- [ ] Configure `Azure Portal -> Microsoft Entra ID -> Users -> Multi-Factor Authentication`
- [ ] Enable `Security defaults`

## Question 11

Contoso Corp's application needs to access Azure services on behalf of the application itself, not on behalf of a user.

In which section of the Microsoft Entra ID application manifest would you configure that?

- [ ] `keyCredentials`
- [ ] `passwordCredentials`
- [ ] `appRoles`
- [ ] `oauth2AllowImplicitFlow`

## Question 12

Contoso Corp wants to include group membership claims in the tokens so that the application can make authorization decisions based on the groups a user belongs to.

Which property should you use and what value should you set to include group membership claims in the tokens?

Property:

- [ ] `groupMembershipClaims`
- [ ] `appRoles`
- [ ] `oauth2Permissions`
- [ ] `requiredResourceAccess`

Value:

- [ ] `None`
- [ ] `SecurityGroup`
- [ ] `All`
- [ ] `DirectoryRole`

## Question 13

Contoso Corp decides to build a microservices architecture. They have multiple APIs and a front-end application, all of which authenticate using the same Microsoft Entra ID application. They want to ensure that tokens issued are only valid for the intended audience (API or front-end).

Which property should Contoso Corp configure to ensure that tokens are only valid for the intended audience?

- [ ] `groupMembershipClaims`
- [ ] `allowPublicClient`
- [ ] `knownClientApplications`
- [ ] `preAuthorizedApplications`
- [ ] `identifierUris`

## Question 14

Contoso Corp wants to enforce a custom authorization policy on one of their API endpoints. Specifically, they want to restrict access to users who have a role claim of either "Employee" and also have a custom claim "department" set to "Sales".

Complete the following C# code snippets to enforce the custom authorization policy in an ASP.NET Core application.

```cs
// Startup.cs
public void ConfigureServices(IServiceCollection services)
{
    services.AddAuthorization(options =>
    {
        options.AddPolicy("CanViewOrdersPolicy", policy =>
        {
            // Policies here
        });
    });
}

// OrdersController.cs
[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    [HttpGet("GetOrders")]
    [Authorize(Policy = "????")]
    public IActionResult GetOrders() => Ok(new { Orders = "List of orders" });
}
```

---

## Answer 1

- `"signInAudience": "AzureADMultipleOrgs"`: This setting allows users from multiple Microsoft Entra ID organizations to sign in, making the application multi-tenant.

Incorrect:

- `"signInAudience": "AzureADMyOrg"` will restrict sign-ins to only users from Contoso Corp's domain.
- `groupMembershipClaims` is about emitting claims for user membership in security groups, not about multi-tenancy.
- `"availableToOtherTenants": true` is a legacy setting and not the best choice for enabling multi-tenancy in modern Microsoft Entra ID configurations.

## Answer 2

Define "Employee" and "Vendor" roles in the Microsoft Entra ID application manifest:

```jsonc
{
  "appRoles": [
    {
      "description": "Employees of Contoso Corp",
      "displayName": "Employee",
      "allowedMemberTypes": ["User"],
      "value": "Employee"
    },
    {
      "description": "External vendors",
      "displayName": "Vendor",
      "allowedMemberTypes": ["User"],
      "value": "Vendor"
    }
  ]
}
```

## Answer 3

- Implementing role checks in the application code allows you to control access to specific parts of the application based on the user's role, which aligns with the requirement.

Incorrect:

- Microsoft Entra ID Conditional Access policies are generally used for enforcing organization-wide policies like MFA, IP restrictions, etc., and are not typically used for application-level role-based access control.
- Microsoft Entra ID B2C is more geared towards consumer identities and social logins, and it's not the right tool for this internal/external role differentiation.
- The oauth2AllowImplicitFlow setting is related to the OAuth 2.0 implicit flow and doesn't have a direct impact on role-based access within the application.

## Answer 4

- Implement domain and role checks in the application code: You can check the user's domain and role claims in the application code to ensure they are specific to Contoso Corp.

Incorrect:

- Use Microsoft Entra ID custom roles and claims: While custom roles and claims can be defined in Microsoft Entra ID, they don't inherently restrict roles to be specific to Contoso Corp. That logic would need to be implemented in the application code.
- Modify the groupMembershipClaims in the application manifest: This setting is used to emit groups that the user is a member of as claims in the token. It doesn't restrict roles to a specific domain.
- Use Microsoft Entra ID Privileged Identity Management (PIM): PIM is used for managing, controlling, and monitoring access within Microsoft Entra ID, Azure, and other Microsoft Online Services. It's not used for making roles specific to a particular organization like Contoso Corp.

## Answer 5

- `User.Read` is the least privileged permission that allows the application to read the profile of the signed-in user, which aligns with the requirement.

Incorrect:

- `User.ReadWrite` would allow the application to modify the user's profile, which is not needed based on the current requirements. You're correct that this would be the choice if the application needed to modify user profiles.
- `Directory.Read.All` is over-permissive for this requirement, as it would allow reading data in the directory, not just the user's profile.
- `User.ReadBasic.All` would indeed require admin consent and would allow the application to read basic profiles of all users in the directory, which is not needed in this scenario.

## Answer 6

Microsoft Entra ID Dynamic User Groups allows you to create groups with rule-based memberships, which can be based on attributes like department. You can then assign these dynamic groups to roles in your application.

For dynamically assigning roles, you would typically create a dynamic user group based on the department attribute and then assign this group to the respective role in Microsoft Entra ID. This way, as users' department information changes, they would be automatically added or removed from the dynamic group, and their role assignment in the application would change accordingly.

Incorrect:

- Microsoft Entra ID Conditional Access is more about enforcing security policies during the sign-in process.
- Microsoft Entra ID Group-based Licensing is for assigning licenses to users based on group membership, not for role assignments.
- Microsoft Entra ID Privileged Identity Management (PIM) is more about managing, controlling, and monitoring access within Microsoft Entra ID, Azure, and other Microsoft Online Services. It's not used for dynamic role assignments based on attributes like department.

## Answer 7

- Microsoft Entra ID Token Configuration allows you to customize the claims issued in the tokens, which aligns with the requirement to include custom claims like department and job title.

Incorrect:

- Microsoft Entra ID Conditional Access is more about enforcing security policies during the sign-in process and doesn't deal with customizing tokens.
- Microsoft Entra ID B2C Custom Policies are more geared towards consumer identities and social logins, and they're not the right tool for this internal token customization.
- Microsoft Entra ID OAuth 2.0 Authorization Code Flow is a part of the OAuth 2.0 specification for acquiring tokens but doesn't directly allow for customizing the claims in those tokens.

## Answer 8

To include custom claims like the user's department and job title, you would typically use the "optionalClaims" section in the Microsoft Entra ID application manifest:

```jsonc
{
  "optionalClaims": {
    "idToken": [
      {
        "name": "department",
        "source": "user",
        "essential": true
      },
      {
        "name": "jobTitle",
        "source": "user",
        "essential": true
      }
    ]
  }
}
```

## Answer 9

MFA requires Microsoft Entra ID Premium P2 plan

Incorrect:

- Microsoft Entra ID B2C is more for consumer-facing applications and doesn't inherently enforce MFA for external vendors.
- Use Microsoft Entra ID B2B and only allow guest users to access the application: Microsoft Entra ID B2B is for business-to-business collaborations and doesn't inherently enforce MFA.

## Answer 10

- Configure `Microsoft Entra ID -> Security -> Conditional Access -> New Policy`: This option allows you to create a Conditional Access policy that targets specific users or groups, in this case, external vendors. You can enforce MFA as a requirement for accessing the application. This is a granular way to enforce MFA only for external vendors.

- Configure `Microsoft Entra ID -> Enterprise applications -> Your Application -> Conditional Access`: This is another way to enforce MFA but at the application level. You can create a Conditional Access policy specifically for the application in question, targeting external vendors and requiring MFA.

Incorrect:

- Configuring `Azure Portal -> Microsoft Entra ID -> Users -> Multi-Factor Authentication` and enabling `Security defaults` would enforce MFA for all users, not just external vendors.

## Answer 11

- The `keyCredentials` section is where you would typically add application secrets when you want to authenticate as the application itself.

Incorrect:

- `passwordCredentials` could technically be used, but it's not the recommended approach for application-level secrets.
- `appRoles` is for defining roles within the application and is not related to application secrets.
- `oauth2AllowImplicitFlow` is a setting related to OAuth 2.0 flows and not directly related to application secrets.

## Answer 12

`groupMembershipClaims: SecurityGroup` will include user membership for security groups and Microsoft Entra ID roles in the claims.

## Answer 13

The `identifierUris` property is used to specify the URIs that Microsoft Entra ID uses for performing application identification and token audience validation. When a token is issued, the aud claim in the token will contain the value of the identifierUris that identifies the intended audience of the token.

## Answer 14

```cs
// Startup.cs
public void ConfigureServices(IServiceCollection services)
{
    services.AddAuthorization(options =>
    {
        options.AddPolicy("CanViewOrdersPolicy", policy =>
        {
            policy.RequireRole("Employee", "Vendor");
            policy.RequireClaim("CanViewOrders", "true");
        });
    });
}

// OrdersController.cs
[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    [HttpGet("GetOrders")]
    [Authorize(Policy = "CanViewOrdersPolicy")]
    public IActionResult GetOrders() => Ok(new { Orders = "List of orders" });
}
```
