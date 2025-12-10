'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { format, addDays } from 'date-fns'
import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { countries } from '@/lib/countries'
import { API_URL, SERVER_URL } from '@/lib/constants'

interface PackageDetails {
    id: number
    slug: string
    title: string
    featuredImage: string
    duration: number
    durationUnit: string
    defaultPrice: number
    groupPrices: Array<{
        minPerson: number
        maxPerson: number
        price: number
    }>
}

interface LeadTraveler {
    fullName: string
    email: string
    dateOfBirth: string
    nationality: string
    countryCode: string
    mobileNumber: string
    specialRequirements: string
}

function BookingContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    
    const packageSlug = searchParams.get('package')
    const startDate = searchParams.get('date')
    const initialTravelers = parseInt(searchParams.get('travelers') || '1')

    const [packageDetails, setPackageDetails] = useState<PackageDetails | null>(null)
    const [travelers, setTravelers] = useState(initialTravelers)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    // Form State
    const [acceptTerms, setAcceptTerms] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [formErrors, setFormErrors] = useState<Record<string, string>>({})
    const [formData, setFormData] = useState<LeadTraveler>({
        fullName: '',
        email: '',
        dateOfBirth: '',
        nationality: '',
        countryCode: '+1',
        mobileNumber: '',
        specialRequirements: ''
    })

    // Fetch package details
    useEffect(() => {
        const fetchPackage = async () => {
            if (!packageSlug) {
                setError('No package selected')
                setLoading(false)
                return
            }

            try {
                const endpoint = `${API_URL}/packages/${packageSlug}`
                
                const response = await fetch(endpoint)
                
                if (!response.ok) throw new Error('Failed to fetch package')
                
                const data = await response.json()
                
                if (data.success && data.package) {
                    const pkg = data.package
                    const packageData = {
                        ...pkg,
                        duration: pkg.tripFacts?.duration || pkg.duration || 1,
                        durationUnit: pkg.tripFacts?.['duration-unit'] || pkg.durationUnit || 'days'
                    }
                    setPackageDetails(packageData)
                } else {
                    setError('Package not found')
                }
            } catch (err) {
                console.error('[Booking] Error fetching package:', err)
                setError('Failed to load package details')
            } finally {
                setLoading(false)
            }
        }

        fetchPackage()
    }, [packageSlug])

    // Calculate price per person based on travelers
    const getPricePerPerson = () => {
        if (!packageDetails) return 0

        if (packageDetails.groupPrices && packageDetails.groupPrices.length > 0) {
            const tier = packageDetails.groupPrices.find(
                gp => travelers >= gp.minPerson && travelers <= gp.maxPerson
            )
            return tier ? tier.price : packageDetails.defaultPrice
        }

        return packageDetails.defaultPrice
    }

    // Calculate end date based on start date and duration
    const getEndDate = () => {
        if (!startDate || !packageDetails) return null
        const start = new Date(startDate)
        return addDays(start, packageDetails.duration - 1)
    }

    const handleIncrement = () => {
        setTravelers(prev => prev + 1)
    }

    const handleDecrement = () => {
        if (travelers > 1) {
            setTravelers(prev => prev - 1)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (formErrors[name]) {
            setFormErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[name]
                return newErrors
            })
        }
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required'
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email'
        }

        if (!formData.dateOfBirth) {
            newErrors.dateOfBirth = 'Date of birth is required'
        } else {
            const dob = new Date(formData.dateOfBirth)
            const today = new Date()
            if (dob >= today) newErrors.dateOfBirth = 'Date of birth must be in the past'
            const age = today.getFullYear() - dob.getFullYear()
            if (age < 18) newErrors.dateOfBirth = 'Lead traveler must be at least 18 years old'
        }

        if (!formData.nationality) newErrors.nationality = 'Nationality is required'
        
        if (!formData.mobileNumber.trim()) {
            newErrors.mobileNumber = 'Mobile number is required'
        } else if (!/^\d{6,15}$/.test(formData.mobileNumber)) {
            newErrors.mobileNumber = 'Please enter a valid mobile number (6-15 digits)'
        }

        if (!acceptTerms) newErrors.acceptTerms = 'You must accept the terms and conditions'

        setFormErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateForm() || !packageDetails || !startDate) return

        setSubmitting(true)

        const endDate = getEndDate()
        const pricePerPerson = getPricePerPerson()

        const payload = {
            packageId: packageDetails.slug,
            packageTitle: packageDetails.title,
            packageImage: packageDetails.featuredImage,
            startDate: startDate,
            endDate: endDate ? format(endDate, 'yyyy-MM-dd') : '',
            duration: `${packageDetails.duration} ${packageDetails.durationUnit}`,
            travelers: travelers,
            pricePerPerson: pricePerPerson,
            totalPrice: pricePerPerson * travelers,
            leadTraveler: formData
        }

        try {
            const endpoint = `${API_URL}/send-booking-email`

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Failed to submit booking')
            }

            alert('Booking request submitted successfully! We will contact you soon.')
            router.push(`/${packageDetails.slug}`)
        } catch (err: any) {
            console.error('Booking submission error:', err)
            alert(err.message || 'Failed to submit booking. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="container py-20">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted">Loading booking details...</p>
                </div>
            </div>
        )
    }

    if (error || !packageDetails || !startDate) {
        return (
            <div className="container py-20">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-headings mb-4">Booking Error</h2>
                    <p className="text-muted mb-6">{error || 'Invalid booking information'}</p>
                    <button
                        onClick={() => router.push('/')}
                        className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        )
    }

    const endDate = getEndDate()
    const pricePerPerson = getPricePerPerson()
    const totalPrice = pricePerPerson * travelers
    
    const imageUrl = packageDetails.featuredImage 
        ? `${SERVER_URL}${packageDetails.featuredImage}` 
        : ''

    return (
        <div className="container py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-headings mb-2">Booking</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content (Form) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Package Info Card */}
                    <div className="bg-body-bg border border-muted/10 rounded-lg p-6 flex gap-4">
                        {imageUrl && (
                            <div className="relative w-24 h-24 flex-shrink-0">
                                <Image
                                    src={imageUrl}
                                    alt={packageDetails.title}
                                    fill
                                    className="object-cover rounded-lg"
                                />
                            </div>
                        )}
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold text-headings mb-2">
                                {packageDetails.title}
                            </h2>
                            <div className="space-y-1 text-sm">
                                <p>
                                    <span className="font-medium">Starting:</span>{' '}
                                    <span className="text-muted">{format(new Date(startDate), 'do MMM, yyyy')}</span>
                                </p>
                                <p>
                                    <span className="font-medium">Ending:</span>{' '}
                                    <span className="text-muted">
                                        {endDate ? format(endDate, 'do MMM, yyyy') : 'N/A'}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Booking Form Content */}
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Traveler Count Section */}
                        <div className="bg-body-bg border border-muted/10 rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                                    1
                                </div>
                                <h3 className="text-lg font-semibold text-headings">How many are travelling?</h3>
                            </div>
                            <p className="text-sm text-muted mb-4 ml-11">Group discount available</p>

                            {/* Group Price List for Traveler Section */}
                            {packageDetails.groupPrices && packageDetails.groupPrices.length > 0 && (
                                <div className="ml-11 mb-6 p-3 bg-muted/10 rounded-md border border-muted/20 max-w-xs">
                                    <h4 className="text-xs font-semibold text-headings mb-2 uppercase tracking-wide">Price per person</h4>
                                    <div className="space-y-1.5">
                                        {packageDetails.groupPrices.map((tier, index) => (
                                            <div key={index} className="flex justify-between items-center text-sm">
                                                <span className="text-muted-foreground">
                                                    {tier.minPerson === tier.maxPerson
                                                        ? `${tier.minPerson} Person`
                                                        : `${tier.minPerson} – ${tier.maxPerson} Pax`
                                                    }
                                                </span>
                                                <span className={`font-medium ${travelers >= tier.minPerson && travelers <= tier.maxPerson ? 'text-primary' : 'text-headings'}`}>
                                                    US$ {tier.price}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="ml-11">
                                <p className="text-sm font-medium mb-3">No of Travelers</p>
                                <div className="flex items-center gap-4">
                                    <button
                                        type="button"
                                        onClick={handleDecrement}
                                        disabled={travelers <= 1}
                                        className="w-10 h-10 flex items-center justify-center border border-muted rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="text-lg font-medium min-w-12 text-center">
                                        {travelers}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={handleIncrement}
                                        className="w-10 h-10 flex items-center justify-center border border-muted rounded-md hover:bg-muted"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Lead Traveler Section */}
                        <div className="bg-body-bg border border-muted/10 rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                                    2
                                </div>
                                <h3 className="text-lg font-semibold text-headings">Lead Traveller</h3>
                            </div>
                            <p className="text-sm text-muted mb-6 ml-11">This traveller will serve as the contact person for the booking.</p>

                            <div className="ml-11 space-y-6">
                                {/* Name & Email */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Name & Email <span className="text-red-500">*</span>
                                    </label>
                                    <p className="text-xs text-muted mb-2">Per your passport details.</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                placeholder="Full Name*"
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:border-primary"
                                            />
                                            {formErrors.fullName && (
                                                <p className="text-xs text-red-500 mt-1">{formErrors.fullName}</p>
                                            )}
                                        </div>
                                        <div>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="E-mail ID*"
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:border-primary"
                                            />
                                            {formErrors.email && (
                                                <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Date of Birth & Nationality */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Date of Birth / Nationality <span className="text-red-500">*</span>
                                    </label>
                                    <p className="text-xs text-muted mb-2">The lead traveller should be 18 years or above.</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <input
                                                type="date"
                                                name="dateOfBirth"
                                                value={formData.dateOfBirth}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:border-primary"
                                            />
                                            {formErrors.dateOfBirth && (
                                                <p className="text-xs text-red-500 mt-1">{formErrors.dateOfBirth}</p>
                                            )}
                                        </div>
                                        <div>
                                            <select
                                                name="nationality"
                                                value={formData.nationality}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:border-primary"
                                            >
                                                <option value="">Select Nationality*</option>
                                                {countries.map(country => (
                                                    <option key={country.code} value={country.name}>
                                                        {country.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {formErrors.nationality && (
                                                <p className="text-xs text-red-500 mt-1">{formErrors.nationality}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Mobile Number */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Mobile Number <span className="text-red-500">*</span>
                                    </label>
                                    <p className="text-xs text-muted mb-2">This is how we will get in touch with you, if we need to reach you at your destination</p>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div>
                                            <select
                                                name="countryCode"
                                                value={formData.countryCode}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:border-primary"
                                            >
                                                {countries.map(country => (
                                                    <option key={country.code} value={country.dialCode}>
                                                        {country.dialCode}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="md:col-span-3">
                                            <input
                                                type="tel"
                                                name="mobileNumber"
                                                value={formData.mobileNumber}
                                                onChange={handleInputChange}
                                                placeholder="Mobile number*"
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:border-primary"
                                            />
                                            {formErrors.mobileNumber && (
                                                <p className="text-xs text-red-500 mt-1">{formErrors.mobileNumber}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Special Requirements */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Special Requirement<span className="text-muted">*</span>
                                    </label>
                                    <p className="text-xs text-muted mb-2">Please tell us more about yourself to help you better.</p>
                                    <textarea
                                        name="specialRequirements"
                                        value={formData.specialRequirements}
                                        onChange={handleInputChange}
                                        rows={4}
                                        placeholder="Enter your special requirements..."
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:border-primary resize-none"
                                    />
                                </div>

                                {/* Terms and Conditions */}
                                <div>
                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={acceptTerms}
                                            onChange={(e) => {
                                                setAcceptTerms(e.target.checked)
                                                if (formErrors.acceptTerms) {
                                                    setFormErrors(prev => {
                                                        const newErrors = { ...prev }
                                                        delete newErrors.acceptTerms
                                                        return newErrors
                                                    })
                                                }
                                            }}
                                            className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                        />
                                        <span className="text-sm">
                                            I accept the{' '}
                                            <a href="/terms-and-conditions" target="_blank" className="text-primary hover:underline">
                                                terms and conditions
                                            </a>
                                            <span className="text-red-500"> *</span>
                                        </span>
                                    </label>
                                    {formErrors.acceptTerms && (
                                        <p className="text-xs text-red-500 mt-1 ml-7">{formErrors.acceptTerms}</p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <div className="pt-4">
                                    <Button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-6 text-base disabled:opacity-50"
                                    >
                                        {submitting ? 'Submitting...' : 'Submit Booking Request'}
                                    </Button>
                                    {Object.keys(formErrors).length > 0 && (
                                        <p className="text-center text-red-500 text-sm mt-2">
                                            Please correct errors before submitting
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Sidebar (Summary) */}
                <div className="lg:col-span-1">
                    <div className="bg-body-bg border border-muted/10 rounded-lg p-6 shadow-xs space-y-6 sticky top-[100px]">
                        <h3 className="text-xl font-semibold text-primary">Summary</h3>

                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-headings mb-2">{packageDetails.title}</h4>
                            </div>

                            {/* Group Price List */}
                            <div className="space-y-2 pt-4 border-t border-muted/20">
                                <h4 className="text-sm font-semibold text-headings mb-2">Group size and price</h4>
                                {packageDetails.groupPrices && packageDetails.groupPrices.length > 0 ? (
                                    packageDetails.groupPrices.map((tier, index) => (
                                        <div key={index} className="flex justify-between items-center text-xs">
                                            <span className="text-muted">
                                                {tier.minPerson === tier.maxPerson
                                                    ? `${tier.minPerson} Person`
                                                    : `${tier.minPerson} – ${tier.maxPerson} Pax`
                                                }
                                            </span>
                                            <span className="font-medium text-headings">US$ {tier.price}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-muted">1 Person</span>
                                        <span className="font-medium text-headings">US$ {packageDetails.defaultPrice}</span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3 pt-4 border-t border-muted/20">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Package Price:</span>
                                    <span className="font-medium text-headings">
                                        US$ {pricePerPerson}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Number of Travelers:</span>
                                    <span className="font-medium text-headings">{travelers} x {pricePerPerson}</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-muted/20">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-headings">Total Price:</span>
                                    <span className="text-2xl font-bold text-primary">
                                        US$ {totalPrice}
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function BookingPage() {
    return (
        <Suspense fallback={
            <div className="container py-20 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted">Loading booking...</p>
            </div>
        }>
            <BookingContent />
        </Suspense>
    )
}