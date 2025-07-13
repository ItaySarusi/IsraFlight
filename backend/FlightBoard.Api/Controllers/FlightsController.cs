using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using FlightBoard.Application.Interfaces;
using FlightBoard.Api.Models;
using FlightBoard.Api.Hubs;
using FlightBoard.Domain.Entities;
using FlightBoard.Domain.Enums;

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
        [FromQuery] string? destination = null)
    {
        try
        {
            var flights = await _flightService.SearchFlightsAsync(status, destination);
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
            if (!IsValidCreateFlightDto(createFlightDto))
            {
                return BadRequest("All fields are required: Flight Number, Destination, Departure Time, and Gate.");
            }

            var flight = await _flightService.CreateFlightAsync(
                createFlightDto.FlightNumber,
                createFlightDto.Destination,
                createFlightDto.DepartureTime,
                createFlightDto.Gate);

            var flightDto = MapToDto(flight);

            // Notify all clients about the new flight
            await _hubContext.Clients.Group("FlightBoard").SendAsync("FlightAdded", flightDto);

            return CreatedAtAction(nameof(GetFlightById), new { id = flight.Id }, flightDto);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<FlightDto>> UpdateFlight(int id, [FromBody] UpdateFlightDto updateFlightDto)
    {
        try
        {
            var flight = await _flightService.UpdateFlightAsync(
                id,
                updateFlightDto.Destination,
                updateFlightDto.DepartureTime,
                updateFlightDto.Gate);

            if (flight == null)
            {
                return NotFound($"Flight with ID {id} not found.");
            }

            var flightDto = MapToDto(flight);

            // Notify all clients about the updated flight
            await _hubContext.Clients.Group("FlightBoard").SendAsync("FlightUpdated", flightDto);

            return Ok(flightDto);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteFlight(int id)
    {
        try
        {
            var success = await _flightService.DeleteFlightAsync(id);
            if (!success)
            {
                return NotFound($"Flight with ID {id} not found.");
            }

            // Notify all clients about the deleted flight
            await _hubContext.Clients.Group("FlightBoard").SendAsync("FlightDeleted", id);

            return NoContent();
        }
        catch (Exception ex)
        {
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
            Status = flight.Status,
            CreatedAt = flight.CreatedAt,
            UpdatedAt = flight.UpdatedAt
        };
    }

    private static bool IsValidCreateFlightDto(CreateFlightDto dto)
    {
        return !string.IsNullOrWhiteSpace(dto.FlightNumber) &&
               !string.IsNullOrWhiteSpace(dto.Destination) &&
               !string.IsNullOrWhiteSpace(dto.Gate) &&
               dto.DepartureTime > DateTime.MinValue;
    }
}
