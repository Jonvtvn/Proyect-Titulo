
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountService } from '../account.service';
import { LoginAccountDto } from '../dto/login-account.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
  ) { }

  async validateUser(email: string, password: string): Promise<any> {
    const account = await this.accountService.findByEmail(email);

    if (account && (await this.accountService.validatePassword(password, account.password))) {
      const { password, ...result } = account;
      return result;
    }

    return null;
  }

  async login(loginAccountDto: LoginAccountDto) {
    const user = await this.validateUser(loginAccountDto.email, loginAccountDto.password);

    if (!user) {
      return null;
    }
    const payload = { email: user.email, sub: user._id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}