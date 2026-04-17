using System.Text.Json;
using DoxyEsquina.API.Data;
using DoxyEsquina.API.DTOs;
using Microsoft.EntityFrameworkCore;

namespace DoxyEsquina.API.Services;

public class FreteService(HttpClient httpClient, AppDbContext db, IConfiguration config)
{
    public async Task<FreteResultDto> CalcularAsync(double latDestino, double lngDestino)
    {
        var config_ = await db.Configuracoes.FirstOrDefaultAsync()
            ?? throw new InvalidOperationException("Configurações não encontradas.");

        if (config_.LatOrigem is null || config_.LngOrigem is null)
            throw new InvalidOperationException("Endereço de origem não configurado.");

        var apiKey = config["GoogleMaps:ApiKey"];
        var origins = $"{config_.LatOrigem},{config_.LngOrigem}";
        var destinations = $"{latDestino},{lngDestino}";
        var url = $"https://maps.googleapis.com/maps/api/distancematrix/json?origins={origins}&destinations={destinations}&key={apiKey}";

        var response = await httpClient.GetStringAsync(url);
        var json = JsonDocument.Parse(response);

        var distanceMeters = json.RootElement
            .GetProperty("rows")[0]
            .GetProperty("elements")[0]
            .GetProperty("distance")
            .GetProperty("value")
            .GetInt32();

        var distanciaKm = distanceMeters / 1000.0m;
        var foraCoberto = distanciaKm > config_.KmMaximo;

        var taxa = config_.TaxaMinima + Math.Max(0, distanciaKm - config_.KmBase) * config_.ValorPorKm;

        return new FreteResultDto
        {
            DistanciaKm = distanciaKm,
            Taxa = taxa,
            ForaCobertura = foraCoberto
        };
    }
}
