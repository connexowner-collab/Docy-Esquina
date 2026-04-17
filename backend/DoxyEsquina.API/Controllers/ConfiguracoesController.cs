using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DoxyEsquina.API.Data;
using DoxyEsquina.API.Models;

namespace DoxyEsquina.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ConfiguracoesController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get() =>
        Ok(await db.Configuracoes.FirstOrDefaultAsync());

    [HttpPut]
    public async Task<IActionResult> Update([FromBody] Configuracao model)
    {
        var existing = await db.Configuracoes.FirstOrDefaultAsync();
        if (existing is null) return NotFound();

        existing.NomeEstabelecimento = model.NomeEstabelecimento;
        existing.Telefone = model.Telefone;
        existing.EnderecoOrigem = model.EnderecoOrigem;
        existing.LatOrigem = model.LatOrigem;
        existing.LngOrigem = model.LngOrigem;
        existing.TaxaMinima = model.TaxaMinima;
        existing.KmBase = model.KmBase;
        existing.ValorPorKm = model.ValorPorKm;
        existing.KmMaximo = model.KmMaximo;

        await db.SaveChangesAsync();
        return Ok(existing);
    }
}
