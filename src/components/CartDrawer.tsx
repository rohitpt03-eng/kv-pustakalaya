'use client';

import React from 'react';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, MessageSquare, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    cartCount,
    clearCart
  } = useCart();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    const whatsappNumber = '918340383252';
    const itemsList = cartItems
      .map(
        (item) =>
          `• ${item.product.name} (Qty: ${item.quantity}) - ₹${item.product.price * item.quantity}`
      )
      .join('\n');
    const message = `Hello KV Pustakalaya,\n\nI want to order the following items:\n\n${itemsList}\n\n*Total Amount: ₹${cartSubtotal}*\n\nPlease confirm availability. Thank you!`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop Backdrop Overlay */}
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Container Panel */}
      <div className="relative w-full max-w-md h-full bg-white/95 border-l border-white/40 shadow-2xl backdrop-blur-md flex flex-col z-10 transition-transform duration-300">
        
        {/* Header Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-sky-655" />
            <h2 className="text-lg font-black text-slate-900">Your Shopping Cart</h2>
            <span className="bg-sky-50 text-sky-800 text-xs px-2 py-0.5 rounded-full font-bold border border-sky-100">
              {cartCount} {cartCount === 1 ? 'item' : 'items'}
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-all"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-grow overflow-y-auto p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="bg-slate-50 p-6 rounded-full text-slate-400">
                <ShoppingBag className="w-12 h-12" />
              </div>
              <h3 className="text-base font-extrabold text-slate-800">Your cart is empty</h3>
              <p className="text-xs text-slate-500 max-w-[240px]">
                Add some stationery, notebooks, or exam books to start shopping!
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all"
              >
                Browse Products
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-3 bg-white/50 border border-slate-100 rounded-2xl p-3 shadow-sm hover:shadow-md transition-all"
              >
                {/* Image */}
                <div className="relative w-20 h-20 bg-slate-50 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Info and Quantity Controls */}
                <div className="flex-grow flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-sky-800 uppercase tracking-widest block">
                        {item.product.category.replace('-', ' & ')}
                      </span>
                      <h4 className="text-xs font-black text-slate-900 line-clamp-1 mt-0.5">
                        {item.product.name}
                      </h4>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 px-2 text-slate-500 hover:bg-slate-150 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 text-xs font-bold text-slate-800 select-none">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 px-2 text-slate-500 hover:bg-slate-150 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Price */}
                    <span className="text-xs font-black text-slate-950">
                      ₹{item.product.price * item.quantity}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Checkout */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-slate-150 bg-slate-50/50 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-slate-600">Subtotal</span>
              <span className="font-black text-lg text-slate-950">₹{cartSubtotal}</span>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleCheckout}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-sm transition-all shadow-md"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Place Order via WhatsApp</span>
              </button>

              <button
                onClick={clearCart}
                className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-900 py-1 transition-colors"
              >
                Clear All Items
              </button>
            </div>
            <p className="text-[10px] text-center text-slate-400 font-medium leading-relaxed">
              Order values are compiled and sent directly to shop owner Prabhat Bhaiya. Cash/UPI is paid at store delivery.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
