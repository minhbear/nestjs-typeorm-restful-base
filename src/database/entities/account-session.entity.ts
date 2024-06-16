import { CustomBaseEntity } from '@common/entity.base';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Account } from './account.entity';

@Entity({ name: 'account_session' })
export class AccountSession extends CustomBaseEntity {
  @Column()
  accountId: number;

  @ManyToOne(() => Account, (account) => account.sessions)
  @JoinColumn({ name: 'account_id' })
  account: Account;
}
