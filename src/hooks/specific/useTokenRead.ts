// useTokenRead.ts
import { useAppKitAccount } from "@reown/appkit/react";
import { useTokenContract } from "../useTokenContract";
import { useState, useCallback } from "react";
import { formatUnits } from "ethers";
import { toast } from "react-toastify";

export const useTokenRead = () => {
  const { address } = useAppKitAccount();
  const contract = useTokenContract(); // read-only by default

  const [isLoading, setIsLoading] = useState(false);

  //  Get token name ─
  const getTokenName = useCallback(async () => {
    if (!contract) return null;
    try {
      return await contract.name();
    } catch {
      return null;
    }
  }, [contract]);

  //  Get token symbol ─
  const getTokenSymbol = useCallback(async () => {
    if (!contract) return null;
    try {
      return await contract.symbol();
    } catch {
      return null;
    }
  }, [contract]);

  //  Get max supply ─
  const getMaxSupply = useCallback(async () => {
    if (!contract) return null;
    try {
      const ms = await contract.MAX_SUPPLY();
      return Number(formatUnits(ms, 18)).toLocaleString();
    } catch {
      return null;
    }
  }, [contract]);

  //  Get user balance ─
  const getBalance = useCallback(async () => {
    if (!address) return null;
    if (!contract) {
      toast.error("Token contract not available");
      return null;
    }
    try {
      setIsLoading(true);
      const balance = await contract.balanceOf(address);
      return Number(formatUnits(balance, 18));
    } catch {
      toast.error("Error fetching balance");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [address, contract]);

  //  Total supply 
  const getTotalSupply = useCallback(async () => {
    if (!contract) {
      toast.error("Token contract not available");
      return null;
    }
    try {
      setIsLoading(true);
      const supply = await contract.totalSupply();
      return Number(formatUnits(supply, 18));
    } catch {
      toast.error("Error fetching total supply");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [contract]);

  //  Claim cooldown remaining for user 
const getClaimCooldown = useCallback(async () => {
  if (!address) return null;
  if (!contract) return null;
  try {
    setIsLoading(true);
    const last = await contract.lastRequest(address);
    const cd   = await contract.cooldown();
    const now  = Math.floor(Date.now() / 1000);

    console.log("last:", Number(last));
    console.log("cd:",   Number(cd));
    console.log("now:",  now);
    console.log("remaining:", Number(last) + Number(cd) - now);

    return Math.max(Number(last) + Number(cd) - now, 0);
  } catch (err: any) {
    console.error("getClaimCooldown error:", err?.message);
    return null;
  } finally {
    setIsLoading(false);
  }
}, [address, contract]);

  //  Cooldown duration (e.g. "24h") ─
  const getCooldownDuration = useCallback(async () => {
    if (!contract) return null;
    try {
      const cd = await contract.cooldown();
      return `${Number(cd) / 3600}h`;
    } catch {
      return null;
    }
  }, [contract]);

  //  Total claims by user ─
  const getUserClaims = useCallback(async () => {
    if (!address || !contract) return null;
    try {
      const claims = await contract.claimCount(address);
      return Number(claims);
    } catch {
      toast.error("Error fetching user claims");
      return null;
    }
  }, [address, contract]);

  //  Faucet amount 
  const getFaucetAmount = useCallback(async () => {
    if (!contract) return null;
    try {
      const amount = await contract.faucetAmount();
      return Number(formatUnits(amount, 18));
    } catch (err: any) {
      console.error("getFaucetAmount failed:", err?.message ?? err);
      return null;
    }
  }, [contract]);

  return {
    isLoading,
    getTokenName,
    getTokenSymbol,
    getMaxSupply,
    getBalance,
    getTotalSupply,
    getClaimCooldown,
    getCooldownDuration,
    getUserClaims,
    getFaucetAmount,
  };
};