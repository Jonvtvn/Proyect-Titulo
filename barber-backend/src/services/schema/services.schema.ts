import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type ServiceDocument = HydratedDocument<Service>;

@Schema()
export class Service {
	@Prop({ required:true})
	idService:string;
	@Prop({ required: true })
	name: string
	@Prop({ required: true })
	price: string;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);