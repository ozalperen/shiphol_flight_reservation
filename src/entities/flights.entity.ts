
import { Entity, Column, Index, BeforeInsert, OneToMany, OneToOne, CustomRepositoryDoesNotHaveEntityError, ManyToOne, JoinColumn, Timestamp } from 'typeorm';
import Model from './model.entity';

export enum DirectionEnumType {
  DEPARTURE = 'D',
  ARIVAL = 'A',
}
@Entity('flights')
export class Flight extends Model {

 
  @Column({
    unique: true
  })
  scipholid: string;

  @Column()
  flightName: string;

  @Column()
  flightNumber: string;

  @Column({
  })
  flightDirection: string;

  @Column()
  scheduleDateTime: Date;

  @Column()
  scheduleDate: Date;

  @Column()
  scheduleTime: string;

  @Column("text", { array: true })
  route: string[];

}