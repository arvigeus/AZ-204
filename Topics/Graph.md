# [Microsoft Graph](https://learn.microsoft.com/en-us/graph/)

Provides a unified programmability model that you can use to access data in Microsoft 365, Windows 10, and Enterprise Mobility + Security.

- Endpoint: `https://graph.microsoft.com`. Can manage user and device identity, access, compliance, security, and help protect organizations from data leakage or loss.

- [Microsoft Graph connectors](https://learn.microsoft.com/en-us/microsoftsearch/connectors-overview): delivering **data external to the Microsoft cloud into Microsoft Graph services and applications** (Box, Google Drive, Jira, and Salesforce).
- [Microsoft Graph Data Connect](https://learn.microsoft.com/en-us/graph/data-connect-concept-overview): delivering **Microsoft Graph data to popular Azure data stores**.

## Resources

Resource specify the entity or complex type you're interacting with, like `me`, `user`, `group`, `drive`, or `site`. Top-level resources may have relationships, allowing access to other resources, like `me/messages` or `me/drive`. Interactions with resources are done through methods, e.g., `me/sendMail` for sending an email. Permissions needed for each resource may vary, with higher permissions often required for creation or updates compared to reading. [More on permissions](https://learn.microsoft.com/en-us/graph/permissions-reference).

## [Headers](https://learn.microsoft.com/en-us/graph/use-the-api#headers)

Include standard and custom HTTP types. Certain APIs might need extra headers in requests. Mandatory headers like the `request-id` are always returned by Microsoft Graph, and certain headers, like `Retry-After` during throttling or `Location` for long-running operations, are specific to certain APIs or features.

**Evolvable enumerations**: By default, a GET operation returns only known (existing) members for properties. Adding members to existing enumerations can break applications already using these enums. You can opt in to receive all members by using an HTTP `Prefer` request header.

## Query Microsoft Graph by using REST

[Graph Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer)

### [Metadata](https://learn.microsoft.com/en-us/graph/traverse-the-graph?tabs=http#microsoft-graph-api-metadata)

`https://graph.microsoft.com/v1.0/$metadata`

Metadata in Microsoft Graph provides insight into its data model, including entity types, complex types, and enumerations present in request and response data. It defines types, methods, and enumerations in OData namespaces, with most of the API in the namespace `microsoft.graph` and some in subnamespaces like `microsoft.graph.callRecords`. It helps understand relationships between entities and enables URL navigation between them.

### Using REST

```http
{HTTP method} https://graph.microsoft.com/{version}/{resource}?{query-parameters}
```

- HTTP _Authorization_ request header, as a _Bearer_ token
- [Pagination](https://learn.microsoft.com/en-us/graph/paging) is handled via `@odata.nextLink`.

| Method | Description                                  |
| ------ | -------------------------------------------- |
| GET    | Read data from a resource.                   |
| POST   | Create a new resource, or perform an action. |
| PATCH  | Update a resource with new values.           |
| PUT    | Replace a resource with a new one.           |
| DELETE | Remove a resource.                           |

- For the CRUD methods `GET` and `DELETE`, no request body is required.
- The `POST`, `PATCH`, and `PUT` methods require a request body specified in JSON format.

#### Examples

Sure, here's the table based on the provided information:

| Operation                                | URL                                                                                                                      |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| GET my profile                           | `https://graph.microsoft.com/v1.0/me`                                                                                    |
| GET my files                             | `https://graph.microsoft.com/v1.0/me/drive/root/children`                                                                |
| GET my photo                             | `https://graph.microsoft.com/v1.0/me/photo/$value`                                                                       |
| GET my photo metadata                    | `https://graph.microsoft.com/v1.0/me/photo/`                                                                             |
| GET my mail                              | `https://graph.microsoft.com/v1.0/me/messages`                                                                           |
| GET my high importance email             | `https://graph.microsoft.com/v1.0/me/messages?$filter=importance eq 'high'`                                              |
| GET my calendar events                   | `https://graph.microsoft.com/v1.0/me/events`                                                                             |
| GET my manager                           | `https://graph.microsoft.com/v1.0/me/manager`                                                                            |
| GET last user to modify file foo.txt     | `https://graph.microsoft.com/v1.0/me/drive/root/children/foo.txt/lastModifiedByUser`                                     |
| GET Microsoft 365 groups I'm a member of | `https://graph.microsoft.com/v1.0/me/memberOf/$/microsoft.graph.group?$filter=groupTypes/any(a:a eq 'unified')`          |
| GET users in my organization             | `https://graph.microsoft.com/v1.0/users`                                                                                 |
| GET groups in my organization            | `https://graph.microsoft.com/v1.0/groups`                                                                                |
| GET people related to me                 | `https://graph.microsoft.com/v1.0/me/people`                                                                             |
| GET items trending around me             | `https://graph.microsoft.com/beta/me/insights/trending`                                                                  |
| GET my recent activities                 | `https://graph.microsoft.com/v1.0//me/activities/recent`                                                                 |
| PATCH (update) a recent activity of mine | `https://graph.microsoft.com/v1.0//me/activities/{activityId}`                                                           |
| GET my notes                             | `https://graph.microsoft.com/v1.0/me/onenote/notebooks`                                                                  |
| Select specific fields                   | `https://graph.microsoft.com/v1.0/groups?$filter=adatumisv_courses/id eq '123'&$select=id,displayName,adatumisv_courses` |
| Alerts, filter by Category, top 5        | `https://graph.microsoft.com/v1.0/security/alerts?$filter=Category eq 'ransomware'&$top=5`                               |

#### Using MSAL

```cs
var authority = "https://login.microsoftonline.com/" + tenantId;
var scopes = new []{ "https://graph.microsoft.com/.default" };

var app = ConfidentialClientApplicationBuilder.Create(clientId)
    .WithAuthority(authority)
    .WithClientSecret(clientSecret)
    .Build();

var result = await app.AcquireTokenForClient(scopes).ExecuteAsync();

var httpClient = new HttpClient();
var request = new HttpRequestMessage(HttpMethod.Get, "https://graph.microsoft.com/v1.0/me");
request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", result.AccessToken);

var response = await httpClient.SendAsync(request);
var content = await response.Content.ReadAsStringAsync();
```

### Using SDK

```csharp
var scopes = new[] { "User.Read" };

// Multi-tenant apps can use "common",
// single-tenant apps must use the tenant ID from the Azure portal
var tenantId = "common";

// Value from app registration
var clientId = "YOUR_CLIENT_ID";

// using Azure.Identity;
var options = new TokenCredentialOptions
{
    AuthorityHost = AzureAuthorityHosts.AzurePublicCloud
};

// Using device code: https://learn.microsoft.com/dotnet/api/azure.identity.devicecodecredential
var deviceOptions = new DeviceCodeCredentialOptions
{
    AuthorityHost = AzureAuthorityHosts.AzurePublicCloud,
    ClientId = clientId,
    TenantId = tenantId,
    // Callback function that receives the user prompt
    // Prompt contains the generated device code that user must
    // enter during the auth process in the browser
    DeviceCodeCallback = (code, cancellation) =>
    {
        Console.WriteLine(code.Message);
        return Task.FromResult(0);
    },
};
var credential = new DeviceCodeCredential(deviceOptions);
// var credential = new DeviceCodeCredential(callback, tenantId, clientId, options);

// Using a client certificate: https://learn.microsoft.com/dotnet/api/azure.identity.clientcertificatecredential
// var clientCertificate = new X509Certificate2("MyCertificate.pfx");
// var credential = new ClientCertificateCredential(tenantId, clientId, clientCertificate, options);

// Using a client secret: https://learn.microsoft.com/dotnet/api/azure.identity.clientsecretcredential
// var credential = new ClientSecretCredential(tenantId, clientId, clientSecret, options);

// On-behalf-of provider
// var oboToken = "JWT_TOKEN_TO_EXCHANGE";
// var onBehalfOfCredential = new OnBehalfOfCredential(tenantId, clientId, clientSecret, oboToken, options);

var graphClient = new GraphServiceClient(credential, scopes);

var user = await graphClient.Me.GetAsync();

var messages = await graphClient.Me.Messages
.GetAsync(requestConfig =>
{
    requestConfig.QueryParameters.Select =
        new string[] { "subject", "sender" };
    requestConfig.QueryParameters.Filter =
        "subject eq 'Hello world'";

    requestConfig.Headers.Add(
        "Prefer", @"outlook.timezone=""Pacific Standard Time""");
});

var message = await graphClient.Me.Messages[messageId].GetAsync();

var newCalendar = await graphClient.Me.Calendars
    .PostAsync(new Calendar { Name = "Volunteer" }); // new

await graphClient.Teams["teamId"]
    .PatchAsync(new Team { }); // update

await graphClient.Me.Messages[messageId]
    .DeleteAsync();
```

## Token acquisition flow

- **Acquire an Authorization Code**: `GET https://login.microsoftonline.com/{tenant}/oauth2/authorize`
- **Acquire an Access Token**: `POST https://login.microsoftonline.com/customer.com/oauth2/token`
- **Call Microsoft Graph**:

  ```http
  GET https://graph.microsoft.com/beta/users
  Authorization: Bearer <token>
  ```

## [Permissions](https://learn.microsoft.com/en-us/graph/permissions-reference)

`<Resource>.<Permission>` or `<Resource>.<Permission>.<Optional-Constrain>`

Example for `Users`:

- Current user: `User.Read`, `User.ReadWrite`
- All users (require admin consent): `User.Read.All`, `User.ReadWrite.All`, `User.ReadBasic.All` (no admin consent)

The optional `All` sonstrain grants access to all users.

Example for `Calendars`:

- Current user's calendars: `Calendars.Read`, `Calendars.ReadWrite`
- Calendars shared with current user: `Calendars.Read.Shared`, `Calendars.ReadWrite.Shared`

The optional `Shared` constrain grants access to calendars user has access to, there is no `All` contrain.
