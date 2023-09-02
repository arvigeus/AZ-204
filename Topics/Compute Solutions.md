# [Compute Solutions](https://learn.microsoft.com/en-us/azure/container-apps/compare-options)

| Service                   | Suitable Scenarios                                                          | Distinctive Features                                                                                  | Specific Criteria                                   |
| ------------------------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| Azure Container Apps      | Building serverless microservices based on containers                       | General-purpose containers, Kubernetes-style apps, event-driven architectures, long-running processes | No need for direct access to native Kubernetes APIs |
| Azure App Service         | Fully managed hosting for web applications, including websites and web APIs | Optimized for web applications, integrated with other Azure services                                  |                                                     |
| Azure Container Instances | Lower-level "building block" option compared to Container Apps              | No scale, load balancing, and certificates                                                            | Less "opinionated" building block                   |
| Azure Kubernetes Service  | Fully managed Kubernetes option in Azure                                    | Direct access to the Kubernetes API, runs any Kubernetes workload                                     |                                                     |
| Azure Functions           | Running event-driven applications using the functions programming model     | Short-lived functions deployed as either code or containers                                           |                                                     |

- **Azure Container Apps** vs. **AKS**: If you require access to the Kubernetes APIs and control plane, use AKS. If you want to build Kubernetes-style applications without needing direct access to all native Kubernetes APIs, Container Apps is preferable.
- **Azure Container Instances** vs. **Container Apps**: ACI is a more basic building block without application-specific concepts like scale and load balancing, while Container Apps provides these features.
- **Azure Functions** vs. **Container Apps**: Both are suitable for event-driven applications, but Functions is optimized for short-lived functions, while Container Apps is more general-purpose.

## Comparison by feature

| Feature                  | Container Apps | Container Instances | App Services                | Kubernetes Service (AKS)    | Functions                      |
| ------------------------ | -------------- | ------------------- | --------------------------- | --------------------------- | ------------------------------ |
| **Scaling**              | Auto-scaling   | Manual scaling only | Auto-scaling                | Cluster Autoscaler (say no) | Consumption-based auto-scaling |
| **State Management**     | Stateless      | Stateless           | Both stateless and stateful | Both stateless and stateful | Stateless                      |
| **Resource Isolation**   | Shared         | Dedicated           | Shared/Dedicated            | Dedicated                   | Shared                         |
| **Cost**                 | Pay-as-you-go  | Pay-as-you-go       | Fixed + Scale               | Cluster costs + Node costs  | Pay-as-you-go or fixed         |
| **Multi-Region Support** | No             | No                  | Yes                         | Yes                         | Yes                            |

Note: Functions is not a containerized solution.
