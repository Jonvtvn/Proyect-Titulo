import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BarberDocument = HydratedDocument<Barber>;
@Schema()
export class Barber {
    @Prop({ required:true })
    idBarber: string;

    @Prop({ required: true})
    name: string;

    @Prop({ required: true})
    email: string;

    @Prop({ required: true})
    phoneNumber: string;

    @Prop({ required: true})
    profileImage: string;
}

export const BarberSchema = SchemaFactory.createForClass(Barber);
