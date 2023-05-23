# Managed Identities

Question: Which of the following managed identity characteristics is indicative of user-assigned identities?

- [ ] Shared lifecycle with an Azure resource
- [x] Independent life-cycle
- [ ] Can only be associated with a single Azure resource

Answer: User-assigned identities exist independently from the resources they're associated with and must be explicitly deleted.  
The same user-assigned managed identity can be associated with more than one Azure resource.

Question: A client app requests managed identities for an access token for a given resource. Which of the below is the basis for the token?

- [ ] Oauth 2.0
- [x] Service principal
- [ ] Virtual machine

Answer: The token is based on the managed identities for Azure resources service principal.  
Oauth 2.0 is a protocol that can be used to acquire a token, but isn't the basis for the token.
