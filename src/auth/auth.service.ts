import { Injectable, Logger, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt'
import { AuthDto } from './auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService implements OnModuleInit {
    private hashedPassword: string;
    private readonly logger: Logger;

    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService) {
        this.logger = new Logger(AuthService.name);
    }

    async onModuleInit() {
        const readAuthorizationPassword = this.configService.get<string>('AUTHORIZATION_PASSWORD');
        if (readAuthorizationPassword === undefined) {
            throw new Error('AUTHORIZATION_PASSWORD not specified in .env file');
        }
        this.hashedPassword = await bcrypt.hash(readAuthorizationPassword, 10);
    }

    async authorize(authDto: AuthDto) {
        await this.validateGuest(authDto);
        return await this.generateJwt();
    }

    async validateGuest(authDto: AuthDto) {
        if (await bcrypt.compare(authDto.password, this.hashedPassword) !== true) {
            this.logger.log("Guest not authorized");
            throw new UnauthorizedException();
        }
        this.logger.log("Guest authorized");
    }

    async generateJwt() {
        const payload = { username: 'guest' };
        return {
            accessToken: await this.jwtService.signAsync(payload)
        };
    }
}
