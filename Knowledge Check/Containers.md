# Containers

http: Give an example for ACR URL and explain the elements?

<!-- `myregistry.azurecr.io/myrepository/myapp:latest` -->

---

txt: Explain the differences between ACR tiers - characteristics, recommended, when to use which?

- Basic
- Standard
- Premium

---

txt: What benefits does Premium SKU for ACR provide?

---

txt: What happens when you exceed you quota? What error will you get? How to fix it?

<!-- Throttling -->

---

txt: What affects performance when working with ACR? How to keep performance up?

---

txt: What to do if you want to keep your images in multiple regions? What you need? What specifics should you expect?

<!-- Zone redundancy -->

---

sh: Create an ACR with its prerequisites?

---

txt: What types of ACR login methods are there? Their characteristics?

<!-- Interactive, Unnatended-->

---

sh: How to authenticate with individual AD identity in ACR?

---

sh: How to create and authenticate with AD service principal in ACR?

---

sh: How to authenticate with admin user in ACR? What should you know about it?

---

sh: How to use managed identity with ACR?

---

txt: What can you do with ACR tasks?

---

sh: What platforms are supported by ACR tasks?

---

sh: Demonstrate and explain quick tasks in ACR? When to use it?

---

sh: Demonstrate and explain automatically triggered task in ACR? When to use it?

---

sh: Demonstrate and explain scheduled task in ACR? When to use it?

---

sh: Demonstrate and explain multi-step task in ACR? When to use it? Anything particular about defining it?

---

txt: What feature of ACR would you use for OS patching?

---

sh: What do you need to get an image from a container registry, tag it, push it to ACR, then run the docker image?

<!-- `docker run` or `az acr run` -->

---

sh: You have your app on GitHub. You want every push to main to push the Docker image to ACR and deploy the app to (container instance). You want every PR to dev to deploy the app to (container apps). Every Monday at 7:00 AM you should do OS patching. You will need a service principal that can push/pull images.

---
