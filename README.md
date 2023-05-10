# Developing Solutions for Microsoft Azure

## Develop Azure compute solutions (25–30%)

1. Implement containerized solutions

   - [Overview of containerization](https://docs.microsoft.com/en-us/azure/architecture/cloud-adoption/appendix/azure-solutions/containers)
   - [Docker containers](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/container-docker-introduction/docker-terminology)
   - [Azure Container Instances](https://docs.microsoft.com/en-us/azure/container-instances/)
   - [Azure Container Apps](https://docs.microsoft.com/en-us/azure/container-apps/overview)
   - [Azure Container Registry](https://docs.microsoft.com/en-us/azure/container-registry/)
   - [Deploying and managing containerized applications](https://docs.microsoft.com/en-us/azure/architecture/framework/devops/release-cycle)
   - [Scaling](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-scale)
   - [Monitoring and diagnostics](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-monitor)

1. Implement Azure App Service Web Apps

   - [App Service overview](https://docs.microsoft.com/en-us/azure/app-service/overview)
   - [App Service plans](https://docs.microsoft.com/en-us/azure/app-service/overview-hosting-plans)
   - [Web Apps](https://docs.microsoft.com/en-us/azure/app-service/overview)
   - [Deployment options](https://docs.microsoft.com/en-us/azure/app-service/deploy-best-practices)
   - [Custom domains and SSL](https://docs.microsoft.com/en-us/azure/app-service/configure-ssl-bindings)
   - [Scaling](https://docs.microsoft.com/en-us/azure/app-service/manage-scale-up)
   - [Monitoring and diagnostics](https://docs.microsoft.com/en-us/azure/app-service/manage-diagnose-and-troubleshoot-app)
   - [App settings and configuration](https://docs.microsoft.com/en-us/azure/app-service/configure-common)
   - [Authentication and authorization](https://docs.microsoft.com/en-us/azure/app-service/overview-authentication-authorization)

1. Implement Azure Functions
   - [Azure Functions overview](https://docs.microsoft.com/en-us/azure/azure-functions/functions-overview)
   - [Serverless computing](https://docs.microsoft.com/en-us/azure/architecture/guide/technology-choices/compute-overview#serverless)
   - [Supported languages](https://docs.microsoft.com/en-us/azure/azure-functions/supported-languages)
   - [Function triggers and bindings](https://docs.microsoft.com/en-us/azure/azure-functions/functions-triggers-bindings)
   - [HTTP trigger](https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-http-webhook-trigger?tabs=csharp)
   - [Input and output bindings](https://docs.microsoft.com/en-us/azure/azure-functions/functions-triggers-bindings)
   - [Function app settings and configuration](https://docs.microsoft.com/en-us/azure/azure-functions/functions-how-to-use-azure-function-app-settings)
   - [Scaling and consumption plan](https://docs.microsoft.com/en-us/azure/azure-functions/functions-scale)
   - [Deployment options](https://docs.microsoft.com/en-us/azure/azure-functions/functions-deployment-technologies)

## Develop for Azure storage (15–20%)

1. Develop solutions that use Azure Cosmos DB

   - [Azure Cosmos DB overview](https://docs.microsoft.com/en-us/azure/cosmos-db/introduction)
   - [Database, container, and item concepts](https://docs.microsoft.com/en-us/azure/cosmos-db/consume-any)
   - [Partitioning and partition keys](https://docs.microsoft.com/en-us/azure/cosmos-db/partitioning-overview)
   - [Request Units (RUs)](https://docs.microsoft.com/en-us/azure/cosmos-db/consume-any-dotnet?tabs=dotnetv2#throughput)
   - [Consistency levels](https://docs.microsoft.com/en-us/azure/cosmos-db/consistency-levels)
   - [Supported APIs](https://docs.microsoft.com/en-us/azure/cosmos-db/sql-api-introduction)
   - [Global distribution](https://docs.microsoft.com/en-us/azure/cosmos-db/distribute-data-globally)
   - [Monitoring and diagnostics](https://docs.microsoft.com/en-us/azure/cosmos-db/monitor-account)
   - [Security features](https://docs.microsoft.com/en-us/azure/cosmos-db/database-security)

1. Develop solutions that use Azure Blob Storage
   - [Storage accounts](https://docs.microsoft.com/en-us/azure/storage/common/storage-account-overview)
   - [Blob storage](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-blobs-introduction)
   - [Access control](https://docs.microsoft.com/en-us/azure/storage/common/storage-auth-aad)
   - [Data redundancy and replication](https://docs.microsoft.com/en-us/azure/storage/common/storage-redundancy)
   - [Shared Access Signatures](https://docs.microsoft.com/en-us/azure/storage/common/storage-sas-overview)
   - [Azure Storage Service Encryption](https://docs.microsoft.com/en-us/azure/storage/common/storage-service-encryption)
   - [Implement storage policies and data lifecycle management](https://docs.microsoft.com/en-us/azure/storage/blobs/lifecycle-management-overview?tabs=azure-portal)
   - [Implement static site hosting](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-blob-static-website)

## Implement Azure security (20–25%)

1. Implement user authentication and authorization

   - [Overview of Azure Active Directory (AAD)](https://docs.microsoft.com/en-us/azure/active-directory/fundamentals/active-directory-whatis)
   - [Users, groups, and devices](https://docs.microsoft.com/en-us/azure/active-directory/fundamentals/active-directory-whatis#what-are-azure-ad-users-groups-and-devices)
   - [Authentication and authorization](https://docs.microsoft.com/en-us/azure/active-directory/develop/authentication-vs-authorization)
   - [Single Sign-On (SSO) and Multi-Factor Authentication (MFA)](https://docs.microsoft.com/en-us/azure/active-directory/authentication/concept-mfa-howitworks)
   - [Azure AD Connect and hybrid identity](https://docs.microsoft.com/en-us/azure/active-directory/hybrid/whatis-azure-ad-connect)

1. Implement secure Azure solutions
   - [Secure app configuration data by using App Configuration or Azure Key Vault](https://docs.microsoft.com/en-us/azure/architecture/best-practices/app-design#use-managed-identities)
   - [Develop code that uses keys, secrets, and certificates stored in Azure Key Vault](https://docs.microsoft.com/en-us/azure/key-vault/general/tutorial-net-create-vault-azure-web-app)
   - [Implement Managed Identities for Azure resources](https://docs.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/overview)
   - Azure Key Vault
     - [Overview of Key Vault](https://docs.microsoft.com/en-us/azure/key-vault/general/overview)
     - [Secrets, keys, and certificates](https://docs.microsoft.com/en-us/azure/key-vault/general/about-keys-secrets-certificates)
     - [Access policies](https://docs.microsoft.com/en-us/azure/key-vault/general/secure-your-key-vault)
     - [Secret rotation](https://docs.microsoft.com/en-us/azure/key-vault/secrets/tutorial-rotation)
     - [Integration with other Azure services](https://docs.microsoft.com/en-us/azure/key-vault/general/tutorial-net-create-vault-azure-web-app)
     - [Monitoring and diagnostics](https://docs.microsoft.com/en-us/azure/key-vault/general/monitoring)

## Monitor, troubleshoot, and optimize Azure solutions (15–20%)

1. Implement caching for solutions

   - [Configure cache and expiration policies for Azure Cache for Redis](https://docs.microsoft.com/en-us/azure/azure-cache-for-redis/cache-best-practices)
   - [Implement secure and optimized application cache patterns including data sizing, connections, encryption, and expiration](https://docs.microsoft.com/en-us/azure/azure-cache-for-redis/cache-best-practices)
   - [Implement Azure CDN endpoints and profiles](https://docs.microsoft.com/en-us/azure/cdn/cdn-create-new-endpoint)

1. Troubleshoot solutions by using Application Insights
   - [Configure an app or service to use Application Insights](https://docs.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview)
   - [Monitor and analyze metrics, logs, and traces](https://docs.microsoft.com/en-us/azure/azure-monitor/app/diagnostic-search)
   - [Implement Application Insights web tests and alerts](https://docs.microsoft.com/en-us/azure/azure-monitor/app/monitor-web-app-availability)
   - Azure Monitor
     - [Overview of Azure Monitor](https://docs.microsoft.com/en-us/azure/azure-monitor/overview)
     - [Metrics and logs](https://docs.microsoft.com/en-us/azure/azure-monitor/overview#data-platform)
     - [Alerting and notifications](https://docs.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-overview)
     - [Application Insights](https://docs.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview)
     - [Log Analytics](https://docs.microsoft.com/en-us/azure/azure-monitor/log-query/log-query-overview)
     - [Integration with other Azure services](https://docs.microsoft.com/en-us/azure/azure-monitor/overview#monitoring-data-from-various-sources)

## Connect to and consume Azure services and third-party services (15–20%)

1. Implement API Management

   - [API Management](https://docs.microsoft.com/en-us/azure/api-management/)
     - [Overview of API Management](https://docs.microsoft.com/en-us/azure/api-management/api-management-key-concepts)
     - [Creating an API Management instance](https://docs.microsoft.com/en-us/azure/api-management/get-started-create-service-instance)
     - [Defining and managing APIs](https://docs.microsoft.com/en-us/azure/api-management/add-api)
     - [Policies in API Management](https://docs.microsoft.com/en-us/azure/api-management/api-management-policies)
     - [Security in API Management](https://docs.microsoft.com/en-us/azure/api-management/api-management-howto-protect-backend-with-aad)
     - [Scaling and pricing tiers](https://docs.microsoft.com/en-us/azure/api-management/api-management-howto-scale)
     - [Monitoring and diagnostics](https://docs.microsoft.com/en-us/azure/api-management/api-management-howto-use-azure-monitor)
     - [Developer portal](https://docs.microsoft.com/en-us/azure/api-management/developer-portal)

1. Develop event-based solutions

   - Implement solutions that use Azure Event Grid
     - [Overview of Event Grid](https://docs.microsoft.com/en-us/azure/event-grid/overview)
     - [Event sources and event handlers](https://docs.microsoft.com/en-us/azure/event-grid/concepts)
     - [Event schema](https://docs.microsoft.com/en-us/azure/event-grid/event-schema)
     - [Filtering events](https://docs.microsoft.com/en-us/azure/event-grid/how-to-filter-events)
     - [Security and authentication](https://docs.microsoft.com/en-us/azure/event-grid/security-authentication)
     - [Monitoring and diagnostics](https://docs.microsoft.com/en-us/azure/event-grid/diagnose-delivery-issues)
   - Implement solutions that use Azure Event Hub
     - [Overview of Event Hubs](https://docs.microsoft.com/en-us/azure/event-hubs/event-hubs-about)
     - [Event Hubs for Apache Kafka](https://docs.microsoft.com/en-us/azure/event-hubs/event-hubs-for-kafka-ecosystem-overview)
     - [Capture events](https://docs.microsoft.com/en-us/azure/event-hubs/event-hubs-capture-overview)
     - [Tutorials and other documentation](https://docs.microsoft.com/en-us/azure/event-hubs/)

1. Develop message-based solutions

   - Implement solutions that use Azure Service Bus

     - [Overview of Service Bus](https://docs.microsoft.com/en-us/azure/service-bus-messaging/service-bus-messaging-overview)
     - [Queues, topics, and subscriptions](https://docs.microsoft.com/en-us/azure/service-bus-messaging/service-bus-queues-topics-subscriptions)
     - [Messaging patterns](https://docs.microsoft.com/en-us/azure/service-bus-messaging/service-bus-azure-and-service-bus-queues-compared-contrasted)
     - [Dead-lettering](https://docs.microsoft.com/en-us/azure/service-bus-messaging/service-bus-dead-letter-queues)
     - [Security and authentication](https://docs.microsoft.com/en-us/azure/service-bus-messaging/service-bus-authentication-and-authorization)
     - [Monitoring and diagnostics](https://docs.microsoft.com/en-us/azure/service-bus-messaging/service-bus-monitoring)

   - Implement solutions that use Azure Queue Storage queues
     - [Overview of Azure Queue Storage](https://docs.microsoft.com/en-us/azure/storage/queues/storage-queues-introduction)
     - [Queue Storage and Windows](https://docs.microsoft.com/en-us/azure/storage/queues/storage-dotnet-how-to-use-queues)
     - [Create a queue](https://docs.microsoft.com/en-us/azure/storage/queues/storage-quickstart-queues-portal)
     - [Pop a queued message](https://docs.microsoft.com/en-us/azure/storage/queues/storage-dotnet-how-to-use-queues#de-queue-the-next-message)

## Additional Topics

### [Azure SQL Database](https://docs.microsoft.com/en-us/azure/azure-sql/database/)

- [Azure SQL Database overview](https://docs.microsoft.com/en-us/azure/azure-sql/database/sql-database-paas-overview)
- [Single database vs. elastic pool](https://docs.microsoft.com/en-us/azure/azure-sql/database/service-tiers-vcore)
- [Deployment models](https://docs.microsoft.com/en-us/azure/azure-sql/database/sql-database-paas-overview)
- [Performance tiers](https://docs.microsoft.com/en-us/azure/azure-sql/database/performance-tiers-guidance)
- [Scaling](https://docs.microsoft.com/en-us/azure/azure-sql/database/serverless-tier-overview)
- [Backup and restore](https://docs.microsoft.com/en-us/azure/azure-sql/database/automated-backups-overview)
- [Security features](https://docs.microsoft.com/en-us/azure/azure-sql/database/security-overview)
- [Data encryption](https://docs.microsoft.com/en-us/azure/azure-sql/database/transparent-data-encryption-tde-overview)
- [Monitoring and diagnostics](https://docs.microsoft.com/en-us/azure/azure-sql/database/monitor-tune-overview)

### [Azure Virtual Machines](https://docs.microsoft.com/en-us/azure/virtual-machines/)

- [Virtual machines overview](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/overview)
- [VM sizes](https://docs.microsoft.com/en-us/azure/virtual-machines/sizes)
- [VM images](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/cli-ps-findimage)
- [VM extensions](https://docs.microsoft.com/en-us/azure/virtual-machines/extensions/overview)
- [Networking](https://docs.microsoft.com/en-us/azure/virtual-machines/networking-overview)
- [Storage](https://docs.microsoft.com/en-us/azure/virtual-machines/data-disk-overview)
- [Security features](https://docs.microsoft.com/en-us/azure/virtual-machines/security)
- [Monitoring and diagnostics](https://docs.microsoft.com/en-us/azure/virtual-machines/diagnostics)
- [Backup and restore](https://docs.microsoft.com/en-us/azure/backup/backup-azure-vms-introduction)
- [Availability and scalability](https://docs.microsoft.com/en-us/azure/virtual-machines/availability)

### [Azure Resource Manager (ARM) templates](https://docs.microsoft.com/en-us/azure/azure-resource-manager/templates/)

- [ARM templates overview](https://docs.microsoft.com/en-us/azure/azure-resource-manager/templates/overview)
- [JSON structure](https://docs.microsoft.com/en-us/azure/azure-resource-manager/templates/template-syntax)
- [Template components (parameters, variables, resources, outputs)](https://docs.microsoft.com/en-us/azure/azure-resource-manager/templates/template-syntax)
- [Template functions](https://docs.microsoft.com/en-us/azure/azure-resource-manager/templates/template-functions)
- [Deployment options](https://docs.microsoft.com/en-us/azure/azure-resource-manager/templates/deployment-script-template)
- [Incremental vs. complete deployment mode](https://docs.microsoft.com/en-us/azure/azure-resource-manager/templates/deployment-modes)
- [Template validation](https://docs.microsoft.com/en-us/azure/azure-resource-manager/templates/template-syntax#parameters)
- [Exporting and importing templates](https://docs)

### [Azure Logic Apps](https://docs.microsoft.com/en-us/azure/logic-apps/)

- [Overview of Logic Apps](https://docs.microsoft.com/en-us/azure/logic-apps/logic-apps-overview)
- [Connectors](https://docs.microsoft.com/en-us/azure/connectors/apis-list)
- [Triggers and actions](https://docs.microsoft.com/en-us/azure/logic-apps/logic-apps-overview#logic-app-workflow-definition-actions-and-triggers)
- [Workflows and control flow](https://docs.microsoft.com/en-us/azure/logic-apps/logic-apps-control-flow-loops-condition-action)
- [Integration with other Azure services](https://docs.microsoft.com/en-us/azure/logic-apps/logic-apps-enterprise-integration-overview)
- [Monitoring and diagnostics](https://docs.microsoft.com/en-us/azure/logic-apps/logic-apps-monitor-your-logic-apps)

### [Azure DevOps](https://docs.microsoft.com/en-us/azure/devops/?view=azure-devops)

- [Overview of Azure DevOps](https://docs.microsoft.com/en-us/azure/devops/user-guide/what-is-azure-devops?view=azure-devops)
- [Azure Boards](https://docs.microsoft.com/en-us/azure/devops/boards/get-started/what-is-azure-boards?view=azure-devops&tabs=agile-process)
- [Azure Repos](https://docs.microsoft.com/en-us/azure/devops/repos/get-started/what-is-repos?view=azure-devops)
- [Azure Pipelines](https://docs.microsoft.com/en-us/azure/devops/pipelines/get-started/what-is-azure-pipelines?view=azure-devops)
- [Azure Test Plans](https://docs.microsoft.com/en-us/azure/devops/test/overview?view=azure-devops)
- [Azure Artifacts](https://docs.microsoft.com/en-us/azure/devops/artifacts/start-using-azure-artifacts?view=azure-devops)
- [Integrating with other Azure services](https://docs.microsoft.com/en-us/azure/devops/boards/integrate-other-tools?view=azure-devops)

### [Azure Networking](https://docs.microsoft.com/en-us/azure/virtual-network/)

- [Virtual Networks (VNet)](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-networks-overview)
- [Subnets](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-network-manage-subnet)
- [Network Security Groups (NSG)](https://docs.microsoft.com/en-us/azure/virtual-network/network-security-groups-overview)
- [Network interfaces](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-network-network-interface)
- [Routing and route tables](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-networks-udr-overview)
- [DNS and custom DNS](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances)
- [Hybrid connections (VPN Gateway, ExpressRoute)](https://docs.microsoft.com/en-us/azure/vpn-gateway/vpn-gateway-about-vpngateways)

### [Load Balancer](https://docs.microsoft.com/en-us/azure/load-balancer/)

- [Overview of Azure Load Balancer](https://docs.microsoft.com/en-us/azure/load-balancer/load-balancer-overview)
- [Types of load balancing (Layer-4, Layer-7)](https://docs.microsoft.com/en-us/azure/load-balancer/load-balancer-overview)
- [Internal and public load balancers](https://docs.microsoft.com/en-us/azure/load-balancer/concepts)
- [Backend pools and health probes](https://docs.microsoft.com/en-us/azure/load-balancer/tutorial-load-balancer-standard-manage-portal)
- [Load balancing rules and NAT rules](https://docs.microsoft.com/en-us/azure/load-balancer/load-balancer-outbound-rules-overview)
- [Inbound and outbound traffic management](https://docs.microsoft.com/en-us/azure/load-balancer/load-balancer-outbound-connections)

### [Traffic Manager](https://docs.microsoft.com/en-us/azure/traffic-manager/)

- [Overview of Azure Traffic Manager](https://docs.microsoft.com/en-us/azure/traffic-manager/traffic-manager-overview)
- [Routing methods (Performance, Priority, Weighted, Geographic)](https://docs.microsoft.com/en-us/azure/traffic-manager/traffic-manager-routing-methods)
- [Traffic Manager profiles](https://docs.microsoft.com/en-us/azure/traffic-manager/traffic-manager-manage-profiles)
- [Endpoints and health checks](https://docs.microsoft.com/en-us/azure/traffic-manager/traffic-manager-monitoring)
- [Traffic Manager integration with other Azure services](https://docs.microsoft.com/en-us/azure/traffic-manager/traffic-manager-load-balancing-azure)

### [Managed Disks](https://docs.microsoft.com/en-us/azure/virtual-machines/managed-disks-overview)

- [Overview of Azure Managed Disks](https://docs.microsoft.com/en-us/azure/virtual-machines/managed-disks-overview)
- [Disk types (Premium SSD, Standard SSD, Standard HDD)](https://docs.microsoft.com/en-us/azure/virtual-machines/disks-types)
- [Disk snapshots and backups](https://docs.microsoft.com/en-us/azure/virtual-machines/disks-snapshot)
- [Disk encryption (Azure Disk Encryption, Azure Storage Service Encryption)](https://docs.microsoft.com/en-us/azure/security/fundamentals/encryption-atrest)

### [Blueprints](https://docs.microsoft.com/en-us/azure/governance/blueprints/)

- [Overview of Azure Blueprints](https://docs.microsoft.com/en-us/azure/governance/blueprints/overview)
- [Blueprint artifacts (ARM templates, policies, RBAC assignments)](https://docs.microsoft.com/en-us/azure/governance/blueprints/create-blueprint-portal)
- [Blueprint lifecycle (draft, publish, assign)](https://docs.microsoft.com/en-us/azure/governance/blueprints/create-blueprint-portal)
- [Versioning and updates](https://docs.microsoft.com/en-us/azure/governance/blueprints/concepts/versioning)

### [Policy](https://docs.microsoft.com/en-us/azure/governance/policy/)

- [Overview of Azure Policy](https://docs.microsoft.com/en-us/azure/governance/policy/overview)
- [Policy definitions and assignments](https://docs.microsoft.com/en-us/azure/governance/policy/concepts/definition-structure)
- [Built-in and custom policies](https://docs.microsoft.com/en-us/azure/governance/policy/concepts/initiative-definition)
- [Compliance reporting](https://docs.microsoft.com/en-us/azure/governance/policy/how-to/get-compliance-data)
- [Policy initiatives](https://docs.microsoft.com/en-us/azure/governance/policy/concepts/initiative-definition)
- [Remediation tasks](https://docs.microsoft.com/en-us/azure/governance/policy/how-to/remediate-resources)

### [Private Link](https://docs.microsoft.com/en-us/azure/private-link/)

- [Overview of Azure Private Link](https://docs.microsoft.com/en-us/azure/private-link/private-link-overview)
- [Private endpoints](https://docs.microsoft.com/en-us/azure/private-link/private-endpoint-overview)
- [Private Link services](https://docs.microsoft.com/en-us/azure/private-link/private-link-service-overview)
- [Network access control with Private Link](https://docs.microsoft.com/en-us/azure/private-link/private-endpoint-network-policies)

### [ExpressRoute](https://docs.microsoft.com/en-us/azure/expressroute/)

- [Overview of Azure ExpressRoute](https://docs.microsoft.com/en-us/azure/expressroute/expressroute-introduction)
- [ExpressRoute circuits and peering](https://docs.microsoft.com/en-us/azure/expressroute/expressroute-circuit-peerings)
- [ExpressRoute connectivity models (CloudExchange, Any-to-Any, Point-to-Point)](https://docs.microsoft.com/en-us/azure/expressroute/expressroute-routing)
- [ExpressRoute Global Reach](https://docs.microsoft.com/en-us/azure/expressroute/expressroute-global-reach)

### [App Configuration](https://docs.microsoft.com/en-us/azure/azure-app-configuration/)

- [Overview of Azure App Configuration](https://docs.microsoft.com/en-us/azure/azure-app-configuration/overview)
- [Configuration storage and retrieval](https://docs.microsoft.com/en-us/azure/azure-app-configuration/quickstart-aspnet-core-app?tabs=core2x)
- [Key-value data and labeling](https://docs.microsoft.com/en-us/azure/azure-app-configuration/concept-key-value)
- [Integration with other Azure services](https://docs.microsoft.com/en-us/azure/azure-app-configuration/integrate-azure-functions)

### [Security Center](https://docs.microsoft.com/en-us/azure/security-center/)

- [Overview of Azure Security Center](https://docs.microsoft.com/en-us/azure/security-center/security-center-introduction)
- [Security recommendations and best practices](https://docs.microsoft.com/en-us/azure/security-center/security-center-recommendations)
- [Security score and regulatory compliance](https://docs.microsoft.com/en-us/azure/security-center/secure-score-security-controls)
- [Threat protection](https://docs.microsoft.com/en-us/azure/security-center/threat-protection)
- [Security policies and assessments](https://docs.microsoft.com/en-us/azure/security-center/policy-definitions)
