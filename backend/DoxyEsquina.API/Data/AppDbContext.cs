using Microsoft.EntityFrameworkCore;
using DoxyEsquina.API.Models;

namespace DoxyEsquina.API.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Cliente> Clientes => Set<Cliente>();
    public DbSet<Endereco> Enderecos => Set<Endereco>();
    public DbSet<Categoria> Categorias => Set<Categoria>();
    public DbSet<ItemCardapio> ItensCardapio => Set<ItemCardapio>();
    public DbSet<Pedido> Pedidos => Set<Pedido>();
    public DbSet<ItemPedido> ItensPedido => Set<ItemPedido>();
    public DbSet<Configuracao> Configuracoes => Set<Configuracao>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Configuracao>().HasData(new Configuracao
        {
            Id = 1,
            NomeEstabelecimento = "Docy Esquina",
            TaxaMinima = 5.0m,
            KmBase = 2.0m,
            ValorPorKm = 2.0m,
            KmMaximo = 15.0m
        });
    }
}
