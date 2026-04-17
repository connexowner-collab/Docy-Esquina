namespace DoxyEsquina.API.Models;

public class ItemCardapio
{
    public int Id { get; set; }
    public int CategoriaId { get; set; }
    public string Nome { get; set; } = "";
    public string? Descricao { get; set; }
    public decimal Preco { get; set; }
    public bool Ativo { get; set; } = true;
    public Categoria Categoria { get; set; } = null!;
}
