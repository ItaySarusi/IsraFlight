using FlightBoard.Application.Interfaces;
using FlightBoard.Api.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace FlightBoard.Api.Services;

public class FlightStatusUpdateService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<FlightStatusUpdateService> _logger;

    public FlightStatusUpdateService(IServiceProvider serviceProvider, ILogger<FlightStatusUpdateService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Flight Status Update Service started.");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = _serviceProvider.CreateScope();
                var flightService = scope.ServiceProvider.GetRequiredService<IFlightService>();
                var hubContext = scope.ServiceProvider.GetRequiredService<IHubContext<FlightHub>>();

                var flights = await flightService.GetAllFlightsAsync();
                var statusChanges = new List<object>();

                foreach (var flight in flights)
                {
                    var oldStatus = flight.Status;
                    flight.UpdateStatus();
                    
                    if (oldStatus != flight.Status)
                    {
                        // Update the flight in the repository to save the status change
                        await flightService.UpdateFlightStatusAsync(flight.Id, flight.Status);
                        statusChanges.Add(new
                        {
                            Id = flight.Id,
                            FlightNumber = flight.FlightNumber,
                            Status = flight.Status.ToString(),
                            UpdatedAt = flight.UpdatedAt
                        });
                    }
                }

                // Notify clients of any status changes
                if (statusChanges.Count > 0)
                {
                    _logger.LogInformation($"Sending status updates for {statusChanges.Count} flights: {string.Join(", ", statusChanges.Select(s => $"{s.GetType().GetProperty("FlightNumber")?.GetValue(s)}: {s.GetType().GetProperty("Status")?.GetValue(s)}"))}");
                    await hubContext.Clients.Group("FlightBoard").SendAsync("FlightStatusesUpdated", statusChanges, stoppingToken);
                    _logger.LogInformation($"Successfully sent status updates for {statusChanges.Count} flights.");
                }

                // Update every 30 seconds
                await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating flight statuses.");
                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken); // Wait 1 minute before retrying
            }
        }

        _logger.LogInformation("Flight Status Update Service stopped.");
    }
}
