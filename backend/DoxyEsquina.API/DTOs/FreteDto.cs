namespace DoxyEsquina.API.DTOs;

public record FreteRequestDto(double LatDestino, double LngDestino);

public record FreteResultDto
{
    public decimal DistanciaKm { get; init; }
    public decimal Taxa { get; init; }
    public bool ForaCobertura { get; init; }
}
