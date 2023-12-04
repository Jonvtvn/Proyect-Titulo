import { Body, Controller, Delete, Get, Patch, Post, UseGuards } from "@nestjs/common";
import { ContactService } from "./contact.service";
import { CreateContactDto } from "./dto/create-contact.dto";
import { GetContactDto } from "./dto/get-contact.dto";
import { DeleteContactDto } from "./dto/delete-contact.dto";
import { UpdateContactDto } from "./dto/update-contact.dto";
import { JwtAuthGuard } from "src/account/auth/admin.guard";

@Controller('contacts')
export class ContactController {
    constructor(private readonly contactService: ContactService) { }
    @Post('createContact')
    async createContact(@Body() createContactDto: CreateContactDto) {
        return await this.contactService.createContact(createContactDto)
    }
    @Get('getContact')
    @UseGuards(JwtAuthGuard)
    async getContact(@Body() params: GetContactDto) {
        return await this.contactService.getContact(params.id)
    }
    @Get('getAllContacts')
    async getAllContacts() {
        return await this.contactService.getAllContacts()
    }
    @Delete('deleteContact')
    @UseGuards(JwtAuthGuard)
    async deleteContact(@Body() param: DeleteContactDto) {
        return await this.contactService.deleteContact(param.id)
    }
    @Patch('updateContact')
    @UseGuards(JwtAuthGuard)
    async updateContact(@Body() param: UpdateContactDto) {
        return await this.contactService.updateContact(param)
    }
}