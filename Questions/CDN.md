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
