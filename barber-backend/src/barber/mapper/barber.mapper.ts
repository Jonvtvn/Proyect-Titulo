import { Injectable } from "@nestjs/common";
import { CreateBarberDto } from "../dto/create-barber.dto";
import { Barber } from "../schema/barber.schema";
import { v4 as uuidv4 } from 'uuid'
import { UpdateBarberDto } from "../dto/update-barber.dto";
import { UpdateQuery } from "mongoose";

@Injectable()
export class BarberMapper {
    toEntity(createBarberDto: CreateBarberDto): Barber {
        const { name, email, phoneNumber, profileImage } = createBarberDto;
        const barber = new Barber();
        barber.idBarber = uuidv4();
        barber.email = email;
        barber.name = name;
        barber.phoneNumber = phoneNumber;
        barber.profileImage = profileImage;

        return barber;
    }

    toUpdateEntity(newBarber: UpdateBarberDto): UpdateQuery<Barber> {
        const { name, email, phoneNumber } = newBarber;
        const partialBarber: Partial<Barber> = {};

        if (email) {
            partialBarber.email = email;
        }

        if (phoneNumber) {
            partialBarber.phoneNumber = phoneNumber;
        }

        if (name) {
            partialBarber.name = name;
        }

        const ress: UpdateQuery<Barber> = {
            $set: {
                email: partialBarber.email,
                name: partialBarber.name,
                phoneNumber: partialBarber.phoneNumber
            }
        };

        return ress;
    }
}