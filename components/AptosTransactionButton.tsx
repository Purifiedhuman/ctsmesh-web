'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useWallet , InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import {
  Account,
  Aptos,
  AptosConfig,
  InputViewFunctionData,
  Network,
} from '@aptos-labs/ts-sdk';

  // 0. Setup the client and test accounts
  const config = new AptosConfig({ network: Network.TESTNET });
  const aptos = new Aptos(config);
  //set Contract Module Address here
  const moduleAddress = '0xa3e68aa8976c1e11e2ff6eaefacf0fe237b90e245146184cc0e1d98296688b84'

export default function AptosTransactionButton() {
  const { account, connected, disconnect, wallet , signAndSubmitTransaction } = useWallet();
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [recipient, setRecipient] = useState('')


  const sendTransaction = async () => {
    if (!wallet || !account) {
      setError("Please connect your wallet first.")
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)
    const transaction:InputTransactionData = {
      data: {
        function:`${moduleAddress}::alpha_voting::vote_alpha`,
        functionArguments:[recipient]
      }
    }
    try {
      const response = await signAndSubmitTransaction(transaction)
      await aptos.waitForTransaction({transactionHash:response.hash});

      console.log("Transaction successful!", response)
      setSuccess(`Transaction sent successfully! Hash: ${response.hash}`)
    } catch (error) {
      console.error("Transaction failed:", error)
      setError("Transaction failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }
  const readTransaction = async () => {
    if (!wallet || !account) {
      setError("Please connect your wallet first.")
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const payload:InputViewFunctionData = {
        function:`${moduleAddress}::alpha_voting::view_alpha_votes`,
        functionArguments:[recipient]
    }
      const total_votes = (await aptos.view({payload}))[0];
      console.log(total_votes);
      setSuccess(`Total votes : ${total_votes}`)
    } catch (error) {
      console.error("Transaction failed:", error)
      setError("Transaction failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }
  

  return (
    <div className="flex flex-col items-center gap-4 p-6 max-w-md mx-auto">
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
            <Button onClick={sendTransaction} disabled={isLoading} className="w-full">
              {isLoading ? "Sending..." : "Send Transaction"}
            </Button>
            <Button onClick={readTransaction} disabled={isLoading} className="w-full">
              {isLoading ? "reading..." : "Read Transaction"}
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
          <AlertDescription className="text-green-600">{success}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}