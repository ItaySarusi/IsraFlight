using Xunit;
using FlightBoard.Domain.Entities;
using FlightBoard.Domain.Enums;

namespace FlightBoard.Tests;

public class FlightStatusCalculationTests
{
    [Fact]
    public void CalculateStatus_WhenMoreThan30MinutesBeforeDeparture_ShouldReturnScheduled()
    {
        // Arrange
        var departureTime = DateTime.Now.AddMinutes(45); // 45 minutes in future
        var flight = new Flight("TEST123", "Test City", departureTime, "A");

        // Act
        var status = flight.CalculateStatus();

        // Assert
        Assert.Equal(FlightStatus.Scheduled, status);
    }

    [Fact]
    public void CalculateStatus_When30MinutesBeforeDeparture_ShouldReturnBoarding()
    {
        // Arrange
        var departureTime = DateTime.Now.AddMinutes(30); // Exactly 30 minutes in future
        var flight = new Flight("TEST123", "Test City", departureTime, "A");

        // Act
        var status = flight.CalculateStatus();

        // Assert
        Assert.Equal(FlightStatus.Boarding, status);
    }

    [Fact]
    public void CalculateStatus_WhenLessThan30MinutesBeforeDeparture_ShouldReturnBoarding()
    {
        // Arrange
        var departureTime = DateTime.Now.AddMinutes(15); // 15 minutes in future
        var flight = new Flight("TEST123", "Test City", departureTime, "A");

        // Act
        var status = flight.CalculateStatus();

        // Assert
        Assert.Equal(FlightStatus.Boarding, status);
    }

    [Fact]
    public void CalculateStatus_WhenAtDepartureTime_ShouldReturnBoarding()
    {
        // Arrange
        var departureTime = DateTime.Now.AddSeconds(1); // 1 second in future to ensure it's not past
        var flight = new Flight("TEST123", "Test City", departureTime, "A");

        // Act
        var status = flight.CalculateStatus();

        // Assert
        Assert.Equal(FlightStatus.Boarding, status);
    }

    [Fact]
    public void CalculateStatus_WhenJustAfterDeparture_ShouldReturnDeparted()
    {
        // Arrange
        var departureTime = DateTime.Now.AddMinutes(-5); // 5 minutes ago
        var flight = new Flight("TEST123", "Test City", departureTime, "A");

        // Act
        var status = flight.CalculateStatus();

        // Assert
        Assert.Equal(FlightStatus.Departed, status);
    }

    [Fact]
    public void CalculateStatus_When30MinutesAfterDeparture_ShouldReturnDeparted()
    {
        // Arrange
        var departureTime = DateTime.Now.AddMinutes(-30); // 30 minutes ago
        var flight = new Flight("TEST123", "Test City", departureTime, "A");

        // Act
        var status = flight.CalculateStatus();

        // Assert
        Assert.Equal(FlightStatus.Departed, status);
    }

    [Fact]
    public void CalculateStatus_When60MinutesAfterDeparture_ShouldReturnDeparted()
    {
        // Arrange
        var departureTime = DateTime.Now.AddMinutes(-59); // 59 minutes ago (still in Departed range)
        var flight = new Flight("TEST123", "Test City", departureTime, "A");

        // Act
        var status = flight.CalculateStatus();

        // Assert
        Assert.Equal(FlightStatus.Departed, status);
    }

    [Fact]
    public void CalculateStatus_WhenMoreThan60MinutesAfterDeparture_ShouldReturnLanded()
    {
        // Arrange
        var departureTime = DateTime.Now.AddMinutes(-90); // 90 minutes ago
        var flight = new Flight("TEST123", "Test City", departureTime, "A");

        // Act
        var status = flight.CalculateStatus();

        // Assert
        Assert.Equal(FlightStatus.Landed, status);
    }

    [Fact]
    public void UpdateStatus_ShouldUpdateStatusAndUpdatedAt()
    {
        // Arrange
        var departureTime = DateTime.Now.AddMinutes(-90); // 90 minutes ago (should be Landed)
        var flight = new Flight("TEST123", "Test City", departureTime, "A");
        var originalUpdatedAt = flight.UpdatedAt;
        var originalStatus = flight.Status;

        // Act
        flight.UpdateStatus();

        // Assert
        Assert.Equal(FlightStatus.Landed, flight.Status);
        Assert.True(flight.UpdatedAt > originalUpdatedAt);
    }

    [Fact]
    public void CalculateStatus_WithUtcTime_ShouldConvertToLocalTime()
    {
        // Arrange
        var utcDepartureTime = DateTime.UtcNow.AddMinutes(-30); // 30 minutes ago in UTC
        var flight = new Flight("TEST123", "Test City", utcDepartureTime, "A");

        // Act
        var status = flight.CalculateStatus();

        // Assert
        // The status should be calculated based on local time conversion
        Assert.True(status == FlightStatus.Departed || status == FlightStatus.Landed);
    }
} 