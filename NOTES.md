# AZ-204 Exam Study Guide

## Exam Strategies

- **Time Management:** Remember that exam time is limited. Don't dwell on a single question for too long or you might not finish in time.
- **Complexity Matters:** Balance your time based on the complexity of each question.
- **Double-checking:** Familiarity can lead to oversight. Always read the question carefully, especially if it feels too familiar or obvious.
- **Bookmarking:** If uncertain about an answer, mark it for review. Keep in mind that if you take a break, you can't revisit previous questions.
- **Reference:** [How to take a Microsoft Exam](https://github.com/mscerts/hub/blob/main/The%20Ultimate%20Certification%20Guide/6.%20How%20to%20take%20Microsoft%20exams.md)

## Beware of Trick Questions

- **Command Types:** If a command looks familiar, double-check if it's an update or create. If the question mentions "You have X", lean towards "update".
- **Sneaky Conditions:** Some questions may seem straightforward but contain conditions that rule out the obvious answer. Always look for hidden conditions.
- **Language Specifics:** `C#` and `C# script` are different. Treat the latter like a distant relative of JS.
- **Topic Messaging:** If unable to send a message to a topic due to settings, create a new topic in another namespace with the same name.

## Analytical Thinking

- **Breadcrumb Trails:** Look for command order hints in code, like variables initialized in earlier steps.
- **Case Studies:** Read the question first, then skim the case study for relevant info. Avoid drowning in unnecessary details.

## Deep Dive Knowledge

- **Master Commands:** Know your commands and their purpose. For instance, to mount an Azure File Share to an Azure Container Instance, you need the Storage Account Key.
- **Azure Portal:** For questions like "What's the easiest way to do X?" or "Where can you manage Y?", the Azure Portal is often a good bet.

## Specific Command Patterns

- **Powershell Commands:** Use `AZ<COMMAND>` format. For example, creation operations are `New-Az<Service>`, and updates are `Set-Az<Service>`.

## Security and Encryption

- **Soft-delete:** It's a security best practice but can be pricier. If a question prioritizes cost, consider options without soft-delete.
- **Encryption:** Everything is encrypted at rest with 256-bit AES and in-transit with TLS. Azure provides encryption or you can manage it with third-party solutions.

## Permissions and RBAC

- **Scope Clarity:** Ensure you're clear on whether permissions should be for a resource or a resource group. Don't assume resource scope is always correct.

## Miscellaneous Tips

- **Version Control:** In production, pin versions. Prefer detailed versions over generalized ones like `latest`.
- **Account Naming:** Dashes aren't allowed, probably because MS differentiates between primary and secondary with them.
- **Storage:** If something needs storage (like a web app or container), you'll need a storage account and key.
- **Scaling:** Changing SKU is a scale up/down operation, whereas autoscaling refers to scale in/out.
