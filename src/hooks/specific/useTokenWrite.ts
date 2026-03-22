import { useAppKitAccount } from "@reown/appkit/react";
import { useTokenContract } from "../useTokenContract"; 
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { ErrorDecoder } from "ethers-decode-error";
import { ethers } from "ethers";

const errorDecoder = ErrorDecoder.create();

export const useTokenWrite = () => {
  const tokenContract = useTokenContract(true); // true = signer for write
  const { address } = useAppKitAccount();

  const [isRequesting, setIsRequesting] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);

  // Request tokens (claim)
  const requestToken = useCallback(async (): Promise<boolean> => {
    if (!address) {
      toast.error("Wallet not connected!");
      return false;
    }
    if (!tokenContract) {
      toast.error("Token contract not found!");
      return false;
    }

    try {
      setIsRequesting(true);
      const tx = await tokenContract.requestToken();
      const receipt = await tx.wait();
      return receipt.status === 1;
    } catch (error) {
      const decoded = await errorDecoder.decode(error);
      toast.error(decoded.reason || "Transaction failed!");
      return false;
    } finally {
      setIsRequesting(false);
    }
  }, [address, tokenContract]);

  // Mint tokens to an address
  const mint = useCallback(
    async (to: string, amount: number): Promise<boolean> => {
      if (!address) {
        toast.error("Wallet not connected!");
        return false;
      }
      if (!tokenContract) {
        toast.error("Token contract not found!");
        return false;
      }

      try {
        setIsMinting(true);
        const tx = await tokenContract.mint(to, ethers.parseUnits(amount.toString(), 18));
        const receipt = await tx.wait();
        return receipt.status === 1;
      } catch (error) {
        const decoded = await errorDecoder.decode(error);
        toast.error(decoded.reason || "Mint failed!");
        return false;
      } finally {
        setIsMinting(false);
      }
    },
    [address, tokenContract]
  );

  // Transfer tokens
  const transfer = useCallback(
    async (to: string, amount: number): Promise<boolean> => {
      if (!address) {
        toast.error("Wallet not connected!");
        return false;
      }
      if (!tokenContract) {
        toast.error("Token contract not found!");
        return false;
      }

      try {
        setIsTransferring(true);
        const tx = await tokenContract.transfer(to, ethers.parseUnits(amount.toString(), 18));
        const receipt = await tx.wait();
        return receipt.status === 1;
      } catch (error) {
        const decoded = await errorDecoder.decode(error);
        toast.error(decoded.reason || "Transfer failed!");
        return false;
      } finally {
        setIsTransferring(false);
      }
    },
    [address, tokenContract]
  );

  return {
    requestToken,
    mint,
    transfer,
    isRequesting,
    isMinting,
    isTransferring,
  };
};