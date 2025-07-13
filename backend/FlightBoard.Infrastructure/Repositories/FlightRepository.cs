using Microsoft.EntityFrameworkCore;
using FlightBoard.Domain.Entities;
using FlightBoard.Domain.Enums;
using FlightBoard.Domain.Interfaces;
using FlightBoard.Infrastructure.Data;

namespace FlightBoard.Infrastructure.Repositories;

public class FlightRepository : IFlightRepository
{
    private readonly FlightDbContext _context;

    public FlightRepository(FlightDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Flight>> GetAllAsync()
    {
        return await _context.Flights
            .OrderBy(f => f.DepartureTime)
            .ToListAsync();
    }

    public async Task<Flight?> GetByIdAsync(int id)
    {
        return await _context.Flights
            .FirstOrDefaultAsync(f => f.Id == id);
    }

    public async Task<Flight?> GetByFlightNumberAsync(string flightNumber)
    {
        return await _context.Flights
            .FirstOrDefaultAsync(f => f.FlightNumber == flightNumber);
    }

    public async Task<IEnumerable<Flight>> SearchAsync(FlightStatus? status = null, string? destination = null)
    {
        var query = _context.Flights.AsQueryable();

        if (status.HasValue)
        {
            query = query.Where(f => f.Status == status.Value);
        }

        if (!string.IsNullOrWhiteSpace(destination))
        {
            query = query.Where(f => f.Destination.Contains(destination));
        }

        return await query
            .OrderBy(f => f.DepartureTime)
            .ToListAsync();
    }

    public async Task<Flight> AddAsync(Flight flight)
    {
        _context.Flights.Add(flight);
        await _context.SaveChangesAsync();
        return flight;
    }

    public async Task<Flight> UpdateAsync(Flight flight)
    {
        _context.Entry(flight).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return flight;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var flight = await GetByIdAsync(id);
        if (flight == null)
        {
            return false;
        }

        _context.Flights.Remove(flight);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> FlightNumberExistsAsync(string flightNumber)
    {
        return await _context.Flights
            .AnyAsync(f => f.FlightNumber == flightNumber);
    }
}
