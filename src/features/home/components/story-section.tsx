import { ArrowRight, CheckCircle2, Clock3, MapPin, XCircle } from "lucide-react";

import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";

const milestones = [
  {
    year: "2015",
    title: "Berawal dari angkringan",
    description:
      "Kopilogi memulai perjalanan sebagai angkringan sederhana di depan rumah. Dari tempat yang sederhana inilah perjalanan Kopilogi dimulai.",
  },
  {
    year: "Perkembangan",
    title: "Berpindah ke Food Market Sehati",
    description:
      "Seiring berkembangnya usaha, Kopilogi kemudian berpindah ke Food Market Sehati dan mulai dikenal sebagai tempat untuk menikmati makanan dan minuman bersama.",
  },
  {
    year: "± 2017",
    title: "Menetap di lokasi Cikuray",
    description:
      "Kopilogi kemudian menetap di lokasi yang menjadi salah satu bagian penting dari perjalanan Kopilogi hingga saat ini, di Jl. Cikuray No. 42, Garut.",
  },
  {
    year: "Hari ini",
    title: "Tumbuh bersama pelanggan",
    description:
      "Kopilogi terus berkembang dengan menghadirkan kopi, minuman, makanan, dan dessert dalam berbagai suasana di setiap lokasinya.",
  },
];

const locations = [
  {
    name: "Kopilogi Cikuray",
    location: "Jl. Cikuray No. 42, Garut",
    status: "active",
    description: "Salah satu lokasi utama Kopilogi dengan konsep modern dan futuristik.",
  },
  {
    name: "Waroeng Kopilogi",
    location: "Jl. Guntur No. 14, Garut",
    status: "active",
    description:
      "Menghadirkan suasana traditional heritage dengan karakter yang lebih hangat dan klasik.",
  },
  {
    name: "Kopilogi Tasik",
    location: "Tasikmalaya",
    status: "active",
    description: "Lokasi Kopilogi dengan suasana cozy yang nyaman untuk menikmati waktu bersama.",
  },
  {
    name: "Kopilogi Hallway",
    location: "Garut",
    status: "closed",
    description:
      "Bagian dari perjalanan Kopilogi yang kini telah tutup secara permanen dan tidak lagi melayani pelanggan.",
  },
];

export function StorySection() {
  return (
    <section id='about' className='border-y border-[#deded8] bg-[#f5f5f2] text-[#20211f]'>
      <Container className='py-20 sm:py-28'>
        {/* Intro */}
        <div className='grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20'>
          <SectionHeading
            label='Cerita Kopilogi'
            title='Berawal sederhana, tumbuh bersama cerita.'
            description='Perjalanan Kopilogi dimulai dari sebuah angkringan sederhana hingga berkembang menjadi coffee shop dengan beberapa lokasi dan karakter yang berbeda.'
          />

          <div className='space-y-6 text-base leading-8 text-muted-foreground'>
            <p>
              Kopilogi memulai perjalanannya pada tahun 2015 sebagai angkringan sederhana di depan
              rumah. Dari tempat kecil tersebut, Kopilogi mulai membangun pengalaman dan hubungan
              dengan pelanggan.
            </p>

            <p>
              Seiring berjalannya waktu, Kopilogi berpindah ke Food Market Sehati sebelum akhirnya
              menetap di lokasi Cikuray sekitar tahun 2017. Perjalanan tersebut menjadi bagian
              penting dalam berkembangnya Kopilogi hingga dikenal sebagai tempat untuk menikmati
              kopi, makanan, dan waktu bersama.
            </p>

            <p>
              Dalam perkembangannya, Kopilogi hadir dengan beberapa lokasi yang memiliki karakter
              dan suasana berbeda. Setiap lokasi membawa pengalaman tersendiri, tetapi tetap berada
              dalam satu cerita Kopilogi.
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className='mt-20 border-t border-border pt-12 sm:mt-24 sm:pt-16'>
          <div className='mb-10 max-w-xl'>
            <p className='text-sm font-medium text-foreground'>Perjalanan</p>

            <h3 className='mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl'>
              Dari langkah kecil hingga berkembang.
            </h3>
          </div>

          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
            {milestones.map((milestone, index) => (
              <div
                key={milestone.title}
                className='relative rounded-2xl border border-[#deded8] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'
              >
                <div className='mb-6 flex items-center justify-between'>
                  <span className='text-sm font-semibold text-foreground'>{milestone.year}</span>

                  <span className='text-xs text-muted-foreground'>0{index + 1}</span>
                </div>

                <h4 className='text-lg font-semibold tracking-tight text-foreground'>
                  {milestone.title}
                </h4>

                <p className='mt-3 text-sm leading-6 text-muted-foreground'>
                  {milestone.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Locations history */}
        <div className='mt-20 border-t border-border pt-12 sm:mt-24 sm:pt-16'>
          <div className='grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20'>
            <div>
              <p className='text-sm font-medium text-foreground'>Perjalanan lokasi</p>

              <h3 className='mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl'>
                Setiap tempat punya ceritanya sendiri.
              </h3>

              <p className='mt-4 max-w-md text-sm leading-6 text-muted-foreground'>
                Kopilogi pernah dan masih hadir di beberapa lokasi dengan karakter yang berbeda.
                Berikut status lokasi Kopilogi saat ini.
              </p>
            </div>

            <div className='grid gap-4 sm:grid-cols-2'>
              {locations.map((location) => {
                const isClosed = location.status === "closed";

                return (
                  <div
                    key={location.name}
                    className={`rounded-2xl border p-5 transition-all duration-300 ${
                      isClosed
                        ? "border-[#deded8] bg-[#e9e9e4]"
                        : "border-[#deded8] bg-white hover:-translate-y-1 hover:shadow-lg"
                    }`}
                  >
                    <div className='flex items-start justify-between gap-4'>
                      <div className='flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted'>
                        {isClosed ? (
                          <XCircle className='size-5 text-muted-foreground' aria-hidden='true' />
                        ) : (
                          <MapPin className='size-5 text-foreground' aria-hidden='true' />
                        )}
                      </div>

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                          isClosed
                            ? "bg-muted text-muted-foreground"
                            : "bg-foreground/5 text-foreground"
                        }`}
                      >
                        {isClosed ? (
                          <>
                            <Clock3 className='size-3' aria-hidden='true' />
                            Tutup Permanen
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className='size-3' aria-hidden='true' />
                            Aktif
                          </>
                        )}
                      </span>
                    </div>

                    <h4 className='mt-5 text-base font-semibold text-foreground'>
                      {location.name}
                    </h4>

                    <p className='mt-1 text-xs text-muted-foreground'>{location.location}</p>

                    <p className='mt-4 text-sm leading-6 text-muted-foreground'>
                      {location.description}
                    </p>

                    {isClosed && (
                      <div className='mt-4 border-t border-border/70 pt-4'>
                        <p className='text-xs leading-5 text-muted-foreground'>
                          Lokasi ini sudah tidak beroperasi dan tidak tersedia untuk kunjungan atau
                          pemesanan.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Closing statement */}
        <div className='mt-16 rounded-3xl border border-[#deded8] bg-white p-6 sm:p-8 lg:p-10'>
          <div className='flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between'>
            <div className='max-w-2xl'>
              <p className='text-sm font-medium text-foreground'>Satu perjalanan, banyak cerita.</p>

              <p className='mt-2 text-sm leading-6 text-muted-foreground'>
                Dari angkringan sederhana hingga beberapa lokasi dengan karakter yang berbeda,
                Kopilogi terus membawa semangat yang sama: menjadi tempat untuk menikmati sajian,
                bertemu, dan menciptakan momen bersama.
              </p>
            </div>

            <a
              href='#locations'
              className='group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground'
            >
              Temukan lokasi aktif
              <ArrowRight
                className='size-4 transition-transform duration-300 group-hover:translate-x-1'
                aria-hidden='true'
              />
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
