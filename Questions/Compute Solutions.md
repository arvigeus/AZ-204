# Compute Solutions

Question: A startup is developing a complex application with multiple microservices. They want to focus on coding without worrying about the underlying infrastructure. They also need the ability to scale based on traffic and handle background tasks. Which Azure service would be the most suitable for this scenario?

- [ ] Azure App Service
- [ ] Azure Container Instances
- [ ] Azure Kubernetes Service
- [ ] Azure Functions
- [x] Azure Container Apps

Answer: Azure Container Apps is designed to handle microservices architecture, providing a serverless experience and enabling scaling based on traffic. It's suitable for startups looking to build complex applications without managing the underlying infrastructure.

---

Question: You need to deploy a containerized application to Azure and require autoscaling based on **custom metrics**. Which Azure service should you use?

- [ ] Azure Container Instances (ACI)
- [ ] Azure App Service
- [x] Azure Container Apps
- [ ] Azure Functions
- [ ] Azure Logic Apps

Answer: Container Apps use **KEDA (Kubernetes Event-driven Autoscaler)** to support scaling on CPU, memory, HTTP requests, event sources (such as Service Bus, Event Hubs, Kafka), and arbitrary custom metrics. Source: [Set scaling rules in Azure Container Apps](https://learn.microsoft.com/en-us/azure/container-apps/scale-app)

- **Azure App Service** can host containers and supports autoscaling, but scaling is limited to built-in or Azure Monitor metrics, making it less flexible than KEDA.
- **Azure Container Instances (ACI)** does not support autoscaling.
- **Azure Functions** can run from containers but scale only on trigger-based events, not arbitrary custom metrics.
- **Azure Logic Apps** is a workflow automation tool, not a general-purpose container hosting service.

---

Want me to also **reformat all your questions** in this consistent style (Question → Options → Correct Answer → Explanation with option-by-option breakdown), so your whole question bank is standardized?

---

Question: An e-commerce company is looking to host its web platform, which includes a customer-facing website and internal web APIs. They want a service that integrates well with other Azure services and is tailored for web applications. Which Azure service would you choose?

- [x] Azure App Service
- [ ] Azure Container Instances
- [ ] Azure Kubernetes Service
- [ ] Azure Functions
- [ ] Azure Container Apps

Answer: Azure App Service is optimized for hosting web applications, including websites and web APIs. Its integration with other Azure services makes it a suitable choice for an e-commerce platform.

---

Question: A retail company is running a public-facing e-commerce website in Azure. The site experiences predictable spikes in traffic during sales campaigns, and management wants to minimize costs during normal hours while automatically handling the spikes. The solution must:

- Host an HTTP-based web application.
- Support custom domains and SSL.
- Scale automatically based on a schedule (e.g., during promotions).
- Require no container orchestration or Kubernetes knowledge.

Which Azure service is the most suitable?

- [x] Azure App Service
- [ ] Azure Container Instances
- [ ] Azure Container Apps
- [ ] Azure Kubernetes Service
- [ ] Azure Functions

Answer: Azure App Service is the best choice here because it:

- Provides a fully managed PaaS for hosting web applications with built-in support for custom domains, SSL, and HTTP workloads.
- Supports autoscaling based on both metrics (CPU, memory, HTTP queue length) and schedules (e.g., scale out during sales campaigns).
- Requires no infrastructure or Kubernetes management.

Other options:

- Azure Container Instances: No autoscaling, poor fit for persistent web apps.
- Azure Container Apps: Supports scaling but is aimed at microservices/event-driven workloads; App Service is a simpler and cheaper fit for standard web apps.
- Azure Kubernetes Service (AKS): Overkill; requires infrastructure management, not aligned with “focus on coding.”
- Azure Functions: Best for event-driven workloads, not full-featured websites with sessions, SSL, and predictable schedule-based scaling.

---

Question: A research team needs to run customized containers for a short-term project. They require a basic and flexible solution without the need for load balancing or automatic scaling. Which Azure service would be the most suitable for this scenario?

- [ ] Azure App Service
- [ ] Azure Container Apps
- [ ] Azure Kubernetes Service
- [ ] Azure Functions
- [x] Azure Container Instances

Answer: Azure Container Instances provides a straightforward way to run customized containers without additional features like load balancing or automatic scaling. It's ideal for a research project that requires flexibility and simplicity.

---

Question: A large enterprise is migrating its applications to containers and requires a robust solution that allows full control over the Kubernetes cluster, including direct access to the Kubernetes API. Which Azure service would you choose?

- [ ] Azure App Service
- [ ] Azure Container Instances
- [x] Azure Kubernetes Service
- [ ] Azure Functions
- [ ] Azure Container Apps

Answer: Azure Kubernetes Service (AKS) offers a fully managed Kubernetes experience with direct access to the Kubernetes API. It's suitable for large enterprises that need robust container orchestration and full control over the cluster.

---

Question: An IoT company is building a data processing system that triggers specific functions based on incoming events from various sensors. They need a solution that can efficiently handle event-driven architecture and execute functions in response to specific triggers. Which Azure service would be the most suitable for this scenario?

- [ ] Azure App Service
- [ ] Azure Container Instances
- [ ] Azure Kubernetes Service
- [x] Azure Functions
- [ ] Azure Container Apps

Answer: Azure Functions is designed to handle event-driven applications, allowing functions to be triggered by specific events. It's an ideal choice for an IoT company that needs to process data based on incoming sensor events.

---
