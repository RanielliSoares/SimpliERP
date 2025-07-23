// src/services/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


// Configuração do Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyC1-Bopvz2cPDlhB69cWqkBP7wjIRs_El0',
  authDomain: 'simplierp-6e4b0.firebaseapp.com',
  projectId: 'simplierp-6e4b0',
  storageBucket: 'simplierp-6e4b0.firebasestorage.app',
  messagingSenderId: '60722009611',
  appId: '1:60722009611:web:f9b7557e77836e6531990e',
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta as instâncias de Auth e Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
