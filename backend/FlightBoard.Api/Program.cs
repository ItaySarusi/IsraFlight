using Microsoft.EntityFrameworkCore;
using FlightBoard.Infrastructure.Data;
using FlightBoard.Infrastructure.Repositories;
using FlightBoard.Application.Services;
using FlightBoard.Application.Interfaces;
using FlightBoard.Domain.Interfaces;
using FlightBoard.Api.Hubs;
using FlightBoard.Api.Services;
using FluentValidation;
using FluentValidation.AspNetCore;
using Serilog;
using FlightBoard.Api.Validators;
using Microsoft.Extensions.Logging;
using FlightBoard.Api;

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Override("Microsoft", Serilog.Events.LogEventLevel.Warning)
    .MinimumLevel.Override("Microsoft.EntityFrameworkCore", Serilog.Events.LogEventLevel.Error)
    .MinimumLevel.Override("Microsoft.EntityFrameworkCore.Database.Command", Serilog.Events.LogEventLevel.Error)
    .WriteTo.Console()
    .WriteTo.File("logs/flightboard-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

var builder = WebApplication.CreateBuilder(args);

// Use Serilog
builder.Host.UseSerilog();

// Add this after builder is created, before app is built
builder.Logging.AddFilter("Microsoft", LogLevel.Warning);
builder.Logging.AddFilter("Microsoft.EntityFrameworkCore", LogLevel.Error);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddValidatorsFromAssemblyContaining<CreateFlightDtoValidator>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add SignalR
builder.Services.AddSignalR();

// Add Entity Framework
builder.Services.AddDbContext<FlightDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") 
        ?? "Data Source=flights.db"));

// Add repositories and services
builder.Services.AddScoped<IFlightRepository, FlightRepository>();
builder.Services.AddScoped<IFlightService, FlightService>();

// Add background service for updating flight statuses
builder.Services.AddHostedService<FlightStatusUpdateService>();

// Add CORS for frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173", "http://localhost:3001")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapControllers();
app.MapHub<FlightHub>("/flightHub");

// Ensure database is created and seeded
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<FlightDbContext>();
    context.Database.EnsureCreated();
    // Seed the database with realistic flights
    await SeedDatabase.SeedFlightsAsync(app.Services);
}

app.Run();
