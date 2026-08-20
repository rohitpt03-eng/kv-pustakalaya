'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { db, Product, Category } from '@/lib/db';
import { ArrowLeft, Search, MessageSquare, X, SlidersHorizontal } from 'lucide-react';

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<number>(1500);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [maxPriceLimit, setMaxPriceLimit] = useState(1500);

  useEffect(() => {
    if (!slug) return;
    
    // Find category details
    const allCategories = db.getCategories();
    const cat = allCategories.find((c) => c.slug === slug);
    if (!cat) {
      // Category not found
      return;
    }
    setCategory(cat);

    // Fetch products belonging to this category
    const catProducts = db.getProductsByCategory(slug);
    setProducts(catProducts);
    setFilteredProducts(catProducts);

    // Determine max price in this category to configure the slider
    if (catProducts.length > 0) {
      const prices = catProducts.map((p) => p.price);
      const maxPrice = Math.max(...prices);
      setMaxPriceLimit(maxPrice);
      setPriceRange(maxPrice);
    }
  }, [slug]);

  // Apply filters
  useEffect(() => {
    let result = products;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Price range filter
    result = result.filter((p) => p.price <= priceRange);

    setFilteredProducts(result);
  }, [searchQuery, priceRange, products]);

  if (!category) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-12 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Category Not Found</h2>
        <p className="text-slate-500 mt-2">The product category you are looking for does not exist.</p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center gap-2 bg-sky-600 text-white px-6 py-3 rounded-full font-bold shadow-md hover:bg-sky-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-transparent min-h-screen pb-16">
      
      {/* Category Header Banner */}
      <div className="relative py-14 text-center mt-6 max-w-7xl mx-auto crystal-glass border border-white/50 shadow-sm rounded-3xl overflow-hidden backdrop-blur-md">
        <div className="absolute inset-0 bg-white/20 z-10"></div>
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 space-y-3">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-800 hover:text-sky-900 uppercase tracking-widest transition-colors font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Categories</span>
          </Link>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950">{category.name}</h1>
          <p className="text-sm sm:text-base text-slate-700 font-medium">
            Explore {products.length} premium varieties of {category.name.toLowerCase()} at KV Pustakalaya.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar Filter Section */}
          <div className="lg:col-span-3 crystal-glass p-6 rounded-2xl border border-white/50 shadow-md space-y-6">
            <div className="flex items-center gap-2 border-b border-white/20 pb-3">
              <SlidersHorizontal className="w-4 h-4 text-sky-700" />
              <h2 className="font-extrabold text-slate-900 text-base">Filter Products</h2>
            </div>

            {/* Search Input inside category */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Search Name</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder={`Search in ${category.name.toLowerCase()}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/40 border border-slate-200 rounded-xl py-2 pl-3 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:bg-white/60 text-[#17202A] placeholder-slate-500 transition-all"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
              </div>
            </div>

            {/* Price Filter Slider */}
            {maxPriceLimit > 5 && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Max Price</label>
                  <span className="text-sm font-extrabold text-sky-700">₹{priceRange}</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max={maxPriceLimit}
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-1.5 bg-white/40 rounded-lg appearance-none cursor-pointer accent-sky-600"
                />
                <div className="flex justify-between text-3xs font-semibold text-slate-500">
                  <span>₹5</span>
                  <span>₹{maxPriceLimit}</span>
                </div>
              </div>
            )}
            {/* Reset Filters Action */}
            <button
              onClick={() => {
                setSearchQuery('');
                setPriceRange(maxPriceLimit);
              }}
              className="w-full text-center py-2.5 glass-button text-[#17202A] rounded-xl text-xs font-extrabold transition-all border border-white/65 shadow-sm"
            >
              Reset Filters
            </button>
          </div>

          {/* Right Product Grid Area */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Filter Summary */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Showing <strong className="text-slate-900">{filteredProducts.length}</strong> of{' '}
                <strong className="text-slate-900">{products.length}</strong> products
              </p>
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 ? (
              <div className="crystal-glass rounded-3xl border border-white/50 p-12 text-center shadow-lg space-y-4">
                <div className="text-slate-350 text-5xl">🛍️</div>
                <h3 className="text-lg font-bold text-slate-900">No Matching Products</h3>
                <p className="text-slate-655 text-sm max-w-sm mx-auto font-medium">
                  We couldn't find any products in {category.name.toLowerCase()} matching your filters. Try widening your price range or search query!
                </p>
              </div>
            ) : (
              /* Products Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group crystal-glass-interactive overflow-hidden flex flex-col justify-between rounded-2xl border border-white/50 shadow-sm"
                  >
                    <div className="relative aspect-square w-full bg-white/10 overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-103"
                      />
                      {product.offerBadge && (
                        <span className="absolute top-3.5 left-3.5 bg-gradient-to-r from-[#9DE8FF]/90 to-[#B9D9FF]/90 text-[#17202A] font-extrabold text-3xs uppercase tracking-widest px-2.5 py-1 rounded-full shadow-md border border-white/50">
                          {product.offerBadge}
                        </span>
                      )}
                      
                      {/* Hover Quick View Trigger */}
                      <div className="absolute inset-0 bg-white/10 backdrop-blur-3xs opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <button
                          onClick={() => setSelectedProduct(product)}
                          className="bg-white/80 text-[#17202A] text-xs font-extrabold px-4.5 py-2 rounded-full shadow-lg hover:bg-white transition-all hover:scale-105 border border-white/60"
                        >
                          Quick View
                        </button>
                      </div>
                    </div>

                    <div className="p-4 flex flex-col space-y-2">
                      <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-sky-850 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-base font-black text-slate-950">₹{product.price}</span>
                          {product.originalPrice && (
                            <span className="text-slate-500 line-through text-xs font-semibold">₹{product.originalPrice}</span>
                          )}
                        </div>
                        <span className={`text-3xs font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                          product.stockStatus === 'in_stock' 
                            ? 'bg-emerald-100/50 text-emerald-805 border-emerald-200/30' 
                            : product.stockStatus === 'low_stock' 
                              ? 'bg-amber-100/50 text-amber-805 border-amber-200/30' 
                              : 'bg-rose-100/50 text-rose-805 border-rose-200/30'
                        }`}>
                          {product.stockStatus.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="pt-2">
                        <a
                          href={`https://wa.me/918340383252?text=Hello%20KV%20Pustakalaya,%20I%20want%20to%20order%20${encodeURIComponent(product.name)}%20for%20Rs.%20${product.price}%20from%20${category.name}%20category.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-1.5 bg-[#B9D9FF]/40 hover:bg-[#B9D9FF]/70 text-[#17202A] py-2.5 rounded-xl font-extrabold text-xs transition-colors border border-white/50 shadow-sm"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-sky-800 fill-current" />
                          <span>Inquire via WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* PRODUCT QUICK VIEW DIALOG */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md">
          <div className="relative w-full max-w-lg crystal-glass border border-white/50 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-10 glass-button hover:bg-white/80 text-[#17202A] p-2 rounded-full transition-all border border-white/60 shadow-sm"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative aspect-square w-full md:w-1/2 bg-white/10">
              <Image
                src={selectedProduct.image}
                alt={selectedProduct.name}
                fill
                className="object-cover"
              />
              {selectedProduct.offerBadge && (
                <span className="absolute top-4 left-4 bg-gradient-to-r from-[#9DE8FF]/90 to-[#B9D9FF]/90 text-[#17202A] font-extrabold text-2xs uppercase tracking-widest px-2.5 py-1 rounded-full shadow-md border border-white/50">
                  {selectedProduct.offerBadge}
                </span>
              )}
            </div>

            <div className="p-6 md:w-1/2 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                <span className="text-2xs font-extrabold text-sky-800 uppercase tracking-widest block">
                  {category.name}
                </span>
                <h3 className="text-xl font-black text-slate-900 leading-tight">{selectedProduct.name}</h3>
                
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-950">₹{selectedProduct.price}</span>
                  {selectedProduct.originalPrice && (
                    <span className="text-slate-505 line-through text-sm font-semibold">₹{selectedProduct.originalPrice}</span>
                  )}
                </div>

                <p className="text-xs text-slate-655 font-medium leading-relaxed">{selectedProduct.description}</p>
                
                <div className="flex items-center gap-2">
                  <span className="text-2xs font-bold text-slate-500">Status:</span>
                  <span className={`text-2xs font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                    selectedProduct.stockStatus === 'in_stock' 
                      ? 'bg-emerald-100/50 text-emerald-805 border-emerald-200/30' 
                      : selectedProduct.stockStatus === 'low_stock' 
                        ? 'bg-amber-100/50 text-amber-805 border-amber-200/30' 
                        : 'bg-rose-100/50 text-rose-805 border-rose-200/30'
                  }`}>
                    {selectedProduct.stockStatus.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="pt-6">
                <a
                  href={`https://wa.me/918340383252?text=Hello%20KV%20Pustakalaya,%20I%20want%20to%20buy%20${encodeURIComponent(selectedProduct.name)}%20for%20Rs.%20${selectedProduct.price}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#9DE8FF]/60 to-[#B9D9FF]/60 hover:from-[#9DE8FF]/80 hover:to-[#B9D9FF]/80 text-[#17202A] py-3 rounded-xl font-extrabold text-sm transition-all border border-white/50 shadow-sm"
                >
                  <MessageSquare className="w-4 h-4 fill-current text-sky-805" />
                  <span>Send WhatsApp Inquiry</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
