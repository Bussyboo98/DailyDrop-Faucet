export const DAILYDROP_ABI = [
  // Read functions
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function owner() view returns (address)",
  "function MAX_SUPPLY() view returns (uint256)",
  "function faucetAmount() view returns (uint256)",
  "function cooldown() view returns (uint256)",
  "function claimCount(address) view returns (uint256)",

  // Write functions
  "function transfer(address to, uint256 value) returns (bool)",
  "function approve(address spender, uint256 value) returns (bool)",
  "function transferFrom(address from, address to, uint256 value) returns (bool)",
  "function mint(address to, uint256 amount)",
  "function requestToken()",
  "function lastRequest(address) view returns (uint256)"

] as const;

export default DAILYDROP_ABI;