// Configuração de ambiente
export const config = {
  // Ambiente de execução
  env: process.env.NODE_ENV || 'development',
  
  // Verifica se está em produção
  isProduction: process.env.NODE_ENV === 'production',
  
  // Verifica se está em desenvolvimento
  isDevelopment: process.env.NODE_ENV === 'development',
  
  // URLs da API por ambiente
  api: {
    // URL principal da API (usa a variável de ambiente ou fallback baseado no ambiente)
    url: process.env.NEXT_PUBLIC_API_URL || getApiUrlByEnvironment(),
    
    // URLs específicas por ambiente
    development: process.env.NEXT_PUBLIC_API_URL_DEV || 'https://localhost:7073',
    production: process.env.NEXT_PUBLIC_API_URL_PROD || 'https://orchestra.agreeablesmoke-0a2944b9.westus2.azurecontainerapps.io',
    
    // Timeout da API
    timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000'),
    
    // Headers padrão
    headers: {
      'Content-Type': 'application/json',
    },
  },
  
  // Nome da aplicação
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'Orchestra',
  
  // Versão da aplicação
  appVersion: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  
  // Configurações de debug
  debug: {
    enabled: process.env.NODE_ENV === 'development',
    logApiCalls: process.env.NEXT_PUBLIC_DEBUG_API === 'true',
    logEnvironment: process.env.NEXT_PUBLIC_DEBUG_ENV === 'true',
  },
} as const;

// Função para determinar a URL da API baseada no ambiente
function getApiUrlByEnvironment(): string {
  const env = process.env.NODE_ENV || 'development';
  
  if (env === 'production') {
    return process.env.NEXT_PUBLIC_API_URL_PROD || 'https://orchestra.agreeablesmoke-0a2944b9.westus2.azurecontainerapps.io';
  }
  
  // development ou qualquer outro ambiente
  return process.env.NEXT_PUBLIC_API_URL_DEV || 'https://localhost:7073';
}

// Tipos para as configurações
export type Config = typeof config;

// Função helper para verificar o ambiente
export const isProduction = () => config.isProduction;
export const isDevelopment = () => config.isDevelopment;
export const getEnvironment = () => config.env;

// Função helper para obter a URL da API atual
export const getApiUrl = () => config.api.url;

// Função helper para obter configurações da API
export const getApiConfig = () => config.api; 