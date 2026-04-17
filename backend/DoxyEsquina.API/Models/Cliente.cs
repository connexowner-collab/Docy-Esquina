namespace DoxyEsquina.API.Models;

public class Cliente
{
    public int Id { get; set; }
    public string Nome { get; set; } = "";
    public string Telefone { get; set; } = "";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<Endereco> Enderecos { get; set; } = [];
    public ICollection<Pedido> Pedidos { get; set; } = [];
}
