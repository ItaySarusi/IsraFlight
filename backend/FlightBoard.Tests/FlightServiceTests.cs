using Xunit;
using Moq;
using FlightBoard.Application.Services;
using FlightBoard.Domain.Interfaces;
using FlightBoard.Domain.Entities;
using FlightBoard.Domain.Enums;

namespace FlightBoard.Tests;

public class FlightServiceTests
{
    private readonly Mock<IFlightRepository> _mockRepository;
    private readonly FlightService _flightService;

    public FlightServiceTests()
    {
        _mockRepository = new Mock<IFlightRepository>();
        _flightService = new FlightService(_mockRepository.Object);
    }

    // Tests that a valid flight is created successfully
    [Fact]
    public async Task CreateFlightAsync_WithValidData_ShouldCreateFlight()
    {
        // Arrange
        var flightNumber = "TEST123";
        var destination = "Test City";
        var departureTime = DateTime.Now.AddHours(2); // 2 hours in future
        var gate = "A";

        var expectedFlight = new Flight(flightNumber, destination, departureTime, gate);
        _mockRepository.Setup(r => r.FlightNumberExistsAsync(flightNumber))
            .ReturnsAsync(false);
        _mockRepository.Setup(r => r.AddAsync(It.IsAny<Flight>()))
            .ReturnsAsync(expectedFlight);

        // Act
        var result = await _flightService.CreateFlightAsync(flightNumber, destination, departureTime, gate);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(flightNumber, result.FlightNumber);
        Assert.Equal(destination, result.Destination);
        Assert.Equal(departureTime, result.DepartureTime);
        Assert.Equal(gate, result.Gate);
        _mockRepository.Verify(r => r.AddAsync(It.IsAny<Flight>()), Times.Once);
    }

    // Tests that creating a flight with a past departure time throws an exception
    [Fact]
    public async Task CreateFlightAsync_WithPastDepartureTime_ShouldThrowArgumentException()
    {
        // Arrange
        var flightNumber = "TEST123";
        var destination = "Test City";
        var departureTime = DateTime.Now.AddHours(-1); // 1 hour in past
        var gate = "A";

        // Act & Assert
        var exception = await Assert.ThrowsAsync<ArgumentException>(
            () => _flightService.CreateFlightAsync(flightNumber, destination, departureTime, gate));
        
        Assert.Contains("Departure time must be in the future", exception.Message);
        _mockRepository.Verify(r => r.AddAsync(It.IsAny<Flight>()), Times.Never);
    }

    // Tests that creating a flight with an existing flight number throws an exception
    [Fact]
    public async Task CreateFlightAsync_WithExistingFlightNumber_ShouldThrowArgumentException()
    {
        // Arrange
        var flightNumber = "EXISTING123";
        var destination = "Test City";
        var departureTime = DateTime.Now.AddHours(2);
        var gate = "A";

        _mockRepository.Setup(r => r.FlightNumberExistsAsync(flightNumber))
            .ReturnsAsync(true);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<ArgumentException>(
            () => _flightService.CreateFlightAsync(flightNumber, destination, departureTime, gate));
        
        Assert.Contains("Flight number EXISTING123 already exists", exception.Message);
        _mockRepository.Verify(r => r.AddAsync(It.IsAny<Flight>()), Times.Never);
    }

    // Tests that updating a flight with a valid ID updates the flight
    [Fact]
    public async Task UpdateFlightAsync_WithValidId_ShouldUpdateFlight()
    {
        // Arrange
        var flightId = 1;
        var existingFlight = new Flight("TEST123", "Old City", DateTime.Now.AddHours(2), "A");
        var newDestination = "New City";
        var newGate = "B";

        _mockRepository.Setup(r => r.GetByIdAsync(flightId))
            .ReturnsAsync(existingFlight);
        _mockRepository.Setup(r => r.UpdateAsync(It.IsAny<Flight>()))
            .ReturnsAsync(existingFlight);

        // Act
        var result = await _flightService.UpdateFlightAsync(flightId, newDestination, null, newGate);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(newDestination, result.Destination);
        Assert.Equal(newGate, result.Gate);
        _mockRepository.Verify(r => r.UpdateAsync(It.IsAny<Flight>()), Times.Once);
    }

    // Tests that updating a flight with an invalid ID returns null
    [Fact]
    public async Task UpdateFlightAsync_WithInvalidId_ShouldReturnNull()
    {
        // Arrange
        var flightId = 999;
        _mockRepository.Setup(r => r.GetByIdAsync(flightId))
            .ReturnsAsync((Flight?)null);

        // Act
        var result = await _flightService.UpdateFlightAsync(flightId, "New City");

        // Assert
        Assert.Null(result);
        _mockRepository.Verify(r => r.UpdateAsync(It.IsAny<Flight>()), Times.Never);
    }

    // Tests that updating a flight with a past departure time throws an exception
    [Fact]
    public async Task UpdateFlightAsync_WithPastDepartureTime_ShouldThrowArgumentException()
    {
        // Arrange
        var flightId = 1;
        var existingFlight = new Flight("TEST123", "Test City", DateTime.Now.AddHours(2), "A");
        var pastDepartureTime = DateTime.Now.AddHours(-1);

        _mockRepository.Setup(r => r.GetByIdAsync(flightId))
            .ReturnsAsync(existingFlight);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<ArgumentException>(
            () => _flightService.UpdateFlightAsync(flightId, null, pastDepartureTime, null));
        
        Assert.Contains("Departure time must be in the future", exception.Message);
        _mockRepository.Verify(r => r.UpdateAsync(It.IsAny<Flight>()), Times.Never);
    }

    // Tests that updating the status of a valid flight updates the status
    [Fact]
    public async Task UpdateFlightStatusAsync_WithValidId_ShouldUpdateStatus()
    {
        // Arrange
        var flightId = 1;
        var existingFlight = new Flight("TEST123", "Test City", DateTime.Now.AddHours(2), "A");
        var newStatus = FlightStatus.Boarding;

        _mockRepository.Setup(r => r.GetByIdAsync(flightId))
            .ReturnsAsync(existingFlight);
        _mockRepository.Setup(r => r.UpdateAsync(It.IsAny<Flight>()))
            .ReturnsAsync(existingFlight);

        // Act
        var result = await _flightService.UpdateFlightStatusAsync(flightId, newStatus);

        // Assert
        Assert.True(result);
        _mockRepository.Verify(r => r.UpdateAsync(It.IsAny<Flight>()), Times.Once);
    }

    // Tests that updating the status of an invalid flight returns false
    [Fact]
    public async Task UpdateFlightStatusAsync_WithInvalidId_ShouldReturnFalse()
    {
        // Arrange
        var flightId = 999;
        _mockRepository.Setup(r => r.GetByIdAsync(flightId))
            .ReturnsAsync((Flight?)null);

        // Act
        var result = await _flightService.UpdateFlightStatusAsync(flightId, FlightStatus.Boarding);

        // Assert
        Assert.False(result);
        _mockRepository.Verify(r => r.UpdateAsync(It.IsAny<Flight>()), Times.Never);
    }

    // Tests that deleting a valid flight returns true
    [Fact]
    public async Task DeleteFlightAsync_WithValidId_ShouldReturnTrue()
    {
        // Arrange
        var flightId = 1;
        _mockRepository.Setup(r => r.DeleteAsync(flightId))
            .ReturnsAsync(true);

        // Act
        var result = await _flightService.DeleteFlightAsync(flightId);

        // Assert
        Assert.True(result);
        _mockRepository.Verify(r => r.DeleteAsync(flightId), Times.Once);
    }

    // Tests that deleting an invalid flight returns false
    [Fact]
    public async Task DeleteFlightAsync_WithInvalidId_ShouldReturnFalse()
    {
        // Arrange
        var flightId = 999;
        _mockRepository.Setup(r => r.DeleteAsync(flightId))
            .ReturnsAsync(false);

        // Act
        var result = await _flightService.DeleteFlightAsync(flightId);

        // Assert
        Assert.False(result);
        _mockRepository.Verify(r => r.DeleteAsync(flightId), Times.Once);
    }

    [Fact]
    public async Task GetAllFlightsAsync_ShouldReturnAllFlights()
    {
        // Arrange
        var expectedFlights = new List<Flight>
        {
            new Flight("TEST1", "City1", DateTime.Now.AddHours(1), "A"),
            new Flight("TEST2", "City2", DateTime.Now.AddHours(2), "B")
        };

        _mockRepository.Setup(r => r.GetAllAsync())
            .ReturnsAsync(expectedFlights);

        // Act
        var result = await _flightService.GetAllFlightsAsync();

        // Assert
        Assert.Equal(expectedFlights.Count, result.Count());
        _mockRepository.Verify(r => r.GetAllAsync(), Times.Once);
    }

    [Fact]
    public async Task SearchFlightsAsync_WithFilters_ShouldReturnFilteredFlights()
    {
        // Arrange
        var status = FlightStatus.Scheduled;
        var destination = "Test City";
        var flightNumber = "TEST";

        var expectedFlights = new List<Flight>
        {
            new Flight("TEST123", "Test City", DateTime.Now.AddHours(1), "A")
        };

        _mockRepository.Setup(r => r.SearchAsync(status, destination, flightNumber))
            .ReturnsAsync(expectedFlights);

        // Act
        var result = await _flightService.SearchFlightsAsync(status, destination, flightNumber);

        // Assert
        Assert.Equal(expectedFlights.Count, result.Count());
        _mockRepository.Verify(r => r.SearchAsync(status, destination, flightNumber), Times.Once);
    }
} 