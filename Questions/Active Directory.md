# Active Directory

Question: You are creating an internal portal for staff members to access confidential financial reports. The portal uses Azure AD for user authentication. The staff accounts are currently on Azure AD Basic licenses. You are tasked with setting up multi-factor authentication (MFA) for a specific team of staff members. Which two steps should you take?

- [ ] Activate application proxy in Azure AD.
- [ ] Set up the portal to utilize Azure AD business-to-consumer (B2C).
- [ ] Enable security defaults in Azure AD.
- [x] Upgrade the staff accounts to Azure AD Premium P1.
- [x] Establish a new conditional access policy in Azure AD.

Answer: Conditional access policies require Azure AD Premium P1 licenses.  
Security defaults enable MFA for **ALL** users, which does not meat requirenments for specific staff members.

---

Question: You are tasked with providing secure remote access to an on-premises application for your organization's employees. Which action should you perform?

- [x] Activate application proxy in Azure AD.
- [ ] Upgrade the staff accounts to Azure AD Premium P1.
- [ ] Establish a new conditional access policy in Azure AD.
- [ ] Set up the portal to utilize Azure AD business-to-consumer (B2C).

Answer: The correct action is to activate application proxy in Azure AD. Azure AD Application Proxy provides secure remote access to on-premises applications.

---

Question: Your organization is planning to collaborate with a partner company on a project. You need to provide the partner company's users with access to certain applications in your Azure AD. Which action should you perform?

- [ ] Activate application proxy in Azure AD.
- [ ] Upgrade the staff accounts to Azure AD Premium P1.
- [ ] Establish a new conditional access policy in Azure AD.
- [x] Configure the applications to use Azure AD business-to-business (B2B).

Answer: The correct action is to configure the applications to use Azure AD business-to-business (B2B). Azure AD B2B allows you to share your company's applications with external users in a secure manner.

---

Question: As an administrator for a startup utilizing Azure AD for identity and access management, you're tasked with implementing mandatory multi-factor authentication for all users. What is the most appropriate step to take?

- [ ] Implement Azure AD business-to-consumer (B2C).
- [ ] Upgrade to Azure AD Premium P1 for all user accounts.
- [ ] Establish a new conditional access policy in Azure AD.
- [x] Activate security defaults in Azure AD.
- [ ] Set up an application proxy in Azure AD.

Answer: The most appropriate step is to activate security defaults in Azure AD. This feature provides a basic level of security, including mandatory multi-factor authentication for all users, at no additional cost. The other options, while useful in certain scenarios, do not directly address the requirement of enabling mandatory multi-factor authentication for all users.

---

Question: Your organization uses Azure AD for identity management. You want to implement a policy that triggers multi-factor authentication (MFA) when a sign-in is deemed risky. Which two actions should you perform?

- [ ] Activate application proxy in Azure AD.
- [ ] Upgrade the staff accounts to Azure AD Premium P1.
- [x] Upgrade the staff accounts to Azure AD Premium P2.
- [x] Establish a new risk-based conditional access policy in Azure AD.
- [ ] Enable security defaults in Azure AD.
- [ ] Configure the applications to use Azure AD business-to-business (B2B).

Answer: The correct actions are to upgrade the staff accounts to Azure AD Premium P2 and establish a new risk-based conditional access policy in Azure AD. Risk-based policies require access to Azure AD Identity Protection, which is an Azure AD Premium P2 feature.

---

Question: In Azure AD, what happens to Conditional Access policies when the licenses required for them expire?

- [ ] The policies are automatically disabled.
- [ ] The policies are automatically deleted.
- [x] The policies remain active and can be viewed and deleted, but no longer updated.
- [ ] Nothing changes for existing conditional policies.
- [ ] The policies are automatically replaced with default security policies.

Answer: When licenses required for Conditional Access expire, the policies aren't automatically disabled or deleted. They remain active and can be viewed and deleted, but they can no longer be updated.

---
