import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from '../dto/create-account.dto';
import { Account } from '../schema/account.schema';
import { UpdateAccountDto } from '../dto/update-account.dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid'
import { UpdateQuery } from 'mongoose';

@Injectable()
export class AccountMapper {
  toEntity(createAccountDto: CreateAccountDto): Account {
    const { email, password } = createAccountDto;
    const salt = bcrypt.genSaltSync(10);
    const passHash = bcrypt.hashSync(password, salt);
    const account = new Account();
    account.idAccount = uuidv4()
    account.email = email;
    account.password = passHash;
    return account;
  }

  toUpdateEntity(updateAccountDto: UpdateAccountDto): UpdateQuery<Account> {
    
    const { email, password } = updateAccountDto;
    const partialAccount: Partial<Account> = {};
    if (email) {
      partialAccount.email = email;
    }
    if (password) {
      const salt = bcrypt.genSaltSync(10);
      const passHash = bcrypt.hashSync(password, salt);
      partialAccount.password = passHash;
    }
    const ress:UpdateQuery<Account> = {
				$set:{
					email: partialAccount.email,
					password: partialAccount.password
				}
			}
    return ress;
  }
}
