# Azure CDN

Question: Each Azure subscription has default limits on resources needed for an Azure Content Delivery Network (CDN). Which of the following resources has subscription limitations you need to consider for your solution?

- [ ] Resource group
- [x] CDN profiles
- [ ] Storage account

Answer: The number of CDN profiles that can be created is limited by the type of Azure subscription.  
Resource groups are required by Azure CDN, but they aren't limited by subscription level.  
Storage accounts aren't a resource used in Azure CDNs.

---

Question: When you publish a website through Azure Content Delivery Network, the files on that site are cached until their time-to-live (TTL) expires. What is the default TTL for large file optimizations?

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
- [x] It's another way to purge the content, effectively clearing the cached content from edge servers.
- [ ] It forces all local browser caches to update.
- [ ] It increases the file's time-to-live (TTL).

Answer: Deleting and recreating a CDN endpoint is another way to purge the content, effectively clearing the cached content from edge servers. Note that this method may disrupt content delivery and requires reconfiguration of the endpoint, so it's typically used as a last resort or in specific scenarios.

---

Question: In Azure CDN, to reset the cache duration of a file cached before a rule change, what action must you take?

- [ ] Modify the file
- [ ] Delete the file
- [x] Purge the file
- [ ] Archive the file
- [ ] None of the listed

Answer: In Azure CDN, purging a file removes it from the cache, allowing updated caching rules to be applied.  
Deleting refers to removing the file from the origin server, not the cache, and won't reset the cache duration.

---

Question: What are the Azure CDN configuration propagation times for Standard (Verizon):

- [ ] Instant
- [ ] Around 1 minute.
- [x] Around 10 minutes.
- [ ] Around 1 hour.

Answer: 1 minute is for Standard (Akamai).

---

Question: What are the Azure CDN configuration propagation times for Standard (Akamai):

- [ ] Instant
- [x] Around 1 minute.
- [ ] Around 10 minutes.
- [ ] Around 1 hour.

Answer: 10 minutes is for Standard (Verizon).

---

Question: An Azure developer has configured a web application and also integrated Azure CDN to direct requests to the web application. The requirement is to make sure that requests containing an ID parameter should always be served from a Point of Presence (PoP). Given this requirement, what should be the configuration for the query string setting in the CDN service?

- [ ] Ignore query strings
- [ ] Use default setting
- [ ] Bypass caching
- [x] Cache every unique URL

Answer: To meet the requirement of caching requests that include an ID parameter, the setting should be 'Cache each distinct URL'. This ensures that each unique URL, including the query string, is cached.

---

Question: You are tasked with developing an ASP.Net application for an on-demand video streaming service, which will be hosted on Azure Web App service. You plan to use Azure Content Delivery Network for content delivery. The video content must be purged from the cache after one hour, and videos of different quality levels should be served from the nearest regional Point of Presence (PoP). What caching behavior should you implement?

- [ ] Default
- [ ] Set if missing
- [ ] Bypass cache
- [x] Override

Answer: In this scenario, to make certain that all video content is removed from the cache after a 60-minute period, the 'Apply custom rules' or 'Override' setting must be selected.

---

Question: Click on the following steps in the correct order to explain how Azure CDN works:

- [x] The request is directed to the nearest server location, also known as Point of Presence (POP).
- [x] The file stays in the cache until its time-to-live (TTL) expires.
- [x] The file is then sent to the user from the POP server and stored there for future requests.
- [x] If the file isn’t in the server’s cache, it’s fetched from the origin server.
- [x] A user requests a file using a special URL.
- [x] This cached file can be quickly sent to any other users requesting the same file, providing a faster user experience.

Answer:

1. A user requests a file using a special URL.
1. The request is directed to the nearest server location, also known as Point of Presence (POP).
1. If the file isn’t in the server’s cache, it’s fetched from the origin server.
1. The file is then sent to the user from the POP server and stored there for future requests.
1. This cached file can be quickly sent to any other users requesting the same file, providing a faster user experience.
1. The file stays in the cache until its time-to-live (TTL) expires.

---

Question: You have configured an Azure Front Door service to route requests to web applications in the Azure Web App service. A request is made for a 10 MB XML file with Brotli compression, but the file is not being compressed. What could be the reasons for this issue?

- [x] The XML file exceeds Azure Front Door's file size limit for compression.
- [x] The `Content-Type` header for the XML file is not set to a type that Azure Front Door is configured to compress.
- [ ] Brotli compression is not enabled in the Azure Front Door settings.
- [x] The origin server where the Azure Web App is hosted is not configured to handle Brotli compression for XML files.
- [x] The file was initially requested without compression settings and got cached.
- [ ] The XML file is encrypted, making it ineligible for compression.
- [ ] Brotli compression does not support XML
- [x] Caching is not enabled.

Answer: File size limit is 1KB to 8MB. Compression only works when caching is enabled.  
The question already states that a request was made for a file "with Brotli compression".

---
