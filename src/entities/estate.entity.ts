import {
  Entity,
  Column,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Folk } from "./folk.entity";
import Model from "./model.entity";
import { User } from "./user.entity";
import { Location } from "./location.entity";



@Entity("estates")
export class Estate extends Model {
  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  picture: string;

  @Column()
  ownerId: string;

  @ManyToOne(() => User, (user) => user.ownedEstates)
  @JoinColumn()
  owner!: User;


  @ManyToMany(() => User, (user) => user.administeredEstates)
  admins!: User[] 

  @ManyToMany(() => Folk, (folk) => folk.estates)
  folks!: Folk[]

  @OneToMany(() => Location, (location) => location.estate)
  locations: Location[]


}
