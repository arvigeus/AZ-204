# [Azure Content Delivery Network (CDN)](https://docs.microsoft.com/en-us/azure/cdn/)

Deliver high-bandwidth content quickly by storing it at various global locations. It can also speed up dynamic non-cacheable content, including bypassing the Border Gateway Protocol (BGP) for route optimization. Benefits include improved performance, handling high traffic, and reducing load on the original server by distributing user requests and serving content from edge servers.

How it works: When a user requests a file using a special URL (ex: `<endpoint name>.azureedge.net`), the request is directed to the nearest server location (_Point of Presence - POP_). If the file isn't in the server's cache, it's fetched from the origin server, which could be an Azure service or any public web server. The file is then sent to the user from the POP server and stored there for future requests. This cached file can be quickly sent to any other users requesting the same file, providing a faster user experience. The file stays in the cache until its time-to-live (TTL) expires, defaulting to _7 days_ if not specified.

Requirenments: To use Azure CDN, you need to set up a CDN profile containing CDN endpoints, each with its own content delivery and access settings. You can have multiple profiles for different domains or applications. Pricing is based on the profile level.

[Limitations](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/azure-subscription-service-limits#azure-cdn-limits): the number of profiles (up to 25), endpoints per profile (up to 10), and custom domains per endpoint (up to 25) in each Azure subscription.

Azure CDN offers features like _dynamic site acceleration_, _caching rules_, _HTTPS custom domain support_, _diagnostics logs_, _file compression_, and _geo-filtering_.

## [Caching](https://learn.microsoft.com/en-us/azure/cdn/cdn-how-caching-works)

Caching occurs both at the browser level and on edge servers situated near the user. While browser caches store data for individual users, a CDN utilizes a shared cache that allows a file requested by one user to be cached for others. Dynamic resources that change frequently are optimized through _dynamic site acceleration_ (DSA). Caching can occur at various levels, including web servers, CDNs, and Internet service providers, each managing its resource freshness. Specific cache-directive headers and validators like `ETag` and `Last-Modified` can be used to control caching behavior.

Azure Front Door delivers large files without a cap on file size.

### Time to live

Content is cached based on the `Time to Live` (TTL), which is determined by the `Cache-Control` header from the origin server. If the content's age is less than the TTL, it's considered fresh and delivered to the client directly from the cache. If it's older, it's deemed stale, and a fresh copy is fetched from the server. If no TTL is set, Azure CDN assigns a default TTL value, which can be further modified by caching rules. Default TTL varies according to the type of optimization:

- Generalized web delivery optimizations: 7 days
- Large file optimizations: 1 day
- Media streaming optimizations: one year

### [Caching Rules](https://learn.microsoft.com/en-us/azure/cdn/cdn-caching-rules)

Caching rules provide configuration options for your content at the endpoint level. The options vary depending on the selected tier.

#### Standard Tier Caching Rules

- **Global caching rules**: Apply to all content from a specified endpoint.
- **Custom caching rules**: Specific to paths and file extensions.
- **Query string caching**: Azure CDN's response to a query string, which doesn't affect uncachable files.

The caching behavior for query strings can be adjusted in the `Caching rules > Endpoint pane`:

- **Ignore query strings** ⏺️: The CDN Point of Presence (POP) passes the request and query strings to the origin server on the first request and caches the asset. Subsequent requests for the same asset ignore query strings until the TTL expires.
- **Bypass caching for query strings**: Each query request from the client is passed directly to the origin server with no caching.
- **Cache every unique URL**: When a client generates a unique URL, that URL is passed back to the origin server, and the response is cached with its own TTL. This method is inefficient for unique URL requests as the cache-hit ratio becomes low.

Other tiers of Azure CDN provide additional configuration options.

Azure CDN configuration propagation times:

- Azure CDN Standard (Akamai): ~1min.
- Azure CDN Standard (Verizon): ~10mins.

### [Caching behavior settings](https://learn.microsoft.com/en-us/azure/cdn/cdn-caching-rules#caching-behavior-settings)

- **Bypass cache**: Don't cache and ignore origin-provided cache-directive headers.
- **Override**: Ignore origin-provided cache duration; use the provided cache duration instead. This setting doesn't override cache-control: no-cache.
- **Set if missing**: Honor origin-provided cache-directive headers, if they exist; otherwise, use the provided cache duration.

Expiry rules:

- Override/Set if Missing: 0 secs to 366 days. 0 secs requires origin revalidation.
- Bypass: Auto-set to 0 secs, unmodifiable.

### [Cache purging](https://learn.microsoft.com/en-us/azure/cdn/cdn-purge-endpoint)

To ensure users always get the latest version of your content, you can either version your assets by giving them new URLs with each update or purge the old content from the servers. Versioning lets the CDN fetch new assets right away, while purging forces all servers to get updated content. This might be needed for web app updates or quick corrections. Purging only removes content from the main servers, not from places like local browser caches. To make sure users get the latest file, you can give it a unique name each time you update it or use special caching techniques.

Files that are cached before a rule change maintain their origin cache duration setting. To reset their cache durations, you must purge the file.

Deleting and recreating a CDN endpoint is another way to purge the content, effectively clearing the cached content from edge servers. Note that this method may disrupt content delivery and requires reconfiguration of the endpoint, so it's typically used as a last resort or in specific scenarios.

```sh
az cdn endpoint purge \
    --content-paths '/css/*' '/js/app.js' \
    --name ContosoEndpoint \
    --profile-name DemoProfile \
    --resource-group $resourceGroup
```

### Preload assets

```sh
az cdn endpoint load \
    --content-paths '/img/*' '/js/module.js' \
    --name ContosoEndpoint \
    --profile-name DemoProfile \
    --resource-group $resourceGroup
```

## [Compression (Front Door)](https://learn.microsoft.com/en-us/azure/frontdoor/standard-premium/how-to-compression)

- Files must be of a specific MIME type.
- File size should be larger than 1 KB and smaller than 8 MB.
- Supported encodings are gzip and brotli.
- Configuration changes take up to 10 minutes to propagate.
- Compression is part of the caching feature, it only works when caching is enabled.

### Geo-filtering

Geo-filtering allows for the control of content access by country/region codes. The **Standard** tier allows only site-wide allowance or blocking, while the **Verizon** and **Akamai** tiers offer additional directory path restrictions.

## [Features](https://learn.microsoft.com/en-us/azure/cdn/cdn-features)

**Premium Verison only**: Advanced HTTP reports, Real-time stats, Edge node performance, Real-time alerts
**Standard Versizon and Premium only**: Bring your own certificate, Asset pre-loading
**Standard Microsoft only**: Brotli compression

## Working with SDK

```cs
// You need to configure Microsoft Entra ID to provide authentication for the application
public static void ManageCdnEndpoint(string subscriptionId, TokenCredentials authResult, string resourceGroupName, string profileName, string endpointName, string resourceLocation)
{
    // Create CDN client
    CdnManagementClient cdn = new CdnManagementClient(authResult) { SubscriptionId = subscriptionId };

    // List all the CDN profiles in this resource group
    var profileList = cdn.Profiles.ListByResourceGroup(resourceGroupName);
    foreach (Profile p in profileList)
    {
        // List all the CDN endpoints on this CDN profile
        var endpointList = cdn.Endpoints.ListByProfile(p.Name, resourceGroupName);
        foreach (Endpoint e in endpointList) { }
    }

    // Create a new CDN profile (check if not exist first!)
    var profileParms = new Profile() { Location = resourceLocation, Sku = new Sku(SkuName.StandardVerizon) };
    cdn.Profiles.Create(resourceGroupName, profileName, profileParms);

    // Create a new CDN endpoint (check if not exist first!)
    var endpoint = new Endpoint()
    {
        Origins = new List<DeepCreatedOrigin>() { new DeepCreatedOrigin("Contoso", "www.contoso.com") },
        IsHttpAllowed = true,
        IsHttpsAllowed = true,
        Location = resourceLocation
    };
    cdn.Endpoints.BeginCreateWithHttpMessagesAsync(resourceGroupName, profileName, endpointName, endpoint);

    // Purge content from the endpoint
    cdn.Endpoints.PurgeContent(resourceGroupName, profileName, endpointName, new List<string>() { "/*" });
}
```

## Working with CLI

Register the Microsoft.CDN provider: `az provider register --namespace Microsoft.CDN`

Check status: `az provider show --namespace Microsoft.CDN --query "registrationState"`
