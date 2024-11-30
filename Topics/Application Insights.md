# [Azure Application Insights](https://docs.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview)

Application Insights, an extension of Azure Monitor, is a comprehensive Application Performance Monitoring (APM) tool. It provides unique features that help monitor applications throughout their lifecycle, from development and testing to production.

Note: Application Insights automatically captures Session Id, so no need to manually capture it.

| Feature                                         | Description                                                                                          |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Live Metrics                                    | Real-time monitoring without affecting the host. For immediate insights during critical deployments. |
| Availability (Synthetic Transaction Monitoring) | Tests endpoints for availability and responsiveness. To ensure uptime and SLAs are met.              |
| GitHub or Azure DevOps integration              | Create GitHub or Azure DevOps work items in the context of Application Insights data.                |
| Usage                                           | Tracks popular features and user interactions.                                                       |
| Smart Detection                                 | Automatic failure and anomaly detection through proactive telemetry analysis.                        |
| Application Map                                 | Top-down view of app architecture with health indicators.                                            |
| Distributed Tracing                             | Search and visualize an end-to-end flow of a given execution or transaction.                         |

Application Insights monitors various aspects of your application's performance and health. It collects Metrics and Telemetry data, including:

- **Request rates, response times, and failure rates**: Identify popular pages, peak usage times, and user locations. Monitor page performance and detect resourcing issues during high request loads.
- **Dependency rates, response times, and failure rates**: Check if external services are causing slowdowns.
- **Exceptions**: Analyze aggregated statistics or specific instances, examining stack traces and related requests. Reports both server and browser exceptions.
- **Page views and load performance**: Information reported by users' browsers.
- **AJAX calls**: Monitor rates, response times, and failure rates for AJAX calls from web pages.
- **User and session counts**: Keep track of user and session numbers.
- **Performance counters**: Monitor CPU, memory, and network usage on Windows or Linux server machines.
- **Host diagnostics**: Gather diagnostic information from Docker or Azure.
- **Diagnostic trace logs**: Correlate trace events with requests by collecting logs from your app.
- **Custom events and metrics**: Create your own events and metrics in the client or server code to track specific business events, such as items sold or games won.

Here are various methods to start monitoring and analyzing your app's performance:

- **Run time**: Use Application Insights with your web app on the server, which is great for already deployed apps and doesn't require code updates.
- **Development time**: Add Application Insights into your code. This allows for customized telemetry collection and more extensive data collection.
- **Web page instrumentation**: Track page views, AJAX, and other client-side activities.
- **Mobile app analysis**: Use Visual Studio App Center to study mobile app usage.
- **Availability tests**: Regularly ping your website from our servers to test availability.

## Metrics

**Log-based metrics**: Offers thorough data analysis and diagnostics. ⭐: you need complete set of events ❌: high-volume apps that require sampling / filtering.

**Standard metrics** are time-series data **pre-aggregated** by either SDK (version does not affect accuracy) or backend (better accuracy), optimized for fast queries. ⭐: dashboards and real-time alerts, use cases _requiring sampling or filtering_.

You can toggle between these metrics types using the metrics explorer's namespace selector.

[Supported Metrics](https://learn.microsoft.com/en-us/azure/azure-monitor/reference/supported-metrics/metrics-index)

### [Sampling](https://learn.microsoft.com/en-us/azure/azure-monitor/app/sampling)

Reduces data traffic and costs while keeping analysis accurate. Helps avoid data limits and makes diagnostics easier. High sampling rates (> 60%) can affect log-based accuracy. Pre-aggregated metrics in SDKs solve this issue, but too much filtering can miss alerts.

- **Adaptive sampling**: On by default, adjusts data volume to stay within set limits. Used in Azure Functions.
- **Fixed-rate sampling**: You set the rate manually. ⭐: syncing client and server data to investigations of related events.
- **Ingestion sampling**: Discards some data at the service endpoint to stay within monthly limits. Doesn't reduce app traffic. Use if you hit monthly limits, or get too much data, or using older SDK.

For web apps, to group custom events, use the same `OperationId` value.

#### Configuring sampling

```cs
var builder = TelemetryConfiguration.Active.DefaultTelemetrySink.TelemetryProcessorChainBuilder;

// Enable AdaptiveSampling so as to keep overall telemetry volume to 5 items per second.
builder.UseAdaptiveSampling(maxTelemetryItemsPerSecond:5);

// Fixed rate sampling
builder.UseSampling(10.0); // percentage

// If you have other telemetry processors:
builder.Use((next) => new AnotherProcessor(next));
```

## [Custom events and metrics](https://learn.microsoft.com/en-us/azure/azure-monitor/app/api-custom-events-metrics#getmetric)

Use [`GetMetric()`](https://learn.microsoft.com/en-us/azure/azure-monitor/app/get-metric) instead of `TrackMetric()`. `GetMetric()` handles **pre-aggregation**, reducing costs and performance issues associated with raw telemetry. It avoids sampling, ensuring reliable alerts. Tracking metrics at a granular level can lead to increased costs, network traffic, and throttling risks. `GetMetric()` solves these concerns by sending summarized data every minute.

```cs
TelemetryConfiguration configuration = TelemetryConfiguration.CreateDefault();
configuration.InstrumentationKey = "your-instrumentation-key-here";
var telemetry = new TelemetryClient(configuration);

// Set properties such as UserId and DeviceId to identify the machine.
// This information is attached to all events that the instance sends.
telemetry.Context.User.Id = "...";
telemetry.Context.Device.Id = "...";

// Monitors usage patterns and sends data to Custom Events for search.
// It names events and includes string properties and numeric metrics.
telemetry.TrackEvent("WinGame");

// GetMetric: capture locally pre-aggregated metrics for .NET and .NET Core applications

// TrackMetric: not the preferred method for sending metrics, but can be used if you're implementing your own pre-aggregation logic
var sample = new MetricTelemetry();
sample.Name = "queueLength";
sample.Sum = 42.3;
telemetry.TrackMetric(sample);

// Track page views at more or different times
telemetry.TrackPageView("GameReviewPage");

// Track the response times and success rates of calls to an external piece of code
var success = false;
var startTime = DateTime.UtcNow;
var timer = System.Diagnostics.Stopwatch.StartNew();

try
{
    // Some code that might throw an exception
    success = true;
}
catch (Exception ex)
{
    // Send exceptions to Application Insights
    telemetry.TrackException(ex);

    // Log exceptions to a diagnostic trace listener (Trace.aspx).
    Trace.TraceError(ex.Message);
}
finally
{
    timer.Stop();
    // TrackDependency: Tracks the performance of external dependencies not automatically collected by the SDK.
    // Use it to measure response times for databases, external services, or caches like Azure Redis.
    // Send data to Dependency Tracking in Application Insights
    telemetry.TrackDependency("DependencyType", "myDependency", "myCall", startTime, timer.Elapsed, success);
}

// Diagnose problems by sending a "breadcrumb trail" to Application Insights
// Lets you send longer data such as POST information.
telemetry.TrackTrace("Some message", SeverityLevel.Warning);

// Event log: use ILogger or a class inheriting EventSource.

// Send data immediately, rather than waiting for the next fixed-interval sending
telemetry.Flush();
```

Read more: [Dependency tracking in Application Insights](https://learn.microsoft.com/en-us/azure/azure-monitor/app/asp-net-dependencies)

## [Usage analysis](https://learn.microsoft.com/en-us/azure/azure-monitor/app/usage-overview)

- [User, session, and event analysis](https://learn.microsoft.com/en-us/azure/azure-monitor/app/usage-segmentation)

  - **Users tool**: Counts unique app users per browser/machine.
  - **Sessions tool**: Tracks feature usage per session; resets after 30min inactivity or 24hr use.
  - **Events tool**: Measures page views and custom events like clicks.

- [Funnels](https://learn.microsoft.com/en-us/azure/azure-monitor/app/usage-funnels): For linear, step-by-step processes. Track how users move through different stages of your web application, for example how many users go from the home page to creating a ticket. Use funnels to identify where users may stop or leave your app, helping you understand its effective areas and where improvements are needed.
- [User Flows](https://learn.microsoft.com/en-us/azure/azure-monitor/app/usage-flows): For understanding complex, branching user behavior. Helps you analyze how users navigate between pages and features of your web app. It can answer questions like where users go after visiting a page, where they leave your site, or if they repeat the same action many times.
- [Cohorts](https://learn.microsoft.com/en-us/azure/azure-monitor/app/usage-cohorts): Group and analyze sets of users, sessions, events, or operations that have something in common. For example, you might make a cohort of users who all tried a new feature.
- [Impact](https://learn.microsoft.com/en-us/azure/azure-monitor/app/usage-impact): Helps you understand how different factors like load times and user properties influence conversion rates in various parts of your app.
- [Retention](https://learn.microsoft.com/en-us/azure/azure-monitor/app/usage-retention): Helps you understand how many users come back to your app and how often they engage with specific tasks or goals. For example, if you have a game site, you can see how many users return after winning or losing a game.

## [Monitor an app (Instrumentation)](https://learn.microsoft.com/en-us/azure/azure-monitor/app/opentelemetry-overview?tabs=aspnetcore)

- **Auto instrumentation**: Telemetry collection through configuration without modifying the application's code or configuring instrumentation.
- **Manual Instrumentation**: Coding against the **Application Insights** or **OpenTelemetry** API. Supports **Entra ID** and **Complex Tracing** (collect data that is not available in Application Insights)

## [Availability test](https://learn.microsoft.com/en-us/azure/azure-monitor/app/troubleshoot-availability)

Up to 100 tests per Application Insights resource.

- [URL ping test (classic - to be retired September 2026)](https://learn.microsoft.com/en-us/azure/azure-monitor/app/monitor-web-app-availability): Check endpoint response and measure performance. Customize success criteria with advanced features like parsing dependent requests and retries. It relies on public internet DNS; ensure public domain name servers resolve all test domain names. Use custom **TrackAvailability** tests otherwise.
- [Standard test](https://learn.microsoft.com/en-us/azure/azure-monitor/app/availability-standard-tests): Similar to URL ping, this single request test covers SSL certificate validity, proactive lifetime check, HTTP request verb (`GET`, `HEAD`, or `POST`), custom headers, and associated data.
- [Custom TrackAvailability test](https://learn.microsoft.com/en-us/azure/azure-monitor/app/availability-azure-functions): Use [TrackAvailability()](https://learn.microsoft.com/en-us/dotnet/api/microsoft.applicationinsights.telemetryclient.trackavailability) method to send results to Application Insights. Ideal for `multi-request` or `authentication` test scenarios. (Note: Multi-step test are the legacy version; To create multi-step tests, use Visual Studio)

Example: Create an alert that will notify you via email if the web app becomes unresponsive:

`Portal > Application Insights resource > Availability > Add Test option > Rules (Alerts) > set action group for availability alert > Configure notifications (email, SMS)`

## [Troubleshoot app performance by using Application Map](https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-map?tabs=net)

Application Map: find issues and understand app's structure. It labels each part as a "component". Components can run on various servers and appear individually or as roles under one key. The whole app is displayed. Components provide performance and failure data. Rename by changing "cloud role name".

## Monitor a local web API by using Application Insights

```cs
// This forces HTTPS
builder.Services.AddApplicationInsightsTelemetry();
builder.Services.AddServiceProfiler();
```

appsettings.json:

```jsonc
"ApplicationInsights": {
  // Needed to send telemetry data to Application Insights
  "InstrumentationKey": "instrumentation-key"
}
```

Trust local certificates: `dotnet dev-certs https --trust`

## Azure Monitor

- Azure Monitor: Infrastructure and multi-resource monitoring, including hybrid and multi-cloud environments.
- Application Insights: Application-level monitoring (application performance management - APM), especially for web apps and services.

Application Insights data can also be viewed in Azure Monitor for a centralized experience.

### [Activity Log](https://learn.microsoft.com/en-us/azure/azure-monitor/essentials/activity-log)

Records subscription-level events, such as modifications to resources or starting a virtual machine.

**Diagnostic Settings**: Allows sending the activity log to different locations:

- **Log Analytics workspace**: Utilize log queries for deep insights (_Kusto queries_) and complex alerting. By default events are retained for 90 days, but you can create a diagnostic setting for longer retention.
- **Azure Storage account**: For audit, static analysis, or backup. Less expensive, and logs can be kept there indefinitely.
- **Azure Event Hubs**: Stream data to external systems such as third-party SIEMs and other Log Analytics solutions.

NOTE: `az monitor activity-log` _cannot_ display data from Application Insight telemetry!

## Configuring

### Connection string

From env var `APPLICATIONINSIGHTS_CONNECTION_STRING`. Controls where telemetry is sent.

## Metric Source Scaling Rule

### Service Bus Queue

- **Message Count**: The number of messages currently in the queue.
- **Active Message Count**: The number of active messages in the queue.
- **Dead-letter Message Count**: The number of messages that have been moved to the dead-letter queue.
- **Scheduled Message Count**: The number of messages that are scheduled to appear in the queue at a future time.
- **Transfer Message Count**: The number of messages transferred to another queue or topic.
- **Transfer Dead-letter Message Count**: The number of messages transferred to the dead-letter queue for another queue or topic.

### Azure Blob Storage

- **Blob Count**: Number of blobs in a container.
- **Blob Size**: Total size of blobs in a container.
- **Egress**: Data egress rate.
- **Ingress**: Data ingress rate.

### Azure Event Hub

- **Incoming Messages**: Number of messages received.
- **Outgoing Messages**: Number of messages sent.
- **Capture Backlog**: Number of messages waiting to be captured.

### Azure Redis Cache

- **Cache Hits**: Number of successful data retrievals.
- **Cache Misses**: Number of failed data retrievals.
- **Get/Set Operations**: Number of get/set operations.
