'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { db, Product, Category } from '@/lib/db';
import { Search, MessageSquare, X, SlidersHorizontal, Grid, ChevronRight, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

function ProductsContent() {
  const { addToCart } = useCart();
  const searchParams = useSearchParams();
  const navbarQuery = searchParams ? searchParams.get('search') || '' : '';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState(navbarQuery);
  const [priceRange, setPriceRange] = useState<number>(1500);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [maxPriceLimit, setMaxPriceLimit] = useState(1500);

  // Sync search query from navbar redirect
  useEffect(() => {
    setSearchQuery(navbarQuery);
  }, [navbarQuery]);

  useEffect(() => {
    const allProducts = db.getProducts();
    const allCategories = db.getCategories();
    
    setProducts(allProducts);
    setCategories(allCategories);
    setFilteredProducts(allProducts);

    if (allProducts.length > 0) {
      const prices = allProducts.map((p) => p.price);
      const maxPrice = Math.max(...prices);
      setMaxPriceLimit(maxPrice);
      setPriceRange(maxPrice);
    }
  }, []);

  // Filter logic
  useEffect(() => {
    let result = products;

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

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
  }, [selectedCategory, searchQuery, priceRange, products]);

  return (
    <div className="flex-grow bg-transparent min-h-screen pb-16">
      
      {/* Page Header */}
      <div className="relative py-12 text-center mt-6 max-w-7xl mx-auto crystal-glass border border-white/50 shadow-sm rounded-3xl overflow-hidden backdrop-blur-md">
        <div className="absolute inset-0 bg-gradient-to-r from-[#9DE8FF]/10 to-[#DDD6FF]/10 -z-10"></div>
        <div className="relative z-10 space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">Our Product Catalogue</h1>
          <p className="text-sm sm:text-base text-slate-700 font-medium">
            Explore 50+ study resources, notebooks, premium writing instruments, and cyber amenities.
          </p>
        </div>
      </div>

      {/* Main Page Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar Filters */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Main Filters box */}
            <div className="crystal-glass p-6 rounded-2xl border border-white/50 shadow-md space-y-6">
              <div className="flex items-center gap-2 border-b border-white/20 pb-3">
                <SlidersHorizontal className="w-4 h-4 text-sky-700" />
                <h2 className="font-extrabold text-slate-900 text-base">Filter Catalog</h2>
              </div>

              {/* Keyword Search */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Search Keyword</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search copies, pens, UPSC..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/40 border border-slate-200 rounded-xl py-2 pl-3 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:bg-white/60 text-[#17202A] placeholder-slate-500 transition-all"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                </div>
              </div>

              {/* Price range */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Max Price Limit</label>
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
                <div className="flex justify-between text-3xs font-semibold text-slate-550">
                  <span>₹5</span>
                  <span>₹{maxPriceLimit}</span>
                </div>
              </div>

              {/* Reset action */}
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setPriceRange(maxPriceLimit);
                }}
                className="w-full text-center py-2.5 glass-button text-[#17202A] rounded-xl text-xs font-extrabold transition-all border border-white/65 shadow-sm"
              >
                Clear All Filters
              </button>
            </div>

            {/* Category Navigation List */}
            <div className="crystal-glass p-6 rounded-2xl border border-white/50 shadow-md space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm border-b border-white/20 pb-2">Categories</h3>
              <div className="flex flex-col space-y-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-colors border ${
                    selectedCategory === 'all'
                      ? 'bg-[#9DE8FF]/45 text-sky-900 border-white/40 font-extrabold shadow-sm'
                      : 'text-slate-650 hover:bg-white/30 border-transparent'
                  }`}
                >
                  <span>All Categories</span>
                  <span className="bg-white/40 text-slate-700 border border-white/60 text-3xs px-2.5 py-0.5 rounded-full font-bold">
                    {products.length}
                  </span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-colors border ${
                      selectedCategory === cat.slug
                        ? 'bg-[#9DE8FF]/45 text-sky-900 border-white/40 font-extrabold shadow-sm'
                        : 'text-slate-650 hover:bg-white/30 border-transparent'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="bg-white/40 text-slate-700 border border-white/60 text-3xs px-2.5 py-0.5 rounded-full font-bold">
                      {products.filter((p) => p.category === cat.slug).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Product Grid */}
          <div className="lg:col-span-9 space-y-6">
            
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-slate-600">
                Found <strong className="text-slate-900">{filteredProducts.length}</strong> items in the shop
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="crystal-glass rounded-3xl border border-white/50 p-12 text-center shadow-lg space-y-4">
                <div className="text-slate-350 text-5xl">🛍️</div>
                <h3 className="text-lg font-bold text-slate-900">No Products Found</h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto">
                  Try adjusting filters, clearing your search query, or selecting another category from the sidebar!
                </p>
              </div>
            ) : (
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
                      <span className="text-3xs font-extrabold text-sky-800 uppercase tracking-widest block">
                        {product.category.replace('-', ' & ')}
                      </span>
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

                      <div className="grid grid-cols-2 gap-1.5 pt-2">
                        <button
                          onClick={() => addToCart(product)}
                          className="bg-sky-50 hover:bg-sky-100 text-sky-850 text-2xs sm:text-xs font-black py-2 rounded-lg transition-colors border border-sky-100 flex items-center justify-center gap-1 shadow-2xs"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 text-sky-700" />
                          <span>Add</span>
                        </button>
                        <a
                          href={`https://wa.me/918340383252?text=Hello%20KV%20Pustakalaya,%20I%2520want%2520to%2520order%2520${encodeURIComponent(product.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-2xs sm:text-xs font-black py-2 rounded-lg transition-colors border border-emerald-100 flex items-center justify-center gap-1 shadow-2xs"
                        >
                          <MessageSquare className="w-3.5 h-3.5 fill-current" />
                          <span>Inquire</span>
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
                  {selectedProduct.category.replace('-', ' & ')}
                </span>
                <h3 className="text-xl font-black text-slate-900 leading-tight">{selectedProduct.name}</h3>
                
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-950">₹{selectedProduct.price}</span>
                  {selectedProduct.originalPrice && (
                    <span className="text-slate-500 line-through text-sm font-semibold">₹{selectedProduct.originalPrice}</span>
                  )}
                </div>

                <p className="text-xs text-slate-650 font-medium leading-relaxed">{selectedProduct.description}</p>
                
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

              <div className="pt-6 space-y-2">
                <button
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white py-2.5 rounded-xl font-bold text-sm transition-all shadow-md"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
                <a
                  href={`https://wa.me/918340383252?text=Hello%20KV%20Pustakalaya,%20I%2520want%2520to%2520buy%2520${encodeURIComponent(selectedProduct.name)}%2520for%2520Rs.%2520${selectedProduct.price}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-emerald-650 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  <span>Order via WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="flex-grow flex items-center justify-center p-12 bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-sky-600"></div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
