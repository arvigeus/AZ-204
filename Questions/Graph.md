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

Answer: `/me?$select=displayName`

---

Question: You are tasked with building a web service that integrates with Microsoft Graph. You need to fetch users who have the job title "Developer" and only return their email addresses. Which of the following query parameter combinations should you use?

- [x] `?$filter=jobTitle eq 'Developer'&$select=email`
- [ ] `?$filter=equals(jobTitle,'Developer')&$select=email`
- [ ] `?$filter=jobTitle eq 'Developer'&$only=email`
- [ ] `?$filter=equals(jobTitle,'Developer')&$only=email`

Answer: Use `$filter` query parameter with the correct syntax `jobTitle eq 'Developer'` to filter users who have the job title "Developer". Use `$select` query parameter to only return the email addresses of those users.

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

Question: You are developing a web application that will utilize Microsoft Graph to interact with Microsoft 365 services. The application must be restricted to performing read operations solely on the resources belonging to the authenticated user. You have already granted the `User.Read` permission. How should you set up the permission constraint in Microsoft Graph to meet this requirement?

- [ ] Apply the `User` constraint.
- [ ] Specify the `Read.All` constraint.
- [ ] Implement the `Files` constraint.
- [x] Leave the constraint part blank.
- [ ] Use the User.ReadBasic.All permission.

Answer: By leaving the constraint part blank, the `User.Read` permission will only allow the app to perform read operations on the signed-in user's profile, without any additional constraints.  
`Files` and `User` are not applicable to `User.Read`.  
`All` gives access to everything.  
`User.ReadBasic.All` grants access to all users' basic information.

---

Question: The app is granted the `Calendars.Read` permission to access Microsoft 365 calendar services from your new web app through Microsoft Graph. You need to ensure that the app can not only access the calendars owned by the signed-in user but also the calendars that other users have shared with the signed-in user. How should you configure the permission?

- [ ] Apply rhe `ReadWrite` constraint.
- [x] Apply the `Shared`` constraint.
- [ ] Leave the constraint blank.
- [ ] Use the `User.Read` permission.

Answer: The correct way to ensure that the app can read both the calendars owned by the signed-in user and the calendars that other users have shared with the signed-in user is to use the `Calendars.Read.Shared` permission.

---

Question: Which of the following permissions require admin consent?

- [x] `AppCatalog.Submit`
- [x] `BusinessScenarioConfig.Read.OwnedBy`
- [x] `Calendars.ReadBasic.All`
- [ ] `Calendars.Read.Shared`
- [ ] `Users.Read`
- [x] `Users.Read.All`

Answer: Generally, permissions ending in `.All` or involving org-wide data require admin consent. Also, some app-specific permissions like `AppCatalog.Submit` do too.  
Source: [Microsoft Graph permissions reference](https://learn.microsoft.com/en-us/graph/permissions-reference)

---

Question: You are building an application that leverages the Microsoft Graph API to manage user activities. You need to retrieve the most recent activities for a user and also be able to update a specific activity. Which REST API calls should you opt for?

- [x] `GET /me/activities/recent`
- [ ] `GET /me/activities`
- [x] `PATCH /me/activities/{activityId}`
- [ ] `POST /me/activities`
- [ ] `PUT /me/activities/{activityId}/recent`

Answer: The `GET` method fetches the specified resources, and the `/recent` endpoint specifies that only the most recent activities should be returned.

The `PATCH` method is used for partial updates to a resource. In this case, you would replace `{activityId}` with the ID of the activity you wish to update.

---
