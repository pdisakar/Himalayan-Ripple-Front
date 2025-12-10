import React from 'react';

interface ItineraryDay {
    id: number;
    dayNumber: number;
    title: string;
    description: string;
    meals?: string;
    accommodation?: string;
    walkingHours?: string;
    altitude?: string;
    distance?: string;
    origin?: string;
    destination?: string;
    originElevation?: string;
    destinationElevation?: string;
    transportation?: string;
}

interface ItineraryProps {
    data: ItineraryDay[];
}

const Itinerary: React.FC<ItineraryProps> = ({ data }) => {
    return (
        <ul className='[&>li]:mt-7 [&>li:first-child]:mt-0 [&>li]:border-b [&>li]:border-muted/20 [&>li]:pb-7'>
            {data.map((day) => (
                <li key={day.id}>
                    <h3 className='mb-2 font-bold text-[clamp(18px,3vw,21px)] leading-[1.3] text-headings'>{`Day ${day.dayNumber < 10 ? `0${day.dayNumber}` : day.dayNumber} : ${day.title}`}</h3>
                    <article dangerouslySetInnerHTML={{ __html: day.description }} />
                    {(day.meals || day.accommodation || day.walkingHours || day.altitude || day.distance || day.origin || day.transportation) && (
                        <ul className='mt-3 text-[15px] grid grid-cols-1 md:grid-cols-3 gap-4'>
                            {day.meals && <li className='flex items-center gap-2'>
                                <svg
                                    className="icon text-primary"
                                    width="20"
                                    height="20"
                                >
                                    <use
                                        xlinkHref="/icons.svg#meals"
                                        fill="currentColor"
                                    ></use>
                                </svg>
                                <div>
                                    <span className='font-semibold text-headings leading-[100%]'>
                                        Meals:</span> {day.meals}
                                </div>
                            </li>}
                            {day.accommodation && <li className='flex items-center gap-2'>
                                <svg
                                    className="icon text-primary"
                                    width="20"
                                    height="20"
                                >
                                    <use
                                        xlinkHref="/icons.svg#accommodation"
                                        fill="currentColor"
                                    ></use>
                                </svg>
                                <div>
                                    <span className='font-semibold text-headings leading-[100%]'>
                                        Accommodation:</span> {day.accommodation}
                                </div>
                            </li>}
                            {day.walkingHours && <li className='flex items-center gap-2'>
                                <svg
                                    className="icon text-primary"
                                    width="20"
                                    height="20"
                                >
                                    <use
                                        xlinkHref="/icons.svg#duration"
                                        fill="currentColor"
                                    ></use>
                                </svg>
                                <div>
                                    <span className='font-semibold text-headings leading-[100%]'>
                                        Walking Hours:</span> {day.walkingHours}
                                </div>
                            </li>}
                            {day.altitude && <li className='flex items-center gap-2'>
                                <svg
                                    className="icon text-primary"
                                    width="20"
                                    height="20"
                                >
                                    <use
                                        xlinkHref="/icons.svg#altitude"
                                        fill="currentColor"
                                    ></use>
                                </svg>
                                <div>
                                    <span className='font-semibold text-headings leading-[100%]'>
                                        Altitude:</span> {day.altitude}
                                </div>
                            </li>}
                            {day.distance && <li className='flex items-center gap-2'>
                                <svg
                                    className="icon text-primary"
                                    width="20"
                                    height="20"
                                >
                                    <use
                                        xlinkHref="/icons.svg#distance"
                                        fill="currentColor"
                                    ></use>
                                </svg>
                                <div>
                                    <span className='font-semibold text-headings leading-[100%]'>
                                        Distance:</span> {day.distance}
                                </div>
                            </li>}
                            {day.origin && <li className='flex items-center gap-2'>
                                <svg
                                    className="icon text-primary"
                                    width="20"
                                    height="20"
                                >
                                    <use
                                        xlinkHref="/icons.svg#route"
                                        fill="currentColor"
                                    ></use>
                                </svg>
                                <div>
                                    <span className='font-semibold text-headings leading-[100%]'>
                                        Route:</span> {day.origin} to {day.destination}
                                </div>
                            </li>}
                            {day.transportation && <li className='flex items-center gap-2'>
                                <svg
                                    className="icon text-primary"
                                    width="20"
                                    height="20"
                                >
                                    <use
                                        xlinkHref="/icons.svg#transportation"
                                        fill="currentColor"
                                    ></use>
                                </svg>
                                <div>
                                    <span className='font-semibold text-headings leading-[100%]'>
                                        Transportation:</span> {day.transportation}
                                </div>
                            </li>}
                            {(day.originElevation && day.destinationElevation) && <li className='flex items-center gap-2'>
                                <svg
                                    className="icon text-primary"
                                    width="20"
                                    height="20"
                                >
                                    <use
                                        xlinkHref="/icons.svg#max-altitude"
                                        fill="currentColor"
                                    ></use>
                                </svg>
                                <div>
                                    <span className='font-semibold text-headings leading-[100%]'>
                                        Elevation:</span> {day.originElevation} to {day.destinationElevation}
                                </div>
                            </li>}
                        </ul>
                    )}
                </li>
            ))}
        </ul>
    );
};

export default Itinerary;
