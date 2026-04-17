namespace DoxyEsquina.API.Models;

public class Pedido
{
    public int Id { get; set; }
    public int NumeroSeq { get; set; }
    public int ClienteId { get; set; }
    public int EnderecoId { get; set; }
    public decimal DistanciaKm { get; set; }
    public decimal TaxaEntrega { get; set; }
    public decimal? TaxaManual { get; set; }
    public decimal Subtotal { get; set; }
    public decimal Total { get; set; }
    public string Pagamento { get; set; } = "";
    public decimal? Troco { get; set; }
    public string? Observacoes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public Cliente Cliente { get; set; } = null!;
    public Endereco Endereco { get; set; } = null!;
    public ICollection<ItemPedido> Itens { get; set; } = [];
}
