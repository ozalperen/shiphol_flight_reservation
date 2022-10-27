import {
  Entity,
  Column,
  ManyToMany,
} from "typeorm";
import { Estate } from "./estate.entity";
import Model from "./model.entity";



@Entity("folks")
export class Folk extends Model {
  @Column()
  name: string;

  @Column()
  address: string;

  @Column({
    type: "text",
    array: true,
    nullable: true,
  })
  pictureBundle: string [];

  @ManyToMany(() => Estate, (estate) => estate.folks)
  estates: Estate[]

  
}