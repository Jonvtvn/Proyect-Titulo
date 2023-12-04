import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AccountModule } from './account/account.module';
import { ReservationModule } from './reservations/reservations.module';
import { BarberModule } from './barber/barber.module';
import { ServicesModule } from './services/services.module';
import { ContactModule } from './contact/contact.module';
import { AuthService } from './account/auth/auth.service';
import { JwtAuthGuard } from './account/auth/admin.guard';
import { JwtStrategy } from './account/auth/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: `${process.env.TOKEN_SECRETKEY}`,
      signOptions: { expiresIn: '1h' },
    }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: `${process.env.MONGO_URL}`,
      }),
    }),
    AccountModule,
    ReservationModule,
    BarberModule,
    ServicesModule,
    ContactModule,
  ],
  controllers: [],
  providers: [AuthService, JwtAuthGuard,JwtStrategy],
})
export class AppModule {}
