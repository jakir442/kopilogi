"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, MapPin } from "lucide-react";

import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/ui/section-heading";

const locations = [
  {
    number: "01",
    name: "Kopilogi Cikuray",
    city: "Garut, Jawa Barat",
    concept: "Modern Futuristic",
    image: "/gambar/tempat/kopilogi-cikuray.jpg",
    href: "/cabang-1",
  },
  {
    number: "02",
    name: "Waroeng Kopilogi",
    city: "Garut, Jawa Barat",
    concept: "Traditional Heritage",
    image: "/gambar/tempat/waroeng-kopilogi.png",
    href: "/cabang-2",
  },
  {
    number: "04",
    name: "Kopilogi Tasik",
    city: "Tasikmalaya, Jawa Barat",
    concept: "Contemporary Cozy",
    image: "/gambar/tempat/kopilogi-tasik.png",
    href: "/cabang-4",
  },
];

export function LocationsSection() {
  return (
    <section id="locations" className="bg-background py-20 md:py-28 lg:py-32">
      <Container>
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-10 flex flex-col justify-between gap-5 md:mb-14 md:flex-row md:items-end"
        >
          <SectionHeading
            eyebrow="Find Your Kopilogi"
            title="Satu nama, tiga suasana."
            description="Pilih tempat yang cocok untuk cerita berikutnya."
          />

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="size-4" />
            <span>Garut & Tasikmalaya</span>
          </div>
        </motion.div>

        {/* Branch cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((location, index) => (
            <motion.div
              key={location.number}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.65,
                delay: index * 0.12,
                ease: "easeOut",
              }}
            >
              <Link
                href={location.href}
                aria-label={`Jelajahi ${location.name}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-muted sm:aspect-[3/4] lg:aspect-[4/5]"
              >
                {/* Branch image */}
                <Image
                  src={location.image}
                  alt={`Suasana ${location.name}`}
                  fill
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Image overlays */}
                <div className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-black/20" />

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/20" />

                {/* Branch number */}
                <div className="absolute left-5 top-5 flex size-10 items-center justify-center rounded-full border border-white/35 bg-black/10 text-xs font-medium text-white backdrop-blur-md">
                  {location.number}
                </div>

                {/* Explore icon */}
                <div className="absolute right-5 top-5 flex size-10 items-center justify-center rounded-full bg-white text-black transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight className="size-5" />
                </div>

                {/* Branch information */}
                <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
                  <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.2em] text-white/70">
                    {location.concept}
                  </p>

                  <h3 className="text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
                    {location.name}
                  </h3>

                  <div className="mt-2 flex items-center gap-2 text-sm text-white/70">
                    <MapPin className="size-3.5 shrink-0" />
                    <span>{location.city}</span>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-white/25 pt-4">
                    <span className="text-xs font-medium uppercase tracking-[0.16em]">
                      Explore branch
                    </span>

                    <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-xs leading-5 text-muted-foreground"
        >
          Setiap cabang punya karakter dan suasana yang berbeda. Temukan tempat yang paling sesuai
          denganmu.
        </motion.p>
      </Container>
    </section>
  );
}
