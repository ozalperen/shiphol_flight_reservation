import {
  Entity,
  Column,
  Index,
  BeforeInsert,
  OneToMany,
  OneToOne,
  CustomRepositoryDoesNotHaveEntityError,
  ManyToOne,
  JoinColumn,
  Timestamp,
} from "typeorm";
import { Booking } from "./booking.entity";
import Model from "./model.entity";

export class ScipholFlights {
  flights: Flightlist[];
}
export class Flightlist {
  flightDirection: string;
  flightName: string;
  flightNumber: string;
  id: string;
  route: Route;
  scheduleDateTime: Date;
  scheduleDate: Date;
  scheduleTime: string;
}
export class Route {
  destinations: string[];
}

export enum DirectionEnumType {
  DEPARTURE = "D",
  ARIVAL = "A",
}

const defaultSeats = Array.from({ length: 25 }, (_, index) => index + 1);

@Entity("flights")
export class Flight extends Model {
  @Column({
    unique: true,
  })
  scipholid: string;

  @Column()
  flightName: string;

  @Column()
  flightNumber: string;

  @Column({})
  flightDirection: string;

  @Column()
  scheduleDateTime: Date;

  @Column()
  scheduleDate: Date;

  @Column()
  scheduleTime: string;

  @Column("text", { array: true })
  route: string[];

  @Column("text", {
    array: true,
    default: defaultSeats,
  })
  avalibleSeats: string[];
  
  @OneToMany(() => Booking, (booking) => booking.flight)
  bookings: Booking[]
}
