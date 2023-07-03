# Blob Storage

Question: Which of the following types of blobs are used to store virtual hard drive files?

- [ ] Block blobs
- [ ] Append blobs
- [x] Page blobs

---

Answer: Page blobs store random access files up to 8 TB in size, and are used to store virtual hard drive (VHD) files and serve as disks for Azure virtual machines.  
Append blobs are optimized for data append operations.  
Block blobs are made up of blocks of data that can be managed individually.

Question: Which of the following types of storage accounts is recommended for most scenarios using Azure Storage?

- [x] General-purpose v2
- [ ] General-purpose v1
- [ ] FileStorage

Answer: General-purpose v2 supports blobs, files, queues, and tables. It's recommended for most scenarios using Azure Storage.  
FileStorage: This is recommended for enterprise or high-performance scale applications and won't cover most scenarios.  
General-purpose-v1 is a legacy account type.

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

Question: You arrive at work donned in your favorite furry costume and discover a task from your supervisor demanding you take the company's website offline in order to perform some maintenance on it. The website consists of a single `_index.html` file stored in Azure Storage's `$web` container. You promptly set the access level of that specific file to private and consider the job done as you dive into some leisurely Reddit browsing. Just half an hour later, your supervisor storms over to your desk and fires you on the spot. What could be the reason behind this unexpected termination?

- [ ] Your choice of unconventional office attire: a furry costume.
- [ ] You erred in your task; you were supposed to set the access level of the entire `$web` container to private.
- [ ] To make the site inaccessible to users, you should have set the entire storage account to private.
- [x] You have a fundamental misunderstanding of how things function within Azure Static Site hosting.

Answer: In this situation, to make the static website inaccessible, you need to turn off the Static Website hosting feature from your Azure Storage account. You know nothing...

You actually cannot set the access level of an individual blob (file), but rather the access level is set on the container level. However, even setting the access level of the `$web` container to private wouldn't take the static website offline. This is due to the fact that Azure's static website feature always serves files in the `$web` container anonymously, regardless of the container's access level setting. Same goes for setting the entire storage account to private.

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
