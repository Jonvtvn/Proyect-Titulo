import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Barber, BarberSchema } from './schema/barber.schema';
import { BarberController } from './barber.controller';
import { BarberService } from './barber.service';
import { BarberMapper } from './mapper/barber.mapper';
import { JwtService } from '@nestjs/jwt';
@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: Barber.name,
				schema: BarberSchema
			}
		])],
	controllers: [BarberController],
	providers: [BarberService,JwtService, BarberMapper],
	exports:[BarberService]
})
export class BarberModule { }