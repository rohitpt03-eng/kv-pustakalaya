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
    <div className="flex-grow bg-slate-900 text-slate-100 flex flex-col md:flex-row min-h-screen">
      
      {/* 1. SIDEBAR PANEL */}
      <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between shrink-0 p-6 md:sticky md:top-0 md:h-screen">
        <div className="space-y-8">
          
          {/* Dashboard branding logo */}
          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10 bg-white rounded-full p-0.5 flex items-center justify-center overflow-hidden">
              <Image
                src="/logo.png"
                alt="KV Pustakalaya Logo"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-tight">KV Admin Panel</span>
              <p className="text-3xs text-sky-400 font-bold uppercase tracking-widest mt-0.5">Control Centre</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-1.5">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-left transition-colors ${
                activeTab === 'overview' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview Analytics</span>
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-left transition-colors ${
                activeTab === 'products' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Manage Products</span>
            </button>
            <button
              onClick={() => setActiveTab('offers')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-left transition-colors ${
                activeTab === 'offers' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Percent className="w-4 h-4" />
              <span>Offers & Banners</span>
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-left transition-colors ${
                activeTab === 'messages' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white font-medium'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Messages</span>
              {inquiries.length > 0 && (
                <span className="ml-auto bg-sky-500 text-white text-3xs px-2 py-0.5 rounded-full font-bold">
                  {inquiries.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('shop_info')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-left transition-colors ${
                activeTab === 'shop_info' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white font-medium'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Shop Settings</span>
            </button>
          </nav>
        </div>

        {/* Footer profile & logout */}
        <div className="pt-6 border-t border-slate-800 space-y-4">
          <div className="flex items-center gap-3 bg-slate-900 p-3.5 rounded-xl border border-slate-800">
            <div className="bg-sky-950 p-2 rounded-lg text-sky-400 shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white leading-none truncate">Prabhat Kumar</p>
              <span className="text-3xs text-slate-500 uppercase tracking-widest font-semibold mt-1 block">Owner Profile</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-900/30 text-rose-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout Session</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT CONTAINER */}
      <main className="flex-grow p-6 sm:p-8 lg:p-10 overflow-y-auto max-h-screen">
        
        {/* TOP GREETING HEADER */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white capitalize">{activeTab.replace('_', ' ')} Panel</h1>
            <p className="text-xs text-slate-400 mt-1">Hello Prabhat Kumar Prabhakar, welcome back. Manage KV Pustakalaya's digital profile.</p>
          </div>
          <div>
            <Link
              href="/"
              className="text-xs bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2 rounded-lg border border-slate-700 transition-colors"
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
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
                <div className="bg-sky-600/10 text-sky-400 p-3 rounded-xl border border-sky-600/20">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xs font-bold uppercase tracking-wider text-slate-500">Products Catalogued</p>
                  <p className="text-2xl font-black text-white mt-0.5">{products.length}</p>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
                <div className="bg-emerald-600/10 text-emerald-400 p-3 rounded-xl border border-emerald-600/20">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xs font-bold uppercase tracking-wider text-slate-500">Customer Messages</p>
                  <p className="text-2xl font-black text-white mt-0.5">{inquiries.length}</p>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
                <div className="bg-yellow-600/10 text-yellow-400 p-3 rounded-xl border border-yellow-600/20">
                  <Percent className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xs font-bold uppercase tracking-wider text-slate-500">Promotions Live</p>
                  <p className="text-2xl font-black text-white mt-0.5">{offers.filter(o => o.active).length}</p>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
                <div className="bg-purple-600/10 text-purple-400 p-3 rounded-xl border border-purple-600/20">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xs font-bold uppercase tracking-wider text-slate-500">Active Categories</p>
                  <p className="text-2xl font-black text-white mt-0.5">{categories.length}</p>
                </div>
              </div>
            </div>

            {/* Shop info recap & latest inquiry */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Shop recap */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-base font-extrabold text-white">Active Shop Settings</h3>
                <hr className="border-slate-850" />
                {shopInfo && (
                  <div className="space-y-3.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Shop Contact:</span>
                      <span className="font-semibold text-white">{shopInfo.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Timings:</span>
                      <span className="font-semibold text-white">{shopInfo.hours}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Address:</span>
                      <span className="font-semibold text-white">{shopInfo.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Cash Withdrawal (AEPS):</span>
                      <span className={`font-bold px-2 py-0.5 rounded-full ${shopInfo.cashWithdrawal ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        {shopInfo.cashWithdrawal ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Online Form Filling:</span>
                      <span className={`font-bold px-2 py-0.5 rounded-full ${shopInfo.formFilling ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        {shopInfo.formFilling ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Latest Message inquiry */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-white">Latest Customer Message</h3>
                  <hr className="border-slate-850 my-4" />
                  {inquiries.length > 0 ? (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-sky-400">{inquiries[0].name}</span>
                        <span className="text-slate-500">{new Date(inquiries[0].date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-slate-350 leading-relaxed italic bg-slate-900 p-3 rounded-xl border border-slate-850">
                        "{inquiries[0].message}"
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic text-center py-6">No customer inquiries received yet.</p>
                  )}
                </div>
                <button
                  onClick={() => setActiveTab('messages')}
                  className="w-full text-center text-xs font-semibold text-sky-400 hover:text-sky-300 mt-4"
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
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                {/* Search */}
                <div className="relative flex-grow sm:flex-initial">
                  <input
                    type="text"
                    placeholder="Search product name..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-sky-500 rounded-xl py-2 pl-3 pr-8 text-xs focus:outline-none text-white"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-3" />
                </div>
                {/* Category filter */}
                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-300 focus:outline-none focus:border-sky-500"
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
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-slate-400 font-bold border-b border-slate-805">
                      <th className="p-4 w-16">Image</th>
                      <th className="p-4">Name</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Stock Status</th>
                      <th className="p-4">Badges</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {dashboardFilteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-500 italic">
                          No matching products catalogued.
                        </td>
                      </tr>
                    ) : (
                      dashboardFilteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="p-4">
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                              <Image src={p.image} alt={p.name} fill className="object-cover" />
                            </div>
                          </td>
                          <td className="p-4">
                            <p className="font-extrabold text-white">{p.name}</p>
                            <span className="text-3xs text-slate-500 font-mono">ID: {p.id}</span>
                          </td>
                          <td className="p-4">
                            <span className="bg-slate-900 text-sky-400 font-semibold px-2.5 py-0.5 rounded-full border border-sky-950 uppercase tracking-widest text-3xs">
                              {p.category}
                            </span>
                          </td>
                          <td className="p-4">
                            <p className="font-extrabold text-white">₹{p.price}</p>
                            {p.originalPrice && (
                              <span className="text-slate-500 line-through text-3xs">₹{p.originalPrice}</span>
                            )}
                          </td>
                          <td className="p-4">
                            <span className={`font-extrabold uppercase text-3xs px-2.5 py-0.5 rounded-full ${
                              p.stockStatus === 'in_stock' 
                                ? 'bg-emerald-500/10 text-emerald-400' 
                                : p.stockStatus === 'low_stock' 
                                  ? 'bg-amber-500/10 text-amber-400' 
                                  : 'bg-rose-500/10 text-rose-400'
                            }`}>
                              {p.stockStatus.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="p-4 space-y-1">
                            {p.offerBadge && (
                              <span className="inline-block bg-amber-500/15 text-amber-400 font-extrabold text-3xs uppercase tracking-widest px-2 py-0.5 rounded-lg border border-amber-500/20">
                                {p.offerBadge}
                              </span>
                            )}
                            <div className="flex gap-2">
                              {p.featured && <span className="text-3xs font-extrabold text-sky-400">Featured</span>}
                              {p.newArrival && <span className="text-3xs font-extrabold text-teal-400">New</span>}
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <div className="inline-flex gap-1.5">
                              <button
                                onClick={() => openEditModal(p)}
                                className="p-2 bg-slate-900 hover:bg-sky-650 hover:text-white border border-slate-800 rounded-lg text-slate-400 transition-all cursor-pointer"
                                title="Edit product"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id)}
                                className="p-2 bg-slate-900 hover:bg-rose-650 hover:text-white border border-slate-800 rounded-lg text-slate-450 transition-all cursor-pointer"
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
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-base font-extrabold text-white">Festive Discount Banners</h2>
              <p className="text-xs text-slate-400">Toggle active display campaigns and festive discounts for the home screen.</p>
              <hr className="border-slate-850" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {offers.map((offer) => (
                  <div
                    key={offer.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 relative"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="inline-block bg-yellow-400/10 text-yellow-400 font-extrabold text-3xs px-2.5 py-0.5 rounded-full border border-yellow-500/20 uppercase tracking-wider mb-2">
                          {offer.discount}
                        </span>
                        <h3 className="font-bold text-white text-base leading-snug">{offer.title}</h3>
                        <p className="text-xs text-slate-400 mt-1">{offer.subtitle}</p>
                      </div>

                      {/* Active Status Badge */}
                      <button
                        onClick={() => handleToggleOffer(offer.id, offer.active)}
                        className={`text-2xs font-extrabold px-3 py-1 rounded-full border cursor-pointer transition-colors ${
                          offer.active 
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/35 hover:bg-emerald-500/25' 
                            : 'bg-slate-850 text-slate-400 border-slate-750 hover:bg-slate-800'
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
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-base font-extrabold text-white">Inquiries Inbox</h2>
              <p className="text-xs text-slate-400">View customer requests for books stock checking, application forms, or bulk orders.</p>
              <hr className="border-slate-850" />

              <div className="flex flex-col space-y-4">
                {inquiries.length === 0 ? (
                  <p className="text-xs text-slate-500 italic text-center py-10">No customer messages received yet.</p>
                ) : (
                  inquiries.map((msg) => (
                    <div
                      key={msg.id}
                      className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-750 transition-colors"
                    >
                      <div className="space-y-2 max-w-xl">
                        <div className="flex items-center gap-3">
                          <span className="font-extrabold text-white text-sm">{msg.name}</span>
                          <span className="text-slate-500 text-3xs font-semibold uppercase">{new Date(msg.date).toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-850">
                          {msg.message}
                        </p>
                        {msg.productName && (
                          <div className="inline-flex items-center gap-1.5 bg-sky-950 text-sky-400 font-semibold px-2 py-0.5 rounded-lg text-3xs border border-sky-900">
                            Inquired Product: {msg.productName}
                          </div>
                        )}
                      </div>

                      {/* Contact & Actions */}
                      <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto shrink-0 sm:justify-end">
                        <a
                          href={`tel:${msg.phone}`}
                          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-sky-400 hover:text-sky-300 rounded-xl text-xs font-bold transition-all shadow-sm"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call: {msg.phone}</span>
                        </a>
                        <button
                          onClick={() => handleDeleteInquiry(msg.id)}
                          className="p-2 bg-slate-950 hover:bg-rose-650 hover:text-white border border-slate-800 text-slate-400 rounded-xl transition-all cursor-pointer"
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
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div>
                <h2 className="text-base font-extrabold text-white">Edit Shop Settings</h2>
                <p className="text-xs text-slate-400 mt-1">Configure KV Pustakalaya phone numbers, work hours, and service availability flags.</p>
              </div>
              <hr className="border-slate-850" />

              {infoUpdated && (
                <div className="bg-emerald-500/10 border border-emerald-500/35 rounded-xl p-3.5 text-emerald-400 text-xs font-medium text-center">
                  Shop configuration settings saved successfully!
                </div>
              )}

              <form onSubmit={handleUpdateShopInfo} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-2xs font-bold text-slate-400 uppercase tracking-wider block">Shop Phone Support</label>
                    <input
                      type="text"
                      value={shopPhone}
                      onChange={(e) => setShopPhone(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-805 rounded-xl py-2.5 px-4 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-500"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-2xs font-bold text-slate-400 uppercase tracking-wider block">Shop Timings Hours</label>
                    <input
                      type="text"
                      value={shopHours}
                      onChange={(e) => setShopHours(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-805 rounded-xl py-2.5 px-4 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-2xs font-bold text-slate-400 uppercase tracking-wider block">Store Location Address</label>
                  <input
                    type="text"
                    value={shopLocation}
                    onChange={(e) => setShopLocation(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-805 rounded-xl py-2.5 px-4 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-500"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-2xs font-bold text-slate-400 uppercase tracking-wider block">Featured Services Badges</label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Cash Withdrawal Toggle */}
                    <button
                      type="button"
                      onClick={() => setShopCashWithdrawal(!shopCashWithdrawal)}
                      className={`p-4 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-colors ${
                        shopCashWithdrawal 
                          ? 'bg-sky-600/10 border-sky-500/35 text-sky-300' 
                          : 'bg-slate-900 border-slate-800 text-slate-500'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold">Aadhaar Cash Withdrawal Badge</p>
                        <p className="text-3xs text-slate-500 mt-0.5">Toggle ATM glowing banner on homepage</p>
                      </div>
                      <span className={`w-8 h-5 rounded-full p-0.5 flex items-center transition-colors shrink-0 ${shopCashWithdrawal ? 'bg-sky-500 justify-end' : 'bg-slate-800 justify-start'}`}>
                        <span className="w-4 h-4 bg-white rounded-full shadow-sm"></span>
                      </span>
                    </button>

                    {/* Form Filling Toggle */}
                    <button
                      type="button"
                      onClick={() => setShopFormFilling(!shopFormFilling)}
                      className={`p-4 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-colors ${
                        shopFormFilling 
                          ? 'bg-emerald-600/10 border-emerald-500/35 text-emerald-300' 
                          : 'bg-slate-900 border-slate-800 text-slate-500'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold">Online Form Filling Badge</p>
                        <p className="text-3xs text-slate-500 mt-0.5">Toggle Cyber banner on homepage</p>
                      </div>
                      <span className={`w-8 h-5 rounded-full p-0.5 flex items-center transition-colors shrink-0 ${shopFormFilling ? 'bg-emerald-500 justify-end' : 'bg-slate-800 justify-start'}`}>
                        <span className="w-4 h-4 bg-white rounded-full shadow-sm"></span>
                      </span>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="brand-gradient hover:brand-gradient-hover text-white py-2.5 px-6 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Save Shop Settings
                </button>
              </form>
            </div>

            {/* Profile Section for Prabhat Kumar Prabhakar */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-extrabold text-white">Owner Profile</h3>
              <hr className="border-slate-850" />
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-slate-900 border-2 border-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                  <User className="w-10 h-10 text-sky-400" />
                </div>
                <div className="space-y-1 text-center sm:text-left">
                  <p className="text-base font-bold text-white">Prabhat Kumar Prabhakar</p>
                  <p className="text-xs text-sky-400 font-semibold uppercase tracking-wider">Founder & Sole Proprietor</p>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-md pt-1">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowProductModal(false)}
              className="absolute top-4 right-4 bg-slate-950 hover:bg-slate-800 text-slate-400 p-2 rounded-full transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-white">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <p className="text-2xs text-slate-400 mt-1">Configure product info, price, images, and category labels.</p>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs text-slate-350">
              
              <div className="space-y-1.5">
                <label className="text-3xs font-bold text-slate-400 uppercase tracking-widest block">Product Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Classmate Notebook"
                  value={pName}
                  onChange={(e) => setPName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-3xs font-bold text-slate-400 uppercase tracking-widest block">Price (₹) *</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="45"
                    value={pPrice || ''}
                    onChange={(e) => setPPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-sky-500"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-3xs font-bold text-slate-400 uppercase tracking-widest block">Original Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 50"
                    value={pOriginalPrice || ''}
                    onChange={(e) => setPOriginalPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-3xs font-bold text-slate-400 uppercase tracking-widest block">Category *</label>
                  <select
                    value={pCategory}
                    onChange={(e) => setPCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-sky-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-3xs font-bold text-slate-400 uppercase tracking-widest block">Stock Status *</label>
                  <select
                    value={pStockStatus}
                    onChange={(e) => setPStockStatus(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="low_stock">Low Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-3xs font-bold text-slate-400 uppercase tracking-widest block">Image URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={pImage}
                  onChange={(e) => setPImage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-3xs font-bold text-slate-400 uppercase tracking-widest block">Offer Badge (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Best Seller, 15% OFF"
                  value={pOfferBadge}
                  onChange={(e) => setPOfferBadge(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-3xs font-bold text-slate-400 uppercase tracking-widest block">Description *</label>
                <textarea
                  placeholder="Write clear product details, dimensions, grade levels..."
                  rows={3}
                  value={pDescription}
                  onChange={(e) => setPDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-sky-500"
                  required
                ></textarea>
              </div>

              <div className="flex gap-6 py-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={pFeatured}
                    onChange={(e) => setPFeatured(e.target.checked)}
                    className="w-4 h-4 accent-sky-500 rounded cursor-pointer"
                  />
                  <span className="font-semibold text-slate-350">Feature on Homepage</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={pNewArrival}
                    onChange={(e) => setPNewArrival(e.target.checked)}
                    className="w-4 h-4 accent-sky-500 rounded cursor-pointer"
                  />
                  <span className="font-semibold text-slate-350">Mark as New Arrival</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="flex-1 py-2.5 bg-slate-850 hover:bg-slate-800 text-slate-300 rounded-xl font-bold text-center border border-slate-750 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-grow py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold text-center transition-colors"
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
