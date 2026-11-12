import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";
import type { PublicMenu, PublicMenuCategory } from "@/features/menu/types";

const categories: Array<{
  title: PublicMenuCategory;
  description: string;
}> = [
  {
    title: "Kopi",
    description: "Pilihan kopi untuk menemani pagi, sore, maupun waktu bersantai.",
  },
  {
    title: "Minuman",
    description: "Beragam pilihan minuman untuk dinikmati sesuai suasana hati.",
  },
  {
    title: "Makanan",
    description: "Pilihan makanan yang cocok dinikmati bersama kopi dan minuman favorit.",
  },
];

type MenuSectionProps = {
  menus: PublicMenu[];
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function MenuSection({ menus }: MenuSectionProps) {
  return (
    <section id='menu' className='border-t border-[#deded8] bg-[#f5f5f2] text-[#20211f]'>
      <Container className='py-16 sm:py-20 lg:py-28'>
        <SectionHeading
          label='Menu'
          title='Temukan pilihan untuk setiap momen.'
          description='Jelajahi pilihan kopi, minuman, dan makanan yang tersedia di Kopilogi.'
        />

        {/* Category cards */}
        <div className='mt-10 grid grid-cols-1 items-stretch gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3'>
          {categories.map((category, index) => {
            const categoryMenus = menus.filter((menu) => menu.category === category.title);

            return (
              <Link
                key={category.title}
                href={`/menu?category=${encodeURIComponent(category.title)}`}
                className='group flex h-full min-h-64 flex-col rounded-3xl border border-[#deded8] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#bdbdb6] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#77776f] focus-visible:ring-offset-2 sm:p-7'
              >
                <div className='flex items-start justify-between gap-3'>
                  <span className='text-sm font-medium text-[#85857e]'>
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className='shrink-0 rounded-full border border-[#e5e5df] bg-[#f8f8f5] px-3 py-1 text-xs font-medium text-[#6f706b]'>
                    {categoryMenus.length} menu
                  </span>
                </div>

                <div className='mt-auto pt-10'>
                  <h3 className='text-2xl font-semibold tracking-tight'>{category.title}</h3>

                  <p className='mt-3 max-w-sm text-sm leading-6 text-[#6f706b]'>
                    {category.description}
                  </p>

                  <div className='mt-6 flex items-center gap-2 text-sm font-medium'>
                    Lihat pilihan
                    <ArrowUpRight className='size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5' />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Menu from database */}
        {menus.length > 0 && (
          <div className='mt-14 sm:mt-16'>
            <div className='flex items-end justify-between gap-4'>
              <div>
                <p className='text-sm font-medium text-[#6f706b]'>Pilihan Kopilogi</p>

                <h3 className='mt-2 text-2xl font-semibold tracking-tight sm:text-3xl'>
                  Menu yang tersedia
                </h3>
              </div>

              <Link
                href='/menu'
                className='hidden shrink-0 items-center gap-2 text-sm font-medium transition-colors hover:text-[#77776f] sm:inline-flex'
              >
                Lihat semua
                <ArrowUpRight className='size-4' />
              </Link>
            </div>

            <div className='mt-7 grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3'>
              {menus.slice(0, 6).map((menu) => (
                <Link
                  key={menu.id}
                  href={`/menu/${menu.slug}`}
                  className='group flex h-full min-w-0 flex-col overflow-hidden rounded-3xl border border-[#deded8] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#bdbdb6] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#77776f] focus-visible:ring-offset-2'
                >
                  {/* Consistent image dimensions */}
                  <div className='aspect-[4/3] w-full shrink-0 overflow-hidden bg-[#e9e9e4]'>
                    {menu.image ? (
                      <img
                        src={menu.image}
                        alt={menu.name}
                        loading='lazy'
                        className='size-full object-cover transition-transform duration-500 group-hover:scale-105'
                      />
                    ) : (
                      <div className='flex size-full items-center justify-center text-sm text-[#85857e]'>
                        Tidak ada gambar
                      </div>
                    )}
                  </div>

                  {/* Consistent card content */}
                  <div className='flex flex-1 flex-col p-4 sm:p-5'>
                    <div className='flex min-h-6 items-start justify-between gap-3'>
                      <span className='text-xs font-medium text-[#77776f]'>{menu.category}</span>

                      {menu.featured && (
                        <span className='shrink-0 rounded-full border border-[#e5e5df] bg-[#f8f8f5] px-2.5 py-1 text-[10px] font-medium text-[#55564f]'>
                          Favorit
                        </span>
                      )}
                    </div>

                    <h4 className='mt-3 line-clamp-1 text-base font-semibold tracking-tight sm:text-lg'>
                      {menu.name}
                    </h4>

                    <p className='mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-[#6f706b]'>
                      {menu.description}
                    </p>

                    {/* Price and detail stay aligned at the bottom */}
                    <div className='mt-auto flex items-center justify-between gap-3 border-t border-[#eeeeea] pt-4'>
                      <span className='text-sm font-semibold text-[#20211f]'>
                        {formatPrice(menu.price)}
                      </span>

                      <span className='inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-[#77776f] transition-colors group-hover:text-[#20211f]'>
                        Detail
                        <ArrowUpRight className='size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5' />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <Link
              href='/menu'
              className='mt-7 flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#deded8] bg-white px-5 text-sm font-medium transition-colors hover:bg-[#eeeeea] sm:hidden'
            >
              Lihat semua menu
              <ArrowUpRight className='size-4' />
            </Link>
          </div>
        )}

        {/* Empty state */}
        {menus.length === 0 && (
          <div className='mt-12 rounded-3xl border border-dashed border-[#cfcfc8] bg-white p-8 text-center sm:p-10'>
            <p className='text-sm leading-6 text-[#6f706b]'>
              Menu sedang dipersiapkan. Silakan kembali lagi nanti.
            </p>
          </div>
        )}
      </Container>
    </section>
  );
}
