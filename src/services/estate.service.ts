import { Estate } from "../entities/estate.entity";
import { User } from "../entities/user.entity";
import { Request } from "express";
import { AppDataSource } from "../utils/data-source";

const estateRepository = AppDataSource.getRepository(Estate);

export const createEstate = async (input: Partial<Estate>, user: User) => {
    return await estateRepository.save(
      estateRepository.create({ ...input, owner: user })
    );
  };

export const findEstateByName = async (name: string) => {
    return await estateRepository.findOne( { where: { name: name } } );
  }