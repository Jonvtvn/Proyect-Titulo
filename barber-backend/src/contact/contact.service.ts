import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Contact } from "./schema/contact.schema";
import { UpdateContactDto } from "./dto/update-contact.dto";
import { CreateContactDto } from "./dto/create-contact.dto";
import { ContactMapper } from "./mapper/contact.mapper";
@Injectable()
export class ContactService {
	constructor(
		@InjectModel(Contact.name) private contactModel:Model<Contact>,
		private readonly contactMapper:ContactMapper
	) {}
	async createContact(createContactDto:CreateContactDto){
		console.log(createContactDto)
		const Contact = await this.contactMapper.toEntity(createContactDto)
		
		const createContact = new this.contactModel(Contact)
		return await createContact.save()
	}
	async getContact(id:string) {
		return await this.contactModel.findOne({idContact:id}).exec()
	}
	async getAllContacts(){
		return await this.contactModel.find({Contact}).exec()
	}
	async deleteContact(id:string){
		return await this.contactModel.deleteOne({idContact:id})
	}
	async updateContact(newReservaton:UpdateContactDto){
		const Contact = await this.contactMapper.toUpdateEntity(newReservaton);
		return await this.contactModel.updateOne({idContact:newReservaton.idContact},Contact)
	}
}	