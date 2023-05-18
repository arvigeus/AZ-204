# Blob Storage

Question: Which of the following types of blobs are used to store virtual hard drive files?

- [ ] Block blobs
- [ ] Append blobs
- [x] Page blobs

Answer: Page blobs store random access files up to 8 TB in size, and are used to store virtual hard drive (VHD) files and serve as disks for Azure virtual machines.

Question: Which of the following types of storage accounts is recommended for most scenarios using Azure Storage?  
Append blobs are optimized for data append operations.  
Block blobs are made up of blocks of data that can be managed individually.

- [x] General-purpose v2
- [ ] General-purpose v1
- [ ] FileStorage

Answer: This supports blobs, files, queues, and tables. It's recommended for most scenarios using Azure Storage.  
FileStorage: This is recommended for enterprise or high-performance scale applications and won't cover most scenarios.  
General-purpose-v1 is a legacy account type.
