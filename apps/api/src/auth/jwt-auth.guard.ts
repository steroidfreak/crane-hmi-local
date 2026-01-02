import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthTokenPayload } from '@crane/common';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const token = this.extractToken(context);
    if (!token) {
      throw new UnauthorizedException('Missing bearer token');
    }

    try {
      const payload = this.jwtService.verify<AuthTokenPayload>(token, {
        secret: this.configService.get<string>('JWT_SECRET', 'changeme'),
      });
      this.attachUser(context, payload);
      return true;
    } catch (error) {
      throw new UnauthorizedException((error as Error).message);
    }
  }

  private extractToken(context: ExecutionContext): string | null {
    if (context.getType() === 'ws') {
      const client: any = context.switchToWs().getClient();
      const header = client?.handshake?.headers?.authorization as string | undefined;
      const headerToken = this.parseBearer(header);
      if (headerToken) return headerToken;
      const authToken = client?.handshake?.auth?.token as string | undefined;
      if (authToken) return this.stripBearer(authToken);
      const queryToken = client?.handshake?.query?.token as string | undefined;
      if (queryToken) return this.stripBearer(queryToken);
      return null;
    }

    const request = context.switchToHttp().getRequest();
    const header = request.headers?.authorization as string | undefined;
    const headerToken = this.parseBearer(header);
    if (headerToken) return headerToken;
    const queryToken = typeof request.query?.token === 'string' ? request.query.token : undefined;
    return queryToken ? this.stripBearer(queryToken) : null;
  }

  private parseBearer(input?: string | string[]): string | null {
    if (!input) return null;
    const value = Array.isArray(input) ? input[0] : input;
    return this.stripBearer(value);
  }

  private stripBearer(token?: string): string | null {
    if (!token) return null;
    return token.startsWith('Bearer ') ? token.slice(7) : token;
  }

  private attachUser(context: ExecutionContext, payload: AuthTokenPayload) {
    if (context.getType() === 'ws') {
      const client: any = context.switchToWs().getClient();
      client.user = payload;
    } else {
      const request = context.switchToHttp().getRequest();
      request.user = payload;
    }
  }
}
