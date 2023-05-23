# Authentication and authorization

Question: Which of the types of permissions supported by the Microsoft identity platform is used by apps that have a signed-in user present?

- [x] Delegated permissions
- [ ] App-only access permissions
- [ ] Both delegated and app-only access permissions

Answer: Delegated permissions are used by apps that have a signed-in user present. The app is delegated with the permission to act as a signed-in user when it makes calls to the target resource.  
App-only access permissions are used by apps that run without a signed-in user present, for example, apps that run as background services or daemons.

Question: Which of the following app scenarios require code to handle Conditional Access challenges?

- [ ] Apps performing the device-code flow
- [x] Apps performing the on-behalf-of flow
- [ ] Apps performing the Integrated Windows authentication flow

Answer: Apps performing the on-behalf-of flow require code to handle Conditional Access challenges.  
The Integrated Windows authentication flow allows applications on domain or Azure Active Directory (Azure AD) joined computers to acquire a token silently.

Question: Which of the following MSAL libraries supports single-page web apps?

- [ ] MSAL Node
- [x] MSAL.js
- [ ] MSAL.NET

Answer: MSAL.js supports single-page applications.

Question: Which of the following types of shared access signatures (SAS) applies to Blob storage only?

- [ ] Account SAS
- [ ] Service SAS
- [x] User delegation SAS

Answer: A user delegation SAS is secured with Azure Active Directory credentials and also by the permissions specified for the SAS. A user delegation SAS applies to Blob storage only.  
An account SAS delegates access to resources in one or more of the storage services. All of the operations available via a service or user delegation SAS are also available via an account SAS.  
A service SAS delegates access to a resource in the following Azure Storage services: Blob storage, Queue storage, Table storage, or Azure Files.

Question: Which of the following best practices provides the most flexible and secure way to use a service or account shared access signature (SAS)?

- [x] Associate SAS tokens with a stored access policy.
- [ ] Always use HTTPS
- [ ] Implement a user delegation SAS

Answer: The most flexible and secure way to use a service or account SAS is to associate the SAS tokens with a stored access policy.  
A user delegation SAS is the most secure SAS, but isn't highly flexible because you must use Azure Active Directory to manage credentials.  
Using HTTPS prevents man-in-the-middle attacks but isn't the most flexible and secure practice.

Question: Which HTTP method below is used to update a resource with new values?

- [ ] POST
- [x] PATCH
- [ ] PUT

Answer: The PATCH method does update a resource with a new value.  
The POST method creates a new resource.  
The PUT method replaces a resource with a new one.

Question: Which of the components of the Microsoft 365 platform is used to deliver data external to Azure into Microsoft Graph services and applications?

- [ ] Microsoft Graph API
- [x] Microsoft Graph connectors
- [ ] Microsoft Graph Data Connect

Answer: Microsoft Graph connectors work in the incoming direction. Connectors exist for many commonly used data sources such as Box, Google Drive, Jira, and Salesforce.  
The Microsoft Graph API offers a single endpoint to use with APIs and SDKs.  
Microsoft Graph Data Connect provides a set of tools to streamline secure and scalable delivery of Microsoft Graph data to popular Azure data stores.
