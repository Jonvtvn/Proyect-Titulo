import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from 'uuid'
import { UpdateQuery } from "mongoose";
import { CreateContactDto } from "../dto/create-contact.dto";
import { Contact } from "../schema/contact.schema";
import { UpdateContactDto } from "../dto/update-contact.dto";

@Injectable()
export class ContactMapper {
	constructor() { }
	async toEntity(contact: CreateContactDto) {
		const { message,user_email,user_name } = contact
		
			const ress = new Contact();
			ress.message = message
			ress.user_email = user_email;
			ress.user_name = user_name;
			ress.idContact = uuidv4();
			return ress;
		
	}
	toUpdateEntity(newReservaton: UpdateContactDto) {
		const { message,user_email,user_name } = newReservaton;
		const partialContact: Partial<Contact> = {};
		if (message) {
			partialContact.message = message;
		}
		if (user_email) {
			partialContact.user_email = user_email
		}
		if (user_name) {
			partialContact.user_name = user_name
		}
		
		const ress: UpdateQuery<Contact> = {
			$set: {
				message: partialContact.message,
				user_email: partialContact.user_email,
				user_name: partialContact.user_name
			}
		}
		return ress
    }
}

