import { fetchHeroSection } from '@/lib/api';
import { IMAGE_URL } from '@/lib/constants';
import Link from 'next/link';
import Image from 'next/image';
import HomeSearch from '@/components/HomeSearch/HomeSearch';

export default async function HeroSection() {
    const heroData = await fetchHeroSection();

    return (
        <>
            {/* <section className="hero-section relative w-full">
                <span className="absolute inset-0 bg-black/10 z-20"></span>
                <figure className="image-slot aspect-1920/750 min-h-[400px]">
                    <Image
                        src={`${IMAGE_URL}${heroData?.image}`}
                        alt={heroData?.imageAlt || "Hero banner"}
                        width={1920}
                        height={750}
                        priority
                        fetchPriority="high"
                        sizes="(max-width: 768px) 100vw, 100vw"
                        className="object-cover min-h-[400px]"
                    />

                </figure>

                <figcaption className="absolute z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[730px]">
                    <span className="text-[1.125rem] text-shadow-lg  text-center font-semibold text-white items-center justify-center mb-3 block gap-2">{heroData?.subtitle}</span>
                    <h2 className="text-[clamp(32px,5vw,52px)] text-shadow-lg  text-center text-white font-black leading-[1.2]">{heroData?.title}</h2>
                    <div className="hidden md:block mt-4">
                        <HomeSearch />
                    </div>
                </figcaption>
            </section> */}
            <section className="hero-section">
                <div className="pt-[2.5rem] md:pt-[3.5rem] pb-0">
                    <div className="container overflow-hidden">
                        <h2 className="text-[clamp(32px,5vw,52px)] text-headings text-center font-black leading-[1.2]"><span className='text-primary'>Discover </span>the Himalayas</h2>

                        <div className=" mt-8">
                            <HomeSearch />
                        </div>
                        <div className="w-full overflow-x-auto">

                            <ul className="flex gap-8 mt-8 [&>li]:shrink-0 pb-2 pl-6 pr-6 snap-x snap-mandatory [&>li]:snap-start md:justify-center"> <li> <div className="icon flex gap-3"> <svg className="icon text-headings" width="42" height="42" > <use xlinkHref="/icons.svg#trekking" fill="currentColor" ></use> </svg> <div className="icon-meta flex flex-col justify-center"> <Link href="/trekking-in-nepal" className="hover:text-primary"> <span className='block leading-[100%] font-semibold'>Trekking In Nepal</span> </Link> <span className='block leading-[100%] mt-1.5 text-sm'>Majestic Adventures </span> </div> </div> </li> <li> <div className="icon flex gap-3"> <svg className="icon text-headings" width="42" height="42" > <use xlinkHref="/icons.svg#tour" fill="currentColor" ></use> </svg> <div className="icon-meta flex flex-col justify-center"> <Link href="/tours-in-nepal" className="hover:text-primary"> <span className='block leading-[100%] font-semibold'>Tours In Nepal</span> </Link> <span className='block leading-[100%] mt-1.5 text-sm'>Scenic Journeys</span> </div> </div> </li> <li> <div className="icon flex gap-3"> <svg className="icon text-headings" width="42" height="42" > <use xlinkHref="/icons.svg#heli" fill="currentColor" ></use> </svg> <div className="icon-meta flex flex-col justify-center"> <Link href="/helicopter-tours" className="hover:text-primary"> <span className='block leading-[100%] font-semibold'>Heli Tours</span> </Link> <span className='block leading-[100%] mt-1.5 text-sm'>Explore Sky</span> </div> </div> </li> <li> <div className="icon flex gap-3"> <svg className="icon text-headings" width="42" height="42" > <use xlinkHref="/icons.svg#safari" fill="currentColor" ></use> </svg> <div className="icon-meta flex flex-col justify-center"> <Link href="/jungle-safari" className="hover:text-primary"> <span className='block leading-[100%] font-semibold'>Jungle Safari</span> </Link> <span className='block leading-[100%] mt-1.5 text-sm'>Wildlife Quest </span> </div> </div> </li> </ul>
                        </div>
                        <div className="hero-image relative">
                            <span className="absolute inset-0 bg-black/17 rounded-lg z-3"></span>
                            <figure className="image-slot aspect-1920/750 rounded-xl min-h-[400px] mt-10">
                                <Image
                                    src={`${IMAGE_URL}${heroData?.image}`}
                                    alt={heroData?.imageAlt || "Hero banner"}
                                    width={1920}
                                    height={750}
                                    priority
                                    fetchPriority="high"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 100vw, 1280px"
                                    className="object-cover min-h-[400px]"
                                    quality={60}
                                />

                            </figure>
                            <figcaption className="absolute z-20 bottom-10 left-10 w-full max-w-[500px]">
                                <span className="text-[1.1rem] text-shadow-sm font-medium text-white items-center justify-center mb-2 block gap-2 capitalize">{heroData?.subtitle}</span>
                                <h2 className="text-[clamp(18px,10vw,32px)] text-shadow-sm text-white font-black leading-[1.2]">{heroData?.title}</h2>
                            </figcaption>
                        </div>
                    </div>
                </div>
            </section>
        </>

    );
}
