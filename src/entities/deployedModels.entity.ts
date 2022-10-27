import {
  Entity,
  Column,
  ManyToOne,
} from "typeorm";
import Model from "./model.entity";
import { User } from "./user.entity";
import { AvailableModel } from "./availableModel.entity";
import { Camera } from "./camera.entity";



@Entity("deployedModel")
export class DeployedModel extends Model {
  @Column()
  name: string;

  @Column()
  address: string;

  @ManyToOne(() => AvailableModel, (availableModel) => availableModel.deployments)
  availableModel: AvailableModel

  @ManyToOne(() => User, (user) => user.deployments)
  deployer: AvailableModel

  @ManyToOne(() => Camera, (camera) => camera.deployments)
  camera: AvailableModel

  @Column ({
    type: "text",
    nullable: true,
  })
    boundingBox: string | null;

}