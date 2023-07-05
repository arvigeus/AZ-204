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
