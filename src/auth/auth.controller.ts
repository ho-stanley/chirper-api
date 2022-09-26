import { Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { RequestJwt } from 'src/utils/typings/request-jwt';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('/login')
  async login(@Req() req: RequestJwt) {
    return this.authService.login(req.user);
  }
}
