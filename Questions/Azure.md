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
