import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { Service } from './schema/services.schema';
import { ServiceMapper } from './mapper/services.mapper';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
@Injectable()
export class ServicesService {
	constructor(
		@InjectConnection() private connection: Connection,
		@InjectModel(Service.name) private serviceModel: Model<Service>,
		private readonly serviceMapper: ServiceMapper
	) { }

	async create(createServiceDto: CreateServiceDto): Promise<Service> {
		const service = await this.serviceMapper.toEntity(createServiceDto)
		const createdUser = new this.serviceModel(service);
		return createdUser.save();
	}
	async getAllService() {
		return await this.serviceModel.find().exec();

	}
	async getService(id: string) {
		return await this.serviceModel.findOne({ idService: id }).exec();

	}
	async deleteService(id: string) {
		return await this.serviceModel.deleteOne({ idService: id })

	}
	async updateService(newService: UpdateServiceDto) {
		const service = await this.serviceMapper.toUpdateEntity(newService)
		return await this.serviceModel.updateOne({ idUser: newService.idService }, service)
	}
}
