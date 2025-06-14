import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { PgInstrumentation } from '@opentelemetry/instrumentation-pg';

// Não vamos mais importar 'Resource' ou 'semantic-conventions' aqui.
// A configuração será feita diretamente no SDK.

const sdk = new NodeSDK({
  // A configuração do nome do serviço é passada diretamente para o SDK.
  // Ele cuidará de criar o recurso internamente.
  serviceName: 'recipes-api',

  // O exportador de traces permanece o mesmo.
  traceExporter: new OTLPTraceExporter({
    url: 'http://tempo:4317',
  }),

  // As instrumentações permanecem as mesmas.
  instrumentations: [
    new ExpressInstrumentation(),
    new HttpInstrumentation(),
    new PgInstrumentation(),
  ],
});

// O resto do arquivo permanece igual.
sdk.start();
console.log('Tracing initialized');
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.log('Error terminating tracing', error))
    .finally(() => process.exit(0));
});