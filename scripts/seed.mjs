// scripts/seed.mjs
// Crea los 3 administradores en Firebase Auth + Firestore.
// Ejecutar UNA SOLA VEZ desde la raíz del proyecto:
//   node scripts/seed.mjs

import { initializeApp } from 'firebase/app';
import { initializeAuth, inMemoryPersistence, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

// ── Mismas credenciales que .env ──────────────────────────────────────────────
const firebaseConfig = {
  apiKey:            'AIzaSyB_QJs15qdZOD8niEQ-VIr9kmN52_Fa9nc',
  authDomain:        'biblioteca-firebase-mtn.firebaseapp.com',
  projectId:         'biblioteca-firebase-mtn',
  storageBucket:     'biblioteca-firebase-mtn.firebasestorage.app',
  messagingSenderId: '704184921514',
  appId:             '1:704184921514:web:920d3c71bae1e82ab50fd3',
};

// inMemoryPersistence evita depender de localStorage (no disponible en Node.js)
const app  = initializeApp(firebaseConfig);
const auth = initializeAuth(app, { persistence: inMemoryPersistence });
const db   = getFirestore(app);

const CONTRASENA_DEFAULT = 'admin123';

const ADMINS = [
  { nombre: 'Admin',   apellido: 'Uno',  mail: 'admin1@biblioteca.com', telefono: '1111111111', dni: '11111111' },
  { nombre: 'Admin',   apellido: 'Dos',  mail: 'admin2@biblioteca.com', telefono: '2222222222', dni: '22222222' },
  { nombre: 'Admin',   apellido: 'Tres', mail: 'admin3@biblioteca.com', telefono: '3333333333', dni: '33333333' },
];

console.log('🌱  Iniciando seed — Biblioteca Firebase MTN');
console.log('━'.repeat(52));

for (const admin of ADMINS) {
  process.stdout.write(`\n➡  ${admin.mail} ... `);
  try {
    // 1. Crear usuario en Firebase Auth (también lo deja como sesión activa)
    const cred = await createUserWithEmailAndPassword(auth, admin.mail, CONTRASENA_DEFAULT);
    const uid  = cred.user.uid;

    // 2. Escribir documento en Firestore (col: users / doc: uid)
    await setDoc(doc(db, 'users', uid), {
      nombre:    admin.nombre,
      apellido:  admin.apellido,
      mail:      admin.mail,
      telefono:  admin.telefono,
      dni:       admin.dni,
      rol:       'ADMINISTRADOR',
      createdAt: new Date().toISOString(),
    });

    console.log(`✅  creado  (uid: ${uid})`);

  } catch (error) {
    const code = error?.code ?? '';
    if (code === 'auth/email-already-in-use') {
      // El usuario ya existe en Auth → verificar si también tiene doc en Firestore
      try {
        const cred2 = await signInWithEmailAndPassword(auth, admin.mail, CONTRASENA_DEFAULT);
        const uid   = cred2.user.uid;
        const snap  = await getDoc(doc(db, 'users', uid));
        if (!snap.exists()) {
          await setDoc(doc(db, 'users', uid), {
            nombre:    admin.nombre,
            apellido:  admin.apellido,
            mail:      admin.mail,
            telefono:  admin.telefono,
            dni:       admin.dni,
            rol:       'ADMINISTRADOR',
            createdAt: new Date().toISOString(),
          });
          console.log(`⚠️   ya existía en Auth, doc Firestore creado  (uid: ${uid})`);
        } else {
          console.log(`⏭   ya existe completo — saltando.`);
        }
      } catch (e2) {
        console.error(`❌  no se pudo recuperar: ${e2.message}`);
      }
    } else if (code === 'auth/network-request-failed') {
      console.error(`❌  Sin conexión a Firebase. Verificá el acceso a internet.`);
    } else {
      console.error(`❌  ${code || error.message}`);
    }
  }
}

console.log('\n━'.repeat(52));
console.log('✅  Seed completado.\n');
console.log('Credenciales de los admins:');
console.log('  admin1@biblioteca.com  /  admin123');
console.log('  admin2@biblioteca.com  /  admin123');
console.log('  admin3@biblioteca.com  /  admin123');
console.log('');

process.exit(0);
