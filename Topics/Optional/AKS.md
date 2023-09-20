# [AKS](https://learn.microsoft.com/en-us/azure/aks/)

## Core Concepts

- **Kubernetes Infrastructure Components**: Includes the control plane, nodes, and node pools.
- **Workload Resources**: Consists of pods, deployments, and sets.
- **Grouping Resources**: Explains how to group resources into namespaces.

## Key Details

- **Control Plane**: Manages core Kubernetes services and application workloads.
- **Container**: A lightweight, standalone executable package containing everything needed to run code.
- **Node**: A virtual or physical machine running Kubernetes.
- **AKS**: Provides a managed Kubernetes service, reducing complexity.
- **Pod**: The smallest deployable unit (a single instance of an application) in Kubernetes that holds one or more containers.
- **Cluster**: A set of nodes managed by Kubernetes.
- **Service**: Exposes pods to network traffic.
- **Deployment**: Describes the desired state of a containerized app.
- **Kubeconfig**: Configuration file that contains information about clusters, contexts, and credentials.
- **Helm**: A package manager for Kubernetes.
- **Node Pools**: Group nodes of the same configuration.
- **StatefulSets and DaemonSets**: Handle specific needs like persistent storage or running a pod on all nodes.
- **Namespaces**: Logically group resources for better management.

## Configuration

Node Selectors:

```yml
kind: Pod
apiVersion: v1
metadata:
  name: nginx
spec:
  containers:
    - name: myfrontend
      image: mcr.microsoft.com/oss/nginx/nginx:1.15.12-alpine
      nodeSelector:
        "kubernetes.io/os": linux
```

Deployments and YAML Manifests:

```yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: mcr.microsoft.com/oss/nginx/nginx:1.15.2-alpine
          ports:
            - containerPort: 80
          resources:
            requests:
              cpu: 250m
              memory: 64Mi
            limits:
              cpu: 500m
              memory: 256Mi
```

## Working with AKS

```sh
# Register providers if they're not registered
az provider register --namespace Microsoft.OperationsManagement
az provider register --namespace Microsoft.OperationalInsights

# Create a resource group
az group create --name myResourceGroup --location eastus

# Create an AKS cluster
az aks create -g myResourceGroup -n myAKSCluster --enable-managed-identity --node-count 1 --enable-addons monitoring --generate-ssh-keys

# Install kubectl locally
az aks install-cli

# Configure kubectl to connect to your Kubernetes cluster
az aks get-credentials --resource-group myResourceGroup --name myAKSCluster

# Verify the connection to your cluster
kubectl get nodes

# Deploy the application using a YAML file
kubectl apply -f azure-vote.yaml

# Monitor progress of the service
kubectl get service azure-vote-front --watch

# Delete the cluster and all related resources
az group delete --name myResourceGroup --yes --no-wait
```
