import { Body, Controller, Delete, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { GetServiceDto } from './dto/get-service.dto';
import { DeleteServiceDto } from './dto/delete-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from 'src/account/auth/admin.guard';

@Controller('services')
export class ServiceController {
	constructor(private readonly servicesService: ServicesService) { }
	@Post('createService')
	@UseGuards(JwtAuthGuard)
	createService(@Body() createServiceDto: CreateServiceDto) {
		return this.servicesService.create(createServiceDto);
	}
	@Get('getService')
	async getService(@Body() params: GetServiceDto) {
		const ress = await this.servicesService.getService(params.idService)
		return ress
	}
	@Get('getAllService')
	async getAllService() {
		const ress = await this.servicesService.getAllService()
		return ress
	}
	@Delete('deleteService')
	@UseGuards(JwtAuthGuard)
	async deleteService(@Body() params: DeleteServiceDto) {
		const ress = await this.servicesService.deleteService(params.idService)
		return ress
	}
	@Patch('updateService')
	@UseGuards(JwtAuthGuard)
	async updateService(@Body() param: UpdateServiceDto) {
		const ress = await this.servicesService.updateService(param)
		return ress
	}
}