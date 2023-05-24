# Application Insights

Question: Which of the following availability tests is recommended for authentication tests?

- [ ] URL ping
- [ ] Standard
- [x] Custom TrackAvailability

Answer: Custom TrackAvailability test is the long term supported solution for multi request or authentication test scenarios.  
The URL ping test is used to test endpoint availability.  
Standard test is similar to the URL ping test, but it includes additional information.

Question: Which of the following metric collection types provides near real-time querying and alerting on dimensions of metrics, and more responsive dashboards?

- [ ] Log-based
- [x] Pre-aggregated
- [ ] Azure Service Bus

Answer: Pre-aggregated metrics are stored as a time series and only with key dimensions, which enable near real-time alerting on dimensions of metrics, more responsive dashboards.  
Azure Service Bus is message queueing service.  
Log-based metrics are aggregated at query time and require more processing to produce results.
