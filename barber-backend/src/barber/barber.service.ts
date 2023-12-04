import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Barber } from "./schema/barber.schema";
import { Model } from "mongoose";
import { BarberMapper } from "./mapper/barber.mapper";
import { CreateBarberDto } from "./dto/create-barber.dto";
import { UpdateBarberDto } from "./dto/update-barber.dto";

@Injectable()
export class BarberService {
    constructor(
        @InjectModel(Barber.name) private barberModel: Model<Barber>,
        private readonly barberMapper: BarberMapper
    ) {}
    async createBarber(barberDto: CreateBarberDto): Promise<Barber> {
        console.log('service '+JSON.stringify(barberDto))
        const mappedBarber = this.barberMapper.toEntity(barberDto);
        const createdBarber = new this.barberModel(mappedBarber);
        return createdBarber.save();
      }

    async getAllBarber(): Promise<Partial<Barber>[]>  {
        return await this.barberModel.find({}, 'idBarber name email phoneNumber profileImage').exec();
    }
    async getBarber(id: string): Promise<Barber> {
        return await this.barberModel.findOne({ idBarber: id }).exec();
    }

    async deleteBarber(id: string): Promise<any> {
        return await this.barberModel.deleteOne({ idBarber: id });
    }

    async updateBarber(newBarber: UpdateBarberDto): Promise<any> {
        const barber = this.barberMapper.toUpdateEntity(newBarber);
        return await this.barberModel.updateOne({ idBarber: newBarber.idBarber }, barber);
    }
}
