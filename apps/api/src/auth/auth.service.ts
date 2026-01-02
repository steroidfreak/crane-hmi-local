import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthTokenPayload, LoginResponse } from '@crane/common';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService, private readonly configService: ConfigService) {}

  async login(username: string, password: string): Promise<LoginResponse> {
    const allowedUser = this.configService.get<string>('AUTH_USERNAME', 'admin');
    const allowedPassword = this.configService.get<string>('AUTH_PASSWORD', 'admin');

    if (username !== allowedUser || password !== allowedPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN', '1d');
    const payload: AuthTokenPayload = { sub: username, role: 'operator' };
    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET', 'changeme'),
      expiresIn,
    });

    return { token, expiresIn: this.parseExpirySeconds(expiresIn) };
  }

  private parseExpirySeconds(input: string): number {
    const match = input.match(/^(\d+)([smhd])?$/);
    if (!match) return 0;
    const value = Number(match[1]);
    const unit = match[2] ?? 's';
    const multipliers: Record<string, number> = { s: 1, m: 60, h: 3600, d: 86400 };
    return value * (multipliers[unit] ?? 1);
  }
}
