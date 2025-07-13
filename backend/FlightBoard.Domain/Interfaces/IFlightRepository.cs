using FlightBoard.Domain.Entities;
using FlightBoard.Domain.Enums;

namespace FlightBoard.Domain.Interfaces;

public interface IFlightRepository
{
    Task<IEnumerable<Flight>> GetAllAsync();
    Task<Flight?> GetByIdAsync(int id);
    Task<Flight?> GetByFlightNumberAsync(string flightNumber);
    Task<IEnumerable<Flight>> SearchAsync(FlightStatus? status = null, string? destination = null, string? flightNumber = null);
    Task<Flight> AddAsync(Flight flight);
    Task<Flight> UpdateAsync(Flight flight);
    Task<bool> DeleteAsync(int id);
    Task<bool> FlightNumberExistsAsync(string flightNumber);
}
