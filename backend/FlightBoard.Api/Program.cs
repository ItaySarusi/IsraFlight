using Microsoft.EntityFrameworkCore;
using FlightBoard.Infrastructure.Data;
using FlightBoard.Infrastructure.Repositories;
using FlightBoard.Application.Services;
using FlightBoard.Application.Interfaces;
using FlightBoard.Domain.Interfaces;
using FlightBoard.Api.Hubs;
using FlightBoard.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
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
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
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

// Ensure database is created
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<FlightDbContext>();
    context.Database.EnsureCreated();
}

app.Run();
