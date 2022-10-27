import crypto from "crypto";
import {
  Entity,
  Column,
  Index,
  BeforeInsert,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import bcrypt from "bcryptjs";
import Model from "./model.entity";
import { Estate } from "./estate.entity";
import { DeployedModel } from "./deployedModels.entity";

export enum RoleEnumType {
  USER = "user",
  ADMIN = "admin",
}

export enum MembershipEnumType {
  PREMIUM = "premium",
  FREE = "free",
}

@Entity("users")
export class User extends Model {
  @Column()
  name: string;

  @Index("email_index")
  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column({
    type: "enum",
    enum: RoleEnumType,
    default: RoleEnumType.USER,
  })
  role: RoleEnumType.USER;

  
  @Column({
    default: false,
  })
  verified: boolean;

  @Index("verificationCode_index")
  @Column({
    type: "text",
    nullable: true,
  })
  verificationCode!: string | null;

  @Index("passwordUpdateCode_index")
  @Column({
    type: "text",
    nullable: true,
  })
  passwordUpdateCode!: string | null;

  @OneToMany(() => Estate, (estate) => estate.owner)
  ownedEstates: Estate[]

  @OneToMany(() => DeployedModel, (deployedModel) => deployedModel.deployer)
  deployments: DeployedModel[]

  @Column({
    type: "enum",
    enum: RoleEnumType,
    default: MembershipEnumType.FREE,
  })
  membership: MembershipEnumType;

  @Column({
    type: "text",
    array: true,
    nullable: true,
  })
  pictureBundle: string [];

  @ManyToMany(() => Estate, (estate) => estate.admins)
  @JoinTable()
  administeredEstates: Estate[]

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 12);
  }

  static async comparePasswords(
    candidatePassword: string,
    hashedPassword: string
  ) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }

  static async compareUpdatePasswordKey(
    candidateUpdatePasswordKey: string,
    hashedUpdatePasswordKey: string
  ) {
    return await bcrypt.compare(
      candidateUpdatePasswordKey,
      hashedUpdatePasswordKey
    );
  }

  static createVerificationCode() {
    const verificationCode = crypto.randomBytes(32).toString("hex");

    const hashedVerificationCode = crypto
      .createHash("sha256")
      .update(verificationCode)
      .digest("hex");

    return { verificationCode, hashedVerificationCode };
  }

  toJSON() {
    return {
      ...this,
      password: undefined,
      verified: undefined,
      verificationCode: undefined,
      passwordUpdateCode: undefined,
    };
  }

  static createPasswordUpdateCode() {
    const passwordUpdateCode = crypto.randomBytes(4).toString("hex");
    const hashedPasswordUpdateCode = crypto
      .createHash("sha256")
      .update(passwordUpdateCode)
      .digest("hex");

    return { passwordUpdateCode, hashedPasswordUpdateCode };
  }
}
