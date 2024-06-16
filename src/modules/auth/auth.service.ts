import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { isNil } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { config } from '@config/index';
import { Network } from '@common/constant';
import { WalletSignatureInputDto } from './dto';
import { MESSAGE } from '@common/message';
import { verifyMessageSignature } from '@common/utils';
import { Account, AccountSession } from '@database/entities';
import { JwtService } from '@nestjs/jwt';
import { Transactional } from 'typeorm-transactional';
import {
  IRequestWithCurrentAccountSession,
  ISimpleResponse,
} from '@common/interfaces';
import {
  IGenerateTokensResponse,
  IGetNonceResponse,
  ILoginResponse,
} from './interfaces';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private jwtService: JwtService,
  ) {}

  @Transactional()
  async login(
    network: Network,
    input: WalletSignatureInputDto,
  ): Promise<ILoginResponse> {
    const { signature, walletAddress } = input;
    const nonce: string | undefined = await this.cacheManager.get(
      `wallet:${walletAddress}:nonce`,
    );

    if (isNil(nonce)) {
      throw new UnauthorizedException(MESSAGE.EXPIRED_NONCE);
    }

    if (
      !verifyMessageSignature({
        network,
        message: nonce,
        signature,
        walletAddress,
      })
    ) {
      throw new UnauthorizedException(MESSAGE.CAN_NOT_VERIFY_WALLET_SIGNATURE);
    }

    const account =
      await this.findOrCreateAccountByWalletAddress(walletAddress);

    const session = await this.saveAccountSession(account.id);

    await this.cacheManager.del(`wallet:${walletAddress}:nonce`);

    return this.generateTokens(account, session);
  }

  @Transactional()
  async logout(
    request: IRequestWithCurrentAccountSession,
  ): Promise<ISimpleResponse> {
    const accountSession = await AccountSession.findOne({
      where: {
        id: request.user.sessionId,
        accountId: request.user.id,
      },
    });

    if (!isNil(accountSession)) {
      await AccountSession.delete({ id: accountSession.id });
    }

    return {
      success: true,
    };
  }

  async refreshAccessToken(
    request: IRequestWithCurrentAccountSession,
  ): Promise<IGenerateTokensResponse> {
    const accountSession = await AccountSession.findOne({
      where: {
        id: request.user.sessionId,
        accountId: request.user.id,
      },
    });

    if (isNil(accountSession)) {
      throw new UnauthorizedException();
    }

    const accountInfo = await Account.findOne({
      where: {
        id: request.user.id,
      },
    });

    return this.generateTokens(accountInfo, accountSession);
  }

  async getNonce(walletAddress: string): Promise<IGetNonceResponse> {
    let nonce: string | undefined = await this.cacheManager.get(
      `wallet:${walletAddress}:nonce`,
    );

    if (isNil(nonce)) {
      nonce = uuidv4();

      await this.cacheManager.set(
        `wallet:${walletAddress}:nonce`,
        nonce,
        config.walletNonceTtl,
      );
    }

    return {
      walletAddress,
      nonce,
    };
  }

  private generateTokens(
    account: Account,
    session: AccountSession,
  ): { accessToken: string; refreshToken: string } {
    //TODO [accessToken, refreshToken] = await Promise.all(signAsync)

    const accessToken = this.jwtService.sign(
      { sub: account.id, sessionId: session.id },
      {
        secret: config.jwt.accessToken,
        expiresIn: config.jwt.accessExpiresIn,
      },
    );

    const refreshToken = this.jwtService.sign(
      { sub: account.id, sessionId: session.id },
      {
        secret: config.jwt.refreshToken,
        expiresIn: config.jwt.refreshExpiresIn,
      },
    );

    return { accessToken, refreshToken };
  }

  private async findOrCreateAccountByWalletAddress(
    walletAddress: string,
  ): Promise<Account> {
    const account = await Account.findOne({
      where: {
        walletAddress,
      },
    });

    if (!isNil(account)) {
      return account;
    }

    return Account.save(
      Account.create({
        walletAddress,
      }),
    );
  }

  private async saveAccountSession(accountId: number): Promise<AccountSession> {
    //TODO: remove the find if support multi account session
    let accountSession = await AccountSession.findOne({
      where: {
        accountId,
      },
    });

    if (isNil(accountSession)) {
      accountSession = AccountSession.create({
        accountId,
      });

      return AccountSession.save(accountSession);
    }

    return accountSession;
  }
}
