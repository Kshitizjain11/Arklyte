import { DetailedItineraryType } from "@/types/trips";
import { Card, CardBody, CardHeader } from "@heroui/react";
import React from "react";

const Itinerary = ({ data = [] }: { data?: DetailedItineraryType[] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center p-4">
        <p className="text-gray-500">No itinerary data available</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-10 items-center justify-center mt-10 relative">
        {data.map((dt, index) => {
          return (
            <div
              className="grid grid-cols-3 items-center justify-center z-30"
              key={dt.title}
            >
              <div className="flex items-center justify-center z-20">
                <div className="h-[180px] w-[180px] bg-white flex items-center justify-center rounded-full border-3 border-dotted border-blue-500 z-20">
                  <div className="h-[150px] w-[150px] bg-blue-500 rounded-full items-center justify-center flex z-20">
                    <h1 className="text-white font-medium text-2xl">
                      Day {index + 1}
                    </h1>
                  </div>
                </div>
              </div>
              <div className="col-span-2">
                <Card className="text-blue-text-title p-5">
                  <CardHeader>
                    <h1>{dt.title}</h1>
                  </CardHeader>
                  <CardBody><h2>{dt.value}</h2></CardBody>
                </Card>
              </div>
            </div>
          );
        })}
        <div className="h-[95%] w-[3px] absolute left-[16.5%] top-12 bg-blue-200"></div>
      </div>
    </div>
  );
};

export default Itinerary;
