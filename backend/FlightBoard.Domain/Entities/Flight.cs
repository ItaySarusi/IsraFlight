using FlightBoard.Domain.Enums;

namespace FlightBoard.Domain.Entities;

public class Flight
{
    public int Id { get; set; }
    public string FlightNumber { get; set; } = string.Empty;
    public string Destination { get; set; } = string.Empty;
    public DateTime DepartureTime { get; set; }
    public string Gate { get; set; } = string.Empty;
    public FlightStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public Flight()
    {
        var now = DateTime.UtcNow;
        CreatedAt = now;
        UpdatedAt = now;
    }

    public Flight(string flightNumber, string destination, DateTime departureTime, string gate)
    {
        FlightNumber = flightNumber;
        Destination = destination;
        DepartureTime = departureTime;
        Gate = gate;
        var now = DateTime.UtcNow;
        CreatedAt = now;
        UpdatedAt = now;
        Status = CalculateStatus();
    }

    public FlightStatus CalculateStatus()
    {
        var now = DateTime.UtcNow;
        var timeDifference = DepartureTime - now;

        return timeDifference.TotalMinutes switch
        {
            > 30 => FlightStatus.Scheduled,
            <= 30 and >= 0 => FlightStatus.Boarding,
            < 0 and >= -60 => FlightStatus.Departed,
            < -60 => FlightStatus.Landed,
            _ => FlightStatus.Scheduled
        };
    }

    public void UpdateStatus()
    {
        Status = CalculateStatus();
        UpdatedAt = DateTime.UtcNow;
    }
}
