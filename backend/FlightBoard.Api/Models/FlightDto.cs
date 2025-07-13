using FlightBoard.Domain.Enums;

namespace FlightBoard.Api.Models;

public class FlightDto
{
    public int Id { get; set; }
    public string FlightNumber { get; set; } = string.Empty;
    public string Destination { get; set; } = string.Empty;
    public DateTime DepartureTime { get; set; }
    public string Gate { get; set; } = string.Empty;
    public FlightStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateFlightDto
{
    public string FlightNumber { get; set; } = string.Empty;
    public string Destination { get; set; } = string.Empty;
    public DateTime DepartureTime { get; set; }
    public string Gate { get; set; } = string.Empty;
}

public class UpdateFlightDto
{
    public string? Destination { get; set; }
    public DateTime? DepartureTime { get; set; }
    public string? Gate { get; set; }
}
