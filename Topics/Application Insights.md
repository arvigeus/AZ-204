# [Azure Application Insights](https://docs.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview)

Application Insights, an extension of Azure Monitor, is a comprehensive Application Performance Monitoring (APM) tool. It provides unique features that help monitor applications throughout their lifecycle, from development and testing to production.

| Feature                            | Description                                                                                                                                                    |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Live Metrics                       | Observe activity from your deployed application in real time with no effect on the host environment.                                                           |
| Availability                       | Also known as “Synthetic Transaction Monitoring”, probe your application's external endpoint(s) to test the overall availability and responsiveness over time. |
| GitHub or Azure DevOps integration | Create GitHub or Azure DevOps work items in the context of Application Insights data.                                                                          |
| Usage                              | Understand which features are popular with users and how users interact and use your application.                                                              |
| Smart Detection                    | Automatic failure and anomaly detection through proactive telemetry analysis.                                                                                  |
| Application Map                    | A high-level top-down view of the application architecture and at-a-glance visual references to component health and responsiveness.                           |
| Distributed Tracing                | Search and visualize an end-to-end flow of a given execution or transaction.                                                                                   |

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

NOTE: `az monitor activity-log` _cannot_ display data from Application Insight telemetry!

## Metrics

**Log-based metrics** are generated from stored events and offer thorough data analysis and diagnostics. Developers can manually send events using the SDK or utilize automatic event collection. While these metrics provide deep insights, managing them can be challenging for high-volume applications, requiring techniques like sampling and filtering to reduce event count. However, these techniques can potentially reduce the accuracy of log-based metrics.

**Standard metrics** are **pre-aggregated** time-series data, offering faster query times and thus are ideal for dashboards and real-time alerts. The Application Insights SDK can pre-aggregate these metrics during collection for more accurate results, unaffected by sampling or filtering. In scenarios where the SDK doesn't pre-aggregate, the backend of Application Insights does the job.

Even without SDK pre-aggregation, you can use pre-aggregated metrics for improved performance and real-time alerts. It's worth noting that ingestion sampling does not affect the accuracy of pre-aggregated metrics, regardless of your SDK version.

You can switch between these two types of metrics using the namespace selector in the metrics explorer.

[Supported Metrics](https://learn.microsoft.com/en-us/azure/azure-monitor/reference/supported-metrics/metrics-index)

## [Sampling](https://learn.microsoft.com/en-us/azure/azure-monitor/app/sampling)

Reduces telemetry traffic, data costs, and storage expenses while maintaining accurate application data analysis. It prevents telemetry throttling and allows navigation between related items for diagnostic investigations. Metric counts are renormalized to minimize statistical impact.

High sampling rates can reduce log-based query accuracy (especially at ~60% or higher rates). To address this, pre-aggregated metrics are employed in the SDKs, ensuring accurate results even with sampling. Aggressive filtering may result in alerts not firing as expected.

- **Adaptive sampling**: Enabled by default in SDK, used by Azure Functions. Adjusts telemetry volume from your app to stay within a specified traffic rate.
- **Fixed-rate sampling**: Reduces telemetry volume from your server and users' browsers at a rate you set. This is useful for achieving synchronized sampling between client and server, aiding investigations of related events in Search, such as page views and HTTP requests.
- **Ingestion sampling**: Operates at the Application Insights service endpoint. Discards some telemetry from your app at a rate you set, helping to stay within your monthly quota. Doesn't reduce telemetry traffic from your app. Use it if you often reach your monthly quota, or getting too much telemetry from browsers, or if you use older SDK.

For web apps, to keep or discard a set of custom events together, they must share the same `OperationId` value.

Knowing whether sampling is in operation:

```kusto
union requests,dependencies,pageViews,browserTimings,exceptions,traces
| where timestamp > ago(1d)
| summarize RetainedPercentage = 100/avg(itemCount) by bin(timestamp, 1h), itemType
```

### Configuring sampling

ASP.NET:

```cs
var builder = TelemetryConfiguration.Active.DefaultTelemetrySink.TelemetryProcessorChainBuilder;

// Enable AdaptiveSampling so as to keep overall telemetry volume to 5 items per second.
builder.UseAdaptiveSampling(maxTelemetryItemsPerSecond:5);

// Fixed rate sampling
// builder.UseSampling(10.0); // percentage

// If you have other telemetry processors:
builder.Use((next) => new AnotherProcessor(next));
```

## [Kusto Queries](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/tutorials/learn-common-operators)

```kusto
StormEvents
| count # Count rows
| take 5 # Take 5 rows
| project State, EventType, DamageProperty # Select columns
| distinct EventType # List unique values
| where State == 'TEXAS' and EventType == 'Flood' # Filter
| sort by DamageProperty # Sort (desc, asc)
| top 5 by DamageProperty # Get the top n rows
| project StartTime, EndTime, Duration = EndTime - StartTime, DamageProperty # Calculated columns
```

Map values from one set to another:

```kusto
let sourceMapping = dynamic(
  {
    "Emergency Manager" : "Public",
    "Utility Company" : "Private"
  });
StormEvents
| where Source == "Emergency Manager" or Source == "Utility Company"
| project EventId, Source, FriendlyName = sourceMapping[Source]
```

```kusto
browserTimings
| summarize avg(networkDuration), avg(processingDuration), avg(totalDuration) by name

pageViews
| summarize count() by client_Browser

# To associate page views to AJAX calls, join with dependencies
pageViews
| join (dependencies) on operation_Id

requests
| summarize count = sum(itemCount), avgduration = avg(duration) by name

exceptions
| summarize sum(itemCount) by type

# Pull apart the details structure to get more mariables

exceptions
| extend method2 = tostring(details[0].parsedStack[1].method)

# To associate exceptions with their related requests, use a join
exceptions
| join (requests) on operation_Id

dependencies
| summarize sum(itemCount) by target

# To associate dependencies with their related requests, use a join
dependencies
| join (requests) on operation_Id

requests
| summarize sum(itemCount), avg(todouble(customMeasurements.score)) by tostring(customDimensions.game)
```

## [Enable Application Insights for a Function App](https://learn.microsoft.com/en-us/azure/azure-functions/configure-monitoring?tabs=v2#enable-application-insights-integration)

To send data to Application Insights from a function app, you need the key named `APPINSIGHTS_INSTRUMENTATIONKEY`.

Application Insights is usually enabled by default for new functions (created in the same or nearest region to your function app), but it may have to be manually enabled for old functions.

`ILogger` is used to log to Application Insights (not `TelemetryClient`!).

## [Custom events and metrics](https://learn.microsoft.com/en-us/azure/azure-monitor/app/api-custom-events-metrics#getmetric)

Use [`GetMetric()`](https://learn.microsoft.com/en-us/azure/azure-monitor/app/get-metric) instead of `TrackMetric()` in Application Insights. `GetMetric()` handles pre-aggregation, reducing costs and performance issues associated with raw telemetry. It avoids sampling, ensuring reliable alerts. Tracking metrics at a granular level can lead to increased costs, network traffic, and throttling risks. `GetMetric()` solves these concerns by sending summarized data every minute.

```cs
// Set properties such as UserId and DeviceId to identify the machine.
// This information is attached to all events that the instance sends.
TelemetryClient.Context.User.Id = "...";
TelemetryClient.Context.Device.Id = "...";

var telemetry = new TelemetryClient();

// GetMetric: capture locally pre-aggregated metrics for .NET and .NET Core applications

// Monitors usage patterns and sends data to Custom Events for search.
// It names events and includes string properties and numeric metrics.
telemetry.TrackEvent("WinGame");

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
    Trace.Error(ex.Message);
}
finally
{
    timer.Stop();
    // Send data to Dependency Tracking in Application Insights
    telemetry.TrackDependency("DependencyType", "myDependency", "myCall", startTime, timer.Elapsed, success);
}

// Diagnose problems by sending a "breadcrumb trail" to Application Insights
// Lets you send longer data such as POST information.
telemetry.TrackTrace("Some message", SeverityLevel.Warning);

// Send data immediately, rather than waiting for the next fixed-interval sending
telemetry.Flush();
```

## Event log

To write to event log use, `ILogger` or a class inheriting `EventSource`.

## [Usage analysis](https://learn.microsoft.com/en-us/azure/azure-monitor/app/usage-overview)

### [User, session, and event analysis](https://learn.microsoft.com/en-us/azure/azure-monitor/app/usage-segmentation)

- **Users tool**: Counts how many people used the app and its features. If a person uses different browsers or machines, they're counted as more than one user.
- **Sessions tool**: Tracks how many user activity sessions included certain pages and features. A session resets after 30 minutes of inactivity or 24 hours of continuous use.
- **Events tool**: Measures how often pages and features are used. Page views are counted when loaded, and custom events represent specific occurrences like button clicks or task completions.

### [Funnels](https://learn.microsoft.com/en-us/azure/azure-monitor/app/usage-funnels)

Track how users move through different stages of your web application, for example how many users go from the home page to creating a ticket. Use funnels to identify where users may stop or leave your app, helping you understand its effective areas and where improvements are needed.

### [Cohorts](https://learn.microsoft.com/en-us/azure/azure-monitor/app/usage-cohorts)

Group and analyze sets of users, sessions, events, or operations that have something in common. For example, you might make a cohort of users who all tried a new feature.

### [Impact](https://learn.microsoft.com/en-us/azure/azure-monitor/app/usage-impact)

Helps you understand how different factors like load times and user properties influence conversion rates in various parts of your app.

### [Retention](https://learn.microsoft.com/en-us/azure/azure-monitor/app/usage-retention)

Helps you understand how many users come back to your app and how often they engage with specific tasks or goals. For example, if you have a game site, you can see how many users return after winning or losing a game.

### [User Flows](https://learn.microsoft.com/en-us/azure/azure-monitor/app/usage-flows)

Helps you analyze how users navigate between pages and features of your web app. It can answer questions like where users go after visiting a page, where they leave your site, or if they repeat the same action many times.

## Instrument an app for monitoring

Application Insights can be activated via Auto-Instrumentation (agent) or by incorporating its SDK into your application code. The preferred method is Auto-Instrumentation as it requires no developer involvement, reduces future overhead from SDK updates, and allows for application instrumentation without source code access. Additionally, Application Insights supports `OpenCensus` for distributed tracing, aiding metrics collection for services and enabling tracing with technologies like Redis, Memcached, and MongoDB.

## [Availability test](https://learn.microsoft.com/en-us/azure/azure-monitor/app/troubleshoot-availability)

Up to 100 per Application Insights resource.

- [URL ping test (classic)](https://learn.microsoft.com/en-us/azure/azure-monitor/app/monitor-web-app-availability): Check endpoint response and measure performance. Customize success criteria with advanced features like parsing dependent requests and retries. It relies on public internet DNS; ensure public domain name servers resolve all test domain names. Use custom **TrackAvailability** tests otherwise.
- [Standard test (Preview)](https://learn.microsoft.com/en-us/azure/azure-monitor/app/availability-standard-tests): Similar to URL ping, this single request test covers SSL certificate validity, proactive lifetime check, HTTP request verb (`GET`, `HEAD`, or `POST`), custom headers, and associated data.
- [Custom TrackAvailability test](https://learn.microsoft.com/en-us/azure/azure-monitor/app/availability-azure-functions): Custom TrackAvailability test: For custom application availability tests, employ the [TrackAvailability()](https://learn.microsoft.com/en-us/dotnet/api/microsoft.applicationinsights.telemetryclient.trackavailability) method to send results to Application Insights. Ideal for `multi-request` or `authentication` test scenarios. (Note: Multi-step test are the legacy version, depricated in 2019)

Example: Create an alert that will notify you via email if the web app becomes unresponsive:

`Portal > Application Insights resource > Availability > Add Test option > Rules (Alerts) > set action group for availability alert > Configure notifications (email, SMS)`

## [Troubleshoot app performance by using Application Map](https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-map?tabs=net)

Application Map is a tool for identifying app issues, visualizing app parts, and providing comprehensive health metrics, alerts, and diagnostic insights, with Azure service links if used in your app. It terms each deployable part of your app as a "component," allowing developers and operations teams to review performance data.

Components, distinct from inaccessible external dependencies like SQL or Event Hubs, can operate on different servers, roles, or containers. They appear in the Application Insights individually or as roles under one key, but all are visible on the app map regardless of the setup.

The app map presents your app's complete structure, including component interactions. It identifies and updates the number of components upon launching. If components are roles within a single Application Insights resource, they're displayed immediately.

Application Map is designed to represent complex structures with multiple components. Clicking a component provides detailed performance and failure data. Lastly, components are identified by their "cloud role name" in Application Map, which can be manually adjusted to change their display.

## Monitor a local web API by using Application Insights

```cs
// This forces HTTPS
builder.Services.AddApplicationInsightsTelemetry();
builder.Services.AddServiceProfiler();
```

appsettings.json:

```jsonc
"ApplicationInsights": {
  "InstrumentationKey": "instrumentation-key"
}
```

Trust local certificates: `dotnet dev-certs https --trust`

## [Azure Monitor Activity Log](https://learn.microsoft.com/en-us/azure/azure-monitor/essentials/activity-log)

Records subscription-level events, such as modifications to resources or starting a virtual machine.

**Diagnostic Settings**: Allows sending the activity log to different locations:

- **Log Analytics workspace**: Utilize log queries for deep insights (Kusto queries) and complex alerting. By default events are retained for 90 days, but you can create a diagnostic setting for longer retention.
- **Azure Storage account**: For audit, static analysis, or backup. Less expensive, and logs can be kept there indefinitely.
- **Azure Event Hubs**: Stream data to external systems such as third-party SIEMs and other Log Analytics solutions.

## Configuring

### Connection string

From env var `APPLICATIONINSIGHTS_CONNECTION_STRING`. Controls where telemetry is sent.
