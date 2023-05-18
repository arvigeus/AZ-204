# Azure App Service

Question: Which of the following App Service plan categories provides the maximum scale-out capabilities?

- [ ] Dedicated compute
- [x] Isolated
- [ ] Shared compute

Answer: The Isolated category provides network and compute isolation, and has the maximum scale-out capability.

Question: Which of the following networking features of App Service can be used to control outbound network traffic?

- [ ] App-assigned address
- [x] Hybrid Connections
- [ ] Service endpoints

Answer: Hybrid Connections are an outbound network feature.

Question: In which of the following app configuration settings categories would you set the language and SDK version?

- [ ] Application settings
- [ ] Path mappings
- [x] General settings

Answer: General Settings is used to configure stack, platform, debugging, and incoming client certificate settings.

Question: Which of the following types of application logging is supported on the Linux platform?

- [ ] Web server logging
- [ ] Failed request tracing
- [x] Deployment logging

Answer: Deployment logging is supported on the Linux platform.

Question: Which of these statements best describes autoscaling?

- [ ] Autoscaling requires an administrator to actively monitor the workload on a system.
- [x] Autoscaling is a scale out/scale in solution.
- [ ] Scaling up/scale down provides better availability than autoscaling.

Answer: The system can scale out when specified resource metrics indicate increasing usage, and scale in when these metrics drop.

Question: Which of these scenarios is a suitable candidate for autoscaling?

- [x] The number of users requiring access to an application varies according to a regular schedule. For example, more users use the system on a Friday than other days of the week.
- [ ] The system is subject to a sudden influx of requests that grinds your system to a halt.
- [ ] Your organization is running a promotion and expects to see increased traffic to their web site for the next couple of weeks.

Answer: Changes in application load that are predictable are good candidates for autoscaling.  
Organization running a promotion: Manual scaling is a better option here since this is a one-off event with a known duration.  
Sudden influx of requests: The increasing burst of activity could be caused by a Denial of Service attack that is attempting to overwhelm your system. Autoscaling wouldn't solve the problem.

Question: By default, all client requests to the app's production URL (`http://<app_name>.azurewebsites.net`) are routed to the production slot. One can automatically route a portion of the traffic to another slot. What is the default routing rule applied to new deployment slots?

- [x] 0%
- [ ] 10%
- [ ] 20%

Answer: By default, new slots are given a routing rule of `0%`

Question: Some configuration elements follow the content across a swap (not slot specific), whereas other configuration elements stay in the same slot after a swap (slot specific). Which of the following settings are swapped?

- [ ] Publishing endpoints
- [x] WebJobs content
- [ ] WebJobs schedulers

Answer: WebJobs content is swapped.
