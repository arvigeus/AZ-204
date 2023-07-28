# Shared Access Signatures

Question: How can you modify or revoke a stored access policy in Azure Storage?

- [x] Call the access control list operation for the resource type to replace the existing policy.
- [x] Delete the stored access policy.
- [x] Rename it by changing the signed identifier.
- [x] Change the expiry time to a value in the past.
- [ ] Regenerate the SAS token.
- [ ] Modify the storage account key.

Answer: Regenerating the SAS token does not affect the stored access policy. The SAS token and the stored access policy are separate entities. The SAS token uses the stored access policy, but regenerating the SAS token does not change the stored access policy.  
Modifying the storage account key does not directly affect the stored access policy. The stored access policy is associated with the storage account, not the key. However, if you regenerate the storage account key that was used to create a SAS token, it will revoke the SAS token, but not the stored access policy itself.

---
