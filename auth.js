/*
  auth.js
  - Replace the firebaseConfig object with your Firebase project's config
  - Enable Email/Password under Authentication in the Firebase console
  - Create a Firestore database (default rules OK for testing)
*/

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js';
import { getFirestore, doc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js';

// TODO: Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCQLdH3N0O3St_hpZ__IlnGpuxt_0xnoho",
  authDomain: "my-application-aaa24.firebaseapp.com",
  projectId: "my-application-aaa24",
  storageBucket: "my-application-aaa24.firebasestorage.app",
  messagingSenderId: "298271452721",
  appId: "1:298271452721:web:b1052092819d0e17352f10"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function showMsg(el, text, isError = true){
  el.textContent = text || '';
  el.style.color = isError ? '#b00020' : '#0b7f3b';
}

// Signup flow: create auth user, then store profile in Firestore
const signupForm = document.getElementById('signupForm');
if (signupForm){
  signupForm.addEventListener('submit', async (ev)=>{
    ev.preventDefault();
    const msg = document.getElementById('msg');
    showMsg(msg,'');
    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const dob = document.getElementById('dob').value;
    const genderEls = document.getElementsByName('gender');
    let gender = '';
    for (const g of genderEls) if (g.checked){ gender = g.value; break; }
    const mobile = document.getElementById('mobile').value.trim();
    const password = document.getElementById('password').value;
    const agree = document.getElementById('agree').checked;
    if (!agree){ showMsg(msg,'You must agree to the terms.'); return; }

    try{
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;
      await setDoc(doc(db, 'users', uid), {
        fullname, email, dob, gender, mobile, createdAt: serverTimestamp()
      });
      showMsg(msg, 'Registration successful — redirecting...', false);
      setTimeout(()=> location.href = 'login.html', 900);
    }catch(err){
      showMsg(msg, err.message || 'Registration failed');
    }
  });
}

// Login flow: sign in via Firebase Auth
const loginForm = document.getElementById('loginForm');
if (loginForm){
  loginForm.addEventListener('submit', async (ev)=>{
    ev.preventDefault();
    const msg = document.getElementById('msg');
    showMsg(msg,'');
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    try{
      await signInWithEmailAndPassword(auth, email, password);
      showMsg(msg, 'Login successful — redirecting...', false);
      // Redirect or load app page
      setTimeout(()=> location.href = 'index.html', 600);
    }catch(err){
      showMsg(msg, err.message || 'Login failed');
    }
  });

  const forgot = document.getElementById('forgotLink');
  if (forgot){
    forgot.addEventListener('click', async (ev)=>{
      ev.preventDefault();
      const email = document.getElementById('email').value.trim();
      const msg = document.getElementById('msg');
      if (!email){ showMsg(msg,'Enter your email to reset password.'); return; }
      try{
        await sendPasswordResetEmail(auth, email);
        showMsg(msg,'Password reset email sent.', false);
      }catch(err){ showMsg(msg, err.message); }
    });
  }
}

// set to new image (path relative to CSS file)
document.documentElement.style.setProperty('--bg-image', 'url("image/Screenshot 2025-12-22 205125.jpg")');
// or remove image:
document.documentElement.style.setProperty('--bg-image', 'none');

export {};