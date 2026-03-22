// useTokenRead.ts
import { useAppKitAccount } from "@reown/appkit/react";
import { useTokenContract } from "../useTokenContract";
import { useState, useCallback } from "react";
import { toast } from "react-toastify";

export const useTokenRead = () => {
  const { address } = useAppKitAccount();
  const contract = useTokenContract(); // read-only by default

  const [isLoading, setIsLoading] = useState(false);


  

  //  Get user balance
  const getBalance = useCallback(async () => {
    if (!address) return null;
    if (!contract) {
      toast.error("Token contract not available");
      return null;
    }
    try {
      setIsLoading(true);
      const balance = await contract.balanceOf(address);
      return balance;
    } catch (err) {
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
      return supply;
    } catch (err) {
      toast.error("Error fetching total supply");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [contract]);

  //  Claim cooldown for user
  const getClaimCooldown = useCallback(async () => {
    if (!address) return null;
    if (!contract) {
      toast.error("Token contract not available");
      return null;
    }
    try {
      setIsLoading(true);
        const last = await contract.lastRequest(address);
        const cd = await contract.cooldown();

        const now = Math.floor(Date.now() / 1000);
        return Math.max(Number(last) + Number(cd) - now, 0);
    } catch (err) {
      toast.error("Error fetching claim cooldown");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [address, contract]);

  //  Total claims by user
 const getUserClaims = useCallback(async () => {
  if (!address || !contract) return null;

  try {
    const claims = await contract.claimCount(address);
    return Number(claims);
  } catch (err) {
    toast.error("Error fetching user claims");
    return null;
  }
}, [address, contract]);

  const getFaucetAmount = useCallback(async () => {
    if (!contract) return 0;
    const amount = await contract.faucetAmount(); // your ABI function
    return Number(amount);
  }, [contract]);


  return {
    isLoading,
    getBalance,
    getTotalSupply,
    getClaimCooldown,
    getUserClaims,
    getFaucetAmount
    
  };
};