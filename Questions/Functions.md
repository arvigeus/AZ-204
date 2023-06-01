# Azure Functions

Question: Which of the following Azure Functions hosting plans is best when predictive scaling and costs are required?

- [ ] Functions Premium Plan
- [x] Dedicated plan
- [ ] Consumption plan

Answer: Dedicated plans run in App service which supports setting autoscaling rules based on predictive usage.

---

Question: An organization wants to implement a serverless workflow to solve a business problem. One of the requirements is the solution needs to use a designer-first (declarative) development model. Which of the choices below meets the requirements?

- [ ] Azure Functions
- [x] Azure Logic Apps
- [ ] WebJobs

Answer: Azure Logic Apps enables serverless workloads and uses a designer-first (declarative) development model.

---

Question: Which of the following choices is required for a function to run?

- [ ] Binding
- [x] Trigger
- [ ] Both triggers and bindings

Answer: A trigger defines how a function is invoked and a function must have exactly one trigger.

---

Question: Which of the following choices supports both the `in` and `out` direction settings?

- [x] Bindings
- [ ] Trigger
- [ ] Connection value

Answer: Input and output bindings use `in` and `out`.

---

Question: What is the difference in terms of cost between `Consumption` and `Premium` plans and any of the App Service plans?

Answer: `Consumption` and `Premium` plans can be more cost-efficient if you have sporadic usage patterns. App Service plans could be more predictable in terms of cost and potentially cheaper for continuous heavy usage.
