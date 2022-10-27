import {
  Entity,
  Column,
  ManyToOne,
} from "typeorm";
import Model from "./model.entity";
import { Location } from "./location.entity";
import { DeployedModel } from "./deployedModels.entity";



@Entity("cameras")
export class Camera extends Model {
  @Column()
  name: string;

  @Column()
  address: string;

  @ManyToOne(() => Location, (location) => location.cameras)
  location: Location

  @Column({
    type: "text",
    nullable: true,
  })
  streamLink: string | null;

  @Column ({
    type: "text",
    nullable: true,
  })
  loginType: string | null;

  @Column ({
    type: "text",
    nullable: true,
  })
    loginInfo: string | null;

    @ManyToOne(() => DeployedModel, (deployedModel) => deployedModel.camera)
    deployments: DeployedModel []

}
