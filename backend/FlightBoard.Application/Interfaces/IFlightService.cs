using FlightBoard.Domain.Entities;
using FlightBoard.Domain.Enums;

namespace FlightBoard.Application.Interfaces;

public interface IFlightService
{
    Task<IEnumerable<Flight>> GetAllFlightsAsync();
    Task<Flight?> GetFlightByIdAsync(int id);
    Task<IEnumerable<Flight>> SearchFlightsAsync(FlightStatus? status = null, string? destination = null, string? flightNumber = null);
    Task<Flight> CreateFlightAsync(string flightNumber, string destination, DateTime departureTime, string gate);

    Task<bool> UpdateFlightStatusAsync(int id, FlightStatus newStatus);
    Task<bool> DeleteFlightAsync(int id);
    Task UpdateFlightStatusesAsync();
}
