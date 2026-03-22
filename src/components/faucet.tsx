import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import React, { useEffect, useRef, useState } from "react";
import { formatAddress } from "../utils";
import { useTokenRead } from "../hooks/specific/useTokenRead";
import { useTokenWrite } from "../hooks/specific/useTokenWrite";
import { toast } from "react-toastify/unstyled";
import { appkit, liskTestnet } from "../connection";

// Animated faucet/coin SVG
const FaucetVisual = () => (
  <div
    style={{ position: "relative", width: 340, height: 340, margin: "0 auto" }}
  >
    {/* Pulse rings */}
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: "1px solid rgba(245,197,66,0.3)",
          animation: `pulse-ring 3s ${i * 1}s ease-out infinite`,
        }}
      />
    ))}

    {/* Outer ring */}
    <div
      style={{
        position: "absolute",
        inset: 20,
        border: "1px solid rgba(255,255,255,0.05)",
        borderRadius: "50%",
        animation: "spin-slow 20s linear infinite",
      }}
    >
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: i % 2 === 0 ? "var(--gold)" : "var(--accent)",
            top: "50%",
            left: "50%",
            transform: `rotate(${i * 60}deg) translateX(140px) translateY(-50%)`,
            opacity: 0.7,
          }}
        />
      ))}
    </div>

    {/* Inner ring */}
    <div
      style={{
        position: "absolute",
        inset: 50,
        border: "1px dashed rgba(255,255,255,0.08)",
        borderRadius: "50%",
        animation: "counter-spin 15s linear infinite",
      }}
    />

    {/* Center circle */}
    <div
      style={{
        position: "absolute",
        inset: 70,
        background: "linear-gradient(135deg, #1A2240 0%, #0D1120 100%)",
        borderRadius: "50%",
        border: "1px solid rgba(245,197,66,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "float 6s ease-in-out infinite",
        boxShadow:
          "0 0 60px rgba(245,197,66,0.15), inset 0 0 40px rgba(245,197,66,0.05)",
      }}
    >
      {/* Coin SVG */}
      <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
        <circle cx="45" cy="45" r="40" fill="url(#coinGrad)" />
        <circle
          cx="45"
          cy="45"
          r="32"
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1"
        />
        <text
          x="45"
          y="52"
          textAnchor="middle"
          fontSize="28"
          fontWeight="800"
          fontFamily="Syne, sans-serif"
          fill="rgba(6,9,18,0.9)"
        >
          DRP
        </text>
        <defs>
          <radialGradient id="coinGrad" cx="35%" cy="30%">
            <stop offset="0%" stopColor="#FFE08A" />
            <stop offset="50%" stopColor="#F5C542" />
            <stop offset="100%" stopColor="#C89B1A" />
          </radialGradient>
        </defs>
      </svg>
    </div>

    {/* Progress arc */}
    <svg
      style={{ position: "absolute", inset: 0 }}
      width="340"
      height="340"
      viewBox="0 0 340 340"
    >
      <circle
        cx="170"
        cy="170"
        r="155"
        fill="none"
        stroke="rgba(255,255,255,0.03)"
        strokeWidth="2"
      />
      <circle
        cx="170"
        cy="170"
        r="155"
        fill="none"
        stroke="url(#arcGrad)"
        strokeWidth="2"
        strokeDasharray="283"
        strokeDashoffset="70"
        strokeLinecap="round"
        transform="rotate(-90 170 170)"
        className="progress-ring"
        style={{ animation: "draw 2s 0.5s cubic-bezier(0.22,1,0.36,1) both" }}
      />
      <defs>
        <linearGradient id="arcGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#F5C542" />
          <stop offset="100%" stopColor="#3B6FFF" />
        </linearGradient>
      </defs>
    </svg>

    {/* Drop badge */}
    <div
      style={{
        position: "absolute",
        bottom: 30,
        right: 20,
        background: "var(--surface2)",
        border: "1px solid rgba(245,197,66,0.3)",
        borderRadius: 16,
        padding: "10px 16px",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "rgba(245,197,66,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
        }}
      >
        💧
      </div>
      <div>
        <div
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
            fontSize: 14,
            color: "var(--gold)",
          }}
        >
          +50 DDT
        </div>
        <div
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: 11,
            color: "var(--muted)",
          }}
        >
          Daily Claim
        </div>
      </div>
    </div>
  </div>
);

export default function LandingPage() {
  const { open } = useAppKit();
  const { address, network } = useAppKitAccount();
  

  // ✅ Correct hook destructuring
  const {
    requestToken,
    mint,
    transfer,
    isRequesting,
    isMinting,
    isTransferring,
  } = useTokenWrite();
  const {
    getBalance,
    getTotalSupply,
    getUserClaims,
    getClaimCooldown,
    getFaucetAmount,
  } = useTokenRead();

  const [balance, setBalance] = useState<number | null>(null);
  const [totalSupply, setTotalSupply] = useState<number | null>(null);
  const [claims, setClaims] = useState<number | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [claimed, setClaimed] = useState(false);
  const [faucetAmount, setFaucetAmount] = useState<number | null>(null);

   // ⚠️ Check network on render
 useEffect(() => {
  if (network && network.id !== liskTestnet.id) {
    toast.error("Please switch to Lisk Sepolia network in your wallet!");
  }
}, [network]);

  // Optional: force network switch
  const handleSwitchNetwork = async () => {
    try {
      await appkit.switchNetwork(liskTestnet);
      toast.success("Switched to Lisk Sepolia!");
    } catch (err) {
      toast.error(
        "Network switch failed. Please switch manually in your wallet."
      );
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const handleConnectWallet = () => open();

  useEffect(() => {
    if (!address) return;

    (async () => {
      const b = await getBalance();
      const ts = await getTotalSupply();
      const c = await getUserClaims();
      const cd = await getClaimCooldown();
      const fa = await getFaucetAmount();

      if (b !== null) setBalance(Number(b));
      if (ts !== null) setTotalSupply(Number(ts));
      if (c !== null) setClaims(Number(c));
      if (cd !== null) setCooldown(cd);
      if (fa !== null) setFaucetAmount(Number(fa));
    })();
  }, [
    address,
    getBalance,
    getTotalSupply,
    getUserClaims,
    getClaimCooldown,
    getFaucetAmount,
  ]);

  const handleClaim = async () => {
    const success = await requestToken();
    if (success) {
      setClaimed(true);

      // refresh data after claim
      const b = await getBalance();
      const c = await getUserClaims();
      const cd = await getClaimCooldown();

      if (b !== null) setBalance(Number(b));
      if (c !== null) setClaims(Number(c));
      if (cd !== null) setCooldown(cd);
    }
  };

 const handleMint = async () => {
  const amount = Number(
    (document.getElementById("mintAmount") as HTMLInputElement).value,
  );
  if (!amount) return;

  const success = await mint(address!, amount);
  if (success) {
    // Refresh balance & total supply
    const b = await getBalance();
    const ts = await getTotalSupply();
    if (b !== null) setBalance(Number(b));
    if (ts !== null) setTotalSupply(Number(ts));
  }
};

const handleTransfer = async () => {
  const to = (document.getElementById("transferAddress") as HTMLInputElement).value;
  const amount = Number((document.getElementById("transferAmount") as HTMLInputElement).value);
  if (!to || !amount) return;

  const success = await transfer(to, amount);
  if (success) {
    const b = await getBalance();
    if (b !== null) setBalance(Number(b));
  }
  
};


  return (
    <>
      {/* NAV */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 48px",
          background: "rgba(6,9,18,0.7)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: "var(--gold)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
            }}
          >
            💧
          </div>
          <span
            className="font-display"
            style={{ fontSize: 18, fontWeight: 800, color: "var(--text)" }}
          >
            DailyDrop
          </span>
        </div>

        <button
          className="btn-primary"
          onClick={handleConnectWallet}
          style={{ padding: "10px 22px", fontSize: 13 }}
        >
          {address ? formatAddress(address) : "Connect Wallet"}
        </button>
      </nav>

      {/* HERO */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
          padding: "80px 48px",
        }}
      >
        <div
          className="orb"
          style={{
            width: 600,
            height: 600,
            background: "rgba(59,111,255,0.12)",
            top: -200,
            right: -100,
          }}
        />
        <div
          className="orb"
          style={{
            width: 400,
            height: 400,
            background: "rgba(245,197,66,0.07)",
            bottom: -100,
            left: -50,
          }}
        />
        <div
          className="orb"
          style={{
            width: 300,
            height: 300,
            background: "rgba(108,59,255,0.1)",
            top: "30%",
            left: "40%",
          }}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 80,
            alignItems: "center",
            maxWidth: 1200,
            margin: "0 auto",
            width: "100%",
          }}
        >
          {/* LEFT */}
          <div>
            <h1
              className="font-display animate-slide-up delay-1"
              style={{
                fontSize: "clamp(42px, 5vw, 68px)",
                fontWeight: 800,
                lineHeight: 1.05,
                marginBottom: 24,
              }}
            >
              Claim Free
              <br />
              <span className="animate-shimmer">Tokens Daily.</span>
              <br />
              No Strings.
            </h1>

            <p
              className="animate-slide-up delay-2"
              style={{
                fontSize: 17,
                lineHeight: 1.7,
                color: "var(--muted)",
                maxWidth: 440,
                marginBottom: 40,
              }}
            >
              DailyDrop distributes free tokens every 24 hours. Connect your
              wallet, claim your share, and start building your on-chain
              portfolio — completely free.
            </p>

            {address ? (
              <div
                className="animate-slide-up delay-3"
                style={{
                  display: "flex",
                  gap: 14,
                  marginBottom: 48,
                  flexWrap: "wrap",
                }}
              >
                {/* USER DATA */}
                <div className="flex flex-col gap-2 mb-6">
                  <p>
                    Wallet Balance:{" "}
                    {balance !== null ? `${balance} DDT` : "..."}
                  </p>
                  <p>Total Claims: {claims !== null ? claims : "..."}</p>
                  <p>
                    Total Supply:{" "}
                    {totalSupply !== null ? `${totalSupply} DDT` : "..."}
                  </p>
                </div>

                {/* CLAIM BUTTON */}
                <button
                  className="btn-primary"
                  disabled={cooldown > 0 || isRequesting}
                  onClick={handleClaim}
                >
                  {isRequesting
                    ? "Claiming..."
                    : cooldown > 0
                      ? `Retry in ${formatTime(cooldown)}`
                      : claimed
                        ? "✓ Claimed Today!"
                        : "⚡ Claim Tokens"}
                </button>

                <button className="btn-secondary">How it works ↗</button>
              </div>
            ) : (
              /* 👇 SHOW THIS IF NOT CONNECTED */
              <div className="animate-slide-up delay-3 flex gap-4">
                <button className="btn-primary" onClick={handleConnectWallet}>
                  🔌 Connect Wallet to Start
                </button>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div
            className="animate-fade-in delay-3"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FaucetVisual />
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      {/* CTA BANNER */}
      {address && (
        <section style={{ padding: "80px 48px" }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <div
              style={{
                background: "linear-gradient(135deg, #0D1120 0%, #141929 100%)",
                border: "1px solid rgba(245,197,66,0.15)",
                borderRadius: 24,
                padding: "48px",
                color: "var(--text)",
              }}
            >
              <h2
                className="font-display"
                style={{ fontSize: 28, fontWeight: 800, marginBottom: 24 }}
              >
                Token Management
              </h2>

              {/* Faucet / Claim */}
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ fontWeight: 700, marginBottom: 8 }}>
                  Request Tokens
                </h3>
                <p style={{ marginBottom: 8 }}>
                  Claim {faucetAmount !== null ? faucetAmount : "..."} DRP
                  tokens from the faucet. One claim per 24 hours.
                </p>
                <button
                  className="btn-primary"
                  disabled={cooldown > 0 || isRequesting}
                  onClick={handleClaim}
                >
                  {isRequesting
                    ? "Claiming..."
                    : cooldown > 0
                      ? `Retry in ${formatTime(cooldown)}`
                      : claimed
                        ? "✓ Claimed Today!"
                        : `Request ${faucetAmount ?? "..."} DRP`}
                </button>
              </div>

              {/* Mint Tokens */}
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ fontWeight: 700, marginBottom: 8 }}>
                  Mint Tokens
                </h3>
                <p style={{ marginBottom: 8 }}>
                  Mint new DRP tokens to your wallet. Max 10,000 per
                  transaction.
                </p>
                <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <input
                    type="number"
                    placeholder="Amount to mint"
                    className="input-primary"
                    id="mintAmount"
                  />
                  <button className="btn-primary" onClick={handleMint}>
                    Mint
                  </button>
                </div>
              </div>

              {/* Transfer Tokens */}
              <div style={{ marginBottom: 0 }}>
                <h3 style={{ fontWeight: 700, marginBottom: 8 }}>
                  Transfer Tokens
                </h3>
                <p style={{ marginBottom: 8 }}>
                  Send DRP tokens to another wallet address.
                </p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <input
                    type="text"
                    placeholder="Recipient address (0x...)"
                    className="input-primary"
                    style={{ flex: 2 }}
                    id="transferAddress"
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    className="input-primary"
                    style={{ flex: 1 }}
                    id="transferAmount"
                  />
                  <button className="btn-primary" onClick={handleTransfer}>
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
