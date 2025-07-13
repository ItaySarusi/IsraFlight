using FlightBoard.Domain.Entities;
using FlightBoard.Domain.Enums;

namespace FlightBoard.Application.Interfaces;

public interface IFlightService
{
    Task<IEnumerable<Flight>> GetAllFlightsAsync();
    Task<Flight?> GetFlightByIdAsync(int id);
    Task<IEnumerable<Flight>> SearchFlightsAsync(FlightStatus? status = null, string? destination = null);
    Task<Flight> CreateFlightAsync(string flightNumber, string destination, DateTime departureTime, string gate);
    Task<Flight?> UpdateFlightAsync(int id, string? destination = null, DateTime? departureTime = null, string? gate = null);
    Task<bool> DeleteFlightAsync(int id);
    Task UpdateFlightStatusesAsync();
}
