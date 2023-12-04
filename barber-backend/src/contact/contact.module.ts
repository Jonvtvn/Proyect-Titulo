import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { ContactMapper } from './mapper/contact.mapper';
import { Contact, ContactSchema } from './schema/contact.schema';
import { JwtService } from '@nestjs/jwt';
@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: Contact.name,
				schema: ContactSchema
			}
		])],
	controllers: [ContactController],
	providers: [ContactService,JwtService, ContactMapper]
})
export class ContactModule { }