// src/hooks/specific/useDailyDrop.ts
import { useState, useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import { useAppKitAccount } from "@reown/appkit/react";
import { useTokenRead } from "../hooks/specific/useTokenRead"; 
import { useTokenWrite } from "../hooks/specific/useTokenWrite"; 

export const useDailyDrop = () => {
  const { address } = useAppKitAccount();

  // --- Read functions ---
  const {
    getBalance,
    getTotalSupply,
    getUserClaims,
    getClaimCooldown,
    getFaucetAmount, 
  } = useTokenRead();

  // --- Write functions ---
  const { requestToken, mint, transfer } = useTokenWrite();

  // --- State ---
  const [balance, setBalance] = useState<number | null>(null);
  const [totalSupply, setTotalSupply] = useState<number | null>(null);
  const [claims, setClaims] = useState<number | null>(null);
  const [cooldown, setCooldown] = useState<number>(0);
  const [faucetAmount, setFaucetAmount] = useState<number | null>(null);
  const [isClaiming, setIsClaiming] = useState(false);

  // --- Format seconds to hh:mm:ss ---
  const formatTime = useCallback((seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  }, []);

  // --- Fetch all read data ---
  const fetchData = useCallback(async () => {
    if (!address) return;

    try {
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
    } catch (err) {
      console.error("Error fetching DailyDrop data:", err);
    }
  }, [address, getBalance, getTotalSupply, getUserClaims, getClaimCooldown, getFaucetAmount]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Claim function ---
  const claim = useCallback(async () => {
    if (!address) {
      toast.error("Wallet not connected!");
      return false;
    }
    if (cooldown > 0) {
      toast.info("You need to wait for cooldown!");
      return false;
    }

    try {
      setIsClaiming(true);
      const success = await requestToken();
      if (success) {
        toast.success("Claim successful!");
        await fetchData(); // refresh balances & cooldown
        return true;
      } else {
        toast.error("Transaction failed!");
        return false;
      }
    } finally {
      setIsClaiming(false);
    }
  }, [address, cooldown, requestToken, fetchData]);

  return {
    address,
    balance,
    totalSupply,
    claims,
    cooldown,
    faucetAmount, 
    formatTime,
    isClaiming,
    claim,
    mint,
    transfer,
    refresh: fetchData,
  };
};