
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { AccountSchema, Account } from './schema/account.schema';
import { AccountMapper } from './mapper/account.mapper';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'src/account/auth/auth.service';
import { JwtAuthGuard } from './auth/admin.guard'; // Ajusta la ruta según la ubicación real

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: `${process.env.TOKEN_SECRETKEY}`,
      signOptions: { expiresIn: '1h' },
    }),
    MongooseModule.forFeature([
      {
        name: Account.name,
        schema: AccountSchema,
      },
    ]),
  ],
  controllers: [AccountController],
  providers: [AccountService, AccountMapper, AuthService, JwtAuthGuard],
  exports: [AccountService, JwtModule, AuthService],
})
export class AccountModule {}