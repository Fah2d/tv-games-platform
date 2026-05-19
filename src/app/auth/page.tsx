'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, firebaseConfigured } from '@/shared/utils/firebase'
import { useAuth } from '@/shared/hooks/use-auth'

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (user) router.replace('/')
  }, [user, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      if (!firebaseConfigured || !auth) {
        // Dev mode: skip real auth, AuthProvider already set a dev user
        router.replace('/')
        return
      }
      if (mode === 'signin') {
        await signInWithEmailAndPassword(auth, email, password)
      } else {
        await createUserWithEmailAndPassword(auth, email, password)
      }
      router.replace('/')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'حدث خطأ')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4" dir="rtl">
      <div className="w-full max-w-sm bg-zinc-900 rounded-2xl p-8 border border-zinc-800">
        <h1 className="text-2xl font-bold text-white text-center mb-8">
          {mode === 'signin' ? 'تسجيل الدخول' : 'إنشاء حساب'}
        </h1>

        {!firebaseConfigured && (
          <div className="bg-amber-900/30 border border-amber-700 rounded-lg px-4 py-3 mb-6 text-center">
            <p className="text-amber-400 text-sm">وضع التطوير — Firebase غير مُهيَّأ</p>
            <p className="text-amber-600 text-xs mt-1">اضغط دخول للمتابعة بدون تسجيل</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="البريد الإلكتروني"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-zinc-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-zinc-500 text-right"
            required={firebaseConfigured}
          />
          <input
            type="password"
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-zinc-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-zinc-500 text-right"
            required={firebaseConfigured}
          />
          {error && (
            <p className="text-red-400 text-sm text-center bg-red-950/30 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg disabled:opacity-50 transition-colors"
          >
            {submitting ? '...' : mode === 'signin' ? 'دخول' : 'إنشاء حساب'}
          </button>
        </form>

        {firebaseConfigured && (
          <button
            onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError('') }}
            className="mt-4 w-full text-zinc-400 hover:text-white text-sm text-center transition-colors"
          >
            {mode === 'signin' ? 'ليس لديك حساب؟ إنشاء حساب جديد' : 'لديك حساب؟ تسجيل الدخول'}
          </button>
        )}
      </div>
    </div>
  )
}
