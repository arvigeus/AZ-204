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

sh: How to authenticate with individual AD identity in ACR?

---

sh: How to create and authenticate with AD service principal in ACR?

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
