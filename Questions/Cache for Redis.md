# Azure Cache for Redis

Question: What is the lowest service tier of Azure Cache for Redis recommended for use in production scenarios?

- [ ] Basic
- [x] Standard
- [ ] Premium

Answer: The standard tier is the lowest tier that offers replication，which is always recommended for production scenarios.

---

Question: Which of the following represents the expire time resolution when applying a time to live (TTL) to a key in Redis?

- [x] 1-millisecond
- [ ] 10-milliseconds
- [ ] seconds or milliseconds

Answer: The expire time resolution is always 1 millisecond.  
Expirations can be set using seconds or milliseconds precision, but the expire time resolution is always 1 millisecond.

---

Question: Your company is developing an ASP.NET web application that requires a simple and fast method to store session state information. The application is not expected to scale, and there's no need for distributed storage. You need to identify the best method to store session state. What should you use?

- [x] In Memory Cache
- [ ] Sql Server
- [ ] Cosmos DB
- [ ] Cache for Redis at Standard Tier
- [ ] Cache for Redis at Premium Tier

Answer: Simple and fast, suitable for non-scalable applications.

---

Question: Your company is developing an ASP.NET web application that requires storing session state information in persistent storage. The application must be scalable, and performance is a concern. Additionally, the solution must support concurrent access to the same session state data and be optimized for use with relational databases. You need to identify the best method to store session state. What should you use?

- [ ] In Memory Cache
- [x] Sql Server
- [ ] Cosmos DB
- [ ] Cache for Redis at Standard Tier
- [ ] Cache for Redis at Premium Tier

Answer: Sql Server allows for scalability, persistent storage, and can be configured for concurrent access, making it suitable for performance-sensitive applications that use relational databases.  
NOTE: Cosmos DB is theoretically _possible_, but it's more complex to set up, more expensive to run.

---

Question: Your company is developing an ASP.NET web application that requires a scalable and fast method to store session state information. The application must handle transient network failures and support concurrent access to the same session state data. Additionally, the solution must be optimized for cost. You need to identify the best method to store session state. What should you use?

- [ ] In Memory Cache
- [ ] Sql Server
- [ ] Cosmos DB
- [x] Cache for Redis at Standard Tier
- [ ] Cache for Redis at Premium Tier

Answer: Combines simplicity, speed, scalability, supports concurrent access, and is optimized for cost, making it suitable for handling transient network failures.

---

Question: Your company is developing an ASP.NET web application that requires a highly scalable, fast, and premium method to store session state information. The application must handle transient network failures, provide advanced features, and support concurrent access to the same session state data. Additionally, the solution must offer higher performance capabilities. You need to identify the best method to store session state. What should you use?

- [ ] In Memory Cache
- [ ] Sql Server
- [ ] Cosmos DB
- [ ] Cache for Redis at Standard Tier
- [x] Cache for Redis at Premium Tier

Answer: Offers premium features, scalability, speed, supports concurrent access, and provides higher performance capabilities, making it suitable for handling transient network failures.

---

Question: After acquiring Twitter, Elon Musk, in a moment of alcohol-induced "inspiration", decides to rename it to **X** and then change it's session storage to be something more "Musk-esque". He wants a solution that not only flaunts his financial prowess but also gives the engineers hell, all while ensuring that his tweets would eventually reach his followers on Mars (when the infrastructure is there). He demands global distribution, concurrent access, and the possible ability to scale beyond Earth's boundaries (internal note from the engineering team: "Nope!"). What decision should he force upon the poor Twitter... errr... _X_ engineers to use for session storage, considering that they could only use currently existing solutions, because making them building something from the ground up would likely cause mass resignations?

- [ ] In Memory Session State Provider
- [ ] SQL Server Session State Provider
- [ ] Cache for Redis at Premium Tier
- [ ] A Giant Neural Network Powered by Starlink Satellites
- [ ] A Custom-Built Database Using Tesla Batteries
- [x] Azure Cosmos DB
- [ ] A Room Full of Floppy Disks Managed by a Team of Robots

Answer: While the other extravagant options might appeal to Musk's sense of innovation and flair, Cosmos DB is the only realistic solution that currently exists and meets the requirements of global distribution, scalability, and concurrent access, while being totally unsuited for that in terms of cost and complexity (e.g. "Musk-esque").

---

Question: Write a code to verify the connection to Azure Cache for Redis:

```cs
var connectionString = "[cache-name].redis.cache.windows.net:6380,password=[password-here],ssl=True,abortConnect=False";
// Code here
```

Answer:

```cs
var connectionString = "[cache-name].redis.cache.windows.net:6380,password=[password-here],ssl=True,abortConnect=False";
using (var redisConnection = ConnectionMultiplexer.Connect(connectionString))
{
    var db = redisConnection.GetDatabase();
    db.Execute("PING");
}
```

---

Question: You are developing a .NET application that uses Redis for caching. You need to set a variable named "userData" to the value "JohnDoe123" and ensure that this value expires after one hour. Write down the Redis commands you would use to achieve this.

```ps
# Redis here
```

Answer:

```ps
SET userData JohnDoe123
EXPIRE userData 3600
```

---

Question: You are developing a .NET application in C# that uses Redis for caching. You need to set a variable named "userData" to the value "JohnDoe123" and ensure that this value expires after one hour. Write down the C# code using the Redis SDK that you would use to achieve this.

```cs
//Code here
```

Answer:

```cs
var connectionString = "[cache-name].redis.cache.windows.net:6380,password=[password-here],ssl=True,abortConnect=False";
using (var redisConnection = ConnectionMultiplexer.Connect(connectionString))
{
    var db = redisConnection.GetDatabase();
    db.StringSet("userData", "JohnDoe123", TimeSpan.FromHours(1));
}
```

---

Question: Given the following code:

```redis
SET userData JohnDoe123
EXPIRE userData 60
```

When will `userData` expire?

- [ ] 60ms
- [x] 60s
- [ ] 60h
- [ ] 60 days

Answer: `EXPIRE key seconds [NX | XX | GT | LT]`

---

Question: You are a developer for a company that uses Redis for caching user information. Due to security compliance requirements, user data should not be persisted in the cache for more than one minute. If the key already exists, the expiration time should not be updated. Which of the following Redis commands would you use to set the expiration time for a key named userData to one minute and only apply the command if the key does not exist?

- [ ] EXPIRE userData 60 EX
- [x] EXPIRE userData 60 NX
- [ ] EXPIRE userData 60 XX
- [ ] EXPIRE userData 1 EX
- [ ] EXPIRE userData 1 NX
- [ ] EXPIRE userData 1 XX

Answer: `NX` when key does not exist, 60 seconds

---

Question: For your new web application, you're setting up the `maxmemory` policy directive in Azure Cache for Redis. How can you configure the eviction policy to target the least recently used keys first when the memory limit is met, specifically among the keys with an expiration set? What should be the selected policy for the maxmemory-policy directive?

- [ ] noeviction
- [ ] allkeys-lru
- [ ] allkeys-lfu
- [x] volatile-lru
- [ ] volatile-lfu
- [ ] allkeys-random
- [ ] volatile-random
- [ ] volatile-ttl

Answer: volatile: if expiration is set; lru - least recently used.

---

Question: Which of the following scenarios are suitable for Private Caching?

- [x] A single-user application that requires rapid access to user-specific data.
- [ ] A distributed system where multiple instances need to access the same view of cached data.
- [x] A desktop application that needs to store temporary files locally for quick retrieval.
- [ ] A large-scale web application that requires a common cache accessible by various servers.
- [x] A personal finance tool that caches individual user's financial data on their device for quick access.
- [ ] A global weather application that needs to provide consistent weather data to users across different regions.

Answer: Private Caching is best suited for scenarios where data is specific to individual instances or users, and speed is a priority. It's simpler but may lead to inconsistencies between different instances.

---

Question: Which of the following scenarios are suitable for Shared Caching?

- [ ] A small mobile app that stores user preferences on the device itself.
- [x] An e-commerce platform where product details are frequently accessed by multiple users and need to be consistent across various servers.
- [x] A content delivery network (CDN) that requires caching of static content across multiple geographical locations.
- [ ] A standalone desktop application that caches user-specific settings locally.
- [x] A multi-player online game where player profiles and scores need to be consistent across different game servers.
- [x] A corporate intranet that needs to cache common resources like logos and templates for consistent branding across different departments.

Answer: Shared Caching is ideal for situations where consistency and scalability are essential, and the data needs to be accessed by multiple instances or applications. It may be more complex to implement and slightly slower to access.

---

Question: You are designing a cache for a video editing application where the most recently used video clips are unlikely to be needed again in the short term, while older clips are frequently revisited. What eviction policy would be most suitable?

- [x] Most-Recently-Used (MRU)
- [ ] First-In-First-Out (FIFO)
- [ ] Explicit Removal

Answer: Since the most recently used clips are less likely to be needed again soon, an MRU policy would be effective in removing them from the cache, allowing older, frequently accessed clips to remain available.

---

Question: You are managing a cache for a data processing system that handles tasks in a sequential order, and older tasks are unlikely to be revisited. What eviction policy would be best?

- [ ] Most-Recently-Used (MRU)
- [x] First-In-First-Out (FIFO)
- [ ] Explicit Removal

Answer: In a system where older data is less likely to be accessed and tasks are handled sequentially, a FIFO policy would be beneficial.

---

Question: You are working on a database caching system where certain data must be removed from the cache when specific events occur, such as data modification. What eviction policy would be appropriate?

- [ ] Most-Recently-Used (MRU)
- [ ] First-In-First-Out (FIFO)
- [x] Explicit Removal

Answer: For a system where data eviction is triggered by specific events, an explicit removal policy would provide the necessary control and accuracy.

---

Question: What feature in Azure Cache for Redis links two Premium instances?

- [ ] Load Balancing
- [x] Geo-replication
- [ ] Sharding
- [ ] Data Partitioning
- [ ] Virtual Network
- [ ] None of the listed

Answer: Geo-replication is the feature that provides a mechanism for linking two Premium tier Azure Cache for Redis instances, allowing data written to the primary cache to be replicated to the secondary linked cache. This functionality can be used to replicate a cache across Azure regions.

---

Question: Invalidate "teamsList":

```cs
IDatabase cache = Connection.GetDatabase();
// Code here
```

Answer:

```cs
IDatabase cache = Connection.GetDatabase();
cache.KeyDelete("teamsList");
```

---

Question: To enhance performance and ensure data consistency between your data store and cache, under what circumstances would the Cache-Aside pattern be appropriate? Select two correct answers from the options below.

- [ ] When the data to be cached can be completely loaded when the application starts
- [x] When the cache lacks built-in support for read-through and write-through operations
- [x] When the demand for resources is highly variable
- [ ] When you need to cache web session state information across multiple servers

Answer: Cache-Aside pattern is ideal for scenarios where native read-through and write-through operations are not supported by the cache. It also allows for on-demand data loading, making it suitable for situations with fluctuating resource demand.

---

Question: You are using Azure Cache for Redis to improve the performance of your web application. Which of the following would you store in Azure Cache for Redis?

- [ ] HttpContext.Items
- [ ] ViewState
- [x] Session state
- [ ] Application state
- [ ] Query strings
- [ ] Cookies

Answer: Storing session state in Azure Cache for Redis is one of the common patterns / use cases.

---
