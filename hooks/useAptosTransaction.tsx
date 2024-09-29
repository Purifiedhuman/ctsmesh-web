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

const moduleAddress = process.env.NEXT_PUBLIC_MODULE_ADDRESS || '';
const sponsorPrivateKeyHex =
  process.env.NEXT_PUBLIC_SPONSOR_PRIVATE_KEY_HEX || '';

type VotingDecision = 'alpha' | 'beta';
type SendTransactionArgs = {
  decision: VotingDecision;
};

export default function useAptosTransaction() {
  const { account, connected, disconnect, wallet, signAndSubmitTransaction } =
    useWallet();
  const [recipient, setRecipient] = useState('');
  const [sponsor, setSponsorAddress] = useState<string | null>(null);

  const sendTransactionMutation = useMutation({
    mutationFn: async (args: SendTransactionArgs) => {
      if (!wallet || !account) {
        throw new Error('Please connect your wallet first.');
      }

      const contractFunction =
        args.decision === 'alpha' ? 'vote_alpha' : 'vote_beta';
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
          functionArguments: [recipient]
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

  const readTransactionQuery = useQuery({
    queryKey: ['readTransaction'],
    queryFn: async () => {
      if (!wallet || !account) {
        throw new Error('Please connect your wallet first.');
      }

      const payload: InputViewFunctionData = {
        function: `${moduleAddress}::alpha_voting::view_alpha_votes`,
        functionArguments: [recipient]
      };

      return aptos.view({ payload });
    },
    enabled: !!recipient
  });

  return {
    account,
    sendTransactionMutation,
    readTransactionQuery,
    recipientState: [recipient, setRecipient] as const,
    sponsor
  };
}
