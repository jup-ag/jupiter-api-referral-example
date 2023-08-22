import { createJupiterApiClient } from "@jup-ag/api";

const jupiterApiClient = createJupiterApiClient();
// TODO: change to your referral
const referalPubkey = "9cEZ5iWX4N4BTv8Nmyn8RzbkkNpRmJTCUpt8514VX43X";

interface TokenAccount {
  mint: string;
  pubkey: string;
}
async function main() {
  // refer https://referral.jup.ag/api
  const tokenAccounts: TokenAccount[] = await fetch(
    `https://referral.jup.ag/api/referral/${referalPubkey}/token-accounts`
  ).then((res) => res.json());

  const mintToPubkeyMap = new Map(
    tokenAccounts.map((tokenAccount) => [
      tokenAccount.mint,
      tokenAccount.pubkey,
    ])
  );

  // Example swapping SOL for USDC
  // Note: you might need to check if the token account is created
  // feeAccount need to be USDC
  const inputMint = "So11111111111111111111111111111111111111112";
  const outputMint = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
  const quoteResponse = await jupiterApiClient.quoteGet({
    amount: 100000000,
    inputMint,
    outputMint,
    platformFeeBps: mintToPubkeyMap.has(outputMint) ? 10 : 0, // 0.1% // we also check if we have the pubkey
  });

  const { swapTransaction } = await jupiterApiClient.swapPost({
    swapRequest: {
      quoteResponse,
      userPublicKey: "", // your user pubkey
      feeAccount: mintToPubkeyMap.get(outputMint),
    },
  });

  // do the swap
}

main();
