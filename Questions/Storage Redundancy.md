# Storage Redundancy

Question: Your company operates in a region with stringent data governance laws that restrict the replication of data outside the country borders. Their core application requires a large volume of data storage but this data can be regenerated easily if any data loss occurs. Recently, they have decided to migrate their application to the Azure cloud and are considering their options for storage redundancy, considering costs.

1. What type of storage redundancy should your company consider for their application? Why?
1. In their context, what could be a potential issue if they choose geo-redundant storage (GRS) over the recommended storage type?
1. Considering their data governance requirements, how would the concept of paired regions apply or not apply in their scenario?

Answer:

1. Your company should consider using Locally Redundant Storage (LRS). LRS would be suitable as it allows data replication within the same region which meets the company's data governance requirements. Also, since the data can be regenerated easily in the case of data loss, LRS would be a cost-effective choice.
1. If they choose Geo-Redundant Storage (GRS), they might violate data governance laws because GRS replicates data to a secondary, geographically distant region, which might be in a different country.
1. Paired regions don't apply in this scenario because the data can't be replicated outside the country or region due to data governance requirements.

---

Question: Your company's infrastructure on Azure uses unmanaged disks for their applications. They initially chose Geo-Redundant Storage (GRS) for its perceived benefits of increased protection. However, they are starting to experience consistency issues and are considering a switch to a different redundancy option.

1. What could be causing the consistency issues your company is experiencing with their current storage setup?
1. What storage redundancy option should your company consider switching to for their unmanaged disks, and why?
1. What are the potential trade-offs your company might face with this new redundancy option compared to GRS?

Answer:

1. The consistency issues your company is experiencing could be due to the use of GRS with unmanaged disks. This setup is not recommended as it may lead to potential issues with consistency due to the asynchronous nature of GRS.
1. Your company should consider switching to Locally Redundant Storage (LRS) for their unmanaged disks. LRS is recommended because it avoids the potential consistency issues seen with GRS when used with unmanaged disks.
1. The trade-off with LRS is that data is not replicated in a secondary, geographically distant region as it is with GRS. Therefore, in the event of a major disaster that affects the entire primary region, your company might lose their data.

---

Question: Your company has an application that generates a significant amount of log data. This log data can be reproduced easily and is not subject to stringent data governance laws. However, your company wants to ensure that the data loss possibility is minimized while keeping costs controlled.

1. What Azure storage redundancy option would you recommend to your company for storing their log data and why?
1. How would the suggested redundancy type handle data loss scenarios?
1. If your company decided to go for Geo-Redundant Storage instead, what potential issues might they encounter?

Answer:

1. For your company's scenario, Locally Redundant Storage (LRS) would be recommended. LRS would ensure three copies of their data exist in the same data center, providing durability and redundancy. Since the log data can be easily reproduced, this option would be cost-effective as well.
1. In a data loss scenario, LRS would provide resilience by having three copies of the data. If one copy fails, the data can still be accessed from the other copies.
1. If your company opted for Geo-Redundant Storage, it would increase their costs. In addition, they may encounter potential consistency issues since GRS replicates data asynchronously to a secondary region, and in the event of a failover, the data in the secondary region might be slightly out of date compared to the primary region.

---

Question: Your company operates a high-traffic application hosted on Azure. Their service level agreement with their clients requires a high level of data availability and redundancy. Their data is not restricted by any data governance law, and data loss is something that cannot be afforded.

1. What type of Azure storage redundancy should your company consider to meet their high data availability and redundancy requirements?
1. How does the chosen storage redundancy option ensure high data availability and protect against data loss?
1. What potential issues might your company encounter if they opted for Locally Redundant Storage instead of the recommended option?

Answer:

1. Your company should consider using Zone-Redundant Storage (ZRS). ZRS would be a great fit because it synchronously replicates data across different availability zones within the same region, providing high availability and durability.
1. ZRS ensures high data availability by maintaining three copies of the data across different availability zones in the same region. In the event of a zone failure, ZRS can still serve data from the remaining zones, minimizing the risk of data loss.
1. If your company opted for Locally Redundant Storage (LRS), they would have a higher risk of data loss and downtime. LRS replicates data within a single data center, so if that data center were to go offline due to a catastrophic event, all data could be lost.

---

Question: You work in a healthcare company that has stringent data regulations, requiring them to maintain patient data within the same region. They run a critical application on Azure, which can't afford any downtime or data loss. The application generates patient records that can't be recreated.

1. What type of Azure storage redundancy should your company consider to meet their high data availability and data governance requirements?
1. How does the recommended storage redundancy option work in terms of ensuring data resilience and adherence to data governance rules?
1. What might be the disadvantages for your company if they decided to choose Geo-Redundant Storage instead?

Answer:

1. Your company should consider Zone-Redundant Storage (ZRS). This option would ensure high data availability and also comply with their data governance requirements, as ZRS keeps all data within the same region.
1. ZRS replicates data across different availability zones within the same region. This means if one zone experiences issues, the data remains accessible from the other zones. As ZRS doesn't replicate data to a different region, it satisfies your company's data governance rules.
1. If your company chose Geo-Redundant Storage (GRS), they could potentially violate their data governance requirements. GRS replicates data to a secondary region, which might not be permissible for Epsilon's patient data. Also, GRS performs asynchronous replication, which could lead to potential data loss if a failure occurs before data is replicated.

---

Question: Your company operates an application that generates non-critical, easily reproducible data. They operate within a region with multiple Availability Zones. They wish to maintain a balance between data redundancy and cost-effectiveness.

1. What type of Azure storage redundancy should your company consider for their requirements?
1. How does the recommended storage redundancy option strike a balance between data redundancy and cost?
1. If your company decided to choose Zone-Redundant Storage, what could be the possible implications in terms of cost and data resilience?

Answer:

1. Your company should consider using Locally Redundant Storage (LRS). Since their data is easily reproducible and non-critical, LRS would provide sufficient data redundancy at a lower cost compared to ZRS.
1. LRS provides three copies of data within the same data center, providing adequate redundancy for your company's needs. As it doesn't replicate data across multiple zones, LRS is more cost-effective than ZRS.
1. If your company chose Zone-Redundant Storage, they would be paying for higher data redundancy that might be unnecessary given their data is non-critical and easily reproducible. This would lead to higher costs without substantial benefits in terms of data resilience.

---

Question: Your company is a global e-commerce giant, running a large-scale application on Azure that serves users around the world. They store massive amounts of transactional data that can't be easily regenerated and is crucial for their business. Their operations aren't restricted by any specific data governance regulations.

1. What type of Azure storage redundancy should your company consider for their high data availability and durability requirements?
1. How does the recommended storage redundancy option ensure high data availability and resilience to data loss?
1. What potential drawbacks could there be if your company chooses Locally Redundant Storage instead?

Answer:

1. Your company should consider using Geo-Redundant Storage (GRS) because it provides the highest level of data resilience available in Azure. Given the crucial nature of their data, it's essential that they have a high level of redundancy.
1. GRS replicates data to a secondary, geographically distant Azure region, which ensures data availability even in the case of a complete regional outage. In addition, GRS maintains six copies of the data (three in the primary region and three in the secondary region), which provides a high level of data durability and protection against data loss.
1. If your company opted for Locally Redundant Storage (LRS), they would risk losing all their data in the event of a catastrophic failure at the data center or a disaster that impacts the entire region.

---

Question: What options are available for replicating your data only in the primary region?

- [x] Locally redundant storage (LRS)
- [x] Zone-redundant storage (ZRS)
- [ ] Geo-redundant storage (GRS)
- [ ] Geo-zone-redundant storage (GZRS)

Answer: GRS and GZRS copies your data asynchronously to secondary region.

---

Question: Beta Enterprises operates an application in Azure that handles sensitive data. Due to data residency laws, they cannot replicate their data outside of their country, but they still want to maintain high availability within their region. In addition, they require read access to their data even if one of the zones in their region goes down. Which storage redundancy option is most suitable for Beta Enterprises?

- [ ] Locally Redundant Storage (LRS)
- [ ] Geo-Redundant Storage (GRS-RA)
- [ ] Geo-Zone-Redundant Storage (GZRS)
- [ ] Geo-Redundant Storage with Read Access (GRS-RA)
- [ ] Geo-Zone-Redundant Storage with Read Access (GZRS-RA)
- [x] Zone-Redundant Storage (ZRS)

Answer: ZRS is the best choice for Beta Enterprises as it keeps the data within the same region (complying with data residency laws), but also replicates it across different availability zones for high availability. If one zone goes down, the data is still accessible from the other zones. GRS-RA and GZRS-RA wouldn't comply with Beta's data residency requirements because they replicate data to a secondary region which could be outside of their country. LRS would comply with the data residency laws, but it wouldn't provide the desired level of availability as it only maintains replicas within a single data center.

---

Question: Gamma Corp runs an application that needs to read data from a secondary location for performance reasons. They are not restricted by data residency regulations, and they want to ensure their data is highly available. Which of the following storage redundancy should Gamma Corp consider?

- [ ] Locally Redundant Storage (LRS)
- [ ] Geo-Zone-Redundant Storage (GZRS)
- [x] Geo-Zone-Redundant Storage with Read Access (GZRS-RA)
- [ ] Zone-Redundant Storage (ZRS)

Answer: GZRS-RA would best serve Gamma Corp's needs as it not only replicates data across zones in the primary region (for high availability) and to a secondary region (for disaster recovery), but it also provides read access to the secondary region (for performance). GRS does not provide read access to the secondary region, while ZRS and LRS do not replicate data to a secondary region at all.

---

Question: ViralTrendz Inc. operates a popular platform for sharing short videos (think TikTok on a dose of creative steroids) and stores users' videos in Azure with Geo-Redundant Storage with Read Access (GRS-RA). Suddenly, day-to-day operations are disturbed by a full-blown zombie outbreak in the region of their primary storage. What will happen to users who rush to the app to save their beloved dance-offs and lip-sync masterpieces in this scenario?

- [ ] Users will not be able to access their videos until the zombie outbreak is resolved.
- [ ] Users will be able to access their videos as usual because the data has been automatically failed over to the secondary region.
- [ ] Users will not be able to access their videos because the secondary region only allows read access during normal operations.
- [x] Users will experience a short period of downtime until a manual failover is performed by ViralTrendz Inc.
- [ ] The biggest disaster is ViralTrendz Inc. choosing GRS-RA for this scenario, and now they will have to face angry mob of users as soon as society goes back to normal (if people working there survive)

Answer: With GRS-RA, data is replicated to a secondary region and users have read access to the replicated data in the secondary region during normal operations. However, in the event of an outage at the primary region, a manual failover to the secondary region needs to be performed by the company. Until this failover is performed, users might experience a short period of downtime.

"Users will not be able to access their videos until the zombie outbreak is resolved." is incorrect because users will eventually be able to access their videos after a manual failover is performed.  
"Users will be able to access their videos as usual because the data has been automatically failed over to the secondary region." is incorrect because automatic failover does not occur with GRS-RA; a manual failover is required.  
"Users will not be able to access their videos because the secondary region only allows read access during normal operations." is incorrect because while the secondary region does provide read access during normal operations, it also serves as the failover region where both read and write operations can be performed after a manual failover.  
"Choosing GRS-RA was a mistake" is incorrect because other servers in the same zone might get compromised as well.

---

Question: Facebook, our daily scroll-fest, is powered by Azure's Zone-Redundant Storage (ZRS). However, in an act of divine intervention, the Almighty, having grown disgruntled at humanity's fixation with endless scrolling, decides to express His displeasure. A bolt from the blue strikes and burns down their data center in San Francisco! In this divinely dramatic situation, what could be the fate of Facebook's legions of users, thumbing their way to oblivion? Will they continue to share, like, and comment, or are they due for a surprise digital detox?

- [ ] A forced hiatus on users' social media activities.
- [x] Life on Facebook continues as if the Almighty's intervention was a mere blip. Users will scroll on, undeterred.
- [ ] Users will find themselves digitally marooned, as the remaining zones, while well-intentioned, buckle under the data weight.
- [ ] A brief moment of digital silence until Facebook Inc. orchestrates a failover to the unaffected zones.
- [ ] It turns out, the real misstep might have been Facebook's misguided choice of ZRS for this scenario.

Answer: ZRS ensures data is spread across several zones in a region. If one zone goes offline, the others carry on. So, our Facebook loyalists will scroll on, blissfully oblivious to the celestial drama. The other options paint more drastic scenarios than ZRS - a robust choice - would allow.  
"A forced hiatus on their social media activities." is not quite accurate because even with one data center under the weather (literally), the remaining zones will keep the network alive.  
"The remaining zones will buckle under the data weight" doesn't take into account the resilience of ZRS - the unaffected zones are fully equipped to manage the load.  
"A brief moment of digital silence until Facebook Inc. orchestrates a failover to the unaffected zones." isn't the case here, as ZRS doesn't require a manual failover.  
"Facebook's misguided choice of ZRS". is incorrect, because ZRS can protect against such occurrences.

---

Question: A company is using Azure Storage services for their data. They are currently using GRS for their data storage and replication. The company is planning a strategy to enhance disaster recovery capabilities and is considering moving to GZRS. What would be the main advantage for the company to switch from GRS to GZRS?

- [ ] The data would be replicated asynchronously to the secondary region after a write operation is committed.
- [ ] The data would be copied synchronously three times within the primary region.
- [x] The data would be copied across three Azure availability zones in the primary region, improving disaster resilience.
- [ ] The durability of the storage resources would increase to at least 99.99999999999999% (16 9's) over a given year.

Answer: The data would be copied across three Azure availability zones in the primary region, improving disaster resilience.
Explanation: Both GRS and GZRS provide high durability, and both perform synchronous and asynchronous replication. However, GZRS improves resilience by copying data across three Azure availability zones in the primary region, which is beneficial for disaster recovery.  
Both GRS and GZRS replicate data asynchronously to a secondary region after a write operation, so this does not provide a unique advantage for GZRS.
Both GRS and GZRS copy data synchronously three times within the primary region, so this characteristic doesn't differentiate GZRS as a better choice for enhancing disaster resilience.
Both GRS and GZRS provide high durability of 99.99999999999999% (16 9's) over a given year. Therefore, switching to GZRS wouldn't increase this durability.

---

Question: Your organization's application uses Azure GZRS storage account. You have observed that read and write operations can still continue even if an availability zone becomes unavailable or unrecoverable. How does GZRS achieve this level of data availability during an outage?

- [ ] By replicating the data synchronously three times within a single physical location in the primary region.
- [ ] By replicating the data asynchronously to a single physical location in a secondary region.
- [ ] By committing a write operation to the primary location before replicating it using LRS.
- [x] By copying the data across three Azure availability zones in the primary region.

Answer: GZRS improves the availability by storing copies of data across three Azure availability zones. So, even if one zone becomes unavailable, the data is still accessible from the other zones.  
GZRS does not replicate the data synchronously three times within a single physical location in the primary region.  
Replicating the data asynchronously to a secondary region is more about ensuring geographical redundancy and doesn't provide immediate availability during an outage in the primary region.  
Committing a write operation to the primary location before replicating it using LRS is part of both GRS and GZRS data flow, and doesn't specifically contribute to data availability during an availability zone outage.

---

Question: Which of the following statements are true about Azure Storage redundancy options: LRS, ZRS, GRS, GRS-RA, GZRS, GZRS-RA? Select all that apply.

- [x] ZRS copies data synchronously across multiple data centers within the primary region.
- [x] GRS copies your data asynchronously to a single physical location in a secondary region.
- [x] GRS-RA allows read access to your data from the secondary region.
- [x] GZRS copies data asynchronously to a secondary region and synchronously across three Azure availability zones in the primary region.
- [ ] GZRS does not replicate data across availability zones in the primary region, only to the secondary.
- [ ] GZRS replicates data across availability zones in the primary and the secondary regions.
- [ ] GRS-RA allows read and write operations from the secondary region.
- [ ] All redundancy options replicate data within the primary region, but LRS and ZRS replicates it synchronously, while GRS and GZRS only use asynchronous replication.
- [ ] GZRS copies your data asynchronously across three Azure availability zones in the secondary region.
- [ ] Both ZRS and GZRS copy your data asynchronously across three Azure availability zones in the primary region.
- [ ] If one of datacenters is temporary offline, ZRS will skip it
- [x] Both GRS and GZRS use LRS in the secondary region
- [x] GRS and GZRS are not always up to date with the primary region
- [ ] During failover, GZRS ensures data is always available
- [ ] Changing redundancy options may cause data loss

Answer:

- **Locally redundant storage (LRS)**: LRS replicates data within a single data center in the primary region. It does not replicate across multiple data centers, so it is incorrect to say that all redundancy options replicate data within the primary region.
- **Zone-redundant storage (ZRS)**: ZRS copies data synchronously across multiple data centers within the primary region. If one of the data centers is temporarily offline, ZRS will not skip it; instead, it ensures that all writes are committed to the durable storage within the zone before being acknowledged to the client.
- **Geo-redundant storage (GRS)**: GRS copies your data asynchronously to a secondary region, making it correct to say that GRS is not always up to date with the primary region. However, GRS does not provide read access to your data from the secondary region, so it's incorrect to say GRS-RA allows read and write operations from the secondary region.
- **Read-access geo-redundant storage (GRS-RA)**: GRS-RA extends GRS by providing read access to the data in the secondary region. It doesn't, however, allow write operations from the secondary region, contrary to the false statement.
- **Geo-zone-redundant storage (GZRS)**: GZRS combines the features of GRS and ZRS. It replicates data asynchronously to a secondary region (like GRS) and synchronously across three Azure availability zones in the primary region (like ZRS). However, it does not replicate data across availability zones in the secondary region, nor does it guarantee data availability during failover.
- **Read-access geo-zone-redundant storage (GZRS-RA)**: GZRS-RA is the read-access variant of GZRS. It provides the same functionality as GZRS, with the added benefit of read access from the secondary region.

Finally, both GRS and GZRS use LRS in the secondary region for data storage, and changing redundancy options could potentially lead to increased cost or affect data durability but it doesn't directly cause data loss.

---

Question: You are an engineer at Omega Corp, a company that heavily relies on Azure services. Currently, the company's Azure Storage account `omegaStorageAccount` within the resource group `omegaRG` is set up with Locally Redundant Storage (LRS) for data replication.

Recently, there have been growing concerns about the company's disaster recovery strategy. The business is expanding rapidly, serving customers globally, leading to a requirement for high availability, even in the event of a regional failure.

Recently, there have been several instances where the Omega Corp's global clients were unable to access the services due to regional disruptions. This is unacceptable for the business. Furthermore, your boss expressed a desire to have a kind of "backup" option in case the usual data access method fails. The system has to be persistent, to keep trying even if they encounter hiccups.

As an engineer at Omega Corp, your first task is to update the storage account to meet these new requirements:

```ps
# Code here
```

Your second task is to modify the existing code below to make use of these changes:

```cs
var accountName = "omegaStorageAccount";
var primaryAccountUri = new Uri($"https://{accountName}.blob.core.windows.net/");

var blobClientOptions = new BlobClientOptions()
{
    // Configure the retry policy to handle high bursts of user activity, transient faults, and network-related issues.
    // Take into consideration the number of retry attempts (5), delay between retries (1s), maximum waiting time (100s),
    // and the smart use of the secondary location.
    Retry = { /* Options */ }
    Retry =
    {
        // Options here
    }
};

var blobServiceClient = new BlobServiceClient(primaryAccountUri, new DefaultAzureCredential(), blobClientOptions);
```

Bonus question: Your boss asks you when all of this will be completed, assuming coding will take you no time.

Answer: To meet the new requirements, we need to change the replication option to Read-access geo-zone-redundant storage (GZRS-RA) to provide high availability and read access in case of regional outage. The Azure CLI command for this is:

```ps
az storage account update --name omegaStorageAccount --resource-group omegaRG --sku Standard_GZRS
```

Given the boss's clear directive to ensure persistent operation even during periods of high user activity, we need to implement retry logic in our application. We'll set the maximum number of retries to `5` and use the `Exponential` retry policy to gradually increase the delay between retries if they are necessary. We'll also set the `GeoRedundantSecondaryUri` property to automatically switch to the secondary URI if the primary is unavailable:

```cs
var accountName = "omegaStorageAccount";
var primaryAccountUri = new Uri($"https://{accountName}.blob.core.windows.net/");
var secondaryAccountUri = new Uri($"https://{accountName}-secondary.blob.core.windows.net/");

var blobClientOptions = new BlobClientOptions()
{
    // Determines the policy for how the client should retry its requests upon encountering transient errors
    Retry =
    {
        MaxRetries = 5,
        Mode = RetryMode.Exponential,
        Delay = TimeSpan.FromSeconds(1),
        MaxDelay = TimeSpan.FromSeconds(60),
        NetworkTimeout = TimeSpan.FromSeconds(100)
    }
    // If the secondary Uri response is 404, it won't be used again, indicating possible propagation delay.
    // Otherwise, retries alternate between primary and secondary Uri.
    GeoRedundantSecondaryUri = secondaryAccountUri
};

var blobServiceClient = new BlobServiceClient(primaryAccountUri, new DefaultAzureCredential(), blobClientOptions);
```

Bonus answer: It takes up to 72 hours for conversion to complete.

---
