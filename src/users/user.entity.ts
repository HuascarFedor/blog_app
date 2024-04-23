import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  id: number;

  @Column({
    unique: true,
    type: 'varchar',
    length: '15',
  })
  username: string;

  @Column({
    type: 'varchar',
  })
  password: string;
}
