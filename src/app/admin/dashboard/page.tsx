'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { db, Product, Category, Offer, Inquiry, ShopInfo } from '@/lib/db';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Percent, 
  MessageSquare, 
  Settings, 
  User, 
  LogOut, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Check, 
  X, 
  Phone, 
  Eye, 
  TrendingUp, 
  Clock, 
  MapPin, 
  AlertCircle 
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'offers' | 'messages' | 'shop_info'>('overview');
  
  // Database States
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [shopInfo, setShopInfo] = useState<ShopInfo | null>(null);

  // Search & Filter within Admin Table
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');

  // Modal forms states
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Product Form Inputs
  const [pName, setPName] = useState('');
  const [pPrice, setPPrice] = useState(0);
  const [pOriginalPrice, setPOriginalPrice] = useState(0);
  const [pCategory, setPCategory] = useState('notebook');
  const [pImage, setPImage] = useState('');
  const [pDescription, setPDescription] = useState('');
  const [pOfferBadge, setPOfferBadge] = useState('');
  const [pStockStatus, setPStockStatus] = useState<'in_stock' | 'out_of_stock' | 'low_stock'>('in_stock');
  const [pFeatured, setPFeatured] = useState(false);
  const [pNewArrival, setPNewArrival] = useState(false);

  // Shop Info Inputs
  const [shopPhone, setShopPhone] = useState('');
  const [shopHours, setShopHours] = useState('');
  const [shopLocation, setShopLocation] = useState('');
  const [shopCashWithdrawal, setShopCashWithdrawal] = useState(true);
  const [shopFormFilling, setShopFormFilling] = useState(true);
  const [infoUpdated, setInfoUpdated] = useState(false);

  // Verification check on mount
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('kv_admin_session');
    if (isLoggedIn !== 'true') {
      router.push('/admin');
      return;
    }
    
    // Seed and fetch data
    db.init();
    refreshData();
  }, [router]);

  const refreshData = () => {
    setProducts(db.getProducts());
    setCategories(db.getCategories());
    setOffers(db.getOffers());
    setInquiries(db.getInquiries());
    
    const info = db.getShopInfo();
    setShopInfo(info);
    setShopPhone(info.phone);
    setShopHours(info.hours);
    setShopLocation(info.location);
    setShopCashWithdrawal(info.cashWithdrawal);
    setShopFormFilling(info.formFilling);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('kv_admin_session');
    router.push('/admin');
  };

  // Open Add Product Modal
  const openAddModal = () => {
    setEditingProduct(null);
    setPName('');
    setPPrice(0);
    setPOriginalPrice(0);
    setPCategory('notebook');
    setPImage('https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500&auto=format&fit=crop&q=60');
    setPDescription('');
    setPOfferBadge('');
    setPStockStatus('in_stock');
    setPFeatured(false);
    setPNewArrival(false);
    setShowProductModal(true);
  };

  // Open Edit Product Modal
  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setPName(p.name);
    setPPrice(p.price);
    setPOriginalPrice(p.originalPrice || 0);
    setPCategory(p.category);
    setPImage(p.image);
    setPDescription(p.description);
    setPOfferBadge(p.offerBadge || '');
    setPStockStatus(p.stockStatus);
    setPFeatured(p.featured);
    setPNewArrival(p.newArrival);
    setShowProductModal(true);
  };

  // Delete product action
  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product from the shop catalogue?')) {
      db.deleteProduct(id);
      refreshData();
    }
  };

  // Save product (Add or Update)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName.trim() || pPrice <= 0 || !pDescription.trim()) {
      alert('Please fill out Name, Price and Description.');
      return;
    }

    const payload = {
      name: pName.trim(),
      price: Number(pPrice),
      originalPrice: pOriginalPrice > 0 ? Number(pOriginalPrice) : undefined,
      category: pCategory,
      image: pImage || 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500&auto=format&fit=crop&q=60',
      description: pDescription.trim(),
      offerBadge: pOfferBadge.trim() || undefined,
      stockStatus: pStockStatus,
      featured: pFeatured,
      newArrival: pNewArrival
    };

    if (editingProduct) {
      db.updateProduct(editingProduct.id, payload);
    } else {
      db.addProduct(payload);
    }

    setShowProductModal(false);
    refreshData();
  };

  // Delete Inquiry Message
  const handleDeleteInquiry = (id: string) => {
    if (confirm('Delete this message inquiry?')) {
      db.deleteInquiry(id);
      refreshData();
    }
  };

  // Save Shop Info Updates
  const handleUpdateShopInfo = (e: React.FormEvent) => {
    e.preventDefault();
    db.updateShopInfo({
      phone: shopPhone,
      hours: shopHours,
      location: shopLocation,
      cashWithdrawal: shopCashWithdrawal,
      formFilling: shopFormFilling
    });
    setInfoUpdated(true);
    refreshData();
    setTimeout(() => setInfoUpdated(false), 3000);
  };

  // Toggle Offer state
  const handleToggleOffer = (id: string, currentActive: boolean) => {
    db.updateOffer(id, { active: !currentActive });
    refreshData();
  };

  // Filter products for dashboard table view
  const dashboardFilteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
                          p.id.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory = productCategoryFilter === 'all' || p.category === productCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-grow bg-transparent text-[#17202A] flex flex-col md:flex-row min-h-screen">
      
      {/* 1. SIDEBAR PANEL */}
      <aside className="w-full md:w-64 crystal-glass border-r border-white/50 flex flex-col justify-between shrink-0 p-6 md:sticky md:top-0 md:h-screen backdrop-blur-md">
        <div className="space-y-8">
          
          {/* Dashboard branding logo */}
          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10 bg-white/60 border border-white/80 rounded-full p-0.5 flex items-center justify-center overflow-hidden shadow-sm">
              <Image
                src="/logo.png"
                alt="KV Pustakalaya Logo"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <div>
              <span className="text-base font-extrabold text-slate-900 tracking-tight">KV Admin Panel</span>
              <p className="text-3xs text-sky-800 font-extrabold uppercase tracking-widest mt-0.5">Control Centre</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-1.5">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-left transition-colors border ${
                activeTab === 'overview'
                  ? 'bg-[#9DE8FF]/45 text-sky-900 border-white/40 shadow-sm font-extrabold'
                  : 'text-slate-655 hover:bg-white/30 border-transparent hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview Analytics</span>
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-left transition-colors border ${
                activeTab === 'products'
                  ? 'bg-[#9DE8FF]/45 text-sky-900 border-white/40 shadow-sm font-extrabold'
                  : 'text-slate-655 hover:bg-white/30 border-transparent hover:text-slate-900'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Manage Products</span>
            </button>
            <button
              onClick={() => setActiveTab('offers')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-left transition-colors border ${
                activeTab === 'offers'
                  ? 'bg-[#9DE8FF]/45 text-sky-900 border-white/40 shadow-sm font-extrabold'
                  : 'text-slate-655 hover:bg-white/30 border-transparent hover:text-slate-900'
              }`}
            >
              <Percent className="w-4 h-4" />
              <span>Offers & Banners</span>
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-left transition-colors border ${
                activeTab === 'messages'
                  ? 'bg-[#9DE8FF]/45 text-sky-900 border-white/40 shadow-sm font-extrabold'
                  : 'text-slate-655 hover:bg-white/30 border-transparent hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Messages</span>
              {inquiries.length > 0 && (
                <span className="ml-auto bg-sky-700 text-white text-3xs px-2.5 py-0.5 rounded-full font-black">
                  {inquiries.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('shop_info')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-left transition-colors border ${
                activeTab === 'shop_info'
                  ? 'bg-[#9DE8FF]/45 text-sky-900 border-white/40 shadow-sm font-extrabold'
                  : 'text-slate-655 hover:bg-white/30 border-transparent hover:text-slate-900'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Shop Settings</span>
            </button>
          </nav>
        </div>

        {/* Footer profile & logout */}
        <div className="pt-6 border-t border-white/20 space-y-4">
          <div className="flex items-center gap-3 bg-white/20 p-3.5 rounded-xl border border-white/50 shadow-sm">
            <div className="bg-white/40 p-2 rounded-lg text-sky-850 border border-white/60 shrink-0 shadow-inner">
              <User className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-black text-slate-950 leading-none truncate">Prabhat Kumar</p>
              <span className="text-3xs text-slate-600 uppercase tracking-widest font-extrabold mt-1 block">Owner Profile</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-100/50 hover:bg-rose-200/50 border border-rose-200 text-rose-805 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout Session</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT CONTAINER */}
      <main className="flex-grow p-6 sm:p-8 lg:p-10 overflow-y-auto max-h-screen">
        
        {/* TOP GREETING HEADER */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/20 pb-6 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 capitalize">{activeTab.replace('_', ' ')} Panel</h1>
            <p className="text-xs text-slate-650 mt-1 font-medium">Hello Prabhat Kumar Prabhakar, welcome back. Manage KV Pustakalaya's digital profile.</p>
          </div>
          <div>
            <Link
              href="/"
              className="text-xs glass-button hover:bg-white/80 text-[#17202A] font-extrabold px-4 py-2.5 rounded-lg border border-white/60 shadow-sm transition-all"
              target="_blank"
            >
              Open Live Site
            </Link>
          </div>
        </header>

        {/* ==================================== */}
        {/* OVERVIEW ANALYTICS TAB */}
        {/* ==================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Grid of stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="crystal-glass border border-white/50 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                <div className="bg-white/40 text-sky-700 p-3 rounded-xl border border-white/60 shadow-inner">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xs font-bold uppercase tracking-wider text-slate-550">Products Catalogued</p>
                  <p className="text-2xl font-black text-slate-950 mt-0.5">{products.length}</p>
                </div>
              </div>

              <div className="crystal-glass border border-white/50 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                <div className="bg-white/40 text-sky-700 p-3 rounded-xl border border-white/60 shadow-inner">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xs font-bold uppercase tracking-wider text-slate-550">Customer Messages</p>
                  <p className="text-2xl font-black text-slate-950 mt-0.5">{inquiries.length}</p>
                </div>
              </div>

              <div className="crystal-glass border border-white/50 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                <div className="bg-white/40 text-sky-700 p-3 rounded-xl border border-white/60 shadow-inner">
                  <Percent className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xs font-bold uppercase tracking-wider text-slate-550">Promotions Live</p>
                  <p className="text-2xl font-black text-slate-950 mt-0.5">{offers.filter(o => o.active).length}</p>
                </div>
              </div>

              <div className="crystal-glass border border-white/50 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                <div className="bg-white/40 text-sky-700 p-3 rounded-xl border border-white/60 shadow-inner">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xs font-bold uppercase tracking-wider text-slate-550">Active Categories</p>
                  <p className="text-2xl font-black text-slate-950 mt-0.5">{categories.length}</p>
                </div>
              </div>
            </div>

            {/* Shop info recap & latest inquiry */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Shop recap */}
              <div className="crystal-glass border border-white/50 rounded-2xl p-6 space-y-4 shadow-sm">
                <h3 className="text-base font-extrabold text-slate-900">Active Shop Settings</h3>
                <hr className="border-white/20" />
                {shopInfo && (
                  <div className="space-y-3.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-550 font-bold">Shop Contact:</span>
                      <span className="font-extrabold text-slate-950">{shopInfo.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-550 font-bold">Timings:</span>
                      <span className="font-extrabold text-slate-950">{shopInfo.hours}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-550 font-bold">Address:</span>
                      <span className="font-extrabold text-slate-950">{shopInfo.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-550 font-bold">Cash Withdrawal (AEPS):</span>
                      <span className={`font-bold px-2 py-0.5 rounded-full border ${shopInfo.cashWithdrawal ? 'bg-emerald-100/50 text-emerald-805 border-emerald-200/30' : 'bg-rose-100/50 text-rose-805 border-rose-200/30'}`}>
                        {shopInfo.cashWithdrawal ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-550 font-bold">Online Form Filling:</span>
                      <span className={`font-bold px-2 py-0.5 rounded-full border ${shopInfo.formFilling ? 'bg-emerald-100/50 text-emerald-805 border-emerald-200/30' : 'bg-rose-100/50 text-rose-805 border-rose-200/30'}`}>
                        {shopInfo.formFilling ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Latest Message inquiry */}
              <div className="crystal-glass border border-white/50 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Latest Customer Message</h3>
                  <hr className="border-white/20 my-4" />
                  {inquiries.length > 0 ? (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-extrabold text-sky-800">{inquiries[0].name}</span>
                        <span className="text-slate-500 font-semibold">{new Date(inquiries[0].date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-slate-800 leading-relaxed italic bg-white/30 p-3 rounded-xl border border-white/50 font-medium">
                        "{inquiries[0].message}"
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic text-center py-6">No customer inquiries received yet.</p>
                  )}
                </div>
                <button
                  onClick={() => setActiveTab('messages')}
                  className="w-full text-center text-xs font-extrabold text-sky-800 hover:text-sky-900 mt-4 underline"
                >
                  View All Messages
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================================== */}
        {/* PRODUCTS MANAGEMENT TAB */}
        {/* ==================================== */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            
            {/* Filters & Actions Bar */}
            <div className="crystal-glass border border-white/50 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm backdrop-blur-md">
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                {/* Search */}
                <div className="relative flex-grow sm:flex-initial">
                  <input
                    type="text"
                    placeholder="Search product name..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full bg-white/40 border border-slate-200 focus:bg-white/60 focus:ring-2 focus:ring-sky-300 rounded-xl py-2 pl-3 pr-8 text-xs focus:outline-none text-[#17202A] placeholder-slate-500 transition-all"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3" />
                </div>
                {/* Category filter */}
                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="bg-white/40 border border-slate-200 rounded-xl py-2 px-3 text-xs text-[#17202A] focus:outline-none focus:ring-2 focus:ring-sky-300 font-medium"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Add Button */}
              <button
                onClick={openAddModal}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-[#9DE8FF]/60 to-[#B9D9FF]/60 hover:from-[#9DE8FF]/80 hover:to-[#B9D9FF]/80 text-[#17202A] rounded-xl text-xs font-extrabold transition-all border border-white/45 shadow-sm cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4 text-sky-850" />
                <span>Add Product</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="crystal-glass border border-white/50 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-white/30 text-slate-700 font-extrabold border-b border-white/20">
                      <th className="p-4 w-16">Image</th>
                      <th className="p-4">Name</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Stock Status</th>
                      <th className="p-4">Badges</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {dashboardFilteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-500 italic">
                          No matching products catalogued.
                        </td>
                      </tr>
                    ) : (
                      dashboardFilteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-white/20 transition-colors">
                          <td className="p-4">
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white/10 border border-white/50 flex items-center justify-center shrink-0 shadow-inner">
                              <Image src={p.image} alt={p.name} fill className="object-cover" />
                            </div>
                          </td>
                          <td className="p-4">
                            <p className="font-extrabold text-slate-950">{p.name}</p>
                            <span className="text-3xs text-slate-550 font-semibold font-mono">ID: {p.id}</span>
                          </td>
                          <td className="p-4">
                            <span className="bg-white/50 border border-white/60 text-sky-850 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest text-3xs shadow-inner">
                              {p.category}
                            </span>
                          </td>
                          <td className="p-4">
                            <p className="font-extrabold text-slate-950">₹{p.price}</p>
                            {p.originalPrice && (
                              <span className="text-slate-500 line-through text-3xs">₹{p.originalPrice}</span>
                            )}
                          </td>
                          <td className="p-4">
                            <span className={`font-extrabold uppercase text-3xs px-2.5 py-0.5 rounded-full border ${
                              p.stockStatus === 'in_stock' 
                                ? 'bg-emerald-100/50 text-emerald-805 border-emerald-200/30' 
                                : p.stockStatus === 'low_stock' 
                                  ? 'bg-amber-100/50 text-amber-850 border-amber-200/30' 
                                  : 'bg-rose-100/50 text-rose-805 border-rose-200/30'
                            }`}>
                              {p.stockStatus.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="p-4 space-y-1">
                            {p.offerBadge && (
                              <span className="inline-block bg-white/40 text-amber-850 font-extrabold text-3xs uppercase tracking-widest px-2 py-0.5 rounded-lg border border-white/60 shadow-sm">
                                {p.offerBadge}
                              </span>
                            )}
                            <div className="flex gap-2">
                              {p.featured && <span className="text-3xs font-extrabold text-sky-700">Featured</span>}
                              {p.newArrival && <span className="text-3xs font-extrabold text-emerald-700">New</span>}
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <div className="inline-flex gap-1.5">
                              <button
                                onClick={() => openEditModal(p)}
                                className="p-2 glass-button text-slate-700 hover:bg-[#9DE8FF]/40 border border-white/60 rounded-lg transition-all cursor-pointer shadow-sm"
                                title="Edit product"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id)}
                                className="p-2 glass-button text-rose-700 hover:bg-rose-100/50 border border-white/60 rounded-lg transition-all cursor-pointer shadow-sm"
                                title="Delete product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================================== */}
        {/* OFFERS & HOME ANN BANNERS */}
        {/* ==================================== */}
        {activeTab === 'offers' && (
          <div className="space-y-6">
            <div className="crystal-glass border border-white/50 rounded-2xl p-6 space-y-4 shadow-sm backdrop-blur-md">
              <h2 className="text-base font-extrabold text-slate-900">Festive Discount Banners</h2>
              <p className="text-xs text-slate-650 font-medium">Toggle active display campaigns and festive discounts for the home screen.</p>
              <hr className="border-white/20" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {offers.map((offer) => (
                  <div
                    key={offer.id}
                    className="crystal-glass-interactive border border-white/50 rounded-2xl p-5 flex flex-col justify-between space-y-4 relative shadow-sm"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="inline-block bg-[#9DE8FF]/45 text-sky-900 font-extrabold text-3xs px-2.5 py-0.5 rounded-full border border-white/40 uppercase tracking-wider mb-2 shadow-inner">
                          {offer.discount}
                        </span>
                        <h3 className="font-extrabold text-slate-950 text-base leading-snug">{offer.title}</h3>
                        <p className="text-xs text-slate-655 font-semibold mt-1">{offer.subtitle}</p>
                      </div>

                      {/* Active Status Badge */}
                      <button
                        onClick={() => handleToggleOffer(offer.id, offer.active)}
                        className={`text-2xs font-extrabold px-3 py-1 rounded-full border cursor-pointer transition-colors ${
                          offer.active 
                            ? 'bg-emerald-100/50 text-emerald-805 border-emerald-250/30 hover:bg-emerald-100/70' 
                            : 'bg-white/30 text-slate-555 border border-white/50 hover:bg-white/50'
                        }`}
                      >
                        {offer.active ? 'Active' : 'Disabled'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================================== */}
        {/* INQUIRIES & MESSAGES TAB */}
        {/* ==================================== */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <div className="crystal-glass border border-white/50 rounded-2xl p-6 space-y-4 shadow-sm backdrop-blur-md">
              <h2 className="text-base font-extrabold text-slate-900">Inquiries Inbox</h2>
              <p className="text-xs text-slate-655 font-medium">View customer requests for books stock checking, application forms, or bulk orders.</p>
              <hr className="border-white/20" />

              <div className="flex flex-col space-y-4">
                {inquiries.length === 0 ? (
                  <p className="text-xs text-slate-500 italic text-center py-10">No customer messages received yet.</p>
                ) : (
                  inquiries.map((msg) => (
                    <div
                      key={msg.id}
                      className="crystal-glass-interactive border border-white/50 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm"
                    >
                      <div className="space-y-2 max-w-xl">
                        <div className="flex items-center gap-3">
                          <span className="font-extrabold text-slate-900 text-sm">{msg.name}</span>
                          <span className="text-slate-500 text-3xs font-semibold uppercase">{new Date(msg.date).toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-slate-800 leading-relaxed italic bg-white/30 p-3.5 rounded-xl border border-white/50 font-medium">
                          {msg.message}
                        </p>
                        {msg.productName && (
                          <div className="inline-flex items-center gap-1.5 bg-white/40 text-sky-850 font-bold px-2 py-0.5 rounded-lg text-3xs border border-white/60 shadow-inner">
                            Inquired Product: {msg.productName}
                          </div>
                        )}
                      </div>

                      {/* Contact & Actions */}
                      <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto shrink-0 sm:justify-end">
                        <a
                          href={`tel:${msg.phone}`}
                          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 glass-button text-slate-700 border border-white/60 hover:bg-white/80 rounded-xl text-xs font-extrabold transition-all shadow-sm"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call: {msg.phone}</span>
                        </a>
                        <button
                          onClick={() => handleDeleteInquiry(msg.id)}
                          className="p-2 glass-button text-rose-700 hover:bg-rose-100/50 border border-white/60 rounded-xl transition-all cursor-pointer shadow-sm"
                          title="Delete message"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================================== */}
        {/* SHOP INFO & OWNER PROFILE SETTINGS */}
        {/* ==================================== */}
        {activeTab === 'shop_info' && (
          <div className="space-y-8">
            <div className="crystal-glass border border-white/50 rounded-2xl p-6 space-y-6 shadow-sm backdrop-blur-md">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Edit Shop Settings</h2>
                <p className="text-xs text-slate-655 font-medium mt-1">Configure KV Pustakalaya phone numbers, work hours, and service availability flags.</p>
              </div>
              <hr className="border-white/20" />

              {infoUpdated && (
                <div className="bg-emerald-100/50 border border-emerald-250/30 rounded-xl p-3.5 text-emerald-805 text-xs font-bold text-center">
                  Shop configuration settings saved successfully!
                </div>
              )}

              <form onSubmit={handleUpdateShopInfo} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-2xs font-extrabold text-slate-550 uppercase tracking-wider block">Shop Phone Support</label>
                    <input
                      type="text"
                      value={shopPhone}
                      onChange={(e) => setShopPhone(e.target.value)}
                      className="w-full bg-white/40 border border-slate-200 focus:bg-white/60 focus:ring-2 focus:ring-sky-300 text-[#17202A] placeholder-slate-500 rounded-xl py-2.5 px-4 text-xs sm:text-sm focus:outline-none transition-all font-medium"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-2xs font-extrabold text-slate-555 uppercase tracking-wider block">Shop Timings Hours</label>
                    <input
                      type="text"
                      value={shopHours}
                      onChange={(e) => setShopHours(e.target.value)}
                      className="w-full bg-white/40 border border-slate-200 focus:bg-white/60 focus:ring-2 focus:ring-sky-300 text-[#17202A] placeholder-slate-500 rounded-xl py-2.5 px-4 text-xs sm:text-sm focus:outline-none transition-all font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-2xs font-extrabold text-slate-555 uppercase tracking-wider block">Store Location Address</label>
                  <input
                    type="text"
                    value={shopLocation}
                    onChange={(e) => setShopLocation(e.target.value)}
                    className="w-full bg-white/40 border border-slate-200 focus:bg-white/60 focus:ring-2 focus:ring-sky-300 text-[#17202A] placeholder-slate-500 rounded-xl py-2.5 px-4 text-xs sm:text-sm focus:outline-none transition-all font-medium"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-2xs font-extrabold text-slate-555 uppercase tracking-wider block">Featured Services Badges</label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Cash Withdrawal Toggle */}
                    <button
                      type="button"
                      onClick={() => setShopCashWithdrawal(!shopCashWithdrawal)}
                      className={`p-4 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-colors ${
                        shopCashWithdrawal 
                          ? 'bg-sky-100/50 border-sky-250/30 text-sky-805' 
                          : 'bg-white/20 border-white/50 text-slate-555'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-900">Aadhaar Cash Withdrawal Badge</p>
                        <p className="text-3xs text-slate-600 mt-0.5 font-semibold">Toggle ATM glowing banner on homepage</p>
                      </div>
                      <span className={`w-8 h-5 rounded-full p-0.5 flex items-center transition-colors shrink-0 ${shopCashWithdrawal ? 'bg-sky-600 justify-end' : 'bg-slate-300 justify-start'}`}>
                        <span className="w-4 h-4 bg-white rounded-full shadow-sm"></span>
                      </span>
                    </button>

                    {/* Form Filling Toggle */}
                    <button
                      type="button"
                      onClick={() => setShopFormFilling(!shopFormFilling)}
                      className={`p-4 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-colors ${
                        shopFormFilling 
                          ? 'bg-emerald-100/50 border-emerald-250/30 text-emerald-805' 
                          : 'bg-white/20 border-white/50 text-slate-555'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-900">Online Form Filling Badge</p>
                        <p className="text-3xs text-slate-600 mt-0.5 font-semibold">Toggle Cyber banner on homepage</p>
                      </div>
                      <span className={`w-8 h-5 rounded-full p-0.5 flex items-center transition-colors shrink-0 ${shopFormFilling ? 'bg-emerald-600 justify-end' : 'bg-slate-300 justify-start'}`}>
                        <span className="w-4 h-4 bg-white rounded-full shadow-sm"></span>
                      </span>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="brand-gradient hover:brand-gradient-hover text-[#17202A] py-2.5 px-6 rounded-xl text-xs font-extrabold transition-all border border-white/45 shadow-sm cursor-pointer"
                >
                  Save Shop Settings
                </button>
              </form>
            </div>

            {/* Profile Section for Prabhat Kumar Prabhakar */}
            <div className="crystal-glass border border-white/50 rounded-2xl p-6 space-y-4 shadow-sm backdrop-blur-md">
              <h3 className="text-base font-extrabold text-slate-900">Owner Profile</h3>
              <hr className="border-white/20" />
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-white/30 border-2 border-white/60 flex items-center justify-center text-slate-400 shrink-0 shadow-inner">
                  <User className="w-10 h-10 text-sky-800" />
                </div>
                <div className="space-y-1 text-center sm:text-left">
                  <p className="text-base font-black text-slate-950">Prabhat Kumar Prabhakar</p>
                  <p className="text-xs text-sky-800 font-extrabold uppercase tracking-wider">Founder & Sole Proprietor</p>
                  <p className="text-xs text-slate-655 font-medium leading-relaxed max-w-md pt-1">
                    Authentically manages all book stocks and services at Harari Chowk since inception. Ensure details in layout headers are accurate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ==================================== */}
      {/* ADD / EDIT PRODUCT DIALOG MODAL */}
      {/* ==================================== */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg crystal-glass border border-white/50 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowProductModal(false)}
              className="absolute top-4 right-4 glass-button hover:bg-white/80 text-[#17202A] p-2 rounded-full border border-white/60 shadow-sm transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-lg font-black text-slate-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <p className="text-2xs text-slate-650 mt-1 font-medium">Configure product info, price, images, and category labels.</p>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs text-slate-700">
              
              <div className="space-y-1.5">
                <label className="text-3xs font-bold text-slate-500 uppercase tracking-widest block">Product Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Classmate Notebook"
                  value={pName}
                  onChange={(e) => setPName(e.target.value)}
                  className="w-full bg-white/40 border border-slate-200 focus:bg-white/60 focus:ring-2 focus:ring-sky-300 text-[#17202A] placeholder-slate-500 rounded-xl py-2 px-3 focus:outline-none transition-all font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-3xs font-bold text-slate-500 uppercase tracking-widest block">Price (₹) *</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="45"
                    value={pPrice || ''}
                    onChange={(e) => setPPrice(Number(e.target.value))}
                    className="w-full bg-white/40 border border-slate-200 focus:bg-white/60 focus:ring-2 focus:ring-sky-300 text-[#17202A] placeholder-slate-500 rounded-xl py-2 px-3 focus:outline-none transition-all font-medium"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-3xs font-bold text-slate-500 uppercase tracking-widest block">Original Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 50"
                    value={pOriginalPrice || ''}
                    onChange={(e) => setPOriginalPrice(Number(e.target.value))}
                    className="w-full bg-white/40 border border-slate-200 focus:bg-white/60 focus:ring-2 focus:ring-sky-300 text-[#17202A] placeholder-slate-500 rounded-xl py-2 px-3 focus:outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-3xs font-bold text-slate-500 uppercase tracking-widest block">Category *</label>
                  <select
                    value={pCategory}
                    onChange={(e) => setPCategory(e.target.value)}
                    className="w-full bg-white/40 border border-slate-200 focus:bg-white/60 focus:ring-2 focus:ring-sky-300 text-[#17202A] placeholder-slate-500 rounded-xl py-2 px-3 focus:outline-none transition-all font-medium"
                  >
                    {categories.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-3xs font-bold text-slate-500 uppercase tracking-widest block">Stock Status *</label>
                  <select
                    value={pStockStatus}
                    onChange={(e) => setPStockStatus(e.target.value as any)}
                    className="w-full bg-white/40 border border-slate-200 focus:bg-white/60 focus:ring-2 focus:ring-sky-300 text-[#17202A] placeholder-slate-500 rounded-xl py-2 px-3 focus:outline-none transition-all font-medium"
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="low_stock">Low Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-3xs font-bold text-slate-500 uppercase tracking-widest block">Image URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={pImage}
                  onChange={(e) => setPImage(e.target.value)}
                  className="w-full bg-white/40 border border-slate-200 focus:bg-white/60 focus:ring-2 focus:ring-sky-300 text-[#17202A] placeholder-slate-500 rounded-xl py-2 px-3 focus:outline-none transition-all font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-3xs font-bold text-slate-500 uppercase tracking-widest block">Offer Badge (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Best Seller, 15% OFF"
                  value={pOfferBadge}
                  onChange={(e) => setPOfferBadge(e.target.value)}
                  className="w-full bg-white/40 border border-slate-200 focus:bg-white/60 focus:ring-2 focus:ring-sky-300 text-[#17202A] placeholder-slate-500 rounded-xl py-2 px-3 focus:outline-none transition-all font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-3xs font-bold text-slate-500 uppercase tracking-widest block">Description *</label>
                <textarea
                  placeholder="Write clear product details, dimensions, grade levels..."
                  rows={3}
                  value={pDescription}
                  onChange={(e) => setPDescription(e.target.value)}
                  className="w-full bg-white/40 border border-slate-200 focus:bg-white/60 focus:ring-2 focus:ring-sky-300 text-[#17202A] placeholder-slate-500 rounded-xl py-2 px-3 focus:outline-none transition-all font-medium"
                  required
                ></textarea>
              </div>

              <div className="flex gap-6 py-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={pFeatured}
                    onChange={(e) => setPFeatured(e.target.checked)}
                    className="w-4 h-4 accent-sky-600 rounded cursor-pointer"
                  />
                  <span className="font-bold text-slate-700">Feature on Homepage</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={pNewArrival}
                    onChange={(e) => setPNewArrival(e.target.checked)}
                    className="w-4 h-4 accent-sky-600 rounded cursor-pointer"
                  />
                  <span className="font-bold text-slate-700">Mark as New Arrival</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="flex-1 py-2.5 glass-button text-slate-700 hover:bg-slate-100/50 border border-white/60 rounded-xl font-extrabold text-center transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-grow py-2.5 brand-gradient hover:brand-gradient-hover text-[#17202A] rounded-xl font-extrabold text-center transition-colors border border-white/45 shadow-md"
                >
                  Save Product
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
