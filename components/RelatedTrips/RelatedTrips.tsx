import React from 'react';
import { PackageCard } from '@/components/Cards/PackageCard/PackageCard';
import { fetchPackagesByIds, Package } from '@/lib/api';

interface RelatedTripsProps {
    relatedTripIds: string;
}

export const RelatedTrips: React.FC<RelatedTripsProps> = async ({ relatedTripIds }) => {
    let tripIds: number[] = [];

    try {
        if (relatedTripIds && relatedTripIds.trim()) {
            tripIds = JSON.parse(relatedTripIds);
        }
    } catch (error) {
        console.error('Failed to parse relatedTripIds:', error);
        return null;
    }

    if (tripIds.length === 0) {
        return null;
    }

    const relatedPackages = await fetchPackagesByIds(tripIds);

    if (relatedPackages.length === 0) {
        return null;
    }

    return (
        <div className="related-trips-section page-common-box pb-0">
            <div className="page-title">
                <h2>Related Trips</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPackages.map((pkg: Package) => (
                    <PackageCard key={pkg.id} data={pkg} />
                ))}
            </div>
        </div>
    );
};
