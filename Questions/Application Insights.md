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
- [ ] Only metrics enabled by thr developer

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

- [ ] Diagnostic trace listener
- [x] The Trace.aspx page
- [ ] Application Insights
- [ ] Event Log

**Answer:** The exception gets logged to a diagnostic trace listener. The Trace.Error method allows you to log exceptions to a diagnostic trace listener. Alternatively, you would need to configure tracing for the application.

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
