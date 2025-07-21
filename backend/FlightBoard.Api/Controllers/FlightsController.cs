using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using FlightBoard.Application.Interfaces;
using FlightBoard.Api.Models;
using FlightBoard.Api.Hubs;
using FlightBoard.Domain.Entities;
using FlightBoard.Domain.Enums;
using Serilog;

namespace FlightBoard.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FlightsController : ControllerBase
{
    private readonly IFlightService _flightService;
    private readonly IHubContext<FlightHub> _hubContext;

    public FlightsController(IFlightService flightService, IHubContext<FlightHub> hubContext)
    {
        _flightService = flightService;
        _hubContext = hubContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<FlightDto>>> GetAllFlights()
    {
        try
        {
            var flights = await _flightService.GetAllFlightsAsync();
            var flightDtos = flights.Select(MapToDto);
            return Ok(flightDtos);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<FlightDto>> GetFlightById(int id)
    {
        try
        {
            var flight = await _flightService.GetFlightByIdAsync(id);
            if (flight == null)
            {
                return NotFound($"Flight with ID {id} not found.");
            }

            return Ok(MapToDto(flight));
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<FlightDto>>> SearchFlights(
        [FromQuery] FlightStatus? status = null,
        [FromQuery] string? destination = null,
        [FromQuery] string? flightNumber = null)
    {
        try
        {
            var flights = await _flightService.SearchFlightsAsync(status, destination, flightNumber);
            var flightDtos = flights.Select(MapToDto);
            return Ok(flightDtos);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpPost]
    public async Task<ActionResult<FlightDto>> CreateFlight([FromBody] CreateFlightDto createFlightDto)
    {
        try
        {
            Log.Information("Creating new flight: {FlightNumber} to {Destination}", 
                createFlightDto.FlightNumber, createFlightDto.Destination);

            var flight = await _flightService.CreateFlightAsync(
                createFlightDto.FlightNumber,
                createFlightDto.Destination,
                createFlightDto.DepartureTime,
                createFlightDto.Gate);

            var flightDto = MapToDto(flight);

            Log.Information("Flight created successfully: {FlightId} - {FlightNumber}", 
                flight.Id, flight.FlightNumber);

            // Notify all clients about the new flight
            await _hubContext.Clients.Group("FlightBoard").SendAsync("FlightAdded", flightDto);

            return CreatedAtAction(nameof(GetFlightById), new { id = flight.Id }, flightDto);
        }
        catch (ArgumentException ex)
        {
            Log.Warning("Failed to create flight: {FlightNumber} - {Error}", 
                createFlightDto.FlightNumber, ex.Message);
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Unexpected error creating flight: {FlightNumber}", createFlightDto.FlightNumber);
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }



    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteFlight(int id)
    {
        try
        {
            Log.Information("Deleting flight with ID: {FlightId}", id);

            var success = await _flightService.DeleteFlightAsync(id);
            if (!success)
            {
                Log.Warning("Flight not found for deletion: {FlightId}", id);
                return NotFound($"Flight with ID {id} not found.");
            }

            Log.Information("Flight deleted successfully: {FlightId}", id);

            // Notify all clients about the deleted flight
            await _hubContext.Clients.Group("FlightBoard").SendAsync("FlightDeleted", id);

            return NoContent();
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Unexpected error deleting flight: {FlightId}", id);
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    private static FlightDto MapToDto(Flight flight)
    {
        return new FlightDto
        {
            Id = flight.Id,
            FlightNumber = flight.FlightNumber,
            Destination = flight.Destination,
            DepartureTime = flight.DepartureTime,
            Gate = flight.Gate,
            Status = flight.Status.ToString(),
            CreatedAt = flight.CreatedAt,
            UpdatedAt = flight.UpdatedAt
        };
    }


}
