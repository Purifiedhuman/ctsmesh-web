'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useAptosTransaction from '@/hooks/useAptosTransaction';

import { AlertCircle, CheckCircle } from 'lucide-react';

export default function AptosTransactionButton() {
  const {
    account,
    recipientState: [recipient, setRecipient],
    sendTransactionMutation
  } = useAptosTransaction();

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
            onClick={() =>
              sendTransactionMutation.mutate({ decision: 'alpha' })
            }
            disabled={sendTransactionMutation.isPending}
            className="w-full"
          >
            {sendTransactionMutation.isPending
              ? 'Sending...'
              : 'Send Transaction'}
          </Button>
          {/* <Button
            onClick={readTransaction}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'reading...' : 'Read Transaction'}
          </Button> */}
        </div>
      </>

      {sendTransactionMutation.isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {sendTransactionMutation.error.message}
          </AlertDescription>
        </Alert>
      )}
      {sendTransactionMutation.isSuccess && (
        <Alert variant="default" className="border-green-500 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-700">Success</AlertTitle>
          <AlertDescription className="text-green-600">
            {JSON.stringify(sendTransactionMutation.data)}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
