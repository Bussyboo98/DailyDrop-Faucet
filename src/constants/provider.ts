// provider.ts for read-only provider
import { JsonRpcProvider } from "ethers";

export const jsonRpcProvider = new JsonRpcProvider(
  import.meta.env.VITE_ROOTSTOCK_TESTNET_RPC_URL
);