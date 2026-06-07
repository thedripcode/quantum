'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Camera, ChevronRight } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Badge } from '@/components/ui/Badge';
import { GALLERY_ITEMS } from '@/lib/mockData';

const UNSPLASH_IMAGES = [
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop',
];

const CATEGORY_COLORS: Record<string, 'blue' | 'green' | 'gold' | 'purple'> = {
  Events:   'gold',
  Academic: 'blue',
  Sports:   'green',
};

export default function GalleryPreview() {
  return (
    <section id="gallery" className="py-24 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <SectionHeader
          tag="Gallery"
          title="Life at Sidelile"
          subtitle="Moments that capture the spirit, achievement, and vibrant community of our school."
        />

        {/* Masonry-style grid */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[180px]">
          {GALLERY_ITEMS.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              whileHover={{ scale: 1.03 }}
              className={`relative rounded-2xl overflow-hidden cursor-pointer group shadow-card hover:shadow-card-hover transition-all duration-300 ${
                i === 0 ? 'sm:col-span-2 sm:row-span-2' : ''
              }`}
            >
              <Image
                src={UNSPLASH_IMAGES[i] ?? ''}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-school-blue-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <Badge variant={CATEGORY_COLORS[item.category] ?? 'blue'} className="mb-2">
                  {item.category}
                </Badge>
                <p className="text-white text-sm font-semibold leading-tight">{item.title}</p>
              </div>

              {/* Camera icon */}
              <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Camera className="w-4 h-4 text-white" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <button className="inline-flex items-center gap-2 text-school-blue-700 dark:text-school-blue-400 hover:text-school-blue-900 dark:hover:text-white font-semibold text-sm transition-colors group">
            <Camera className="w-4 h-4" />
            View full gallery
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
