# Docy Esquina — Sistema de Gestão de Pedidos Delivery

Stack: Angular 17 + .NET 8 + Supabase (PostgreSQL)

## Estrutura
- `frontend/` — Angular 17 (SPA operacional)
- `backend/DoxyEsquina.API/` — .NET 8 Web API
- `supabase/migrations/` — SQL migrations do banco

## Setup Rápido

### 1. Banco de Dados (Supabase)
Execute `supabase/migrations/001_initial_schema.sql` no SQL Editor do Supabase.

### 2. Backend (.NET 8)
```bash
cd backend/DoxyEsquina.API
dotnet restore
dotnet run
```
Configurar `appsettings.json` com connection string do Supabase e chave do Google Maps.

### 3. Frontend (Angular)
```bash
cd frontend
npm install
ng serve
```
