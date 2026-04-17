using Microsoft.AspNetCore.Mvc;
using DoxyEsquina.API.DTOs;
using DoxyEsquina.API.Services;

namespace DoxyEsquina.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FreteController(FreteService freteService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Calcular([FromBody] FreteRequestDto request)
    {
        var result = await freteService.CalcularAsync(request.LatDestino, request.LngDestino);
        return Ok(result);
    }
}
