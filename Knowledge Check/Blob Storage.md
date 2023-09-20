# Blob Storage

md: Describe the hierarchy of Blob Storage?

<!-- Storage Account -> Container -> Blob -->

---

md: How to change SKU of storage account?

<!-- You cannot change type, but you can seemlessly change redundancy type. To change storage account copy the contents to another account -->

---

md: Describe redundancy types and when to use each?

- LRS
- ZRS
- GRS
- GZRS
- GRS-RA
- GZRS-RA

<!-- LRS: if you can reconstruct data, have government restrictions; ZRS: write is successful when all zones comfirm, reccomended for Azure FIles; GRS: LRS+async copy; GZRS: ZRS+async copy; RA: R to https://{accountName}-secondary.<url> -->

---

md: Describe failover and its alternatives? What are limitations?

<!-- manual, swaps primary and secondary region; Alt: Copy data; No Azure Files and BlockBlobStorage -->

---

md: When to choose BlobStorage, BlockBlobStorage, FileStorage, StorageV1, StorageV2?

<!-- BlockStorage: simple; BlockBlobStorage: speed, StorageV1: high workload apps; StorageV2: recommended -->
