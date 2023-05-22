# CosmoDB

Question: Which of the following consistency levels offers the greatest throughput?

- [ ] Strong
- [ ] Session
- [x] Eventual

Answer: The eventual consistency level offers the greatest throughput at the cost of weaker consistency.

Question: What are request units (RUs) in Azure Cosmos DB?

- [x] A unit of measurement used to express the cost of all database operations in Azure Cosmos DB.
- [ ] A unit of time used to measure the duration of database operations.
- [ ] A unit of storage used to measure the amount of data stored in Azure Cosmos DB.

Answer: RUs represent the normalized cost of all database operations in Azure Cosmos DB, including writes, point reads, and queries.

Question: When defining a stored procedure in the Azure portal input parameters are always sent as what type to the stored procedure?

- [x] String
- [ ] Integer
- [ ] Boolean

Answer: When defining a stored procedure in Azure portal, input parameters are always sent as a string to the stored procedure.

Question: Which of the following would one use to validate properties of an item being created?

- [x] Pretrigger
- [ ] Post-trigger
- [ ] User-defined function

Answer: Pretriggers can be used to conform data before it's added to the container.  
Post-triggers run after an item is created.  
User-defined functions run on existing data.
