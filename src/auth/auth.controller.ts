import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    return;
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req, @Res() res) {
    return;
    // return res.redirect('http://localhost:3001' + req.token);
  }
}
