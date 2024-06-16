import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class WalletSignatureInputDto {
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  walletAddress: string;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  signature: string;
}
