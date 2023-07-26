# [Microsoft Graph](https://learn.microsoft.com/en-us/graph/)

Provides a unified programmability model that you can use to access data in Microsoft 365, Windows 10, and Enterprise Mobility + Security.

- Endpoint: `https://graph.microsoft.com`. Can manage user and device identity, access, compliance, security, and help protect organizations from data leakage or loss.

- [Microsoft Graph connectors](https://learn.microsoft.com/en-us/microsoftsearch/connectors-overview) work in the incoming direction, **delivering data external to the Microsoft cloud into Microsoft Graph services and applications**, to enhance Microsoft 365 experiences such as Microsoft Search. Connectors exist for many commonly used data sources such as Box, Google Drive, Jira, and Salesforce.

- [Microsoft Graph Data Connect](https://learn.microsoft.com/en-us/graph/overview#access-microsoft-graph-data-at-scale-using-microsoft-graph-data-connect) provides a set of tools to streamline secure and scalable delivery of **Microsoft Graph data to popular Azure data stores**. The cached data serves as data sources for Azure development tools that you can use to build intelligent applications.

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
- Pagination is handled via `@odata.nextLink`.

| Method | Description                                  |
| ------ | -------------------------------------------- |
| GET    | Read data from a resource.                   |
| POST   | Create a new resource, or perform an action. |
| PATCH  | Update a resource with new values.           |
| PUT    | Replace a resource with a new one.           |
| DELETE | Remove a resource.                           |

- For the CRUD methods `GET` and `DELETE`, no request body is required.
- The `POST`, `PATCH`, and `PUT` methods require a request body specified in JSON format.

### Examples

My photo: `https://graph.microsoft.com/v1.0/me/photo/$value`  
Items in my drive: `https://graph.microsoft.com/v1.0/me/drive/root/children`  
My todos: `https://graph.microsoft.com/v1.0/me/todo/lists`  
My manager: `https://graph.microsoft.com/v1.0/me/manager`  
Trending insights: `https://graph.microsoft.com/v1.0/me/insights/trending`  
Alerts, filter by Category, top 5: `https://graph.microsoft.com/v1.0/security/alerts?$filter=Category eq 'ransomware'&$top=5`  
Filter by relationship value, select specific fields: `https://graph.microsoft.com/v1.0/groups?$filter=adatumisv_courses/id eq '123'&$select=id,displayName,adatumisv_courses`

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

var user = await graphClient.Me
    .Request()
    .GetAsync();

var messages = await graphClient.Me.Messages
    .Request()
    .Select(m => new {
        m.Subject,
        m.Sender
    })
    .Filter("<filter condition>")
    .OrderBy("receivedDateTime")
    .GetAsync();

var message = await graphClient.Me.Messages[messageId]
    .Request()
    .DeleteAsync();

var newCalendar = await graphClient.Me.Calendars
    .Request()
    .AddAsync(new Calendar() { /* ... */});
```
