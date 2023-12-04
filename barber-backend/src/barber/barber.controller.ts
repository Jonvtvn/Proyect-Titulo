import { Controller, Post, UseGuards, Body, Get, Delete, Patch } from '@nestjs/common';
import { CreateBarberDto } from './dto/create-barber.dto';
import { BarberService } from './barber.service';
import { GetBarberDto } from './dto/get-barber.dto';
import { DeleteBarberDto } from './dto/delete-barber.dto';
import { UpdateBarberDto } from './dto/update-barber.dto';
import { JwtAuthGuard } from '../account/auth/admin.guard';

@Controller('barber')
export class BarberController {
	constructor(private readonly barberService: BarberService) { }

	@Post('createBarber')
	@UseGuards(JwtAuthGuard)
	async createBarber(@Body() barber: CreateBarberDto): Promise<any> {
		console.log('controller ' + JSON.stringify(barber))
		return this.barberService.createBarber(barber);
	}
	@Get('getAllBarber')
	async getAllBarber() {
		return await this.barberService.getAllBarber();
	}
	@Get('getBarber')
	@UseGuards(JwtAuthGuard)
	async getBarber(@Body() params: GetBarberDto) {
		return await this.barberService.getBarber(params.id);
	}

	@Delete('deleteBarber')
	@UseGuards(JwtAuthGuard)
	async deleteBarber(@Body() param: DeleteBarberDto) {
		return await this.barberService.deleteBarber(param.id);
	}

	@Patch('updateBarber')
	@UseGuards(JwtAuthGuard)
	async updateBarber(@Body() param: UpdateBarberDto) {
		return await this.barberService.updateBarber(param);
	}
}
