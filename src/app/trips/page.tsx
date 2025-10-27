"use client";
import { TripType } from "@/types/trips";
import { User_Api_Routes } from "@/utils/api-routes";
import { Button, Chip } from "@heroui/react";
import axios from "axios";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";

const TripsContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchCity = searchParams.get("city");
  const [trips, setTrips] = useState<TripType[]>([]);
  
  useEffect(() => {
    const getData = async () => {
      if (!searchCity) return;
      try {
        const response = await axios.get(
          `${User_Api_Routes.GET_CITY_TRIPS}?city=${searchCity}`
        );
        setTrips(response.data.trips);
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    };
    
    getData();
  }, [searchCity]);

  if (!searchCity) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div>Please select a city to view trips.</div>
      </div>
    );
  }

  return (
    <div className="m-10 px-[5vw] min-h-[80vh]">
      <Button
        className="my-5"
        variant="shadow"
        color="primary"
        size="lg"
        onClick={() => router.push("/")}
      >
        <FaChevronLeft />
        Go Back
      </Button>
      <div className=" grid grid-cols-2 gap-5">
        {trips.map((trip) => (
          <div
            key={trip.id}
            className="grid grid-cols-9 gap-5 rounded-2xl border border-neutral-300 cursor-pointer"
            onClick={() => router.push(`/trips/${trip.id}`)} //*? probably ? aayega
          >
            {/* Image */}
            <div className="relative w-full h-48 col-span-3 ">
              <Image
                src={trip.images[0]}
                alt="trip"
                fill
                className="rounded-2xl"
              />
            </div>
            <div
              className="col-span-6 pt-5 pr-5 flex flex-col gap-1
            "
            >
              <h2 className="text-lg font-medium capitalize">
                <span className="line-clamp-1">{trip.name} </span>
              </h2>
              <div>
                <ul className="flex  gap-5 w-full overflow-hidden">
                  {trip.destinationDetails.map((detail, index) => (
                    <li key={detail.name}>
                      <Chip
                        color={index % 2 === 0 ? "secondary" : "danger"}
                        variant="flat"
                      >
                        {detail.name}
                      </Chip>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="line-clamp-1">
                  {trip.description}
                </p>
              </div>
              <div className="flex gap-4">
                <div>{trip.days} days</div>
                <div>{trip.nights} nights</div>
              </div>

              {/* Activities */}
              <div className="flex justify-between">
                <span>{trip.id}</span>
                <span>
                  <strong>₹{trip.price}</strong> / person
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Trips = () => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <div>Loading trips...</div>
      </div>
    }>
      <TripsContent />
    </Suspense>
  );
};

export default Trips;