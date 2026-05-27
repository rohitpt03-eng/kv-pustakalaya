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
    <div className="flex-grow bg-slate-50 min-h-screen pb-16">
      
      {/* Category Header Banner */}
      <div className="relative bg-slate-900 text-white py-14 overflow-hidden border-b border-sky-950">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-950/70 to-slate-950/70 z-10"></div>
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 space-y-3">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-400 hover:text-sky-300 uppercase tracking-widest transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Categories</span>
          </Link>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">{category.name}</h1>
          <p className="text-sm sm:text-base text-sky-200/90 font-medium">
            Explore {products.length} premium varieties of {category.name.toLowerCase()} at KV Pustakalaya.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar Filter Section */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <SlidersHorizontal className="w-4 h-4 text-sky-600" />
              <h2 className="font-bold text-slate-900 text-base">Filter Products</h2>
            </div>

            {/* Search Input inside category */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Search Name</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder={`Search in ${category.name.toLowerCase()}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-3 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
              </div>
            </div>

            {/* Price Filter Slider */}
            {maxPriceLimit > 5 && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Max Price</label>
                  <span className="text-sm font-extrabold text-sky-600">₹{priceRange}</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max={maxPriceLimit}
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-sky-600"
                />
                <div className="flex justify-between text-3xs font-semibold text-slate-400">
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
              className="w-full text-center py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
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
              <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-sm space-y-4">
                <div className="text-slate-300 text-5xl">🔍</div>
                <h3 className="text-lg font-bold text-slate-900">No Matching Products</h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto">
                  We couldn't find any products in {category.name.toLowerCase()} matching your filters. Try widening your price range or search query!
                </p>
              </div>
            ) : (
              /* Products Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between hover-scale transition-all"
                  >
                    <div className="relative aspect-square w-full bg-slate-50 overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-103"
                      />
                      {product.offerBadge && (
                        <span className="absolute top-3.5 left-3.5 bg-amber-500 text-white font-extrabold text-3xs uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
                          {product.offerBadge}
                        </span>
                      )}
                      
                      {/* Hover Quick View Trigger */}
                      <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <button
                          onClick={() => setSelectedProduct(product)}
                          className="bg-white text-slate-900 text-xs font-bold px-4.5 py-2 rounded-full shadow-lg hover:bg-slate-50 transition-all hover:scale-105"
                        >
                          Quick View
                        </button>
                      </div>
                    </div>

                    <div className="p-4 flex flex-col space-y-2">
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-base font-extrabold text-slate-950">₹{product.price}</span>
                          {product.originalPrice && (
                            <span className="text-slate-400 line-through text-xs font-semibold">₹{product.originalPrice}</span>
                          )}
                        </div>
                        <span className={`text-3xs font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          product.stockStatus === 'in_stock' 
                            ? 'bg-emerald-50 text-emerald-700' 
                            : product.stockStatus === 'low_stock' 
                              ? 'bg-amber-50 text-amber-700' 
                              : 'bg-rose-50 text-rose-700'
                        }`}>
                          {product.stockStatus.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="pt-2">
                        <a
                          href={`https://wa.me/918340383252?text=Hello%20KV%20Pustakalaya,%20I%20want%20to%20order%20${encodeURIComponent(product.name)}%20for%20Rs.%20${product.price}%20from%20${category.name}%20category.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-sky-600 text-white py-2 rounded-xl font-bold text-xs transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5 fill-current" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col md:flex-row max-h-[90vh]">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-10 bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-full transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative aspect-square w-full md:w-1/2 bg-slate-100">
              <Image
                src={selectedProduct.image}
                alt={selectedProduct.name}
                fill
                className="object-cover"
              />
              {selectedProduct.offerBadge && (
                <span className="absolute top-4 left-4 bg-amber-500 text-white font-extrabold text-2xs uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
                  {selectedProduct.offerBadge}
                </span>
              )}
            </div>

            <div className="p-6 md:w-1/2 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                <span className="text-2xs font-semibold text-sky-600 uppercase tracking-widest block">
                  {category.name}
                </span>
                <h3 className="text-xl font-bold text-slate-950">{selectedProduct.name}</h3>
                
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-950">₹{selectedProduct.price}</span>
                  {selectedProduct.originalPrice && (
                    <span className="text-slate-400 line-through text-sm font-semibold">₹{selectedProduct.originalPrice}</span>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{selectedProduct.description}</p>
                
                <div className="flex items-center gap-2">
                  <span className="text-2xs font-bold text-slate-500">Status:</span>
                  <span className={`text-2xs font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                    selectedProduct.stockStatus === 'in_stock' 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : selectedProduct.stockStatus === 'low_stock' 
                        ? 'bg-amber-50 text-amber-700' 
                        : 'bg-rose-50 text-rose-700'
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
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-sm transition-all shadow-sm"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
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
