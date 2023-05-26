# Azure Cache for Redis

Question: What is the lowest service tier of Azure Cache for Redis recommended for use in production scenarios?

- [ ] Basic
- [x] Standard
- [ ] Premium

Answer: The standard tier is the lowest tier that offers replication，which is always recommended for production scenarios.

Question: Which of the following represents the expire time resolution when applying a time to live (TTL) to a key in Redis?

- [x] 1-millisecond
- [ ] 10-milliseconds
- [ ] seconds or milliseconds

Answer: The expire time resolution is always 1 millisecond.  
Expirations can be set using seconds or milliseconds precision, but the expire time resolution is always 1 millisecond.
