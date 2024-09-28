'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  useWallet,
  InputTransactionData
} from '@aptos-labs/wallet-adapter-react';
import {
  Account,
  Aptos,
  AptosConfig,
  InputViewFunctionData,
  Network,
  Ed25519PrivateKey,
  Deserializer,
  SimpleTransaction
} from '@aptos-labs/ts-sdk';

  // 0. Setup the client and test accounts
  const config = new AptosConfig({ network: Network.TESTNET });
  const aptos = new Aptos(config);

  const moduleAddress = process.env.NEXT_PUBLIC_MODULE_ADDRESS || '';
  const sponsorPrivateKeyHex = process.env.NEXT_PUBLIC_SPONSOR_PRIVATE_KEY_HEX || '';

export default function AptosTransactionButton() {
  const { account, connected, disconnect, wallet , signAndSubmitTransaction } = useWallet();
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [recipient, setRecipient] = useState('')
  const [sponsor, setSponsorAddress] = useState<string | null>(null);

  const sendTransaction = async () => {
    if (!wallet || !account) {
      setError('Please connect your wallet first.');
      return;
    }
    console.log("\n=== Submitting Transaction ===\n");
    try {
      const privateKey = new Ed25519PrivateKey(sponsorPrivateKeyHex);
      let sponsor = Account.fromPrivateKey({privateKey});
      setSponsorAddress(sponsor.accountAddress.toString());
      const transaction = await aptos.transaction.build.simple({
        sender: sponsor.accountAddress,
        withFeePayer: true,
        data: {
            // All transactions on Aptos are implemented via smart contracts.
            function:`${moduleAddress}::alpha_voting::vote_alpha`,
            functionArguments: [recipient],
        },
      });
      console.log("Built the transaction!")
 
      // 2. Sign
      console.log("\n=== 2. Signing transaction ===\n");
      const aliceSenderAuthenticator = aptos.transaction.sign({
        signer: sponsor,
        transaction,
      });
      const bobSenderAuthenticator = aptos.transaction.signAsFeePayer({
          signer: sponsor,
          transaction
      })
      console.log("\n=== 4. Submitting transaction ===\n");
      const committedTransaction = await aptos.transaction.submit.simple({
          transaction,
          senderAuthenticator: aliceSenderAuthenticator,
          feePayerAuthenticator: bobSenderAuthenticator,
      });
      console.log("Submitted transaction hash:", committedTransaction.hash);
      // 5. Wait for results
      console.log("\n=== 5. Waiting for result of transaction ===\n");
      const executedTransaction = await aptos.waitForTransaction({ transactionHash: committedTransaction.hash });
      console.log("Transaction successful!", executedTransaction)
      setSuccess(`Transaction sent successfully! Hash: ${executedTransaction.hash}`)
    } catch (error) {
      console.error('Transaction failed:', error);
      setError('Transaction failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const readTransaction = async () => {
    if (!wallet || !account) {
      setError('Please connect your wallet first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const payload: InputViewFunctionData = {
        function: `${moduleAddress}::alpha_voting::view_alpha_votes`,
        functionArguments: [recipient]
      };
      const total_votes = (await aptos.view({ payload }))[0];
      console.log(total_votes);
      setSuccess(`Total votes : ${total_votes}`);
    } catch (error) {
      console.error('Transaction failed:', error);
      setError('Transaction failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 p-6">
      <>
        <p className="text-sm">Connected: {account?.address}</p>
        <div className="w-full space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">vote alpha</Label>
            <Input
              id="recipient"
              placeholder="Enter vote alpha"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>
          <Button
            onClick={sendTransaction}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Sending...' : 'Send Transaction'}
          </Button>
          <Button
            onClick={readTransaction}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'reading...' : 'Read Transaction'}
          </Button>
        </div>
      </>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert variant="default" className="border-green-500 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-700">Success</AlertTitle>
          <AlertDescription className="text-green-600">
            {success}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
