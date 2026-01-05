import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';

import { Observable, tap } from 'rxjs';
import { MetricsService } from 'src/metrics/metrics.service';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  private readonly logger = new Logger(MetricsInterceptor.name);

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
        this.logger.debug('Metric captured', {
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
          this.logger.error('Failed to persist internal metric', error.stack || error.message, {
            serviceId,
            method,
            route,
          });
        });
      }),
    );
  }
}

