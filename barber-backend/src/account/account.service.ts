import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Account } from './schema/account.schema';
import { CreateAccountDto } from './dto/create-account.dto'
import * as bcrypt from 'bcrypt';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountMapper } from './mapper/account.mapper';
@Injectable()
export class AccountService {
	constructor(
		@InjectModel(Account.name) private accountModel: Model<Account>,
		private readonly accountMapper: AccountMapper) { }

	async create(createAccountDto: CreateAccountDto): Promise<Account> {
		const x = await this.accountModel.findOne({ email: createAccountDto.email })
		if (!x) {
			const account = await this.accountMapper.toEntity(createAccountDto)
			const createdUser = new this.accountModel(account);
			return await createdUser.save();
		} else {
			throw new Error("Usuario ya existente")
		}

	}
	async getAccount(id: string) {
		return await this.accountModel.findOne({ idAccount: id }).exec();

	}
	async findByEmail(email: string): Promise<Account | null> {
		return await this.accountModel.findOne({ email }).exec();
	}

	async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
		return bcrypt.compare(password, hashedPassword);
	}
	async deleteAccount(id: string) {
		return await this.accountModel.deleteOne({ idAccount: id })

	}
	async updateAccount(newAccount: UpdateAccountDto) {
		const account = await this.accountMapper.toUpdateEntity(newAccount)
		return await this.accountModel.updateOne({ idAccount: newAccount.idAccount }, account)
	}

}
