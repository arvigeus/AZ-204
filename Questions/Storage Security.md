# Storage Security

Question: Suppose you are an Azure Architect and you are transferring patient medical data from one hospital to another using Azure services. What method(s) should you use to secure the data?

- [x] Encryption-at-rest
- [x] Encryption-in-transit
- [ ] No encryption is necessary

Answer: Both encryption-at-rest and encryption-in-transit. When dealing with sensitive data, especially healthcare data, it's necessary to ensure maximum security both while the data is in storage and while it's being transferred. Therefore, you would use encryption-at-rest to secure the data when it's stored and encryption-in-transit to secure it while it's moving.

---

Question: Your company is migrating all data to Azure Storage and wants to ensure the security of the data both during and after migration. What Azure features should you utilize to ensure the data's security during and after migration?

- [x] Azure Storage Service Encryption (SSE) for data at rest
- [x] Transport Layer Security (TLS) for data in transit
- [x] Azure Key Vault for managing cryptographic keys
- [ ] Microsoft Entra ID for user access control
- [ ] Azure Traffic Manager for network optimization

Answer: Azure Storage Service Encryption (SSE) helps protect data at rest. Transport Layer Security (TLS) helps protect data while it's moving from one location to another (in transit). Azure Key Vault provides secure management of cryptographic keys used for encryption. Together, these ensure the security of data during and after migration.

Microsoft Entra ID is an important part of securing resources by managing user access, but it doesn't directly ensure the security of data during and after migration in the context of encryption-at-rest and encryption-in-transit. Similarly, Azure Traffic Manager is used for network routing optimization and doesn't directly secure data during transit or at rest. Hence, while these options sound good and are indeed crucial for Azure security in general, they are not correct in the context of this question.

---

Question: Your company is storing sensitive user data in an Azure SQL Database and also needs to securely send this data to a third-party analytics service. To ensure the security of the data, you need to select the appropriate encryption strategies. Which of the following strategies should you adopt?

- [ ] Use Azure Storage Service Encryption (SSE) for data in transit to the analytics service and Azure Key Vault for data at rest in Azure SQL Database.
- [ ] Use Transport Layer Security (TLS) for data at rest in Azure SQL Database and Azure Storage Service Encryption (SSE) for data in transit to the analytics service.
- [x] Use Transport Layer Security (TLS) for data in transit to the analytics service and Azure Storage Service Encryption (SSE) for data at rest in Azure SQL Database.
- [ ] Use Azure Key Vault for data in transit to the analytics service and Transport Layer Security (TLS) for data at rest in Azure SQL Database.

Answer: Use Transport Layer Security (TLS) for data in transit to the analytics service and Azure Storage Service Encryption (SSE) for data at rest in Azure SQL Database. Transport Layer Security (TLS) is meant to secure data when it's in transit i.e., when it's being moved from one place to another over a network. In this case, it's used when the data is being sent to the analytics service. On the other hand, Azure Storage Service Encryption (SSE) is designed to protect data at rest i.e., when it's stored and not moving. In this case, it's used to secure the data that is stored in Azure SQL Database.  
Other options are incorrect because they mix-up the roles of encryption-at-rest and encryption-in-transit. For example, Azure Key Vault is not an encryption service but is used for managing cryptographic keys, and TLS is not used for data at rest.

---

Question: Your company is using Azure Storage and wants to serve data to users via a custom domain name while also ensuring encryption in transit. Which service should you utilize for this purpose?

- [ ] Native Azure Storage functionality
- [x] Azure CDN
- [ ] Azure Key Vault
- [ ] Azure Traffic Manager

Answer: Azure CDN can be configured to work with a custom domain name and can serve data over HTTPS, enabling encryption in transit.  
Azure Storage does not natively support HTTPS with a custom domain, hence can't ensure encryption in transit with a custom domain.  
Azure Key Vault is used for managing encryption keys, not for serving content over a custom domain with encryption.  
Azure Traffic Manager is for network routing optimization and does not manage encryption or domain names.

---

Question: Your global company is using Azure Storage and wants to ensure that data is served to users secureky and quickly regardless of their location. Which service should you use?

- [ ] Azure Functions
- [x] Azure CDN
- [ ] Native Azure Storage functionality with TLS
- [ ] Azure Key Vault
- [ ] Azure Virtual Network

Answer: Azure CDN caches content on edge servers that are close to end users, reducing latency when they request content. It is especially beneficial for globally distributed users.  
Azure Functions are used to run pieces of code or "functions", not for distributing content globally.  
Azure Key Vault is used for managing encryption keys, not for distributing content globally.  
Azure Virtual Network is for creating isolated networks, not for distributing content globally.

---

Question:Your company is using Azure Storage and needs to securely distribute a large amount of content to numerous users simultaneously (large-scale distribution). Which service should you use?

- [ ] Azure Storage Account Replication
- [x] Azure CDN
- [ ] Native Azure Storage functionality with TLS
- [ ] Azure Data Factory
- [ ] Azure File Sync

Answer: If you need to distribute large amounts of content to many users at the same time, a CDN can help to reduce the load on your origin server and ensure that the content is delivered quickly to all users.  
Azure Storage Account Replication replicates your data within Azure's infrastructure for durability and high availability, but it doesn't directly assist with large-scale content distribution.  
Azure Data Factory is used for ETL (extract, transform, load) operations, not for distributing content.  
Azure File Sync is used to centralize file services in Azure while maintaining local access to data, not for large-scale content distribution.

---

Question: Your company is concerned about DDoS attacks on its Azure Storage. Which service should you use to add a layer of protection against such attacks?

- [ ] Azure DDoS Protection Standard
- [x] Azure CDN
- [ ] Native Azure Storage functionality with TLS
- [ ] Azure Advanced Threat Protection
- [ ] Azure Firewall

Answer: CDNs can help protect your applications against Distributed Denial of Service (DDoS) attacks by providing a layer of abstraction between the attackers and the application servers.  
Azure DDoS Protection Standard, while a good choice for DDoS protection in general, does not provide the CDN functionality.  
Azure Advanced Threat Protection is used to detect and investigate security incidents, not for DDoS protection.  
Azure Firewall is a managed, cloud-based network security service, but does not provide the caching and DDoS mitigation benefits of a CDN.

---

Question: Your company is using Azure Storage and wants to optimize secure data transfer costs for high volume. Which service should you consider to potentially reduce costs?

- [ ] Azure Cost Management
- [x] Azure CDN
- [ ] Native Azure Storage functionality with TLS
- [ ] Azure Reservations
- [ ] Azure Budgets

Answer: Depending on the specifics of data transfer (like volume and location), the cost of using a CDN can be less than the cost of serving the content directly from Azure Storage.  
Azure Cost Management provides tools for analyzing and managing costs, but does not affect data transfer costs directly.  
Azure Reservations offer discounted prices on certain Azure products and resources, but not directly on data transfer costs.  
Azure Budgets can help manage costs, but do not affect the cost of data transfer directly.

---

Question: Your company stores data in Azure and needs to ensure the data's secure transmission over the network, but doesn't require a custom domain name. Which service should you use for this requirement?

- [ ] Azure Storage Service Encryption (SSE)
- [ ] Azure Key Vault
- [ ] Azure CDN
- [x] Native Azure Storage functionality with TLS

Answer: When a custom domain is not needed, Azure Storage natively supports encryption in transit using Transport Layer Security (TLS).  
Azure Storage Service Encryption (SSE) is used for encryption at rest, not for encryption in transit.  
Azure Key Vault is used for managing encryption keys, not for encryption in transit.  
Azure CDN is used for content distribution and can provide encryption in transit but is not necessary if a custom domain is not required.

---

Question: Your company uses Azure Storage and wants to serve data from a custom domain. Which service should you use for this requirement?

- [ ] Azure Storage Account Geo-redundancy
- [x] Azure CDN
- [ ] Native Azure Storage functionality with TLS
- [ ] Azure Traffic Manager
- [ ] Azure Load Balancer

Answer: Azure CDN can work with a custom domain and caches content on edge servers that are close to end users. This reduces latency when users request content and is especially beneficial for globally distributed users.  
While Azure Storage natively supports encryption in transit using Transport Layer Security (TLS), it does not natively support HTTPS with a custom domain. That's because the SSL certificate, used to serve over HTTPS, must be issued to the exact domain that's being accessed, and Azure Storage does not provide the ability to upload a custom SSL certificate.
Azure Storage Account Geo-redundancy provides data redundancy across regions, but does not provide the same content delivery speed benefits as Azure CDN.  
Azure Traffic Manager is for network routing optimization and does not manage content caching for global distribution.  
Azure Load Balancer is used to distribute network traffic, but doesn't provide content caching like a CDN.

---
