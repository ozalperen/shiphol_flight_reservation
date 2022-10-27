import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import Model from "./model.entity";
import { Location } from "./location.entity";
import { DeployedModel } from "./deployedModels.entity";


@Entity("availableModels")
export class AvailableModel extends Model {
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
  frameworkCategory: string | null;

  @Column ({
    type: "boolean",
    nullable: true,
  })
  boundingBoxible: string | null;

  @Column ({
    type: "text",
    nullable: true,
  })
    description: string | null;

    @OneToMany(() => DeployedModel, (deployedModel) => deployedModel.availableModel)
    deployments: DeployedModel[]



}
