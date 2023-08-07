# Azure CDN

Question: Each Azure subscription has default limits on resources needed for an Azure Content Delivery Network. Which of the following resources has subscription limitations that may impact your solution?

- [ ] Resource group
- [x] CDN profiles
- [ ] Storage account

Answer: The number of CDN profiles that can be created is limited by the type of Azure subscription.  
Resource groups are required by Azure CDN, but they aren't limited by subscription level.  
Storage accounts aren't a resource used in Azure CDNs.

---

Question: When publishing a website through Azure CDN, the files on that site are cached until their time-to-live (TTL) expires. What is the default TTL for large file optimizations?

- [x] One day
- [ ] One week
- [ ] One year

Answer: The default TTL for large file optimizations is one day.  
Generalized web delivery optimizations have a default TTL of one week.  
Media streaming optimizations have a default TTL of one year.

---

Question: You are developing a platform that streams educational content to students worldwide. The platform uses a continuous integration and deployment pipeline. Your primary objectives are to guarantee that the platform remains highly accessible and that students receive a steady streaming service. Moreover, you aim to save the content in a location geographically closest to the student. Which Azure service would best fit this requirement?

- [x] Azure CDN
- [ ] Azure Cache for Redis
- [ ] Azure Blob Storage
- [ ] Azure App Service Plan
- [ ] Azure Virtual Network

Answer: Azure CDN caches content in multiple locations globally, ensuring users access content from the nearest point of presence, which aligns with the requirement of a steady streaming service and storing content close to the user.

---
