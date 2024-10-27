# Application Insights

## Monitor app performance

Instrumenting and monitoring, your apps helps you maximize their availability and performance.

### Explore Application Insights

Application Insights is an extension of Azure Monitor and provides Application Performance Monitoring (APM) features. APM tools are useful to monitor applications from development, through test, and into production in the following ways:

- Proactively understand how an application is performing.
- Reactively review application execution data to determine the cause of an incident.

In addition to collecting metrics and application telemetry data, which describe application activities and health, Application Insights can also be used to collect and store application trace logging data.

The log trace is associated with other telemetry to give a detailed view of the activity. Adding trace logging to existing apps only requires providing a destination for the logs; the logging framework rarely needs to be changed.

#### Application Insights feature overview

Features include, but not limited to:

| Feature                            | Description                                                                                                                                                 |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Live Metrics                       | Observe activity from your deployed application in real time with no effect on the host environment.                                                        |
| Availability                       | Also known as _Synthetic Transaction Monitoring_, probe your applications external endpoints to test the overall availability and responsiveness over time. |
| GitHub or Azure DevOps integration | Create GitHub or Azure DevOps work items in the context of Application Insights data.                                                                       |
| Usage                              | Understand which features are popular with users and how users interact and use your application.                                                           |
| Smart Detection                    | Automatic failure and anomaly detection through proactive telemetry analysis.                                                                               |
| Application Map                    | A high-level top-down view of the application architecture and at-a-glance visual references to component health and responsiveness.                        |
| Distributed Tracing                | Search and visualize an end-to-end flow of a given execution or transaction.                                                                                |

#### What Application Insights monitors

Application Insights collects Metrics and application Telemetry data, which describe application activities and health, as well as trace logging data.

- **Request rates, response times, and failure rates** - Find out which pages are most popular, at what times of day, and where your users are. See which pages perform best. If your response times and failure rates go high when there are more requests, then perhaps you have a resourcing problem.
- **Dependency rates, response times, and failure rates** - Find out whether external services are slowing you down.
- **Exceptions** - Analyze the aggregated statistics, or pick specific instances and drill into the stack trace and related requests. Both server and browser exceptions are reported.
- **Page views and load performance** - reported by your users' browsers.
- **AJAX calls** from web pages - rates, response times, and failure rates.
- **User and session counts**.
- **Performance counters** from your Windows or Linux server machines, such as CPU, memory, and network usage.
- **Host diagnostics** from Docker or Azure.
- **Diagnostic trace logs** from your app - so that you can correlate trace events with requests.
- **Custom events and metrics** that you write yourself in the client or server code, to track business events such as items sold or games won.

#### Getting started with Application Insights

Application Insights is one of the many services hosted within Microsoft Azure, and telemetry is sent there for analysis and presentation. It's free to sign up, and if you choose the basic pricing plan of Application Insights, there's no charge until your application has grown to have substantial usage.

There are several ways to get started monitoring and analyzing app performance:

- **At run time**: instrument your web app on the server. Ideal for applications already deployed. Avoids any update to the code.
- **At development time**: add Application Insights to your code. Allows you to customize telemetry collection and send more telemetry.
- **Instrument your web pages** for page view, AJAX, and other client-side telemetry.
- **Analyze mobile app usage** by integrating with Visual Studio App Center.
- **Availability tests** - ping your website regularly from our servers.

### Discover log-based metrics

Application Insights log-based metrics let you analyze the health of your monitored apps, create powerful dashboards, and configure alerts. There are two kinds of metrics:

- **Log-based metrics** behind the scene are translated into [Kusto queries](https://learn.microsoft.com/en-us/azure/kusto/query/) from stored events.
- **Standard metrics** are stored as preaggregated time series.

Since _standard metrics_ are preaggregated during collection, they have better performance at query time. Standard metrics are a better choice for dashboarding and in real-time alerting. The _log-based metrics_ have more dimensions, which makes them the superior option for data analysis and ad-hoc diagnostics. Use the [namespace selector](https://learn.microsoft.com/en-us/azure/azure-monitor/essentials/metrics-getting-started#create-your-first-metric-chart) to switch between log-based and standard metrics in [metrics explorer](https://learn.microsoft.com/en-us/azure/azure-monitor/essentials/metrics-getting-started).

#### Log-based metrics

Developers can use the SDK to send events manually (by writing code that explicitly invokes the SDK) or they can rely on the automatic collection of events from autoinstrumentation. In either case, the Application Insights backend stores all collected events as logs, and the Application Insights blades in the Azure portal act as an analytical and diagnostic tool for visualizing event-based data from logs.

Using logs to retain a complete set of events can bring great analytical and diagnostic value. For example, you can get an exact count of requests to a particular URL with the number of distinct users who made these calls. Or you can get detailed diagnostic traces, including exceptions and dependency calls for any user session. Having this type of information can significantly improve visibility into the application health and usage, allowing to cut down the time necessary to diagnose issues with an app.

At the same time, collecting a complete set of events may be impractical (or even impossible) for applications that generate a large volume of telemetry. For situations when the volume of events is too high, Application Insights implements several telemetry volume reduction techniques, such as sampling and filtering that reduces the number of collected and stored events. Unfortunately, lowering the number of stored events also lowers the accuracy of the metrics that, behind the scenes, must perform query-time aggregations of the events stored in logs.

#### Preaggregated metrics

The preaggregated metrics aren't stored as individual events with lots of properties. Instead, they're stored as preaggregated time series, and only with key dimensions. This makes the new metrics superior at query time: retrieving data happens faster and requires less compute power. This enables new scenarios such as near real-time alerting on dimensions of metrics, more responsive dashboards, and more.

:bangbang: Both, log-based and pre-aggregated metrics coexist in Application Insights. To differentiate the two, in the Application Insights UX the pre-aggregated metrics are now called "Standard metrics (preview)", while the traditional metrics from the events were renamed to "Log-based metrics".

The newer SDKs ([Application Insights 2.7](https://www.nuget.org/packages/Microsoft.ApplicationInsights/2.7.2) SDK or later for .NET) preaggregate metrics during collection. This applies to [standard metrics sent by default](https://learn.microsoft.com/en-us/azure/azure-monitor/essentials/metrics-supported#microsoftinsightscomponents) so the accuracy isn't affected by sampling or filtering. It also applies to custom metrics sent using [GetMetric](https://learn.microsoft.com/en-us/azure/azure-monitor/app/api-custom-events-metrics#getmetric) resulting in less data ingestion and lower cost.

For the SDKs that don't implement preaggregation the Application Insights backend still populates the new metrics by aggregating the events received by the Application Insights event collection endpoint. While you don't benefit from the reduced volume of data transmitted over the wire, you can still use the preaggregated metrics and experience better performance and support of the near real-time dimensional alerting with SDKs that don't preaggregate metrics during collection.

It's worth mentioning that the collection endpoint preaggregates events before ingestion sampling, which means that [ingestion sampling](https://learn.microsoft.com/en-us/azure/azure-monitor/app/sampling) will never impact the accuracy of preaggregated metrics, regardless of the SDK version you use with your application.

### Instrument an app for monitoring

At a basic level, "instrumenting" is simply enabling an application to capture telemetry. There are two methods to instrument your application:

- Automatic instrumentation (autoinstrumentation)
- Manual instrumentation

**Autoinstrumentation** enables telemetry collection through configuration without touching the application's code. Although it's more convenient, it tends to be less configurable. It's also not available in all languages. See [Autoinstrumentation supported environments and languages](https://learn.microsoft.com/en-us/azure/azure-monitor/app/codeless-overview). When autoinstrumentation is available, it's the easiest way to enable Azure Monitor Application Insights.

**Manual instrumentation** is coding against the Application Insights or OpenTelemetry API. In the context of a user, it typically refers to installing a language-specific SDK in an application. This means that you have to manage the updates to the latest package version by yourself. You can use this option if you need to make custom dependency calls or API calls that are not captured by default with autoinstrumentation. There are two options for manual instrumentation:

- [Application Insights SDKs](https://learn.microsoft.com/en-us/azure/azure-monitor/app/asp-net-core)
- [Azure Monitor OpenTelemetry Distros](https://learn.microsoft.com/en-us/azure/azure-monitor/app/opentelemetry-enable).

#### Enabling via Application Insights SDKs

You only need to install the Application Insights SDK in the following circumstances:

- You require custom events and metrics
- You require control over the flow of telemetry
- Auto-Instrumentation isn't available (typically due to language or platform limitations)

To use the SDK, you install a small instrumentation package in your app and then instrument the web app, any background components, and JavaScript within the web pages. The app and its components don't have to be hosted in Azure. The instrumentation monitors your app and directs the telemetry data to an Application Insights resource by using a unique token.

A list of SDK versions and names is hosted on GitHub. For more information, visit [SDK Version](https://github.com/microsoft/ApplicationInsights-dotnet/blob/develop/docs/versions_and_names.md).

#### Enable via OpenTelemetry

Microsoft worked with project stakeholders from two previously popular open-source telemetry projects, [OpenCensus](https://opencensus.io/) and [OpenTracing](https://opentracing.io/). Together, we helped to create a single project, OpenTelemetry. OpenTelemetry includes contributions from all major cloud and Application Performance Management (APM) vendors and lives within the [Cloud Native Computing Foundation (CNCF)](https://www.cncf.io/). Microsoft is a Platinum Member of the CNCF.

Some legacy terms in Application Insights are confusing because of the industry convergence on OpenTelemetry. The following table highlights these differences. OpenTelemetry terms are replacing Application Insights terms.

| Application Insights      | OpenTelemetry                             |
| ------------------------- | ----------------------------------------- |
| Autocollectors            | Instrumentation libraries                 |
| Channel                   | Exporter                                  |
| Codeless / Agent-based    | Autoinstrumentation                       |
| Traces                    | Logs                                      |
| Requests                  | Server Spans                              |
| Dependencies              | Other Span Types (Client, Internal, etc.) |
| Operation ID              | Trace ID                                  |
| ID or Operation Parent ID | Span ID                                   |

### Select an availability test

After you deploy your web app or website, you can set up recurring tests to monitor availability and responsiveness. Application Insights sends web requests to your application at regular intervals from points around the world. It can alert you if your application isn't responding or responds too slowly. You can create up to 100 availability tests per Application Insights resource.

Availability tests don't require any changes to the website you're testing and work for any HTTP or HTTPS endpoint that's accessible from the public internet. You can also test the availability of a REST API that your service depends on.

You can create up to 100 availability tests per Application Insights resource, and there are three types of availability tests:

- **Standard test:** This is a type of availability test that checks the availability of a website by sending a single request, similar to the deprecated URL ping test. In addition to validating whether an endpoint is responding and measuring the performance, Standard tests also include TLS/SSL certificate validity, proactive lifetime check, HTTP request verb (for example, `GET`,`HEAD`, and `POST`), custom headers, and custom data associated with your HTTP request.
- **Custom TrackAvailability test:** If you decide to create a custom application to run availability tests, you can use the [TrackAvailability()](https://learn.microsoft.com/en-us/dotnet/api/microsoft.applicationinsights.telemetryclient.trackavailability) method to send the results to Application Insights.
- [URL ping test (classic)](https://learn.microsoft.com/en-us/azure/azure-monitor/app/monitor-web-app-availability): You can create this test through the portal to validate whether an endpoint is responding and measure performance associated with that response. You can also set custom success criteria coupled with more advanced features, like parsing dependent requests and allowing for retries.

:bangbang: **URL ping tests:** On September 30, 2026, URL ping tests in Application Insights will be retired. Existing URL ping tests will be removed from your resources. Review the [pricing](https://azure.microsoft.com/pricing/details/monitor) for standard tests and [transition](https://aka.ms/availabilitytestmigration) to using them before September 30, 2026 to ensure you can continue to run single-step availability tests in your Application Insights resources.

### Troubleshoot app performance by using Application Map

Application Map helps you spot performance bottlenecks or failure hotspots across all components of your distributed application. Each node on the map represents an application component or its dependencies; and has health key performance indicator and alerts status. You can select through from any component to more detailed diagnostics, such as Application Insights events. If your app uses Azure services, you can also select through to Azure diagnostics, such as SQL Database Advisor recommendations.

Components are independently deployable parts of your distributed/microservices application. Developers and operations teams have code-level visibility or access to telemetry generated by these application components.

- Components are different from "observed" external dependencies such as SQL, Event Hubs, etc. which your team/organization may not have access to (code or telemetry).
- Components run on any number of server/role/container instances.
- Components can be separate Application Insights instrumentation keys (even if subscriptions are different) or different roles reporting to a single Application Insights instrumentation key. The preview map experience shows the components regardless of their configuration.

You can see the full application topology across multiple levels of related application components. Components could be different Application Insights resources, or different roles in a single resource. The app map finds components by following HTTP dependency calls made between servers with the Application Insights SDK installed.

This experience starts with progressive discovery of the components. When you first load the application map, a set of queries is triggered to discover the components related to this component. A button at the top-left corner updates with the number of components in your application as they're discovered.

Selecting **Update map components** refreshes with all components discovered until that point. Depending on the complexity of your application, this may take a minute to load.

If all of the components are roles within a single Application Insights resource, then this discovery step isn't required. The initial load for such an application has all its components.

![Application Map screenshot showing the initial load of an app where all of the components are roles within a single Application Insights resource.](https://learn.microsoft.com/en-us/training/wwl-azure/monitor-app-performance/media/application-map.png)

One of the key objectives with this experience is to be able to visualize complex topologies with hundreds of components. Click on any component to see related insights and go to the performance and failure triage experience for that component.

![Screenshot showing component details in the Application Map.](https://learn.microsoft.com/en-us/training/wwl-azure/monitor-app-performance/media/application-map-component.png)

Application Map uses the cloud role name property to identify the components on the map. You can manually set or override the cloud role name and change what gets displayed on the Application Map.
