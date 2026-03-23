import { useAppKit, useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import React, { useEffect, useState } from "react";
import { formatAddress } from "../utils";
import { useTokenRead } from "../hooks/specific/useTokenRead";
import { useTokenWrite } from "../hooks/specific/useTokenWrite";
import { toast } from "react-toastify";
import { appkit, liskTestnet } from "../connection";


// Faucet Visual
const FaucetVisual = () => (
  <div style={{ position: "relative", width: 340, height: 340, margin: "0 auto" }}>
    {[0, 1, 2].map((i) => (
      <div key={i} style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        border: "1px solid rgba(245,197,66,0.3)",
        animation: `pulse-ring 3s ${i * 1}s ease-out infinite`,
      }} />
    ))}
    <div style={{
      position: "absolute", inset: 20,
      border: "1px solid rgba(255,255,255,0.05)", borderRadius: "50%",
      animation: "spin-slow 20s linear infinite",
    }}>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} style={{
          position: "absolute", width: 8, height: 8, borderRadius: "50%",
          background: i % 2 === 0 ? "var(--gold)" : "var(--accent)",
          top: "50%", left: "50%",
          transform: `rotate(${i * 60}deg) translateX(140px) translateY(-50%)`,
          opacity: 0.7,
        }} />
      ))}
    </div>
    <div style={{
      position: "absolute", inset: 50,
      border: "1px dashed rgba(255,255,255,0.08)", borderRadius: "50%",
      animation: "counter-spin 15s linear infinite",
    }} />
    <div style={{
      position: "absolute", inset: 70,
      background: "linear-gradient(135deg, #1A2240 0%, #0D1120 100%)",
      borderRadius: "50%", border: "1px solid rgba(245,197,66,0.2)",
      display: "flex", alignItems: "center", justifyContent: "center",
      animation: "float 6s ease-in-out infinite",
      boxShadow: "0 0 60px rgba(245,197,66,0.15), inset 0 0 40px rgba(245,197,66,0.05)",
    }}>
      <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
        <circle cx="45" cy="45" r="40" fill="url(#coinGrad)" />
        <circle cx="45" cy="45" r="32" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        <text x="45" y="52" textAnchor="middle" fontSize="28" fontWeight="800"
          fontFamily="Syne, sans-serif" fill="rgba(6,9,18,0.9)">DRP</text>
        <defs>
          <radialGradient id="coinGrad" cx="35%" cy="30%">
            <stop offset="0%" stopColor="#FFE08A" />
            <stop offset="50%" stopColor="#F5C542" />
            <stop offset="100%" stopColor="#C89B1A" />
          </radialGradient>
        </defs>
      </svg>
    </div>
    <svg style={{ position: "absolute", inset: 0 }} width="340" height="340" viewBox="0 0 340 340">
      <circle cx="170" cy="170" r="155" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="2" />
      <circle cx="170" cy="170" r="155" fill="none" stroke="url(#arcGrad)" strokeWidth="2"
        strokeDasharray="283" strokeDashoffset="70" strokeLinecap="round"
        transform="rotate(-90 170 170)"
        style={{ animation: "draw 2s 0.5s cubic-bezier(0.22,1,0.36,1) both" }} />
      <defs>
        <linearGradient id="arcGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#F5C542" />
          <stop offset="100%" stopColor="#3B6FFF" />
        </linearGradient>
      </defs>
    </svg>
    <div style={{
      position: "absolute", bottom: 30, right: 20,
      background: "var(--surface2)", border: "1px solid rgba(245,197,66,0.3)",
      borderRadius: 16, padding: "10px 16px",
      display: "flex", alignItems: "center", gap: 8,
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: "50%",
        background: "rgba(245,197,66,0.15)",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
      }}>💧</div>
      <div>
        <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 14, color: "var(--gold)" }}>+100 DRP</div>
        <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: 11, color: "var(--muted)" }}>Daily Claim</div>
      </div>
    </div>
  </div>
);

// Shared input style
const inputStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 12,
  padding: "12px 16px",
  color: "var(--text)",
  fontFamily: "DM Sans, sans-serif",
  fontSize: 14,
  outline: "none",
  minWidth: 0,
  flex: 1,
};

// Token Info Row
const InfoRow = ({ label, value, last }: { label: string; value: string; last?: boolean }) => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "18px 32px",
    borderBottom: last ? "none" : "1px solid rgba(255,255,255,0.05)",
  }}>
    <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: 14, color: "var(--muted)" }}>
      {label}
    </span>
    <span style={{
      fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 15, color: "var(--text)",
      background: "rgba(245,197,66,0.08)", border: "1px solid rgba(245,197,66,0.15)",
      borderRadius: 8, padding: "4px 12px",
    }}>
      {value}
    </span>
  </div>
);

// Countdown Banner
const CountdownBanner = ({ seconds, formatTime }: { seconds: number; formatTime: (s: number) => string }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 14,
    background: "rgba(245,197,66,0.06)",
    border: "1px solid rgba(245,197,66,0.2)",
    borderRadius: 16, padding: "16px 20px", marginBottom: 16,
  }}>
    <span style={{ fontSize: 22, flexShrink: 0 }}>⏳</span>
    <div>
      <div style={{
        fontFamily: "DM Sans, sans-serif", fontSize: 11,
        color: "var(--muted)", marginBottom: 2,
        textTransform: "uppercase", letterSpacing: "0.06em",
      }}>
        Next claim available in
      </div>
      <div className="font-display" style={{ fontSize: 22, fontWeight: 800, color: "var(--gold)" }}>
        {formatTime(seconds)}
      </div>
    </div>
  </div>
);

// Main Page
export default function LandingPage() {
  const { open } = useAppKit();
  const { address } = useAppKitAccount();
  const { caipNetwork } = useAppKitNetwork();

  const { requestToken, mint, transfer, isRequesting } = useTokenWrite();
  const { getBalance, getTotalSupply, getUserClaims, getClaimCooldown, getFaucetAmount } = useTokenRead();

  // Per-wallet state
  const [balance, setBalance]           = useState<number | null>(null);
  const [totalSupply, setTotalSupply]   = useState<number | null>(null);
  const [claims, setClaims]             = useState<number | null>(null);
  const [faucetAmount, setFaucetAmount] = useState<number | null>(null);
  const [claimed, setClaimed]           = useState<boolean>(false);

  // cooldown starts at 0 — real value always comes from the chain via getClaimCooldown()
  // getClaimCooldown() = lastRequest[wallet] + 24h - now  →  exact seconds remaining
  // So on every page refresh, the real remaining time is fetched and the ticker picks up from there
  const [cooldown, setCooldown] = useState<number>(0);

  // Token info state
  const TOKEN_NAME       = "DROP";
  const TOKEN_SYMBOL     = "DRP";
  const TOKEN_DECIMALS   = "18";
  const TOKEN_MAX_SUPPLY = "10,000,000";
  const TOKEN_COOLDOWN   = "24h";
  const [infoTotalSupply, setInfoTotalSupply] = useState<string>("...");
  const [infoFaucetAmt,   setInfoFaucetAmt]   = useState<string>("...");
  const [infoLoading,     setInfoLoading]     = useState<boolean>(true);

  // Form inputs
  const [mintAmt,     setMintAmt]     = useState<string>("");
  const [toAddress,   setToAddress]   = useState<string>("");
  const [transferAmt, setTransferAmt] = useState<string>("");

  // Network check
  // const wrongNetwork = !!caipNetwork && Number(caipNetwork.id) !== Number(liskTestnet.id);
  // const wrongNetwork = !!caipNetwork && Number(caipNetwork.id) !== 4202;
  const wrongNetwork = caipNetwork != null && Number(caipNetwork.id) !== 4202;
  // const wrongNetwork = !!caipNetwork && caipNetwork.caipNetworkId !== liskTestnet.caipNetworkId;

  // Load global token info
  // Extracted as a function so we can call it after claim/mint to refresh total supply
  const loadTokenInfo = async () => {
    setInfoLoading(true);
    try {
      const [ts, fa] = await Promise.all([getTotalSupply(), getFaucetAmount()]);
      if (ts != null) setInfoTotalSupply(Number(ts).toLocaleString());
      if (fa != null) setInfoFaucetAmt(String(fa));
    } catch {
      setInfoTotalSupply("—");
      setInfoFaucetAmt("—");
    } finally {
      setInfoLoading(false);
    }
  };

  useEffect(() => {
    loadTokenInfo();
  }, []); 

  // Load per-wallet data
  // On every connect/refresh, getClaimCooldown() reads lastRequest from the chain
  // and returns the exact remaining seconds — so the countdown is always accurate
  const refreshData = async () => {
    if (!address) return;
    const [b, ts, c, cd, fa] = await Promise.all([
      getBalance(), getTotalSupply(), getUserClaims(), getClaimCooldown(), getFaucetAmount(),
    ]);
    if (b  != null) setBalance(Number(b));
    if (ts != null) setTotalSupply(Number(ts));
    if (c  != null) setClaims(Number(c));
    if (cd != null) setCooldown(cd); 
    if (fa != null) setFaucetAmount(Number(fa));
  };

  useEffect(() => {
    refreshData();
    setClaimed(false); 
  }, [address]); 



  // Live countdown ticker 
  // Picks up from wherever getClaimCooldown() left off and counts down 1s at a time
  useEffect(() => {
  if (cooldown <= 0) return;

  const interval = setInterval(() => {
    setCooldown(prev => (prev <= 1 ? 0 : prev - 1));
  }, 1000);

  return () => clearInterval(interval);
}, [cooldown]);

  // Helpers
  const formatTime = (s: number) => {
    const h   = Math.floor(s / 3600);
    const m   = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}h ${m}m ${sec}s`;
    if (m > 0) return `${m}m ${sec}s`;
    return `${sec}s`;
  };

  // Handlers
const handleSwitchNetwork = async () => {
  try {
    await appkit.switchNetwork(liskTestnet);
    toast.success("Switched to Lisk Sepolia!");
  } catch {
    // If programmatic switch fails, open the modal so user can switch manually
    open();
    toast.error("Please switch to Lisk Sepolia in your wallet.", { toastId: "wrong-network" });
  }
};

  // Wrong network toast
 useEffect(() => {
  if (wrongNetwork) {
    toast.error("Wrong network! Please switch to Lisk Sepolia.");
    handleSwitchNetwork(); // auto-attempt switch as soon as wrong network detected
  }
}, [wrongNetwork]);

const handleClaim = async () => {
  if (wrongNetwork) return;

  const success = await requestToken();

  if (success) {
    setClaimed(true);

    setTimeout(async () => {
      await refreshData();
    }, 2000); // wait for blockchain update
  }
};

  const handleMint = async () => {
    if (wrongNetwork) { toast.error("Wrong network!"); return; }
    if (!address)     { toast.error("Connect your wallet first."); return; }
    const amount = Number(mintAmt);
    if (!amount || amount <= 0) { toast.error("Enter a valid amount."); return; }
    if (amount > 10000)          { toast.error("Max 10,000 per mint."); return; }
    const success = await mint(address, amount);
    if (success) {
      setMintAmt("");
      await refreshData();
      await loadTokenInfo(); 
    }
  };

  const handleTransfer = async () => {
    if (wrongNetwork) { toast.error("Wrong network!"); return; }
    if (!toAddress.startsWith("0x") || toAddress.length !== 42) {
      toast.error("Enter a valid recipient address (0x...).");
      return;
    }
    const amount = Number(transferAmt);
    if (!amount || amount <= 0) { toast.error("Enter a valid amount."); return; }
    const success = await transfer(toAddress, amount);
    if (success) { setToAddress(""); setTransferAmt(""); await refreshData(); }
  };

  //
  return (
    <>
      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "18px 48px",
        background: "rgba(6,9,18,0.7)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10, background: "var(--gold)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
          }}>💧</div>
          <span className="font-display" style={{ fontSize: 18, fontWeight: 800, color: "var(--text)" }}>
            DailyDrop
          </span>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {wrongNetwork && (
            <button onClick={handleSwitchNetwork} style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)",
              color: "#EF4444", borderRadius: 100, padding: "8px 16px",
              fontFamily: "DM Sans, sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}>
              ⚠️ Switch to Lisk Sepolia
            </button>
          )}
          <button className="btn-primary" onClick={() => open()}
            style={{ padding: "10px 22px", fontSize: 13, animation: "none" }}>
            {address ? (
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{
                  width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                  background: wrongNetwork ? "#EF4444" : "#22C55E",
                }} />
                {formatAddress(address)}
              </span>
            ) : "Connect Wallet"}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        position: "relative", overflow: "hidden",
        minHeight: "90vh", display: "flex", alignItems: "center",
        padding: "80px 48px",
      }}>
        <div className="orb" style={{ width: 600, height: 600, background: "rgba(59,111,255,0.12)", top: -200, right: -100 }} />
        <div className="orb" style={{ width: 400, height: 400, background: "rgba(245,197,66,0.07)", bottom: -100, left: -50 }} />
        <div className="orb" style={{ width: 300, height: 300, background: "rgba(108,59,255,0.1)", top: "30%", left: "40%" }} />

        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80,
          alignItems: "center", maxWidth: 1200, margin: "0 auto", width: "100%",
        }}>
          {/* LEFT */}
          <div>
            <h1 className="font-display animate-slide-up delay-1"
              style={{ fontSize: "clamp(42px, 5vw, 68px)", fontWeight: 800, lineHeight: 1.05, marginBottom: 24, color:"white" }}>
              Claim Free<br />
              <span className="animate-shimmer " >Tokens Daily.</span><br />
              No Strings.
            </h1>

            <p className="animate-slide-up delay-2"
              style={{ fontSize: 17, lineHeight: 1.7, color: "var(--muted)", maxWidth: 440, marginBottom: 32 }}>
              DailyDrop distributes free 100 DRP tokens every 24 hours. Connect your wallet, claim your share,
              and start building your on-chain portfolio — completely free.
            </p>

            {address ? (
              <>
                {/* Stats */}
                <div style={{ display: "flex", gap: 14, marginBottom: 16, flexWrap: "wrap" }}>
                 
                  {[
                    { label: "Balance",      value: balance     != null ? `${balance} DRP`    : "..." },
                    { label: "Total Claims", value: claims      != null ? String(claims)       : "..." },
                    { label: "Total Supply", value: totalSupply != null ? `${totalSupply} DRP` : "..." },
                  ].map(({ label, value }) => (
                    <div key={label} style={{
                      background: "var(--surface2)", border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: 16, padding: "16px 20px", flex: 1, minWidth: 110, overflow: "hidden",
                    }}>
                      <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                        {label}
                      </div>
                      <div className="font-display" style={{ fontSize: 16, fontWeight: 800, color: "var(--gold)", wordBreak: "break-all" }}>
                        {value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Countdown — only shown when on cooldown */}
                {cooldown > 0 && <CountdownBanner seconds={cooldown} formatTime={formatTime} />}

                <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                  <button className="btn-primary"
                    disabled={cooldown > 0 || isRequesting || wrongNetwork}
                    onClick={handleClaim}>
                    {isRequesting ? "Claiming..."
                      : cooldown > 0 ? "On Cooldown"
                      : claimed    ? "✓ Claimed Today!"
                      : "⚡ Claim Tokens"}
                  </button>
                  <button className="btn-secondary">How it works ↗</button>
                </div>
              </>
            ) : (
              <button className="btn-primary" onClick={() => open()}>
                🔌 Connect Wallet to Start
              </button>
            )}
          </div>

          {/* RIGHT */}
          <div className="animate-fade-in delay-3"
            style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <FaucetVisual />
          </div>
        </div>
      </section>

      {/* TOKEN INFO */}
      <section style={{ padding: "0 48px 80px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 className="font-display"
            style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: "var(--text)" }}>
            Token Info
          </h2>
          <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 28 }}>
            Live data read directly from the contract.
          </p>
          <div style={{
            background: "linear-gradient(135deg, #0D1120 0%, #141929 100%)",
            border: "1px solid rgba(245,197,66,0.15)",
            borderRadius: 24, overflow: "hidden",
          }}>
            {infoLoading ? (
              <div style={{ padding: 48, textAlign: "center", color: "var(--muted)", fontFamily: "DM Sans, sans-serif", fontSize: 14 }}>
                Loading contract data...
              </div>
            ) : (
              <>
                <InfoRow label="Token Name" value={TOKEN_NAME} />
                <InfoRow label="Symbol" value={TOKEN_SYMBOL} />
                <InfoRow label="Decimals" value={TOKEN_DECIMALS} />
                <InfoRow label="Total Supply" value={`${infoTotalSupply} ${TOKEN_SYMBOL}`} />
                <InfoRow label="Max Supply" value={`${TOKEN_MAX_SUPPLY} ${TOKEN_SYMBOL}`} />
                <InfoRow label="Faucet Amount" value={`${infoFaucetAmt} ${TOKEN_SYMBOL} / claim`} />
                <InfoRow label="Cooldown" value={TOKEN_COOLDOWN} last />
              </>
            )}
          </div>
        </div>
      </section>

      {/* TOKEN MANAGEMENT */}
      {address && (
        <section style={{ padding: "0 48px 80px" }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <div style={{
              background: "linear-gradient(135deg, #0D1120 0%, #141929 100%)",
              border: "1px solid rgba(245,197,66,0.15)",
              borderRadius: 24, padding: 48, color: "var(--text)",
            }}>
              <h2 className="font-display" style={{ fontSize: 28, fontWeight: 800, marginBottom: 32 }}>
                Token Management
              </h2>

              {/* Request Tokens */}
              <div style={{ marginBottom: 36, paddingBottom: 36, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Request Tokens</h3>
                <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 16 }}>
                  Claim {faucetAmount ?? "..."} DRP from the faucet. One claim per 24 hours.
                </p>
                {cooldown > 0 && <CountdownBanner seconds={cooldown} formatTime={formatTime} />}
                <button className="btn-primary"
                  disabled={cooldown > 0 || isRequesting || wrongNetwork}
                  onClick={handleClaim}>
                  {isRequesting ? "Claiming..."
                    : cooldown > 0 ? "On Cooldown"
                    : claimed    ? "✓ Claimed!"
                    : `Request ${faucetAmount ?? "..."} DRP`}
                </button>
              </div>

              {/* Mint */}
              <div style={{ marginBottom: 36, paddingBottom: 36, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Mint Tokens</h3>
                <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 16 }}>
                  Mint new DRP tokens to your wallet. Max 10,000 per transaction.
                </p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <input type="number" placeholder="Amount to mint"
                    value={mintAmt} onChange={(e) => setMintAmt(e.target.value)}
                    style={inputStyle} />
                  <button className="btn-primary" style={{ animation: "none" }}
                    disabled={wrongNetwork} onClick={handleMint}>
                    Mint
                  </button>
                </div>
              </div>

              {/* Transfer */}
              <div>
                <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Transfer Tokens</h3>
                <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 16 }}>
                  Send DRP tokens to another wallet address.
                </p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <input type="text" placeholder="Recipient (0x...)"
                    value={toAddress} onChange={(e) => setToAddress(e.target.value)}
                    style={{ ...inputStyle, flex: 2 }} />
                  <input type="number" placeholder="Amount"
                    value={transferAmt} onChange={(e) => setTransferAmt(e.target.value)}
                    style={{ ...inputStyle, flex: 1 }} />
                  <button className="btn-primary" style={{ animation: "none" }}
                    disabled={wrongNetwork} onClick={handleTransfer}>
                    Transfer
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>
      )}
    </>
  );
}