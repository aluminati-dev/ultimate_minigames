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
  doc 
} from "firebase/firestore";
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User 
} from "firebase/auth";
import { db, auth } from "./firebase";
import { motion, AnimatePresence } from "motion/react";
import { Terminal, Shield, Ghost, Lock, User as UserIcon, LogOut, Database, AlertTriangle, Gamepad2, Star, Trophy, Zap } from "lucide-react";
import { cn } from "./lib/utils";

// --- Types & Constants ---
const ADMIN_EMAIL = "myselfab.official@gmail.com";

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
    }, 400);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 800);
          return 100;
        }
        // Random increment for a more "realistic" feel
        const inc = Math.random() > 0.8 ? 5 : 1;
        return Math.min(prev + inc, 100);
      });
    }, 100);

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
            className={typeof line === 'string' && line.includes("GRANTED") ? "text-white font-bold" : ""}
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

  useEffect(() => {
    const q = query(collection(db, "logs"), orderBy("timestamp", "desc"));
    console.log("AdminPanel: Attaching onSnapshot to 'logs' collection...");
    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log(`AdminPanel: Received snapshot with ${snapshot.size} documents.`);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLogs(data);
      setLoading(false);
    }, (error) => {
      console.error("AdminPanel: onSnapshot error:", error);
      handleFirestoreError(error, OperationType.LIST, "logs");
    });

    return () => unsubscribe();
  }, []);

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
                      <th className="px-6 py-4 font-semibold">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-zinc-800/30 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:bg-indigo-900/30 group-hover:text-indigo-400 transition-colors">
                              <UserIcon size={14} />
                            </div>
                            <span className="text-sm font-medium text-zinc-200">{log.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <code className="text-xs bg-zinc-950 px-2 py-1 rounded border border-zinc-800 text-indigo-400">
                            {log.ip}
                          </code>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs text-zinc-500">
                            {log.timestamp?.toDate ? log.timestamp.toDate().toLocaleString() : new Date(log.timestamp).toLocaleString()}
                          </span>
                        </td>
                      </tr>
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
                Mega <span className="text-yellow-400">Play</span>
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
        className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-black mb-8 shadow-[0_0_50px_rgba(34,197,94,0.5)]"
      >
        <Ghost size={48} />
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

    try {
      // Get IP from a public API (since GitHub Pages is static)
      let ip = "unknown";
      try {
        const ipRes = await fetch("https://api.ipify.org?format=json");
        const data = await ipRes.json();
        ip = data.ip || "unknown";
      } catch (e) {
        console.warn("Failed to fetch IP from public API:", e);
      }

      // Log to Firestore
      console.log("handleWin: Attempting to log to Firestore...", { name, ip });
      await addDoc(collection(db, "logs"), {
        name: name || "Anonymous",
        ip: String(ip),
        timestamp: Timestamp.now()
      });
      console.log("handleWin: Successfully logged to Firestore.");
    } catch (error) {
      console.error("Logging failed:", error);
      handleFirestoreError(error, OperationType.WRITE, "logs");
    }
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
