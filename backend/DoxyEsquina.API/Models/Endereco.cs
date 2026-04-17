namespace DoxyEsquina.API.Models;

public class Endereco
{
    public int Id { get; set; }
    public int ClienteId { get; set; }
    public string Logradouro { get; set; } = "";
    public string Numero { get; set; } = "";
    public string? Complemento { get; set; }
    public string Bairro { get; set; } = "";
    public string? Referencia { get; set; }
    public double? Lat { get; set; }
    public double? Lng { get; set; }
    public Cliente Cliente { get; set; } = null!;
}
