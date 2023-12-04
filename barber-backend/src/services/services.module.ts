import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountModule } from 'src/account/account.module';
import { Service, ServiceSchema } from './schema/services.schema';
import { ServiceController } from './services.controller';
import { ServicesService } from './services.service';
import { ServiceMapper } from './mapper/services.mapper';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../account/auth/admin.guard';
@Module({
	imports: [AccountModule,
		MongooseModule.forFeature([
			{
				name: Service.name,
				schema: ServiceSchema
			}
		])],
	controllers: [ServiceController],
	providers: [ServicesService,JwtService,ServiceMapper,JwtAuthGuard],
})
export class ServicesModule { }
