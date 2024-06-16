import {
  Controller,
  Get,
  UseGuards,
  Req,
  Res,
  Headers,
  Post,
} from '@nestjs/common';
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

  @Post()
  verify(@Headers('Authorization') token: string) {
    return this.authService.validateToken(token);
  }
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req, @Res() res) {
    console.log(req.user.providerId);
    await this.authService.assignAccessToken(req.user);
    const token = await this.authService.createAccessToken(req.user);

    return res.redirect(process.env.CLIENT_PORT + `?token=${token}`);
  }
}
