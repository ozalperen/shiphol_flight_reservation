import crypto from "crypto";
import { Entity, Column, Index, BeforeInsert, OneToMany, JoinColumn } from "typeorm";
import bcrypt from "bcryptjs";
import Model from "./model.entity";
import { Booking } from "./booking.entity";

export enum RoleEnumType {
  USER = "user",
  ADMIN = "admin",
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

  @OneToMany(() => Booking, (booking) => booking.user)
  @JoinColumn()
  bookings!: Booking[];

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
