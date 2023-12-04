import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Reservation, ReservationSchema } from './schema/reservations.schema';
import { ReservationService } from './reservations.service';
import { ReservationController } from './reservations.controller';
import { ReservationMapper } from './mapper/reservations.mapper';
import { BarberModule } from 'src/barber/barber.module';
import { JwtService } from '@nestjs/jwt';
@Module({
	imports: [BarberModule,
		MongooseModule.forFeature([
			{
				name: Reservation.name,
				schema: ReservationSchema
			}
		])],
	controllers: [ReservationController],
	providers: [ReservationService, JwtService,ReservationMapper]
})
export class ReservationModule { }