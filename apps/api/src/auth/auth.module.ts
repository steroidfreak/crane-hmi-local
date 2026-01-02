import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    // ConfigModule isGlobal is already set in AppModule, but importing here is OK and explicit
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'changeme'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRES_IN', '1d'),
        },
      }),
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  // ✅ IMPORTANT: export JwtModule so JwtService is available to the global guard (APP_GUARD)
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
