# Graph

Question: How a user can obtain their own photo in Graph?

- [ ] `https://graph.microsoft.com/v1.0/me/photo/`
- [x] `https://graph.microsoft.com/v1.0/me/photo/$value`
- [ ] `https://graph.microsoft.com/v1.0/me/photo/value`
- [ ] `https://graph.microsoft.com/v1.0/me/photo/$src`
- [ ] `https://graph.microsoft.com/v1.0/me/photo/src`

Answer: `https://graph.microsoft.com/v1.0/me/photo/$value`

---

Question: How a user can obtain the metadata of their own photo in Graph?

- [x] `https://graph.microsoft.com/v1.0/me/photo/`
- [ ] `https://graph.microsoft.com/v1.0/me/photo/$metadata`
- [ ] `https://graph.microsoft.com/v1.0/me/photo/metadata`
- [ ] `https://graph.microsoft.com/v1.0/me/photo/$info`
- [ ] `https://graph.microsoft.com/v1.0/me/photo/info`

Answer: `https://graph.microsoft.com/v1.0/me/photo/`

---

Question: Write a query that get fields `displayName`, `givenName`, `postalCode`, `identities` from the profile of user with id `87d349ed-44d7-43e1-9a83-5f2406dee5bd` (`v1.0`)

Answer: Using `$select`

```http
GET https://graph.microsoft.com/v1.0/users/87d349ed-44d7-43e1-9a83-5f2406dee5bd?$select=displayName,givenName,postalCode,identities
```

---

Question: What is the proper way to select `displayName` field of current user?

- [ ] `https://graph.microsoft.com/v1.0/me?$select=givenName`
- [ ] `https://graph.microsoft.com/v1.0/me?select=displayName`
- [x] `https://graph.microsoft.com/v1.0/me?$select=displayName`
- [ ] `https://graph.microsoft.com/v1.0/me/displayName`
- [ ] `https://graph.microsoft.com/v1.0/me?fields=displayName`
- [ ] `https://graph.microsoft.com/v1.0/me?$fields=displayName`
- [ ] `https://graph.microsoft.com/v1.0/me|displayName`

---

Question: Which HTTP method below is used to update a resource with new values?

- [ ] POST
- [x] PATCH
- [ ] PUT

Answer: The PATCH method does update a resource with a new value.  
The POST method creates a new resource.  
The PUT method replaces a resource with a new one.

---

Question: Which HTTP method below is used to replace a resource with a new one?

- [ ] POST
- [ ] PATCH
- [x] PUT

Answer: The PUT method replaces a resource with a new one.  
The POST method creates a new resource.  
The PATCH method does update a resource with a new value.

---

Question: Which HTTP method below is used to create a new resource?

- [x] POST
- [ ] PATCH
- [ ] PUT

Answer: The POST method creates a new resource.  
The PUT method replaces a resource with a new one.  
The PATCH method does update a resource with a new value.

---

Question: Which of the components of the Microsoft 365 platform is used to deliver data external to Azure into Microsoft Graph services and applications?

- [ ] Microsoft Graph API
- [x] Microsoft Graph connectors
- [ ] Microsoft Graph Data Connect

Answer: Microsoft Graph connectors work in the incoming direction. Connectors exist for many commonly used data sources such as Box, Google Drive, Jira, and Salesforce.  
The Microsoft Graph API offers a single endpoint to use with APIs and SDKs.  
Microsoft Graph Data Connect provides a set of tools to streamline secure and scalable delivery of Microsoft Graph data to popular Azure data stores.

---

Question: Which of the following endpoints may assume the resource as Microsoft Graph when the resource identifier is omitted in the scope parameter?

- [ ] Synchronization
- [x] Consent
- [ ] Processing
- [ ] Access

Answer: Consent

---

Question: You are trying to update the `passwordProfile` of a user to reset their password. What method should you use?

```http
{METHOD} https://graph.microsoft.com/v1.0/users/{id}
Content-type: application/json

{
  "passwordProfile": {
    "forceChangePasswordNextSignIn": false,
    "password": "xWwvJ]6NMw+bWH-d"
  }
}
```

- [ ] GET
- [ ] POST
- [x] PATCH
- [ ] PUT

Answer: The PATCH method does update a resource with a new value.

---

Question: Which of the following headers is mandatory in the response from Microsoft Graph?

- [ ] Authorization
- [ ] Content-Type
- [x] request-id
- [ ] If-Match

Answer: request-id is always included in responses from Microsoft Graph. It is useful for diagnosing issues and for support purposes, as it allows the Microsoft support team to trace the request in their logs.  
Authorization is not a mandatory response header. It's a request header used to authenticate the client (user or application) to the server, typically with a bearer token.  
Content-Type is a response header but it's not always mandatory. It is used to specify the media type of the resource, i.e., it tells the client what the content type of the returned content actually is.  
If-Match is not a mandatory response header. It's a request header used with requests that are conditionally based on the ETag header, for instance, when implementing optimistic concurrency control. It is used to ensure that the client is modifying a resource that hasn't been changed by someone else since it was last fetched.

---
