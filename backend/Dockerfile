FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["DoxyEsquina.API/DoxyEsquina.API.csproj", "DoxyEsquina.API/"]
RUN dotnet restore "DoxyEsquina.API/DoxyEsquina.API.csproj"
COPY . .
WORKDIR "/src/DoxyEsquina.API"
RUN dotnet build -c Release -o /app/build

FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "DoxyEsquina.API.dll"]
