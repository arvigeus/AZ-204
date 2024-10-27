# Develop solutions that use Blob storage

## Explore Azure Blob storage

Azure Blob storage is Microsoft's object storage solution for the cloud. Blob storage is optimized for storing massive amounts of unstructured data.

### Explore Blob storage

Azure Blob storage is Microsoft's object storage solution for the cloud. Blob storage is optimized for storing massive amounts of unstructured data. Unstructured data is data that doesn't adhere to a particular data model or definition, such as text or binary data.

Blob storage is designed for:

- Serving images or documents directly to a browser.
- Storing files for distributed access.
- Streaming video and audio.
- Writing to log files.
- Storing data for backup and restore, disaster recovery, and archiving.
- Storing data for analysis by an on-premises or Azure-hosted service.

Users or client applications can access objects in Blob storage via HTTP/HTTPS, from anywhere in the world. Objects in Blob storage are accessible via the Azure Storage REST API, Azure PowerShell, Azure CLI, or an Azure Storage client library.

An Azure Storage account is the top-level container for all of your Azure Blob storage. The storage account provides a unique namespace for your Azure Storage data that is accessible from anywhere in the world over HTTP or HTTPS.

#### Types of storage accounts

Azure Storage offers two performance levels of storage accounts, standard and premium. Each performance level supports different features and has its own pricing model.

- **Standard**: This is the standard general-purpose v2 account and is recommended for most scenarios using Azure Storage.
- **Premium**: Premium accounts offer higher performance by using solid-state drives. If you create a premium account you can choose between three account types, block blobs, page blobs, or file shares.

The following table describes the types of storage accounts recommended by Microsoft for most scenarios using Blob storage.

| Type of storage account     | Supported storage services                                                                | Redundancy options                        | Usage                                                                                                                                                                                                               |
| --------------------------- | ----------------------------------------------------------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Standard general-purpose v2 | Blob Storage (including Data Lake Storage), Queue Storage, Table Storage, and Azure Files | LRS / GRS / RA-GRS / ZRS / GZRS / RA-GZRS | Standard storage account type for blobs, file shares, queues, and tables. Recommended for most scenarios using Azure Storage. If you want support for NFS in Azure Files, use the premium file shares account type. |
| Premium block blobs         | Blob Storage (including Data Lake Storage)                                                | LRS and ZRS                               | Premium storage account type for block blobs and append blobs. Recommended for scenarios with high transaction rates or smaller objects, or requiring consistently low storage latency.                             |
| Premium file shares         | Azure Files                                                                               | LRS and ZRS                               | Premium storage account type for file shares only. Recommended for enterprise or high-performance scale applications.                                                                                               |
| Premium page blobs          | Page blobs only                                                                           | LRS and ZRS                               | Premium storage account type for page blobs only.                                                                                                                                                                   |

#### Access tiers for block blob data

Azure Storage provides different options for accessing block blob data based on usage patterns. Each access tier in Azure Storage is optimized for a particular pattern of data usage. By selecting the right access tier for your needs, you can store your block blob data in the most cost-effective manner.

The available access tiers are:

- The **Hot** access tier, which is optimized for frequent access of objects in the storage account. The Hot tier has the highest storage costs, but the lowest access costs. New storage accounts are created in the hot tier by default.

- The **Cool** access tier, which is optimized for storing large amounts of data that is infrequently accessed and stored for a minimum of 30 days. The Cool tier has lower storage costs and higher access costs compared to the Hot tier.

- The **Cold** access tier, which is optimized for storing data that is infrequently accessed and stored for a minimum of 90 days. The cold tier has lower storage costs and higher access costs compared to the cool tier.

- The **Archive** tier, which is available only for individual block blobs. The archive tier is optimized for data that can tolerate several hours of retrieval latency and remains in the Archive tier for a minimum 180 days. The archive tier is the most cost-effective option for storing data, but accessing that data is more expensive than accessing data in the hot or cool tiers.

If there's a change in the usage pattern of your data, you can switch between these access tiers at any time.

### Discover Azure Blob storage resource types

Blob storage offers three types of resources:

- The **storage account**.
- A **container** in the storage account
- A **blob** in a container

#### Storage accounts

A storage account provides a unique namespace in Azure for your data. Every object that you store in Azure Storage has an address that includes your unique account name. The combination of the account name and the Azure Storage blob endpoint forms the base address for the objects in your storage account.

For example, if your storage account is named _mystorageaccount_, then the default endpoint for Blob storage is:

```txt
http://mystorageaccount.blob.core.windows.net
```

#### Containers

A container organizes a set of blobs, similar to a directory in a file system. A storage account can include an unlimited number of containers, and a container can store an unlimited number of blobs.

A container name must be a valid DNS name, as it forms part of the unique URI (Uniform resource identifier) used to address the container or its blobs. Follow these rules when naming a container:

- Container names can be between 3 and 63 characters long.
- Container names must start with a letter or number, and can contain only lowercase letters, numbers, and the dash (-) character.
- Two or more consecutive dash characters aren't permitted in container names.

The URI for a container is similar to:

```txt
https://myaccount.blob.core.windows.net/mycontainer
```

#### Blobs

Azure Storage supports three types of blobs:

- **Block blobs** store text and binary data. Block blobs are made up of blocks of data that can be managed individually. Block blobs can store up to about 190.7 TiB.
- **Append blobs** are made up of blocks like block blobs, but are optimized for append operations. Append blobs are ideal for scenarios such as logging data from virtual machines.
- **Page blobs** store random access files up to 8 TB in size. Page blobs store virtual hard drive (VHD) files and serve as disks for Azure virtual machines.

The URI for a blob is similar to:

```txt
https://myaccount.blob.core.windows.net/mycontainer/myblob
```

or

```txt
https://myaccount.blob.core.windows.net/mycontainer/myvirtualdirectory/myblob
```

### Explore Azure Storage security features

Azure Storage uses service-side encryption (SSE) to automatically encrypt your data when it's persisted to the cloud. Azure Storage encryption protects your data and to help you to meet your organizational security and compliance commitments.

Microsoft recommends using service-side encryption to protect your data for most scenarios. However, the Azure Storage client libraries for Blob Storage and Queue Storage also provide client-side encryption for customers who need to encrypt data on the client.

#### Azure Storage encryption for data at rest

Azure Storage automatically encrypts your data when persisting it to the cloud. Encryption protects your data and helps you meet your organizational security and compliance commitments. Data in Azure Storage is encrypted and decrypted transparently using 256-bit Advanced Encryption Standard (AES) encryption, one of the strongest block ciphers available, and is Federal Information Processing Standards (FIPS) 140-2 compliant. Azure Storage encryption is similar to BitLocker encryption on Windows.

Azure Storage encryption is enabled for all storage accounts and can't be disabled. Because your data is secured by default, you don't need to modify your code or applications to take advantage of Azure Storage encryption.

Data in a storage account is encrypted regardless of performance tier, access tier, or deployment model. All new and existing block blobs, append blobs, and page blobs are encrypted, including blobs in the archive tier. All Azure Storage redundancy options support encryption, and all data in both the primary and secondary regions is encrypted when geo-replication is enabled. All Azure Storage resources are encrypted, including blobs, disks, files, queues, and tables. All object metadata is also encrypted.

There's no extra cost for Azure Storage encryption.

##### Encryption key management

Data in a new storage account is encrypted with Microsoft-managed keys by default. You can continue to rely on Microsoft-managed keys for the encryption of your data, or you can manage encryption with your own keys. If you choose to manage encryption with your own keys, you have two options. You can use either type of key management, or both:

- You can specify a _customer-managed key_ to use for encrypting and decrypting data in Blob Storage and in Azure Files.Customer-managed keys must be stored in Azure Key Vault or Azure Key Vault Managed Hardware Security Model (HSM).
- You can specify a _customer-provided key_ on Blob Storage operations. A client can include an encryption key on a read/write request for granular control over how blob data is encrypted and decrypted.

The following table compares key management options for Azure Storage encryption.

| Key management parameter         | Microsoft-managed keys                | Customer-managed keys                 | Customer-provided keys   |
| -------------------------------- | ------------------------------------- | ------------------------------------- | ------------------------ |
| Encryption/decryption operations | Azure                                 | Azure                                 | Azure                    |
| Azure Storage services supported | All                                   | Blob Storage, Azure Files             | Blob Storage             |
| Key storage                      | Microsoft key store                   | Azure Key Vault or Key Vault HSM      | Customer's own key store |
| Key rotation responsibility      | Microsoft                             | Customer                              | Customer                 |
| Key control                      | Microsoft                             | Customer                              | Customer                 |
| Key scope                        | Account (default), container, or blob | Account (default), container, or blob | N/A                      |

#### Client-side encryption

The Azure Blob Storage client libraries for .NET, Java, and Python support encrypting data within client applications before uploading to Azure Storage, and decrypting data while downloading to the client. The Queue Storage client libraries for .NET and Python also support client-side encryption.

The Blob Storage and Queue Storage client libraries uses AES in order to encrypt user data. There are two versions of client-side encryption available in the client libraries:

- Version 2 uses Galois/Counter Mode (GCM) mode with AES. The Blob Storage and Queue Storage SDKs support client-side encryption with v2.
- Version 1 uses Cipher Block Chaining (CBC) mode with AES. The Blob Storage, Queue Storage, and Table Storage SDKs support client-side encryption with v1.

## Manage the Azure Blob storage lifecycle

### Explore the Azure Blob storage lifecycle

Data sets have unique lifecycles. Early in the lifecycle, people access some data often. But the need for access drops drastically as the data ages. Some data stays idle in the cloud and is rarely accessed once stored. Some data expires days or months after creation, while other data sets are actively read and modified throughout their lifetimes.

#### Access tiers

Azure storage offers different access tiers, allowing you to store blob object data in the most cost-effective manner. Available access tiers include:

- **Hot** - An online tier optimized for storing data that is accessed frequently.
- **Cool** - An online tier optimized for storing data that is infrequently accessed and stored for a minimum of 30 days.
- **Cold tier** - An online tier optimized for storing data that is infrequently accessed and stored for a minimum of 90 days. The cold tier has lower storage costs and higher access costs compared to the cool tier.
- **Archive** - An offline tier optimized for storing data that is rarely accessed and stored for at least 180 days with flexible latency requirements, on the order of hours.

Data storage limits are set at the account level and not per access tier. You can choose to use all of your limit in one tier or across all three tiers.

#### Manage the data lifecycle

Azure Blob Storage lifecycle management offers a rule-based policy that you can use to transition blob data to the appropriate access tiers or to expire data at the end of the data lifecycle.

With the lifecycle management policy, you can:

- Transition blobs from cool to hot immediately when accessed, to optimize for performance.
- Transition current versions of a blob, previous versions of a blob, or blob snapshots to a cooler storage tier if these objects aren't accessed or modified for a period of time, to optimize for cost.
- Delete current versions of a blob, previous versions of a blob, or blob snapshots at the end of their lifecycles.
- Apply rules to an entire storage account, to select containers, or to a subset of blobs using name prefixes or blob index tags as filters.

Consider a scenario where data is frequently accessed during the early stages of the lifecycle, but only occasionally after two weeks. Beyond the first month, the data set is rarely accessed. In this scenario, hot storage is best during the early stages. Cool storage is most appropriate for occasional access. Archive storage is the best tier option after the data ages over a month. By moving data to the appropriate storage tier based on its age with lifecycle management policy rules, you can design the least expensive solution for your needs.

### Discover Blob storage lifecycle policies

A lifecycle management policy is a collection of rules in a JSON document. Each rule definition within a policy includes a filter set and an action set. The filter set limits rule actions to a certain set of objects within a container or objects names. The action set applies the tier or delete actions to the filtered set of objects:

```jsonc
{
  "rules": [
    {
      "name": "rule1",
      "enabled": true,
      "type": "Lifecycle",
      "definition": {
        /*...*/
      }
    },
    {
      "name": "rule2",
      "type": "Lifecycle",
      "definition": {
        /*...*/
      }
    }
  ]
}
```

A policy is a collection of rules:

| Parameter name | Parameter type           | Notes                                                                                  |
| -------------- | ------------------------ | -------------------------------------------------------------------------------------- |
| `rules`        | An array of rule objects | At least one rule is required in a policy. You can define up to 100 rules in a policy. |

Each rule within the policy has several parameters:

| Parameter name | Parameter type | Notes                                                                                                                      | Required |
| -------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------- | -------- |
| `name`         | String         | A rule name can include up to 256 alphanumeric characters. Rule name is case-sensitive. It must be unique within a policy. | True     |
| `enabled`      | Boolean        | An optional boolean to allow a rule to be temporarily disabled. Default value is true.                                     | False    |
| `type`         | Enum value     | The current valid type is Lifecycle.                                                                                       | True     |
| `definition`   | Object         | An object that defines the lifecycle rule. Each definition is made up of a filter set and an action set.                   | True     |

#### Rules

Each rule definition includes a filter set and an action set. The filter set limits rule actions to a certain set of objects within a container or objects names. The action set applies the tier or delete actions to the filtered set of objects.

The following sample rule filters the account to run the actions on objects that exist inside `sample-container` and start with `blob1`.

- Tier blob to cool tier 30 days after last modification
- Tier blob to archive tier 90 days after last modification
- Delete blob 2,555 days (seven years) after last modification
- Delete blob snapshots 90 days after snapshot creation

```json
{
  "rules": [
    {
      "enabled": true,
      "name": "sample-rule",
      "type": "Lifecycle",
      "definition": {
        "actions": {
          "version": {
            "delete": {
              "daysAfterCreationGreaterThan": 90
            }
          },
          "baseBlob": {
            "tierToCool": {
              "daysAfterModificationGreaterThan": 30
            },
            "tierToArchive": {
              "daysAfterModificationGreaterThan": 90,
              "daysAfterLastTierChangeGreaterThan": 7
            },
            "delete": {
              "daysAfterModificationGreaterThan": 2555
            }
          }
        },
        "filters": {
          "blobTypes": ["blockBlob"],
          "prefixMatch": ["sample-container/blob1"]
        }
      }
    }
  ]
}
```

#### Rule filters

Filters limit rule actions to a subset of blobs within the storage account. If more than one filter is defined, a logical AND runs on all filters. Filters include:

| Filter name    | Filter type                                                                                                                                                 | Is Required |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| blobTypes      | An array of predefined enum values                                                                                                                          | Yes         |
| prefixMatch    | An array of strings for prefixes to be matched. Each rule can define up to 10 prefixes. A prefix string must start with a container name.                   | No          |
| blobIndexMatch | An array of dictionary values consisting of blob index tag key and value conditions to be matched. Each rule can define up to 10 blob index tag conditions. | No          |

#### Rule actions

Actions are applied to the filtered blobs when the run condition is met.

Lifecycle management supports tiering and deletion of blobs and deletion of blob snapshots. Define at least one action for each rule on blobs or blob snapshots.

| Action                      | Current Version                        | Snapshot      | Previous Versions |
| --------------------------- | -------------------------------------- | ------------- | ----------------- |
| tierToCool                  | Supported for blockBlob                | Supported     | Supported         |
| tierToCold                  | Supported for blockBlob                | Supported     | Supported         |
| enableAutoTierToHotFromCool | Supported for blockBlob                | Not supported | Not supported     |
| tierToArchive               | Supported for blockBlob                | Supported     | Supported         |
| delete                      | Supported for blockBlob and appendBlob | Supported     | Supported         |

:information_source: If you define more than one action on the same blob, lifecycle management applies the least expensive action to the blob. For example, action `delete` is cheaper than action `tierToArchive`. Action `tierToArchive` is cheaper than action `tierToCool`.

The run conditions are based on age. Base blobs use the last modified time to track age, and blob snapshots use the snapshot creation time to track age.

| Action run condition               | Condition value                          | Description                                                                                                                                                                                |
| ---------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| daysAfterModificationGreaterThan   | Integer value indicating the age in days | The condition for base blob actions.                                                                                                                                                       |
| daysAfterCreationGreaterThan       | Integer value indicating the age in days | The condition for blob snapshot actions.                                                                                                                                                   |
| daysAfterLastAccessTimeGreaterThan | Integer value indicating the age in days | The condition for a current version of a blob when access tracking is enabled.                                                                                                             |
| daysAfterLastTierChangeGreaterThan | Integer value indicating the age in days | The minimum duration in days that a rehydrated blob is kept in hot, cool, or cold tiers before being returned to the archive tier. This condition applies only to `tierToArchive` actions. |

### Implement Blob storage lifecycle policies

You can add, edit, or remove a policy by using any of the following methods:

- Azure portal
- Azure PowerShell
- Azure CLI
- REST APIs

The following are the steps and some examples for the Portal and Azure CLI.

#### Azure portal

There are two ways to add a policy through the Azure portal: Azure portal List view, and Azure portal Code view. Following is an example of how to add a policy in the Azure portal Code view.

##### Azure portal Code view

1. In the Azure portal, navigate to your storage account.

1. Under **Data management**, select **Lifecycle Management** to view or change lifecycle management policies.

1. Select the **Code View** tab. On this tab, you can define a lifecycle management policy in JSON.

   The following JSON is an example of a policy that moves a block blob whose name begins with _log_ to the cool tier if it has been more than 30 days since the blob was modified.

   ```json
   {
     "rules": [
       {
         "enabled": true,
         "name": "move-to-cool",
         "type": "Lifecycle",
         "definition": {
           "actions": {
             "baseBlob": {
               "tierToCool": {
                 "daysAfterModificationGreaterThan": 30
               }
             }
           },
           "filters": {
             "blobTypes": ["blockBlob"],
             "prefixMatch": ["sample-container/log"]
           }
         }
       }
     ]
   }
   ```

#### Azure CLI

To add a lifecycle management policy with Azure CLI, write the policy to a JSON file, then call the `az storage account management-policy create` command to create the policy.

```sh
az storage account management-policy create \
    --account-name <storage-account> \
    --policy @policy.json \
    --resource-group <resource-group>
```

A lifecycle management policy must be read or written in full. Partial updates aren't supported.

### Rehydrate blob data from the archive tier

While a blob is in the archive access tier, it's considered to be offline and can't be read or modified. In order to read or modify data in an archived blob, you must first rehydrate the blob to an online tier, either the hot or cool tier. There are two options for rehydrating a blob that is stored in the archive tier:

- **Copy an archived blob to an online tier**: You can rehydrate an archived blob by copying it to a new blob in the hot or cool tier with the [Copy Blob](https://learn.microsoft.com/en-us/rest/api/storageservices/copy-blob) or [Copy Blob from URL](https://learn.microsoft.com/en-us/rest/api/storageservices/copy-blob-from-url) operation. Microsoft recommends this option for most scenarios.
- **Change a blob's access tier to an online tier**: You can rehydrate an archived blob to hot or cool by changing its tier using the [Set Blob Tier](https://learn.microsoft.com/en-us/rest/api/storageservices/set-blob-tier) operation.

Rehydrating a blob from the archive tier can take several hours to complete. Microsoft recommends rehydrating larger blobs for optimal performance. Rehydrating several small blobs concurrently may require extra time.

#### Rehydration priority

When you rehydrate a blob, you can set the priority for the rehydration operation via the optional `x-ms-rehydrate-priority` header on a [Set Blob Tier](https://learn.microsoft.com/en-us/rest/api/storageservices/set-blob-tier) or **Copy Blob/Copy Blob From URL** operation. Rehydration priority options include:

- **Standard priority**: The rehydration request is processed in the order it was received and may take up to 15 hours.
- **High priority**: The rehydration request is prioritized over standard priority requests and may complete in under one hour for objects under 10 GB in size.

To check the rehydration priority while the rehydration operation is underway, call [Get Blob Properties](https://learn.microsoft.com/en-us/rest/api/storageservices/get-blob-properties) to return the value of the `x-ms-rehydrate-priority` header. The rehydration priority property returns either `Standard` or `High`.

#### Copy an archived blob to an online tier

The first option for moving a blob from the archive tier to an online tier is to copy the archived blob to a new destination blob that is in either the hot or cool tier. You can use the [Copy Blob](https://learn.microsoft.com/en-us/rest/api/storageservices/copy-blob) operation to copy the blob. When you copy an archived blob to a new blob in an online tier, the source blob remains unmodified in the archive tier. You must copy the archived blob to a new blob with a different name or to a different container. You can't overwrite the source blob by copying to the same blob.

Rehydrating an archived blob by copying it to an online destination tier is supported within the same storage account only for service versions earlier than 2021-02-12. Beginning with service version 2021-02-12, you can rehydrate an archived blob by copying it to a different storage account, as long as the destination account is in the same region as the source account.

#### Change a blob's access tier to an online tier

The second option for rehydrating a blob from the archive tier to an online tier is to change the blob's tier by calling **Set Blob Tier**. With this operation, you can change the tier of the archived blob to either hot or cool.

Once a **Set Blob Tier** request is initiated, it can't be canceled. During the rehydration operation, the blob's access tier setting continues to show as archived until the rehydration process is complete.

To learn how to rehydrate a blob by changing its tier to an online tier, see [Rehydrate a blob by changing its tier](https://learn.microsoft.com/en-us/azure/storage/blobs/archive-rehydrate-to-online-tier#rehydrate-a-blob-by-changing-its-tier).

:stop_sign: Changing a blob's tier doesn't affect its last modified time. If there is a lifecycle management policy in effect for the storage account, then rehydrating a blob with **Set Blob Tier** can result in a scenario where the lifecycle policy moves the blob back to the archive tier after rehydration because the last modified time is beyond the threshold set for the policy.

## Work with Azure Blob storage

The Azure Storage client libraries for .NET offer a convenient interface for making calls to Azure Storage.

### Explore Azure Blob storage client library

The Azure Storage client libraries for .NET offer a convenient interface for making calls to Azure Storage. The latest version of the Azure Storage client library is version 12.x. Microsoft recommends using version 12.x for new applications.

The following table lists the basic classes, along with a brief description:

| Class               | Description                                                                                                                                                                    |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| BlobClient          | The BlobClient allows you to manipulate Azure Storage blobs.                                                                                                                   |
| BlobClientOptions   | Provides the client configuration options for connecting to Azure Blob Storage.                                                                                                |
| BlobContainerClient | The BlobContainerClient allows you to manipulate Azure Storage containers and their blobs.                                                                                     |
| BlobServiceClient   | The BlobServiceClient allows you to manipulate Azure Storage service resources and blob containers. The storage account provides the top-level namespace for the Blob service. |
| BlobUriBuilder      | The BlobUriBuilder class provides a convenient way to modify the contents of a Uri instance to point to different Azure Storage resources like an account, container, or blob. |

The following packages contain the classes used to work with Blob Storage data resources:

- [Azure.Storage.Blobs](https://learn.microsoft.com/en-us/dotnet/api/azure.storage.blobs): Contains the primary classes (client objects) that you can use to operate on the service, containers, and blobs.
- [Azure.Storage.Blobs.Specialized](https://learn.microsoft.com/en-us/dotnet/api/azure.storage.blobs.specialized): Contains classes that you can use to perform operations specific to a blob type, such as block blobs.
- [Azure.Storage.Blobs.Models](https://learn.microsoft.com/en-us/dotnet/api/azure.storage.blobs.models): All other utility classes, structures, and enumeration types.

### Create a client object

Working with any Azure resource using the SDK begins with creating a client object. In this section, you learn how to create client objects to interact with the three types of resources in the storage service: storage accounts, containers, and blobs.

When your application creates a client object, you pass a URI referencing the endpoint to the client constructor. You can construct the endpoint string manually, as shown in the examples in this article, or you can query for the endpoint at runtime using the Azure Storage management library.

The code samples in this unit use [DefaultAzureCredential](https://learn.microsoft.com/en-us/dotnet/api/azure.identity.defaultazurecredential) to authenticate to Azure via a Microsoft Entra security principal. The authentication process includes obtaining an access token for authorization. This access token is passed as a credential when the client is instantiated, and the credential persists throughout the client lifetime. The Microsoft Entra security principal requesting the token must be assigned an appropriate Azure RBAC role that grants access to blob data.

#### Create a BlobServiceClient object

An authorized `BlobServiceClient` object allows your app to interact with resources at the storage account level. `BlobServiceClient` provides methods to retrieve and configure account properties, as well as list, create, and delete containers within the storage account. This client object is the starting point for interacting with resources in the storage account.

The following example shows how to create a `BlobServiceClient` object:

```csharp
using Azure.Identity;
using Azure.Storage.Blobs;

public BlobServiceClient GetBlobServiceClient(string accountName)
{
    BlobServiceClient client = new(
        new Uri($"https://{accountName}.blob.core.windows.net"),
        new DefaultAzureCredential());

    return client;
}
```

#### Create a BlobContainerClient object

You can use a `BlobServiceClient` object to create a new `BlobContainerClient` object. A `BlobContainerClient` object allows you to interact with a specific container resource. `BlobContainerClient` provides methods to create, delete, or configure a container, and includes methods to list, upload, and delete the blobs within it.

The following example shows how to create a container client from a `BlobServiceClient` object to interact with a specific container resource:

```csharp
public BlobContainerClient GetBlobContainerClient(
    BlobServiceClient blobServiceClient,
    string containerName)
{
    // Create the container client using the service client object
    BlobContainerClient client = blobServiceClient.GetBlobContainerClient(containerName);
    return client;
}
```

If your work is narrowly scoped to a single container, you might choose to create a `BlobContainerClient` object directly without using `BlobServiceClient`.

```csharp
public BlobContainerClient GetBlobContainerClient(
    string accountName,
    string containerName,
    BlobClientOptions clientOptions)
{
    // Append the container name to the end of the URI
    BlobContainerClient client = new(
        new Uri($"https://{accountName}.blob.core.windows.net/{containerName}"),
        new DefaultAzureCredential(),
        clientOptions);

    return client;
}
```

#### Create a BlobClient object

To interact with a specific blob resource, create a `BlobClient` object from a service client or container client. A `BlobClient` object allows you to interact with a specific blob resource.

The following example shows how to create a blob client to interact with a specific blob resource:

```csharp
public BlobClient GetBlobClient(
    BlobServiceClient blobServiceClient,
    string containerName,
    string blobName)
{
    BlobClient client =
        blobServiceClient.GetBlobContainerClient(containerName).GetBlobClient(blobName);
    return client;
}
```

### Manage container properties and metadata by using .NET

Blob containers support system properties and user-defined metadata, in addition to the data they contain.

- **System properties**: System properties exist on each Blob storage resource. Some of them can be read or set, while others are read-only. Under the covers, some system properties correspond to certain standard HTTP headers. The Azure Storage client library for .NET maintains these properties for you.
- **User-defined metadata**: User-defined metadata consists of one or more name-value pairs that you specify for a Blob storage resource. You can use metadata to store other values with the resource. Metadata values are for your own purposes only, and don't affect how the resource behaves.

  Metadata name/value pairs are valid HTTP headers, and so should adhere to all restrictions governing HTTP headers. Metadata names must be valid HTTP header names and valid C# identifiers, can contain only ASCII characters, and should be treated as case-insensitive. Metadata values containing non-ASCII characters should be Base64-encoded or URL-encoded.

#### Retrieve container properties

To retrieve container properties, call one of the following methods of the BlobContainerClient class:

- `GetProperties`
- `GetPropertiesAsync`

The following code example fetches a container's system properties and writes some property values to a console window:

```csharp
private static async Task ReadContainerPropertiesAsync(BlobContainerClient container)
{
    try
    {
        // Fetch some container properties and write out their values.
        var properties = await container.GetPropertiesAsync();
        Console.WriteLine($"Properties for container {container.Uri}");
        Console.WriteLine($"Public access level: {properties.Value.PublicAccess}");
        Console.WriteLine($"Last modified time in UTC: {properties.Value.LastModified}");
    }
    catch (RequestFailedException e)
    {
        Console.WriteLine($"HTTP error code {e.Status}: {e.ErrorCode}");
        Console.WriteLine(e.Message);
        Console.ReadLine();
    }
}
```

#### Set and retrieve metadata

You can specify metadata as one or more name-value pairs on a blob or container resource. To set metadata, add name-value pairs to an `IDictionary` object, and then call one of the following methods of the `BlobContainerClient` class to write the values:

- `SetMetadata`
- `SetMetadataAsync`

The name of your metadata must conform to the naming conventions for C# identifiers. Metadata names preserve the case with which they were created, but are case-insensitive when set or read. If two or more metadata headers with the same name are submitted for a resource, Blob storage comma-separates and concatenates the two values and returns HTTP response code `200 (OK)`.

The following code example sets metadata on a container.

```csharp
public static async Task AddContainerMetadataAsync(BlobContainerClient container)
{
    try
    {
        IDictionary<string, string> metadata =
           new Dictionary<string, string>();

        // Add some metadata to the container.
        metadata.Add("docType", "textDocuments");
        metadata.Add("category", "guidance");

        // Set the container's metadata.
        await container.SetMetadataAsync(metadata);
    }
    catch (RequestFailedException e)
    {
        Console.WriteLine($"HTTP error code {e.Status}: {e.ErrorCode}");
        Console.WriteLine(e.Message);
        Console.ReadLine();
    }
}
```

The `GetProperties` and `GetPropertiesAsync` methods are used to retrieve metadata in addition to properties as shown earlier.

The following code example retrieves metadata from a container.

```csharp
public static async Task ReadContainerMetadataAsync(BlobContainerClient container)
{
    try
    {
        var properties = await container.GetPropertiesAsync();

        // Enumerate the container's metadata.
        Console.WriteLine("Container metadata:");
        foreach (var metadataItem in properties.Value.Metadata)
        {
            Console.WriteLine($"\tKey: {metadataItem.Key}");
            Console.WriteLine($"\tValue: {metadataItem.Value}");
        }
    }
    catch (RequestFailedException e)
    {
        Console.WriteLine($"HTTP error code {e.Status}: {e.ErrorCode}");
        Console.WriteLine(e.Message);
        Console.ReadLine();
    }
}
```

### Set and retrieve properties and metadata for blob resources by using REST

Containers and blobs support custom metadata, represented as HTTP headers. Metadata headers can be set on a request that creates a new container or blob resource, or on a request that explicitly creates a property on an existing resource.

#### Metadata header format

Metadata headers are name/value pairs. The format for the header is:

```txt
x-ms-meta-name:string-value
```

Beginning with version 2009-09-19, metadata names must adhere to the naming rules for C# identifiers.

Names are case-insensitive. Metadata names preserve the case with which they were created, but are case-insensitive when set or read. If two or more metadata headers with the same name are submitted for a resource, the Blob service returns status code `400 (Bad Request)`.

The metadata consists of name/value pairs. The total size of all metadata pairs can be up to 8 KB in size.

Metadata name/value pairs are valid HTTP headers, and so they adhere to all restrictions governing HTTP headers.

#### Operations on metadata

Metadata on a blob or container resource can be retrieved or set directly, without returning or altering the content of the resource.

Metadata values can only be read or written in full; partial updates aren't supported. Setting metadata on a resource overwrites any existing metadata values for that resource.

##### Retrieving properties and metadata

The GET and HEAD operations both retrieve metadata headers for the specified container or blob. These operations return headers only; they don't return a response body. The URI syntax for retrieving metadata headers on a container is as follows:

```txt
GET/HEAD https://myaccount.blob.core.windows.net/mycontainer?restype=container
```

The URI syntax for retrieving metadata headers on a blob is as follows:

```txt
GET/HEAD https://myaccount.blob.core.windows.net/mycontainer/myblob?comp=metadata
```

##### Setting Metadata Headers

The PUT operation sets metadata headers on the specified container or blob, overwriting any existing metadata on the resource. Calling PUT without any headers on the request clears all existing metadata on the resource.

The URI syntax for setting metadata headers on a container is as follows:

```txt
PUT https://myaccount.blob.core.windows.net/mycontainer?comp=metadata&restype=container
```

The URI syntax for setting metadata headers on a blob is as follows:

```txt
PUT https://myaccount.blob.core.windows.net/mycontainer/myblob?comp=metadata
```

#### Standard HTTP properties for containers and blobs

Containers and blobs also support certain standard HTTP properties. Properties and metadata are both represented as standard HTTP headers; the difference between them is in the naming of the headers. Metadata headers are named with the header prefix `x-ms-meta-` and a custom name. Property headers use standard HTTP header names, as specified in the Header Field Definitions section 14 of the HTTP/1.1 protocol specification.

The standard HTTP headers supported on containers include:

- ETag
- Last-Modified

The standard HTTP headers supported on blobs include:

- ETag
- Last-Modified
- Content-Length
- Content-Type
- Content-MD5
- Content-Encoding
- Content-Language
- Cache-Control
- Origin
- Range
