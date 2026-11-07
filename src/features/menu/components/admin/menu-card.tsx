import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

import type { PublicMenu } from "../../types";

type MenuCardProps = {
  item: PublicMenu;
};

export function MenuCard({ item }: MenuCardProps) {
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(item.price);

  return (
    <Card className="group overflow-hidden rounded-[1.5rem] border-border/70 bg-card py-0 shadow-none transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/menu/${item.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
              Tidak ada gambar
            </div>
          )}

          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <Badge className="rounded-full border border-white/20 bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-md hover:bg-black/60">
              {item.category}
            </Badge>

            {item.featured && (
              <Badge className="rounded-full border border-white/20 bg-background/90 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-md">
                Favorit
              </Badge>
            )}
          </div>

          <div className="absolute bottom-4 right-4 flex size-10 items-center justify-center rounded-full bg-background/90 opacity-0 shadow-sm backdrop-blur-md transition-all duration-300 group-hover:opacity-100">
            <ArrowUpRight className="size-4" />
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                {item.name}
              </h3>

              <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                {item.description}
              </p>
            </div>

            <span className="shrink-0 text-sm font-semibold text-foreground">{formattedPrice}</span>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>{item.branchName}</span>

            {item.priceVerified && <span className="text-foreground">Harga terverifikasi</span>}
          </div>
        </div>
      </Link>
    </Card>
  );
}
