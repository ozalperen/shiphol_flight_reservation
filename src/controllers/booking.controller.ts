import { NextFunction, Request, Response } from 'express';
import {
  CreateBookingInput,
} from '../schemas/booking.schema';
import { createBooking, listBookings } from '../services/booking.service';
import { findUserById, findUserByIdWithBookings } from '../services/user.service';
import { getFlight } from '../services/flight.service'
import AppError from '../utils/appError';
import { date } from 'zod';

export const createBookingHandler = async (
  req: Request<{}, {}, CreateBookingInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await findUserById(res.locals.user.id as string);
    const updatedFlight = await getFlight(req.body.scipholid);
    if (!updatedFlight){
        return next(
            new AppError(
              404,
              "Flight with that ID not found"
            )
          );
    }
    if (updatedFlight.scheduleDateTime<new Date(Date.now()))
    {
        return next(
            new AppError(
              400,
              "Cannot book for past flights"
            )
          );
    }
    if (updatedFlight.flightDirection==="A")
    {
        return next(
            new AppError(
              400,
              "Cannot book for arrivals"
            )
          );
    }
    if (updatedFlight.avalibleSeats.includes(req.body.seatNumber) === false)
    {
        return next(
            new AppError(
              400,
              "Chosen seat already booked"
            )
          );
    }
    const index = updatedFlight.avalibleSeats.indexOf(req.body.seatNumber);
    updatedFlight.avalibleSeats.splice(index, 1);
    const bookedFlight = await updatedFlight.save();
    
    let booking = await createBooking(req.body, user!, bookedFlight!);
    res.status(201).json({
      status: 'success',
      data: {
        booking,
        bookedFlight
      },
    });
} catch (err: any) {
    next(err);
  }
};




export const getBookingsHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const futureBookings = await listBookings(res.locals.user.id as string);
      const allFlights = JSON.parse(JSON.stringify(futureBookings)) as typeof futureBookings;
      
      for (let i = 0; i < allFlights.length; i++) {
      if (allFlights[i].flight.scheduleDateTime < new Date(Date.now())){
        delete allFlights[i];
      }
      }
      for (let i = 0; i < futureBookings.length; i++) {
        if (futureBookings[i].flight.scheduleDateTime < new Date(Date.now())){
          delete futureBookings[i];
        }
        }
      

      res.status(200).status(200).json({
        status: 'success',
        data: {
            futureBookings,
            allFlights
            
  
        },
      });

    } catch (err: any) {
        next(err);
      }
    };

