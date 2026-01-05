import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

import { Observable, tap } from 'rxjs';
import { MetricsService } from 'src/metrics/metrics.service';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(private metricsService: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();

    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const route = req.route?.path || req.url;

    const controller = context.getClass();
    const serviceId = controller.name.replace('Controller', '').toLowerCase();

    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - start;
        // Log simples para confirmar execução do interceptor
        console.log('[MetricsInterceptor] metric captured', {
          serviceId,
          method,
          route,
          responseTime,
        });

        this.metricsService.create({
          serviceId,
          method,
          route,
          responseTime,
          origin: 'INTERNAL',
        }).catch((error) => {
          // Não quebrar a requisição caso a gravação da métrica falhe
          console.error('[MetricsInterceptor] failed to persist metric', error);
        });
      }),
    );
  }
}

