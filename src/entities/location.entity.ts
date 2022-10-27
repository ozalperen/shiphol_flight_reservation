import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Estate } from "./estate.entity";
import Model from "./model.entity";
import { Camera } from "./camera.entity";


@Entity("locations")
export class Location extends Model {
  @Column()
  name: string;

  @Column()
  icon: string;

  @ManyToOne(() => Estate, (estate) => estate.locations)
  estate: Estate

  @OneToMany(() => Camera, (camera) => camera.location)
  cameras: Camera[]

}