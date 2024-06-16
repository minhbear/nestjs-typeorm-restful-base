export const APP_ENV = {
  LOCAL: 'local',
  DEV: 'dev',
  STAGING: 'staging',
  RELEASE: 'release',
};

export const QUEUE_KEY = {
  logAudit: 'log_audit',
};

export const BULL_OPTS = {
  removeOnComplete: true,
  removeOnFail: true,
  timeout: 5 * 60 * 1000, //5m
};

export enum Network {
  SOLANA = 'solana',
  ETHEREUM = 'ethereum',
  INJECTIVE = 'injective',
  SUI = 'sui',
}
