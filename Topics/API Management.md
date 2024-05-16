# [Azure API Management](https://docs.microsoft.com/en-us/azure/api-management/)

## [Tiers](https://learn.microsoft.com/en-us/azure/api-management/api-management-features)

- **Consumption Tier**: No Entra ID integration, private endpoint support for inbound connections, developer portal, built-in cache, built-in analytics, backup and restore, management over Git, direct management API, Azure Monitor and Log Analytics request logs, Static IP.
- **Developer Tier**: Like Premium, without multi-region deployment and availability zones.
- **Basic Tier**: No Entra ID integration, and workspaces.
- **Standard Tier**: Has Entra ID Integration and worspaces.
- **Premium Tier**: Has VNET, multiple custom domain names, self-hosted gateway

## Components

- **API Gateway**: Endpoint that routes API calls, verifies credentials, enforces quotas and limits, transforms requests/responses specified in policy statements, caches responses, and produces logs/metrics for monitoring.
- **Management Plane**: Administrative interface for service settings, define and import API schema, packaging APIs into products, policy setup, analytics, and user management.
- **Developer Portal**: Auto-generated website for API documentation that enables developers to access API details, use interactive consoles, create an account and subscribe for API keys, analyze usage, download API definitions, and manage API keys.

## Products

Products bundle APIs for developers. They have a title, description, and usage terms. They can be **Open** (usable without subscription) or **Protected** (requires subscription). Subscription approval is either auto-approved or needs admin approval.

## Groups

Groups control product visibility to developers. API Management has three unchangeable system groups:

- **Administrators**: Manage service instances, APIs, operations, and products. Azure subscription admins are in this group.
- **Developers**: Authenticated portal users can build apps using your APIs. They access the Developer portal to use API operations and can be created by admins, invited, or self-registered. They belong to multiple groups and can subscribe to group-visible products.
- **Guests**: Unauthenticated portal users with potential read-only access, such as viewing APIs but not calling them.

Apart from system groups, admins can form custom groups or use external groups from related Microsoft Entra ID tenants.

## [API Gateways](https://learn.microsoft.com/en-us/azure/architecture/microservices/design/gateway)

API gateways, such as Azure's API Management gateway, manage communication between clients and multiple front- and back-end services, which eliminates the need for clients to know specific endpoints (think of gateways as _reverse proxy_). These gateways streamline service integration, particularly when services are updated or introduced. They also take care of tasks like SSL termination, authentication, and rate limiting. Azure's API Management gateway specifically proxies API requests, enforces policies, and gathers telemetry data.

- **Managed** gateways are default components deployed in Azure for each API Management instance. They handle all API traffic, regardless of where the APIs are hosted.
- **Self-hosted** gateways are optional, containerized versions of managed gateways. They are suited for hybrid and multicloud environments, allowing management of on-premises APIs and APIs across multiple clouds from a single Azure API Management service.

## [Policies overview](https://learn.microsoft.com/en-us/azure/api-management/api-management-howto-policies)

A set of statements executed sequentially on an API's request or response. They can be applied at different scopes:

- **Global Scope**: Apply organization-wide policies that affect every API and operation. Ideal for enforcing security measures like IP filtering or logging across all APIs.
- **Workspace Scope**: Target APIs within a specific workspace. Best for internal organization, separating APIs based on teams or departments.
- **Product Scope**: Group multiple APIs under a single product to simplify the subscription process. Best for external organization, grouping APIs based on functionality or business logic.
- **API Scope**: Apply policies that affect all operations within a specific API. Useful for API-specific transformations or validations.
- **Operation Scope**: Fine-grained control over individual API operations. Ideal for operation-specific validations or transformations.

### Types of policies

- **Inbound**: Applied before routing to the backend. Examples: validation, authentication, rate limiting, request transformation.
- **Backend**: Applied before the request reaches the backend. Examples: URL rewriting, setting headers.
- **Outbound**: Applied to the response before sent to the client. Examples: response transformation, caching, adding headers.

Note: If client expects response in certain format (example: XML), check question to see what kind of endpoint is used (example: JSON). If they are different, transform policy should be applied (example: `json-to-xml-policy`)

### Policy Configuration

`<base />`: execute the default policies that are defined at other scopes (e.g., the Product or Global scope). Provides the ability to enforce policy evaluation order.

```xml
<policies>
  <inbound>
    <!-- statements to be applied to the request go here -->
  </inbound>
  <backend>
    <!-- statements to be applied before the request is forwarded to
         the backend service go here -->
  </backend>
  <outbound>
    <!-- statements to be applied to the response go here -->
  </outbound>
  <on-error>
    <!-- statements to be applied if there is an error condition go here -->
  </on-error>
</policies>
```

**All times are in seconds!**  
**All sizes are in KB!**

### [Named values](https://learn.microsoft.com/en-us/azure/api-management/api-management-howto-properties?tabs=azure-cli)

Add a named value: `Dashboard > API Management Services > service > Named values`

**Types:**

- Plain: Literal string or policy expression
- Secret: Literal string or policy expression that is encrypted by API Management
- [Key vault](https://learn.microsoft.com/en-us/azure/api-management/api-management-howto-properties): Identifier of a secret stored in an Azure key vault. After update in the key vault, a named value in API Management is updated within 4 hours. Requires managed identity. Configure either a _key vault access policy_ or _Azure RBAC access_ for an API Management managed identity. Key Vault Firewall requires _system-assigned managed identity_.

Add a secret:

```sh
az apim nv create --resource-group $resourceGroup \
    --display-name "named_value_01" --named-value-id named_value_01 \
    --secret true --service-name apim-hello-world --value test
```

To use a named value in a policy, place its display name inside a double pair of braces like `{{ContosoHeader}}`. If the value is an expression, it will be evaluated. If the value is the name of another named value - not.

### Policy Expressions

Can be used as attribute values or text values in any of the API Management policies. They can be a single C# statement enclosed in `@(expression)` or a multi-statement C# code block, enclosed in `@{expression}`, that returns a value.

Example `set-body`:

```xml
<set-body>
  @{
    var response = context.Response.Body.As<JObject>();
    foreach (var key in new [] {"minutely", "hourly", "daily", "flags"}) {
    response.Property (key).Remove ();
    }
  return response.ToString();
  }
</set-body>
```

### [Throttling](https://learn.microsoft.com/en-us/azure/api-management/api-management-sample-flexible-throttling)

Use `rate-limit-by-key` (limit number of requests) or `quota-by-key` (limit bandwidth and/or number of requests). Renewal period is in _seconds_, bandwidth size is in _KB_. Use `counter-key` to specify identity or IP.

When quota is exceeded, a `403 Forbidden` status is returned.

- Throttle by IP: `counter-key="@(context.Request.IpAddress)"`
- Throttle by Identity: `counter-key="@(context.Request.Headers.GetValueOrDefault("Authorization","").AsJwt()?.Subject)"`

### [Caching](https://learn.microsoft.com/en-us/azure/api-management/api-management-sample-cache-by-key)

Azure APIM has built-in support for HTTP response caching using the resource URL as the key. You can modify the key using request headers with the vary-by properties.

- Get from cache (`cache-lookup`): inbound
- Store to cache (`cache-store`): outbound
- Others are mixed

#### Examples

##### Cache by header

```http
https://myapi.azure-api.net/me
Authorization: Bearer <access_token>
```

Endpoint is not unique, but the authorization header is for each user.

```xml
<cache-lookup>
    <vary-by-header>Authorization</vary-by-header>
</cache-lookup>
```

##### Cache by query parameter

```http
https://myapi.azure-api.net/samples?topic=apim&section=caching
```

Endpoint has two query parameters: `topic` and `section`. Use semicolon to separate.

```xml
<cache-lookup>
    <vary-by-query-parameter>topic;section</vary-by-query-parameter>
</cache-lookup>
```

##### Cache by url

```http
https://myapi.azure-api.net/items/123456
```

Endpoint has no parameters, but the url is unique. This time use empty string.

```xml
<cache-lookup>
    <vary-by-query-parameter></vary-by-query-parameter>
</cache-lookup>
```

##### Fragment caching

When you want to add some information from external system to the current response, without fetching it every time. For example `/me/tasks` returns user's todos and profile, but the profile is stored at `/userprofile/{userid}`. To avoid fetching profile every time, the following rules must be implemented:

```xml
<!-- Extract userId from JWT -->
<set-variable
  name="enduserid"
  value="@(context.Request.Headers.GetValueOrDefault("Authorization","").Split(' ')[1].AsJwt()?.Subject)" />

<!-- Data is supposed to be stored in userprofile (for example) -->
<!-- If userprofile is not cached yet, send a request and store the response in cache -->
<choose>
    <when condition="@(!context.Variables.ContainsKey("userprofile"))">
        <!-- Make an HTTP request to /userprofile/{userid} in order to retrieve it  -->
        <send-request params>options</send-request>

        <!-- Store to cache -->
        <cache-store-value
          key="@("userprofile-" + context.Variables["enduserid"])"
          value="@(((IResponse)context.Variables["userprofileresponse"]).Body.As<string>())" duration="100000" />
    </when>
</choose>

<!-- Use userprofile from cache -->
<cache-lookup-value
  key="@("userprofile-" + context.Variables["enduserid"])"
  variable-name="userprofile" />
```

## API Security

### [Via Entra ID](https://learn.microsoft.com/en-us/azure/api-management/api-management-howto-protect-backend-with-aad)

1. Register an application in Entra ID to represent the API
1. Configure a JWT validation policy to pre-authorize requests (`validate-jwt`)

### [Managed Identities](https://learn.microsoft.com/en-us/azure/api-management/api-management-howto-use-managed-service-identity)

Use the `authentication-managed-identity` policy to authenticate with a service through managed identity. It gets an access token from Microsoft Entra ID and sets it in the `Authorization` header using the Bearer scheme. The token is cached until it expires. If no client-id is given, the system-assigned identity is used.

Example: `<authentication-managed-identity resource="resource" client-id="clientid of user-assigned identity" output-token-variable-name="token-variable" ignore-error="true|false"/>`, where resource could be `https://graph.microsoft.com`, `https://management.azure.com/`, etc.

Use cases:

- Obtain a custom TLS/SSL certificate for the API Management instance from Azure Key Vault
- Store and manage named values from Azure Key Vault
- Authenticate to a backend by using a user-assigned identity
- Log events to an event hub

### Via Subscriptions

API Management lets you secure APIs using subscription keys. Developers have to include these keys in HTTP requests when accessing APIs. If not, API Management gateway rejects the requests. The subscription keys come from subscriptions, which developers can get without needing permission from API publishers. Apart from this, OAuth2.0, Client certificates, and IP allow listing are other security methods.

#### [Subscription Keys](https://learn.microsoft.com/en-us/azure/api-management/api-management-subscriptions)

A subscription key is a unique, automatically generated key included in client request headers or as a query string parameter. It's tied to a subscription which can have different scopes providing varied access levels. Subscriptions let you control permissions and policies minutely.

Three main subscription scopes:

- **All APIs**: Grants access to all APIs configured in the service.
- **Single API**: Access control limited to a specific API and its endpoints.
- **Product**: Applies to a particular product (a collection of APIs) in API Management, each with different access rules, usage quotas, and terms of use.

Keys need to be included in every request to a protected API. They can be regenerated if needed, such as if a key is leaked. Subscriptions have a primary and a secondary key to aid in regeneration without downtime. In products with enabled subscriptions, clients must provide a key when calling APIs. They can get a key via a subscription request.

##### Calling API with Subscription Key

API calls need a valid key in HTTP requests. This can be passed in the request header or as a query string. The default header name is **Ocp-Apim-Subscription-Key**, and the default query string is **subscription-key**. APIs can be tested using the developer portal or command-line tools like curl. Here are example curl commands using a header and a URL query string:

```sh
curl --header "Ocp-Apim-Subscription-Key: <key string>" https://<apim gateway>.azure-api.net/api/path
```

```sh
curl https://<apim gateway>.azure-api.net/api/path?subscription-key=<key string>
```

Failure to pass the key results in a **401 Access Denied** response.

### [API Security with Certificates](https://learn.microsoft.com/en-us/azure/api-management/api-management-howto-mutual-certificates-for-clients)

- `authentication-certificate`: Used by APIM to authenticate itself to the backend service.
- `validate-client-certificate` (_inbound_): Used by APIM to validate the client's certificate connecting to the APIM.

Configure access to key vault:

- Access policy: `Access Policies > + Create > Secret permissions > Permissions tab > Get and List ; Principal tab > principal > managed identity > Next > Review + create > Create`
- RBAC access: `Access control (IAM) > Add role assignment > Role tab > Key Vault Secrets User ; Members tab > Managed identity > + Select members > identity`

#### TLS Client Authentication

API gateways inspect client certificates for specific attributes, such as Certificate Authority (CA), Thumbprint, Subject, and Expiration Date. These can be combined for custom policies.

Certificates are signed to avoid tampering. Validate received certificates to ensure they're authentic. Trusted CAs or physically delivered self-signed certificates are ways to confirm authenticity.

In the _Consumption_ tier client certificates must be _manually enabled_ on the **Custom domains** page.

#### Check the thumbprint against certificates uploaded to API Management

Use `<when condition="$(...)">` policy with `<return-response>` and `<set-status code="403" reason="Invalid client certificate" />`:

```cs
// Client certificate
context.Request.Certificate == null || context.Request.Certificate.Thumbprint != "desired-thumbprint"

// Certificates uploaded to API Management
context.Request.Certificate == null || !context.Request.Certificate.Verify() || !context.Deployment.Certificates.Any(c => c.Value.Thumbprint == context.Request.Certificate.Thumbprint)

// Check the issuer and subject of a client certificate
context.Request.Certificate == null || context.Request.Certificate.Issuer != "trusted-issuer" || context.Request.Certificate.SubjectName.Name != "expected-subject-name"
```

## [Error handling](https://learn.microsoft.com/en-us/azure/api-management/api-management-error-handling-policies)

- Azure API Management uses a `ProxyError` object, accessed via `context.LastError`, for handling errors during request processing.
- Policies are divided into inbound, backend, outbound, and on-error sections. Processing jumps to the on-error section if an error occurs.
- If there's no on-error section, callers receive `400` or `500` HTTP response messages during an error.
- Predefined errors exist for built-in steps and policies, each with a source, condition, reason, and message.
- Custom behavior, like logging errors or creating new responses, can be configured in the on-error section.

## Versions and Revisions

- Use **Revisions** for non-breaking changes, allowing for testing and updates without affecting existing users. Users can access different revisions by using a different query string at the same endpoint.
- Use **Versions** for breaking changes, requiring publishing and potentially requiring users to update their applications.

[Versioning schemes](https://learn.microsoft.com/en-us/azure/api-management/api-management-versions):

- Path-based versioning: `https://apis.contoso.com/products/v1` and `https://apis.contoso.com/products/v2`
- Header-based versioning: For example, custom header named `Api-Version,` and clients specify `v1` or `v2`
- Query string-based versioning: `https://apis.contoso.com/products?api-version=v1` and `https://apis.contoso.com/products?api-version=v2`

_Header-based versioning_ if the _URL has to stay the same_. Revisions and other types of versioning schemas require modified URL.

Creating separate gateways or web APIs would force users to access a different endpoint. A separate gateway provides complete isolation.

```sh
az apim api release create --resource-group $resourceGroup \
    --api-id demo-conference-api --api-revision 2 --service-name apim-hello-world \
    --notes 'Testing revisions. Added new "test" operation.'

az group deployment create --resource-group $resourceGroup --template-file ./apis.json --parameters apiRevision="20191206" apiVersion="v1" serviceName=<serviceName> apiVersionSetName=<versionSetName> apiName=<apiName> apiDisplayName=<displayName>
```

## [Integrating backend API with APIM](https://learn.microsoft.com/en-us/azure/api-management/import-and-publish)

Create OpenAPI documentation for the backend API, then import it into APIM. This enables integration with APIM and allows for automatic discovery of all endpoints. APIM becomes a facade for the backend API, providing customization without altering the backend API itself.

## [Monitoring](https://learn.microsoft.com/en-us/azure/api-management/api-management-howto-use-azure-monitor)

Azure API Management emits metrics every minute, providing near real-time visibility into the state and health of your APIs. The most frequently used metrics are 'Capacity' and 'Requests'. 'Capacity' helps you make decisions about upgrading/downgrading your API Management services, while 'Requests' helps you analyze API traffic.

## Working with API Management instance

Create new APIM:

```sh
az apim create --name MyAPIMInstance --resource-group $resourceGroup --location eastus --publisher-name "My Publisher" --publisher-email publisher@example.com --sku-name Developer
# or
New-AzApiManagement -ResourceGroupName RESOURCE_GROUP -Name NAME -Location LOCATION -Organization ORGANIZATION -AdminEmail ADMIN_EMAIL [-Sku SKU_NAME] [-Tags TAGS]
```

## [Policies reference](https://learn.microsoft.com/en-us/azure/api-management/api-management-policies)

| Name                               | Example                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Notes                                                                                                                                                                                                                                                                                                                                 | Sections                    |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| Check HTTP header                  | `<check-header name="header name" failed-check-httpcode="code" failed-check-error-message="message" ignore-case="true \| false">`<br>&nbsp;&nbsp;`<value>Value1</value>`<br>&nbsp;&nbsp;`<value>Value2</value>`<br>`</check-header>`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | When multiple value elements are specified, the check is considered a success if any one of the values is a match.                                                                                                                                                                                                                    | inbound                     |
| Get authorization context          | `<get-authorization-context`<br>&nbsp;&nbsp;`provider-id="authorization provider id"`<br>&nbsp;&nbsp;`authorization-id="authorization id"`<br>&nbsp;&nbsp;`context-variable-name="variable name"`<br>&nbsp;&nbsp;`identity-type="managed \| jwt"`<br>&nbsp;&nbsp;`identity="JWT bearer token"`<br>&nbsp;&nbsp;`ignore-error="true \| false" />`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | `context-variable-name` is the name of the context variable to receive the Authorization object (`{accessToken: string, claims: Record<string, object>}`). Configure `identity-type=jwt` when the access policy for the authorization is assigned to a service principal. Only `/.default` app-only scopes are supported for the JWT. | inbound                     |
| Restrict caller IPs                | `<ip-filter action="allow \| forbid">`<br>&nbsp;&nbsp;`<address>address</address>`<br>&nbsp;&nbsp;`<address-range from="address" to="address" />`<br>`</ip-filter>`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | At least one `address` or `address-range` element is required.                                                                                                                                                                                                                                                                        | inbound                     |
| Validate Microsoft Entra ID token  | `Simple token validation: <validate-azure-ad-token tenant-id="{{aad-tenant-id}}">`<br>&nbsp;&nbsp;`<client-application-ids>`<br>&nbsp;&nbsp;&nbsp;&nbsp;`<application-id>{{aad-client-application-id}}</application-id>`<br>&nbsp;&nbsp;`</client-application-ids>`<br>`</validate-azure-ad-token>`<br>`Validate that audience and claim are correct: <validate-azure-ad-token tenant-id="{{aad-tenant-id}}" output-token-variable-name="jwt">`<br>&nbsp;&nbsp;`<client-application-ids>`<br>&nbsp;&nbsp;&nbsp;&nbsp;`<application-id>{{aad-client-application-id}}</application-id>`<br>&nbsp;&nbsp;`</client-application-ids>`<br>&nbsp;&nbsp;`<audiences>`<br>&nbsp;&nbsp;&nbsp;&nbsp;`<audience>@(context.Request.OriginalUrl.Host)</audience>`<br>&nbsp;&nbsp;`</audiences>`<br>&nbsp;&nbsp;`<required-claims>`<br>&nbsp;&nbsp;&nbsp;&nbsp;`<claim name="ctry" match="any">`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`<value>US</value>`<br>&nbsp;&nbsp;&nbsp;&nbsp;`</claim>`<br>&nbsp;&nbsp;`</required-claims>`<br>`</validate-azure-ad-token>`                                                        | To validate a JWT that was provided by another identity provider, use the generic `validate-jwt`. You can secure the whole API with Entra ID authentication by applying the policy on the API level, or you can apply it on the API operation level and use claims for more granular control.                                         | inbound                     |
| Validate client certificate        | `<validate-client-certificate`<br>&nbsp;&nbsp;`validate-revocation="true \| false"`<br>&nbsp;&nbsp;`validate-trust="true \| false"`<br>&nbsp;&nbsp;`validate-not-before="true \| false"`<br>&nbsp;&nbsp;`validate-not-after="true \| false"`<br>&nbsp;&nbsp;`ignore-error="true \| false">`<br>&nbsp;&nbsp;`<identities>`<br>&nbsp;&nbsp;&nbsp;&nbsp;`<identity `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`thumbprint="certificate thumbprint"`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`serial-number="certificate serial number"`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`common-name="certificate common name"`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`subject="certificate subject string"`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`dns-name="certificate DNS name"`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`issuer-subject="certificate issuer"`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`issuer-thumbprint="certificate issuer thumbprint"`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`issuer-certificate-id="certificate identifier" />`<br>&nbsp;&nbsp;`</identities>`<br>`</validate-client-certificate>` | `identities` is not required                                                                                                                                                                                                                                                                                                          | inbound                     |
| Control flow                       | `<choose>`<br>&nbsp;&nbsp;`<when condition="Boolean expression \| Boolean constant">`<br>&nbsp;&nbsp;&nbsp;&nbsp;`<!— one or more policy statements to be applied if the above condition is true  -->`<br>&nbsp;&nbsp;`</when>`<br>&nbsp;&nbsp;`<when condition="Boolean expression \| Boolean constant">`<br>&nbsp;&nbsp;&nbsp;&nbsp;`<!— one or more policy statements to be applied if the above condition is true  -->`<br>&nbsp;&nbsp;`</when>`<br>&nbsp;&nbsp;`<otherwise>`<br>&nbsp;&nbsp;&nbsp;&nbsp;`<!— one or more policy statements to be applied if none of the above conditions are true  -->`<br>&nbsp;&nbsp;`</otherwise>`<br>`</choose>`                                                                                                                                                                                                                                                                                                                                                                                                                                                     | The choose policy must contain at least one `<when/>` element. The `<otherwise/>` element is optional.                                                                                                                                                                                                                                | Any                         |
| Limit concurrency                  | `<limit-concurrency key="expression" max-count="number">`<br>&nbsp;&nbsp;`<!— nested policy statements -->`<br>`</limit-concurrency>`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Prevents enclosed policies from executing by more than the specified number of requests at any time. When that number is exceeded, new requests will fail immediately with the `429 Too Many Requests` status. Example key: `key="@((string)context.Variables["connectionId"])"` code.                                                | Any                         |
| Rate limit                         | `<rate-limit-by-key calls="number"`<br>&nbsp;&nbsp;`counter-key="key value" `<br>&nbsp;&nbsp;`renewal-period="seconds"`<br>`/>`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Renewal period is in seconds                                                                                                                                                                                                                                                                                                          | inbound                     |
| Quota                              | `<quota-by-key counter-key="key value" bandwidth="kilobytes" renewal-period="seconds" />`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Bandwidth is in KB, renewal period is in seconds                                                                                                                                                                                                                                                                                      | inbound                     |
| Emit custom metrics                | `<emit-metric name="name of custom metric" value="value of custom metric" namespace="metric namespace">`<br>&nbsp;&nbsp;`<dimension name="dimension name" value="dimension value" />`<br>`</emit-metric>`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Sends custom metrics in the specified format to Application Insights. You can configure at most 10 custom dimensions for this policy. Counts toward the usage limits for custom metrics per region in a subscription.                                                                                                                 | Any                         |
| Forward request                    | `<forward-request http-version="1 \| 2or1 \| 2" timeout="time in seconds" continue-timeout="time in seconds" follow-redirects="false \| true" buffer-request-body="false \| true" buffer-response="true \| false" fail-on-error-status-code="false \| true"/>`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | By default, this policy is set at the global scope.                                                                                                                                                                                                                                                                                   | backend                     |
| Log to event hub                   | `<log-to-eventhub logger-id="id of the logger entity" partition-id="index of the partition where messages are sent" partition-key="value used for partition assignment">`<br>`Expression returning a string to be logged`<br>`</log-to-eventhub>`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | The policy is not affected by Application Insights sampling. All invocations of the policy will be logged. Max message size: 200 KB (otherwise truncated).                                                                                                                                                                            | Any                         |
| Mock response                      | `<mock-response status-code="code" content-type="media type"/>`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Cancels normal pipeline execution. It prioritizes response content examples, using schemas when available and generating sample responses (or no content is returned). Policy expressions can't be used in attribute values for this policy.                                                                                          | inbound, outbound, on-error |
| Retry                              | `<retry`<br>&nbsp;&nbsp;`condition="Boolean expression or literal"`<br>&nbsp;&nbsp;`count="number of retry attempts"`<br>&nbsp;&nbsp;`interval="retry interval in seconds"`<br>&nbsp;&nbsp;`max-interval="maximum retry interval in seconds"`<br>&nbsp;&nbsp;`delta="retry interval delta in seconds"`<br>&nbsp;&nbsp;`first-fast-retry="boolean expression or literal">`<br>&nbsp;&nbsp;`<!-- One or more child policies. No restrictions. -->`<br>`</retry>`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Executes its child policies once and then retries their execution until the `retry` condition becomes `false` or retry `count` is exhausted. When only the `interval` and `delta` are specified, the wait time between retries increases: `interval + (count - 1)*delta`.                                                             | Any                         |
| Return response                    | `<return-response response-variable-name="existing context variable">`<br>&nbsp;&nbsp;`<set-status>...</set-status>`<br>&nbsp;&nbsp;`<set-header>...</set-header>`<br>&nbsp;&nbsp;`<set-body>...</set-body>`<br>`</return-response>`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Pipeline cancelation, body removal, custom or default response return to caller. Context variable and policy statements modify response if both provided.                                                                                                                                                                             | Any                         |
| Send request                       | `<send-request mode="new \| copy" response-variable-name="" timeout="seconds" ignore-error="false \| true">`<br>&nbsp;&nbsp;`<set-url>request URL</set-url>`<br>&nbsp;&nbsp;`<set-method>...</set-method>`<br>&nbsp;&nbsp;`<set-header>...</set-header>`<br>&nbsp;&nbsp;`<set-body>...</set-body>`<br>&nbsp;&nbsp;`<authentication-certificate thumbprint="thumbprint" />`<br>&nbsp;&nbsp;`<proxy>...</proxy>`<br>`</send-request>`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Default timeout: 60sec                                                                                                                                                                                                                                                                                                                | Any                         |
| Set HTTP proxy                     | `<proxy url="http://hostname-or-ip:port" username="username" password="password" />`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Only HTTP is supported between the gateway and the proxy. Basic and NTLM authentication only. `username` and `password` are not required.                                                                                                                                                                                             | inbound                     |
| Set request method                 | `<set-method>HTTP method</set-method>`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Policy expressions are allowed.                                                                                                                                                                                                                                                                                                       | inbound, on-error           |
| Set Status Code                    | `<set-status code="HTTP status code" reason="description"/>`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | -                                                                                                                                                                                                                                                                                                                                     | Any                         |
| Set Variable                       | `<set-variable name="variable name" value="Expression \| String literal" />`<br>`<set-variable name="IsMobile" value="@(context.Request.Headers.GetValueOrDefault("User-Agent","").Contains("iPad") \|\| context.Request.Headers.GetValueOrDefault("User-Agent","").Contains("iPhone"))" />`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | If the expression contains a literal it will be converted to a string                                                                                                                                                                                                                                                                 | Any                         |
| Authenticate with Basic            | `<authentication-basic username="username" password="password" />`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Sets the HTTP Authorization header. Recommended using named values to provide credentials, with secrets protected in a key vault.                                                                                                                                                                                                     | inbound                     |
| Authenticate with managed identity | `<authentication-managed-identity resource="resource" client-id="clientid of user-assigned identity" output-token-variable-name="token-variable" ignore-error="true\|false"/>`<br>`<authentication-managed-identity resource="AD_application_id" output-token-variable-name="msi-access-token" ignore-error="false" />`<br>`<!--Application (client) ID of your own Entra ID Application-->`<br>`<set-header name="Authorization" exists-action="override">`<br>&nbsp;&nbsp;`<value>@("Bearer " + (string)context.Variables["msi-access-token"])</value>`<br>`</set-header>`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | After successfully obtaining the token, the policy will set the value of the token in the Authorization header using the Bearer scheme. Both system-assigned identity and any of the multiple user-assigned identities can be used to request a token.                                                                                | inbound                     |
| Get from cache                     | `<cache-lookup vary-by-developer="true \| false" vary-by-developer-groups="true \| false" caching-type="prefer-external \| external \| internal" downstream-caching-type="none \| private \| public" must-revalidate="true \| false" allow-private-response-caching="@(expression to evaluate)">`<br>&nbsp;&nbsp;`<vary-by-header>Accept</vary-by-header>`<br>&nbsp;&nbsp;`<vary-by-header>Accept-Charset</vary-by-header>`<br>&nbsp;&nbsp;`<vary-by-header>Authorization</vary-by-header>`<br>&nbsp;&nbsp;`<vary-by-header>header name</vary-by-header>`<br>&nbsp;&nbsp;`<vary-by-query-parameter>parameter name</vary-by-query-parameter>`<br>`</cache-lookup>`                                                                                                                                                                                                                                                                                                                                                                                                                                             | `vary-by-header` Add one or more of these elements to start caching responses per value of specified header, such as `Accept`, `Accept-Charset`, `Accept-Encoding`, `Accept-Language`, `Authorization`, `Expect`, `From`, `Host`, `If-Match`.                                                                                         | inbound                     |
| Get value from cache               | `<cache-lookup-value key="cache key value" default-value="value to use if cache lookup resulted in a miss" variable-name="name of a variable looked up value is assigned to" caching-type="prefer-external \| external \| internal" />`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | `caching-type`: `internal` to use the built-in API Management cache, `external` to use Redis.                                                                                                                                                                                                                                         | Any                         |
| Store to cache                     | `<cache-store duration="seconds" cache-response="true \| false" />`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Use with `cache-lookup` in `inbound`                                                                                                                                                                                                                                                                                                  | outbound                    |
| Store value in cache               | `<cache-store-value key="cache key value" value="value to cache" duration="seconds" caching-type="prefer-external \| external \| internal" />`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | The operation is asynchronous. `caching-type`: `internal` to use the built-in API Management cache, `external` to use Redis.                                                                                                                                                                                                          | Any                         |
| ---                                | ---                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | ---                                                                                                                                                                                                                                                                                                                                   | ---                         |
| CORS                               | `<cors allow-credentials="false \| true" terminate-unmatched-request="true \| false">`<br>&nbsp;&nbsp;`<allowed-origins>`<br>&nbsp;&nbsp;&nbsp;&nbsp;`<origin>origin uri</origin>`<br>&nbsp;&nbsp;`</allowed-origins>`<br>&nbsp;&nbsp;`<allowed-methods preflight-result-max-age="number of seconds">`<br>&nbsp;&nbsp;&nbsp;&nbsp;`<method>HTTP verb</method>`<br>&nbsp;&nbsp;`</allowed-methods>`<br>&nbsp;&nbsp;`<allowed-headers>`<br>&nbsp;&nbsp;&nbsp;&nbsp;`<header>header name</header>`<br>&nbsp;&nbsp;`</allowed-headers>`<br>&nbsp;&nbsp;`<expose-headers>`<br>&nbsp;&nbsp;&nbsp;&nbsp;`<header>header name</header>`<br>&nbsp;&nbsp;`</expose-headers>`<br>`</cors>`                                                                                                                                                                                                                                                                                                                                                                                                                               | Configure CORS at multiple scopes. Base element at operation, API, and product. Only cors evaluated on OPTIONS preflight. Other policies on approved request. Policy can be used once.                                                                                                                                                | inbound                     |
| Find and replace string in body    | `<find-and-replace from="what to replace" to="replacement" />`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Policy expressions are allowed.                                                                                                                                                                                                                                                                                                       | Any                         |
| Set backend service                | `<set-backend-service base-url="base URL of the backend service"  backend-id="name of the backend entity specifying base URL of the backend service" />`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Redirect an incoming request to a different backend than the one specified in the API settings for that operation. Great for `choose`                                                                                                                                                                                                 | inbound, backend            |
| Set body                           | `<set-body template="liquid" xsi-nil="blank \| null">new body value as text</set-body>`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | `preserveContent` not needed when providing new body. Inbound pipeline: no response yet, so no `preserveContent`. Outbound pipeline: request already sent, so no `preserveContent`. Exception if used in inbound GET with no body.                                                                                                    | inbound, outbound, backend  |
| Set header                         | `<set-header name="header name" exists-action="override \| skip \| append \| delete"><value>value</value></set-header>`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | For multiple headers with the same name add additional value elements                                                                                                                                                                                                                                                                 | Any                         |
| Rewrite URL                        | `<rewrite-uri template="/v2/US/hardware/{storenumber}&{ordernumber}?City=city&State=state" />`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Transform human/browser-friendly URL into the URL format expected by the web service                                                                                                                                                                                                                                                  | inbound                     |
