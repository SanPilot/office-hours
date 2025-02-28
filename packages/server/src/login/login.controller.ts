import { KhouryDataParams, KhouryRedirectResponse } from '@koh/common';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as Sentry from '@sentry/node';
import { Request, Response } from 'express';
import * as httpSignature from 'http-signature';
import { Connection } from 'typeorm';
import { NonProductionGuard } from '../../src/non-production.guard';
import { LoginCourseService } from './login-course.service';

@Controller()
export class LoginController {
  constructor(
    private connection: Connection,
    private loginCourseService: LoginCourseService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  @Post('/khoury_login')
  async recieveDataFromKhoury(
    @Req() req: Request,
    @Body() body: KhouryDataParams,
  ): Promise<KhouryRedirectResponse> {
    if (process.env.NODE_ENV === 'production') {
      // Check that request has come from Khoury
      const parsedRequest = httpSignature.parseRequest(req);
      const verifySignature = httpSignature.verifyHMAC(
        parsedRequest,
        this.configService.get('KHOURY_PRIVATE_KEY'),
      );
      if (!verifySignature) {
        Sentry.captureMessage('Invalid request signature: ' + parsedRequest);
        throw new UnauthorizedException('Invalid request signature');
      }

      // TODO: IP validation isn't working on prod, need to look into later

      // This checks if the request is coming from one of the khoury servers
      // const verifyIP = this.configService
      //   .get('KHOURY_SERVER_IP')
      //   .includes(req.ip);
      // if (!verifyIP) {
      //   Sentry.captureMessage(
      //     'The IP of the request does not seem to be coming from the Khoury server: ' +
      //       req.ip,
      //   );
      //   throw new UnauthorizedException(
      //     'The IP of the request does not seem to be coming from the Khoury server',
      //   );
      // }
    }

    let user;
    try {
      user = await this.loginCourseService.addUserFromKhoury(body);
    } catch (e) {
      Sentry.captureException(e);
      console.error('Khoury login threw an exception, the body was ', body);
      throw e;
    }

    // Create temporary login token to send user to.
    const token = await this.jwtService.signAsync(
      { userId: user.id },
      { expiresIn: 60 },
    );
    return {
      redirect:
        this.configService.get('DOMAIN') + `/api/v1/login/entry?token=${token}`,
    };
  }

  // NOTE: Although the two routes below are on the backend,
  // they are meant to be visited by the browser so a cookie can be set

  // This is the real admin entry point
  @Get('/login/entry')
  async enterFromKhoury(
    @Res() res: Response,
    @Query('token') token: string,
  ): Promise<void> {
    const isVerified = await this.jwtService.verifyAsync(token);

    if (!isVerified) {
      throw new UnauthorizedException();
    }

    const payload = this.jwtService.decode(token) as { userId: number };

    this.enter(res, payload.userId);
  }

  // This is for login on development only
  @Get('/login/dev')
  @UseGuards(NonProductionGuard)
  async enterFromDev(
    @Res() res: Response,
    @Query('userId') userId: number,
  ): Promise<void> {
    this.enter(res, userId);
  }

  // Set cookie and redirect to proper page
  private async enter(res: Response, userId: number) {
    // Expires in 30 days
    const authToken = await this.jwtService.signAsync({
      userId,
      expiresIn: 60 * 60 * 24 * 30,
    });
    const isSecure = this.configService
      .get<string>('DOMAIN')
      .startsWith('https://');
    res
      .cookie('auth_token', authToken, { httpOnly: true, secure: isSecure })
      .redirect(302, '/');
  }

  @Get('/logout')
  async logout(@Res() res: Response): Promise<void> {
    const isSecure = this.configService
      .get<string>('DOMAIN')
      .startsWith('https://');
    res
      .clearCookie('auth_token', { httpOnly: true, secure: isSecure })
      .redirect(302, '/login');
  }
}
