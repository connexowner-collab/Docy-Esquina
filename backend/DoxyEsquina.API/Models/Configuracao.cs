namespace DoxyEsquina.API.Models;

public class Configuracao
{
    public int Id { get; set; }
    public string NomeEstabelecimento { get; set; } = "";
    public string? Telefone { get; set; }
    public string? EnderecoOrigem { get; set; }
    public double? LatOrigem { get; set; }
    public double? LngOrigem { get; set; }
    public decimal TaxaMinima { get; set; }
    public decimal KmBase { get; set; }
    public decimal ValorPorKm { get; set; }
    public decimal KmMaximo { get; set; }
}
