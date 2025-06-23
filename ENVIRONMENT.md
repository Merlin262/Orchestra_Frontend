# Configuração de Ambiente

Este documento explica como configurar as variáveis de ambiente no projeto Orchestra Frontend.

## Variáveis de Ambiente

### Variáveis Disponíveis

- `NODE_ENV`: Define o ambiente de execução (`development`, `production`, `test`)
- `NEXT_PUBLIC_API_URL`: URL geral da API (sobrescreve URLs específicas por ambiente)
- `NEXT_PUBLIC_API_URL_DEV`: URL da API para desenvolvimento local
- `NEXT_PUBLIC_API_URL_PROD`: URL da API para produção
- `NEXT_PUBLIC_API_TIMEOUT`: Timeout das requisições da API (ms)
- `NEXT_PUBLIC_APP_NAME`: Nome da aplicação
- `NEXT_PUBLIC_APP_VERSION`: Versão da aplicação
- `NEXT_PUBLIC_DEBUG_API`: Habilitar logs de chamadas da API
- `NEXT_PUBLIC_DEBUG_ENV`: Habilitar logs de ambiente

## Como Configurar as URLs do Backend

### 1. Desenvolvimento Local

Crie um arquivo `.env.local` na raiz do projeto:

```bash
# Ambiente de execução
NODE_ENV=development

# URL do backend .NET local
NEXT_PUBLIC_API_URL_DEV=https://localhost:7073
# ou use a URL geral
NEXT_PUBLIC_API_URL=https://localhost:7073

# Configurações de debug
NEXT_PUBLIC_DEBUG_API=true
NEXT_PUBLIC_DEBUG_ENV=true
```

### 2. Produção (Azure Container Apps)

Para produção usando Azure Container Apps:

```bash
# Ambiente de execução
NODE_ENV=production

# URL do Azure Container Apps
NEXT_PUBLIC_API_URL_PROD=https://orchestra.agreeablesmoke-0a2944b9.westus2.azurecontainerapps.io

# Configurações de produção
NEXT_PUBLIC_DEBUG_API=false
NEXT_PUBLIC_DEBUG_ENV=false
```

### 3. Produção (Cloud/Deploy)

Para produção em cloud (Vercel, Netlify, etc.):

```bash
# Ambiente de execução
NODE_ENV=production

# URL da API em produção
NEXT_PUBLIC_API_URL_PROD=https://orchestra.agreeablesmoke-0a2944b9.westus2.azurecontainerapps.io

# Configurações de produção
NEXT_PUBLIC_DEBUG_API=false
NEXT_PUBLIC_DEBUG_ENV=false
```

## Como Usar no Código

### Usando o Hook useEnvironment

```typescript
import { useEnvironment } from '@/hooks/use-environment';

function MyComponent() {
  const { apiUrl, apiConfig, isDevelopment, logEnvironment } = useEnvironment();

  useEffect(() => {
    // Log do ambiente apenas em desenvolvimento
    logEnvironment();
    
    // Fazer chamada para a API
    fetch(`${apiUrl}/api/processos`)
      .then(response => response.json())
      .then(data => console.log(data));
  }, [apiUrl, logEnvironment]);

  return (
    <div>
      <p>URL da API: {apiUrl}</p>
      <p>Ambiente: {isDevelopment ? 'Desenvolvimento' : 'Produção'}</p>
    </div>
  );
}
```

### Usando as Funções Diretamente

```typescript
import { getApiUrl, getApiConfig, isProduction } from '@/lib/config';

// Obter URL da API
const apiUrl = getApiUrl();

// Obter configurações completas da API
const apiConfig = getApiConfig();

// Verificar ambiente
if (isProduction()) {
  console.log('Usando configurações de produção');
}
```

## Scripts do Package.json

O projeto usa `cross-env` para garantir compatibilidade com Windows, macOS e Linux:

```json
{
  "scripts": {
    "dev": "cross-env NODE_ENV=development next dev",
    "build": "cross-env NODE_ENV=production next build",
    "start": "cross-env NODE_ENV=production next start",
    "build:dev": "cross-env NODE_ENV=development next build"
  }
}
```

## Exemplos Práticos

### Azure Container Apps

Se você estiver usando Azure Container Apps, configure assim:

```yaml
# azure-container-apps.yaml
apiVersion: 2019-12-01
location: westus2
name: orchestra-frontend
properties:
  template:
    containers:
    - name: orchestra-frontend
      image: orchestra-frontend:latest
      env:
      - name: NODE_ENV
        value: "production"
      - name: NEXT_PUBLIC_API_URL_PROD
        value: "https://orchestra.agreeablesmoke-0a2944b9.westus2.azurecontainerapps.io"
```

### Vercel/Netlify

Configure as variáveis de ambiente no painel do seu provedor:

- `NODE_ENV`: `production`
- `NEXT_PUBLIC_API_URL_PROD`: `https://orchestra.agreeablesmoke-0a2944b9.westus2.azurecontainerapps.io`

### Docker Compose (Desenvolvimento Local)

Se você quiser usar Docker Compose para desenvolvimento:

```yaml
# docker-compose.yml
version: '3.8'
services:
  frontend:
    build: .
    environment:
      - NODE_ENV=development
      - NEXT_PUBLIC_API_URL_DEV=https://localhost:7073
    ports:
      - "3000:3000"
    depends_on:
      - backend
  
  backend:
    image: orchestra-backend
    ports:
      - "7073:7073"
```

## Notas Importantes

- Arquivos `.env*` são ignorados pelo Git (configurado no `.gitignore`)
- Variáveis que começam com `NEXT_PUBLIC_` são expostas ao cliente
- Variáveis sem `NEXT_PUBLIC_` são apenas para o servidor
- O arquivo `lib/config.ts` centraliza todas as configurações de ambiente
- O pacote `cross-env` garante que os scripts funcionem em todos os sistemas operacionais
- Use `NEXT_PUBLIC_API_URL` para sobrescrever todas as URLs específicas por ambiente
- Use `NEXT_PUBLIC_API_URL_DEV` e `NEXT_PUBLIC_API_URL_PROD` para URLs específicas por ambiente 