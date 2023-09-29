# AZ-204 Synopsis

## Azure Container Registry

1. Prerequisites
1. Quirks
   - Throttling
1. URL
   - registry
   - repository / namespace
   - image / artefact
   - tag
1. SKU
   - Basic
   - Standard
   - Premium (3)
1. Login
   - Interactive
     - Azure AD
     - Admin
   - Unnatended
     - Service principal
     - Managed identities
1. Tasks
   - Supported platforms
   - Types
     - Quick task
     - Automatically triggered task
       - CI
       - Schedule
     - Multi-step task
1. Push and run docker image
1. CLI commands and their order
1. Performance optimizations
1. Concepts
   - Zone Redundancy

## Azure Container Instances

1. Prerequisites
1. Limitations - when not to use (2)
1. Quirks
   - IP Address
1. Using ACR
1. Azure Storage
   - Storage type limitations
   - Files
     - Prerequisites (4)
     - Limitations
     - CLI and YAML
1. Environment variables
   - Public
   - Secure - quirks?
   - CLI and YAML
1. Secret volumes
   - Characteristics
   - Limitations
   - CLI and YAML
1. Deployment - when to use each and CLI examples
   - Image
   - YAML file
   - ARM template
1. Containers
   - Single containers
   - Multi containers
     - Characteristics
     - Limitations
1. Diagnostics and logging
   - CLI commands and their differences
1. Concepts
   - Restart policy

## Azure Container Apps

1. Prerequisites
1. Limitations (3)
1. Authentication
   - How it works?
   - Prerequisites
1. Scaling
   - How does it work (including modes)?
   - Types - differences between Custom and HTTP/TCP
     - HTTP
     - TCP
     - Custom
       - CPU
       - Memory
       - Event driven sources
   - CLI
     - Service Bus scaling
     - Other types of scaling
1. Revisions
   - Modes
     - Single revision
     - Multiple revisions
   - Labels
   - Scopes
     - Application
     - Revision
1. Secrets
   - What happens when a secret is created/updated?
   - Plain Secret values
   - Secret values from Key Vault
   - Mounting secrets in a volume
   - Using secrets in env vars
1. Deployment
   - Prerequisites (4)
   - Types
     - From repo
     - From image
     - ACR
1. Docker
   - Image types
   - Multi-stage deployments
1. Disaster and recovery
   - Manual
   - Resilient
1. Dapr
   - How does it work?
   - Components
   - APIs
     - Service to service invocation
     - State manangement
     - Pub/sub
     - Bindings
     - Actors
     - Observability
     - Secrets
1. Concepts
   - Replica
   - Webhooks
   - Application scopes in Dapr

## Azure App Service

1. Tiers
   - Types
     - Shared compute: Free shared
     - Dedicated compute: Basic, Standard, Premium
     - Isolated
   - Billing. Pitfalls.
   - Features by tiers: Single/Multi tenant / Dedicated workers, Always on, Free Managed Certificates, Manual Scaling, Autoscale, Automatic Scaling, Staging environments, Linux, Log audits
   - When to isolate?
1. Moving service plans
   - Limitations
   - Methods
1. Scaling
   - Prerequisites
   - Types
     - Horizontal
       - Manual
       - Autoscale
       - Automatic Scale
     - Vertical
   - Flapping
   - How to set up a scaling rule?
   - CLI
1. Deployment slots
   - Prerequisites
   - What is shared among slots and what is not?
   - Best practices
   - Swapping settings
   - Custom deployments
   - Route production traffic manually
1. Configuration
   - What is the behavior of app settings/connection strings?
   - Always on
   - ARR affinity
   - App Settings / Connection Strings
     - Import / Export from json
     - Source from KeyVault (and prerequisites)
   - Handler mappings
   - How to map URL path to directory?
1. Persistence
   - File Share vs Blob Storage
   - Behavior
   - Limitations
   - Best practices (2)
1. Deploying apps
   - Git
   - Docker image
   - Compose
   - Local/Remote ZIP
1. Exporting templates
   - Resource group
   - Deployment
1. Authentication
   - Behavior
   - Linux vs Windows
   - Managed identities and deployment slots
   - REST endpoint
     - Purpose?
     - Parameters
   - Authentication flows
     - Server directed
     - Client Directed
   - Access user claims in app code
1. Certificates
   - Behavior
   - How to make accessible and use it in app? (C# and other languages)
   - Types:
     - Free Managed
     - App Service
     - Using Key Vault
     - Private certificate
     - Public certificate
1. Networking
   - Deployment types
     - Single tenant
     - Multi tenant
     - Hybrid Connections vs Gateway
   - Default networking behavior
   - Outbound addresses
1. Diagnostics
   - Types: Application, Web Server, Detailed Error Msgs, Failed request tracking, Deployment logging
   - Location: App Service File System, Blob Option. Limitations.
   - Linux vs Windows
   - AllMetrics
   - Stream logs
     - Quirks
     - Location
     - Get logs: HTTP, errors only, by search term
   - Monitoring apps
     - When to use which metric - per tier
       - CPU Time
       - CPU%
       - Memory %
       - Data
     - CPU metrics quirks
     - CLI get metrics
   - Helth chekcs
     - Behavior
     - Accessing private HC endpoints
   - Application Insights - requirenments
1. Concepts
   - Front ends
   - Workers
   - VM instances: what about the them when it comes to using App Service features?
   - Load balancer - what it handles (2)

## Azure Functions

1. Functions vs Logic Apps vs WebJobs - Development, monitoring, execution
1. Limitations: when not to use
1. Hosting options
   - Limitations (2)
   - Tiers
     - Consumption
     - Premium
     - Dedicated
   - Features per tier: timeout, pre-warmed instances
   - When to choose each - scenarios, predictable costs
   - Scale controller
1. Storage considerations
1. Configuration
   - host.json
   - function.json
   - local.settings.json
   - CLI
1. Triggers and bindings
   - Characteristics
   - Supported languages
   - Available by default
   - Not supported by Consumption plan
   - Types (and return types)
     - HTTP trigger
     - Blob trigger and bindings
     - CosmoDB trigger and bindings
     - Event Grid trigger and output bindings
     - Event Hub trigger and output bindings
     - Service Bus trigger and output binding
     - Queue trigger and output bindings
     - Timer trigger (CRON quirks)
   - Connection string formats
   - Selecting files, events, etc
1. Security
   - Authorization level
     - Annonymous
     - Function
     - Admin
   - Access scopes
     - Function
     - Host
     - Master
   - Access keys
     - URL
     - list, create, delete/revoke
   - Get client identity: from req and header
   - CORS
1. Monitoring
   - Limitations (Linux)
   - Configure and use Application Insights
     - Prerequisites
     - Type of sampling used
   - Logging
     - Verbose logging
   - Identify which part of the system or user code generated the log
   - Solutions with high volume of telemetry
1. Custom Handlers
   - Prerequisites
   - Limits

## Blob Storage

1. Storage Account
   - SKU
     - Tiers
       - Standard
       - Premium
     - Redundancy
   - Changing SKU
   - Failover: specifics and alternatives
   - Storage type
     - BlobStorage
     - BlockBlobStorage
     - FileStorage
     - StorageV1
     - StorageV2
   - Hierarchical namespaces: specifics, requirenments and limitations
1. Containers
   - Public access
1. Blob
   - Types - when to use each?
     - Block
     - Append
     - Page
   - Using blobs with C#
   - Access tiers - when to use each, limitations?
     - Hot
     - Cool
     - Archive - specifics. Accessing data
   - What happens when changing tiers? Pitfalls?
   - Lifecycle policies
     - Supported containers
     - Specifics when working with Lifecycle policies
     - Which actions are available for each storage type?
     - Filters
       - blobType
       - prefixMatch - single and all blobs matching
       - blobIndexMatch
     - What happens when there are multiple policies for a single blob?
     - Access time tracking - what is used for and what requires it
   - Transient error handling
   - Data protection: snapshots vs versions
     - Creation
     - Immutability
     - Deletion
     - Soft delete impact
     - C#
   - Leasing
     - How to access leased blob and what happens whan you don't do it?
     - Leasing blob via C#
     - Leasing blob via HTTP
   - Encryption
     - Keys:
       - Microsoft
       - Customer Managed
       - Customer Provided
     - Storage Account encryption
       - Infrastructure
       - Using Key Vault
     - Encryption scope
       - Pitfalls
     - Client Side Encryption
   - Properties and Metadata
     - Type of properties: System and User defined
     - Working with C#
     - Working with HTTP
     - Standard properties for containers and blobs
   - Access conditions: C# and CLI
     - Resources not modified since last fetched
     - Resources matching etag
     - Resources modified before
     - Resources with lease
     - Selecting resources by tag - specifics
     - Using access conditions in C# / CLI
   - Authorization
     - Kind
       - Shared Key (storage account key) (StorageSharedKeyCredential)
       - AD (DefaultAzureCredential)
       - App credentials (ClientSecretCredential) - prerequisites
     - OAuth access tokens
       - Delegation scope
       - Resource ID
     - RBAC access rights - roles and permissions
     - Anonymous public read access - container and blob level
   - Working with blobs
     - CLI
       - Authenticate
       - Select target: by name, by url
       - Operations: upload, copy
     - C#
       - TokenCredential (from Authorization)
       - Select account
       - Select container (note for class)
       - Operations: download (alt), sync containers
     - HTTP
       - Authorization (2)
       - Upload file, create container
       - Operations: list containers, create container, list blobs, upload, download
   - Object replication
     - Prerequisites
     - Steps (2)
   - AzCopy
     - Permissions and authentication
1. Static website hosting
   - Prerequisites
   - Specifics: containers, permissions, best practices, endpoint, default pages
   - Quirks
   - Limitations (3) and mitigation
   - Mapping a custom domain to a static website URL (3)
1. Networking
   - Default network rule
   - Steps to Change the Default Network Access Rule (3)
1. Concepts
   - HTTP query params and how to use them together
   - `comp=`: `block`, `appendblock`, `page`, `lease`, `metadata`, `list`
   - `restype=`: `container`

## CosmoDB

1. Use cases
1. Components (and what they manage?)
   - Account
   - Databases
   - Container items
1. Examples
   - CLI
   - C#
   - Querying data
1. Consistency levels (which is default?)
   - Levels
     - Strong
     - Bounded Staleness
     - Session
     - Consistent Prefix
     - Eventual
   - Types
     - Linearizable consistency
     - Read consistency
1. Partitioning
   - Partition Key - how to choose, how to define?
     - Syntetic partition key
   - Logical partitions
   - Physical partitions
   - Partition sets
1. RUs
   - Provisioned throughput - specifics, min value, how to set
     - Container-level (Dedicated)
     - Database-level throughput (Shared)
     - Serverless mode
     - Autoscale Throughput
1. API models - common characteristics
   - NoSQL
   - MongoDB
   - PostgreSQL
   - Cassandra
   - Table
   - Gremlin
1. Stored procedures (language?)
   - Gist
   - Parameters
   - Return response
   - Create document
   - Triggers (and examples)
     - Pre
     - Post
   - UDF
   - Registering and executing
1. Change feed
   - Specifics
   - Interaction modes: Push, Pull
   - Change feed processor
     - Monitored container
     - Lease container
     - Compute instance
     - Delegate
1. Connectivity modes
   - Direct
   - Gateway
1. Best practices (8)
1. Conflict resolution
1. DB Backup & Restore
   - Continous
   - Periodic
1. Concepts
   - Namespace
   - Time to Live
   - Multi-region Writes

## Managed identities

1. RBAC
   - what's mandatory
   - inheritance order
1. Types: life cycle, sharing, use cases
   - System
   - User
1. Using with Virtual Machines
1. Managing identities
   - Assigning identities
   - Using RBAC
1. Access Control
   - Roles
     - Owner
     - Contributor
     - Reader
     - User Access Admin
   - Scopes
     - Management group
     - Subscription
     - Resource group
     - Resource
   - Deny assignments
   - Bare min requirements for accessing resource
   - Acquiring an Access Token with Azure Managed Identities
     - DefaultAzureCredential - order of checks (6)
     - ChainedTokenCredential
1. Logging
   - AzureEventSourceListener and DefaultAzureCredentialOptions
1. Token caching
   - Memory
   - Disk
   - credentials support for caching types

## Azure AD

1. Differences with RBAC?
   - Scope
1. App registration
   - Howto
   - Objects
     - Application Object
     - Service principals
       - Application
       - Managed identity
       - Legacy
     - How changes affect?
   - Integrate authentication and authorization
     - Web App
     - Backend API
     - Daemon
   - Permissions
     - Scopes; CLI
       - Delegated permissions
       - Application permissions
     - Consent
       - Types
         - Static
         - Incremental (Dynamic)
         - Admin
       - Requesting individual user consent
     - Difference between scope and permission
   - Conditional Access
     - Prerequisites
     - Specifics
     - MFA
     - Other
   - Other Azure AD features
     - Azure AD B2C
     - Azure AD B2B
     - Azure AD Application Proxy
     - Azure AD Connect
     - Azure AD Enterprise Application
   - MSAL
     - Authentication flows - use cases and token acquisition
       - Client applications: Public, Secret
       - Flow method
         - Authorization code
         - Client credentials
         - On-behalf-of
         - Device code
         - Implicit
         - Integrated Windows
         - Interactive
         - Username/Password
     - Working with MSAL
       - Modifiers
       - Examples
       - Acquiring Token
     - Application manifest
       - groupMembershipClaims
       - appRoles
       - oauth2Permissions
       - oauth2AllowImplicitFlow
       - oauth2AllowIdTokenImplicitFlow
     - ASP.NET Core Authorization: Working with Roles, Claims, and Policies

## Key Vault

1. Tiers
   - Standard
   - Premium
1. Create KV, set, retrive secrets
   - CLI
   - C#
   - HTTP
1. Security
   - Key operations
     - Rotate: manual, automated
     - Remove: delete, purge
   - Authentication
     - Obtaining service principal
       - Managed Identity
       - Azure AD tenant
     - Using REST
   - Restricting access
   - Data transit encryption
     - Perfect Forward Secrecy
1. Certificates
   - Allow accessing
   - Store and retrieve
1. Best practices (5)
1. Disaster and recovery
   - Redundancy
1. Disk encryption
1. Monitoring Key Vault with Azure Event Grid
   - Prerequisites
   - Function

## App Configuration

1. Similarities and differences between App Configuration and Key Vault
1. Overview
   - Keys
   - Labels
   - Values
1. Configuration and Querying in C#
   - Chaning
1. Feature Management
   - Requirenments
   - Components
     - Feature flag
       - Declaring Feature Flags
       - Feature Flag Repository
       - Using in C#
       - Configure feature flags in C#
       - Conditional feature flags
         - PercentageFilter
         - TimeWindowFilter
         - TargetingFilter
           - Staged rollout of features for targeted audiences
     - Feature manager
     - Filter
1. Security
   - Using Customer-Managed Keys for Encryption
     - Prerequisites (3)
     - Set policy
1. Configure Key Vault
1. Import / Export configureation

## Graph

1. Resources
1. Scopes
1. Headers
   - Mandatory: request-id
   - Optional: Retry-After, Location
   - Evolvable enumerations
1. Query by using REST
   - Metadata
   - HTTP methods
   - URL
   - Authorization request header
   - Pagination
   - Request body
   - Filtering
   - Selecting fields
1. Examples
   - My profile
   - My files
   - My photo
   - My photo metadata
1. Query using MSAL
1. Query using SDK
1. Token acquisition flow (3)
1. Permissions
   - Admin consent
   - User consent
1. Concepts
   - Microsoft Graph connectors
   - Microsoft Graph Data Connect

## SAS

1. How SAS works
   - Explanation
   - Components
   - Query params
1. Types
   - User Delegation SAS
   - Service SAS
   - Account SAS
1. Stored Access Policies
   - C#
1. Best practices (5)
1. Working with SAS
   - C#
   - CLI
     - Assign the necessary permissions to the user
     - Generate a user delegation SAS for a container
     - Generate a user delegation SAS for a blob
     - Revoke all user delegation keys for the storage account

## Application Insights

1. Quirks
   - Session Id
   - az monitor
1. Features
   - Live Metrics
   - Availability (Synthetic Transaction Monitoring)
     - Tests
       - URL ping test (classic)
       - Standard test (Preview)
       - Custom TrackAvailability test
     - Create an alert that will notify you via email if the web app becomes unresponsive
   - GitHub or Azure DevOps integration
   - Usage
   - Smart Detection
   - Application Map
     - Troubleshoot app performance
   - Distributed Tracing
1. Collected metrics
   - Request rates, response times, and failure rates
   - Dependency rates, response times, and failure rates
   - Exceptions
   - Page views and load performance
   - AJAX calls
   - User and session counts
   - Performance counters
   - Host diagnostics
   - Diagnostic trace logs
   - Custom events and metrics
     - Grouping custom events in sampling
     - What method should be used and why?
     - C#
       - GetMetric
       - TrackMetric; Considerations
       - TrackEvent
       - TrackPageView
       - TrackException
       - TrackDependency
       - TrackTrace
       - Flush
1. Metrics
   - Types
     - Log based
     - Standard
   - Sampling
     - Types
       - Adaptive
       - Fixed-rate
       - Ingestion
     - Configuring sampling
1. Monitoring and analyzing your app's performance
   - Run time
   - Development time
   - Web page instrumentation
   - Mobile app analysis
   - Availability tests
1. Event log - How to write there?
1. Usage analysis
   - Analysis tools
     - User
     - Session
     - Event
   - Funnels
   - User flows
   - Cohorts
   - Impact
   - Retention
1. Instrumentation
   - Auto
   - Manual
1. Monitor a local web API
1. Azure Monitor Activity Log
   - Diagnostic Settings
     - Log Analytics workspace
     - Azure Storage account
     - Azure Event Hubs

## Cache for Redis

1. Endpoint
1. Common patterns
   - Data cache
   - Content cache
   - Session store
   - Job and message queuing
   - Distributed transactions
   - Distributed transactions. Example
1. Caching
   - Comparison (7)
     - Private
     - Shared
   - Cache expiration
1. Tiers
   - Basic
   - Standard
   - Premium
   - Enterprise
   - Enterprise Flash
1. Tier features
   - Shards
   - Geo replication
   - Modules
1. Session State Providers
   - In Memory
   - SQL Server
   - Distributed In Memory
1. Working with Redis
   - CLI
   - Redis commands
   - C#
     - Prerequisites
     - Establishing connection
     - Key operations
     - Executing commands
     - Storing more complex values
   - TTL
     - Expiration: NX, XX, GT, LT
1. Key eviction
   - noeviction
   - allkeys-{lru/lfu}
   - volatile-{lru/lfu}
   - allkeys-random
   - volatile-random
   - volatile-ttl
1. Data persistence
   - Methods
     - RDB
     - AOF
   - Quirks

## Content Delivery Network

1. How it works?
   - Limitations
   - Features
1. Caching
   - DSA
   - Cache-directive headers and validators
   - TTL
     - Optimizations
       - Generalized web delivery
       - Large file
       - Media streaming
   - File Version Management
     - Purging
   - Rules
     - Standard tier
       - Global caching rules
       - Custom caching rules
       - Query string caching
     - Query string rules:
       - Ignore
       - Bypass caching
       - Cache every unique URL
     - Propagation times: Akamai and Verizon
   - Behavior settings (and expiry rules)
     - Bypass cache
     - Override
     - Set if missing
   - Cache purging
     - CLI and alt
   - Preload assets
1. Azure Front Door
   - Caching
   - Compression (5)
   - Geo-filtering
     - Standard vs Vezizon and Akamai
1. Tier features
   - Standard Verison
   - Standard Versizon and Premium
   - Standard Microsoft
1. Working with CDN
   - C#
   - CLI
1. Concepts
   - POP

## API management

1. Tiers
   - Consumption
   - Developer
   - Basic
   - Standard (2)
   - Premium (3)
1. Components
   - API Gateway
   - Management Plane
   - Developer Portal
1. Products
   - Open
   - Protected
1. Groups
   - Administrators
   - Developers
   - Guests
   - Custom groups
1. Concepts
   - Subscription
1. API Gateways
   - Managed
   - Self Hosted (tier?)
1. Policies
   - Scopes: global, product, specific API, API operation
   - Types: inbound, backend, outbound
   - Units
   - Named values
     - Dashboard
     - Types: Plain, Secret, KeyVault
       - Add a secret
   - Expressions
   - Throttling
   - Caching
     - Header
     - Query parameter
     - URL
     - Fragment caching
1. Security
   - Azure AD
     - Policies
   - Managed Identities
     - Policies
   - Subscription
     - Keys
       - Characteristics
       - Scopes: All APIs, Single API, Product
       - Calling API with Subscription Key
   - Certificates
     - Policies
     - Configure access to key vault
     - TLS Client Authentication
     - Check the thumbprint against certificates uploaded to API Management
1. Error handling
1. Versions and Revisions
   - Versioning
     - Path-based versioning
     - Header-based versioning
     - Query string-based versioning
   - Using separate gateways or web API
1. Integrating backend API with APIM
1. Monitoring
   - Capacity
   - Requests
1. Working with API Management instance (C#)

## Azure Event Grid

1. Concepts
   - Events
   - Event sources
   - Topics
     - System
     - Custom
   - Event subscriptions
   - Event handlers
1. Schemas
   - Event schemas
     - Mandatory fields
     - Filter by subject
   - Cloud event schemas
1. Custom headers. Limits
1. Event Delivery Durability
   - Delivery Attempts
   - Event Payload
     - Limits
   - Event Order
   - Delivery and Retry
     - Retry schedule
       - Deciding what to do with failed delivery
     - Retry policy
       - Maximum number of attempts
       - TTL
     - Dead-Letter Events
     - Output Batching
       - Delivery success
       - Optimistic batching
       - Settings
         - Max events per batch
         - Preferred batch size in kilobytes
1. Control access to events
   - Subscription Reader
   - Subscription Contributor
   - Contributor
   - Data Sender
1. Webhooks
   - Validation
     - Endpoint validation
1. Filtering
   - Subject
   - Event types
   - Advanced
     - For arrays
     - AND and OR
     - Syntax
     - Limitations (3)
1. Route custom events to web endpoint - CLI
1. Configure Azure Event Grid service to send events to an Azure Event Hub instance - CLI
1. Working with EventGrid - C#
   - Cloud event

## Azure Event Hub

1. Key Concepts
   - Event Hubs Client
   - Event Hubs Producer
   - Event Hubs Consumer
   - Partition
     - How they work
     - Default number of partitions?
     - How number of partitions affect processing
     - Event ordering
   - Consumer Group
   - Event Receivers
   - Throughput Units (processing units)
1. AMQP vs. HTTPS: initialization and performance
1. Namespace
1. Event retention
   - Standard
   - Premium and Dedicated
   - Storing beyound retention period
1. Event Hubs Capture
   - How it works
   - Characteristics
     - Format
     - Region
     - Permissions
   - Capture windowing
   - Behavior
   - Example url
   - Interaction with Event Grid
1. Log Compaction
   - Retention types
1. Scaling to throughput units
   - Limits
     - Size
     - Max Requests
   - EventProcessorClient
   - Designing large systems
     - Scale
     - Load balance
     - Resume after failure
     - Consume events
1. Event Processor
   - Receiving Messages
   - Checkpointing
   - Thread Safety
   - Lease management
1. Application Groups
1. Roles
   - Owner
   - Sender
   - Receiver
1. C#
   - EventHubProducerClient
   - EventHubBufferedProducerClient
   - EventHubConsumerClient
   - Process events using Event Processor client
     - Prerequisites
1. CLI

## Azure Service Bus

1. Overview
   - Queue
   - Load-leveling
   - Decoupling
   - Receive modes
     - Receive and delete
     - Peek lock
   - Topics
   - Subscriptions
   - Rules and actions - filter actions
1. Tiers - Standard, Premium
   - Throughput
   - Latency / Performance
   - Pricing
   - Message size
1. Components
   - Namespace
   - Queues
   - Topics
1. Payload and serialization
   - AMQP
   - Properties
     - system-defined broker
     - user-defined
1. Message Routing and Correlation
   - Properties for routing
   - Routing patterns
     - Simple request/reply
     - Multicast request/reply
     - Multiplexing
     - Multiplexed request/reply
   - Application routing - limitations
1. Advanced features
   - Dead-letter queue
   - Transactions
   - Autodelete on idle
   - Duplicate detection
   - Geo-disaster recovery
1. Scheduled delivery
   - regular API (ScheduledEnqueueTimeUtc)
   - schedule API (SequenceNumber)
1. Security
   -Roles: Owner, Sender, Receiver
   - Security protocols
     - SAS
     - RBAC
     - Managed identities
1. Best practices (4)
1. Filters
   - SQL Filters (SqlRuleFilter)
   - Boolean Filters (TrueRuleFilter, FalseRuleFilter)
   - Correlation Filters (CorrelationRuleFilter)
1. Actions
   - What are they used for? Example?
1. Usage Patterns
   - Broadcast Pattern
   - Partitioning Pattern
   - Routing Pattern
1. Autoforwarding
1. Parallel Stream Processing - how?
1. Message sessions - ordering?
1. Batching - characteristics and when to use/not use
1. Message deferral
1. C#
1. CLI

## Azure Queue Storage

1. Capacity
1. Use case
1. Message size
1. TTL
1. Scaling
1. C#
1. CLI

## Message queues

1. Use case
1. Message size
1. Maximum queue size
1. Ordering guarantee
1. Receive mode
1. Exclusive access mode
1. Batched send/receive
1. Automatic dead lettering
1. Message autoforwarding
1. Message groups
1. Duplicate detection
1. Runtime protocol
