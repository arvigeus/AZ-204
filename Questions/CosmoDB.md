# CosmoDB

Question: Which of the following consistency levels offers the greatest throughput?

- [ ] Strong
- [ ] Session
- [ ] Bounded staleness
- [ ] Consistent prefix
- [x] Eventual

Answer: The eventual consistency level offers the greatest throughput at the cost of weaker consistency.

---

Question: What are request units (RUs) in Azure Cosmos DB?

- [x] A unit of measurement used to express the cost of all database operations in Azure Cosmos DB.
- [ ] A unit of time used to measure the duration of database operations.
- [ ] A unit of storage used to measure the amount of data stored in Azure Cosmos DB.

Answer: RUs represent the normalized cost of all database operations in Azure Cosmos DB, including writes, point reads, and queries.

---

Question: When defining a stored procedure in the Azure portal input parameters are always sent as what type to the stored procedure?

- [x] String
- [ ] Integer
- [ ] Boolean

Answer: When defining a stored procedure in Azure portal, input parameters are always sent as a string to the stored procedure.

---

Question: Which of the following would one use to validate properties of an item being created?

- [x] Pretrigger
- [ ] Post-trigger
- [ ] User-defined function

Answer: Pretriggers can be used to conform data before it's added to the container.  
Post-triggers run after an item is created.  
User-defined functions run on existing data.

---

Question: Your company is developing a new online multiplayer game. The game includes a feature that shows a global leaderboard to players. The leaderboard doesn't have to be up-to-the-minute for each player, but any lag should be within a defined limit. What consistency level would be most suitable for this scenario?

- [ ] Strong
- [ ] Session
- [x] Bounded staleness
- [ ] Consistent prefix
- [ ] Eventual

Answer: The Bounded staleness consistency level allows for some lag in data propagation but within a defined limit.

---

Question: Your company operates a financial application which handles sensitive transactions. It's critical that all operations are immediately consistent across all regions, even if it might impact performance. What consistency level would be most suitable for this scenario?

- [x] Strong
- [ ] Session
- [ ] Bounded staleness
- [ ] Consistent prefix
- [ ] Eventual

Answer: Strong consistency level ensures immediate consistency across all regions.

---

Question: Your company is creating a shopping platform where users interact with their own shopping carts. A user's actions should be immediately consistent within their session, but it doesn't have to be strongly consistent with other users' sessions. What consistency level would be most suitable for this scenario?

- [ ] Strong
- [x] Session
- [ ] Bounded staleness
- [ ] Consistent prefix
- [ ] Eventual

Answer: Session consistency level ensures that within a single session.

---

Question: Your company is building a workflow management system where sequences of tasks are processed. It's crucial that these tasks are processed in the order they were written, even if it means reading data a bit behind the latest. What consistency level would be most suitable for this scenario?

- [ ] Strong
- [ ] Session
- [ ] Bounded staleness
- [x] Consistent prefix
- [ ] Eventual

Answer: Consistent prefix level ensures that the sequence of operations is preserved.

---

Question: Your company is creating a social media platform with a feature to 'like' posts. It's more important to have high availability and throughput, and your application can handle some temporary inconsistencies, like the count of likes appearing out of order or slightly stale. What consistency level would be most suitable for this scenario?

- [ ] Strong
- [ ] Session
- [ ] Bounded staleness
- [ ] Consistent prefix
- [x] Eventual

Answer: Eventual consistency level prioritizes availability and throughput over immediate consistency.

---

Question: Your company has recently started using Azure Cosmos DB and hasn't made any adjustments to the consistency level. What delay should the company expect in data propagation between different regions?

- [ ] No delay, data is immediately consistent across all regions.
- [ ] Delay is limited to a specific number of operations or time interval.
- [x] Delay may occur but is contained within a single user's session.
- [ ] Delay is possible and data might be read in the order of writes but a bit behind the latest.
- [ ] Delay and out-of-order reads may occur, but the system will eventually become consistent.

Answer: Default consistency level is **Session**

---

Question: What is the primary reason for identifying access patterns in your solution when using Azure Cosmos DB?

- [ ] To determine the cost of the solution
- [x] To ensure efficient data modeling
- [ ] To choose the right programming language
- [ ] To decide the number of users for the platform

Answer: [Identifying access patterns](https://learn.microsoft.com/en-us/azure/cosmos-db/nosql/model-partition-example#identify-the-main-access-patterns) helps design the data model to optimize application interactions, such as minimizing cross-partition queries or reducing request numbers through denormalization.  
Although cost can be influenced by data modeling, the main goal is performance optimization.  
The choice of programming language is largely unrelated to data modeling. Access patterns don't dictate language choice.  
The number of platform users is a business decision, not directly related to data modeling or access patterns.

---

Question: What is the purpose of denormalization in the context of Azure Cosmos DB data modeling?

- [ ] To reduce the number of containers
- [x] To optimize read queries
- [ ] To increase the number of request units consumed
- [ ] To add more users to the platform

Answer: [Denormalization in Azure Cosmos DB data modeling](https://learn.microsoft.com/en-us/azure/cosmos-db/nosql/model-partition-example#v2-introducing-denormalization-to-optimize-read-queries) is used to optimize read queries. By storing related data together (denormalizing), you can retrieve all the data you need in a single query, reducing the need for multiple queries and improving performance.  
Denormalization doesn't aim to reduce the number of containers (Option A), increase the number of request units consumed (Option C), or add more users to the platform (Option D); it's a strategy to optimize read operations by organizing data efficiently within containers.

--

Question: When would you use the manual failover feature in Azure Cosmos DB?

- [x] When you want to test your application's resilience
- [ ] When you want to add a new region to your account
- [ ] When you want to enable multi-region writes
- [ ] When you want to create a new Azure Cosmos DB account

Answer: Manual failover allows you to manually trigger a failover to a backup region, which is useful for testing your application's resilience to failures.

Question: What is the prerequisite for enabling service-managed failover in Azure Cosmos DB?

- [ ] Your account must have at least one region
- [x] Your account must have two or more regions
- [ ] Your account must have multi-region writes enabled
- [ ] Your account must be configured for manual failover

Answer: The service-managed failover feature requires your account to have two or more regions, as it needs a backup region to failover to if the primary region becomes unavailable.

---

Question: What is the role of a partition key in Azure Cosmos DB?

- [x] It helps to distribute data efficiently across partitions.
- [ ] It is used to manage the Azure Cosmos DB account.
- [ ] It is used to create a unique DNS name for the account.
- [ ] It is used to group containers into a database.

Answer: The partition key helps Azure Cosmos DB distribute the data efficiently across partitions. The value of this property is then used to route data to the appropriate partition to be written, updated, or deleted.

---

Question: What is the main characteristic of Azure Cosmos DB containers regarding data schemas?

- [ ] Containers require a strict schema for all items.
- [x] Containers are schema-agnostic.
- [ ] Containers only support JSON schema.
- [ ] Containers do not support any schema.

Answer: ontainers in Azure Cosmos DB are schema-agnostic, meaning items within a container can have arbitrary schemas or different entities so long as they share the same partition key.

---

Question: What is the maximum amount of data a logical partition in Azure Cosmos DB can store?

- [ ] 10 GB
- [x] 20 GB
- [ ] 50 GB
- [ ] Unlimited

Answer: 20 GB

---

Question: What is the relationship between Azure Cosmos DB and Azure Resource Group?

- [ ] Azure Cosmos DB is a type of Azure Resource Group.
- [ ] Azure Resource Group is a type of Azure Cosmos DB.
- [x] Azure Cosmos DB account is created in an Azure Resource Group.
- [ ] Azure Resource Group is created in an Azure Cosmos DB account.

Answer: To begin using Azure Cosmos DB, you need to create an Azure Cosmos DB account in an Azure Resource Group in your subscription.

---

Question: What is the maximum throughput amount a physical partition in Azure Cosmos DB can have?

- [ ] 1,000 RU/s
- [ ] 5,000 RU/s
- [x] 10,000 RU/s
- [ ] 20,000 RU/s

Answer: 10,000 RU/s

---

Question: You are designing an application that will use Azure Cosmos DB as its data store. The application will store data about customers and their orders. Each customer can have multiple orders, and you expect a high volume of read and write operations on the orders.

You want to ensure that the application can handle the expected load and that the data is distributed efficiently. You also want to ensure that the application can retrieve all orders for a specific customer as efficiently as possible.

How would you design the data model in Azure Cosmos DB to meet these requirements?

- [ ] Create separate databases for customers and orders, and use the `customer ID` as the partition key for the orders database.
- [x] Create a single container for both customers and orders, and use the `customer ID` as the partition key.
- [ ] Create separate containers for customers and orders, and use the `customer ID` as the partition key for the orders container.
- [ ] Create separate containers for customers and orders, with the `customer ID` as the partition key for the customers container and the `order ID` as the partition key for the orders container.

Answer: A container can hold items with different schemas as long as they share the same partition key. By storing customers and their orders in the same container and using the `customer ID` as the partition key, you can ensure that all orders for a specific customer are stored in the same partition. This makes it efficient to retrieve all orders for a specific customer.  
The other options are incorrect because they do not efficiently distribute the data or allow for efficient retrieval of all orders for a specific customer.

---

Question: What is the main characteristic of shared throughput in Azure Cosmos DB?

- [ ] It is exclusively reserved for a single container.
- [x] It is specified at the database level and shared with up to 25 containers.
- [ ] It automatically adjusts based on the current workload.
- [ ] It is a fixed amount of throughput.

Answer: Shared throughput in Azure Cosmos DB is specified at the database level and then shared with up to 25 containers within the database. The other options are incorrect because they describe characteristics of dedicated throughput, not shared throughput.

---

Question: Can you switch between dedicated and shared throughput in Azure Cosmos DB?

- [ ] Yes, you can switch at any time.
- [x] No, you cannot switch once a container is created.
- [ ] Yes, but only within the first 24 hours of creating a container.
- [ ] No, but you can increase the amount of dedicated throughput for a container.

Answer: You cannot switch between dedicated and shared throughput once a container is created. If you want to change a container from shared to dedicated throughput, you must create a new container and copy the data to it.

---

Question: What is the main advantage of using autoscale throughput in Azure Cosmos DB?

- [ ] It provides a fixed amount of throughput regardless of workload.
- [x] It automatically adjusts the amount of throughput based on the current workload.
- [ ] It allows throughput to be shared among multiple containers.
- [ ] It requires manual adjustment of throughput based on workload.

Answer: Autoscale automatically adjusts the amount of throughput based on the current workload.

---

Question: You are designing an application that will use Azure Cosmos DB as its data store. The application will have a high volume of read and write operations. You want to ensure that each container in your database can handle the expected load independently. How should you configure the throughput?

- [ ] Use shared throughput and create a separate database for each container.
- [x] Use dedicated throughput and assign it to each container individually.
- [ ] Use shared throughput and assign it to each container individually.
- [ ] Use dedicated throughput and assign it at the database level.

Answer: Dedicated throughput in Azure Cosmos DB is specified at the container level, meaning each container has its own amount of throughput that it can use independently of other containers.  
Shared throughput is specified at the database level (not at container level) and shared among containers, not at the individual database level.  
Dedicated throughput is not assigned at the database level but at the container level.

---

Question: You are designing an application that will use Azure Cosmos DB as its data store. The application will have several containers, each storing different types of data, but none of the containers are expected to have a high volume of read and write operations. You want to optimize costs while ensuring that all containers have enough throughput. Which of the following strategies would be the most cost-effective?

- [ ] Assign dedicated throughput to each container individually, ensuring each has enough to handle its expected load.
- [x] Assign shared throughput at the database level, allowing all containers to draw from a common pool of throughput.
- [ ] Assign dedicated throughput at the database level, ensuring the entire database has enough to handle its expected load.
- [ ] Assign shared throughput to each container individually, allowing each to draw from its own pool of throughput.

Answer: Shared throughput in Azure Cosmos DB is specified at the database level and then shared among all containers within the database. This is ideal for scenarios where you have multiple containers that do not require a high volume of operations and you want to optimize costs.  
Dedicated throughput is specified at the container (not at dayabase level) level and would be more expensive for a scenario where the containers do not have a high volume of operations.  
Shared throughput is not assigned at the container level but at the database level.

---
