import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { swaggerConfig } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const nodeEnv = configService.get('NODE_ENV');

  if (nodeEnv === 'development') {
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, document, {
      customSiteTitle: 'Access Billing API Documentation',
      customfavIcon: 'https://nestjs.com/img/favicon.png',
      customJs: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.20.5/swagger-ui-bundle.min.js',
      ],
      customCssUrl: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.20.5/swagger-ui.min.css',
      ],
    });
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
