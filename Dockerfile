# Use the official .NET 8.0 SDK image as the base image
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

# Set the working directory
WORKDIR /src

# Copy the project files
COPY ["FlightBoard.Api/FlightBoard.Api.csproj", "FlightBoard.Api/"]
COPY ["FlightBoard.Application/FlightBoard.Application.csproj", "FlightBoard.Application/"]
COPY ["FlightBoard.Domain/FlightBoard.Domain.csproj", "FlightBoard.Domain/"]
COPY ["FlightBoard.Infrastructure/FlightBoard.Infrastructure.csproj", "FlightBoard.Infrastructure/"]

# Restore dependencies
RUN dotnet restore "FlightBoard.Api/FlightBoard.Api.csproj"

# Copy the rest of the source code
COPY . .

# Build the application
WORKDIR "/src/FlightBoard.Api"
RUN dotnet build "FlightBoard.Api.csproj" -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish "FlightBoard.Api.csproj" -c Release -o /app/publish

# Build the runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final

# Set the working directory
WORKDIR /app

# Copy the published application
COPY --from=publish /app/publish .

# Create logs directory
RUN mkdir -p /app/logs

# Expose port 5001
EXPOSE 5001

# Set the entry point
ENTRYPOINT ["dotnet", "FlightBoard.Api.dll"] 