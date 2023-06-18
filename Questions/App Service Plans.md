# Azure App Service Plans

Question: Which of the following App Service plan categories provides the maximum scale-out capabilities?

- [ ] Dedicated compute
- [x] Isolated
- [ ] Shared compute

Answer: The Isolated category provides network and compute isolation, and has the maximum scale-out capability.

---

Question: Which of these statements best describes autoscaling?

- [ ] Autoscaling requires an administrator to actively monitor the workload on a system.
- [x] Autoscaling is a scale out/scale in solution.
- [ ] Scaling up/scale down provides better availability than autoscaling.

Answer: The system can scale out when specified resource metrics indicate increasing usage, and scale in when these metrics drop.

---

Question: Which of these scenarios is a suitable candidate for autoscaling?

- [x] The number of users requiring access to an application varies according to a regular schedule. For example, more users use the system on a Friday than other days of the week.
- [ ] The system is subject to a sudden influx of requests that grinds your system to a halt.
- [ ] Your organization is running a promotion and expects to see increased traffic to their web site for the next couple of weeks.

Answer: Changes in application load that are predictable are good candidates for autoscaling.  
Organization running a promotion: Manual scaling is a better option here since this is a one-off event with a known duration.  
Sudden influx of requests: The increasing burst of activity could be caused by a Denial of Service attack that is attempting to overwhelm your system. Autoscaling wouldn't solve the problem.

---

Question: Create an App Service web app `MyAppService` and its prerequisites. The service will be located in West US and must scale if usage is increased. Should be outimized for cost.

```ps
# Code here
```

Answer: `Standard`, `Premium`, `PremiumV2`, and `PremiumV3` all support automatic scaling, but `Standard` is most cost effective in this scenario.

```ps
az group create --name MyResourceGroup --location "West US"

az appservice plan create --name MyAppServicePlan --resource-group MyResourceGroup --sku S1

az webapp create --name MyAppService --resource-group MyResourceGroup --plan MyAppServicePlan
```

---

Question: Create an App Service web app `MyAppService` and its prerequisites. The service will be located in West US and would scale occasionally when some promotion is running. Should be outimized for cost.

```ps
# Code here
```

Answer: All plans support manual scaling, but `Basic` is most cost effective in this scenario.

```ps
az group create --name MyResourceGroup --location "West US"

az appservice plan create --name MyAppServicePlan --resource-group MyResourceGroup --sku B1

az webapp create --name MyAppService --resource-group MyResourceGroup --plan MyAppServicePlan
```

---

Question: Which of the following properties of an App Service plan can be set via Azure CLI:

- [x] Set minimum number of web app instances
- [ ] Set maximum number of web app instances
- [x] Number of preWarmed instances.

Answer: [You can't change the maximum scale limit in Azure CLI](https://learn.microsoft.com/en-us/azure/app-service/manage-automatic-scaling?tabs=azure-cli#set-maximum-number-of-web-app-instances), you must instead use the Azure portal.

```ps
az webapp update --minimum-elastic-instance-count X --prewarmed-instance-count Y
```

---

Question: Which of the following App Service plans supports pre-warmed instances:

- [ ] Free
- [ ] Shared
- [ ] Basic
- [ ] Standard
- [ ] Premium
- [x] PremiumV2
- [x] PremiumV3
- [ ] Isolated
- [ ] IsolatedV2

Answer: Only `PremiumV2` and `PremiumV3` support pre-warmed instances.

---

Question: Which of the following App Service plans supports always ready instances:

- [ ] Free
- [ ] Shared
- [ ] Basic
- [ ] Standard
- [ ] Premium
- [x] PremiumV2
- [x] PremiumV3
- [ ] Isolated
- [ ] IsolatedV2

Answer:

- `PremiumV2` and `PremiumV3`: yes (default 1)
- `Standard` and `Premium`: No, your web app runs on other instances available during the scale out operation, based on threshold defined for autoscale rules.
- `Basic`: No, your web app runs on the number of manually scaled instances.

---

Question: Which of the following App Service plans supports schedule based scaling:

- [ ] Free
- [ ] Shared
- [ ] Basic
- [x] Standard
- [x] Premium
- [ ] PremiumV2
- [ ] PremiumV3
- [ ] Isolated
- [ ] IsolatedV2

Answer: Only `Standard` and `Premium` support schedule based scaling.

---

Question: Which of the following App Service plans does not supports scaling out:

- [x] Free
- [x] Shared
- [ ] Basic
- [ ] Standard
- [ ] Premium
- [ ] PremiumV2
- [ ] PremiumV3
- [ ] Isolated
- [ ] IsolatedV2

Answer: `Free` and `Shared` tiers run apps on a common Azure VM, shared with other users' apps.

---

Question: List App Service plans based on pricing tiers, and their basic characteristics

Answer:

- Shared compute: `Free` and `Shared` tiers run apps on a common Azure VM, shared with other users' apps. CPU quotas are allocated, but scaling out is not possible. These tiers are intended for development and testing purposes only.
- Dedicated compute: `Basic` to `PremiumV3` tiers offer dedicated Azure VMs, sharing compute resources only within the same App Service plan. Higher tiers allow for more VM instances to scale out.
- Isolated: `Isolated` and `IsolatedV2` tiers use dedicated Azure VMs on private Virtual Networks, ensuring both network and compute isolation. They offer maximum scale-out capabilities.

---

Question: How apps are charged in Shared App Service plan:

- [x] Each app is charged for CPU quota
- [ ] Each VM instance in the App Service plan is charged
- [ ] The number of isolated workers that run your apps

Answer: CPU quota

---

Question: How apps are charged in Dedicated compute App Service plan:

- [ ] Each app is charged for CPU quota
- [x] Each VM instance in the App Service plan is charged
- [ ] The number of isolated workers that run your apps

Answer: VM instances

---

Question: How apps are charged in Isolated App Service plan:

- [ ] Each app is charged for CPU quota
- [ ] Each VM instance in the App Service plan is charged
- [x] The number of isolated workers that run your apps

Answer: CPU quota

---

Question: You want to move to another App Service plan. Which of following statements are true:

- [x] You can always move from lower-tiered plan to a higher-tiered plan
- [ ] You can always move from higher-tiered plan to a lower-tiered plan
- [x] You can move from higher-tiered plan to a lower-tiered plan only in certain scenarios
- [x] You can move an app to another App Service plan only in the same resouce group
- [ ] You can move an app to another App Service plan in any resouce group
- [x] You can move an app to another App Service plan only in the same geographical region
- [ ] You can move an app to another App Service plan in any geographical region
- [x] You can move an app to another App Service plan only of the same OS type
- [ ] You can move an app to another App Service plan of any OS type

Answer: You can move an app to another App Service plan, as long as the source plan and the target plan are in the same resource group, geographical region,and of the same OS type, and supports the currently used features.

---

Question: Which App Service plans support custom DNS name:

- [ ] Free
- [x] Shared
- [x] Basic
- [x] Standard
- [x] Premium
- [x] PremiumV2
- [x] PremiumV3
- [x] Isolated
- [x] IsolatedV2

Answer: You cannot have custom DNS name on the `Free` tier.

---

Question: Which App Service plans support custom TLS bindings:

- [ ] Free
- [ ] Shared
- [x] Basic
- [x] Standard
- [x] Premium
- [x] PremiumV2
- [x] PremiumV3
- [x] Isolated
- [x] IsolatedV2

Answer: You cannot have custom TLS bindings on the `Free` and `Shared` tiers.

---

Question: Which App Service plans support ALways On:

- [ ] Free
- [ ] Shared
- [x] Basic
- [x] Standard
- [x] Premium
- [x] PremiumV2
- [x] PremiumV3
- [x] Isolated
- [x] IsolatedV2

Answer: You cannot have ALways On on the `Free` and `Shared` tiers.

---

Question: Which App Service plans support staging environments (deployment slots):

- [ ] Free
- [ ] Shared
- [ ] Basic
- [x] Standard
- [x] Premium
- [x] PremiumV2
- [x] PremiumV3
- [x] Isolated
- [x] IsolatedV2

Answer: You cannot have staging environments on the `Free`, `Shared`, and `Basic` tiers.

---

Question: You have existing App Service web app `MyAppService` in West US running on `Basic` plan. You want to add support for staging environments and move it to North Central US region region. What steps you need to take?

```ps
# Code here
```

Answer: You cannot move web app from one region to other. Also `Basic` plan does not support staging environments. The app needs to be cloned into a new region.

```ps
# Create new resource group with location 'North Central US'
New-AzResourceGroup -Name DestinationAzureResourceGroup -Location "North Central US"

# Create new 'Standard' App Service plan for that group (and set staging environments leter)
New-AzAppServicePlan -Location "North Central US" -ResourceGroupName DestinationAzureResourceGroup -Name DestinationAppServicePlan -Tier Standard

Clone `MyAppService` into new web app and place it in the new App Service plan
$srcapp = Get-AzWebApp -ResourceGroupName SourceAzureResourceGroup -Name MyAppService
$destapp = New-AzWebApp -ResourceGroupName DestinationAzureResourceGroup -Name MyAppService2 -Location "North Central US" -AppServicePlan DestinationAppServicePlan -SourceWebApp $srcapp
```

---

Question: Where the setting for cloning existing App Service web app is located?

- [ ] Application settings
- [x] Development Tools
- [ ] General settings

Answer: General Settings is used to configure stack, platform, debugging, and incoming client certificate settings.

---

Question: You have `MyAppServicePlan` App Service plan that have no apps associated with it. Which of the following statements is true:

- [x] MyAppServicePlan still incurs charges even if unused
- [ ] MyAppServicePlan will not incur any charges if it is not used

Answer: App Service plans that have no apps associated with them still incur charges because they continue to reserve the configured VM instances.

---

Question: You want a Linux App Service web app on an App Service plan that supports custom DNS name. Which App Service plans satisfy these requirenments?

- [ ] Free
- [ ] Shared
- [x] Basic
- [x] Standard
- [x] Premium
- [x] PremiumV2
- [x] PremiumV3
- [x] Isolated
- [x] IsolatedV2

Answer: Although `Shared` supports custom DNS name, it does not support Linux. Lowest is `Basic`.

---

Question: You want an App Service web app which runs on dedicated Azure Virtual Networks. Which App Service plans satisfies this requirenment?

- [ ] Free
- [ ] Shared
- [ ] Basic
- [ ] Standard
- [ ] Premium
- [ ] PremiumV2
- [ ] PremiumV3
- [x] Isolated
- [x] IsolatedV2

Answer: The `Isolated` and `IsolatedV2` tiers run dedicated Azure VMs on dedicated Azure Virtual Networks.

---

Question: When should you isolate your app into a new App Service plan?

Answer:

- The app is resource-intensive.
- You want to scale the app independently from the other apps in the existing plan.
- The app needs resource in a different geographical region.

---

Question: Which of the following statements are true:

- [ ] You can independently scale apps placed in the same App Service plan
- [x] An app runs on all the VM instances configured in the App Service plan.
- [x] If multiple apps are in the same App Service plan, they all share the same VM instances.
- [x] All deployment slots also run on the same VM instances as the app in given App Service plan
- [ ] Diagnostic logs, backups, and WebJobs don't use CPU cycles and memory from VM instances on an App Service plan
- [x] You can improve app's performance if you put it in a new, empty App Service plan

Answer: App Service is set of VMs that run one or group of applications and their services together in the same VM. Scaling out simply adds another VM with the same applications and services.

---

Question: What App Service plan the following command will create:

```powershell
az appservice plan create --name $planName --resource-group $resourceGroupName --location $location
```

- [ ] Free
- [ ] Shared
- [x] Basic
- [ ] Standard
- [ ] Premium
- [ ] PremiumV2
- [ ] PremiumV3
- [ ] Isolated
- [ ] IsolatedV2

Answer: Default SKU is `B1` (Basic)

---

Question: Which Azure Monitor log types are only supported on `Premium` (and above) plan?

- [ ] AppServiceConsoleLogs
- [ ] AppServiceHTTPLogs
- [ ] AppServiceEnvironmentPlatformLogs
- [ ] AppServiceAuditLogs
- [x] AppServiceFileAuditLogs
- [ ] AppServiceAppLogs
- [ ] AppServiceIPSecAuditLogs
- [ ] AppServicePlatformLogs
- [x] AppServiceAntivirusScanAuditLogs

Answer: Anti-virus scan logs using Microsoft Defender and File changes made to the site content
