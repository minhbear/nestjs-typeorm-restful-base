export class ILoginResponse {
  accessToken: string;
  refreshToken: string;
}

export class IGenerateTokensResponse extends ILoginResponse {}

export class IGetNonceResponse {
  walletAddress: string;
  nonce: string;
}
