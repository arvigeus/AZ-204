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

Question: Your organization offers web services to third-party clients. These services require non-anonymous access, authentication through OpenID Connect, and are accessed via APIs. To ensure secure Azure AD authentication, you decide to base it on a specific value embedded in the request query parameter. Which policy within Azure API Management should you enforce to meet this requirement?

- [ ] check-header
- [x] validate-jwt
- [ ] set-header
- [ ] control-client-flow

Answer: The JWT Validation or "validate-jwt" policy in Azure API Management is used to validate the JWT (JSON Web Token) extracted from a specified HTTP Header or a URI query parameter. In this scenario, it allows you to securely support Azure AD authentication based on a value passed as a request query parameter. The other options do not provide this specific functionality.

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

Answer: Seconds

---

Question: In what unit is the bandwidth limit in Quota policy?

- [x] KB
- [ ] MB
- [ ] GB

Answer: KB

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
