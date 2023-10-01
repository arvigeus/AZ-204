# Azure

Question: Where can you discover the autoscale settings in Azure subscription?

- [ ] Azure Portal > Azure Storage > Autoscale
- [x] Azure Portal > Azure Monitor > Autoscale
- [ ] Azure Portal > Resource Groups > Autoscale
- [ ] Azure Portal > Virtual Machines > Autoscale
- [ ] Azure Portal > Azure Functions > Autoscale

Answer: The correct procedure to discover the autoscale settings in your subscription is to open the Azure portal, search for and select Azure Monitor, and then select Autoscale to view all the resources for which autoscale is applicable.

---

Question: In Azure, when an application is scaled out to multiple instances, which service can be configured to conduct health checks on these instances and direct traffic only to the healthy ones?

- [ ] Azure Service Health
- [ ] Load Balancer
- [x] App Service
- [ ] Azure Traffic Manager

Answer: Azure App Service can perform health checks on instances, routing traffic only to healthy ones.

---

Question: Which Azure service enables you to create subscriptions to events raised by third-party resources?

- [ ] Azure Event Hub
- [ ] Azure Service Bus
- [x] Azure Event Grid
- [ ] Azure Notification Hubs

Answer: Event Grid is designed to create subscriptions to events raised by Azure services, third-party resources, and custom topics.  
Event Hub is used for big data streaming and event ingestion, not for subscribing to third-party events.  
Service Bus is a message broker service, not designed for subscribing to third-party events.  
Notification Hubs are used for sending mobile push notifications, not for subscribing to third-party events.

---

Question: You are tasked with developing an ASP.Net web application for deployment on Azure Web App service. The application has two critical requirements:

- Manage and save session state data that should be accessible across all ASP.Net web applications.
- Store full HTTP responses for specific operations.

Additionally, the application should support controlled and concurrent access to the session state data for multiple readers and a single writer. Which Azure service is best suited to meet these session state management and HTTP response storage requirements?

- [ ] Application Request Routing
- [x] Azure Cache for Redis
- [ ] Azure Blob Storage
- [ ] Azure SQL Database
- [ ] Azure Table Storage

Answer: Azure Cache for Redis: This is the ideal solution for both storing session state data and supporting controlled and concurrent access to the same session state data for multiple readers and a single writer. It provides high throughput and low-latency access to data, making it suitable for session state management and storing full HTTP responses.

---

Question: What is the level of awesomeness of the services part of the AZ-204 exam?

- [x] Amazing
- [ ] Good
- [ ] Adequate
- [ ] Meh
- [ ] 3.6
- [ ] I prefer using Google Cloud / AWS / Something else

Answer: This is my F-U to Microsoft for providing insufficient, ad-like information in the Learning Path, while also making the exam needlessly hard. Thanks.

---

Question: You need to configure an application performance management (APM) service to collect and monitor the application log data. Which Azure service should you configure?

- [ ] Azure Monitor
- [ ] Log Analytics
- [x] Application Insights
- [ ] Azure Advisor

Answer: Application Insights is a feature of Azure Monitor that provides extensible application performance management (APM) and monitoring for live web applications. Azure Monitor helps you maximize the availability and performance of applications and services.
