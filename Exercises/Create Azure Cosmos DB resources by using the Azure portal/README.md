# Create Azure Cosmos DB resources by using the Azure portal

In this exercise you learn how to perform the following actions in the Azure portal:

- Create an Azure Cosmos DB account
- Add a database and a container
- Add data to your database
- Clean up resources

## Prerequisites

- An Azure account with an active subscription. If you don't already have one, you can sign up for a free trial at <https://azure.com/free>.

## Create an Azure Cosmos DB account

1. Sign-in to the [Azure portal](https://portal.azure.com/).
1. From the Azure portal navigation pane, select _+ Create a resource_.
1. Search for **Azure Cosmos DB**, then select **Create/Azure Cosmos DB** to get started.
1. On the **Which API best suits your workload?** page, select **Create** in the **Azure Cosmos DB for NoSQL** box.
1. In the **Create Azure Cosmos DB Account - Azure Cosmos DB for NoSQL page**, enter the basic settings for the new Azure Cosmos DB account.

   - **Subscription**: Select the subscription you want to use.
   - **Resource Group**: Select **Create new**, then enter _az204-cosmos-rg_.
   - **Account Name**: Enter a _unique_ name to identify your Azure Cosmos account. The name can only contain lowercase letters, numbers, and the hyphen (-) character. It must be between 3-31 characters in length.
   - **Availability Zones**: Select **Disable**.
   - **Location**: Use the location that is closest to your users to give them the fastest access to the data.
   - **Capacity mode**: Select **Serverless**.

1. Select **Review + create**.

1. Review the account settings, and then select **Create**. It takes a few minutes to create the account. Wait for the portal page to display **Your deployment is complete**.

1. Select **Go to resource** to go to the Azure Cosmos DB account page.

## Add a database and a container

You can use the Data Explorer in the Azure portal to create a database and container.

1. Select **Data Explorer** from the left navigation on your Azure Cosmos DB account page, and then select **New Container**.

   ![You can add a container using the Data Explorer.](https://learn.microsoft.com/en-us/training/wwl-azure/explore-azure-cosmos-db/media/portal-cosmos-new-container.png)

1. In the **New container** pane, enter the settings for the new container.

   - **Database ID**: Select **Create new**, and enter _ToDoList_.
   - **Container ID**: Enter _Items_
   - **Partition key**: Enter _/category_. The samples in this demo use _/category_ as the partition key.

1. Select **OK**. The Data Explorer displays the new database and the container that you created.

## Add data to your database

Add data to your new database using Data Explorer.

1. In **Data Explorer**, expand the **ToDoList** database, and expand the **Items** container. Next, select **Items**, and then select **New Item**.

   ![Create new item in the database.](https://learn.microsoft.com/en-us/training/wwl-azure/explore-azure-cosmos-db/media/portal-cosmos-new-data.png)

1. Add the following structure to the item on the right side of the Items pane:

   ```json
   {
     "id": "1",
     "category": "personal",
     "name": "groceries",
     "description": "Pick up apples and strawberries.",
     "isComplete": false
   }
   ```

1. Select **Save**.

1. Select **New Item** again, and create and save another item with a unique `id`, and any other properties and values you want. Your items can have any structure, because Azure Cosmos DB doesn't impose any schema on your data.

## Clean up resources

1. Select **Overview** from the left navigation on your Azure Cosmos DB account page.

1. Select the **az204-cosmos-rg** resource group link in the Essentials group.

1. Select **Delete** resource group and follow the directions to delete the resource group and all of the resources it contains.
