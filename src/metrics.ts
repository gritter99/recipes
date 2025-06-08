import { Request, Response, NextFunction } from 'express';
import client from 'prom-client';

// Cria um Registro para nossas métricas
export const register = new client.Registry();

// Habilita a coleta de métricas padrão
client.collectDefaultMetrics({ register });

// MÉTRICA 1: Contador de requisições HTTP
export const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'path', 'status_code'],
});

// MÉTRICA 2: Histograma para medir a duração das requisições (NOVO)
export const httpRequestDurationSeconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'path', 'status_code'],
  // Define os "baldes" de tempo em segundos para agrupar as durações
  buckets: [0.1, 0.5, 1, 2, 5],
});

// Registra as duas métricas
register.registerMetric(httpRequestsTotal);
register.registerMetric(httpRequestDurationSeconds); // <-- Registra a nova métrica

// Cria um middleware para ser usado pelo Express
export const collectMetricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Inicia o timer usando nosso novo histograma (ALTERADO)
  const end = httpRequestDurationSeconds.startTimer();

  res.on('finish', () => {
    const path = req.route?.path || req.path;

    // Incrementa o contador de requisições
    httpRequestsTotal.inc({
      method: req.method,
      path: path,
      status_code: res.statusCode,
    });

    // Finaliza o timer de duração, registrando o tempo com os labels corretos
    end({
      method: req.method,
      path: path,
      status_code: res.statusCode,
    });
  });

  next();
};