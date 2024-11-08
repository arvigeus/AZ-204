# API Management

Question: Which of the following components of the API Management service would a developer use if they need to create an account and subscribe to get API keys?

- [ ] API gateway
- [ ] Azure portal
- [x] Developer portal

Answer: The Developer portal serves as the main web presence for developers, and is where they can subscribe to get API keys.  
The API gateway routes calls, performs API transforms, and verifies keys.  
The Azure portal is the administrative interface where you set up your API program.

---

Question: Which of the following API Management policies would one use if one wants to apply a policy based on a condition?

- [ ] forward-request
- [x] choose
- [ ] return-response

Answer: The choose policy applies enclosed policy statements based on the outcome of evaluation of boolean expressions.  
The forward-request policy forwards the incoming request to the backend service specified in the request context.  
The return-response policy aborts pipeline execution and returns either a default or custom response to the caller.

---

Question: Your organization offers web services to third-party clients. These services require non-anonymous access, authentication through OpenID Connect, and are accessed via APIs. To ensure secure Entra ID authentication, you decide to base it on a specific value embedded in the request query parameter. Which policy within Azure API Management should you enforce to meet this requirement?

- [ ] check-header
- [x] validate-jwt
- [ ] set-header
- [ ] control-client-flow

Answer: The JWT Validation or "validate-jwt" policy in Azure API Management is used to validate the JWT (JSON Web Token) extracted from a specified HTTP Header or a URI query parameter. In this scenario, it allows you to securely support Entra ID authentication based on a value passed as a request query parameter. The other options do not provide this specific functionality.

---

Question: When attempting to access an API through Microsoft's API Management, a developer receives a `401 Access Denied error`. What could be the possible reasons for this error, and how can it be fixed? Select the correct options.

- [x] Add the API to product in Azure Portal
- [x] Include the `Ocp-Apim-Subscription-Key` header in the HTTP request.
- [ ] Add the check-header policy statement for the Authorization header.
- [ ] Disable OAuth2.0 in the API Management gateway.

Answer: The key can be included in the request header as "Ocp-Apim-Subscription-Key" or as a query string "subscription-key." Additionally, the API must be added to a product in the Azure Portal, which applies to a particular product (a collection of APIs) in API Management.

---

Question: What rule should be used to cache this URL: `https://myapi.azure-api.net/items/123456`?

- [x] `<cache-lookup><vary-by-query-parameter /></cache-lookup>`
- [ ] `<cache-lookup><vary-by-query-parameter>itemId</vary-by-query-parameter></cache-lookup>`
- [ ] `<cache-lookup-value key="itemId" />`
- [ ] `<cache-lookup-value value="itemId" />`
- [ ] `<cache-lookup><vary-by-query-parameter>items</vary-by-query-parameter></cache-lookup>`
- [ ] `<cache-lookup-value key="items" />`
- [ ] `<cache-lookup-value value="items" />`

Answer: When URL has no parameters to cache on, the whole URL is used (empty `vary-by-query-parameter`).  
`itemId` does not exist. `items` is not a valid query parameter. `cache-lookup-value` is for retrieving cached value by name.

---

Question: What rule should be used to cache this URL: `https://myapi.azure-api.net/items?id=123456`?

- [ ] `<cache-lookup><vary-by-query-parameter>items</vary-by-query-parameter></cache-lookup>`
- [x] `<cache-lookup><vary-by-query-parameter>id</vary-by-query-parameter></cache-lookup>`
- [ ] `<cache-lookup-value key="id" />`
- [ ] `<cache-lookup-value value="id" />`
- [ ] `<cache-lookup-value key="items" />`
- [ ] `<cache-lookup-value value="items" />`

Answer: Use `id` to store the value.  
`items` is not valid query parameter. `cache-lookup-value` is for retrieving cached value by name.

---

Question: What rule should be used to cache this URL: `https://myapi.azure-api.net/me`?

- [x] `<cache-lookup><vary-by-header>Authorization</vary-by-header></cache-lookup>`
- [ ] `<cache-lookup><vary-by-query-parameter /></cache-lookup>`
- [ ] `<cache-lookup><vary-by-query-parameter>me</vary-by-query-parameter></cache-lookup>`
- [ ] `<cache-lookup-value key="me" />`
- [ ] `<cache-lookup-value value="me" />`
- [ ] `<cache-lookup-value key="" />`
- [ ] `<cache-lookup-value value="" />`

Answer: This looks like user endpoint, `Authorization` header could be used.

---

Question: In what unit is renewal period for Rate limiting / Quota policy?

- [ ] Milliseconds
- [x] Seconds
- [ ] Minutes
- [ ] Hours
- [ ] Days

Answer: All times are in seconds

---

Question: In what unit is the bandwidth limit in Quota policy?

- [x] KB
- [ ] MB
- [ ] GB

Answer: All sizes are in KB

---

Question: You are developing an API that needs to restrict a single client IP address to only 10 calls every minute, with a total of 100 calls and 100 MB of bandwidth per hour. Which policies should you implement to achieve this requirement?

- [x] `<rate-limit-by-key calls="10" renewal-period="60" counter-key="@(context.Request.IpAddress)" />`
- [ ] `<rate-limit-by-key calls="10" renewal-period="1" counter-key="@(context.Request.IpAddress)" />`
- [ ] `<rate-limit calls="10" renewal-period="60" />`
- [ ] `<rate-limit calls="10" renewal-period="1" />`
- [x] `<quota-by-key calls="100" bandwidth="100000" renewal-period="3600" counter-key="@(context.Request.IpAddress)" />`
- [ ] `<quota-by-key calls="100" bandwidth="100" renewal-period="60" counter-key="@(context.Request.IpAddress)" />`
- [ ] `<quota-by-key calls="100" bandwidth="100" renewal-period="3600" counter-key="@(context.Request.IpAddress)" />`
- [ ] `<quota-by-key calls="100" bandwidth="100000" renewal-period="60" counter-key="@(context.Request.IpAddress)" />`
- [ ] `<quota calls="100" bandwidth="100000" renewal-period="3600" />`
- [ ] `<quota calls="100" bandwidth="100" renewal-period="60" />`
- [ ] `<quota calls="100" bandwidth="100" renewal-period="3600" />`
- [ ] `<quota calls="100" bandwidth="100000" renewal-period="60" />`
- [ ] `<ip-filter action="forbid"><address>"@(context.Request.IpAddress)"</address></ip-filter>`
- [ ] `<ip-filter action="allow"><address>"@(context.Request.IpAddress)"</address></ip-filter>`

Answer: `rate-limit-by-key` and `quota-by-key`, units in seconds and KB, `counter-key="@(context.Request.IpAddress)"`.

---

Question: You are working on an API where an end user is authenticated, and you need to generate a throttling key based on information that uniquely identifies that user. The requirement is to limit the calls to 10 every minute, with a total of 100 calls and 100 MB of bandwidth per hour. Which policies should you implement to achieve this requirement?

- [x] `<rate-limit-by-key calls="10" renewal-period="60" counter-key="@(context.Request.Headers.GetValueOrDefault(\"Authorization\",\"").AsJwt()?.Subject)" />`
- [ ] `<rate-limit-by-key calls="10" renewal-period="1" counter-key="@(context.Request.Headers.GetValueOrDefault(\"Authorization\",\"").AsJwt()?.Subject)" />`
- [ ] `<rate-limit calls="10" renewal-period="60" />`
- [ ] `<rate-limit calls="10" renewal-period="1" />`
- [x] `<quota-by-key calls="100" bandwidth="100000" renewal-period="3600" counter-key="@(context.Request.Headers.GetValueOrDefault(\"Authorization\",\"").AsJwt()?.Subject)" />`
- [ ] `<quota-by-key calls="100" bandwidth="100" renewal-period="60" counter-key="@(context.Request.Headers.GetValueOrDefault(\"Authorization\",\"").AsJwt()?.Subject)" />`
- [ ] `<quota-by-key calls="100" bandwidth="100" renewal-period="3600" counter-key="@(context.Request.Headers.GetValueOrDefault(\"Authorization\",\"").AsJwt()?.Subject)" />`
- [ ] `<quota-by-key calls="100" bandwidth="100000" renewal-period="60" counter-key="@(context.Request.Headers.GetValueOrDefault(\"Authorization\",\"").AsJwt()?.Subject)" />`
- [ ] `<quota calls="100" bandwidth="100000" renewal-period="3600" />`
- [ ] `<quota calls="100" bandwidth="100" renewal-period="60" />`
- [ ] `<quota calls="100" bandwidth="100" renewal-period="3600" />`
- [ ] `<quota calls="100" bandwidth="100000" renewal-period="60" />`

Answer: `rate-limit-by-key` and `quota-by-key`, units in seconds and KB, `counter-key="@(context.Request.Headers.GetValueOrDefault(\"Authorization\",\"").AsJwt()?.Subject)"`.

---

Question: An API is integrated into an Azure API Management (APIM) gateway and is utilized by client applications worldwide. You are tasked with granting access to 10 new operations exclusively to a select group of 200 beta developers around the world. How can you enable these developers to test the new operations using the existing API URL?

- [ ] Implement a revision in Azure API Management.
- [ ] Implement path-based versioning.
- [x] Implement header-based versioning.
- [ ] Implement query string-based versioning.
- [ ] Create separate gateways.

Answer: Header-based versioning uses custom HTTP headers to determine the version of the API to be accessed. This allows different versions of the API to be accessed through the same URL.

Question: You establish an API Management (APIM) gateway and incorporate an existing App Services API app within it. Your goal is to limit each client application to a maximum of 1000 calls to the API on an hourly basis.". Which policies could achieve this requirement?

- [x] `<rate-limit-by-key calls="1000" renewal-period="3600" counter-key="@(context.Subscription.Id)" />`
- [ ] `<rate-limit-by-key calls="1000" renewal-period="60" counter-key="@(context.Subscription.Id)" />`
- [ ] `<rate-limit-by-key calls="1000" renewal-period="3600" />`
- [ ] `<rate-limit-by-key calls="1000" renewal-period="60" />`
- [x] `<quota-by-key calls="1000" renewal-period="3600" counter-key="@(context.Subscription.Id)" />`
- [ ] `<quota-by-key calls="1000" renewal-period="60" counter-key="@(context.Subscription.Id)" />`
- [ ] `<quota-by-key calls="1000" renewal-period="3600" />`
- [ ] `<quota-by-key calls="1000" renewal-period="60" />`

Answer: `rate-limit-by-key` and `quota-by-key` can limit numbers of requests.

---

Question: You are developing a solution that requires the Azure API Management (APIM) instance to authenticate to a backend service. The authentication process must be secure and aligned with best practices. The backend service supports authentication through specific methods, and you need to ensure that the APIM instance can access it without storing credentials within the APIM configuration. Which of the following policies should you apply to the APIM instance to achieve this requirement?

- [x] authentication-managed-identity
- [ ] validate-jwt
- [ ] check-header
- [ ] set-body

Answer: By using a authentication-managed-identity identity, you can authenticate to services that support Entra ID authentication without credentials in your code. In this scenario, it allows the APIM instance to authenticate to the backend service securely.

---

Question: Your organization has implemented Azure API Management (APIM) and requires a custom TLS/SSL certificate for securing communication. The certificate must be obtained from Azure Key Vault, and the process must adhere to security best practices without hardcoding any secrets or credentials in the APIM configuration. Which of the following policies should you apply to the APIM instance to fulfill this requirement?

- [x] authentication-managed-identity
- [ ] validate-jwt
- [ ] check-header
- [ ] set-body

Answer: By using a authentication-managed-identity identity, the APIM instance can authenticate to Azure Key Vault and retrieve the custom TLS/SSL certificate securely without needing to store any credentials in the code or configuration.

---

Question: You have JSON endpoint that expects JSON payload. The client sends XML payload. What policy should be applied?

- [x] `xml-to-json-policy` in inbound section
- [ ] `xml-to-json-policy` in backend section
- [ ] `xml-to-json-policy` in outbound section
- [ ] `json-to-xml-policy` in inbound section
- [ ] `json-to-xml-policy` in backend section
- [ ] `json-to-xml-policy` in outbound section
- [ ] No policy should be applied

Answer: Request is transformed in inbound section

---

Question: You have JSON endpoint. The client expects XML response. What policy should be applied?

- [ ] `xml-to-json-policy` in inbound section
- [ ] `xml-to-json-policy` in backend section
- [ ] `xml-to-json-policy` in outbound section
- [ ] `json-to-xml-policy` in inbound section
- [ ] `json-to-xml-policy` in backend section
- [x] `json-to-xml-policy` in outbound section
- [ ] No policy should be applied

Answer: Response is transformed in outbound section

---

Question: You receive `401 Access Denied` trying to get access to your API instance. What is happening?

- [ ] Server crashed
- [x] You have to pass a valid subscription key.
- [ ] Quota has been exceeded
- [ ] IP Filter policy has been activated

Answer: Pass a valid subsription key.  
Server errors are `5XX`, quota and ip restrictions are `403`.

---

Question: You receive `403 Forbidden` trying to get access to your API instance. What are possible reasons for that?

- [ ] Server crashed
- [ ] You have to pass a valid subscription key.
- [x] Quota has been exceeded
- [x] IP Filter policy has been activated

Answer: Quota and ip restrictions are `403`.  
Server errors are `5XX`, Subscription errors are `401`

---

Question: Your client, once again, complains they receive a `403 Forbidden` error when trying to access your API. It was working just 5 minutes ago, they claim. You look into this "urgent" problem and see no policy changes have been made, and surprise, surprise, it works on your machine(tm). How would you make client to shut up and be happy?

- [ ] The API endpoint must be faulty, so just remove it for now and debug it later, like everything else
- [ ] Add an `ip-filter` policy that allows access to your client's IP, because that's never been a problem before
- [ ] Call them idiots (in your head, of course) and tell them to use a different subscription key, like you've told them a hundred times
- [x] Modify the quota policy to be more generous, because probably they have been spamming your endpoint

Answer: A `403 Forbidden` error is either an IP filter policy or an exceeded quota. Since policy rules haven't been modified, it must be a quota issue.  
Note: Cursing your clients (in your mind) is a valid/invalid solution, depending on your morals.

---

Question: You are setting up an API Management instance to manage your organization's various API services. You have a REST API developed in-house that is already exposed to the public internet. What is the first step you should take before incorporating this REST API into the API Management instance?

- [ ] Establish a VPN connection between the in-house network and Azure.
- [x] Generate OpenAPI specification for the REST API.
- [ ] Move the API to Azure Functions.
- [ ] Implement OAuth 2.0 authentication for the API.
- [ ] Set up a load balancer for the API in Azure.
- [ ] Set up a self-hosted gateway between the internal network and Azure.

Answer: OpenAPI specification enables Azure API Management to automatically discover the endpoints and methods supported by the API.

---

Question: Your company has a complex environment with APIs hosted both on-premises and in different cloud providers. You are tasked with centralizing the management of these APIs using Azure API Management, while ensuring low-latency access for local users. What actions should you take to accomplish this task?

- [x] Upgrade to the Premium tier of Azure API Management.
- [x] Implement a self-hosted gateway to manage on-premises APIs and APIs across multiple clouds.
- [ ] Migrate all APIs to Azure App Service.
- [ ] Generate OpenAPI specifications for all APIs.
- [ ] Configure a VPN connection between the internal network and Azure.

Answer: The Premium tier is required to deploy self-hosted gateways, which are essential for managing APIs across different environments. Self-hosted gateways are containerized versions of managed gateways, suitable for hybrid and multicloud environments.  
Migrating all APIs to Azure App Service is not necessary for managing APIs across different environments.  
Generating OpenAPI specifications is not directly related to managing APIs across multiple clouds and on-premises.  
Configuring a VPN connection is not relevant to the scenario described.

---

Here's the modified question using generic Azure CLI commands instead of PowerShell:

Your team has developed an application API based on the OpenAPI specification. You have to ensure that the API can be accessed via an Azure API management service instance. Which of the following Azure CLI commands would you run?

- [ ] `az apim api import`
- [ ] `az apim backend create`
- [x] `az apim create`
- [ ] `az apim backend proxy create`

Answer: First, you need to create a new API management instance using `az apim create`.  
`az apim api import` imports an API into an existing API Management service instance.  
`az apim backend create` creates a new backend entity in API Management.
`az apim backend proxy create` is for creating a proxy backend, not an API Management instance.

---

Question: In a company's API system hosted behind an Azure API Management service, you are tasked with implementing response caching. The user ID of the client must first be detected and saved. Then, the response must be cached specifically for that saved user ID. What types of policies should be used to accomplish this task?

- [ ] Inbound policy only
- [ ] Outbound policy only
- [x] Both inbound and outbound policies
- [ ] Backend policy only
- [ ] Global policy only

Answer: Both inbound and outbound policies

- Inbound Policy: The inbound policy is used to extract and save the user ID from the incoming request. The `<set-variable>` policy is used to save the user ID, and the `<cache-lookup>` policy with a custom key is used to check if a cached response exists for that user ID.
- Outbound Policy: The outbound policy is used to store the response in the cache. The `<cache-store>` policy with a custom key is used to cache the response specifically for the saved user ID.

Therefore, both inbound and outbound policies are needed to meet the requirements.

---

Question: A company uses Azure API Management to publish APIs for external consultants. The API needs to forward the user ID associated with the subscription key to the back-end service. Which type of policy should be used for this requirement?

- [x] Inbound
- [ ] Outbound
- [ ] Backend
- [ ] Error

Answer: Forwarding the user ID that is associated with the subscription key to the back-end service would be done in an inbound policy.

```xml
<policies>
    <inbound>
        <set-header name="x-user-id" exists-action="override">
            <value>@(context.Subscription.Id)</value>
        </set-header>
    </inbound>
</policies>

```
