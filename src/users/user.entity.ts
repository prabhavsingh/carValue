import { Exclude } from 'class-transformer';
import { Report } from 'src/reports/reports.entity';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  email!: string;

  @Column()
  //   @Exclude()
  password!: string;

  @OneToMany(() => Report, (report) => report.user)
  reports!: Report[];

  @AfterInsert()
  logInsert() {
    console.log('Inserted User with id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('updated User with id', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('removed User with id', this.id);
  }
}
