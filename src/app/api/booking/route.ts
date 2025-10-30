import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_KEY || "");

export const POST = async (request: Request) => {
  try {
    const { bookingId, bookingType, userId, taxes, date } = await request.json();

    if (!bookingId || !bookingType || !userId || taxes === undefined || !date) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    let bookingDetails;
    switch (bookingType) {
      case "trips":
        bookingDetails = await prisma.trips.findUnique({ where: { id: bookingId } });
        break;
      default:
        return NextResponse.json({ message: "Invalid booking type" }, { status: 400 });
    }

    if (!bookingDetails) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 });
    }

    const amount = Number(bookingDetails.price) + Number(taxes);
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json({ message: "Invalid amount" }, { status: 400 });
    }

    console.log("Creating payment intent with amount:", amount);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: bookingDetails.price + taxes, // Stripe expects amount in cents
      currency: "inr",
      automatic_payment_methods: {
        enabled: true
      }
    });

    console.log("Payment intent created:", paymentIntent.id, "Client secret:", paymentIntent.client_secret);

    await prisma.bookings.create({
      data: {
        bookingType,
        bookingTypeId: bookingId.toString(),
        user: { connect: { id: userId } },
        paymentIntent: paymentIntent.id,
        totalAmount: paymentIntent.amount,
        date
      }
    });

    return NextResponse.json({
      client_secret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error("Error in booking API:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
};

export const PATCH = async(request: Request)=>{
  try {
    const {paymentIntent} = await request.json();
    if (paymentIntent){
      await prisma.bookings.update({
        where:{paymentIntent},data:{isCompleted:true}
      })
      return NextResponse.json({message:"Payment Successful"},{status:200})
    }
  } catch (error) {
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
