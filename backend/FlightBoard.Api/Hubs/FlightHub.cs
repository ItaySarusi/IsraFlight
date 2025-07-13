using Microsoft.AspNetCore.SignalR;

namespace FlightBoard.Api.Hubs;

public class FlightHub : Hub
{
    private readonly ILogger<FlightHub> _logger;

    public FlightHub(ILogger<FlightHub> logger)
    {
        _logger = logger;
    }

namespace FlightBoard.Api.Hubs;

public class FlightHub : Hub
{
    public async Task JoinFlightBoard()
    {
        _logger.LogInformation($"Client {Context.ConnectionId} joining FlightBoard group");
        await Groups.AddToGroupAsync(Context.ConnectionId, "FlightBoard");
        _logger.LogInformation($"Client {Context.ConnectionId} successfully joined FlightBoard group");
    }

    public async Task LeaveFlightBoard()
    {
        _logger.LogInformation($"Client {Context.ConnectionId} leaving FlightBoard group");
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, "FlightBoard");
    }

    public override async Task OnConnectedAsync()
    {
        _logger.LogInformation($"Client {Context.ConnectionId} connected");
        await Groups.AddToGroupAsync(Context.ConnectionId, "FlightBoard");
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        _logger.LogInformation($"Client {Context.ConnectionId} disconnected{(exception != null ? $" with error: {exception.Message}" : "")}");
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, "FlightBoard");
        await base.OnDisconnectedAsync(exception);
    }
}
