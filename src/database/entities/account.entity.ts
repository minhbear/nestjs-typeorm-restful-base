import { CustomBaseEntity } from '@common/entity.base';
import { Column, Entity, OneToMany } from 'typeorm';
import { AccountSession } from './account-session.entity';

@Entity()
export class Account extends CustomBaseEntity {
  @Column()
  walletAddress: string;

  @OneToMany(() => AccountSession, (session) => session.account)
  sessions: AccountSession[];
}
