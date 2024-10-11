import {
  Account,
  Aptos,
  AptosConfig,
  Ed25519PrivateKey,
  InputViewFunctionData,
  Network
} from '@aptos-labs/ts-sdk';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

// 0. Setup the client and test accounts
const config = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(config);

const moduleAddress = process.env.NEXT_PUBLIC_MODULE_ADDRESS || '0x63278981c03c45fb270f468a2e157bc32b48f8b0e6e65eaa4c8705c179b5a6f9';
const sponsorPrivateKeyHex =
  process.env.NEXT_PUBLIC_SPONSOR_PRIVATE_KEY_HEX || '0xff023a37ab90d4e45502bc99366f65cc3747a4d77156079862ab9c852872721f';

type VotingDecision = 'alpha' | 'beta';
type SendTransactionArgs = {
  decision: VotingDecision;
  recipient: string;
  reward_address: string;
};
type Props = {
  recipientToQuery?: string;
};
type ReadTransactionArgs = {
  reward_address: string;
};

export default function useAptosTransaction({ recipientToQuery }: Props = {}) {
  const { account, connected, disconnect, wallet, signAndSubmitTransaction } =
    useWallet();
  const [sponsor, setSponsorAddress] = useState<string | null>(null);

  const sendTransactionMutation = useMutation({
    mutationFn: async (args: SendTransactionArgs) => {
      const { decision, recipient,reward_address } = args;
      if (!wallet || !account) {
        throw new Error('Please connect your wallet first.');
      }

      const contractFunction =
        decision === 'alpha' ? 'vote_alpha' : 'vote_beta';
      console.log('\n=== Submitting Transaction ===\n');

      const privateKey = new Ed25519PrivateKey(sponsorPrivateKeyHex);
      let sponsor = Account.fromPrivateKey({ privateKey });
      setSponsorAddress(sponsor.accountAddress.toString());
      const transaction = await aptos.transaction.build.simple({
        sender: sponsor.accountAddress,
        withFeePayer: true,
        data: {
          // All transactions on Aptos are implemented via smart contracts.
          function: `${moduleAddress}::alpha_voting::${contractFunction}`,
          functionArguments: [recipient,reward_address]
        }
      });
      console.log('Built the transaction!');

      // 2. Sign
      console.log('\n=== 2. Signing transaction ===\n');
      const aliceSenderAuthenticator = aptos.transaction.sign({
        signer: sponsor,
        transaction
      });
      const bobSenderAuthenticator = aptos.transaction.signAsFeePayer({
        signer: sponsor,
        transaction
      });
      console.log('\n=== 4. Submitting transaction ===\n');
      const committedTransaction = await aptos.transaction.submit.simple({
        transaction,
        senderAuthenticator: aliceSenderAuthenticator,
        feePayerAuthenticator: bobSenderAuthenticator
      });
      console.log('Submitted transaction hash:', committedTransaction.hash);
      // 5. Wait for results
      console.log('\n=== 5. Waiting for result of transaction ===\n');
      const executedTransaction = await aptos.waitForTransaction({
        transactionHash: committedTransaction.hash
      });
      console.log('Transaction successful!', executedTransaction);
    }
  });

  const readTransactionMutation = useMutation({
    mutationFn: async ({ reward_address }: ReadTransactionArgs) => {
      if (!wallet || !account) {
        throw new Error('Please connect your wallet first.');
      }

      const payload: InputViewFunctionData = {
        function: `${moduleAddress}::alpha_voting::view_reward`,
        functionArguments: [reward_address]
      };

      return aptos.view({ payload });
    }
  });

  return {
    account,
    sendTransactionMutation,
    readTransactionMutation,
    sponsor
  };
}
