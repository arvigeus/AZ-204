# Monitor

Question: What is "flapping" during scaling events?

- [x] Loop condition that causes a series of opposing scale events
- [ ] Time needed for the autoscale to happen
- [ ] Inability of service to scale due to some error

Answer: Flapping happens when a scale event triggers the opposite scale event.

---

Question: You are configuring autoscaling rules for different Azure resources. For each of the following scenarios, indicate whether you should check the "Metric Namespace" checkbox when configuring the autoscaling rule.

- [x] You are scaling an Azure Virtual Machine based on CPU usage. The relevant metric is "Percentage CPU".
- [x] You are scaling an Azure App Service based on the number of HTTP requests. The relevant metric is "Http Queue Length".
- [x] You are scaling an Azure SQL Database based on the number of active connections. The relevant metric is "Active Connections".
- [ ] You are scaling an Azure Function based on the number of messages in a Service Bus queue. The relevant metric is "Active Messages".
- [x] You are scaling an Azure Logic App based on the number of workflow runs. The relevant metric is "Runs".
- [ ] You are scaling an Azure Storage Account based on the amount of data written. The relevant metric is "Egress".
- [x] You are scaling an Azure Kubernetes Service (AKS) cluster based on the amount of CPU resources being used by the nodes in the cluster. The relevant metric is "CPU Usage", which is a standard system metric.
- [x] You are scaling an Azure Event Hub based on the number of incoming messages. The relevant metric is "Incoming Messages".
- [ ] You are scaling an Azure Virtual Machine based on the network in traffic. The relevant metric is "Network In".
- [ ] You are scaling an Azure App Service based on the memory usage. The relevant metric is "Memory Percentage".
- [ ] You are scaling an Azure SQL Database based on the storage used. The relevant metric is "Storage Used".
- [x] You are scaling an Azure Function based on the execution count. The relevant metric is "Execution Count".

Answer:

- The "Percentage CPU" metric is a standard system metric, which is likely grouped under a specific namespace like "System" or "Standard Metrics".
- The "Http Queue Length" metric is specific to the App Service, and is likely grouped under a specific namespace like "AppServiceStandardMetrics".
- The "Active Connections" metric is specific to SQL Databases, and is likely grouped under a specific namespace like "SQLInsights".
- The "Active Messages" metric is not specific to any namespace. In this case, you should clear the checkbox to see all available metrics.
- The "Runs" metric is specific to Logic Apps, and is likely grouped under a specific namespace like "Microsoft.Logic/workflows".
- The "Egress" metric is not specific to any namespace. In this case, you should clear the checkbox to see all available metrics.
- The "CPU Usage" metric is a standard system metric, which is likely grouped under a specific namespace like "System" or "Standard Metrics".
- The "Incoming Messages" metric is specific to Event Hubs, and is likely grouped under a specific namespace like "Microsoft.EventHub/namespaces"
- The "Network In" metric is not specific to any namespace. In this case, you should clear the checkbox to see all available metrics.
- The "Memory Percentage" metric is not specific to any namespace. In this case, you should clear the checkbox to see all available metrics.
- The "Storage Used" metric is not specific to any namespace. In this case, you should clear the checkbox to see all available metrics.
- The "Execution Count" metric is specific to Azure Functions, and is likely grouped under a specific namespace like "Microsoft.Web/sites/functions".

---

Question: You are managing a set of Azure virtual machines for a high-traffic e-commerce website. To ensure optimal performance, you decide to set up an alert for any VM that experiences high CPU usage. Specifically, you want to be notified if a VM's average CPU usage exceeds 90% over a 5-minute window, and you want this condition to be evaluated every minute. Additionally, when this alert is triggered, a specific action group should be notified. Using the Azure CLI, craft the appropriate `az monitor metrics alert create` command to achieve this.

```ps
az monitor metrics alert create -n alert1 -g {ResourceGroup} --scopes {VirtualMachineID} \
    # Code here
    --description "High CPU"
```

Answer:

```ps
az monitor metrics alert create -n alert1 -g {ResourceGroup} --scopes {VirtualMachineID} \
    --condition "avg Percentage CPU > 90" \
    --window-size 5m \
    --evaluation-frequency 1m \
    --action {ActionGroupResourceID} \
    --description "High CPU"
```

`--scopes {VirtualMachineID}`: Specifies the ID of the virtual machine you want to monitor.  
`--condition "avg Percentage CPU > 90"`: Defines the alert criteria, which is an average CPU percentage greater than 90%.  
`--window-size 5m`: Sets the period over which the metric data is aggregated to 5 minutes.  
`--evaluation-frequency 1m`: Sets the frequency at which the metric data is evaluated to every minute.  
`--action {ActionGroupResourceID}`: Specifies the action group to be triggered when the alert fires.

---

Question: You are managing an Azure App Service Web App named `mywebapp`, which hosts a Node.js application. This Web App is running within an App Service Plan called `myplan` in the standard tier, located in a resource group named `mygroup`. You are tasked with setting up monitoring for the CPU usage of `mywebapp`, and you must configure an alert if the CPU usage percentage exceeds 80%. Which resource and metric should you target for this monitoring?"

- [ ] Subscription
- [ ] Resource Group (`mygroup`)
- [x] App Service Plan (`myplan`)
- [ ] Web App (`mywebapp`)

Answer: The CPU usage percentage is monitored at the App Service Plan level, as it defines the resources available to the Web Apps within that plan. Monitoring the App Service Plan provides an indication of the overall CPU usage across all instances of the plan. In the standard tier, multiple Web Apps could be running within the same plan, but monitoring the App Service Plan would still allow you to observe the CPU usage for the specific Web App in question.

---

Question: You are monitoring an Azure App Service Web App and want to use the CPU Time metric. In which of the following App Service plans is the CPU Time metric particularly useful as one of the quotas is defined in CPU minutes used by the app? (Choose all that apply)

- [x] Free
- [ ] Basic
- [ ] Standard
- [ ] Premium
- [x] Shared

Answer: CPU Time is specifically useful for apps hosted in Free or Shared plans, as one of their quotas is defined in CPU minutes used by the app. Other plans do not have this specific quota, making the other options incorrect.

---

Question: You are tasked with monitoring the CPU usage of an Azure App Service Web App and want to use the CPU Percentage metric. In which of the following App Service plans is the CPU Percentage metric a good indication of the overall usage across all instances? (Choose all that apply.)

- [ ] Free
- [x] Basic
- [x] Standard
- [x] Premium
- [ ] Shared

Answer: CPU Percentage is a useful metric for apps hosted in Basic, Standard, and Premium plans, as these plans can be scaled out, and CPU Percentage provides a good indication of the overall usage across all instances. Options A and E are incorrect as CPU Percentage is not specifically mentioned as useful for Free or Shared plans.

---

Question: What should you use if you want to be notified if your website becomes unresponsive in different geographical regions within Azure?

- [ ] Configure a Load Balancer rule to monitor website traffic.
- [x] Add a rule in the Availability Test in Azure Application Insights.
- [ ] Set up a Geo-Redundancy alert in Azure Storage.
- [ ] Enable Traffic Manager monitoring with email notifications.

Answer: The correct option is to add a rule in the Availability Test in Azure Application Insights. This allows you to set up an alert that will notify you via email or SMS if the web app becomes unresponsive in different geographical regions.  
Load Balancer rule is used to distribute network traffic, not to monitor website responsiveness.  
Geo-Redundancy alerts in Azure Storage are related to data replication and availability, not website responsiveness.  
Traffic Manager monitoring is used for routing network traffic and does not directly provide notifications for website responsiveness.

---

Question: What do you need to do in order to send the activity log to a Log Analytics workspace?

- [ ] Configure `appsettings.json`
- [ ] Configure `Startup.cs`
- [x] Create Diagnostic setting
- [ ] Upgrade to Premium

Answer: Create a diagnostic setting to send the activity log to a Log Analytics workspace.

---

Question: Which diagnostic setting destination in Azure allows you to perform complex analysis with Kusto queries?

- [ ] Azure Event Hubs
- [ ] Azure Storage Account
- [x] Log Analytics Workspace
- [ ] Azure Virtual Machine

Answer: Log Analytics Workspace enables the correlation of activity log data with other monitoring data, complex analysis, and deep insights on activity log entries.

---

Question: When you need to retain your Azure activity log data longer than 90 days for audit, static analysis, or backup, which diagnostic setting destination should you use?

- [ ] Azure Event Hubs
- [x] Azure Storage Account
- [ ] Log Analytics Workspace
- [ ] Azure SQL Database

Answer: Azure Storage Account allows you to retain activity log data longer than the default 90 days, suitable for audit, static analysis, or backup purposes.

---

Question: If you want to send Azure activity log entries outside of Azure, which diagnostic setting destination would you choose?

- [x] Azure Event Hubs
- [ ] Azure Virtual Network
- [ ] Azure Storage Account
- [ ] Log Analytics Workspace

Answer: Azure Event Hubs enables the forwarding of activity log entries outside of Azure, making it suitable for integration with third-party SIEM or other log analytics solutions.

---

Question: You are experiencing data loss in Azure Monitor. What could be the possible reasons for this issue?

- [x] Required fields are missing.
- [x] One or more fields exceed size limits.
- [ ] The data is being encrypted with an unsupported algorithm.
- [ ] The Azure Monitor logs are being archived to an unsupported storage account.
- [ ] The monitoring agent is running an outdated version.
- [ ] The network connection to the Azure data center is too slow.

Answer: Missing required fields or exceeding size limits can lead to data being rejected by the back end.

---
