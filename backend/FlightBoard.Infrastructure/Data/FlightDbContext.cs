using Microsoft.EntityFrameworkCore;
using FlightBoard.Domain.Entities;

namespace FlightBoard.Infrastructure.Data;

public class FlightDbContext : DbContext
{
    public FlightDbContext(DbContextOptions<FlightDbContext> options) : base(options)
    {
    }

    public DbSet<Flight> Flights { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Flight>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            entity.Property(e => e.FlightNumber)
                .IsRequired()
                .HasMaxLength(10);
            
            entity.HasIndex(e => e.FlightNumber)
                .IsUnique();
            
            entity.Property(e => e.Destination)
                .IsRequired()
                .HasMaxLength(100);
            
            entity.Property(e => e.Gate)
                .IsRequired()
                .HasMaxLength(10);
            
            entity.Property(e => e.DepartureTime)
                .IsRequired();
            
            entity.Property(e => e.Status)
                .IsRequired()
                .HasConversion<string>();
            
            entity.Property(e => e.CreatedAt)
                .IsRequired();
            
            entity.Property(e => e.UpdatedAt)
                .IsRequired();
        });
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var entries = ChangeTracker
            .Entries()
            .Where(e => e.Entity is Flight && (e.State == EntityState.Added || e.State == EntityState.Modified));

        foreach (var entityEntry in entries)
        {
            var flight = (Flight)entityEntry.Entity;
            flight.UpdateStatus();
        }

        return await base.SaveChangesAsync(cancellationToken);
    }
}
