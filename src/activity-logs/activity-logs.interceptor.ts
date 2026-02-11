import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { ActivityLogsService } from './activity-logs.service';
import { ActivityLogsCreateInput } from '../../generated/prisma/models/ActivityLogs';
import { Request, Response } from 'express';

interface RequestWithUser extends Request {
  user?: {
    sub?: number;
    id?: number;
    email?: string;
    role?: string;
    fullName?: string;
    username?: string;
  };
}

@Injectable()
export class ActivityLogsInterceptor implements NestInterceptor {
  constructor(private readonly activityLogsService: ActivityLogsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const response = context.switchToHttp().getResponse<Response>();

    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        void this.handleActivityLog(request, response, startTime);
      }),
    );
  }

  private async handleActivityLog(
    request: RequestWithUser,
    response: Response,
    startTime: number,
  ) {
    try {
      const userId = request.user?.sub || request.user?.id;

      if (!userId) {
        console.log('No user ID found, skipping activity log');
        return;
      }

      const action = this.generateAction(
        request.method,
        request.originalUrl || request.url,
      );

      const activityData: ActivityLogsCreateInput = {
        action,
        metadata: {
          method: request.method,
          url: request.originalUrl || request.url,
          statusCode: response.statusCode,
          durationMs: Date.now() - startTime,
          // body: this.sanitizeBody(request.body),
          actor: {
            id: userId,
            fullName: request.user?.fullName || request.user?.username,
            role: request.user?.role,
            email: request.user?.email,
          },
          timestamp: new Date().toISOString(),
        },
        user: {
          connect: { id: userId },
        },
      };

      await this.activityLogsService.createActivityLog(activityData);
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  }

  private generateAction(method: string, url: string): string {
    const route = url.split('?')[0];

    return `${method.toUpperCase()}_${route
      .replace(/\//g, '_')
      .replace(/^_/, '')
      .toUpperCase()}`;
  }

  // private sanitizeBody(body: any) {
  //   if (!body || typeof body !== 'object') {
  //     return body;
  //   }
  //
  //   const clone = { ...body };
  //
  //   if ('password' in clone) clone.password = '***';
  //   if ('token' in clone) clone.token = '***';
  //
  //   return clone;
  // }
}
