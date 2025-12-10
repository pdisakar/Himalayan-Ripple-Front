'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { CalendarIcon, Minus, Plus } from 'lucide-react'
import { format } from 'date-fns'

interface GroupPrice {
    id?: string
    minPerson: string | number
    maxPerson: string | number
    price: string | number
    isDefault?: boolean
}

interface BookModuleProps {
    packageSlug: string
    defaultprice: number
    groupprice: GroupPrice[]
}

const BookModule: React.FC<BookModuleProps> = ({ packageSlug, defaultprice, groupprice }) => {
    const router = useRouter()
    const [date, setDate] = useState<Date>()
    const [showCalendar, setShowCalendar] = useState(false)
    const [travelers, setTravelers] = useState(1)
    const calendarRef = useRef<HTMLDivElement>(null)

    // Close calendar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                setShowCalendar(false)
            }
        }

        if (showCalendar) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [showCalendar])

    // Calculate the price per person based on number of travelers
    const getPricePerPerson = () => {
        if (!groupprice || groupprice.length === 0) {
            return defaultprice
        }

        // Find the matching price tier
        const priceTier = groupprice.find(
            tier => travelers >= Number(tier.minPerson) && travelers <= Number(tier.maxPerson)
        )

        return priceTier ? Number(priceTier.price) : defaultprice
    }


    // Calculate total price
    const getTotalPrice = () => {
        return getPricePerPerson() * travelers
    }

    const handleIncrement = () => {
        setTravelers(prev => prev + 1)
    }

    const handleDecrement = () => {
        if (travelers > 1) {
            setTravelers(prev => prev - 1)
        }
    }

    const handleBooking = () => {
        if (!date) return
        
        // Navigate to booking page with query params
        const bookingUrl = `/booking?package=${packageSlug}&date=${format(date, 'yyyy-MM-dd')}&travelers=${travelers}`
        router.push(bookingUrl)
    }

    return (
        <div className="bg-body-bg border border-muted/10 rounded-lg p-6 shadow-xs space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-primary mb-3">Group size and price</h3>
                <div className="space-y-2">
                    {groupprice && groupprice.length > 0 ? (
                        groupprice.map((tier, index) => (
                            <div key={index} className="flex justify-between items-center text-sm">
                                <span className="font-medium">
                                    {Number(tier.minPerson) === Number(tier.maxPerson)
                                        ? `${tier.minPerson} Person`
                                        : `${tier.minPerson} – ${tier.maxPerson} Person`
                                    }
                                </span>
                                <span className="font-semibold text-headings">
                                    US$ {tier.price}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-medium">Standard Price</span>
                            <span className="font-semibold text-headings">US$ {defaultprice}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* When? - Date Picker */}
            <div>
                <h3 className="text-lg font-semibold text-headings mb-1">When?</h3>
                <p className="text-sm text-muted mb-2">Pick a Date (Journey Start)</p>
                    <div className="relative" ref={calendarRef}>
                    <button
                        onClick={() => setShowCalendar(!showCalendar)}
                        className="w-full px-4 py-2.5 text-left border border-gray-300 rounded-md flex items-center justify-between hover:border-gray-400 focus:outline-none focus:border-primary"
                    >
                        <span className={date ? "text-headings" : "text-muted"}>
                            {date ? format(date, "MM/dd/yyyy") : "Select date"}
                        </span>
                        <CalendarIcon className="h-5 w-5 text-muted" />
                    </button>

                    {showCalendar && (
                        <div className="absolute z-10 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(newDate) => {
                                    setDate(newDate)
                                    setShowCalendar(false)
                                }}
                                disabled={(date) => date < new Date()}
                                initialFocus
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Travellers Counter */}
            <div>
                <h3 className="text-lg font-semibold text-headings">Travellers?</h3>
                <p className="text-sm text-muted mb-3">Number of pax</p>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleDecrement}
                        disabled={travelers <= 1}
                        className="w-10 h-10 flex items-center justify-center border border-muted rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
                    >
                        <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-lg font-medium min-w-12 text-center">
                        {travelers}
                    </span>
                    <button
                        onClick={handleIncrement}
                        className="w-10 h-10 flex items-center justify-center border border-muted rounded-md hover:bg-muted hover:cursor-pointer"
                    >
                        <Plus className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Total Price */}
            <div className="pt-4 border-t border-muted/20">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-headings font-semibold">Total Price</span>
                    <span className="text-2xl font-bold text-primary">
                        US ${getTotalPrice()}
                    </span>
                </div>
                <p className="text-xs text-gray-500">
                    {travelers} x {getPricePerPerson()}
                </p>
            </div>

            {/* Book Button */}
            <Button
                onClick={handleBooking}
                disabled={!date}
                className="w-full bg-primary hover:bg-primary/10 hover:text-primary border border-primary text-white font-medium py-6 text-base disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
            >
                Book This Trip
            </Button>
        </div>
    )
}

export default BookModule