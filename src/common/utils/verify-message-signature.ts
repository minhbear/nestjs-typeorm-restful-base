import * as bs58 from 'bs58';
import { isEqual } from 'lodash';
import { Network } from '@common/constant';
import * as nacl from 'tweetnacl';

export const verifyMessageSignature = (input: {
  network: Network;
  message: string;
  signature: string;
  walletAddress: string;
}): boolean => {
  const { message, network, signature, walletAddress } = input;

  if (isEqual(network, Network.SOLANA)) {
    return nacl.sign.detached.verify(
      new TextEncoder().encode(message),
      bs58.decode(signature),
      bs58.decode(walletAddress),
    );
  }

  return false;
};
