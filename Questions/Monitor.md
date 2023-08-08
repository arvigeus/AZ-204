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
