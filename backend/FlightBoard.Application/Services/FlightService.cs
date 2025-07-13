using FlightBoard.Domain.Entities;
using FlightBoard.Domain.Enums;
using FlightBoard.Domain.Interfaces;
using FlightBoard.Application.Interfaces;

namespace FlightBoard.Application.Services;

public class FlightService : IFlightService
{
    private readonly IFlightRepository _flightRepository;

    public FlightService(IFlightRepository flightRepository)
    {
        _flightRepository = flightRepository;
    }

    public async Task<IEnumerable<Flight>> GetAllFlightsAsync()
    {
        return await _flightRepository.GetAllAsync();
    }

    public async Task<Flight?> GetFlightByIdAsync(int id)
    {
        return await _flightRepository.GetByIdAsync(id);
    }

    public async Task<IEnumerable<Flight>> SearchFlightsAsync(FlightStatus? status = null, string? destination = null, string? flightNumber = null)
    {
        return await _flightRepository.SearchAsync(status, destination, flightNumber);
    }

    public async Task<Flight> CreateFlightAsync(string flightNumber, string destination, DateTime departureTime, string gate)
    {
        // Validate departure time is in the future
        if (departureTime <= DateTime.Now)
        {
            throw new ArgumentException("Departure time must be in the future.");
        }

        // Check if flight number already exists
        if (await _flightRepository.FlightNumberExistsAsync(flightNumber))
        {
            throw new ArgumentException($"Flight number {flightNumber} already exists.");
        }

        var flight = new Flight(flightNumber, destination, departureTime, gate);
        return await _flightRepository.AddAsync(flight);
    }

    public async Task<Flight?> UpdateFlightAsync(int id, string? destination = null, DateTime? departureTime = null, string? gate = null)
    {
        var flight = await _flightRepository.GetByIdAsync(id);
        if (flight == null)
        {
            return null;
        }

        if (!string.IsNullOrWhiteSpace(destination))
        {
            flight.Destination = destination;
        }

        if (departureTime.HasValue)
        {
            if (departureTime.Value <= DateTime.Now)
            {
                throw new ArgumentException("Departure time must be in the future.");
            }
            flight.DepartureTime = departureTime.Value;
        }

        if (!string.IsNullOrWhiteSpace(gate))
        {
            flight.Gate = gate;
        }

        return await _flightRepository.UpdateAsync(flight);
    }

    public async Task<bool> UpdateFlightStatusAsync(int id, FlightStatus newStatus)
    {
        var flight = await _flightRepository.GetByIdAsync(id);
        if (flight == null)
        {
            return false;
        }

        flight.Status = newStatus;
        flight.UpdatedAt = DateTime.Now;
        await _flightRepository.UpdateAsync(flight);
        return true;
    }

    public async Task<bool> DeleteFlightAsync(int id)
    {
        return await _flightRepository.DeleteAsync(id);
    }

    public async Task UpdateFlightStatusesAsync()
    {
        var flights = await _flightRepository.GetAllAsync();
        foreach (var flight in flights)
        {
            var oldStatus = flight.Status;
            flight.UpdateStatus();
            
            if (oldStatus != flight.Status)
            {
                await _flightRepository.UpdateAsync(flight);
            }
        }
    }
}
