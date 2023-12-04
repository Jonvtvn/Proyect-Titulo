import { UpdateQuery } from "mongoose";
import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from 'uuid'
import { CreateServiceDto } from "../dto/create-service.dto";
import { Service } from "../schema/services.schema";
import { UpdateServiceDto } from "../dto/update-service.dto";

@Injectable()
export class ServiceMapper {
  constructor(){}
  async toEntity(createServiceDto: CreateServiceDto):Promise<Service> {
    
	const { name , price} = createServiceDto
    const service = new Service();
    service.price = price;
    service.name = name;
    service.idService = uuidv4()
    return service;
}
  toUpdateEntity(updateServiceDto: UpdateServiceDto): UpdateQuery<Service> {
    
    const { name, price } = updateServiceDto;
    const service: Partial<Service> = {};
    if (name) {
      service.name = name;
    }
		if(price) {
			service.price = price
		}
    const ress:UpdateQuery<Service> = {
				$set:{
					price:service.price,
					name:service.name
				}
			}
    return ress;
  }
}

