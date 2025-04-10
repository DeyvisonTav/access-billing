import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Access Billing API')
  .setDescription(`
    API para gerenciamento de boletos do condomínio.
    
    Funcionalidades
    - Importação de boletos via CSV
    - Importação de boletos via PDF
    - Listagem de boletos com filtros
    - Geração de relatórios em PDF
    
    Autenticação
    Esta API não requer autenticação.
    
    Formato de Dados
    - CSV: Arquivo CSV com cabeçalho contendo as colunas necessárias
    - PDF: Arquivo PDF contendo os boletos
    - JSON: Respostas da API são em formato JSON, exceto para relatórios PDF
    
     Códigos de Resposta
    - 200: Sucesso
    - 201: Criado com sucesso
    - 400: Dados inválidos
    - 500: Erro interno do servidor
  `)
  .setVersion('1.0')
  .addTag('boletos', 'Operações relacionadas a boletos')
  .addTag('importação', 'Operações de importação de boletos')
  .addTag('relatórios', 'Operações de geração de relatórios')
  .build(); 