import { config, isProduction, isDevelopment, getEnvironment, getApiUrl, getApiConfig } from '@/lib/config';

/**
 * Hook personalizado para acessar configurações de ambiente
 */
export const useEnvironment = () => {
  return {
    // Configurações básicas
    config,
    
    // Verificações de ambiente
    isProduction: isProduction(),
    isDevelopment: isDevelopment(),
    environment: getEnvironment(),
    
    // Helpers úteis
    isLocal: isDevelopment(),
    isProd: isProduction(),
    
    // Configurações específicas
    apiUrl: getApiUrl(),
    apiConfig: getApiConfig(),
    appName: config.appName,
    appVersion: config.appVersion,
    
    // Funções utilitárias
    logEnvironment: () => {
      if (isDevelopment()) {
        console.log('Ambiente de Desenvolvimento');
        console.log('API URL:', getApiUrl());
        console.log('App:', config.appName, 'v' + config.appVersion);
        console.log('Configurações da API:', getApiConfig());
      }
    },
    
    // Verificar se deve mostrar logs de debug
    shouldShowDebugLogs: () => isDevelopment(),
    
    // Verificar se deve usar cache
    shouldUseCache: () => isProduction(),
    
    // Funções específicas da API
    getApiUrl,
    getApiConfig,
  };
}; 