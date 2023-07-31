# [Azure Cache for Redis](https://docs.microsoft.com/en-us/azure/azure-cache-for-redis/)

Offers both the open-source OSS Redis and a commercial Redis Enterprise as a managed service.

## Common patterns

- **Data cache**: Load large databases into a cache as needed using the cache-aside pattern for faster access. Changes to data can also update the cache, which is shared with other clients.
- **Content cache**: Use an in-memory cache for static content like headers, footers, and banners of web pages. This provides quick access compared to backend datastores.
- **Session store**: Store user history data (e.g., shopping carts) associated with user cookies using an in-memory cache like Azure Cache for Redis for faster retrieval than a full relational database.
- **Job and message queuing**: Queue tasks that take time to execute, deferring longer operations to be processed in sequence, often by another server. This is known as task queuing.
- **Distributed transactions**: Execute a series of commands against a backend data-store as a single atomic operation using Azure Cache for Redis' support for transactions.

### [**Cache-Aside Pattern**](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside)

A strategy to load data into a cache from a data store on demand, improving performance and maintaining data consistency. If data is not in the cache, it's retrieved from the data store and added to the cache. If data is updated, it's modified in the data store and the corresponding cache item is invalidated. Use Cache-Aside when a cache doesn't provide native read-through and write-through operations, or when resource demand is unpredictable. If the data is static and fits in the cache, better load it at startup and prevent it from expiring. Avoid this pattern for caching session state in a web farm to prevent client-server affinity dependencies.

Example:

```csharp
public async Task<MyEntity> GetMyEntityAsync(int id)
{
    var key = $"MyEntity:{id}";
    var cache = Connection.GetDatabase();
    var json = await cache.StringGetAsync(key);
    var value = string.IsNullOrWhiteSpace(json) ? default(MyEntity) : JsonConvert.DeserializeObject<MyEntity>(json);
    if (value == null) // Cache miss
    {
        value = ...; // Retrieve from data store
        if (value != null)
        {
            await cache.StringSetAsync(key, JsonConvert.SerializeObject(value));
            await cache.KeyExpireAsync(key, TimeSpan.FromMinutes(5));
        }
    }
    return value;
}
```

## Tiers

- **Basic**: A single VM running an OSS Redis cache. It is suitable for development/test and noncritical workloads, but it lacks a service-level agreement (SLA).
- **Standard**: This tier involves two VMs in a replicated configuration for the OSS Redis cache.
- **Premium**: Offering high performance, Premium caches use more powerful VMs than Basic or Standard caches. They provide higher throughput, lower latency, better availability, and additional features.
- **Enterprise**: These high-performance caches are powered by Redis Labs' Redis Enterprise software. They support Redis modules like RediSearch, RedisBloom, and RedisTimeSeries, and offer even greater availability than the Premium tier.
- **Enterprise Flash**: This tier provides cost-effective large caches powered by Redis Labs' Redis Enterprise software. It extends Redis data storage to nonvolatile memory on a VM, which is cheaper than DRAM, reducing the overall per-GB memory cost.

## Working with Redis

Create cache:

```ps
# Azure CLI command to create Azure Cache for Redis

# Using az redis create command to create a Redis cache instance
# --name specifies the name of the Redis cache, which must be globally unique
# --location specifies the Azure region where you want to create the cache
# --sku specifies the pricing tier and size of the Redis cache
# --shard-count specifies the number of shards to be used for clustering. Only available for Premium and Enterprise tiers
# Replace <name>, <location>, <sku>, <vm-size>, and <shard-count> with your specific values

az redis create \
    --name <name> \ # must be globally unique
    --location <location> \
    --sku <sku> \ # pricing tier
    --vm-size <vm-size> \ # depends on the chosen tier
    --shard-count <shard-count> \ # specifies the number of shards to be used for clustering (Premium and Enterprise only). Max: 10
    --resource-group <resource-group>
```

Redis Commands:

| Command                  | Description                              | Returns                    |
| ------------------------ | ---------------------------------------- | -------------------------- |
| `ping`                   | Checks server response.                  | "PONG"                     |
| `set [key] [value]`      | Stores a key-value pair.                 | "OK" if successful         |
| `get [key]`              | Retrieves value of a key.                | Value of the key           |
| `exists [key]`           | Checks if a key exists.                  | '1' for exist, '0' for not |
| `type [key]`             | Identifies value's type for a key.       | Type of the value          |
| `incr [key]`             | Increases key's value by 1.              | New value                  |
| `incrby [key] [amount]`  | Increases key's value by given amount.   | New value                  |
| `del [key]`              | Deletes a key's value.                   | -                          |
| `flushdb`                | Clears all database data.                | -                          |
| `expire [key] [seconds]` | Sets a key to expire after a given time. | -                          |
| `ttl [key]`              | Checks remaining time-to-live of a key.  | Time left in seconds       |

When the TTL elapses, the key is automatically deleted as if using the `DEL` command. The expiration time can be set in seconds or milliseconds precision, with a resolution of _1 millisecond_. The information about expirations is replicated and persisted on disk, so the expiration date of a key is saved even if the Redis server is stopped.

Example:

```txt
> set counter 100
OK
> expire counter 5
(integer) 1
> get counter
100
... wait ...
> get counter
(nil)
```

## Access a Redis cache from a client

Retrieve the required information from the Azure portal under **Settings > Access Keys**:

- Host name: The public Internet address of your cache, created using the cache name (e.g., `sportsresults.redis.cache.windows.net`).
- Port: The port number for the Redis cache.
- Access key: Acts as a password for the cache, with both primary and secondary keys available for use.

```cs
var connectionString = "[cache-name].redis.cache.windows.net:6380,password=[password-here],ssl=True,abortConnect=False";
var redisConnection = ConnectionMultiplexer.Connect(connectionString); // needs to be kept alive
IDatabase db = redisConnection.GetDatabase(); // lightweight object

var success = db.StringSet("favorite:flavor", "i-love-rocky-road");
var value = db.StringGet("favorite:flavor");

redisConnection.Dispose();
```

### Getting and Setting binary values

- Keys are of `RedisKey` type. This class has implicit conversions to and from both `string` and `byte[]`, allowing both text and binary keys to be used without any complication.
- Values are of `RedisValue` type. As with `RedisKey`, there are implicit conversions in place to allow you to pass `string` or `byte[]`
- Result is of `RedisResult` type. Properties: `Type` ("STRING", "INTEGER", etc) and `IsNull`. Use `.ToString()` to get the value.

```cs
byte[] key = ...;
byte[] value = db.StringGet(key);

db.StringSet(key, value);
```

### Common operations

| Method              | Description                                                                                                                  |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `CreateBatch`       | Creates a group of operations that will be sent to the server as a single unit, but not necessarily processed as a unit.     |
| `CreateTransaction` | Creates a group of operations that will be sent to the server as a single unit and processed on the server as a single unit. |
| `KeyDelete`         | Delete the key/value.                                                                                                        |
| `KeyExists`         | Returns whether the given key exists in cache.                                                                               |
| `KeyExpire`         | Sets a time-to-live (TTL) expiration on a key.                                                                               |
| `KeyRename`         | Renames a key.                                                                                                               |
| `KeyTimeToLive`     | Returns the TTL for a key.                                                                                                   |
| `KeyType`           | Returns the string representation of the type of the value stored at key: string, list, set, zset, and hash.                 |

### Executing commands

```cs
var result = db.Execute("ping"); // PONG
```

```cs
var result = await db.ExecuteAsync("client", "list"); // This would output all the connected clients
// Type = BulkString
// Result = id=9469 addr=16.183.122.154:54961 fd=18 name=DESKTOP-AAAAAA age=0 idle=0 flags=N db=0 sub=1 psub=0 multi=-1 qbuf=0 qbuf-free=0 obl=0 oll=0 omem=0 ow=0 owmem=0 events=r cmd=subscribe numops=5
// id=9470 addr=16.183.122.155:54967 fd=13 name=DESKTOP-BBBBBB age=0 idle=0 flags=N db=0 sub=0 psub=0 multi=-1 qbuf=0 qbuf-free=32768 obl=0 oll=0 omem=0 ow=0 owmem=0 events=r cmd=client numops=17
```

### Storing more complex values

```cs
string serializedValue = Newtonsoft.Json.JsonConvert.SerializeObject(obj);
bool added = db.StringSet("key", serializedValue);

var result = db.StringGet("key");
var stat = Newtonsoft.Json.JsonConvert.DeserializeObject<MyCustomClass>(result.ToString());
```
