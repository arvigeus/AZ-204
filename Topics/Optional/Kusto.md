# [Kusto Queries](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/tutorials/learn-common-operators)

```kql
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

```kql
let sourceMapping = dynamic(
  {
    "Emergency Manager" : "Public",
    "Utility Company" : "Private"
  });
StormEvents
| where Source == "Emergency Manager" or Source == "Utility Company"
| project EventId, Source, FriendlyName = sourceMapping[Source]
```

```kql
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

Knowing whether sampling is in operation:

```kql
union requests,dependencies,pageViews,browserTimings,exceptions,traces
| where timestamp > ago(1d)
| summarize RetainedPercentage = 100/avg(itemCount) by bin(timestamp, 1h), itemType
```

Query Container Logs with Log Analytics:

```kql
ContainerAppConsoleLogs_CL # or ContainerAppSystemLogs_CL
| where ContainerAppName_s == 'album-api'
| project Time=TimeGenerated, AppName=ContainerAppName_s, Revision=RevisionName_s, Container=ContainerName_s, Message=Log_s
| take 100
```

```kql
# Monitor all functions app logs
FunctionAppLogs
| order by TimeGenerated desc

# Select fields
FunctionAppLogs
| project TimeGenerated, HostInstanceId, Message, _ResourceId
| order by TimeGenerated desc

# Monitor a specific functions app logs
FunctionAppLogs
| where FunctionName == "<Function name>"

# Monitor exceptions on a specific functions app logs
FunctionAppLogs
| where ExceptionDetails != ""
| where FunctionName == "<Function name>"
| order by TimeGenerated asc
```

```kql
// Old TLS?
AzureDiagnostics
| where TimeGenerated > ago(90d)
| where ResourceProvider =="MICROSOFT.KEYVAULT"
| where isnotempty(tlsVersion_s) and strcmp(tlsVersion_s,"TLS1_2") <0
| project TimeGenerated,Resource, OperationName, requestUri_s, CallerIPAddress, OperationVersion,clientInfo_s,tlsVersion_s,todouble(tlsVersion_s)
| sort by TimeGenerated desc

// Slow requests?
AzureDiagnostics
| where ResourceProvider =="MICROSOFT.KEYVAULT"
| where DurationMs > 1000
| summarize count() by OperationName, _ResourceId

// How fast is this KeyVault serving requests?
AzureDiagnostics
| where ResourceProvider =="MICROSOFT.KEYVAULT"
| summarize avg(DurationMs) by requestUri_s, bin(TimeGenerated, 1h) // requestUri_s contains the URI of the request
| render timechart

// Failures?
AzureDiagnostics
| where ResourceProvider =="MICROSOFT.KEYVAULT"
| where httpStatusCode_d >= 300 and not(OperationName == "Authentication" and httpStatusCode_d == 401)
| summarize count() by requestUri_s, ResultSignature, _ResourceId
// ResultSignature contains HTTP status, e.g. "OK" or "Forbidden"
// httpStatusCode_d contains HTTP status code returned

// Shows errors caused due to malformed events that could not be deserialized by the job.
AzureDiagnostics
| where ResourceProvider == "MICROSOFT.KEYVAULT" and parse_json(properties_s).DataErrorType in ("InputDeserializerError.InvalidData", "InputDeserializerError.TypeConversionError", "InputDeserializerError.MissingColumns", "InputDeserializerError.InvalidHeader", "InputDeserializerError.InvalidCompressionType")
| project TimeGenerated, Resource, Region_s, OperationName, properties_s, Level, _ResourceId

// How active has this KeyVault been?
AzureDiagnostics
| where ResourceProvider =="MICROSOFT.KEYVAULT"
| summarize count() by bin(TimeGenerated, 1h), OperationName // Aggregate by hour
| render timechart

// Who is calling this KeyVault?
AzureDiagnostics
| where ResourceProvider =="MICROSOFT.KEYVAULT"
| summarize count() by CallerIPAddress
```
