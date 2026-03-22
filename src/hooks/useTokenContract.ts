// useTokenContract.ts
import { useMemo } from "react";
import { Contract, ethers } from "ethers";
import { DAILYDROP_ABI } from '../ABI/faucet';
import useRunners from "./useRunner"; 

export const useTokenContract = (withSigner = false) => {
  const { readOnlyProvider, signer } = useRunners();

  return useMemo(() => {
    const address = import.meta.env.VITE_TOKEN_CONTRACT_ADDRESS;

    if (!address) return null;

    if (withSigner) {
      if (!signer) return null;
      return new Contract(address, DAILYDROP_ABI, signer);
    }

    if (!readOnlyProvider) return null;
    return new Contract(address, DAILYDROP_ABI, readOnlyProvider);
  }, [readOnlyProvider, signer, withSigner]);
};