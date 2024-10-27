# Azure CDN

## Develop for storage on CDNs

A content delivery network (CDN) is a distributed network of servers that can efficiently deliver web content to users. CDNs store cached content on edge servers in point-of-presence (POP) locations that are close to end users, to minimize latency.

### Explore Azure Content Delivery Networks

Azure Content Delivery Network (CDN) offers developers a global solution for rapidly delivering high-bandwidth content to users. It caches content at strategically placed physical nodes across the world. Azure CDN can also accelerate dynamic content, which can't be cached, by using various network optimizations using CDN POPs. For example, route optimization to bypass Border Gateway Protocol (BGP).

The benefits of using Azure CDN to deliver web site assets include:

- Better performance and improved user experience for end users, especially when using applications in which multiple round-trips are required to load content.
- Large scaling to better handle instantaneous high loads, such as the start of a product launch event.
- Distribution of user requests and serving of content directly from edge servers so that less traffic is sent to the origin server.

#### How Azure Content Delivery Network works

![Image showing how Azure CDN operates, the steps shown in the image are explained below.](https://learn.microsoft.com/en-us/training/wwl-azure/develop-for-storage-cdns/media/azure-content-delivery-network.png)

1. A user (Alice) requests a file (also called an asset) by using a URL with a special domain name, such as `<endpoint name>.azureedge.net`. This name can be an endpoint hostname or a custom domain. The DNS routes the request to the best performing POP location, which is usually the POP that is geographically closest to the user.

1. If no edge servers in the POP have the file in their cache, the POP requests the file from the origin server. The origin server can be an Azure Web App, Azure Cloud Service, Azure Storage account, or any publicly accessible web server.

1. The origin server returns the file to an edge server in the POP.

1. An edge server in the POP caches the file and returns the file to the original requestor (Alice). The file remains cached on the edge server in the POP until the time-to-live (TTL) specified by its HTTP headers expires. If the origin server didn't specify a TTL, the default TTL is seven days.

1. Additional users can then request the same file by using the same URL that Alice used, and can also be directed to the same POP.

1. If the TTL for the file hasn't expired, the POP edge server returns the file directly from the cache. This process results in a faster, more responsive user experience.

#### Requirements

- To use Azure Content Delivery Network, you must own at least one Azure subscription.
- You also need to create a content delivery network profile, which is a collection of content delivery network endpoints. Every content delivery network endpoint is a specific configuration which users can customize with required content delivery behavior and access. To organize your content delivery network endpoints by internet domain, web application, or some other criteria, you can use multiple profiles.
- Since [Azure Content Delivery Network pricing](https://azure.microsoft.com/pricing/details/cdn/) gets applied at the content delivery network profile level. If you want to use a mix of pricing tiers you must create multiple content delivery network profiles.

##### Limitations

Each Azure subscription has default limits for the following resources:

- The number of CDN profiles that can be created.
- The number of endpoints that can be created in a CDN profile.
- The number of custom domains that can be mapped to an endpoint.

For more information about CDN subscription limits, visit [CDN limits](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/azure-subscription-service-limits).

#### Azure CDN features

Azure CDN offers the following key features:

- Dynamic site acceleration
- CDN caching rules
- HTTPS custom domain support
- Azure diagnostics logs
- File compression
- Geo-filtering

For a complete list of features that each Azure CDN product supports, visit [Compare Azure CDN product features](https://learn.microsoft.com/en-us/azure/cdn/cdn-features).

### Control cache behavior on Azure Content Delivery Networks

Controlling when content is refreshed is important for any caching mechanism. A cached resource might be out-of-date or stale (compared to the corresponding resource on the origin server).

#### Controlling caching behavior

You can use content delivery network caching rules to set or modify default cache expiration behavior. These caching rules can either be global or with custom conditions. Azure Content Delivery Network offers two ways to control how your files get cached:

- **Caching rules:** Azure Content Delivery Network provides global and custom types of caching rules.

  - Global caching rules - You can set one global caching rule for each endpoint in your profile, which affects all requests to the endpoint. The global caching rule overrides any HTTP cache-directive headers, if set.
  - Custom caching rules - You can set one or more custom caching rules for each endpoint in your profile. Custom caching rules match specific paths and file extensions, get processed in order, and override the global caching rule, if set.

- **Query string caching:** You can adjust how the Azure content delivery network treats caching for requests with query strings. If the file isn't cacheable, the query string caching setting has no effect, based on caching rules and content delivery network default behaviors.

:information_source: Caching rules are available only for **Azure CDN Standard from Edgio** profiles. For **Azure CDN from Microsoft** profiles, you must use the [Standard rules engine](https://learn.microsoft.com/en-us/azure/cdn/cdn-standard-rules-engine-reference) For **Azure CDN Premium from Edgio** profiles, you must use the [Edgio Premium rules engine](https://learn.microsoft.com/en-us/azure/cdn/cdn-verizon-premium-rules-engine) in the **Manage** portal for similar functionality.

#### Standard rules engine

In the Standard rules engine for Azure Content Delivery Network, a rule consists of one or more match conditions and an action. The rules engine is designed to be the final authority on how specific types of requests get processed by Standard Azure Content Delivery Network.

Common uses for the rules:

- Override or define a custom cache policy.
- Redirect requests.
- Modify HTTP request and response headers.

A rule consists of one or more match conditions and an action. The first part of a rule is a match condition or set of match conditions. In the Standard rules engine for Azure Content Delivery Network, each rule can have up to four match conditions. A match condition identifies specific types of requests for which defined actions are performed. If you use multiple match conditions, the match conditions are grouped together by using `AND` logic. Following is a table highlighting a few of the available match options.

| Match condition | Description                                                                                            |
| --------------- | ------------------------------------------------------------------------------------------------------ |
| Device type     | Identifies requests made from a mobile device or desktop device.                                       |
| HTTP version    | Identifies requests based on the HTTP version of the request.                                          |
| Request cookies | Identifies requests based on cookie information in the incoming request.                               |
| Post argument   | Identifies requests based on arguments defined for the POST request method that's used in the request. |
| Query string    | Identifies requests that contain a specific query string parameter, set to match a specific pattern.   |

For a complete list of match conditions, visit [Match conditions in the Standard rules engine for Azure Content Delivery Network](https://learn.microsoft.com/en-us/azure/cdn/cdn-standard-rules-engine-match-conditions)

#### Caching and time to live

Files from publicly accessible origin web servers can be cached in Azure Content Delivery Network until their time to live (TTL) elapses. The TTL gets determined by the `Cache-Control` header in the HTTP response from the origin server. This article describes how to set `Cache-Control` headers for the Web Apps feature of Microsoft Azure App Service, Azure Cloud Services, ASP.NET applications, and Internet Information Services (IIS) sites, all of which are configured similarly. You can set the `Cache-Control` header either by using configuration files or programmatically.

If you don't set a TTL on a file, Azure CDN sets a default value. However, this default might be overridden if you set up caching rules in Azure. Default TTL values are as follows:

- Generalized web delivery optimizations: seven days
- Large file optimizations: one day
- Media streaming optimizations: one year

#### Content updating

Azure Content Delivery Network edge nodes cache contents until the content's time to live (TTL) expires. After the TTL expires, when a client makes a request for the content from the edge node, the edge node will retrieve a new updated copy of the content to serve to the client. Then the refreshed content in cache of the edge node.

The best practice to make sure your users always obtain the latest copy of your assets is to version your assets for each update and publish them as new URLs. Content delivery network will immediately retrieve the new assets for the next client requests. Sometimes you might wish to purge cached content from all edge nodes and force them all to retrieve new updated assets. The reason might be due to updates to your web application, or to quickly update assets that contain incorrect information.

You can purge content in several ways.

- On an endpoint by endpoint basis, or all endpoints simultaneously should you want to update everything on your CDN at once.
- Specify a file, by including the path to that file or all assets on the selected endpoint by checking the Purge All checkbox in the Azure portal.
- Based on wildcards (\*) or using the root (/).

The Azure CLI provides a special purge verb that will unpublish cached assets from an endpoint. This is very useful if you have an application scenario where a large amount of data is invalidated and should be updated in the cache. To unpublish assets, you must specify either a file path, a wildcard directory, or both:

```sh
az cdn endpoint purge \
    --content-paths '/css/*' '/js/app.js' \
    --name ContosoEndpoint \
    --profile-name DemoProfile \
    --resource-group ExampleGroup
```

You can also preload assets into an endpoint. This is useful for scenarios where your application creates a large number of assets, and you want to improve the user experience by prepopulating the cache before any actual requests occur:

```sh
az cdn endpoint load \
    --content-paths '/img/*' '/js/module.js' \
    --name ContosoEndpoint \
    --profile-name DemoProfile \
    --resource-group ExampleGroup
```

#### Geo-filtering

Geo-filtering enables you to allow or block content in specific countries/regions, based on the country/region code. In the Azure CDN Standard for Microsoft Tier, you can only allow or block the entire site.

### Interact with Azure Content Delivery Networks by using .NET

You can use the Azure CDN Library for .NET to automate creation and management of CDN profiles and endpoints. Install the [Microsoft.Azure.Management.Cdn.Fluent](https://www.nuget.org/packages/Microsoft.Azure.Management.Cdn.Fluent) directly from the Visual Studio Package Manager console or with the .NET CLI.

In this unit, you see code examples illustrating common actions.

#### Create a CDN client

The following example shows creating a client by using the `CdnManagementClient` class.

```csharp
static void Main(string[] args)
{
    // Create CDN client
    CdnManagementClient cdn = new CdnManagementClient(new TokenCredentials(authResult.AccessToken))
        { SubscriptionId = subscriptionId };
}
```

#### List CDN profiles and endpoints

The following method lists all the profiles and endpoints in our resource group. If the code finds a match for the profile and endpoint names specified in our constants, it notes it for later so we don't try to create duplicates.

```csharp
private static void ListProfilesAndEndpoints(CdnManagementClient cdn)
{
    // List all the CDN profiles in this resource group
    var profileList = cdn.Profiles.ListByResourceGroup(resourceGroupName);
    foreach (Profile p in profileList)
    {
        Console.WriteLine("CDN profile {0}", p.Name);
        if (p.Name.Equals(profileName, StringComparison.OrdinalIgnoreCase))
        {
            // Hey, that's the name of the CDN profile we want to create!
            profileAlreadyExists = true;
        }

        //List all the CDN endpoints on this CDN profile
        Console.WriteLine("Endpoints:");
        var endpointList = cdn.Endpoints.ListByProfile(p.Name, resourceGroupName);
        foreach (Endpoint e in endpointList)
        {
            Console.WriteLine("-{0} ({1})", e.Name, e.HostName);
            if (e.Name.Equals(endpointName, StringComparison.OrdinalIgnoreCase))
            {
                // The unique endpoint name already exists.
                endpointAlreadyExists = true;
            }
        }
        Console.WriteLine();
    }
}
```

#### Create CDN profiles and endpoints

The example below shows creating an Azure CDN profile.

```csharp
private static void CreateCdnProfile(CdnManagementClient cdn)
{
    if (profileAlreadyExists)
    {
        //Check to see if the profile already exists
    }
    else
    {
        //Create the new profile
        ProfileCreateParameters profileParms =
            new ProfileCreateParameters() { Location = resourceLocation, Sku = new Sku(SkuName.StandardVerizon) };
        cdn.Profiles.Create(profileName, profileParms, resourceGroupName);
    }
}
```

Once the profile is created, we create an endpoint.

```csharp
private static void CreateCdnEndpoint(CdnManagementClient cdn)
{
    if (endpointAlreadyExists)
    {
        //Check to see if the endpoint already exists
    }
    else
    {
        //Create the new endpoint
        EndpointCreateParameters endpointParms =
            new EndpointCreateParameters()
            {
                Origins = new List<DeepCreatedOrigin>() { new DeepCreatedOrigin("Contoso", "www.contoso.com") },
                IsHttpAllowed = true,
                IsHttpsAllowed = true,
                Location = resourceLocation
            };
        cdn.Endpoints.Create(endpointName, endpointParms, profileName, resourceGroupName);
    }
}
```

#### Purge an endpoint

A common task that we might want to perform is purging the content in our endpoint.

```csharp
private static void PromptPurgeCdnEndpoint(CdnManagementClient cdn)
{
    if (PromptUser(String.Format("Purge CDN endpoint {0}?", endpointName)))
    {
        Console.WriteLine("Purging endpoint. Please wait...");
        cdn.Endpoints.PurgeContent(resourceGroupName, profileName, endpointName, new List<string>() { "/*" });
        Console.WriteLine("Done.");
        Console.WriteLine();
    }
}
```
