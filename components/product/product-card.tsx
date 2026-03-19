// /components/product/product-card.tsx

"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";
import React from "react";

interface ProductCardProps {
  /** Product name/title */
  name: string;
  /** Short description (optional) */
  description?: string;
  /** Product image URL */
  image: string;
  /** Product price (string to allow currency symbols) */
  price: string;
  /** Optional old price for showing discount */
  oldPrice?: string;
  /** Whether the product is on sale */
  onSale?: boolean;
  /** Optional click handler for the main card */
  onClick?: () => void;
  /** Optional add-to-cart handler */
  onAddToCart?: () => void;
  /** Optional className for layout overrides */
  className?: string;
}

/**
 * A sleek, responsive product card with hover animations,
 * discount handling, and CTA actions.
 */
const ProductCard: React.FC<ProductCardProps> = ({
  name,
  description,
  image,
  price,
  oldPrice,
  onSale = false,
  onClick,
  onAddToCart,
  className,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 250, damping: 18 }}
      onClick={onClick}
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md transition-all flex flex-col",
        className
      )}
    >
      {/* Image */}
      <div className="relative w-full aspect-square overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
          priority
        />

        {/* Sale Badge */}
        {onSale && (
          <span className="absolute top-3 left-3 z-10 bg-rose-600 text-white text-xs font-semibold px-2 py-1 rounded-md">
            SALE
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => e.stopPropagation()}
          className="absolute top-3 right-3 bg-white/80 dark:bg-neutral-800/70 backdrop-blur-sm p-1.5 rounded-full text-neutral-700 dark:text-neutral-300 hover:text-rose-500 transition-colors"
        >
          <Heart className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 px-4 py-4">
        <h3 className="text-base font-semibold text-neutral-900 dark:text-white line-clamp-1">
          {name}
        </h3>
        {description && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">
            {description}
          </p>
        )}

        {/* Price */}
        <div className="mt-auto flex items-end justify-between pt-3">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {price}
            </span>
            {oldPrice && (
              <span className="text-sm text-neutral-400 line-through">
                {oldPrice}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          {onAddToCart && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart();
              }}
              className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-2 transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
