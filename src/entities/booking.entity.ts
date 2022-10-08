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
import { Flight } from "./flights.entity";
import Model from "./model.entity";
import { User } from "./user.entity";

@Entity("bookings")
export class Booking extends Model {
  @Column()
  scipholid: string;

  @Column()
  seatNumber: string;

  @ManyToOne(() => User, (user) => user.bookings, { onDelete: "CASCADE" })
  @JoinColumn()
  user!: User;

  @ManyToOne(() => Flight, (flight) => flight.bookings, { onDelete: "CASCADE" })
  @JoinColumn()
  flight!: Flight;
}
