# Connect an app to Azure Cache for Redis by using .NET Core

In this exercise you learn how to:

- Create a new Redis Cache instance by using Azure CLI commands.
- Create a .NET Core console app to add and retrieve values from the cache by using the StackExchange.Redis package.

## Prerequisites

- An **Azure account** with an active subscription. If you don't already have one, you can sign up for a free trial at <https://azure.com/free>.
- [Visual Studio Code](https://code.visualstudio.com/) on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms).
- The [C# extension](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp) for Visual Studio Code.
- [.NET 8](https://dotnet.microsoft.com/download/dotnet/8.0) is the target framework for this exercise.

## Create Azure resources

1. Sign in to the portal: <https://portal.azure.com> and open the Cloud Shell, and select **Bash** as the shell.

1. Create a resource group for Azure resources. Replace `<myLocation>` with a region near you.

   ```sh
   az group create --name az204-redis-rg --location <myLocation>
   ```

1. Create an Azure Cache for Redis instance by using the `az redis create` command. The instance name needs to be unique and the following script attempts to generate one for you, replace `<myLocation>` with the region you used in the previous step. This command takes a few minutes to complete.

   ```sh
   redisName=az204redis$RANDOM
   az redis create --location <myLocation> \
       --resource-group az204-redis-rg \
       --name $redisName \
       --sku Basic --vm-size c0
   ```

1. In the Azure portal, navigate to the new Redis Cache you created.

1. Select **Access keys** in the **Settings**/**Authentication** section of the Navigation Pane and leave the portal open. Copy the **Primary connection string (StackExchange.Redis)** value to use in the app later.

## Create the console application

1. Create a console app by running the following command in the Visual Studio Code terminal.

   ```sh
   dotnet new console -o Rediscache
   ```

1. Open the app in Visual Studio Code by selecting **File > Open Folder** and choosing the folder for the app.

1. Add the StackExchange.Redis package to the project.

   ```sh
   dotnet add package StackExchange.Redis
   ```

1. Delete any existing code in the _Program.cs_ file and add the following `using` statement at the top.

   ```csharp
   using StackExchange.Redis;
   ```

1. Add the following variable after the `using` statement, replace `<REDIS_CONNECTION_STRING>` with the **Primary connection string (StackExchange.Redis)** from the portal.

   ```csharp
   // connection string to your Redis Cache
   string connectionString = "REDIS_CONNECTION_STRING";
   ```

1. Append the following code in the _Program.cs_ file:

   ```csharp
   using (var cache = ConnectionMultiplexer.Connect(connectionString))
   {
       IDatabase db = cache.GetDatabase();

       // Snippet below executes a PING to test the server connection
       var result = await db.ExecuteAsync("ping");
       Console.WriteLine($"PING = {result.Resp2Type} : {result}");

       // Call StringSetAsync on the IDatabase object to set the key "test:key" to the value "100"
       bool setValue = await db.StringSetAsync("test:key", "100");
       Console.WriteLine($"SET: {setValue}");

       // StringGetAsync retrieves the value for the "test" key
       string getValue = await db.StringGetAsync("test:key");
       Console.WriteLine($"GET: {getValue}");
   }
   ```

1. In the Visual Studio Code terminal, run the following commands to build and run the app.

   ```sh
   dotnet build
   dotnet run
   ```

1. The output should be similar to the following example:

   ```txt
   PING = SimpleString : PONG
   SET: True
   GET: 100
   ```

1. Return to the portal and select **Activity log** in the **Azure Cache for Redis** blade. You can view the operations in the log.

## Clean up resources

When the resources are no longer needed, you can use the az group delete command to remove the resource group.

```sh
az group delete -n az204-redis-rg --no-wait
```
