import React from 'react';

interface TripOverviewProps {
    data: { [key: string]: any };
}

const TripOverview: React.FC<TripOverviewProps> = ({ data }) => {
    if (!data) return null;

    const formatLabel = (slug: string) => {
        switch (slug) {
            case 'max-altitude':
                return 'Max Altitude';
            case 'group-size':
                return 'Group Size';
            case 'status-ribbon':
                return 'Status';
            case 'duration':
                return 'Duration';
            default:
                return slug.split('-')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
        }
    };

    return (
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Object.entries(data).map(([key, value]) => {
                if (value === null || value === undefined || value === '') return null;

                if (key === 'duration-unit') return null;
                if (key === 'status-ribbon') return null;

                let displayValue = value;
                if (key === 'duration' && data['duration-unit']) {
                    displayValue = `${value} ${data['duration-unit']}`;
                }

                return (
                    <li key={key} className="">

                        <svg className="icon pointer-events-none text-primary" width="36" height="36">
                            <use xlinkHref={`/icons.svg#${key}`} fill="currentColor"></use>
                        </svg>


                        <span className="text-sm font-medium text-muted block leading-[100%] mt-2">
                            {formatLabel(key)}
                        </span>
                        <span className="font-semibold text-[15px] text-headings capitalize leading-[100%] mt-1">
                            {key === 'group-size' && !isNaN(Number(value))
                                ? `Min ${value} Pax.`
                                : displayValue
                            }
                        </span>

                    </li>
                );
            })}
        </ul>
    );
};

export default TripOverview;