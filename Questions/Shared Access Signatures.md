# Shared Access Signatures

Question: How can you modify or revoke a stored access policy in Azure Storage?

- [x] Call the access control list operation for the resource type to replace the existing policy.
- [x] Delete the stored access policy.
- [x] Rename it by changing the signed identifier.
- [x] Change the expiry time to a value in the past.
- [ ] Regenerate the SAS token.
- [ ] Modify the storage account key.

Answer: Regenerating the SAS token does not affect the stored access policy. The SAS token and the stored access policy are separate entities. The SAS token uses the stored access policy, but regenerating the SAS token does not change the stored access policy.  
Modifying the storage account key does not directly affect the stored access policy. The stored access policy is associated with the storage account, not the key. However, if you regenerate the storage account key that was used to create a SAS token, it will revoke the SAS token, but not the stored access policy itself.

---

Question: You are developing a .NET application that interacts with Azure Blob Storage. You need to generate a token that will allow a client to have read and write access to a specific blob in your storage account for a period of 24 hours. This token should be generated in a secure manner without sharing your storage account key. The client is authenticated with Microsoft Entra ID. Write the C# code to accomplish this task.

```cs
// Define your storage account name, container name, and blob name
string accountName = "<storage-account-name>";
string containerName = "<container-name>";
string blobName = "<blob-name>";
```

Answer:

```cs
// Define your storage account name, container name, and blob name
string accountName = "<storage-account-name>";
string containerName = "<container-name>";
string blobName = "<blob-name>";

var credential = new DefaultAzureCredential();
var blobServiceClient = new BlobServiceClient(new Uri($"https://{accountName}.blob.core.windows.net", credential));

// Get a user delegation key for the Blob service that's valid for 24 hours
var delegationKey = await blobServiceClient.GetUserDelegationKey(DateTimeOffset.UtcNow, DateTimeOffset.UtcNow.AddDays(1));

var sasBuilder = new BlobSasBuilder()
{
    BlobContainerName = containerName,
    BlobName = blobName,
    Resource = "b",
    StartsOn = DateTimeOffset.UtcNow,
    ExpiresOn = DateTimeOffset.UtcNow.AddDays(1),
    Protocol = SasProtocol.Https
};
sasBuilder.SetPermissions(BlobSasPermissions.Read | BlobSasPermissions.Write);

// Use the key to get the SAS token
string sasToken = sasBuilder.ToSasQueryParameters(delegationKey, accountName).ToString();
```

---

Question: You are developing a .NET application that interacts with Azure Blob Storage. You need to generate a token that will allow a client to have read access to a specific container in your storage account for a period of 48 hours. This token should be generated in a straightforward manner, even if it involves sharing your storage account key. The client is not authenticated with Microsoft Entra ID. Write the C# code to accomplish this task.

```cs
string accountName = "<storage-account-name>";
string accountKey = "<storage-account-key>";
string containerName = "<container-name>";

// Code here
```

Answer:

```csharp
string accountName = "<storage-account-name>";
string accountKey = "<storage-account-key>";
string containerName = "<container-name>";

var sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

var sasBuilder = new BlobSasBuilder()
{
    BlobContainerName = containerName,
    Resource = "c",
    StartsOn = DateTimeOffset.UtcNow,
    ExpiresOn = DateTimeOffset.UtcNow.AddDays(2),
    Protocol = SasProtocol.Https
};
sasBuilder.SetPermissions(BlobSasPermissions.Read);

// Use the key to get the SAS token
string sasToken = sasBuilder.ToSasQueryParameters(sharedKeyCredential).ToString();
```

---

Question: You are developing a .NET application that interacts with Azure Blob Storage. You need to generate a token that will allow a client to have read and write access to both Blob and Queue services in your storage account for a period of 72 hours. This token should be generated using your storage account key and should be applicable at the storage account level. Write the C# code to accomplish this task.

```cs
// Define your storage account name and key
string accountName = "<storage-account-name>";
string accountKey = "<storage-account-key>";
```

Answer:

```cs
// Define your storage account name and key
string accountName = "<storage-account-name>";
string accountKey = "<storage-account-key>";

var sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

var sasBuilder = new AccountSasBuilder()
{
    Services = AccountSasServices.Blobs | AccountSasServices.Queues,
    ResourceTypes = AccountSasResourceTypes.All,
    ExpiresOn = DateTimeOffset.UtcNow.AddDays(3),
    Protocol = SasProtocol.Https
};
sasBuilder.SetPermissions(AccountSasPermissions.Read | AccountSasPermissions.Write);

// Use the key to get the SAS token
string sasToken = sasBuilder.ToSasQueryParameters(sharedKeyCredential).ToString();
```

---

Question: You are working with Azure Blob Storage and have a task to provide a client with a URL that grants read access to a specific blob for a limited period of time. The client should only be able to access the blob using HTTPS. The URI to the blob is `https://medicalrecords.blob.core.windows.net/patient-images/patient-116139-nq8z7f.jpg?` and you have a `sig` parameter with the value `SrW1HZ5Nb6MbRzTbXCaPm%2BJiSEn15tC91Y4umMPwVZs%3D`. The access should start at `2020-01-20T11:42:32Z` and expire at `2020-01-20T19:42:32Z`. Construct the URL that fulfills these requirements.

Answer: `https://medicalrecords.blob.core.windows.net/patient-images/patient-116139-nq8z7f.jpg?sp=r&st=2020-01-20T11:42:32Z&se=2020-01-20T19:42:32Z&spr=https&sig=SrW1HZ5Nb6MbRzTbXCaPm%2BJiSEn15tC91Y4umMPwVZs%3D`

---

Question: Which of the following types of shared access signatures (SAS) applies to Blob storage only?

- [ ] Account SAS
- [ ] Service SAS
- [x] User delegation SAS

Answer: A user delegation SAS is secured with Microsoft Entra ID credentials and also by the permissions specified for the SAS. A user delegation SAS applies to Blob storage only.  
An account SAS delegates access to resources in one or more of the storage services. All of the operations available via a service or user delegation SAS are also available via an account SAS.  
A service SAS delegates access to a resource in the following Azure Storage services: Blob storage, Queue storage, Table storage, or Azure Files.

---

Question: Which of the following best practices provides the most flexible and secure way to use a service or account shared access signature (SAS)?

- [x] Associate SAS tokens with a stored access policy.
- [ ] Always use HTTPS
- [ ] Implement a user delegation SAS

Answer: The most flexible and secure way to use a service or account SAS is to associate the SAS tokens with a stored access policy.  
A user delegation SAS is the most secure SAS, but isn't highly flexible because you must use Microsoft Entra ID to manage credentials.  
Using HTTPS prevents man-in-the-middle attacks but isn't the most flexible and secure practice.

---
