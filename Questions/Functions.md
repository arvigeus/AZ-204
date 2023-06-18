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
Azure Resource Manager (ARM) templates can be used to manage Azure resources, but they do not allow direct editing of the host.json file for a Function App, making it an unsuitable choice.
