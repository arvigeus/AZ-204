# Azure Key Vault

Question: Which of the below methods of authenticating to Azure Key Vault is recommended for most scenarios?

- [ ] Service principal and certificate
- [ ] Service principal and secret
- [x] Managed identities

Answer: The benefit of this approach is that Azure automatically rotates the identity.  
Service principal and secret is not recommended because the application owner or developer must rotate the certificate.  
Service principal and certificate is not recommended because it is difficult to automatically rotate the bootstrap secret that's used to authenticate to Key Vault.

Question: Azure Key Vault protects data when it's traveling between Azure Key Vault and clients. What protocol does it use for encryption?

- [ ] Secure Sockets Layer
- [x] Transport Layer Security
- [ ] Presentation Layer

Answer: Azure Key Vault enforces Transport Layer Security protocol to protect data when it’s traveling between Azure Key Vault and clients.  
The Secure Sockets Layer protocol has been replaced with the Transport Layer Security protocol.  
Presentation Layer is part of the Open Systems Interconnection model and is not a security protocol.
