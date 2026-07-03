import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY

export const firebaseConfigured = Boolean(apiKey)

let app: FirebaseApp | null = null
let auth: Auth | null = null

if (firebaseConfigured) {
  app = getApps().length === 0
    ? initializeApp({
        apiKey,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      })
    : getApps()[0]

  auth = getAuth(app)
}

export { auth }
export default app
