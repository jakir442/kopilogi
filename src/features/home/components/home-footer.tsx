import { ArrowUpRight, MapPin, UtensilsCrossed } from "lucide-react";
import { FaInstagram  } from "react-icons/fa6";
import Link from "next/link";

import { Container } from "@/components/layout/container";

const navigation = [
  {
    label: "Beranda",
    href: "#home",
  },
  {
    label: "Cerita Kami",
    href: "#about",
  },
  {
    label: "Menu",
    href: "#menu",
  },
  {
    label: "Lokasi",
    href: "#locations",
  },
];

const locations = ["Kopilogi Cikuray", "Waroeng Kopilogi", "Kopilogi Tasik"];

export function HomeFooter() {
  return (
    <footer className='border-t border-border/60 bg-foreground text-background'>
      <Container className='py-14 sm:py-18 lg:py-20'>
        <div className='grid gap-12 lg:grid-cols-[1.3fr_0.7fr_0.8fr] lg:gap-16'>
          {/* Brand */}
          <div className='max-w-lg'>
            <Link
              href='#home'
              className='group inline-flex items-center gap-3'
              aria-label='Kembali ke beranda Kopilogi'
            >
              <span className='flex size-10 items-center justify-center rounded-xl border border-background/15 bg-background/10 text-sm font-bold transition-colors group-hover:bg-background group-hover:text-foreground'>
                K
              </span>

              <span className='text-lg font-bold tracking-[0.16em]'>KOPILOGI</span>
            </Link>

            <h2 className='mt-7 max-w-md text-2xl font-semibold tracking-tight sm:text-3xl'>
              Tempat untuk menikmati kopi dan cerita.
            </h2>

            <p className='mt-4 max-w-md text-sm leading-7 text-background/60'>
              Kopilogi menghadirkan kopi, makanan, dan suasana yang berbeda di setiap lokasinya —
              untuk menemani obrolan, pertemuan, maupun waktu santai.
            </p>

            <div className='mt-7 flex flex-wrap gap-3'>
              <Link
                href='/menu'
                className='group inline-flex min-h-11 items-center gap-2 rounded-full bg-background px-5 py-3 text-sm font-medium text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg'
              >
                Jelajahi menu
                <ArrowUpRight
                  className='size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5'
                  aria-hidden='true'
                />
              </Link>

              <Link
                href='#locations'
                className='inline-flex min-h-11 items-center gap-2 rounded-full border border-background/15 bg-background/5 px-5 py-3 text-sm font-medium text-background transition-colors hover:bg-background/10'
              >
                <MapPin className='size-4' aria-hidden='true' />
                Lokasi
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.16em] text-background/40'>
              Navigasi
            </p>

            <nav className='mt-5 flex flex-col items-start gap-3.5' aria-label='Navigasi footer'>
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className='text-sm text-background/65 transition-colors hover:text-background'
                >
                  {item.label}
                </Link>
              ))}

              <Link
                href='/login'
                className='mt-2 inline-flex items-center gap-1.5 text-sm text-background/40 transition-colors hover:text-background'
              >
                Area admin
                <ArrowUpRight className='size-3.5' aria-hidden='true' />
              </Link>
            </nav>
          </div>

          {/* Locations */}
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.16em] text-background/40'>
              Lokasi aktif
            </p>

            <div className='mt-5 space-y-4'>
              {locations.map((location) => (
                <Link key={location} href='#locations' className='group flex items-start gap-3'>
                  <span className='mt-1 flex size-7 shrink-0 items-center justify-center rounded-lg bg-background/10'>
                    <MapPin className='size-3.5 text-background/60' aria-hidden='true' />
                  </span>

                  <span className='text-sm leading-6 text-background/65 transition-colors group-hover:text-background'>
                    {location}
                  </span>
                </Link>
              ))}
            </div>

            <div className='mt-6 border-t border-background/10 pt-5'>
              <p className='text-xs leading-5 text-background/40'>
                Kopilogi Hallway sudah tutup permanen dan tidak lagi melayani pelanggan.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className='mt-14 border-t border-background/10 pt-6 sm:mt-16'>
          <div className='flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex flex-col gap-1'>
              <p className='text-xs text-background/45'>© 2026 Kopilogi. Semua hak dilindungi.</p>

              <p className='text-xs text-background/30'>Coffee, food & good moments.</p>
            </div>

            <div className='flex items-center gap-3'>
              <Link
                href='#menu'
                aria-label='Lihat menu Kopilogi'
                className='flex size-9 items-center justify-center rounded-full border border-background/10 bg-background/5 text-background/55 transition-all duration-300 hover:border-background/20 hover:bg-background/10 hover:text-background'
              >
                <UtensilsCrossed className='size-4' aria-hidden='true' />
              </Link>

              <a
                href='https://www.instagram.com/kopilogi/'
                target='_blank'
                rel='noopener noreferrer'
                aria-label='Instagram Kopilogi'
                className='flex size-9 items-center justify-center rounded-full border border-background/10 bg-background/5 text-background/55 transition-all duration-300 hover:border-background/20 hover:bg-background/10 hover:text-background'
              >
                <FaInstagram  className='size-6' aria-hidden='true' />
              </a>

              <Link
                href='#home'
                className='flex size-9 items-center justify-center rounded-full border border-background/10 bg-background/5 text-xs font-medium text-background/55 transition-all duration-300 hover:border-background/20 hover:bg-background/10 hover:text-background'
                aria-label='Kembali ke atas'
              >
                ↑
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
