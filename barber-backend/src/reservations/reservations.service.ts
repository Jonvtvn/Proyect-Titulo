import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Reservation } from "./schema/reservations.schema";
import { Model } from "mongoose";
import { ReservationMapper } from "./mapper/reservations.mapper";
import { CreateReservationDto } from "./dto/create-reservation.dto";
import { UpdateReservationDto } from "./dto/update-reservation.dto";

@Injectable()
export class ReservationService {
	constructor(
		@InjectModel(Reservation.name) private reservationModel:Model<Reservation>,
		private readonly reservationMapper:ReservationMapper
	) {}
	async create(createReservationDto:CreateReservationDto){
		console.log(createReservationDto)
		const reservation = await this.reservationMapper.toEntity(createReservationDto)
		
		const createReservation = new this.reservationModel(reservation)
		return await createReservation.save()
	}
	async getReservation(id:string) {
		return await this.reservationModel.findOne({idReservation:id}).exec()
	}
	async getAllReservation(){
		return await this.reservationModel.find({Reservation}).exec()
	}
	async deleteReservation(id:string){
		return await this.reservationModel.deleteOne({idReservation:id})
	}
	async updateReservation(newReservaton:UpdateReservationDto){
		const reservation = await this.reservationMapper.toUpdateEntity(newReservaton);
		return await this.reservationModel.updateOne({idReservation:newReservaton.idReservation},reservation)
	}
}	