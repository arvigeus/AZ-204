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
1. Limitations - when not to use (1)
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
1. Deployment
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

1. Prerequisites (4)
1. Limitations (3)
1. Authentication
   - How it works?
   - Prerequisites
1. Concepts
   - Webhooks
