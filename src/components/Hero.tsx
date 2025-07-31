import Image from "next/image";
import { SquareButton } from "@/components/common/SquareButton";

export default function Hero() {
  return (
    <section className="w-full">
      <div className="relative w-full h-[420px] md:h-[600px] lg:h-[600px]">
        <Image
          src="/meyerwatercolor.png"
          alt="CUFC Hero Image"
          fill
          className="object-cover object-center scale-150 md:scale-100 transition-transform duration-500"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent pointer-events-none" />
        <div
          className="absolute inset-0 flex flex-col items-center justify-center md:items-start md:justify-center px-6 md:px-16 lg:px-24"
        >
          <div className="w-full md:w-1/2 flex flex-col items-center md:items-start">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white text-center md:text-left drop-shadow-lg mb-6">
              Columbus Ohio&apos;s<br />Premier HEMA Club
            </h1>
            <div className="flex flex-col sm:flex-row gap-4">
              <SquareButton 
                href="/join" 
                variant="transparent"
                className="mt-2"
                style={{ 
                  minWidth: 150,
                  letterSpacing: '0.1em'
                }}
              >
                JOIN NOW
              </SquareButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
