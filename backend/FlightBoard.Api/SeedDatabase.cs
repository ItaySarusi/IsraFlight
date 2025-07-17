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

        // Add realistic flights
        var flights = new List<Flight>
        {
            new Flight
            {
                FlightNumber = "LY001",
                Destination = "New York",
                DepartureTime = DateTime.Now.AddHours(2),
                Gate = "A1"
            },
            new Flight
            {
                FlightNumber = "LY002",
                Destination = "London",
                DepartureTime = DateTime.Now.AddHours(3),
                Gate = "B2"
            },
            new Flight
            {
                FlightNumber = "LY003",
                Destination = "Paris",
                DepartureTime = DateTime.Now.AddHours(4),
                Gate = "C3"
            },
            new Flight
            {
                FlightNumber = "LY004",
                Destination = "Los Angeles",
                DepartureTime = DateTime.Now.AddHours(5),
                Gate = "D4"
            },
            new Flight
            {
                FlightNumber = "LY005",
                Destination = "Tokyo",
                DepartureTime = DateTime.Now.AddHours(6),
                Gate = "E5"
            },
            new Flight
            {
                FlightNumber = "LY006",
                Destination = "Sydney",
                DepartureTime = DateTime.Now.AddHours(7),
                Gate = "F6"
            },
            new Flight
            {
                FlightNumber = "LY007",
                Destination = "Toronto",
                DepartureTime = DateTime.Now.AddHours(8),
                Gate = "G7"
            },
            new Flight
            {
                FlightNumber = "LY008",
                Destination = "Berlin",
                DepartureTime = DateTime.Now.AddHours(9),
                Gate = "H8"
            },
            new Flight
            {
                FlightNumber = "LY009",
                Destination = "Rome",
                DepartureTime = DateTime.Now.AddHours(10),
                Gate = "I9"
            },
            new Flight
            {
                FlightNumber = "LY010",
                Destination = "Barcelona",
                DepartureTime = DateTime.Now.AddHours(11),
                Gate = "J10"
            },
            new Flight
            {
                FlightNumber = "LY011",
                Destination = "Amsterdam",
                DepartureTime = DateTime.Now.AddHours(12),
                Gate = "K11"
            },
            new Flight
            {
                FlightNumber = "LY012",
                Destination = "Vienna",
                DepartureTime = DateTime.Now.AddHours(13),
                Gate = "L12"
            },
            new Flight
            {
                FlightNumber = "LY013",
                Destination = "Prague",
                DepartureTime = DateTime.Now.AddHours(14),
                Gate = "M13"
            },
            new Flight
            {
                FlightNumber = "LY014",
                Destination = "Budapest",
                DepartureTime = DateTime.Now.AddHours(15),
                Gate = "N14"
            },
            new Flight
            {
                FlightNumber = "LY015",
                Destination = "Warsaw",
                DepartureTime = DateTime.Now.AddHours(16),
                Gate = "O15"
            }
        };

        context.Flights.AddRange(flights);
        await context.SaveChangesAsync();

        Console.WriteLine($"Database seeded with {flights.Count} flights");
    }
} 