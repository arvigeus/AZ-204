# Developing Solutions for Microsoft Azure

TLDR;

- Read the [disclaimer](https://github.com/arvigeus/AZ-204#disclaimer)
- Go through [Topics](/Topics/) (check [Study Plan](./Study%20Plan.md) for a suggested order)
- Practice with [quiz app](https://az-204.vercel.app/) ([by topic](https://az-204.vercel.app/topics))

## [Study guide for Exam AZ-204: Developing Solutions for Microsoft Azure](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-204#skills-measured-prior-to-august-21-2023)

[AZ-204 Exam Updates for April 2023](https://www.youtube.com/watch?v=hzVy9RTl_iA)

### Develop Azure compute solutions (25–30%)

#### Implement containerized solutions

- Create and manage container images for solutions
- Publish an image to Azure Container Registry
- Run containers by using Azure Container Instance
- Create solutions by using Azure Container Apps

#### Implement Azure App Service Web Apps

- Create an Azure App Service Web App
- Configure and implement diagnostics and logging
- Deploy code and containers
- Configure settings including Transport Layer Security (TLS), API settings, and service connections
- Implement autoscaling
- Configure deployment slots

#### Implement Azure Functions

- Create and configure an Azure Function App
- Implement input and output bindings
- Implement function triggers by using data operations, timers, and webhooks

### Develop for Azure storage (15–20%)

#### Develop solutions that use Azure Cosmos DB

- Perform operations on containers and items by using the SDK
- Set the appropriate consistency level for operations
- Implement change feed notifications

#### Develop solutions that use Azure Blob Storage

- Set and retrieve properties and metadata
- Perform operations on data by using the appropriate SDK
- Implement storage policies and data lifecycle management

### Implement Azure security (15–20%)

#### Implement user authentication and authorization

- Authenticate and authorize users by using the Microsoft Identity platform
- Authenticate and authorize users and apps by using Microsoft Entra ID
- Create and implement shared access signatures
- Implement solutions that interact with Microsoft Graph

#### Implement secure Azure solutions

- Secure app configuration data by using App Configuration or Azure Key Vault
- Develop code that uses keys, secrets, and certificates stored in Azure Key Vault
- Implement Managed Identities for Azure resources

### Monitor, troubleshoot, and optimize Azure solutions (10–15%)

#### Implement caching for solutions

- Configure cache and expiration policies for Azure Cache for Redis
- Implement secure and optimized application cache patterns including data sizing, connections, encryption, and expiration
- Implement Azure Content Delivery Network endpoints and profiles

#### Troubleshoot solutions by using Application Insights

- Monitor and analyze metrics, logs, and traces
- Implement Application Insights web tests and alerts
- Implement an app or service to use Application Insights

### Connect to and consume Azure services and third-party services (15–20%)

#### Implement API Management

- Create an Azure API Management instance
- Create and document APIs
- Configure access to APIs
- Implement policies for APIs

#### Develop event-based solutions

- Implement solutions that use Azure Event Grid
- Implement solutions that use Azure Event Hub

#### Develop message-based solutions

- Implement solutions that use Azure Service Bus
- Implement solutions that use Azure Queue Storage queues

## Topics

1. [Azure App Service Web Apps](https://docs.microsoft.com/en-us/azure/app-service/)
1. [Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/)
1. [Azure Container Solutions](https://learn.microsoft.com/en-us/azure/containers/)
   - [Azure Container Registry](https://docs.microsoft.com/en-us/azure/container-registry/)
   - [Azure Container Instance](https://docs.microsoft.com/en-us/azure/container-instances/)
   - [Azure Container Apps](https://docs.microsoft.com/en-us/azure/container-apps/)
1. [Azure Blob Storage](https://docs.microsoft.com/en-us/azure/storage/blobs/)
1. [Azure Cosmos DB](https://docs.microsoft.com/en-us/azure/cosmos-db/)
1. [Microsoft Identity Platform](https://learn.microsoft.com/en-us/entra/identity-platform/)
   - [Azure Managed Identities](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/overview)
   - [Microsoft Entra ID](https://learn.microsoft.com/en-us/entra/identity/)
1. [Microsoft Graph](https://learn.microsoft.com/en-us/graph/)
1. [Azure Key Vault](https://docs.microsoft.com/en-us/azure/key-vault/)
1. [Azure App Configuration](https://learn.microsoft.com/en-us/azure/azure-app-configuration/)
1. [Azure API Management](https://docs.microsoft.com/en-us/azure/api-management/)
1. [Azure Cache for Redis](https://docs.microsoft.com/en-us/azure/azure-cache-for-redis/)
1. [Azure Content Delivery Network (CDN)](https://docs.microsoft.com/en-us/azure/cdn/)
1. [Azure Application Insights](https://docs.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview)
1. [Azure Event Grid](https://docs.microsoft.com/en-us/azure/event-grid/)
1. [Azure Event Hub](https://docs.microsoft.com/en-us/azure/event-hubs/)
1. [Message Queues](https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-azure-and-service-bus-queues-compared-contrasted)
   - [Azure Service Bus](https://docs.microsoft.com/en-us/azure/service-bus-messaging/)
   - [Azure Queue Storage](https://docs.microsoft.com/en-us/azure/storage/queues/)

## API Documentation

- [AZ CLI](https://learn.microsoft.com/en-us/cli/azure/reference-index?view=azure-cli-latest)
- [.Net](https://learn.microsoft.com/en-us/dotnet/api/)
- [Powershell](https://learn.microsoft.com/en-us/cli/azure/reference-index?view=azure-cli-latest)

## Exam preparation

- [Exam Demo](https://aka.ms/examdemo)
- [Practice Assessments for Microsoft Certifications](https://learn.microsoft.com/en-us/certifications/exams/az-204/practice/assessment?assessment-type=practice&assessmentId=35)
- [MeasureUp](https://www.measureup.com/catalogsearch/result/?q=az-204)
- [WhizLabs](https://www.whizlabs.com/microsoft-azure-certification-az-204/)
- [Learn Azure App](https://learnazure.app/)

## Study resources

- [Microsoft Learnigh Path](https://learn.microsoft.com/en-us/certifications/exams/az-204/) (or [/Learning Path](/Learning%20Path/))
- [\[GitHub\] MicrosoftLearning / AZ-204: Developing solutions for Microsoft Azure](https://github.com/MicrosoftLearning/AZ-204-DevelopingSolutionsforMicrosoftAzure)
- Exam Readiness Zone:
  - [Develop Azure compute solutions](https://learn.microsoft.com/en-us/shows/exam-readiness-zone/preparing-for-az-204-develop-azure-compute-solutions-1-of-5)
  - [Develop for Azure storage](https://learn.microsoft.com/en-us/shows/exam-readiness-zone/preparing-for-az-204-develop-for-azure-storage-segment-2-of-5)
  - [Implement Azure security](https://learn.microsoft.com/en-us/shows/exam-readiness-zone/preparing-for-az-204-implement-azure-security-segment-3-of-5)
  - [Monitor, troubleshoot, and optimize Azure solutions](https://learn.microsoft.com/en-us/shows/exam-readiness-zone/preparing-for-az-204-monitor-troubleshoot-and-optimize-azure-solutions-segment-4-of-5)
  - [Connect to and consume Azure services and third-party services](https://learn.microsoft.com/en-us/shows/exam-readiness-zone/preparing-for-az-204-connect-to-and-consume-azure-services-and-third-party-services-segment-5-of-5)
- [/Topics](/Topics/)
- [Microsoft Applied Skills](https://learn.microsoft.com/en-us/credentials/browse/?credential_types=applied%20skills) (some of the skills listed could help you understand certain topics better)
- [Azure Sandbox Environment](https://github.com/Azure-Samples/azuresandbox) (costs $$$)
- [\[OFFICIAL\] Microsoft Azure Developer Associate (AZ-204) Professional Certificate (Coursera)](https://www.coursera.org/professional-certificates/azure-developer-associate)
- [AZ-204: Developing Solutions for Microsoft Azure (Alan Rodrigues)](https://www.youtube.com/watch?v=wWBW6ojr-Nw&list=PLLc2nQDXYMHpekgrToMrDpVtFtvmRSqVt)
- [Azure Developer Associate (AZ-204) — Full Course Pass the Exam! (freeCodeCamp.org)](https://www.youtube.com/watch?v=jZx8PMQjobk&t=832s&pp=ygUGYXotMjA0)
- [Exam AZ-204: Developing Solutions for Microsoft Azure Course (A Guide To Cloud)](https://www.youtube.com/watch?v=tB_tBPfQJMI&list=PLhLKc18P9YODdrbyuA52Zn9-kwboIOz2W)
- [AZ-204 Exam Preparation: Developing Solutions for Microsoft Azure (Cloud Academy)](https://cloudacademy.com/learning-paths/az-204-exam-preparation-developing-solutions-for-microsoft-azure-1208/)
- [Developing Solutions for Microsoft Azure (AZ-204) - Pluralsight](https://www.pluralsight.com/paths/developing-solutions-for-microsoft-azure-az-204)
- [AZ-204 Developing Solutions for Microsoft Azure - Udemy](https://www.udemy.com/course/70532-azure/)
- [Microsoft Certifications Knowledge Hub](https://github.com/mscerts/hub/blob/main/README.md)
- [Mastering the AZ-204 Exam - A Comprehensive Guide to Azure Certification Preparation](https://programmingwithwolfgang.com/mastering-az-204-exam-comprehensive-guide-azure-certification-preparation)
- [Knowledge Hub for Microsoft Certifications](https://certs.msfthub.wiki/)

## Emojis

Emojis are used to represent common concepts with shared meanings. However, during the exam, different variations of the same meaning may be utilized.  
In these study notes, emojis may be ambiguous and the correct meaning has to be guessed from the context.

- ⭐: Recommended
- ❌: Not recommended / Not Supported
- ⏺️: Default
- 🏷️: Cheap / Cost-effective
- 💲: High price (cost) / Expensive
- ⚡: Low latency / High throughput (transactions) / Fast
- 🐌: High ("flexible") latency / Low throughput (transactions)
- 🎲: Random
- 💎: Premium only
- 🦺: Standard / Not premium
- 🏋🏿: Transaction-intensive / Heavy traffic
- 🙋‍♂️: High availability
- ⏫: Ingress / Upload
- ⏬: Egress / Download
- 🧊: Immutable / Cannot be changed
- 🙂: Simple / Easy
- 🔑: Microsoft Managed Keys
- 🗝️: User Managed Keys

## Disclaimer

The content found in this repository is a result of my personal study and understanding of the AZ-204 exam topics. While I have made every effort to ensure accuracy, there may be inaccuracies, or even incorrect or missing information contained within these notes.

Since passing the exam in October 2023, I strive to keep this information current, but updates are made on a best-effort basis rather than through active maintenance.

I welcome corrections and contributions from others to enhance the quality and accuracy of this material. If you find any errors or have suggestions for improvement, please feel free to open an issue or submit a pull request.

Please use these notes at your own discretion and cross-reference with official materials and resources to ensure complete understanding of the subject matter.

Wish you good luck in your preparation for the AZ-204 exam!
