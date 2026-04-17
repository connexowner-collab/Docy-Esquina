namespace DoxyEsquina.API.Models;

public class Categoria
{
    public int Id { get; set; }
    public string Nome { get; set; } = "";
    public int Ordem { get; set; }
    public ICollection<ItemCardapio> Itens { get; set; } = [];
}
