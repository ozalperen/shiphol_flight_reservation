import { Request } from 'express';
import { Booking } from '../entities/booking.entity';
import { User } from '../entities/user.entity';
import { AppDataSource } from '../utils/data-source';

const bookingRepository = AppDataSource.getRepository(Booking);

export const createBooking = async (input: Partial<Booking>, user: User) => {
  return await bookingRepository.save(bookingRepository.create({ ...input, user }));
};