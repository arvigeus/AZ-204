# Blob Storage

Question: Which of the following types of blobs are used to store virtual hard drive files?

- [ ] Block blobs
- [ ] Append blobs
- [x] Page blobs

Answer: Page blobs store random access files up to 8 TB in size, and are used to store virtual hard drive (VHD) files and serve as disks for Azure virtual machines.  
Append blobs are optimized for data append operations.  
Block blobs are made up of blocks of data that can be managed individually.

---

Question: Which of the following types of storage accounts is recommended for most scenarios using Azure Storage?

- [x] General-purpose v2
- [ ] General-purpose v1
- [ ] FileStorage

Answer: General-purpose v2 supports blobs, files, queues, and tables. It's recommended for most scenarios using Azure Storage.  
FileStorage: This is recommended for enterprise or high-performance scale applications and won't cover most scenarios.  
General-purpose-v1 is a legacy account type.

---

Question: What is the maximum size of data that a block blob in Azure Blob storage can store?

- [ ] 8-TB
- [ ] Unlimited
- [x] 190.7-TiB

Answer: Block blobs in Azure Blob storage can store up to about 190.7-TiB of data.

---

Question: You are developing a service that organizes uploaded documents into containers in Azure Blob Storage. Your application assigns metadata to each container, including user names and titles that may contain international characters (e.g., Vietnamese or Bulgarian diacritics). You use the `SetMetadata` method on a `BlobContainerClient` to store this metadata. During testing, you discover that the metadata appears corrupted or incomplete when retrieved. You need to ensure the metadata is stored and retrieved correctly without losing any special characters.

What should you do?

- [x] Convert the metadata values to Base64 before storing them.
- [ ] Re-save metadata again to ensure values are stored properly.
- [ ] Encode the values in UTF-8 and pass them directly to `SetMetadata`.
- [ ] Change the storage account's encoding settings to allow Unicode metadata.
- [ ] `SetMetadata` is not a valid method on a `BlobContainerClient` object.

Answer: Azure Storage metadata only supports ASCII characters. If you need to store non-ASCII characters (e.g., Unicode), you must encode them, and Base64 is the standard workaround.

---

Question: What are the two versions of client-side encryption available in the Azure Blob Storage and Queue Storage client libraries?

- [x] Version 1 uses Cipher Block Chaining (CBC) mode with AES and Version 2 uses Galois/Counter Mode (GCM) mode with AES
- [ ] Version 1 uses Advanced Encryption Standard (AES) and Version 2 uses Federal Information Processing Standards (FIPS)
- [ ] Version 1 uses Galois/Counter Mode (GCM) mode with AES and Version 2 uses Cipher Block Chaining (CBC) mode with AES

Answer: Version 1 uses CBC mode with AES, while Version 2 uses GCM mode with AES.

---

Question: Which access tier is considered to be offline and can't be read or modified?

- [ ] Cool
- [x] Archive
- [ ] Hot

Answer: Blobs in the archive tier must be rehydrated to either the hot or cool tier before it can be read or modified.

---

Question: Which of the following storage account types supports lifecycle policies?

- [ ] General Purpose v1
- [x] General Purpose v2
- [ ] FileStorage

Answer: Azure Blob storage lifecycle management offers a rich, rule-based policy for General Purpose v2 and Blob storage accounts.  
General Purpose v1 accounts need to be upgraded to v2 before lifecycle policies are supported.

---

Question: Which of the following standard HTTP headers are supported for both containers and blobs when setting properties by using REST?

- [x] Last-Modified
- [ ] Content-Length
- [ ] Origin
- [ ] Cache-Control
- [x] ETag

Answer: Last-Modified and ETag are supported on both containers and blobs.  
Content-Length and Cache-Control are only supported on blobs.

---

Question: Which of the following classes of the Azure Storage client library for .NET allows you to manipulate both Azure Storage containers and their blobs?

- [ ] BlobClient
- [x] BlobContainerClient
- [ ] BlobUriBuilder

Answer: The BlobContainerClient can be used to manipulate both containers and blobs.  
The BlobUriBuilder provides a way to modify the contents of a Uri instance to point to different Azure Storage resources like an account, container, or blob.  
The BlobClient class is limited to manipulating blobs.

---

Question: As an Azure Developer working for a company named Contoso, your task involves managing the company's Azure storage account. The storage account contains numerous block blobs, all of which are tagged with specific metadata indicating the project they are associated with. For instance, some blobs are tagged as "Project: Contoso".

However, due to new privacy regulations, Contoso has decided to delete all blobs tagged with "Project: Contoso" as soon as possible after they have been uploaded to the storage. This is to ensure that sensitive data is not retained longer than necessary.

Your task is to create an Azure Storage lifecycle policy `DeleteContosoData` (as a JSON definition) to automate this process.

```jsonc
// Code here
```

Answer:

```json
{
  "rules": [
    {
      "enabled": true,
      "name": "DeleteContosoData",
      "type": "Lifecycle",
      "definition": {
        "actions": {
          "baseBlob": {
            "delete": {
              "daysAfterModificationGreaterThan": 0
            }
          }
        },
        "filters": {
          "blobIndexMatch": [
            {
              "name": "Project",
              "op": "==",
              "value": "Contoso"
            }
          ],
          "blobTypes": ["blockBlob"]
        }
      }
    }
  ]
}
```

---

Question: How frequently are Azure Storage lifecycle management policy rules evaluated?

- [ ] Every time a new blob is added or an existing blob is modified.
- [ ] Once every hour.
- [x] Once a day
- [ ] Once a week
- [ ] They are manually triggered by the user (by default)

Answer: Azure Storage lifecycle management policies are evaluated once a day. In practice, this means that the policies are not necessarily applied immediately after a blob satisfies the policy rule.

---

Question: As a cloud solutions developer, you're working with an existing codebase that uses Azure's legacy Storage SDK. During a service disruption at the primary data center, you need to configure the Azure Storage client to retry any failed requests on the secondary location using RA-GRS storage.

Which LocationMode option from the `Microsoft.Azure.Storage.RetryPolicies.LocationMode` class should you use?

- [ ] LocationMode.PrimaryOnly
- [ ] LocationMode.SecondaryOnly
- [x] LocationMode.PrimaryThenSecondary
- [ ] LocationMode.SecondaryThenPrimary

Answer: `LocationMode.PrimaryThenSecondary` allows requests to first try the primary location and then retry at the secondary location if necessary.  
This option is part of the legacy Azure Storage SDK. In the newer Azure SDKs (like Azure.Storage.Blobs), the handling of retries and failovers has been reworked and made more efficient.

---

Question: In the Azure Blob Storage .NET SDK, you want to ensure that you only update a blob if it has not been modified since you last fetched it. Here is the initial code you have:

```cs
BlobServiceClient blobServiceClient = new BlobServiceClient(connectionString);
BlobContainerClient containerClient = blobServiceClient.GetBlobContainerClient("mycontainer");
BlobClient blobClient = containerClient.GetBlobClient("myblob");

BlobProperties properties = await blobClient.GetPropertiesAsync();;

// perform the update
BlobUploadOptions options = new BlobUploadOptions
{
    Metadata = new Dictionary<string, string>
    {
        { "key", "value" }
    },
    // Fill in this part
};

await blobClient.UploadAsync(BinaryData.FromString("data"), options);
```

What should you put in the `// Fill in this part` section to ensure the blob is only updated if it has not been modified since you last fetched it?

Answer: The missing code should be as follows:

```cs
Conditions = new BlobRequestConditions { IfMatch = properties.Value.ETag }
```

The `IfMatch` property of the `BlobRequestConditions` object can be set to the ETag of the blob. The `ETag` is a version identifier for the blob, and it changes whenever the blob is modified. By setting `IfMatch` to the `ETag` you got when you fetched the blob's properties, you're specifying that the update should only occur if the blob has not been modified since then. If the blob has been modified, its `ETag` will have changed, the IfMatch condition will not be met, and the update operation will fail with a `412 Precondition Failed` error. This approach is used to implement optimistic concurrency control, preventing unexpected overwrites due to concurrent modifications.

---

Question: GreenTech Energy Solutions specializes in providing real-time energy consumption data to its clients. They store sensor data in Azure Blob Storage and have decided to maintain two copies of each data file in the 'North Europe' and 'South Africa North' Azure regions. New sensor data files are initially uploaded to the 'North Europe' blob storage. What Azure tool and command would you use to ensure both blob containers have completely identical data?

- [ ] `Copy-AzStorageBlob`
- [ ] `az storage blob copy start-batch`
- [x] `azcopy sync --recursive`
- [ ] `azcopy copy --recursive`

Answer: `azcopy sync --recursive` is the correct choice because it not only copies the blobs but also ensures that both blob containers are in sync. The `--recursive` flag ensures that all subdirectories and their files are also synced.  
`azcopy copy --recursive` will copy the entire content of source container to destination container, which is not an optimal approach.

---

Question: Which of the following methods is the most optimal way to copy a blob from one container to another in Azure Blob Storage?

- [x] `await targetBlob.StartCopyFromUriAsync(sourceBlob.Uri);`
- [ ] `await sourceBlob.StartCopyFromUriAsync(targetBlob.Uri);`
- [ ] `await sourceBlob.DownloadToAsync(localStream); await targetBlob.UploadAsync(localStream);`
- [ ] `await targetBlob.DownloadToAsync(localStream); await sourceBlob.UploadAsync(localStream);`

Answer: `await targetBlob.StartCopyFromUriAsync(sourceBlob.Uri);`  
`await sourceBlob.DownloadToAsync(localStream); await targetBlob.UploadAsync(localStream);` is inefficient because it requires downloading the blob to local storage and then uploading it, consuming more time and resources.

---

Question: A healthcare organization is considering Azure Blob Storage for storing patient records that are rarely accessed but need to be retained for compliance reasons. They are particularly interested in minimizing storage costs. If they need to access a file stored in Azure Blob Archive storage, which of the following are a valid first step they can take?

- [ ] Reconfigure the storage account
- [x] Change the tier of the blob
- [ ] Rotate the storage account keys
- [x] Copy the blob to another tier
- [ ] Change the access permissions
- [ ] Change the account kind

Answer: Archive blobs cannot be accessed directly. To read the data of an archived blob, you must first either:

- Change its tier to Hot or Cool (this process is known as rehydration).
- Copy the blob to a Hot or Cool tier to access its data without affecting the original blob in Archive storage.

---

Question: The organization DataGenix has developed a machine-learning model for the predictive maintenance of industrial machinery. The model runs periodically and stores the predictive results in Blob storage. Additionally, it stores sensor data from the machinery in a separate container. The predictive results are frequently accessed for immediate action and need to be available within minutes. The sensor data is primarily used for compliance and can be accessed less frequently. What would be the optimal access tier for storing Predictive Results and Sensor Data?

Options:

- [ ] Predictive Results – Archive access tier, Sensor Data – Cool access tier
- [x] Predictive Results – Hot access tier, Sensor Data – Archive access tier
- [ ] Predictive Results – Cool access tier, Sensor Data – Archive access tier
- [ ] Predictive Results – Hot access tier, Sensor Data – Cool access tier

Answer:

- **Predictive Results**: Both Hot and Cool tiers are instantly available (within minutes), but the Hot tier is optimized for frequently accessed data. Anything needing less than an hour that doesn’t need frequent access could be put in Cool.
- **Sensor Data**: Both Cool and Archive are suitable for less frequently accessed data. Since the question mentions no requirement for instant access and asks for optimal (cost-effective), Archive tier is more suitable.

---

Question: A video streaming company stores large media files, typically 8-9 GB in size, in Azure Blob Storage. These files are infrequently accessed but are preferably needed within an hour when requested for editing. What would be the most cost-effective Access tier for storing these media files, considering the one-hour access time is a preference but not a strict requirement?

- [ ] Hot access tier
- [ ] Cool access tier
- [ ] Cold access tier
- [x] Archive access tier

Answer: Files up to 10 GB can be rehydrated within an hour on High Priority, but it's not guaranteed.

---

Question: Which of the following methods can be used to move blobs from one container to another?

- [x] Powershell
- [x] AzCopy
- [x] AZ CLI
- [x] .Net SDK
- [x] Azure Portal

Answer: You can use any of these

---

Question: You need to retrieve and update the metadata of blobs in an Azure storage account using a .Net library. Which functions would you use:

- [ ] `GetMetadataAsync` and `SetMetadataAsync`
- [x] `GetPropertiesAsync` and `SetMetadataAsync`
- [ ] `GetMetadataAsync` and `SetPropertiesAsync`

Answer: Beautiful! [BlobClient](https://learn.microsoft.com/en-us/dotnet/api/azure.storage.blobs.blobclient?view=azure-dotnet) doesn't support `GetMetadataAsync`, but it has `SetMetadataAsync`.

---

Question: An intern inadvertently misconfigures an application, bypassing the necessary safety checks, which leads to the deletion of a crucial file. Soft delete is enabled on the Azure storage account where this file is stored. Before the incident, two snapshots — Snapshot A and Snapshot B — had been created for the file. Snapshot A was deleted for optimization before the mishap occurred. As a result of the intern's error, the crucial blob and all its remaining snapshots are deleted. Is it possible to restore Snapshot B?

- [x] Yes
- [ ] No

Answer: Since soft delete is enabled on the storage account, both the blob and its snapshots, including Snapshot B, are soft-deleted. This means they can be recovered during the retention period specified in the soft delete policy. Therefore, it is possible to restore Snapshot B.

---

What authentication supported by AzCopy to copy data from public blob into Azure Blob:

- [x] OAuth
- [x] SAS
- [ ] Operation is not permitted

Answer: Azcopy supports both SAS and OAuth authentication for data transfer between two Azure Blobs.

---

Question: You're building an ASP.Net Core app to interact with Azure Blob containers using Entra ID and role-based access. What permission should you set for the Azure Storage API?

- [ ] `User.Read`
- [ ] `User.Write`
- [ ] `client_id`
- [x] `user_impersonation`
- [ ] `Blob.Read`
- [ ] `Storage.Access`
- [ ] `AzureAD.Auth`
- [ ] `Storage Blob Data Contributor`
- [ ] `Storage Blob Data Reader`
- [ ] `Storage Account Contributor`

Answer: `user_impersonation` allows the application to act as the user, inheriting their roles and permissions for blob access.

---

Question: Which of the following accounts are eligable for using ZRS?

- [x] General purpose v2 account at Standard performance tier
- [x] General purpose v2 account at Premium performance tier
- [ ] General purpose v1 account at Standard performance tier
- [ ] General purpose v1 account at Premium performance tier
- [ ] Blob storage account at Standard performance tier
- [ ] Blob storage account at Premium performance tier

Answer: Only General purpose v2 accounts are eligable for using ZRS

---

Question: Which of the following accounts are eligable for using GRS?

- [x] General purpose v2 account at Standard performance tier
- [ ] General purpose v2 account at Premium performance tier
- [ ] General purpose v1 account at Standard performance tier
- [ ] General purpose v1 account at Premium performance tier
- [ ] Blob storage account at Standard performance tier
- [ ] Blob storage account at Premium performance tier

Answer: Only General purpose v2 accounts at standard tier are eligable for using GRS

---
