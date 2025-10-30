// @ts-nocheck
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export const GET = async(request:Request)=>{
     try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (id) {
      const trip = await prisma.trips.findUnique({where:{id}});

      if (trip) {
        return NextResponse.json(
          {...trip},
          { status: 200 }
        );
      } else {
        return NextResponse.json({ msg: "Trip not found." }, { status: 404 });
      }
    } else {
      return NextResponse.json({ msg: "id is required." }, { status: 400 });
    }
  } catch (error) {
        return NextResponse.json({message: "An unexpected error occured."},{status:500})
    }
}