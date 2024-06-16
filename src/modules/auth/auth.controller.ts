import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  IGenerateTokensResponse,
  IGetNonceResponse,
  ILoginResponse,
} from './interfaces';
import { Network } from '@common/constant';
import { WalletSignatureInputDto } from './dto';
import {
  AccessTokenGuard,
  RefreshTokenGuard,
} from '@common/authentication/authentication.guard';
import { IRequestWithCurrentAccountSession } from '@common/interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Get('/wallet/:walletAddress/nonce')
  getNonce(
    @Param('walletAddress') walletAddress: string,
  ): Promise<IGetNonceResponse> {
    return this.service.getNonce(walletAddress);
  }

  @Post('/:network/login')
  login(
    @Param('network') network: Network,
    @Body() walletSignature: WalletSignatureInputDto,
  ): Promise<ILoginResponse> {
    return this.service.login(network, walletSignature);
  }

  @UseGuards(AccessTokenGuard)
  @Post('/logout')
  logout(@Req() request: IRequestWithCurrentAccountSession): any {
    return this.service.logout(request);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('/refresh')
  refreshAccessToken(
    @Req() request: IRequestWithCurrentAccountSession,
  ): Promise<IGenerateTokensResponse> {
    return this.service.refreshAccessToken(request);
  }
}
