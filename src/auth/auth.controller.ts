import { Body, Controller, Post } from '@nestjs/common';
import { AuthDto } from './auth.dto';
import { AuthService } from './auth.service';
import { Public } from './public.metadata';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @Public()
    @Post()
    authorize(@Body() authDto: AuthDto) {
        return this.authService.authorize(authDto);
    }
}
