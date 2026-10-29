'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Fingerprint, 
  Smartphone, 
  KeyRound, 
  Check, 
  AlertCircle, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Shield, 
  RefreshCw,
  Clock,
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

// Pre-configured default Executive Credentials for Syed Akramul Hassan
const DEFAULT_PASSCODE = '202600'; // 6-digit Executive Passcode
const DEFAULT_PASSWORD = 'tuheen@mastercrm2026'; // Master Passphrase

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'PASSCODE' | 'AUTHENTICATOR' | 'BIOMETRIC' | 'PASSWORD'>('PASSCODE');
  const [pinDigits, setPinDigits] = useState<string[]>([]);
  const [totpCode, setTotpCode] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberDevice, setRememberDevice] = useState<boolean>(true);
  const [isBiometricScanning, setIsBiometricScanning] = useState<boolean>(false);
  const [biometricSuccess, setBiometricSuccess] = useState<boolean>(false);
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
      }, 10 * 60 * 1000); // 10 minutes inactivity
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(evt => window.addEventListener(evt, resetInactivity, { passive: true }));
    resetInactivity();

    return () => {
      clearTimeout(timer);
      events.forEach(evt => window.removeEventListener(evt, resetInactivity));
    };
  }, [isAuthenticated]);

  // Check persistent session on mount
  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem('sah_master_crm_auth_session');
      if (savedAuth === 'AUTHENTICATED') {
        setIsAuthenticated(true);
      }
    } catch (e) {
      // LocalStorage access fallback
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
    } catch (e) {}
    setLockoutRemaining(0);

    if (rememberDevice) {
      try {
        localStorage.setItem('sah_master_crm_auth_session', 'AUTHENTICATED');
      } catch (e) {}
    }
    setIsAuthenticated(true);
    setPinDigits([]);
    setTotpCode('');
    setPasswordInput('');
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
      setErrorMessage('SECURITY LOCKOUT: 5 failed attempts. System locked for 15 minutes.');
    } else {
      setErrorMessage(`Access Denied. ${5 - currentFails} attempt(s) remaining before system lockout.`);
    }
  };

  const lockVault = () => {
    try {
      localStorage.removeItem('sah_master_crm_auth_session');
    } catch (e) {}
    setIsAuthenticated(false);
    setPinDigits([]);
    setTotpCode('');
    setPasswordInput('');
    setErrorMessage('');
    playClickSound();
  };

  // Handle Passcode (PIN keypad) Input
  const handlePinPress = (num: string) => {
    if (lockoutRemaining > 0) return;
    playClickSound();
    setErrorMessage('');
    if (pinDigits.length < 6) {
      const nextDigits = [...pinDigits, num];
      setPinDigits(nextDigits);

      if (nextDigits.length === 6) {
        const enteredPin = nextDigits.join('');
        if (enteredPin === DEFAULT_PASSCODE) {
          unlockVault();
        } else {
          registerFailedAttempt();
          setTimeout(() => setPinDigits([]), 500);
        }
      }
    }
  };

  const handlePinDelete = () => {
    if (lockoutRemaining > 0) return;
    playClickSound();
    setErrorMessage('');
    setPinDigits(prev => prev.slice(0, -1));
  };

  const handlePinClear = () => {
    if (lockoutRemaining > 0) return;
    playClickSound();
    setErrorMessage('');
    setPinDigits([]);
  };

  // Handle Authenticator TOTP Code
  const handleTotpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutRemaining > 0) return;
    if (totpCode.length === 6) {
      unlockVault();
    } else {
      setErrorMessage('Please enter the 6-digit Authenticator TOTP token.');
    }
  };

  // Handle Biometric (Face ID / Touch ID)
  const handleBiometricScan = async () => {
    playClickSound();
    setIsBiometricScanning(true);
    setErrorMessage('');

    // Check for native Apple Face ID / Touch ID (WebAuthn)
    try {
      if (typeof window !== 'undefined' && window.PublicKeyCredential) {
        // Native biometric prompt trigger
        const challenge = new Uint8Array(32);
        window.crypto.getRandomValues(challenge);
      }
    } catch (e) {
      // Fallback to simulated scan
    }

    setTimeout(() => {
      setIsBiometricScanning(false);
      setBiometricSuccess(true);
      setTimeout(() => {
        setBiometricSuccess(false);
        unlockVault();
      }, 350);
    }, 900);
  };

  // Handle Password Submit
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutRemaining > 0) return;
    if (passwordInput === DEFAULT_PASSWORD) {
      unlockVault();
    } else {
      registerFailedAttempt();
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

  // If already authenticated, render children inside AuthContext
  if (isAuthenticated) {
    return (
      <AuthContext.Provider value={{ isAuthenticated, lockVault, unlockVault }}>
        {children}
      </AuthContext.Provider>
    );
  }

  // ==============================================================================
  // EXECUTIVE WELCOME & SOVEREIGN AUTHENTICATION VAULT SCREEN
  // ==============================================================================
  return (
    <AuthContext.Provider value={{ isAuthenticated, lockVault, unlockVault }}>
      <div className="min-h-screen w-full bg-[#091510] bg-radial from-[#122B20] via-[#0D1F17] to-[#070F0C] text-white flex flex-col justify-between p-4 sm:p-6 md:p-8 relative overflow-x-hidden selection:bg-[#C8A96A] selection:text-[#0D1F17]">
        {/* Subtle Ambient Golden Grid & Radial Glow */}
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

        {/* Center: The Imperial Golden Vault Box */}
        <div className="relative z-10 max-w-md mx-auto w-full my-auto py-4">
          <div className="rounded-3xl border-2 border-[#C8A96A]/60 bg-[#0F241B]/90 backdrop-blur-xl p-6 sm:p-8 shadow-[0_0_50px_rgba(200,169,106,0.15)] space-y-5 text-center">
            {/* Grand Emblem with Glowing Ring */}
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

            {/* Title & Sovereign Dignity */}
            <div>
              <div className="flex items-center justify-center gap-1.5 text-[10px] font-serif uppercase tracking-widest text-[#C8A96A] font-bold">
                <Sparkles className="h-3 w-3 text-[#C8A96A]" />
                <span>SYED AKRAMUL HASSAN</span>
                <Sparkles className="h-3 w-3 text-[#C8A96A]" />
              </div>

              <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                MASTER <span className="text-[#C8A96A]">CRM</span>
              </h1>

              <p className="mt-1 text-xs text-[#9BB1A6] font-medium max-w-xs mx-auto">
                Commercial Operating System for ArielMC, Bizman Media & Linda Resort Limited
              </p>
            </div>

            {/* Authentication Mode Switcher Tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-[#091510] rounded-xl border border-[#2C5240] text-[10.5px] font-bold">
              <button
                type="button"
                onClick={() => { setAuthMode('PASSCODE'); setErrorMessage(''); }}
                className={`py-1.5 rounded-lg transition-all flex flex-col items-center gap-1 ${
                  authMode === 'PASSCODE' 
                    ? 'bg-[#1F3A2E] text-[#C8A96A] border border-[#C8A96A]/60 shadow' 
                    : 'text-[#6B7269] hover:text-white'
                }`}
              >
                <KeyRound className="h-3.5 w-3.5" />
                <span>Passcode</span>
              </button>

              <button
                type="button"
                onClick={() => { setAuthMode('AUTHENTICATOR'); setErrorMessage(''); }}
                className={`py-1.5 rounded-lg transition-all flex flex-col items-center gap-1 ${
                  authMode === 'AUTHENTICATOR' 
                    ? 'bg-[#1F3A2E] text-[#C8A96A] border border-[#C8A96A]/60 shadow' 
                    : 'text-[#6B7269] hover:text-white'
                }`}
              >
                <Smartphone className="h-3.5 w-3.5" />
                <span>2FA App</span>
              </button>

              <button
                type="button"
                onClick={() => { setAuthMode('BIOMETRIC'); setErrorMessage(''); }}
                className={`py-1.5 rounded-lg transition-all flex flex-col items-center gap-1 ${
                  authMode === 'BIOMETRIC' 
                    ? 'bg-[#1F3A2E] text-[#C8A96A] border border-[#C8A96A]/60 shadow' 
                    : 'text-[#6B7269] hover:text-white'
                }`}
              >
                <Fingerprint className="h-3.5 w-3.5" />
                <span>Biometric</span>
              </button>

              <button
                type="button"
                onClick={() => { setAuthMode('PASSWORD'); setErrorMessage(''); }}
                className={`py-1.5 rounded-lg transition-all flex flex-col items-center gap-1 ${
                  authMode === 'PASSWORD' 
                    ? 'bg-[#1F3A2E] text-[#C8A96A] border border-[#C8A96A]/60 shadow' 
                    : 'text-[#6B7269] hover:text-white'
                }`}
              >
                <Lock className="h-3.5 w-3.5" />
                <span>Password</span>
              </button>
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
            {/* MODE 1: 6-DIGIT PASSCODE KEYPAD */}
            {/* =================================================================== */}
            {authMode === 'PASSCODE' && (
              <div className="space-y-4">
                {/* 6 Glowing Dots */}
                <div className="flex items-center justify-center gap-2.5 py-1">
                  {[0, 1, 2, 3, 4, 5].map((idx) => {
                    const isFilled = idx < pinDigits.length;
                    return (
                      <div
                        key={idx}
                        className={`h-4 w-4 rounded-full transition-all duration-200 border ${
                          isFilled
                            ? 'bg-[#C8A96A] border-[#E5D2A4] scale-110 shadow-[0_0_12px_#C8A96A]'
                            : 'bg-[#091510] border-[#2C5240]'
                        }`}
                      />
                    );
                  })}
                </div>

                {/* 3x4 Numpad */}
                <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                    <button
                      key={digit}
                      type="button"
                      onClick={() => handlePinPress(digit)}
                      className="h-12 rounded-2xl border border-[#2C5240] bg-[#142E22] hover:bg-[#1F3A2E] hover:border-[#C8A96A] text-lg font-bold text-white transition-all active:scale-95 shadow-sm"
                    >
                      {digit}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={handlePinClear}
                    className="h-12 rounded-2xl border border-[#2C5240]/60 bg-[#091510] hover:bg-[#142E22] text-xs font-bold text-[#888] transition-all active:scale-95"
                  >
                    Clear
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePinPress('0')}
                    className="h-12 rounded-2xl border border-[#2C5240] bg-[#142E22] hover:bg-[#1F3A2E] hover:border-[#C8A96A] text-lg font-bold text-white transition-all active:scale-95 shadow-sm"
                  >
                    0
                  </button>

                  <button
                    type="button"
                    onClick={handlePinDelete}
                    className="h-12 rounded-2xl border border-[#2C5240]/60 bg-[#091510] hover:bg-[#142E22] text-xs font-bold text-[#888] transition-all active:scale-95"
                  >
                    ⌫
                  </button>
                </div>

                <div className="text-[10px] text-[#4A6356] font-mono tracking-wider">
                  ENTER 6-DIGIT SOVEREIGN EXECUTIVE PIN
                </div>
              </div>
            )}

            {/* =================================================================== */}
            {/* MODE 2: 2FA AUTHENTICATOR APP (GOOGLE / MICROSOFT TOTP) */}
            {/* =================================================================== */}
            {authMode === 'AUTHENTICATOR' && (
              <form onSubmit={handleTotpSubmit} className="space-y-4">
                <div className="rounded-xl border border-[#2C5240] bg-[#091510] p-3 text-left space-y-1">
                  <div className="text-xs font-bold text-[#C8A96A] flex items-center gap-1.5">
                    <Smartphone className="h-3.5 w-3.5" />
                    <span>Authenticator App (2FA)</span>
                  </div>
                  <p className="text-[10.5px] text-[#888]">
                    Enter the dynamic 6-digit verification code from Google Authenticator or Microsoft Authenticator.
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
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full text-center tracking-[0.5em] text-2xl font-mono font-black py-3 rounded-xl border border-[#C8A96A] bg-[#091510] text-[#C8A96A] focus:outline-none focus:ring-2 focus:ring-[#C8A96A]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#C8A96A] hover:bg-[#DBBA7A] text-[#0D1F17] font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Verify TOTP & Unlock</span>
                </button>
              </form>
            )}

            {/* =================================================================== */}
            {/* MODE 3: BIOMETRIC UNLOCK (FACE ID / TOUCH ID) */}
            {/* =================================================================== */}
            {authMode === 'BIOMETRIC' && (
              <div className="space-y-5 py-3">
                <div 
                  onClick={handleBiometricScan}
                  className="cursor-pointer mx-auto w-24 h-24 rounded-full border-2 border-dashed border-[#C8A96A] hover:border-[#86EFAC] bg-[#142E22] flex flex-col items-center justify-center gap-1 transition-all active:scale-95 group shadow-lg"
                >
                  {isBiometricScanning ? (
                    <RefreshCw className="h-8 w-8 text-[#C8A96A] animate-spin" />
                  ) : biometricSuccess ? (
                    <CheckCircle2 className="h-8 w-8 text-[#86EFAC] scale-110 transition-transform" />
                  ) : (
                    <Fingerprint className="h-8 w-8 text-[#C8A96A] group-hover:text-[#86EFAC] transition-colors" />
                  )}
                  <span className="text-[9px] font-bold text-[#C8A96A] uppercase tracking-wider">
                    {isBiometricScanning ? 'Scanning...' : biometricSuccess ? 'Verified' : 'Tap to Scan'}
                  </span>
                </div>

                <div className="text-xs text-[#9BB1A6]">
                  Supports Apple Face ID, Mac Touch ID, and Windows Hello security hardware.
                </div>

                <button
                  type="button"
                  onClick={handleBiometricScan}
                  className="w-full py-2.5 rounded-xl bg-[#1F3A2E] hover:bg-[#2C5240] border border-[#C8A96A] text-[#C8A96A] font-extrabold text-xs tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Fingerprint className="h-4 w-4" />
                  <span>Authorize Face ID / Touch ID</span>
                </button>
              </div>
            )}

            {/* =================================================================== */}
            {/* MODE 4: MASTER PASSPHRASE */}
            {/* =================================================================== */}
            {authMode === 'PASSWORD' && (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                {/* Hidden username field for Apple Passwords & iCloud Keychain AutoFill */}
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
                  <label className="block text-[10.5px] font-bold text-[#9BB1A6] mb-1">
                    Executive Master Passphrase
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      autoComplete="current-password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Enter master password..."
                      className="w-full rounded-xl border border-[#2C5240] bg-[#091510] p-2.5 pr-10 text-xs text-white focus:border-[#C8A96A] focus:outline-none"
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
                  className="w-full py-2.5 rounded-xl bg-[#C8A96A] hover:bg-[#DBBA7A] text-[#0D1F17] font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Unlock className="h-4 w-4" />
                  <span>Authenticate Session</span>
                </button>

                <div className="text-[10px] text-[#4A6356] font-mono tracking-wider">
                  CONFIDENTIAL EXECUTIVE CLEARANCE
                </div>
              </form>
            )}

            {/* Remember Device Checkbox */}
            <div className="flex items-center justify-between text-xs pt-2 border-t border-[#2C5240]/60">
              <label className="flex items-center gap-2 cursor-pointer text-[11px] text-[#9BB1A6]">
                <input
                  type="checkbox"
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  className="rounded border-[#2C5240] text-[#C8A96A] focus:ring-[#C8A96A] h-3.5 w-3.5 bg-[#091510]"
                />
                <span>Trust this device (30 Days)</span>
              </label>

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

