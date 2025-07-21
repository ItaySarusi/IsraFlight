using Microsoft.EntityFrameworkCore;
using FlightBoard.Infrastructure.Data;
using FlightBoard.Domain.Entities;
using FlightBoard.Domain.Enums;

namespace FlightBoard.Api;

public static class SeedDatabase
{
    public static async Task SeedFlightsAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<FlightDbContext>();

        // Clear existing flights
        context.Flights.RemoveRange(context.Flights);
        await context.SaveChangesAsync();

        var random = new Random();
        var now = DateTime.Now;
        var destinations = new[] { "New York", "London", "Paris", "Los Angeles", "Tokyo", "Sydney", "Toronto", "Berlin", "Rome", "Barcelona", "Amsterdam", "Vienna", "Prague", "Budapest", "Warsaw" };
        var gates = new[] { "A1", "B2", "C3", "D4", "E5", "F6", "G7", "H8", "I9", "J10", "K11", "L12", "M13", "N14", "O15" };
        var flights = new List<Flight>();
        // 5 flights in the next 30 minutes
        for (int i = 0; i < 5; i++)
        {
            var minutesFromNow = random.Next(1, 31); // 1-30 minutes from now
            flights.Add(new Flight
            {
                FlightNumber = $"LY{(i+1).ToString("D3")}",
                Destination = destinations[i],
                DepartureTime = now.AddMinutes(minutesFromNow),
                Gate = gates[i]
            });
        }
        // 5 flights departed 1-30 minutes ago
        for (int i = 5; i < 10; i++)
        {
            var minutesAgo = random.Next(1, 31); // 1-30 minutes ago
            flights.Add(new Flight
            {
                FlightNumber = $"LY{(i+1).ToString("D3")}",
                Destination = destinations[i],
                DepartureTime = now.AddMinutes(-minutesAgo),
                Gate = gates[i]
            });
        }
        // 5 flights departed 30-60 minutes ago
        for (int i = 10; i < 15; i++)
        {
            var minutesAgo = random.Next(30, 61); // 30-60 minutes ago
            flights.Add(new Flight
            {
                FlightNumber = $"LY{(i+1).ToString("D3")}",
                Destination = destinations[i],
                DepartureTime = now.AddMinutes(-minutesAgo),
                Gate = gates[i]
            });
        }
        context.Flights.AddRange(flights);
        await context.SaveChangesAsync();

        Console.WriteLine($"Database seeded with {flights.Count} flights");
    }
} 