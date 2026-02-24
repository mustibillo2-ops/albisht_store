'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';

export default function LoginContent({ from = '/', mode = 'customer', notice = '' }) {
  const router = useRouter();
  const { setUser } = useUser();

  const [activeTab, setActiveTab] = useState(mode === 'admin' ? 'admin' : 'customer');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerForm, setCustomerForm] = useState({ email: '', password: '' });

  // Admin form state
  const [adminPassword, setAdminPassword] = useState('');

  useEffect(() => {
    if (mode === 'admin') {
      setActiveTab('admin');
    }
  }, [mode]);

  const handleCustomerChange = (event) => {
    const { name, value } = event.target;
    setCustomerForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomerSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: customerForm.email,
          password: customerForm.password,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || 'تعذر تسجيل الدخول، حاول مجدداً');
      }

      if (data?.user) setUser(data.user);
      setStatus({
        type: 'success',
        message: data?.message || 'تم تسجيل الدخول بنجاح',
      });

      setTimeout(() => {
        router.replace(from);
      }, 600);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error?.message || 'تعذر تسجيل الدخول',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPassword }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || 'كلمة المرور غير صحيحة');
      }

      setStatus({
        type: 'success',
        message: data?.message || 'تم تسجيل الدخول بنجاح',
      });

      setTimeout(() => {
        router.replace('/admin');
      }, 600);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error?.message || 'كلمة المرور غير صحيحة',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-[70vh] flex items-center justify-center bg-brand-soft py-12">
      <div className="w-full max-w-md bg-brand-white border border-brand-gold/40 rounded-3xl shadow-card p-8">
        <h1 className="text-3xl font-semibold text-brand-brown mb-3 text-center">
          تسجيل الدخول
        </h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-brand-gold/20">
          <button
            type="button"
            onClick={() => setActiveTab('customer')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'customer'
                ? 'text-brand-gold border-b-2 border-brand-gold'
                : 'text-slate-500 hover:text-brand-brown'
            }`}
          >
            تسجيل دخول العميل
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('admin')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'admin'
                ? 'text-brand-gold border-b-2 border-brand-gold'
                : 'text-slate-500 hover:text-brand-brown'
            }`}
          >
            تسجيل دخول الأدمن
          </button>
        </div>

        {/* Customer Form */}
        {activeTab === 'customer' && (
          <form onSubmit={handleCustomerSubmit} className="space-y-5">
            <p className="text-slate-600 text-sm mb-4">
              أدخل بريدك الإلكتروني وكلمة المرور للمتابعة.
            </p>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-slate-600" htmlFor="customer-email">
                البريد الإلكتروني
              </label>
              <input
                id="customer-email"
                type="email"
                name="email"
                required
                value={customerForm.email}
                onChange={handleCustomerChange}
                className="rounded-2xl border border-brand-gold/40 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 bg-brand-soft text-brand-brown"
                placeholder="example@email.com"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-slate-600" htmlFor="customer-password">
                كلمة المرور
              </label>
              <input
                id="customer-password"
                type="password"
                name="password"
                required
                value={customerForm.password}
                onChange={handleCustomerChange}
                className="rounded-2xl border border-brand-gold/40 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 bg-brand-soft text-brand-brown"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-brand-gold text-brand-black font-semibold py-3 hover:bg-[#c1952d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </button>
            <p className="text-sm text-slate-600 text-center">
              ليس لديك حساب؟{' '}
              <Link
                href={`/signup?from=${encodeURIComponent(from)}`}
                className="text-brand-gold font-semibold"
              >
                سجل هنا
              </Link>
            </p>
          </form>
        )}

        {/* Admin Form */}
        {activeTab === 'admin' && (
          <form onSubmit={handleAdminSubmit} className="space-y-5">
            <p className="text-slate-600 text-sm mb-4">
              أدخل كلمة المرور للوصول إلى لوحة التحكم.
            </p>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-slate-600" htmlFor="admin-password">
                كلمة المرور
              </label>
              <input
                id="admin-password"
                type="password"
                required
                value={adminPassword}
                onChange={(event) => setAdminPassword(event.target.value)}
                className="rounded-2xl border border-brand-gold/40 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 bg-brand-soft text-brand-brown"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-brand-gold text-brand-black font-semibold py-3 hover:bg-[#c1952d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'جاري تسجيل الدخول...' : 'تسجيل دخول الأدمن'}
            </button>
          </form>
        )}

        {status.message && (
          <p
            className={`mt-4 text-sm text-center ${
              status.type === 'success' ? 'text-emerald-600' : 'text-rose-500'
            }`}
          >
            {status.message}
          </p>
        )}
        {!status.message && notice && (
          <p className="mt-4 text-sm text-center text-rose-500">{notice}</p>
        )}
      </div>
    </section>
  );
}

