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

- [.NET 6](https://dotnet.microsoft.com/download/dotnet/6.0) is the target framework for the steps below.

- The [C# extension](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp) for Visual Studio Code.

## Setting up

Perform the following actions to prepare Azure, and your local environment, for the exercise.

1. Start Visual Studio Code and open a terminal window by selecting **Terminal** from the top application bar, then selecting **New Terminal**.

1. Login to Azure by using the command below. A browser window should open letting you choose which account to login with.

   ```sh
   az login
   ```

1. Create a resource group for the resources needed for this exercise. Replace `<myLocation>` with a region near you.

   ```sh
   az group create --location <myLocation> --name az204-blob-rg
   ```

1. Create a storage account. We need a storage account created to use in the application. Replace `<myLocation>` with the same region you used for the resource group. Replace `<myStorageAcct>` with a unique name.

   ```sh
   az storage account create --resource-group az204-blob-rg --name <myStorageAcct> --location <myLocation> --sku Standard_LRS
   ```

   :information_source: Storage account names must be between 3 and 24 characters in length and may contain numbers and lowercase letters only. Your storage account name must be unique within Azure. No two storage accounts can have the same name.

1. Get credentials for the storage account.

- Navigate to the [Azure portal](https://portal.azure.com/).
- Locate the storage account created.
- Select **Access keys** in the **Security + networking** section of the navigation pane. Here, you can view your account access keys and the complete connection string for each key.
- Find the **Connection string** value under **key1**, and select the **Copy** button to copy the connection string. You will add the connection string value to the code in the next section.
- In the **Blob** section of the storage account overview, select **Containers**. Leave the windows open so you can view changes made to the storage as you progress through the exercise.

## Prepare the .NET project

In this section we'll create project named az204-blob and install the Azure Blob Storage client library.

1. In the VS Code terminal navigate to a directory where you want to store your project.

1. In the terminal, use the `dotnet new` command to create a new console app. This command creates a simple "Hello World" C# project with a single source file: Program.cs.

   ```csharp
   dotnet new console -n az204-blob
   ```

1. Use the following commands to switch to the newly created az204-blob folder and build the app to verify that all is well.

   ```sh
   cd az204-blob
   dotnet build
   ```

1. Inside the _az204-blob_ folder, create another folder named _data_. This is where the blob data files will be created and stored.

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

For each of the following sections below you'll find a brief description of the action being taken as well as the code snippet you'll add to the project. Each new snippet is appended to the one before it, and we'll build and run the console app at the end.

For each example below copy the code and append it to the previous snippet in the example code section of the _Program.cs_ file.

### Create a container

To create the container first create an instance of the `BlobServiceClient` class, then call the `CreateBlobContainerAsync` method to create the container in your storage account. A GUID value is appended to the container name to ensure that it is unique. The `CreateBlobContainerAsync` method will fail if the container already exists.

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

List the blobs in the container by using the `GetBlobsAsync` method. In this case, only one blob has been added to the container, so the listing operation returns just that one blob.

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

The app deleted the resources it created. You can delete all of the resources created for this exercise by using the command below. You will need to confirm that you want to delete the resources.

```sh
az group delete --name az204-blob-rg --no-wait
```
