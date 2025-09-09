# Application Insights

Question: Which of the following availability tests is recommended for authentication tests?

- [ ] URL ping
- [ ] Standard
- [x] Custom TrackAvailability

Answer: Custom TrackAvailability test is the long term supported solution for multi request or authentication test scenarios.  
The URL ping test is used to test endpoint availability.  
Standard test is similar to the URL ping test, but it includes additional information.

---

Question: Which of the following metric collection types provides near real-time querying and alerting on dimensions of metrics, and more responsive dashboards?

- [ ] Log-based
- [x] Pre-aggregated
- [ ] Azure Service Bus

Answer: Pre-aggregated metrics are stored as a time series and only with key dimensions, which enable near real-time alerting on dimensions of metrics, more responsive dashboards.  
Azure Service Bus is message queueing service.  
Log-based metrics are aggregated at query time and require more processing to produce results.

---

Question: Which of the following metrics are pre-aggregated?

- [ ] Log based metrics
- [x] Standard metrics
- [ ] All metrics
- [ ] Metrics cannot be pre-aggregated
- [ ] Only metrics enabled by the developer

Answer: Standard metrics are pre-aggregated.

---

Question: Where is the exception logged?

```csharp
try { Save(); }
catch(Exception ex)
{
     var client = new EventSource();
     client.Write(ex.Message);
}
```

- [ ] Diagnostic trace listener
- [ ] The Trace.aspx page
- [ ] Application Insights
- [x] Event Log

Answer: The exception gets logged to Event Log. The Write method of the EventSource class allows you to log data to the Event Log.

---

Question: Where is the exception logged?

```csharp
try { Save(); }
catch(Exception ex)
{
     Trace.Error(ex.Message);
}
```

- [x] Diagnostic trace listener
- [ ] The Trace.aspx page
- [ ] Application Insights
- [ ] Event Log

Answer: The exception gets logged to a diagnostic trace listener. The Trace.Error method allows you to log exceptions to a diagnostic trace listener. Alternatively, you would need to configure tracing for the application.

---

Question: Where is the exception logged?

```csharp
try { Save(); }
catch(Exception ex)
{
     var client = new TelemetryClient();
     client.TrackException(ex);
}
```

- [ ] Diagnostic trace listener
- [ ] The Trace.aspx page
- [x] Application Insights
- [ ] Event Log

Answer: The exception gets logged to Application Insights.

---

Question: Where in Application Insights does the following code send data to?

```csharp
telemetry.TrackEvent("WinGame");
```

- [ ] Custom Metrics
- [ ] Page Views
- [x] Custom Events
- [ ] Dependency Tracking

Answer: The `TrackEvent` method is used to log custom events, which can be used to track user interactions or other significant occurrences within the application.

---

Question: You have the following code:

```csharp
telemetry.TrackTrace("Monitor");
```

Can you use `az monitor activity-log` to view it?

- [ ] Yes
- [x] No

Answer: `az monitor activity-log` _cannot_ display data from Application Insight telemetry.

---

Question: Where in Application Insights does the following code send data to?

```csharp
telemetry.TrackDependency("Database", "Query", startTime, timer.Elapsed, success);
```

- [ ] Custom Metrics
- [ ] Page Views
- [ ] Custom Events
- [x] Dependency Tracking

Answer: The `TrackDependency` method is used to log calls to external dependencies, such as databases, services, or other external resources. This information can be used to monitor the performance and success rate of these calls, helping to identify potential bottlenecks or failures in the system.

---

Question: You have a very old Azure function app and you want to integrate it with Application Insights to save informational log data. Which tasks should you perform?

- [x] Call the `LogInformation` method of the `ILogger` class.
- [x] Manually enable Application Insights in the function app.
- [x] Store the name of the instrumentation key in an app setting named `APPINSIGHTS_INSTRUMENTATIONKEY`.
- [ ] Call the `TrackEvent` method of the `TelemetryClient` class.
- [ ] Disable built-in logging in the function app.
- [ ] Add the Azure App Insights into function App using RBAC.
- [ ] Add the function App into Azure App Insights using RBAC.
- [ ] Add Azure App Insights Service Principle Id to the App settings.
- [ ] Store a key named `APPINSIGHTS_INSTRUMENTATIONKEY` as a secret named applicationinsights in an Azure Key Vault.

Answer: Application Insights may have to be manually enabled for old functions. To send data, you need the key named `APPINSIGHTS_INSTRUMENTATIONKEY`. `ILogger` is used to log to Application Insights (not `TelemetryClient`!).  
Azure function apps use app settings to find the Application Insights key, not secrets from the Key Vault.

---

Question: In your organization, you are working on an ASP.NET web application that is hosted on a development server within the company's internal network. Before transitioning the application to the production server, you must gather performance data from various global locations. What action should you take?

- [x] Implement a URL ping test using Application Insights.
- [ ] Set up HTTP forwarding through an Application Gateway.
- [ ] Establish a VPN connection with a Global Network.
- [ ] Utilize a Load Balancer across diverse availability regions.
- [ ] Enable monitoring of endpoints in a Traffic Manager profile.

Answer: Application Insights provides the ability to monitor, detect, and diagnose performance issues, including those related to geographic locations. A URL ping test specifically allows you to test the responsiveness of a web application from different regions, aligning with the requirement to capture performance metrics from multiple geographies.  
Traffic Manager sets up close endpoints to users to boost performance. Endpoint monitoring checks if these endpoints are working well with a probing agent.

---

Question: In Application Insights, what does the Users tool specifically count?

- [ ] Page views
- [ ] Button clicks
- [x] People using the app
- [ ] User sessions

Answer: The Users tool in Application Insights counts how many people have used the app and its features.

---

Question: When session resets?

- [x] After 30 minutes of inactivity
- [x] After 24 hours of continuous use
- [ ] On application error
- [ ] Never

Answer: In Application Insights, a session is reset after half an hour of user inactivity, or 24 hours of continuous usage.

---

Question: Which of the following can be represented as a custom event in Application Insights?

- [ ] A page view
- [x] A user interaction like a button selection
- [ ] A session reset
- [ ] Both A and B

Answer: Custom events in Application Insights often represent specific occurrences like user interactions such as button selections or task completions.

---

Question: In Application Insights, if a single person uses different browsers or machines, how are they counted in the Users tool?

- [ ] As one user
- [x] As more than one user
- [ ] As an inactive user
- [ ] Not counted

Answer: In Application Insights, a single person using different browsers or machines will be counted as more than one user by the Users tool.

---

Question: What tool should you use in Application Insights to monitor page views?

- [ ] Users tool
- [ ] Sessions tool
- [x] Events tool
- [ ] Custom Events tool

Answer: The Events tool in Application Insights is used to measure how often pages and features are used, including counting when a browser loads a page from your app.

---

Question: You're a product manager for an e-commerce site and want to understand the customer journey from browsing products to completing a purchase. Which Azure Insights feature would you use to identify the stages where customers are dropping off?

- [ ] Users
- [ ] Sessions
- [ ] Events
- [x] Funnels
- [ ] Cohorts
- [ ] Impact
- [ ] Retention

Answer: Funnels are used to track how users move through different stages of a web application. They help identify where users may stop or leave the app, providing insights into effective areas and where improvements are needed.

---

Question: As a marketing analyst, you're tasked with determining how website performance and user characteristics are affecting sales conversions on your online store. Which feature in Azure Insights would you utilize to analyze these factors?

- [ ] Users
- [ ] Sessions
- [ ] Events
- [ ] Funnels
- [ ] Cohorts
- [x] Impact
- [ ] Retention
- [ ] User Flows

Answer: Impact is the feature that helps you understand how different factors, such as load times and user properties, influence conversion rates in various parts of the app. It provides insights into what affects user behavior and conversion.

---

Question: You're leading a team that's launching a new feature, and you want to analyze how different segments of users are interacting with it. Which Azure Insights feature would you use to group users based on their interaction with this new feature?

- [ ] Users
- [ ] Sessions
- [ ] Events
- [ ] Funnels
- [x] Cohorts
- [ ] Impact
- [ ] Retention
- [ ] User Flows

Answer: Cohorts are used to group and analyze sets of users, sessions, events, or operations that have something in common. This feature helps in understanding specific groups or segments within the user base.

---

Question: As a community manager for an online gaming platform, you want to understand player loyalty and how often they return to play after specific achievements or failures. Which Azure Insights feature would you employ to track this information?

- [ ] Users
- [ ] Sessions
- [ ] Events
- [ ] Funnels
- [ ] Cohorts
- [ ] Impact
- [x] Retention
- [ ] User Flows

Answer: Retention is the feature that helps you understand how many users return to your app and how often they engage with specific tasks or goals. It provides insights into user loyalty and repeated engagement with the app.

---

Question: You are a digital marketing manager and want to assess the impact of a recent marketing campaign on your website. You need to determine how many people used your application. Which Azure Insights feature would you use to analyze this information?

- [x] Users
- [ ] Sessions
- [ ] Events
- [ ] Funnels
- [ ] Cohorts
- [ ] Impact
- [ ] Retention
- [ ] User Flows

Answer: Users helps you understand the number of people who have used your application. It provides insights into the demographics and interests of the users, allowing you to assess the reach of your campaign.

---

Question: You're a UX designer working on improving the navigation of a content-rich website. You want to understand the paths users take through the site, where they tend to exit, and if there are any repetitive actions that might indicate a usability issue. Which Azure Insights feature would you use to analyze these navigation patterns?

- [ ] Users
- [ ] Sessions
- [ ] Events
- [ ] Funnels
- [ ] Cohorts
- [ ] Impact
- [ ] Retention
- [x] User Flows

Answer: You would use the "User Flows" feature in Azure Insights to analyze these navigation patterns.

---

Question: What is the primary purpose of the connection string in Application Insights?

- [ ] Authenticates the Application Insights SDK
- [ ] Controls the visual appearance of telemetry data
- [x] Controls where telemetry is sent
- [ ] Encrypts telemetry data for secure transmission

Answer: The connection string in Application Insights is used to define where the telemetry data is sent.  
It doesn't handle authentication, appearance, or encryption of the data.

---

Question: As an Azure Developer, you are tasked with integrating Azure Application Insights into a mobile application using the Azure Mobile Apps SDK. Your goal is to collect telemetry data for analyzing user behavior. Which of the following telemetry types should you avoid manually capturing for this purpose?

- [ ] Exception
- [ ] Events
- [ ] Session Id
- [ ] Trace

Answer: Application Insights already takes care of this for you. Manually capturing it would be redundant and could interfere with the automatically generated Session Ids.

---

Question: Your web application must be able to scale on demand. Which Azure Application Insights data model should you use?

- [x] An Application Insights metric
- [ ] An Application Insights dependency
- [ ] An Application Insights trace
- [ ] An Application Insights event

Answer: You can use Application Insights metrics to scale Web Apps.

---

Question: Your ASP.NET application is generating a high volume of telemetry data, causing you to exceed your data quota. You want to reduce the telemetry traffic while maintaining a statistically correct analysis. Which sampling method would you use?

- [x] Adaptive Sampling
- [ ] Fixed-rate Sampling
- [ ] Ingestion Sampling

Answer: Adaptive sampling automatically adjusts the volume of telemetry sent from the SDK in your ASP.NET application. It is particularly useful for high-volume applications to avoid exceeding data quotas.

---

Question: You have a Java application and you need fine-grained control to apply different sampling rates to selected dependencies, requests, and health checks. Which sampling method would you use?

- [ ] Adaptive Sampling
- [x] Fixed-rate Sampling
- [ ] Ingestion Sampling

Answer: Fixed-rate sampling is available for Java applications and allows you to set the rate yourself. It also supports sampling overrides for fine-grained control over telemetry.

---

Question: You have a running application and you want to control the rate of data ingestion without redeploying the application. Which sampling method would you use?

- [ ] Adaptive Sampling
- [ ] Fixed-rate Sampling
- [x] Ingestion Sampling

Answer: Ingestion sampling happens at the Application Insights service endpoint and allows you to set the sampling rate without redeploying your app. It helps you keep within your monthly quota.

---

Question: Which method should be used here instead of `XXXXXXXXXX` to track response time:

```cs
var startTime = DateTime.UtcNow;
var timer = System.Diagnostics.Stopwatch.StartNew();

try {
  await sendRequest();
}
finally {
  timer.Stop();
  telemetry.XXXXXXXXXX("type", "name", "myTracedRequest", startTime, timer.Elapsed, success);
}
```

- [ ] `TrackEvent`
- [ ] `TrackException`
- [x] `TrackDependency`
- [ ] `TrackRequest`
- [ ] `TrackTrace`

Answer: `TrackDependency`: for those dependencies not automatically collected by SDK, like response times.

---

Question: You’re designing a distributed architecture deployed in containers across AKS and App Services. You want to visualize the full topology in Application Map, including dependencies between components.

Which actions you should take?

- [x] Use the same Application Insights instrumentation key across all services.
- [ ] Ensure that each service runs in the same Azure subscription.
- [ ] Set `cloud_RoleName` uniquely for each component.
- [x] Define `service.name` and `service.namespace` attributes in each service's telemetry configuration.
- [ ] Use `cloud_RoleInstance` to ensure component grouping.

Answer:

- Using the same Application Insights instrumentation key across all services ensures telemetry goes to the same Application Insights resource.
- Defining `service.name` and `service.namespace` ensures proper role naming and grouping on the map via OpenTelemetry.
- Running each service in the same Azure subscription is irrelevant.
- `cloud_RoleInstance` is indirectly set via `service.name` and `service.namespace`.
- `cloud_RoleInstance` defines instance-level granularity, not grouping.

---

Question: You are containerizing a microservice called `inventory-service`, part of the `storefront` platform. You want it to appear under the correct logical grouping in the Application Map.

Which telemetry attributes should you configure?

- [ ] `service.name = storefront`
- [ ] `cloud_RoleName = storefront.inventory-service`
- [x] `service.namespace = storefront`
- [ ] `cloud_RoleInstance = instance-01`
- [x] `service.name = inventory-service`

Answer:

- `service.namespace` defines grouping
- `service.name` defines logical service
- `cloud_RoleName` is derived internally from these.
- `service.name = storefront` is incorrect because it flips the names.
- `cloud_RoleInstance = instance-01` is optional and relates to instances, not grouping.

---

Question: You instrument an ASP.NET Core app using OpenTelemetry. You want to track incoming HTTP requests and outgoing calls to a payment gateway.

Which span kinds should you explicitly use?

- [x] `Server`
- [x] `Client`
- [ ] `Producer`
- [ ] `Internal`
- [ ] `Consumer`

Answer:

- ✅ `Server` for incoming HTTP requests
- ✅ `Client` for outbound calls (e.g. to the payment gateway)
- ❌ `Producer` is for message sending
- ❌ `Internal` is for in-process, not I/O
- ❌ `Consumer` is for receiving from queues

---

Question: You're debugging a performance issue in a multi-service architecture. Application Map shows incomplete dependency lines between services.

What are the likely causes?

- [x] Services send telemetry to separate Application Insights resources.
- [ ] Services don’t expose their metrics via Prometheus exporters.
- [x] `cloud_RoleName` is not uniquely configured per service.
- [ ] The `service.namespace` is missing from some components.
- [ ] The HTTP calls between services are done using raw TCP sockets.

Answer: The likely causes for incomplete dependency lines between services in a multi-service architecture, as indicated by the Application Map, are:

- Services send telemetry to separate Application Insights resources. This breaks the map since Application Insights doesn’t correlate across resources.
- `cloud_RoleName` is not uniquely configured per service. This prevents unique nodes from appearing in the Application Map.

Other options are less likely or irrelevant:

- The `service.namespace` being missing from some components could cause grouping issues but not necessarily map breakage.
- Services not exposing their metrics via Prometheus exporters is irrelevant to Application Insights.
- HTTP calls between services being done using raw TCP sockets is a problem because Application Map expects HTTP dependencies, but this is not one of the primary causes listed.

---

Question: You’re sending custom metrics with OpenTelemetry from a .NET backend. You want to capture detailed latency info, including percentiles, across key endpoints.

Which OpenTelemetry instrument should you use?

- [ ] Counter
- [ ] UpDownCounter
- [x] Histogram
- [ ] ObservableGauge

Answer: Histogram enables min/max/avg/count → ideal for latency.

- Counter only aggregates sums.
- UpDownCounter tracks increments/decrements.
- ObservableGauge is for instantaneous measurements (like memory usage).

---

Question: You’re deploying a worker service that pulls messages from Azure Service Bus and logs operations to Application Insights via OpenTelemetry. You want telemetry to appear as “Requests” in Application Insights.

What should you do?

- [x] Set the span kind to Consumer when processing messages.
- [ ] Set the span kind to Server when dequeuing.
- [ ] Define the span as Client to match dependency tracing.
- [ ] Use a Histogram to record the message processing latency.

Answer: Consumer spans are mapped to Requests in Application Insights.

- Server is for HTTP handling.
- Client is for outgoing calls.
- Histogram is not relevant to classification.

---

Question: You want to reduce noise in your telemetry and exclude internal spans and health checks from being sent to Application Insights.

Which approaches should you implement?

- [x] Use a custom span processor to drop internal spans.
- [ ] Filter spans in Azure Monitor Analytics query language (KQL).
- [ ] Disable telemetry auto-collection in the Application Insights config.
- [x] Use instrumentation-level filtering before export.
- [ ] Configure firewall rules to block span export from local hosts.

Answer: Custom processor and instrumentation filtering are correct ways to prevent span creation/export.

- Filters after ingestion—cost is still incurred.
- Disabling telemetry disables all collection.
- Using firewall is a networking workaround—not a trace filtering solution.

---
