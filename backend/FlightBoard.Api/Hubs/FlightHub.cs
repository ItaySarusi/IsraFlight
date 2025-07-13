using Microsoft.AspNetCore.SignalR;

namespace FlightBoard.Api.Hubs;

public class FlightHub : Hub
{
    public async Task JoinFlightBoard()
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, "FlightBoard");
    }

    public async Task LeaveFlightBoard()
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, "FlightBoard");
    }

    public override async Task OnConnectedAsync()
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, "FlightBoard");
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, "FlightBoard");
        await base.OnDisconnectedAsync(exception);
    }
}
