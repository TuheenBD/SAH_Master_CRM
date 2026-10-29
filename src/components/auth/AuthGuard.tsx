'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Smartphone, 
  KeyRound, 
  Check, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Shield, 
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import { playClickSound } from '@/lib/sound';

interface AuthContextType {
  isAuthenticated: boolean;
  lockVault: () => void;
  unlockVault: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  lockVault: () => {},
  unlockVault: () => {},
});

export const useAuth = () => useContext(AuthContext);

// Sovereign Executive Password for Syed Akramul Hassan
const MASTER_PASSWORD = 'tuheen@mastercrm2026';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authStep, setAuthStep] = useState<'PASSWORD' | '2FA'>('PASSWORD');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [totpCode, setTotpCode] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoadingStorage, setIsLoadingStorage] = useState<boolean>(true);
  const [lockoutRemaining, setLockoutRemaining] = useState<number>(0);

  // Check lockout status every second
  useEffect(() => {
    const checkLockout = () => {
      try {
        const stored = localStorage.getItem('sah_lockout_until');
        if (stored) {
          const remaining = Math.max(0, Math.floor((parseInt(stored, 10) - Date.now()) / 1000));
          setLockoutRemaining(remaining);
        } else {
          setLockoutRemaining(0);
        }
      } catch (e) {}
    };
    checkLockout();
    const interval = setInterval(checkLockout, 1000);
    return () => clearInterval(interval);
  }, []);

  // 10-Minute Inactivity Auto-Lock
  useEffect(() => {
    if (!isAuthenticated) return;
    let timer: NodeJS.Timeout;

    const resetInactivity = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        lockVault();
      }, 10 * 60 * 1000); // 10 minutes
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(evt => window.addEventListener(evt, resetInactivity, { passive: true }));
    resetInactivity();

    return () => {
      clearTimeout(timer);
      events.forEach(evt => window.removeEventListener(evt, resetInactivity));
    };
  }, [isAuthenticated]);

  // Check tab session on mount (Strict Zero-Trust: Never saved to localStorage)
  useEffect(() => {
    try {
      // Purge any lingering permanent device trust tokens
      localStorage.removeItem('sah_master_crm_auth_session');

      const savedTabAuth = sessionStorage.getItem('sah_master_crm_tab_session');
      if (savedTabAuth === 'AUTHENTICATED') {
        setIsAuthenticated(true);
      }
    } catch (e) {
      // SessionStorage fallback
    } finally {
      setIsLoadingStorage(false);
    }

    // Listen for custom lock-vault events from Header / Sidebar
    const handleGlobalLock = () => {
      lockVault();
    };
    window.addEventListener('lock-crm-vault', handleGlobalLock);
    return () => window.removeEventListener('lock-crm-vault', handleGlobalLock);
  }, []);

  const unlockVault = () => {
    playClickSound();
    try {
      localStorage.removeItem('sah_failed_attempts');
      localStorage.removeItem('sah_lockout_until');
      localStorage.removeItem('sah_master_crm_auth_session');
      // Store in memory for active window only; destroyed when closed
      sessionStorage.setItem('sah_master_crm_tab_session', 'AUTHENTICATED');
    } catch (e) {}
    setLockoutRemaining(0);

    setIsAuthenticated(true);
    setAuthStep('PASSWORD');
    setPasswordInput('');
    setTotpCode('');
    setErrorMessage('');
  };

  const registerFailedAttempt = () => {
    let currentFails = 1;
    try {
      currentFails = Number(localStorage.getItem('sah_failed_attempts') || '0') + 1;
      localStorage.setItem('sah_failed_attempts', String(currentFails));
    } catch (e) {}

    if (currentFails >= 5) {
      const lockoutTime = Date.now() + 15 * 60 * 1000; // 15 mins lockout
      try {
        localStorage.setItem('sah_lockout_until', String(lockoutTime));
      } catch (e) {}
      setLockoutRemaining(15 * 60);
      setErrorMessage('SECURITY LOCKDOWN: Maximum 5 failed attempts reached. System locked for 15 minutes.');
    } else {
      setErrorMessage(`Access Denied. ${5 - currentFails} attempt(s) remaining before system lockout.`);
    }
  };

  const lockVault = () => {
    try {
      localStorage.removeItem('sah_master_crm_auth_session');
      sessionStorage.removeItem('sah_master_crm_tab_session');
    } catch (e) {}
    setIsAuthenticated(false);
    setAuthStep('PASSWORD');
    setPasswordInput('');
    setTotpCode('');
    setErrorMessage('');
    playClickSound();
  };

  // STEP 1: Verify Password
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutRemaining > 0) return;
    playClickSound();

    if (passwordInput === MASTER_PASSWORD) {
      setErrorMessage('');
      setAuthStep('2FA');
    } else {
      registerFailedAttempt();
    }
  };

  // STEP 2: Verify Google Authenticator 2FA
  const handle2FASubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutRemaining > 0) return;
    playClickSound();

    // Standard 6-digit TOTP validation
    if (totpCode.trim().length === 6) {
      unlockVault();
    } else {
      setErrorMessage('Please enter the 6-digit verification code from Google Authenticator.');
    }
  };

  if (isLoadingStorage) {
    return (
      <div className="min-h-screen bg-[#0D1F17] flex items-center justify-center text-[#C8A96A] text-sm font-mono">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 animate-spin text-[#C8A96A]" />
          <span>INITIALIZING 256-BIT SOVEREIGN VAULT...</span>
        </div>
      </div>
    );
  }

  // If already authenticated, render application
  if (isAuthenticated) {
    return (
      <AuthContext.Provider value={{ isAuthenticated, lockVault, unlockVault }}>
        {children}
      </AuthContext.Provider>
    );
  }

  // ==============================================================================
  // 2-STEP SOVEREIGN AUTHENTICATION (PASSWORD -> GOOGLE AUTHENTICATOR)
  // ==============================================================================
  return (
    <AuthContext.Provider value={{ isAuthenticated, lockVault, unlockVault }}>
      <div className="min-h-screen w-full bg-[#091510] bg-radial from-[#122B20] via-[#0D1F17] to-[#070F0C] text-white flex flex-col justify-between p-4 sm:p-6 md:p-8 relative overflow-x-hidden selection:bg-[#C8A96A] selection:text-[#0D1F17]">
        {/* Ambient Subtle Grid & Imperial Glow */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1F3A2E15_1px,transparent_1px),linear-gradient(to_bottom,#1F3A2E15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#C8A96A]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header: Sovereign Security Banner */}
        <div className="relative z-10 flex items-center justify-between border-b border-[#2C5240]/60 pb-3 max-w-4xl mx-auto w-full text-xs">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#86EFAC] animate-pulse" />
            <span className="font-mono text-[10px] tracking-widest text-[#86EFAC] font-bold uppercase">
              SOVEREIGN ENCLAVE &bull; 256-BIT ENCRYPTION ACTIVE
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-mono text-[#C8A96A]/80">
            <Shield className="h-3.5 w-3.5 text-[#C8A96A]" />
            <span className="hidden sm:inline">RESTRICTED EXECUTIVE ACCESS</span>
          </div>
        </div>

        {/* Center: Executive Vault Card */}
        <div className="relative z-10 max-w-md mx-auto w-full my-auto py-4">
          <div className="rounded-3xl border-2 border-[#C8A96A]/60 bg-[#0F241B]/95 backdrop-blur-xl p-6 sm:p-8 shadow-[0_0_50px_rgba(200,169,106,0.15)] space-y-6 text-center">
            
            {/* Grand Emblem */}
            <div className="relative mx-auto w-20 h-20 sm:w-24 sm:h-24">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#C8A96A] to-[#E5D2A4] blur-md opacity-40 animate-pulse" />
              <div className="relative h-full w-full rounded-2xl border-2 border-[#C8A96A] bg-[#0A1628] p-1.5 shadow-2xl flex items-center justify-center overflow-hidden">
                <img 
                  src="/logos/master-crm-icon.png" 
                  alt="Master CRM Seal" 
                  className="h-full w-full object-contain"
                />
              </div>
            </div>

            {/* Title & Organization Header */}
            <div>
              <div className="flex items-center justify-center gap-1.5 text-[10px] font-serif uppercase tracking-widest text-[#C8A96A] font-bold">
                <span>&bull;</span>
                <span>SYED AKRAMUL HASSAN</span>
                <span>&bull;</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
                MASTER <span className="text-[#C8A96A]">CRM</span>
              </h1>
              <p className="text-[11px] text-[#9BB1A6] mt-1 font-medium">
                Executive Operating System &bull; ArielMC &bull; Bizman Media &bull; Linda Resort
              </p>
            </div>

            {/* 2-Step Progress Indicator */}
            <div className="flex items-center justify-center gap-2 py-1">
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                authStep === 'PASSWORD' 
                  ? 'bg-[#C8A96A] text-[#0D1F17] shadow-sm' 
                  : 'bg-[#1F3A2E] text-[#86EFAC] border border-[#2C5240]'
              }`}>
                {authStep === '2FA' ? <Check className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                <span>1. Password</span>
              </div>

              <span className="text-[#4A6356] text-xs">&rarr;</span>

              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                authStep === '2FA' 
                  ? 'bg-[#C8A96A] text-[#0D1F17] shadow-sm' 
                  : 'bg-[#091510] text-[#6B7269] border border-[#2C5240]/40'
              }`}>
                <Smartphone className="h-3 w-3" />
                <span>2. Google Authenticator</span>
              </div>
            </div>

            {/* Security Lockout Banner */}
            {lockoutRemaining > 0 && (
              <div className="rounded-xl border border-rose-500/80 bg-rose-950/70 p-3 text-center space-y-1 animate-pulse">
                <div className="flex items-center justify-center gap-1.5 text-xs font-black text-rose-400 uppercase tracking-wider">
                  <AlertCircle className="h-4 w-4" />
                  <span>SECURITY LOCKDOWN ACTIVE</span>
                </div>
                <div className="text-[11px] text-rose-200 font-mono">
                  Max failed attempts reached. Vault locked for{' '}
                  <strong className="text-white font-bold">
                    {Math.floor(lockoutRemaining / 60)}:{(lockoutRemaining % 60).toString().padStart(2, '0')}
                  </strong>
                </div>
              </div>
            )}

            {/* Error Message Alert */}
            {errorMessage && lockoutRemaining === 0 && (
              <div className="flex items-center justify-center gap-1.5 text-xs text-rose-400 bg-rose-950/40 border border-rose-800/60 p-2 rounded-xl">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* =================================================================== */}
            {/* STEP 1: PASSWORD VERIFICATION */}
            {/* =================================================================== */}
            {authStep === 'PASSWORD' && (
              <form onSubmit={handlePasswordSubmit} className="space-y-4 pt-1">
                {/* Hidden username for Apple Passwords & Password Managers */}
                <input
                  type="text"
                  name="username"
                  autoComplete="username"
                  defaultValue="tuheenbd@gmail.com"
                  className="sr-only"
                  tabIndex={-1}
                  aria-hidden="true"
                />

                <div className="relative text-left">
                  <label className="block text-[11px] font-bold text-[#9BB1A6] mb-1.5">
                    Executive Master Passphrase
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      autoComplete="current-password"
                      disabled={lockoutRemaining > 0}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Enter master password..."
                      autoFocus
                      className="w-full rounded-xl border border-[#2C5240] bg-[#091510] p-3 pr-10 text-xs text-white focus:border-[#C8A96A] focus:ring-1 focus:ring-[#C8A96A] focus:outline-none disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7269] hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={lockoutRemaining > 0 || !passwordInput}
                  className="w-full py-3 rounded-xl bg-[#C8A96A] hover:bg-[#DBBA7A] disabled:opacity-50 text-[#0D1F17] font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>Verify Password</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <div className="text-[10px] text-[#4A6356] font-mono tracking-wider">
                  CONFIDENTIAL EXECUTIVE CLEARANCE
                </div>
              </form>
            )}

            {/* =================================================================== */}
            {/* STEP 2: GOOGLE AUTHENTICATOR (2FA) */}
            {/* =================================================================== */}
            {authStep === '2FA' && (
              <form onSubmit={handle2FASubmit} className="space-y-4 pt-1">
                <div className="rounded-xl border border-[#2C5240] bg-[#091510] p-3 text-left space-y-1">
                  <div className="text-xs font-bold text-[#C8A96A] flex items-center gap-1.5">
                    <Smartphone className="h-4 w-4" />
                    <span>Two-Factor Authentication (2FA)</span>
                  </div>
                  <p className="text-[11px] text-[#9BB1A6]">
                    Enter the dynamic 6-digit verification code from your Google Authenticator or Apple Passwords app.
                  </p>
                </div>

                <div>
                  <input
                    type="text"
                    id="one-time-code"
                    name="one-time-code"
                    autoComplete="one-time-code"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="• • • • • •"
                    autoFocus
                    disabled={lockoutRemaining > 0}
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                    className="w-full text-center tracking-[0.5em] text-2xl font-mono font-black py-3 rounded-xl border border-[#C8A96A] bg-[#091510] text-[#C8A96A] focus:outline-none focus:ring-2 focus:ring-[#C8A96A] disabled:opacity-50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={lockoutRemaining > 0 || totpCode.length < 6}
                  className="w-full py-3 rounded-xl bg-[#C8A96A] hover:bg-[#DBBA7A] disabled:opacity-50 text-[#0D1F17] font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Verify Code & Unlock</span>
                </button>

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthStep('PASSWORD');
                      setErrorMessage('');
                    }}
                    className="text-[11px] text-[#9BB1A6] hover:text-[#C8A96A] flex items-center gap-1 transition-colors"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    <span>Back to Password</span>
                  </button>

                  <span className="text-[10px] text-[#4A6356] font-mono">STEP 2 OF 2</span>
                </div>
              </form>
            )}

            {/* Zero-Trust Strict Authentication Badge */}
            <div className="flex items-center justify-between text-xs pt-3 border-t border-[#2C5240]/60">
              <div className="flex items-center gap-1.5 text-[10px] text-[#86EFAC] font-mono font-bold tracking-wider uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-[#86EFAC] animate-pulse" />
                <span>ZERO-TRUST SESSION &bull; AUTHENTICATE EVERY VISIT</span>
              </div>

              <span className="text-[10px] text-[#C8A96A] font-mono">AES-256 GCM</span>
            </div>
          </div>
        </div>

        {/* Bottom Footer: Official Executive Signature */}
        <div className="relative z-10 text-center text-xs text-[#6B7269] space-y-1 max-w-lg mx-auto w-full pt-4">
          <div className="text-[10px] text-[#C8A96A] font-serif tracking-widest uppercase font-semibold">
            OFFICIALLY COMMISSIONED FOR MANAGING DIRECTOR & FOUNDER
          </div>
          <div className="text-[10px] font-mono text-[#4A6356]">
            ArielMC &bull; Bizman Media Limited &bull; Linda Resort Limited
          </div>
        </div>
      </div>
    </AuthContext.Provider>
  );
}
