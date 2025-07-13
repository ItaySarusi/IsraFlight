using Xunit;
using Microsoft.EntityFrameworkCore;
using FlightBoard.Infrastructure.Data;
using FlightBoard.Infrastructure.Repositories;
using FlightBoard.Domain.Entities;
using FlightBoard.Domain.Enums;

namespace FlightBoard.Tests;

public class FlightRepositoryTests : IDisposable
{
    private readonly FlightDbContext _context;
    private readonly FlightRepository _repository;

    public FlightRepositoryTests()
    {
        var options = new DbContextOptionsBuilder<FlightDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new FlightDbContext(options);
        _repository = new FlightRepository(_context);
    }

    [Fact]
    public async Task GetAllAsync_ShouldReturnAllFlights()
    {
        // Arrange
        var flights = new List<Flight>
        {
            new Flight("TEST1", "City1", DateTime.Now.AddHours(1), "A"),
            new Flight("TEST2", "City2", DateTime.Now.AddHours(2), "B")
        };

        await _context.Flights.AddRangeAsync(flights);
        await _context.SaveChangesAsync();

        // Act
        var result = await _repository.GetAllAsync();

        // Assert
        Assert.Equal(2, result.Count());
        Assert.Contains(result, f => f.FlightNumber == "TEST1");
        Assert.Contains(result, f => f.FlightNumber == "TEST2");
    }

    [Fact]
    public async Task GetByIdAsync_WithValidId_ShouldReturnFlight()
    {
        // Arrange
        var flight = new Flight("TEST123", "Test City", DateTime.Now.AddHours(1), "A");
        await _context.Flights.AddAsync(flight);
        await _context.SaveChangesAsync();

        // Act
        var result = await _repository.GetByIdAsync(flight.Id);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("TEST123", result.FlightNumber);
    }

    [Fact]
    public async Task GetByIdAsync_WithInvalidId_ShouldReturnNull()
    {
        // Act
        var result = await _repository.GetByIdAsync(999);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task GetByFlightNumberAsync_WithValidFlightNumber_ShouldReturnFlight()
    {
        // Arrange
        var flight = new Flight("TEST123", "Test City", DateTime.Now.AddHours(1), "A");
        await _context.Flights.AddAsync(flight);
        await _context.SaveChangesAsync();

        // Act
        var result = await _repository.GetByFlightNumberAsync("TEST123");

        // Assert
        Assert.NotNull(result);
        Assert.Equal("TEST123", result.FlightNumber);
    }

    [Fact]
    public async Task GetByFlightNumberAsync_WithInvalidFlightNumber_ShouldReturnNull()
    {
        // Act
        var result = await _repository.GetByFlightNumberAsync("INVALID");

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task SearchAsync_WithStatusFilter_ShouldReturnFilteredFlights()
    {
        // Arrange
        var now = DateTime.Now;
        var flights = new List<Flight>
        {
            // This flight will be Scheduled (departure is 2 hours from now)
            new Flight("TEST1", "City1", now.AddHours(2), "A"),
            // This flight will be Boarding (departure is 10 minutes from now)
            new Flight("TEST2", "City2", now.AddMinutes(10), "B")
        };

        await _context.Flights.AddRangeAsync(flights);
        await _context.SaveChangesAsync();

        // Act
        var result = await _repository.SearchAsync(FlightStatus.Scheduled);

        // Assert
        Assert.Single(result);
        Assert.Equal("TEST1", result.First().FlightNumber);
    }

    [Fact]
    public async Task SearchAsync_WithDestinationFilter_ShouldReturnFilteredFlights()
    {
        // Arrange
        var flights = new List<Flight>
        {
            new Flight("TEST1", "Tel Aviv", DateTime.Now.AddHours(1), "A"),
            new Flight("TEST2", "New York", DateTime.Now.AddHours(2), "B")
        };

        await _context.Flights.AddRangeAsync(flights);
        await _context.SaveChangesAsync();

        // Act
        var result = await _repository.SearchAsync(destination: "Tel Aviv");

        // Assert
        Assert.Single(result);
        Assert.Equal("TEST1", result.First().FlightNumber);
    }

    [Fact]
    public async Task SearchAsync_WithFlightNumberFilter_ShouldReturnFilteredFlights()
    {
        // Arrange
        var flights = new List<Flight>
        {
            new Flight("TEST123", "City1", DateTime.Now.AddHours(1), "A"),
            new Flight("FLIGHT456", "City2", DateTime.Now.AddHours(2), "B")
        };

        await _context.Flights.AddRangeAsync(flights);
        await _context.SaveChangesAsync();

        // Act
        var result = await _repository.SearchAsync(flightNumber: "TEST");

        // Assert
        Assert.Single(result);
        Assert.Equal("TEST123", result.First().FlightNumber);
    }

    [Fact]
    public async Task SearchAsync_WithMultipleFilters_ShouldReturnFilteredFlights()
    {
        // Arrange
        var flights = new List<Flight>
        {
            new Flight("TEST123", "Tel Aviv", DateTime.Now.AddHours(1), "A") { Status = FlightStatus.Scheduled },
            new Flight("TEST456", "New York", DateTime.Now.AddHours(2), "B") { Status = FlightStatus.Scheduled },
            new Flight("FLIGHT789", "Tel Aviv", DateTime.Now.AddHours(3), "C") { Status = FlightStatus.Boarding }
        };

        await _context.Flights.AddRangeAsync(flights);
        await _context.SaveChangesAsync();

        // Act
        var result = await _repository.SearchAsync(FlightStatus.Scheduled, "Tel Aviv", "TEST");

        // Assert
        Assert.Single(result);
        Assert.Equal("TEST123", result.First().FlightNumber);
    }

    [Fact]
    public async Task AddAsync_ShouldAddFlightToDatabase()
    {
        // Arrange
        var flight = new Flight("TEST123", "Test City", DateTime.Now.AddHours(1), "A");

        // Act
        var result = await _repository.AddAsync(flight);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("TEST123", result.FlightNumber);
        Assert.True(result.Id > 0);

        var savedFlight = await _context.Flights.FindAsync(result.Id);
        Assert.NotNull(savedFlight);
    }

    [Fact]
    public async Task UpdateAsync_ShouldUpdateFlightInDatabase()
    {
        // Arrange
        var flight = new Flight("TEST123", "Old City", DateTime.Now.AddHours(1), "A");
        await _context.Flights.AddAsync(flight);
        await _context.SaveChangesAsync();

        flight.Destination = "New City";
        flight.Gate = "B";

        // Act
        var result = await _repository.UpdateAsync(flight);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("New City", result.Destination);
        Assert.Equal("B", result.Gate);

        var updatedFlight = await _context.Flights.FindAsync(flight.Id);
        Assert.Equal("New City", updatedFlight!.Destination);
    }

    [Fact]
    public async Task DeleteAsync_WithValidId_ShouldReturnTrue()
    {
        // Arrange
        var flight = new Flight("TEST123", "Test City", DateTime.Now.AddHours(1), "A");
        await _context.Flights.AddAsync(flight);
        await _context.SaveChangesAsync();

        // Act
        var result = await _repository.DeleteAsync(flight.Id);

        // Assert
        Assert.True(result);
        var deletedFlight = await _context.Flights.FindAsync(flight.Id);
        Assert.Null(deletedFlight);
    }

    [Fact]
    public async Task DeleteAsync_WithInvalidId_ShouldReturnFalse()
    {
        // Act
        var result = await _repository.DeleteAsync(999);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public async Task FlightNumberExistsAsync_WithExistingFlightNumber_ShouldReturnTrue()
    {
        // Arrange
        var flight = new Flight("TEST123", "Test City", DateTime.Now.AddHours(1), "A");
        await _context.Flights.AddAsync(flight);
        await _context.SaveChangesAsync();

        // Act
        var result = await _repository.FlightNumberExistsAsync("TEST123");

        // Assert
        Assert.True(result);
    }

    [Fact]
    public async Task FlightNumberExistsAsync_WithNonExistingFlightNumber_ShouldReturnFalse()
    {
        // Act
        var result = await _repository.FlightNumberExistsAsync("NONEXISTENT");

        // Assert
        Assert.False(result);
    }

    public void Dispose()
    {
        _context.Dispose();
    }
} 