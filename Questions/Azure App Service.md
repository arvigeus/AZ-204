# Azure App Service

Question: Which of the following networking features of App Service can be used to control outbound network traffic?

- [ ] App-assigned address
- [x] Hybrid Connections
- [ ] Service endpoints

Answer: Hybrid Connections are an outbound network feature.

---

Question: In which of the following app configuration settings categories would you set the language and SDK version?

- [ ] Application settings
- [ ] Path mappings
- [x] General settings

Answer: General Settings is used to configure stack, platform, debugging, and incoming client certificate settings.

---

Question: Which of the following types of application logging is supported on the Linux platform?

- [ ] Web server logging
- [ ] Failed request tracing
- [x] Deployment logging

Answer: Deployment logging is supported on the Linux platform.

---

Question: By default, all client requests to the app's production URL (`http://<app_name>.azurewebsites.net`) are routed to the production slot. One can automatically route a portion of the traffic to another slot. What is the default routing rule applied to new deployment slots?

- [x] 0%
- [ ] 10%
- [ ] 20%

Answer: By default, new slots are given a routing rule of `0%`

---

Question: Some configuration elements follow the content across a swap (not slot specific), whereas other configuration elements stay in the same slot after a swap (slot specific). Which of the following settings are swapped?

- [ ] Publishing endpoints
- [x] WebJobs content
- [ ] WebJobs schedulers

Answer: WebJobs content is swapped.

---
