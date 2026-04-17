namespace DoxyEsquina.API.Models;

public class ItemPedido
{
    public int Id { get; set; }
    public int PedidoId { get; set; }
    public int ItemCardapioId { get; set; }
    public string NomeSnapshot { get; set; } = "";
    public decimal PrecoSnapshot { get; set; }
    public int Quantidade { get; set; }
    public decimal Subtotal { get; set; }
    public Pedido Pedido { get; set; } = null!;
}
