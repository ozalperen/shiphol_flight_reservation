import { Request } from "express";
import { Booking } from "../entities/booking.entity";
import { Flight } from "../entities/flights.entity";
import { User } from "../entities/user.entity";
import { AppDataSource } from "../utils/data-source";

const bookingRepository = AppDataSource.getRepository(Booking);

export const createBooking = async (
  input: Partial<Booking>,
  user: User,
  flight: Flight
) => {
  return await bookingRepository.save(
    bookingRepository.create({ ...input, user, flight })
  );
};

export const getBooking = async (bookingId: string) => {
  return await bookingRepository.findOne({
    where: {
      id: bookingId,
    },
    relations: {
      flight: true,
    },
  });
};
export const listBookings = async (userId: string) => {
  const builder = bookingRepository.createQueryBuilder("bookings");
  builder.select("bookings");
  //builder.from(Booking, "bookings")
  builder.leftJoinAndSelect("bookings.flight", "flights");
  builder.where('"userId" = :userId', {
    userId: userId,
  });
  return await builder.getMany();
};
export class Bookings {
  bookings: Booking[];
}
