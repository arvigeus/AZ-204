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

Question: Which products supports asset pre-loading?

- [x] Premium Verison
- [x] Standard Versizon
- [ ] Standard Microsoft
- [ ] Standard Akamai

Answer: Verizon only

---

Question: Which product supports real-time stats and alerts?

- [x] Premium Verison
- [ ] Standard Versizon
- [ ] Standard Microsoft
- [ ] Standard Akamai

Answer: Premium Verizon only

---

Question: Which products supports brotl compression?

- [ ] Premium Verison
- [ ] Standard Versizon
- [x] Standard Microsoft
- [ ] Standard Akamai

Answer: Standard Microsoft only

---

Question: What is the primary difference between versioning and purging in CDN management?

- [ ] Versioning deletes content; purging updates it.
- [ ] Versioning and purging both clear content from local caches.
- [x] Versioning assigns new URLs for updates; purging removes content from edge servers.
- [ ] Versioning and purging both require deleting the CDN endpoint.

Answer: Versioning assigns new URLs for updates; purging removes content from edge servers.

---

Question: Why might you want to purge cached content from all edge nodes in a CDN?

- [x] To free storage space.
- [x] To update assets that contain incorrect information or update a web application.
- [ ] To create a new CDN endpoint.
- [ ] To rollback to a previous version of the content.

Answer: To update assets that contain incorrect information or update a web application, also frees space.

---

Question: What does purging NOT affect in a CDN?

- [ ] Edge servers.
- [x] Local browser caches.
- [ ] New URLs.
- [ ] Incorrect information.

Answer: Local browser caches.

---

Question: If you want to force a downstream client to request the latest version of a file, what can you do?

- [ ] Purge the edge servers.
- [x] Give the file a unique name every time you update it or use query string caching.
- [ ] Reduce the file's time-to-live (TTL).

Answer: Changing the file's name or using query string caching ensures the client sees it as new content, forcing a request for the latest version.  
Purging edge servers clears CDN caches but may not affect downstream clients.  
Reducing TTL affects edge server caching but may not force downstream clients to request the latest version.

---

Question: How can deleting and recreating a CDN endpoint be considered in the context of content management?

- [ ] It's a method to version the assets.
- [ ] It's another way to purge the content, effectively clearing the cached content from edge servers.
- [ ] It forces all local browser caches to update.
- [ ] It increases the file's time-to-live (TTL).

Answer: Deleting and recreating a CDN endpoint is another way to purge the content, effectively clearing the cached content from edge servers. Note that this method may disrupt content delivery and requires reconfiguration of the endpoint, so it's typically used as a last resort or in specific scenarios.

---
