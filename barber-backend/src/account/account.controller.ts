import { Body, Controller, Delete, Get, Post, Patch, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { AuthService } from './auth/auth.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { GetAccountDto } from './dto/get-account.dto';
import { DeleteAccountDto } from './dto/delete-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { LoginAccountDto } from './dto/login-account.dto';
import { JwtAuthGuard } from './auth/admin.guard';

@Controller('account')
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly authService: AuthService,
  ) { }

  @Post('createAccount')
  // @UseGuards(JwtAuthGuard)
  async createUser(@Body() createUserDto: CreateAccountDto) {
    return await this.accountService.create(createUserDto);
  }

  @Get('getAccount')
  @UseGuards(JwtAuthGuard)
  async getAccount(@Body() params: GetAccountDto) {
    const ress = await this.accountService.getAccount(params.idAccount);
    return ress;
  }

  @Delete('deleteAccount')
  @UseGuards(JwtAuthGuard)
  async deleteAccount(@Body() params: DeleteAccountDto) {
    const ress = await this.accountService.deleteAccount(params.idAccount);
    return ress;
  }

  @Patch('updateAccount')
  @UseGuards(JwtAuthGuard)
  async updateAccount(@Body() params: UpdateAccountDto) {
    const ress = await this.accountService.updateAccount(params);
    return ress;
  }

  @Post('loginAccount')

  async loginAccount(@Body() params: LoginAccountDto) {
    const ress = await this.authService.login(params)
    console.log(ress)
    return ress;
  }
}