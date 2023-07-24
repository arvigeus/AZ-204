# Azure Functions

Question: An organization wants to implement a serverless workflow to solve a business problem. One of the requirements is the solution needs to use a designer-first (declarative) development model. Which of the choices below meets the requirements?

- [ ] Azure Functions
- [x] Azure Logic Apps
- [ ] WebJobs

Answer: Azure Logic Apps enables serverless workloads and uses a designer-first (declarative) development model.

---

Question: You need your Azure Function to use different connection strings when working locally, and when working on production. How to achieve that?

- [ ] Store connection strings in Key Vault and read them in your function
- [ ] Create two versions of the function, one for production and one for local development
- [ ] Store connection string into `host.json` file
- [x] Store connection string into `local.settings.json` file

Answer: When the code is executed in your machine, it will read the `local.settings.json` file. When it is run on Azure, the configuration is picked up from the values set in the configuration settings section of the function.

---

Question: You are tasked with altering the `host.json` file to adjust runtime settings for a function app, aiming to keep the process as straightforward as possible. What method would you utilize?

- [x] Azure Portal
- [ ] Visual Studio Code or other text editor
- [ ] Azure Powershell cmdlets
- [ ] Azure CLI commands
- [ ] Azure Resource Manager (ARM) template

Answer: Azure Portal allows for direct and simple changes to the host.json file in the Function App settings, reducing effort needed.  
Visual Studio Code could be used to edit the host.json file, but this requires downloading the project locally, making changes, and then re-deploying it, which increases effort.  
Azure CLI and Azure Powershell does not include the necessary commands to modify `hosts.json`  
Azure Resource Manager (ARM) templates can be used to manage Azure resources, but they do not allow direct editing of the `host.json` file for a Function App, making it an unsuitable choice.

---

Question: Which of the following is a benefit of stateless design in cloud applications?

- [x] Stateless applications are easier to scale horizontally.
- [ ] Stateless applications are more secure because they don't use databases.
- [ ] Stateless applications are faster because they use less memory.
- [ ] Stateless applications are cheaper because they don't require any storage.

Answer: Stateless applications are easier to scale horizontally. Because each request is processed independently, you can easily add more instances of the application to handle more requests.

---

Question: You are developing a serverless function that needs to maintain some information between requests. What is a good way to manage this state?

- [ ] Store the state in a global variable in the function.
- [ ] Store the state in a cookie.
- [x] Store the state in a database or other external storage.
- [ ] Stateless functions cannot maintain state.

Answer: Store the state in a database or other external storage. Because serverless functions are stateless, they do not maintain any information between requests. To manage state, you can store it in an external storage system like a database.

---

Question: You are developing a web application that needs to maintain user sessions. The application is deployed on multiple servers for load balancing. What is a common issue you might encounter due to the stateless nature of HTTP, and how can it be addressed?

- [x] Users might lose their session data when their requests are handled by different servers. This can be addressed by implementing sticky sessions or by storing session data in a shared database.
- [ ] Users might not be able to make multiple requests at the same time. This can be addressed by implementing asynchronous request handling.
- [ ] Users might not be able to access the application if one of the servers goes down. This can be addressed by implementing a failover mechanism.
- [ ] Users might experience slow response times if the servers are located in different geographical locations. This can be addressed by implementing a content delivery network (CDN).

Answer: Users might lose their session data when their requests are handled by different servers. This can be addressed by implementing sticky sessions or by storing session data in a shared database.

---

Question: Your web application is deployed across multiple servers for load balancing. If one of the servers goes down, what strategy can be implemented to ensure high availability and prevent users from experiencing downtime?

- [ ] Implementing a Content Delivery Network (CDN)
- [ ] Implementing Sticky Sessions
- [x] Implementing a Failover Mechanism
- [ ] Implementing Asynchronous Request Handling

Answer: Implementing a Failover Mechanism. A failover mechanism can automatically redirect traffic to a backup server if the primary server fails, ensuring high availability.

---

Question: You are developing a global web application with users from different geographical locations. Some users are experiencing slow response times due to the distance between their location and the server's location. What can be implemented to improve the response times for these users?

- [ ] Implementing Sticky Sessions
- [x] Implementing a Content Delivery Network (CDN)
- [ ] Implementing a Failover Mechanism
- [ ] Implementing Asynchronous Request Handling

Answer: Implementing a Content Delivery Network (CDN). A CDN can cache the application's content at various points of presence (PoPs) around the world, reducing the distance between users and the server and improving response times.

---
