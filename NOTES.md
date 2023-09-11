# Notes

## Exam strategies

[How to take a Microsoft Exam](https://github.com/mscerts/hub/blob/main/The%20Ultimate%20Certification%20Guide/6.%20How%20to%20take%20Microsoft%20exams.md)

## Breadcrumb trail

If question requires to figure out the order of commands, look for hints in code: for example Step X is using a variable initialized in Step Y, it means the order is Y, X.

## Learn your craft

You should be able to not only learn commands, but also explain them - what they do, what they require. Example: To mount an Azure File Share to an Azure Container Instance, you need the Storage Account Key.

## Powershell

All commands use `AZ<COMMAND>` format, not `Azure<COMMAND>`. Examples: `New-AzKeyVault`, `Add-AzKeyVaultCertificate`. Usually create operations are `New-Az<Service>`, update operations are `Set-Az<Service>`.

## Save for later

All questions you have doubts on, **mark them for review** as you can't go back to them if you don't. **If you go to the bathroom / take a break, you cannot go back to previous questions!!!**

## Encryption

Everything is encrypted at rest with 256-bit AES, and in-transit with TLS. You can use your own encryption - provided by Azure (they manage it), or third party (you manage it).

## Random thoughts

- Dashes are not allowed in account names. Probably because MS uses them to differentiate between primary `<account>.<url>` and secondary `<account>-secondary.<url>`.
- Bet on Azure Portal if a question asks "What is the easiest way to achive X?" or "From where you can manage Y?" (except for automations). Not always true, but at least it's something.
- You need to use some sort of storage for something (app service web app, container)? Then you'll need storage account and storage account key.
- `az ? deployment` or `az webapp` means you are using [App Service](./Topics/App%20Service.md) (needs App Service Account). `az containerapp` means you are using Container Apps. `az container` means Container Instance. May sound obvious, but I want to point that out.
- `az acr create` creates registry, doesn't run anything. To run docker image use `az acr build` (quick task)
