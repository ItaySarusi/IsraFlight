using FluentValidation;
using FlightBoard.Api.Models;

namespace FlightBoard.Api.Validators;

public class CreateFlightDtoValidator : AbstractValidator<CreateFlightDto>
{
    public CreateFlightDtoValidator()
    {
        RuleFor(x => x.FlightNumber)
            .NotEmpty().WithMessage("Flight number is required.")
            .Length(2, 10).WithMessage("Flight number must be between 2 and 10 characters.")
            .Matches(@"^[A-Z0-9]+$").WithMessage("Flight number must contain only uppercase letters and numbers.");

        RuleFor(x => x.Destination)
            .NotEmpty().WithMessage("Destination is required.")
            .Length(2, 100).WithMessage("Destination must be between 2 and 100 characters.")
            .Matches(@"^[a-zA-Z\s\-']+$").WithMessage("Destination can only contain letters, spaces, hyphens, and apostrophes.");

        RuleFor(x => x.DepartureTime)
            .NotEmpty().WithMessage("Departure time is required.")
            .GreaterThan(DateTime.Now).WithMessage("Departure time must be in the future.");

        RuleFor(x => x.Gate)
            .NotEmpty().WithMessage("Gate is required.")
            .Length(1, 5).WithMessage("Gate must be between 1 and 5 characters.")
            .Matches(@"^[A-Z0-9]+$").WithMessage("Gate must contain only uppercase letters and numbers.");
    }
} 