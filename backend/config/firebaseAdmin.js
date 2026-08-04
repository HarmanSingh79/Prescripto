import { initializeApp, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import fs from 'fs'

const serviceAccount = JSON.parse(
    fs.readFileSync(new URL('../serviceAccountKey.json', import.meta.url))
)

initializeApp({ credential: cert(serviceAccount) })

export const adminAuth = getAuth()


// import admin from 'firebase-admin'
// import serviceAccount from '../serviceAccountKey.json' assert { type: 'json' }

// admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
// export default admin