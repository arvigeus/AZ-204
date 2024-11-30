# [Azure App Configuration](https://learn.microsoft.com/en-us/azure/azure-app-configuration/)

Azure App Configuration centralizes app settings and feature flags, making it easier to manage hierarchical configurations across different settings and locations. It allows real-time updates without needing to restart the app. While it _encrypts all data_, it lacks the advanced security features of Azure Key Vault, such as hardware-level encryption, granular access policies, and management environments.

You can import and export configuration between Azure App Configuration and separate files. It also supports separate stores for different development stages like testing and production.

## Azure App Configuration Overview

Azure App Configuration manages configuration data using key-value pairs.

- **Keys**: Unique, _case-sensitive_ identifiers for values. They can include any unicode character except `*`, `,`, and `\` (reserved can be escaped with '\'). Use delimiters like `/` or `:` for hierarchical organization. Azure treats _keys as a whole_ and doesn't enforce any structure. Example: `AppName:Service1:ApiEndpoint`
- **Labels**: Group keys by criteria, ex: environments or versions (which is _not supported natively_). Default label is `null`. Example: `Key = AppName:DbEndpoint & Label = Test`. Key prefixes are alternative way of grouping (labeling). To explicitly reference a key-value without a label, use `\0`. Different labels create different versions of the same key, these are considered distinct (unique) entries.
- **Values**: Unicode strings optionally associated with a user-defined content type for additional metadata.

### Configuration and Querying

```cs
// Load configuration
builder.Configuration.AddAzureAppConfiguration(options =>
{
    options.Connect(connectionString)
           // Select a subset of the configuration keys (start with `TestApp:` and have no label) from Azure App Configuration
           // To select all keys: KeyFilter.Any
           .Select("TestApp:*", LabelFilter.Null)
           // Configure to reload configuration if the registered sentinel key is modified
           .ConfigureRefresh(refreshOptions => refreshOptions.Register("TestApp:Settings:Sentinel", refreshAll: true));
});
builder.Services.AddFeatureManagement();
builder.Services.AddFeatureFilter<TargetingFilter>(); // (for example)

// Query keys
AsyncPageable<ConfigurationSetting> settings = client.GetConfigurationSettingsAsync(new SettingSelector { KeyFilter = "AppName:*" });
await foreach (ConfigurationSetting setting in settings)
    Console.WriteLine($"Key: {setting.Key}, Value: {setting.Value}");
```

#### Chaining

When using multiple `.Select()`, if a key with the same name exists in both labels. the value from the last `.Select()` will be used.

```cs
// In this example, if a key like 'TestApp:Key' exists both with the 'dev' label and with no label,
// the value associated with the 'dev' label will be used. This is due to the order of the .Select() calls.
// If you reverse the order of the .Select() calls, the value associated with no label would take precedence.
.Select("TestApp:*", LabelFilter.Null)
.Select("TestApp:*", "dev");
```

## [Feature Management](https://learn.microsoft.com/en-us/azure/azure-app-configuration/howto-feature-filters)

- **Feature flag**: A binary variable (on/off) that controls the execution of an associated code block.
- **Feature manager**: A software package managing feature flags' lifecycle, providing additional functions like caching and updating flag states.
- **Filter**: A rule determining the state of a feature flag, based on user groups, device types, geographic location, or time windows.

A successful feature management system requires:

- An application using feature flags.
- A separate repository storing feature flags and their states.

### Using Feature Flags in Code

Feature flags are used as Boolean state variables in conditional statements:

```csharp
bool featureFlag = true; // static value
bool featureFlag = isBetaUser(); // evaluated value

if (featureFlag) { /* ... */ }
else { /* ... */ }
```

#### [Configure feature flags](https://learn.microsoft.com/en-us/azure/azure-app-configuration/quickstart-feature-flag-aspnet-core)

```cs
// Load configuration from Azure App Configuration
builder.Configuration.AddAzureAppConfiguration(options =>
{
    // By default if no parameter is passed (options.UseFeatureFlags()), it loads all feature flags with no label
    // The default refresh expiration of feature flags is 30 seconds
    options.UseFeatureFlags(featureFlagOptions =>
    {
        // Select feature flags from "TestApp" namespace, with label "dev"
        featureFlagOptions.Select("TestApp:*", "dev");
        featureFlagOptions.CacheExpirationInterval = TimeSpan.FromMinutes(5);
    });
});

// Add feature management to the container of services.
builder.Services.AddFeatureManagement();
// Registering a feature filter
builder.Services.AddFeatureFilter<TargetingFilter>(); // (for example)
```

### [Conditional feature flags](https://learn.microsoft.com/en-us/azure/azure-app-configuration/howto-feature-filters-aspnet-core)

Allows the feature flag to be enabled or disabled dynamically.

- `PercentageFilter` enables the feature flag based on a percentage.
- `TimeWindowFilter` enables the feature flag during a specified window of time.
- `TargetingFilter` enables the feature flag for specified users and groups.

#### [Enable staged rollout of features for targeted audiences with `TargetingFilter`](https://learn.microsoft.com/en-us/azure/azure-app-configuration/howto-targetingfilter-aspnet-core)

1. Implement `ITargetingContextAccessor`

   ```cs
   private const string TargetingContextLookup = "TestTargetingContextAccessor.TargetingContext";
   public ValueTask<TargetingContext> GetContextAsync()
   {
       if (httpContext.Items.TryGetValue(TargetingContextLookup, out object value))
           return new ValueTask<TargetingContext>((TargetingContext)value);

       // Example: `test@contoso.com` - User: `test`, Group(s): `contoso.com`
       List<string> groups = new List<string>();
       if (httpContext.User.Identity.Name != null)
           groups.Add(httpContext.User.Identity.Name.Split("@", StringSplitOptions.None)[1]);

       var targetingContext = new TargetingContext
       {
           UserId = httpContext.User.Identity.Name,
           Groups = groups
       };
       httpContext.Items[TargetingContextLookup] = targetingContext;
       return new ValueTask<TargetingContext>(targetingContext);
    }
   ```

1. Add `TargetingFilter`: `services.AddFeatureManagement().AddFeatureFilter<TargetingFilter>();`

1. Update the `ConfigureServices` method to add the `ITargetingContextAccessor` implementation: `services.AddSingleton<ITargetingContextAccessor, TestTargetingContextAccessor>();`

1. `app > Feature Manager > (create feature flag) > (enable) > Edit > Use feature filter > Targeting filte >  Override by Groups and Override by Users`

### Declaring Feature Flags

A feature flag consists of a name and one or more filters determining if the feature is on (`true`). When multiple filters are used, they are evaluated in order until one enables the feature. If none do, the feature is off.

The feature manager supports _appsettings.json_ as a configuration source for feature flags:

```jsonc
{
  "FeatureManagement": {
    "FeatureA": true, // Feature on
    "FeatureB": false, // Feature off
    "FeatureC": {
      "EnabledFor": [
        {
          "Name": "Percentage",
          "Parameters": { "Value": 50 }
        }
      ]
    }
  }
}
```

### Feature Flag Repository

Azure App Configuration serves as a centralized repository for feature flags, enabling externalizing all feature flags used in an application. This allows changing feature states without modifying and redeploying the application.

## Security

### [Using Customer-Managed Keys for Encryption](https://learn.microsoft.com/en-us/azure/azure-app-configuration/concept-customer-managed-keys)

A managed identity authenticates with Microsoft Entra ID and wraps the encryption key using Azure Key Vault. The wrapped key is stored and the unwrapped key is cached for an hour, then refreshed.

Prerequisites:

- _A Standard tier_ Azure App Configuration
- Azure Key Vault with soft-delete and purge-protection
- An unexpired, enabled RSA or RSA-HSM key in the Key Vault with wrap and unwrap capabilities

After setup, assign a managed identity to the App Configuration and grant it `GET`, `WRAP`, and `UNWRAP` (permits decrypting previously wrapped keys) permissions in the Key Vault's access policy:

```sh
az keyvault set-policy --key-permissions get wrapKey unwrapKey
```

## Configure Key Vault

```cs
builder.Configuration.AddAzureAppConfiguration(options =>
{
    options.Connect(
        builder.Configuration["ConnectionStrings:AppConfig"])
            .ConfigureKeyVault(kv => kv.SetCredential(new DefaultAzureCredential()));
});
```

After the initialization, you can access the values of Key Vault references in the same way you access the values of regular App Configuration keys.

## Import / Export configureation

Import all keys and feature flags from a file and apply test label: `az appconfig kv import -n MyAppConfiguration --label test -s file --path D:/abc.json --format json`

Export all keys and feature flags with label test to a json file: `az appconfig kv export -n MyAppConfiguration --label test -d file --path D:/abc.json --format json`

## CLI

- [az appconfig kv import](https://learn.microsoft.com/en-us/cli/azure/appconfig/kv?view=azure-cli-latest#az-appconfig-kv-import)
- [az appconfig kv export](https://learn.microsoft.com/en-us/cli/azure/appconfig/kv?view=azure-cli-latest#az-appconfig-kv-export)
- [az appconfig identity](https://learn.microsoft.com/en-us/cli/azure/appconfig/identity?view=azure-cli-latest)
