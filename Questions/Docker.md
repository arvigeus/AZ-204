# Docker

Question: Which of the following docker images is used to build an ASP.NET app?

- [x] dotnet/core/sdk
- [ ] dotnet/core/aspnet
- [ ] None of these
- [ ] Both

Answer: The `dotnet/core/sdk` image includes the Command Line Tools (CLI) and is optimized for local development, debugging, and unit testing.

---

Question: Which of the following docker images is used to run an ASP.NET app?

- [ ] dotnet/core/sdk
- [x] dotnet/core/aspnet
- [ ] None of these
- [ ] Both

Answer: The `dotnet/core/aspnet` image contains the ASP.NET Core runtime and libraries and is optimized for running apps in production.

---

Question: Define a Dockerfile where build and run in different containers (multi-stage)

```Dockerfile
FROM mcr.microsoft.com/dotnet/core # Fill in details
```

Answer:

```Dockerfile
FROM mcr.microsoft.com/dotnet/core/sdk:3.0 AS build
WORKDIR /app

# copy csproj and restore as distinct layers
COPY *.sln .
COPY aspnetapp/*.csproj ./aspnetapp/
RUN dotnet restore

# copy everything else and build app
COPY aspnetapp/. ./aspnetapp/
WORKDIR /app/aspnetapp
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/core/aspnet:3.0 AS runtime
WORKDIR /app
COPY --from=build /app/aspnetapp/out ./
ENTRYPOINT ["dotnet", "aspnetapp.dll"]
```

---

Question: Can you compose a Dockerfile for a .NET Core 3.1 web application, named "WebApplication1", which is capable of serving both secure and non-secure web traffic? The source code for the application resides in "/src/WebApplication1". How would you structure the Dockerfile stages to ensure the final image is lean and the build process adheres to best practices? Lastly, ensure that the application starts by executing a DLL file.

```Dockerfile
FROM mcr.microsoft.com/dotnet/core # Fill in details
```

Answer: Note: Because we are exposing our app, `FROM mcr.microsoft.com/dotnet/core/aspnet:3.1` is in the first step, not the last

```Dockerfile
FROM mcr.microsoft.com/dotnet/core/aspnet:3.1 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build
WORKDIR /src
COPY ["WebApplication1/WebApplication1.csproj", "WebApplication1/"]
RUN dotnet restore "WebApplication1/WebApplication1.csproj"
COPY . .
WORKDIR "/src/WebApplication1"
RUN dotnet build "WebApplication1.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "WebApplication1.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "WebApplication1.dll"]
```

---

Question: You're migrating a .NET Core application named `InventoryManager` to run in containers. A Dockerfile has been created for this purpose. Now, you need to build, tag, and publish the `InventoryManager` container image to an Azure container registry named `ProductionRegistry`. Your version tag for this operation is `v1.0`. Considering that you need to authenticate with Azure and with `ProductionRegistry`, what sequence of actions (commands) should you undertake?

```ps
# Code here
```

Answer:

```ps
# Log in to Azure
az login

# Authenticate with the Azure Container Registry 'ProductionRegistry'
az acr login --name ProductionRegistry

# Build the image locally
docker build -t inventorymanager .

# Tag the local image with the version and the ACR Login Server
docker tag inventorymanager:latest ProductionRegistry.azurecr.io/inventorymanager:v1.0

# Push the image to 'ProductionRegistry' on Azure
docker push ProductionRegistry.azurecr.io/inventorymanager:v1.0
```

`inventorymanager:latest` is the image name followed by a tag. The tag part is optional, and if you don't specify it, Docker will automatically use the tag "latest". You can build and tag in one step by running `docker build -t ProductionRegistry.azurecr.io/app1:1.0 .`

To push a container image to an Azure container registry, you need to tag the image following the convention `<registry-name>.azurecr.io/<image-name>`

---
