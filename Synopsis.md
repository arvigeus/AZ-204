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
   - Billing
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
   - Location: App Service File System, Blob Option
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
     - Queue trigger and output bindings
     - Timer trigger (CRON quirks)
   - Connection string formats
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
       - prefixMatch
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
