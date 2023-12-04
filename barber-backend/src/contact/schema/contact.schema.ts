import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type ContactDocument = HydratedDocument<Contact>;
@Schema()
export class Contact {
    @Prop({ required: true })
    idContact:string;
    @Prop({ required: true })
    user_name: string;
    @Prop({ required: true })
    user_email: string;
    @Prop({ required: true })
    message: string;
}

export const ContactSchema = SchemaFactory.createForClass(Contact)
