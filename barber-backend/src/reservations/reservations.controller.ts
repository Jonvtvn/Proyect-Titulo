import { Body, Controller, Delete, Get, Patch, Post, UseGuards } from "@nestjs/common";
import { ReservationService } from "./reservations.service";
import { CreateReservationDto } from "./dto/create-reservation.dto";
import { GetReservationDto } from "./dto/get-reservation.dto";
import { DeleteReservationDto } from "./dto/delete.reservation.dto";
import { UpdateReservationDto } from "./dto/update-reservation.dto";
import { JwtAuthGuard } from "src/account/auth/admin.guard";

@Controller('reservation')
export class ReservationController {
    constructor(private readonly reservationService: ReservationService) { }
    @Post('createReservation')
    async createReservation(@Body() createReservationDto: CreateReservationDto) {
        return await this.reservationService.create(createReservationDto)
    }
    @Get('getReservation')
    @UseGuards(JwtAuthGuard)
    async getReservation(@Body() params: GetReservationDto) {
        return await this.reservationService.getReservation(params.id)
    }
    @Get('getAllReservations')
    async getAllReservations() {
        return await this.reservationService.getAllReservation()
    }
    @Delete('deleteReservation')
    @UseGuards(JwtAuthGuard)
    async deleteReservation(@Body() param: DeleteReservationDto) {
        return await this.reservationService.deleteReservation(param.id)
    }
    @Patch('updateReservation')
    @UseGuards(JwtAuthGuard)
    async updateReservation(@Body() param: UpdateReservationDto) {
        return await this.reservationService.updateReservation(param)
    }
}