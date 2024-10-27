# Create Blob storage resources by using the .NET client library

This exercise uses the Azure Blob storage client library to show you how to perform the following actions on Azure Blob storage in a console app:

- Create a container
- Upload blobs to a container
- List the blobs in a container
- Download blobs
- Delete a container

## Prerequisites

- An Azure account with an active subscription. If you don't already have one, you can sign up for a free trial at <https://azure.com/free>.

- [Visual Studio Code](https://code.visualstudio.com/) on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms).

- [.NET 8](https://dotnet.microsoft.com/download/dotnet/8.0) is the target framework for the exercise.

- The [C# extension](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp) for Visual Studio Code.

## Setting up

Perform the following actions to prepare Azure, and your local environment, for the exercise.

1. Start Visual Studio Code and open a terminal window by selecting **Terminal** from the top application bar, then selecting **New Terminal**.

1. Sign in to Azure by using the following command. A browser window should open letting you choose which account to sign in with.

   ```sh
   az login
   ```

1. Create a resource group for the resources needed for this exercise. Replace `<myLocation>` with a region near you.

   ```sh
   az group create --location <myLocation> --name az204-blob-rg
   ```

1. Create a storage account. Create a storage account to use in the application. Replace `<myLocation>` with the same region you used for the resource group. Replace `<myStorageAcct>` with a unique name.

   ```sh
   az storage account create --resource-group az204-blob-rg --name <myStorageAcct> --location <myLocation> --sku Standard_LRS
   ```

   :information_source: Storage account names must be between 3 and 24 characters in length and may contain numbers and lowercase letters only. Your storage account name must be unique within Azure. No two storage accounts can have the same name.

1. Get credentials for the storage account.

- Navigate to the [Azure portal](https://portal.azure.com/).
- Locate the storage account created.
- Select **Access keys** in the **Security + networking** section of the navigation pane. Here, you can view your account access keys and the complete connection string for each key.
- Find the **Connection string** value under **key1**, and select the **Copy** button to copy the connection string. You'll add the connection string value to the code in the next section.
- In the **Blob** section of the storage account overview, select **Containers**. Leave the windows open so you can view changes made to the storage as you progress through the exercise.

## Prepare the .NET project

:bangbang: The code in this project uses a connection string to authorize access to your storage account. This configuration is for example purposes. Connection strings and account access keys should be used with caution in application code. If your account access key is lost or accidentally placed in an insecure location, your service may become vulnerable. Anyone who has the access key is able to authorize requests against the storage account, and effectively has access to all the data.

For optimal security, Microsoft recommends using managed identities for Azure resources to authorize requests against blob, queue, and table data, whenever possible. To learn more, see [Authorize access to blobs using Microsoft Entra ID](https://learn.microsoft.com/en-us/azure/storage/blobs/authorize-access-azure-active-directory).

Create project named _az204-blob_ and install the Azure Blob Storage client library.

1. In the VS Code terminal, navigate to a directory where you want to store your project.

1. In the terminal, use the `dotnet new` command to create a new console app. This command creates a simple "Hello World" C# project with a single source file: Program.cs.

   ```csharp
   dotnet new console -n az204-blob
   ```

1. Use the following commands to switch to the newly created az204-blob folder and build the app to verify that all is well.

   ```sh
   cd az204-blob
   dotnet build
   ```

1. Inside the _az204-blob_ folder, create another folder named _data_. This is where the blob data files are created and stored.

   ```sh
   mkdir data
   ```

1. While still in the application directory, install the Azure Blob Storage client library for .NET package by using the `dotnet add package` command.

   ```sh
   dotnet add package Azure.Storage.Blobs
   ```

   :point_up: Leave the console window open so you can use it to build and run the app later in the exercise.

1. Open the _Program.cs_ file in your editor, and replace the contents with the following code.

   ```csharp
   using Azure.Storage.Blobs;
   using Azure.Storage.Blobs.Models;

   Console.WriteLine("Azure Blob Storage exercise\n");

   // Run the examples asynchronously, wait for the results before proceeding
   ProcessAsync().GetAwaiter().GetResult();

   Console.WriteLine("Press enter to exit the sample application.");
   Console.ReadLine();

   static async Task ProcessAsync()
   {
       // Copy the connection string from the portal in the variable below.
       string storageConnectionString = "CONNECTION STRING";

       // Create a client that can authenticate with a connection string
       BlobServiceClient blobServiceClient = new BlobServiceClient(storageConnectionString);

       // COPY EXAMPLE CODE BELOW HERE

   }
   ```

1. Set the `storageConnectionString` variable to the value you copied from the portal.

## Build the full app

Now it's time to build the app. The following sections contain a brief description of the action being taken as well, as the code snippet you add to the project. Each new snippet is appended to the one before it. You build and run the console app at the end.

For each of the following examples, copy the code and append it to the previous snippet in the example code section of the _Program.cs_ file.

### Create a container

Creating a container includes creating an instance of the `BlobServiceClient` class, and then calling the `CreateBlobContainerAsync` method to create the container in your storage account. A GUID value is appended to the container name to ensure that it's unique. The `CreateBlobContainerAsync` method fails if the container already exists.

```csharp
//Create a unique name for the container
string containerName = "wtblob" + Guid.NewGuid().ToString();

// Create the container and return a container client object
BlobContainerClient containerClient = await blobServiceClient.CreateBlobContainerAsync(containerName);
Console.WriteLine("A container named '" + containerName + "' has been created. " +
"\nTake a minute and verify in the portal." +
"\nNext a file will be created and uploaded to the container.");
Console.WriteLine("Press 'Enter' to continue.");
Console.ReadLine();
```

### Upload blobs to a container

The following code snippet gets a reference to a `BlobClient` object by calling the Get`BlobClient` method on the container created in the previous section. It then uploads the selected local file to the blob by calling the `UploadAsync` method. This method creates the blob if it doesn't already exist, and overwrites it if it does.

```csharp
// Create a local file in the ./data/ directory for uploading and downloading
string localPath = "./data/";
string fileName = "wtfile" + Guid.NewGuid().ToString() + ".txt";
string localFilePath = Path.Combine(localPath, fileName);

// Write text to the file
await File.WriteAllTextAsync(localFilePath, "Hello, World!");

// Get a reference to the blob
BlobClient blobClient = containerClient.GetBlobClient(fileName);

Console.WriteLine("Uploading to Blob storage as blob:\n\t {0}\n", blobClient.Uri);

// Open the file and upload its data
using (FileStream uploadFileStream = File.OpenRead(localFilePath))
{
   await blobClient.UploadAsync(uploadFileStream);
   uploadFileStream.Close();
}

Console.WriteLine("\nThe file was uploaded. We'll verify by listing" +
" the blobs next.");
Console.WriteLine("Press 'Enter' to continue.");
Console.ReadLine();
```

### List the blobs in a container

List the blobs in the container by using the `GetBlobsAsync` method. In this case, only one blob was added to the container, so the listing operation returns just that one blob.

```csharp
// List blobs in the container
Console.WriteLine("Listing blobs...");
await foreach (BlobItem blobItem in containerClient.GetBlobsAsync())
{
   Console.WriteLine("\t" + blobItem.Name);
}

Console.WriteLine("\nYou can also verify by looking inside the " +
"container in the portal." +
"\nNext the blob will be downloaded with an altered file name.");
Console.WriteLine("Press 'Enter' to continue.");
Console.ReadLine();
```

### Download blobs

Download the blob created previously to your local file system by using the `DownloadAsync` method. The example code adds a suffix of "DOWNLOADED" to the blob name so that you can see both files in local file system.

```csharp
// Download the blob to a local file
// Append the string "DOWNLOADED" before the .txt extension
string downloadFilePath = localFilePath.Replace(".txt", "DOWNLOADED.txt");

Console.WriteLine("\nDownloading blob to\n\t{0}\n", downloadFilePath);

// Download the blob's contents and save it to a file
BlobDownloadInfo download = await blobClient.DownloadAsync();

using (FileStream downloadFileStream = File.OpenWrite(downloadFilePath))
{
   await download.Content.CopyToAsync(downloadFileStream);
}
Console.WriteLine("\nLocate the local file in the data directory created earlier to verify it was downloaded.");
Console.WriteLine("The next step is to delete the container and local files.");
Console.WriteLine("Press 'Enter' to continue.");
Console.ReadLine();
```

### Delete a container

The following code cleans up the resources the app created by deleting the entire container using `DeleteAsync`. It also deletes the local files created by the app.

```csharp
// Delete the container and clean up local files created
Console.WriteLine("\n\nDeleting blob container...");
await containerClient.DeleteAsync();

Console.WriteLine("Deleting the local source and downloaded files...");
File.Delete(localFilePath);
File.Delete(downloadFilePath);

Console.WriteLine("Finished cleaning up.");
```

## Run the code

Now that the app is complete it's time to build and run it. Ensure you are in your application directory and run the following commands:

```sh
dotnet build
dotnet run
```

There are many prompts in the app to allow you to take the time to see what's happening in the portal after each step.

## Clean up other resources

The app deleted the resources it created. You can delete all of the resources created for this exercise by using the following command. You need to confirm that you want to delete the resources.

```sh
az group delete --name az204-blob-rg --no-wait
```
