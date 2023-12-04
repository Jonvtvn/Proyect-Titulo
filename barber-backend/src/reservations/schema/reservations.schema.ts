import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Services } from '../type/reservations-services.type';

export type ReservationDocument = HydratedDocument<Reservation>;

@Schema()
export class Reservation {
	@Prop({ required: true })
	idReservation: string;
	@Prop({ required: true })
	idBarber: string;
	@Prop({ required: true })
	firstname: string;
	@Prop({ required: true })
	lastname: string;
	@Prop({ required: true })
	email: string;
	@Prop({ required: true })
	phoneNumber: string;
	@Prop({ required: true })
	status: string;
	@Prop({ required: true })
	reservationTime: Date;
	@Prop({ required: true, type: Object })
	services: Services;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);