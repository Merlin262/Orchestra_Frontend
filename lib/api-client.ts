import { getApiUrl, getApiConfig, isDevelopment } from '@/lib/config';

/**
 * Cliente de API que usa as configurações de ambiente
 */
class ApiClient {
  private _baseUrl: string;
  private config: ReturnType<typeof getApiConfig>;

  constructor() {
    this._baseUrl = getApiUrl();
    this.config = getApiConfig();
  }

  // Expor a baseUrl para casos especiais como upload de arquivos
  get baseUrl() {
    return this._baseUrl;
  }

  /**
   * Faz uma requisição HTTP
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this._baseUrl}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        ...this.config.headers,
        ...options.headers,
      },
    };

    const finalOptions = { ...defaultOptions, ...options };

    // Log da requisição apenas em desenvolvimento
    if (isDevelopment()) {
      console.log(`🌐 API Request: ${finalOptions.method || 'GET'} ${url}`);
      if (finalOptions.body) {
        console.log('📦 Request Body:', finalOptions.body);
      }
    }

    try {
      const response = await fetch(url, finalOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Log da resposta apenas em desenvolvimento
      if (isDevelopment()) {
        console.log(`✅ API Response: ${response.status} ${url}`);
        console.log('📦 Response Data:', data);
      }

      return data;
    } catch (error) {
      // Log do erro apenas em desenvolvimento
      if (isDevelopment()) {
        console.error(`❌ API Error: ${finalOptions.method || 'GET'} ${url}`);
        console.error('🚨 Error:', error);
      }
      throw error;
    }
  }

  /**
   * Upload de arquivo usando FormData
   */
  async uploadFile<T>(endpoint: string, formData: FormData): Promise<T> {
    const url = `${this._baseUrl}${endpoint}`;
    
    // Log da requisição apenas em desenvolvimento
    if (isDevelopment()) {
      console.log(`🌐 API Upload: POST ${url}`);
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Log da resposta apenas em desenvolvimento
      if (isDevelopment()) {
        console.log(`✅ API Upload Response: ${response.status} ${url}`);
        console.log('📦 Response Data:', data);
      }

      return data;
    } catch (error) {
      // Log do erro apenas em desenvolvimento
      if (isDevelopment()) {
        console.error(`❌ API Upload Error: POST ${url}`);
        console.error('🚨 Error:', error);
      }
      throw error;
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

// Instância singleton do cliente de API
export const apiClient = new ApiClient();

// Exporta também a classe para casos onde você precisa de múltiplas instâncias
export { ApiClient }; 