import { Injectable } from "@nestjs/common";
import { Reservation } from "../schema/reservations.schema";
import { v4 as uuidv4 } from 'uuid'
import { CreateReservationDto } from "../dto/create-reservation.dto";
import { UpdateReservationDto } from "../dto/update-reservation.dto";
import { UpdateQuery } from "mongoose";
import { BarberService } from "src/barber/barber.service";

@Injectable()
export class ReservationMapper {
	constructor(
		private readonly barberService: BarberService
	) { }
	async toEntity(createReservationDto: CreateReservationDto) {
		const { userData, idBarber, reservationTime, status, selectedServices } = createReservationDto
		const { firstName, lastName, email, phoneNumber } = userData
		const x = await this.barberService.getBarber(idBarber)
		console.log(x)
		if (!x) {
			throw new Error("idBarber no existe")
		} else {
			const reservation = new Reservation();
			reservation.idBarber = idBarber
			reservation.firstname = firstName;
			reservation.lastname = lastName;
			reservation.phoneNumber = phoneNumber
			reservation.email = email;
			reservation.status = status
			reservation.idReservation = uuidv4();
			reservation.reservationTime = reservationTime
			reservation.services = selectedServices
			reservation.status = "aproved"
			return reservation;
		}
	}
	toUpdateEntity(newReservaton: UpdateReservationDto) {
		const { email, reservationTime, services, status } = newReservaton;
		const partialReservation: Partial<Reservation> = {};
		if (email) {
			partialReservation.email = email;
		}
		if (status) {
			partialReservation.status = status
		}
		if (services) {
			partialReservation.services = services
		}
		if (reservationTime) {
			partialReservation.reservationTime = reservationTime;
		}
		const ress: UpdateQuery<Reservation> = {
			$set: {
				email: partialReservation.email,
				reservationTime: partialReservation.reservationTime,
				status: partialReservation.status,
				services: partialReservation.services
			}
		}
		return ress;
	}
}