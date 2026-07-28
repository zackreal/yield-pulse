'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ScanBarcode, ShoppingCart, CreditCard, Tag, AlertTriangle,
  Trash2, Plus, Minus, User, Clock, Zap, ArrowRight, ChevronLeft, Receipt,
  Search, Users, QrCode, Banknote, Wallet, PauseCircle, X, CheckCircle2, Ticket, Star
} from 'lucide-react';
import Link from 'next/link';

interface CartItem {
  id: string;
  name: string;
  qty: number;
  originalPrice: number;
  discountPrice: number | null;
  sku: string;
  isYieldPulseActive: boolean;
  icon: string;
  note?: string;
}

interface Customer {
  id?: string;
  name: string;
  phone: string;
  points: number;
}

const CATEGORIES = ['Semua', 'Minuman', 'Makanan', 'Segar', 'Kebutuhan'];

export default function POSPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [barcode, setBarcode] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [time, setTime] = useState('');
  
  // Payment State
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash'|'qris'|'debit'>('cash');
  const [amountReceived, setAmountReceived] = useState<number | ''>('');
  const [isManualInput, setIsManualInput] = useState(false);
  
  // Customer State
  const [dbCustomers, setDbCustomers] = useState<Customer[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  
  // Catalog State
  const [catalog, setCatalog] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Hold Bill State
  const [heldBills, setHeldBills] = useState<{id: string, time: string, cart: CartItem[], customer: Customer | null}[]>([]);
  const [isHoldBillModalOpen, setIsHoldBillModalOpen] = useState(false);

  // Success Modal State
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<{ total: number, change: number, method: string, invoice: string, customerName?: string } | null>(null);

  // Global Confirm Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean,
    title: string,
    message: string,
    type: 'danger' | 'warning' | 'info',
    confirmText: string,
    onConfirm: () => void
  } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // State untuk Smart Prompt (Verifikasi Batch)
  const [pendingVerificationItem, setPendingVerificationItem] = useState<{sku: string, type: 'exp' | 'defect'} | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      // Auto-focus ke hidden input
      if (
        document.activeElement !== inputRef.current && 
        document.activeElement?.id !== 'search-input' && 
        document.activeElement?.id !== 'customer-search' && 
        !isPaymentOpen && 
        !pendingVerificationItem &&
        !isCustomerModalOpen &&
        !isHoldBillModalOpen &&
        !isSuccessModalOpen &&
        !confirmDialog
      ) {
        inputRef.current?.focus();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaymentOpen, pendingVerificationItem, isCustomerModalOpen, isHoldBillModalOpen, isSuccessModalOpen, confirmDialog]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, custRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/customers')
        ]);
        
        if(prodRes.ok && custRes.ok) {
          const prods = await prodRes.json();
          const custs = await custRes.json();
          
          const mappedCatalog = prods.map((p: any) => {
            const iconMap: Record<string, string> = {
              'Minuman': '🥛',
              'Makanan': '🍞',
              'Segar': '🍌',
              'Kebutuhan': '🍚'
            };
            const colorMap: Record<string, string> = {
              'Minuman': 'bg-blue-50 text-blue-600 hover:bg-blue-100',
              'Makanan': 'bg-amber-50 text-amber-600 hover:bg-amber-100',
              'Segar': 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100',
              'Kebutuhan': 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
            };
            return {
              ...p,
              price: Number(p.basePrice),
              icon: iconMap[p.category] || '📦',
              color: colorMap[p.category] || 'bg-slate-50 text-slate-600 hover:bg-slate-100',
              subtitle: 'Reguler'
            };
          });
          setCatalog(mappedCatalog);
          setDbCustomers(custs);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoadingData(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (isSuccessModalOpen) {
      // Simulasi kirim data ESC/POS langsung ke printer kasir secara silent (tanpa dialog PDF browser)
      console.log('Sending raw thermal print command to local printer API...');
    }
  }, [isSuccessModalOpen]);

  const handleScan = (sku: string) => {
    if (sku === '8991234') {
      setPendingVerificationItem({ sku, type: 'exp' });
      return;
    }
    if (sku === '8993333') {
      setPendingVerificationItem({ sku, type: 'defect' });
      return;
    }
    addToCart(sku, false);
  };

  const addToCart = (sku: string, applyDiscount: boolean) => {
    let basePrice = 20000;
    let name = 'Produk ' + sku;
    let icon = '📦';

    const catalogItem = catalog.find(item => item.sku === sku);
    if (catalogItem) {
      basePrice = catalogItem.price;
      name = catalogItem.name + ' ' + catalogItem.subtitle;
      icon = catalogItem.icon;
    }

    const discountPrice = applyDiscount ? basePrice * 0.7 : null;
    const cartSku = applyDiscount ? `YP-${sku}` : sku;

    const existingItem = cart.find(i => i.sku === cartSku);
    if (existingItem) {
      setCart(cart.map(i => i.sku === cartSku ? { ...i, qty: i.qty + 1 } : i));
    } else {
      const newItem: CartItem = {
        id: Math.random().toString(),
        sku: cartSku,
        name: catalogItem?.name || name,
        qty: 1,
        originalPrice: basePrice,
        discountPrice,
        isYieldPulseActive: applyDiscount,
        icon,
        note: applyDiscount ? 'Potongan Algoritma' : ''
      };
      setCart([...cart, newItem]);
    }
    setBarcode('');
    setPendingVerificationItem(null);
  };

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcode) return;
    handleScan(barcode);
  };

  const handleNumpadClick = (val: string) => {
    if (val === 'C') {
      setBarcode('');
    } else if (val === 'ENTER') {
      if (barcode) handleScan(barcode);
    } else {
      setBarcode(prev => prev + val);
    }
  };

  const removeItem = (id: string) => setCart(cart.filter(i => i.id !== id));
  const updateQty = (id: string, delta: number) => {
    setCart(cart.map(i => {
      if (i.id === id) {
        const newQty = Math.max(1, i.qty + delta);
        return { ...i, qty: newQty };
      }
      return i;
    }));
  };

  const clearCart = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Batalkan Pesanan',
      message: 'Yakin ingin menghapus semua barang dari pesanan ini?',
      type: 'danger',
      confirmText: 'Ya, Batalkan',
      onConfirm: () => {
        setCart([]);
        setCustomer(null);
        setConfirmDialog(null);
      }
    });
  };

  const holdBill = () => {
    if(cart.length === 0) return;
    setHeldBills([...heldBills, {
      id: Math.random().toString(36).substring(7).toUpperCase(),
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      cart: [...cart],
      customer: customer
    }]);
    setCart([]);
    setCustomer(null);
  };

  const restoreBill = (id: string) => {
    const billToRestore = heldBills.find(b => b.id === id);
    if (billToRestore) {
      if (cart.length > 0) {
        setConfirmDialog({
          isOpen: true,
          title: 'Timpa Pesanan Aktif',
          message: 'Ada pesanan yang sedang aktif di layar. Yakin ingin menimpanya dengan pesanan dari antrean ini?',
          type: 'warning',
          confirmText: 'Timpa Pesanan',
          onConfirm: () => {
            setCart(billToRestore.cart);
            setCustomer(billToRestore.customer);
            setHeldBills(heldBills.filter(b => b.id !== id));
            setIsHoldBillModalOpen(false);
            setConfirmDialog(null);
          }
        });
        return;
      }
      setCart(billToRestore.cart);
      setCustomer(billToRestore.customer);
      setHeldBills(heldBills.filter(b => b.id !== id));
      setIsHoldBillModalOpen(false);
    }
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.originalPrice * item.qty), 0);
  const totalDiscount = cart.reduce((acc, item) => acc + ((item.discountPrice ? (item.originalPrice - item.discountPrice) : 0) * item.qty), 0);
  const finalTotal = subtotal - totalDiscount;

  const changeAmount = typeof amountReceived === 'number' ? amountReceived - finalTotal : 0;

  const filteredCatalog = catalog.filter(item => {
    const matchCategory = activeCategory === 'Semua' || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.sku.includes(searchQuery);
    return matchCategory && matchSearch;
  });

  const filteredCustomers = dbCustomers.filter(c => 
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) || 
    c.phone.includes(customerSearch)
  );

  // Proses transaksi
  const processTransaction = async () => {
    if (paymentMethod === 'cash' && (typeof amountReceived !== 'number' || amountReceived < finalTotal)) return;

    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart,
          customerId: customer?.id || null, // Assuming customer now has .id from DB
          paymentMethod,
          amountReceived: typeof amountReceived === 'number' ? amountReceived : finalTotal
        })
      });

      if (res.ok) {
        const txData = await res.json();
        setLastTransaction({
          total: Number(txData.finalTotal),
          change: Number(txData.changeAmount),
          method: txData.paymentMethod,
          invoice: txData.invoiceNumber,
          customerName: customer?.name
        });
        setIsPaymentOpen(false);
        setIsSuccessModalOpen(true);
      } else {
        alert('Gagal memproses transaksi. Silakan coba lagi.');
      }
    } catch (e) {
      console.error(e);
      alert('Terjadi kesalahan pada server.');
    }
  };

  return (
    <div className="fixed inset-0 bg-[#F4F7F9] overflow-hidden flex flex-col font-sans text-slate-800">
      
      {/* Hidden Scanner Input */}
      {!isPaymentOpen && !pendingVerificationItem && !isCustomerModalOpen && !isHoldBillModalOpen && (
        <form onSubmit={handleBarcodeSubmit} className="absolute opacity-0 pointer-events-none">
          <input 
            ref={inputRef}
            type="text" 
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            autoFocus
          />
        </form>
      )}

      {/* Header */}
      <header className="h-[76px] bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10 relative shadow-sm">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group text-slate-500 hover:text-slate-800 transition-colors">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg hidden sm:block">Kembali</span>
          </Link>
          
          <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
          
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-600/20">
              <span className="text-white font-black text-xs">YP</span>
            </div>
            <span className="font-extrabold tracking-tight text-slate-900 text-xl">YieldPulse</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full border border-emerald-100">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-bold tracking-wide uppercase">Koneksi Database Aktif</span>
          </div>

          <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

          <div className="flex items-center gap-2 text-slate-600">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-bold tracking-wide">{time}</span>
          </div>
          
          <div className="flex items-center gap-3 ml-4">
            <div className="text-right hidden md:block">
              <div className="text-sm font-bold text-slate-900">Kasir 01</div>
              <div className="text-xs text-slate-500">Reguler</div>
            </div>
            <button 
              onClick={() => {
                setConfirmDialog({
                  isOpen: true,
                  title: 'Keluar dari Kasir',
                  message: 'Apakah Anda yakin ingin keluar dari sistem POS?',
                  type: 'warning',
                  confirmText: 'Ya, Keluar',
                  onConfirm: () => {
                    document.cookie = 'auth_token=; Max-Age=0; path=/;';
                    window.location.href = '/login';
                  }
                });
              }}
              className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all group"
              title="Keluar"
            >
              <User className="w-5 h-5 text-slate-500 group-hover:text-rose-600 transition-colors" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden p-4 lg:p-6 gap-6 max-w-[1600px] mx-auto w-full">
        
        {/* Left Pane: Cart/Receipt (40%) */}
        <div className="w-full lg:w-[45%] xl:w-[35%] bg-white rounded-[24px] flex flex-col relative shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          
          {/* Cart Header */}
          <div className="p-5 border-b border-slate-100 bg-slate-50 flex flex-col gap-4 shrink-0">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-slate-900 font-extrabold text-xl tracking-tight line-clamp-1">
                  {customer ? `Pesanan: ${customer.name}` : 'Pesanan Baru'}
                </h2>
                <p className="text-slate-500 text-sm mt-0.5 font-medium">{cart.reduce((a, b) => a + b.qty, 0)} barang</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => setIsHoldBillModalOpen(true)} className="flex items-center gap-2 bg-amber-50 text-amber-600 hover:bg-amber-100 px-3 py-2 rounded-xl text-sm font-bold shadow-sm transition-colors relative">
                  <PauseCircle className="w-4 h-4" />
                  {heldBills.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">{heldBills.length}</span>
                  )}
                </button>
                <button onClick={() => setIsCustomerModalOpen(true)} className="flex items-center gap-2 bg-white border border-slate-200 text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-xl text-sm font-bold shadow-sm transition-colors">
                  <Users className="w-4 h-4" /> <span className="hidden xl:inline">{customer ? customer.name.split(' ')[0] : 'Pelanggan'}</span>
                </button>
              </div>
            </div>
            <div className="flex gap-2 text-sm font-bold">
              <button onClick={holdBill} disabled={cart.length === 0} className="flex-1 flex items-center justify-center gap-2 bg-amber-50 text-amber-700 hover:bg-amber-100 py-2.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                <PauseCircle className="w-4 h-4" /> Simpan (Hold)
              </button>
              <button onClick={clearCart} disabled={cart.length === 0} className="flex-1 flex items-center justify-center gap-2 bg-rose-50 text-rose-600 hover:bg-rose-100 py-2.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                <Trash2 className="w-4 h-4" /> Batalkan
              </button>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-2 relative custom-scrollbar">
            <AnimatePresence>
              {cart.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-slate-400"
                >
                  <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                    <Receipt className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-base font-bold text-slate-600">Belum ada barang</p>
                  <p className="text-sm text-slate-400 mt-1">Scan atau cari produk pelanggan</p>
                </motion.div>
              ) : (
                <div className="flex flex-col gap-2 p-2">
                  {cart.map((item) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.98 }} 
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                      key={item.id} 
                      className={`relative overflow-hidden rounded-2xl p-4 transition-all duration-300 border ${
                        item.isYieldPulseActive 
                          ? 'bg-indigo-50/50 border-indigo-100' 
                          : 'bg-white border-slate-100'
                      }`}
                    >
                      <div className="flex gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${item.isYieldPulseActive ? 'bg-indigo-100' : 'bg-slate-50'}`}>
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div className="font-bold text-slate-900 text-base leading-tight pr-2">
                              {item.name} {item.note && <span className="text-indigo-600 font-bold ml-1 text-sm">({item.note})</span>}
                            </div>
                            <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-rose-500 transition-colors">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="text-xs text-slate-400 font-medium mt-1">SKU: {item.sku.replace('YP-','')}</div>

                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center bg-slate-50 rounded-lg p-0.5 border border-slate-200">
                                <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 flex items-center justify-center rounded-md bg-white text-slate-700 hover:bg-slate-100 shadow-sm transition-all"><Minus className="w-3 h-3"/></button>
                                <span className="text-slate-900 font-bold text-sm w-6 text-center">{item.qty}</span>
                                <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 flex items-center justify-center rounded-md bg-white text-slate-700 hover:bg-slate-100 shadow-sm transition-all"><Plus className="w-3 h-3"/></button>
                              </div>
                            </div>

                            <div className="text-right">
                              {item.discountPrice ? (
                                <div className="flex flex-col items-end">
                                  <span className="text-xs font-semibold line-through text-slate-400">Rp {(item.originalPrice * item.qty).toLocaleString()}</span>
                                  <span className="text-indigo-600 font-black text-lg">Rp {(item.discountPrice * item.qty).toLocaleString()}</span>
                                </div>
                              ) : (
                                <span className="text-slate-900 font-black text-lg">Rp {(item.originalPrice * item.qty).toLocaleString()}</span>
                              )}
                            </div>
                          </div>
                          
                          {item.isYieldPulseActive && (
                            <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-indigo-100 text-indigo-700">
                              <Zap className="w-3 h-3" fill="currentColor" />
                              <span className="text-[10px] font-black uppercase tracking-wider">Algoritma Diskon Diterapkan</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Checkout Panel */}
          <div className="bg-slate-50 p-6 md:p-8 shrink-0 border-t border-slate-200">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center text-slate-500 font-medium text-sm">
                <span>Subtotal</span>
                <span className="font-bold text-slate-700">Rp {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-emerald-600 font-bold text-sm">
                <span className="flex items-center gap-1.5"><Tag className="w-4 h-4"/> Potongan Sistem</span>
                <span>- Rp {totalDiscount.toLocaleString()}</span>
              </div>
              <div className="pt-4 mt-2 border-t border-dashed border-slate-300 flex justify-between items-center">
                <span className="text-slate-900 font-black text-xl">Total</span>
                <span className="text-3xl font-black text-indigo-600 tracking-tight">
                  Rp {finalTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <button 
              disabled={cart.length === 0}
              onClick={() => setIsPaymentOpen(true)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-[20px] p-5 flex items-center justify-center gap-3 disabled:opacity-50 disabled:bg-slate-300 transition-all shadow-[0_8px_20px_rgba(79,70,229,0.25)] active:scale-95"
            >
              <span className="font-black text-lg tracking-wide">LANJUT PEMBAYARAN</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Pane: Catalog & Numpad (60%) */}
        <div className="hidden lg:flex flex-col flex-1 gap-6">
          
          {/* Top Row: Scanner & Search */}
          <div className="flex gap-4">
            <div className="bg-white rounded-[24px] border border-slate-100 p-2 shadow-sm flex items-center w-[200px] shrink-0">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0 mx-2">
                <ScanBarcode className="w-6 h-6" />
              </div>
              <div className="flex-1 font-mono text-lg text-slate-800 font-bold tracking-widest px-2 overflow-hidden truncate">
                {barcode || <span className="text-slate-300 font-medium tracking-normal text-sm">Scanner...</span>}
              </div>
            </div>
            
            <div className="bg-white rounded-[24px] border border-slate-100 p-2 flex-1 shadow-sm flex items-center relative focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all">
              <div className="w-12 h-12 flex items-center justify-center text-slate-400 shrink-0 mx-2">
                <Search className="w-5 h-5" />
              </div>
              <input 
                id="search-input"
                type="text"
                placeholder="Cari nama produk atau SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 text-lg font-medium text-slate-800 bg-transparent border-none outline-none px-2"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors mx-2">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 flex gap-6 overflow-hidden">
            
            {/* Quick Catalog Grid with Categories */}
            <div className="flex-1 bg-white rounded-[24px] border border-slate-100 shadow-sm p-4 flex flex-col">
              
              <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar shrink-0">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-colors ${
                      activeCategory === cat 
                        ? 'bg-slate-900 text-white shadow-md' 
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {filteredCatalog.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400">
                    <Search className="w-12 h-12 mb-4 opacity-50" />
                    <p className="font-medium text-lg">Produk tidak ditemukan</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
                    {filteredCatalog.map((item) => (
                      <button 
                        key={item.sku}
                        onClick={() => handleScan(item.sku)}
                        className={`group rounded-[20px] p-4 text-left border border-transparent transition-all duration-200 hover:-translate-y-1 hover:shadow-md active:translate-y-0 active:scale-95 ${item.color} flex flex-col justify-between aspect-square relative`}
                      >
                        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform origin-bottom-left">{item.icon}</div>
                        <div>
                          <div className="font-bold opacity-80 text-xs tracking-wider uppercase mb-1">{item.subtitle}</div>
                          <div className="font-extrabold text-lg leading-tight text-slate-900 mb-1">{item.name}</div>
                          <div className="font-black text-sm text-slate-900">Rp {item.price.toLocaleString()}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Dialpad / Numpad */}
            <div className="w-[320px] shrink-0 bg-white rounded-[24px] border border-slate-100 shadow-sm p-6 flex flex-col">
              <h3 className="text-slate-900 font-extrabold text-xl tracking-tight mb-6">Input Barcode</h3>
              <div className="bg-slate-50 rounded-[20px] p-3 flex-1">
                <div className="grid grid-cols-3 gap-2 h-full">
                  {['7','8','9','4','5','6','1','2','3','C','0','ENTER'].map((key) => (
                    <button
                      key={key}
                      onClick={() => handleNumpadClick(key)}
                      className={`rounded-xl flex items-center justify-center text-2xl font-black transition-all active:scale-90 ${
                        key === 'ENTER' 
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
                          : key === 'C'
                            ? 'bg-rose-100 text-rose-600 hover:bg-rose-200'
                            : 'bg-white text-slate-700 hover:bg-slate-100 shadow-sm border border-slate-200/60'
                      }`}
                    >
                      {key === 'ENTER' ? (
                        <ArrowRight className="w-7 h-7" />
                      ) : (
                        key
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* -------------------------------------------------------------
          CUSTOMER SELECTION MODAL
      -------------------------------------------------------------- */}
      <AnimatePresence>
        {isCustomerModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsCustomerModalOpen(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[24px] shadow-2xl w-full max-w-lg flex flex-col overflow-hidden relative z-10"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-slate-900 font-extrabold text-xl tracking-tight">Pilih Pelanggan</h3>
                <button onClick={() => setIsCustomerModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 border-b border-slate-100">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    id="customer-search"
                    autoFocus
                    type="text" 
                    placeholder="Cari nama atau nomor HP..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 font-medium text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex-1 max-h-[400px] overflow-y-auto p-2 custom-scrollbar">
                {filteredCustomers.length === 0 ? (
                  <div className="py-8 text-center text-slate-500">Pelanggan tidak ditemukan.</div>
                ) : (
                  <div className="space-y-1">
                    {filteredCustomers.map((c) => (
                      <button 
                        key={c.phone}
                        onClick={() => {
                          setCustomer(c);
                          setIsCustomerModalOpen(false);
                          setCustomerSearch('');
                        }}
                        className="w-full text-left p-4 rounded-xl hover:bg-indigo-50 transition-colors border border-transparent hover:border-indigo-100 flex justify-between items-center group"
                      >
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-indigo-700">{c.name}</div>
                          <div className="text-sm text-slate-500">{c.phone}</div>
                        </div>
                        <div className="bg-amber-100 text-amber-700 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5">
                          <Star className="w-3 h-3" /> {c.points} Poin
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {customer && (
                <div className="p-4 bg-slate-50 border-t border-slate-200">
                  <button 
                    onClick={() => {
                      setCustomer(null);
                      setIsCustomerModalOpen(false);
                    }}
                    className="w-full py-3 rounded-xl bg-rose-50 text-rose-600 font-bold hover:bg-rose-100 transition-colors"
                  >
                    Hapus Pilihan Pelanggan
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* -------------------------------------------------------------
          HOLD BILL LIST MODAL
      -------------------------------------------------------------- */}
      <AnimatePresence>
        {isHoldBillModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsHoldBillModalOpen(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[24px] shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden relative z-10"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-slate-900 font-extrabold text-xl tracking-tight flex items-center gap-2">
                  <PauseCircle className="w-6 h-6 text-amber-500" /> Antrean Hold Bill
                </h3>
                <button onClick={() => setIsHoldBillModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 max-h-[500px] overflow-y-auto p-4 custom-scrollbar bg-slate-50">
                {heldBills.length === 0 ? (
                  <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                    <Receipt className="w-12 h-12 mb-3 text-slate-300" />
                    <p className="font-medium">Tidak ada antrean pesanan.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {heldBills.map((bill) => (
                      <div key={bill.id} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded text-xs uppercase tracking-wider">#{bill.id}</span>
                            <span className="text-slate-500 text-sm font-medium flex items-center gap-1"><Clock className="w-4 h-4"/> {bill.time}</span>
                          </div>
                          <div className="font-bold text-slate-900 text-lg">
                            {bill.customer ? bill.customer.name : 'Pelanggan Umum'}
                          </div>
                          <div className="text-slate-500 text-sm mt-1">
                            {bill.cart.reduce((a,b)=>a+b.qty,0)} barang • Rp {bill.cart.reduce((acc, item) => acc + ((item.discountPrice || item.originalPrice) * item.qty), 0).toLocaleString()}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              setConfirmDialog({
                                isOpen: true,
                                title: 'Hapus Antrean',
                                message: 'Yakin ingin menghapus antrean pesanan ini secara permanen?',
                                type: 'danger',
                                confirmText: 'Hapus',
                                onConfirm: () => {
                                  setHeldBills(heldBills.filter(b => b.id !== bill.id));
                                  setConfirmDialog(null);
                                }
                              });
                            }}
                            className="p-3 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
                            title="Hapus Antrean"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => restoreBill(bill.id)}
                            className="px-5 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
                          >
                            Lanjutkan
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* -------------------------------------------------------------
          SMART PROMPT / VERIFICATION MODAL 
          Membantu kasir memverifikasi fisik barang jika ada mixed batch
      -------------------------------------------------------------- */}
      <AnimatePresence>
        {pendingVerificationItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden relative z-10 border-4 border-amber-400"
            >
              <div className="bg-amber-50 p-6 flex items-start gap-4 border-b border-amber-100">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-amber-900 font-extrabold text-xl tracking-tight mb-1">Verifikasi Fisik Kasir</h3>
                  <p className="text-amber-700 text-sm font-medium leading-relaxed">
                    Database mendeteksi adanya stok lama / kualitas B untuk produk ini di area pamer. 
                    <br/>Mohon periksa fisik barang yang dipegang pelanggan.
                  </p>
                </div>
              </div>

              <div className="p-8">
                <p className="text-slate-900 font-bold text-center text-xl mb-8">
                  Apakah produk ini <span className="text-indigo-600 underline decoration-indigo-300 underline-offset-4">{pendingVerificationItem.type === 'exp' ? 'kedaluwarsa dalam waktu dekat' : 'memiliki bercak/cacat kualitas'}</span> ?
                </p>

                <div className="flex gap-4">
                  <button 
                    onClick={() => addToCart(pendingVerificationItem.sku, true)}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-indigo-600/20 active:scale-95 transition-all flex flex-col items-center gap-1"
                  >
                    <span>YA, Beneran</span>
                    <span className="text-xs font-semibold text-indigo-200">Terapkan Diskon</span>
                  </button>
                  <button 
                    onClick={() => addToCart(pendingVerificationItem.sku, false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-4 rounded-2xl font-black text-lg border border-slate-200 active:scale-95 transition-all flex flex-col items-center gap-1"
                  >
                    <span>TIDAK</span>
                    <span className="text-xs font-semibold text-slate-500">Harga Normal</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Payment Modal Overlay - CRM Aesthetic (Sleek/Zinc) */}
      <AnimatePresence>
        {isPaymentOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-zinc-950/20 backdrop-blur-md"
              onClick={() => setIsPaymentOpen(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
              className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-zinc-300/50 w-full max-w-4xl flex overflow-hidden relative z-10 border border-white"
            >
              {/* Left Side: Receipt Paper */}
              <div className="w-[40%] bg-zinc-100 p-8 border-r border-zinc-200 flex flex-col items-center justify-center relative overflow-hidden">
                {/* Subtle paper shadow */}
                <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.02)] pointer-events-none"></div>
                
                {/* The Receipt Paper */}
                <div className="bg-white w-full max-w-sm rounded-sm shadow-sm border border-zinc-200 flex flex-col relative z-10 h-full max-h-[500px]" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.05))' }}>
                  <div className="p-6 pb-2 border-b-2 border-dashed border-zinc-200 shrink-0">
                    <h3 className="text-zinc-800 font-bold text-center mb-1 text-lg">YIELDPULSE MART</h3>
                    <p className="text-zinc-400 text-xs text-center font-mono">Invoice #{Math.floor(Math.random()*10000)}</p>
                  </div>
                  
                  <div className="p-6 flex-1 space-y-3 font-mono text-sm overflow-y-auto custom-scrollbar">
                    {cart.map(c => (
                      <div key={c.id} className="flex justify-between items-start">
                        <div className="pr-2">
                          <div className="text-zinc-800 font-bold">{c.name}</div>
                          <div className="text-zinc-500">{c.qty} x Rp {c.originalPrice.toLocaleString()}</div>
                        </div>
                        <div className="text-zinc-800 font-bold">Rp {(c.originalPrice * c.qty).toLocaleString()}</div>
                      </div>
                    ))}
                    {totalDiscount > 0 && (
                      <div className="flex justify-between items-center text-emerald-600 font-bold pt-2 mt-2 border-t border-dashed border-zinc-200">
                        <span>Diskon Sistem</span>
                        <span>- Rp {totalDiscount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 bg-zinc-50 border-t-2 border-dashed border-zinc-200 shrink-0">
                    <div className="flex justify-between items-center mb-2 font-mono">
                      <span className="text-zinc-500 font-bold">Total</span>
                      <span className="text-xl font-black text-zinc-950">Rp {finalTotal.toLocaleString()}</span>
                    </div>
                    {paymentMethod === 'cash' && typeof amountReceived === 'number' && amountReceived > 0 && (
                      <>
                        <div className="flex justify-between items-center font-mono text-sm text-zinc-600 mt-1">
                          <span>Tunai</span>
                          <span>Rp {amountReceived.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center font-mono text-sm font-bold text-zinc-900 mt-1 pt-1 border-t border-zinc-200">
                          <span>Kembali</span>
                          <span>Rp {Math.max(0, changeAmount).toLocaleString()}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Side: Payment Methods */}
              <div className="flex-1 p-8 sm:p-10 bg-transparent flex flex-col">
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-3xl font-black text-zinc-950 tracking-tight">Metode Pembayaran</h2>
                  <button onClick={() => setIsPaymentOpen(false)} className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 hover:bg-zinc-200 hover:text-zinc-950 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  <button onClick={() => { setPaymentMethod('cash'); setAmountReceived(''); setIsManualInput(false); }} className={`p-5 rounded-[1.5rem] flex flex-col items-center gap-4 transition-all duration-300 ${paymentMethod === 'cash' ? 'bg-zinc-950 text-white shadow-lg shadow-zinc-950/20' : 'bg-zinc-50/80 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 border border-zinc-200/60'}`}>
                    <Banknote className="w-8 h-8" />
                    <span className="font-bold text-sm tracking-wide">Tunai</span>
                  </button>
                  <button onClick={() => setPaymentMethod('qris')} className={`p-5 rounded-[1.5rem] flex flex-col items-center gap-4 transition-all duration-300 ${paymentMethod === 'qris' ? 'bg-zinc-950 text-white shadow-lg shadow-zinc-950/20' : 'bg-zinc-50/80 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 border border-zinc-200/60'}`}>
                    <QrCode className="w-8 h-8" />
                    <span className="font-bold text-sm tracking-wide">QRIS</span>
                  </button>
                  <button onClick={() => setPaymentMethod('debit')} className={`p-5 rounded-[1.5rem] flex flex-col items-center gap-4 transition-all duration-300 ${paymentMethod === 'debit' ? 'bg-zinc-950 text-white shadow-lg shadow-zinc-950/20' : 'bg-zinc-50/80 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 border border-zinc-200/60'}`}>
                    <Wallet className="w-8 h-8" />
                    <span className="font-bold text-sm tracking-wide">Kartu Debit</span>
                  </button>
                </div>

                {/* Conditional Cash Section */}
                {paymentMethod === 'cash' && (
                  <div className="flex-1 mt-4">
                    <div className="flex justify-between items-end mb-4">
                      <p className="text-xs font-bold tracking-widest uppercase text-zinc-400">Uang Yang Diterima</p>
                      {typeof amountReceived === 'number' && amountReceived < finalTotal && (
                        <span className="text-xs font-bold text-rose-500">Kurang Rp {(finalTotal - amountReceived).toLocaleString()}</span>
                      )}
                    </div>

                    {!isManualInput ? (
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <button onClick={() => setAmountReceived(finalTotal)} className={`bg-white border py-4 rounded-[1.25rem] font-bold transition-all shadow-sm ${amountReceived === finalTotal ? 'border-zinc-900 ring-1 ring-zinc-900 text-zinc-900' : 'border-zinc-200/80 text-zinc-700 hover:border-zinc-400'}`}>Uang Pas</button>
                        <button onClick={() => setAmountReceived(50000)} className={`bg-white border py-4 rounded-[1.25rem] font-bold transition-all shadow-sm ${amountReceived === 50000 ? 'border-zinc-900 ring-1 ring-zinc-900 text-zinc-900' : 'border-zinc-200/80 text-zinc-700 hover:border-zinc-400'}`}>Rp 50.000</button>
                        <button onClick={() => setAmountReceived(100000)} className={`bg-white border py-4 rounded-[1.25rem] font-bold transition-all shadow-sm ${amountReceived === 100000 ? 'border-zinc-900 ring-1 ring-zinc-900 text-zinc-900' : 'border-zinc-200/80 text-zinc-700 hover:border-zinc-400'}`}>Rp 100.000</button>
                        <button onClick={() => { setIsManualInput(true); setAmountReceived(''); }} className="bg-zinc-50 border border-zinc-200/50 py-4 rounded-[1.25rem] font-bold text-zinc-500 hover:bg-zinc-100 transition-all shadow-inner">Input Manual</button>
                      </div>
                    ) : (
                      <div className="flex gap-3 mb-4">
                        <div className="flex-1 relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-zinc-400">Rp</span>
                          <input 
                            autoFocus
                            type="number" 
                            className="w-full bg-white border border-zinc-300 rounded-[1.25rem] py-4 pl-12 pr-4 font-black text-xl text-zinc-900 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all shadow-sm"
                            value={amountReceived}
                            onChange={(e) => setAmountReceived(e.target.value ? parseInt(e.target.value) : '')}
                            placeholder="0"
                          />
                        </div>
                        <button onClick={() => { setIsManualInput(false); setAmountReceived(''); }} className="px-6 rounded-[1.25rem] bg-zinc-100 text-zinc-600 font-bold hover:bg-zinc-200 transition-colors">
                          Batal
                        </button>
                      </div>
                    )}
                  </div>
                )}
                
                {paymentMethod === 'qris' && (
                  <div className="flex-1 mt-4 flex flex-col items-center justify-center text-center">
                    <div className="w-36 h-36 bg-white rounded-3xl flex items-center justify-center mb-6 border border-zinc-200/80 shadow-sm relative overflow-hidden">
                      <QrCode className="w-16 h-16 text-zinc-300" />
                      <div className="absolute inset-0 bg-zinc-950/5 flex items-center justify-center">
                         <div className="w-full h-1 bg-blue-500/50 blur-sm absolute top-0 animate-pulse" />
                      </div>
                    </div>
                    <p className="font-bold text-zinc-800 text-lg">Tampilkan QR ke pelanggan</p>
                    <p className="text-sm text-zinc-500 mt-2">Menunggu konfirmasi pembayaran otomatis...</p>
                  </div>
                )}

                <div className="mt-auto pt-6">
                  <button 
                    disabled={paymentMethod === 'cash' && (typeof amountReceived !== 'number' || amountReceived < finalTotal)}
                    onClick={processTransaction}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:bg-slate-300 disabled:shadow-none text-white py-5 rounded-[1.5rem] font-black tracking-wide text-lg shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                  >
                    <CheckCircle2 className="w-6 h-6" /> KONFIRMASI PEMBAYARAN
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* -------------------------------------------------------------
          SUCCESS & PRINT RECEIPT MODAL
      -------------------------------------------------------------- */}
      <AnimatePresence>
        {isSuccessModalOpen && lastTransaction && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", bounce: 0.4, duration: 0.5 }}
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm flex flex-col items-center relative z-10 p-8 border border-zinc-100"
            >
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-inner relative">
                 <div className="absolute inset-0 rounded-full border-4 border-emerald-50 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                 <CheckCircle2 className="w-10 h-10 relative z-10" />
              </div>

              <h2 className="text-2xl font-black text-zinc-900 mb-2">Pembayaran Berhasil</h2>
              <p className="text-zinc-500 font-medium mb-6">Invoice #{lastTransaction.invoice}</p>

              <div className="w-full bg-zinc-50 rounded-2xl p-5 mb-8 border border-zinc-100 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 font-medium text-sm">Metode</span>
                  <span className="font-bold text-zinc-900 uppercase">{lastTransaction.method}</span>
                </div>
                {lastTransaction.customerName && (
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 font-medium text-sm">Pelanggan</span>
                    <span className="font-bold text-zinc-900">{lastTransaction.customerName}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 font-medium text-sm">Total</span>
                  <span className="font-bold text-zinc-900">Rp {lastTransaction.total.toLocaleString()}</span>
                </div>
                {lastTransaction.method === 'cash' && (
                  <div className="flex justify-between items-center pt-3 mt-1 border-t border-dashed border-zinc-200">
                    <span className="text-zinc-500 font-bold text-sm">Kembalian</span>
                    <span className="font-black text-emerald-600 text-lg">Rp {lastTransaction.change.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="w-full space-y-3">
                <button 
                  onClick={() => {
                    alert('Mencetak struk ke printer kasir (ESC/POS)...');
                  }}
                  className="w-full py-4 rounded-xl font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Receipt className="w-5 h-5" /> Cetak Struk
                </button>
                
                <button 
                  onClick={() => {
                    setIsSuccessModalOpen(false);
                    setCart([]);
                    setCustomer(null);
                    setAmountReceived('');
                    setLastTransaction(null);
                  }}
                  className="w-full py-4 rounded-xl font-black text-white bg-zinc-900 hover:bg-zinc-800 shadow-md transition-colors"
                >
                  Pesanan Baru
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* -------------------------------------------------------------
          GLOBAL CONFIRM DIALOG
      -------------------------------------------------------------- */}
      <AnimatePresence>
        {confirmDialog && confirmDialog.isOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setConfirmDialog(null)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[24px] shadow-2xl w-full max-w-sm flex flex-col relative z-10 overflow-hidden"
            >
              <div className={`h-2 w-full ${confirmDialog.type === 'danger' ? 'bg-rose-500' : confirmDialog.type === 'warning' ? 'bg-amber-500' : 'bg-indigo-500'}`} />
              <div className="p-6 text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  confirmDialog.type === 'danger' ? 'bg-rose-100 text-rose-500' : 
                  confirmDialog.type === 'warning' ? 'bg-amber-100 text-amber-500' : 'bg-indigo-100 text-indigo-500'
                }`}>
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{confirmDialog.title}</h3>
                <p className="text-slate-500">{confirmDialog.message}</p>
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                <button 
                  onClick={() => setConfirmDialog(null)}
                  className="flex-1 py-3 rounded-xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button 
                  onClick={confirmDialog.onConfirm}
                  className={`flex-1 py-3 rounded-xl font-bold text-white shadow-sm transition-colors ${
                    confirmDialog.type === 'danger' ? 'bg-rose-600 hover:bg-rose-700' : 
                    confirmDialog.type === 'warning' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {confirmDialog.confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px;}
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e2e8f0; border-radius: 20px; }
      `}} />
    </div>
  );
}
