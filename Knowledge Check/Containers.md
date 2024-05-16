# Containers

http: Give an example for ACR URL and explain the elements?

<!-- `myregistry.azurecr.io/myrepository/myapp:latest` -->

---

md: Explain the differences between ACR tiers - characteristics, recommended, when to use which?

- Basic
- Standard
- Premium

---

md: What benefits does Premium SKU for ACR provide?

---

md: What happens when you exceed you quota? What error will you get? How to fix it?

<!-- Throttling -->

---

md: What affects performance when working with ACR? How to keep performance up?

---

md: What to do if you want to keep your images in multiple regions? What you need? What specifics should you expect?

<!-- Zone redundancy -->

---

sh: Create an ACR with its prerequisites?

---

md: What types of ACR login methods are there? Their characteristics?

<!-- Interactive, Unnatended-->

---

sh: How to authenticate with individual Entra ID identity in ACR?

---

sh: How to create and authenticate with Entra ID service principal in ACR?

---

sh: How to authenticate with admin user in ACR? What should you know about it?

---

sh: How to use managed identity with ACR?

---

md: What can you do with ACR tasks?

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

md: What feature of ACR would you use for OS patching?

---

sh: What do you need to get an image from a container registry, tag it, push it to ACR, then run the docker image?

<!-- `docker run` or `az acr run` -->

---

sh: You have your app on GitHub. You want every push to main to push the Docker image to ACR and deploy the app to (container instance). You want every PR to dev to deploy the app to (container apps). Every Monday at 7:00 AM you should do OS patching. You will need a service principal that can push/pull images.

---

md: Explain ACI? When to use? What limitations they have?

---

md: What are the prerequisites to deploy a container instance?

<!-- Resource group; specifying user assigned identity (with AcrPull permissions) if using ACR with managed identities -->

---

md: Accessing your ACI: what you need to know if accessing by IP? What you need to know if accessing by "normal" way?

<!-- IP may change, use Application Gateway; Use --dns-name-label <name> with --ip-address public for user friendly URL -->

---

md: If using ACR with managed identity, what you need to know?

<!-- Need AcrPull permisison, identity needs to be assigned to az container -->

---

sh: What are the two ways to assign a managed identity to ACI?

---

md: What you need to know (and have) if you want to use persistent storage with ACI?

<!-- Linux, Root, Azure File Shares only (Blob Storage does not support SMB!); You need storage account with account name and key -->

---

sh: How to mount persistent storage to ACI using CLI?

<!-- --azure-file-volume-XXX -->

---

yaml: How to mount persistent storage to ACI using YAML file?

<!-- { volumes: name, azurefile, [properties.container[x].properties.volumeMounts]: name, mountPath } -->

---

sh: How to enable public access with URL to your ACI using CLI?

<!-- --dns-name-label <name>, --ip-address public -->

---

yaml: How to enable public access with URL to your ACI using YAML file?

<!-- { ipAddress: { type: Public }, dnsNameLabel: name } -->

---

md: Explain restart policies in ACR: when to use Always, OnError, None, which is default, what to choose if you want to run only once?

<!-- Default: Always; Never for YOLO; "Terminated" status when stopped -->

---

sh: Define a ACI restart policy using CLI?

<!-- --restart-policy Always -->

---

sh: Define a ACI restart policy using YAML file?

<!-- properties.restartPolicy: Always -->

---

sh: How to use environment variables in ACI using CLI?

<!-- --environment-variables 'foo'='bar' -->

---

yaml: How to use environment variables in ACI using YAML file?

<!-- properties: { volumes: name, azurefile, [properties.container[x].properties.environmentVariables]: name, value } -->

---

md: What do you need to know when using secure environment variables?

<!-- Values not shown into properties, only names -->

---

sh: How to use secure environment variables in ACI using CLI?

<!-- --secrets-environment-variables 'foo'='bar' -->

---

yaml: How to use secure environment variables in ACI using YAML file?

<!-- properties: { volumes: name, azurefile, [properties.container[x].properties.environmentVariables]: name, secureValue } -->

---

md: What do you need to know when mounting secret volumes?

<!-- Linux only; Name=Value translates to file name and content; In YAML values must be Base64-encoded -->

---

sh: How to mount secret volumes in ACI using CLI?

<!-- -secrets foo=bar --secrets-mount-path /mnt/secrets -->

---

yaml: How to mount secret volumes in ACI using YAML file?

<!-- properties: { volumes: name, secret: { foo: bar }, [properties.container[x].properties.volumeMounts]: name, mountPath };  -->

---

md: Describe container groups in ACI?

<!-- Sharing lifecycle, resources, network (including same external IP); Windows can only have one, Linux: many; VM is allocated resources summing up all resouces declared/required (cpu + cpu, memoryInGB + memoryInGB) -->

---

md: When do you need Linux as OS Type in ACI?

<!-- More than one container, using Azure Files or secret volumes -->

---

md: When to use CLI (simple), YAML file, and ARM deployments?

<!-- CLI: single container or cmd; YAML: deploying only container instances; ARM: deploying additional resources like File Shares -->

---

md: Describe the two commands available for logging in ACI?

<!-- az container attach - realtime; az container logs - one time -->

---

sh: How to verify an ACI conrainer is running?

<!-- az container show --query "{FQDN:ipAddress.fqdn,ProvisioningState:provisioningState}" --out table -->

---

yaml: Define YAML template for ACI?

---

md: What are the limitations of Container Apps?

<!-- No root, linux/amd64 images only, use external redis for in-mamery state -->

---

How to update a Container App when a new image has been published to ACR?

<!-- webhooks -->

---

md: What can you tell about authentication middleware in Container Apps? How does it run? What it requires? Explain about providers?

<!-- sidecar pattern, screens all HTTPS requests, allowInsecure, works with any Open ID identity provider, requires specified identity provider within app -->

---

md: Explain managed identities in Container Apps?

<!-- Access to protected ACR requires AcrPull, not supported in scaling rules -->

---

md: How scaling works in Container Apps? What limits does it have? What is replica?

<!-- new instances of the revision are created, 0-10 replicas -->

---

sh: How to declare min and max replicas in Container Apps via CLI?

<!-- az containerapp create --min-replicas 0 --max-replicas 5 -->

---

md: What happens when you add a new scaling rule in Container Apps?

<!-- In multi revision mode, this creates a new revision; old revisions have don't change their scaling rules -->

---

md: What happens if you don't add any scaling rules in Container Apps? How to ensure your app is running properly?

<!-- default scaling by HTTP, 0-10 replicas; if ingress is disabled, set min replicas to >= 0 or create a rule, otherwise app may not start when scale to 0 -->

---

md: On what is based HTTP scaling in Container Apps?

<!--Concurrent HTTP requests to revision -->

---

sh: How to add HTTP scaling rule for Container Apps?

<!-- az containerapp create --scale-rule-name http-rule-name --scale-rule-type http --scale-rule-http-concurrency 100 -->

---

md: Explain TCP scaling in Container Apps?

<!--Concurrent TCP connections to revision -->

---

sh: How to add TCP scaling rule for Container Apps?

<!-- az containerapp create --scale-rule-name tcp-rule-name --scale-rule-type tcp --scale-rule-tcp-concurrency 100 -->

---

md: On what custom scaling can be based in Container apps and what limitations are there?

<!-- CPU, Ram, Service Bus, Event Hub, Redis; CPU and RAM cannot scale to 0 -->

---

sh: How to add custom scaling rule for Service Bus in Container Apps?

<!-- az containerapp create --secrets "connStr=value" --scale-rule-auth "connection=connStr" --scale-rule-name servicebus-rule-name --scale-rule-type azure-servicebus --scale-rule-metadata "queueName=my-queue" "namespace=service-bus-namespace" "messageCount=5" -->

---

md: Explain revisions in Container Apps? When are they created?

<!-- Immutable snapshots, split traffic, revision scope changes -->

---

md: Explain single revision mode in Container Apps? How it works?

<!-- keep the old revision active until the new one is ready -->

---

md: Explain multiple revision mode in Container Apps? How it works? How to control the traffic?

<!-- you control revision lifecycle and traffic distribution; ingress -->

---

md: Explain revision labels in Container Apps? When would you use them?

<!-- direct traffic to specific revisions, with assigned unique URL that can be reused among revisions -->

---

md: Describe revision scope changes in Container Apps?

<!-- New version on changes to properties.template - version suffixm container config, scaling rules. Need to run az containerapp update afterwards. Only new revisions will be affected -->

---

md: Describe revision scope changes in Container Apps?

<!-- Applied to all revisions, no new revision. For secrets, rev mode, ingress, credentials, DARP. Need to restart apps to reload secrets and credentials -->

---

md: Describe secrets in Container Apps? How to access added/modified secrets?

<!-- scoped to app level, outside revisions; restart app to access -->

---

sh: In Container Apps, declare a bogus connection to Key Vault, then use pass it in environment vars

<!-- --secrets "kv-conn=keyvaultref:<KEY_VAULT_SECRET_URI>,identityref:<USER_ASSIGNED_IDENTITY_ID>" --env-vars "ConnectionString=secretref:kv-conn"  -->

---

sh: How to mount secrets in a colume in Container Apps?

<!-- --secret-volume-mount "/mnt/secrets" -->

---

md: What types of logs are there in Container Apps and what kinds of logs they provide?

<!-- System Logs: at the container app level; Console Logs: messages inside container app -->

---

sh: What are the prerequisites before running a Container App?

<!-- az upgrade; az extension add --name containerapp --upgrade; az login; az provider register --namespace Microsoft.App; az containerapp env create -->

---

sh: How to deploy from a git repo to Container Apps?

<!-- az containerapp up --repo myuser/myrepo --context-path ./src -->

---

sh: How to deploy a docker image in Container Apps?

<!-- az containerapp up --image mcr.microsoft.com/img:tag --target-port 80 -->

---

md: How to make Container App accessible from internet?

<!-- ingress external -->

---

md: In the event of a full region outage, what options you have for your Container App?

<!-- Deploy to new region; wait and redeploy; Azure Front Door + deploying to multiple regions -->

---

md: Describe Darp in Container Apps? How to enable it?

<!-- accessible via sidecar; --dapr-enabled -->

---

md: Which components are loaded by default in Darp enabled apps? How to load specific components?

<!-- By default full set of deployed components are loaded; Use application scopes for specific apps -->

---

md: How to send tracking information from Darp enabled Container Apps to Application Insights?

<!-- Via observability -->

---

md: How to perform multi-stage Docker deployment?

<!-- In the Compile Stage, set up and compile code; in the Runtime Stage, prepare and run the application. -->

---

Docker: Demonstrate multi stage app in Docker?

---

Docker: Demonstrate multi stage app in Docker that serves both secure and insecure traffic?

---
