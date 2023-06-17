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
