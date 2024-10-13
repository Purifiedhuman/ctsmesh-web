'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Heart, MessageCircle, Repeat, Send } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Tweet {
  id: string
  author: string
  handle: string
  avatar: string
  content: string
  image: string
  likes: number
  comments: number
  retweets: number
}

interface VoteResult {
    0: string  // The vote count
    1: string[]  // Array containing a single Ethereum address
  }
const tweets = [
  {
    id: 'tweet001',
    author: 'ZackXBT',
    handle: '@zackxbt',
    avatar: '/static/tweets/tweet_001.png',
    content: '1/2 I uncovered 11 high confidence wallets tied to @MustStopMurad holding ~',
    image: '/static/tweets/tweet_001.png',
    likes: 2400,
    comments: 37,
    retweets: 128
  },
  {
    id: 'tweet002',
    author: 'Mert|Helius.dev',
    handle: '@0xMert_',
    avatar: '/static/tweets/tweet_002.png',
    content: 'My best advice for making a pitchdeck',
    image: '/static/tweets/tweet_002.png',
    likes: 5600,
    comments: 230,
    retweets: 890
  },
  {
    id: 'tweet003',
    author: 'vitalik.eth',
    handle: '@VitalikButerin',
    avatar: '/static/tweets/tweet_003.png',
    content: 'I have been told that I need to "do less philosophizing and do more ethereum bullposting".',
    image: '/static/tweets/tweet_003.png',
    likes: 102000,
    comments: 8900,
    retweets: 23000
  },
  {
    id: 'tweet004',
    author: 'Decentralised.co',
    handle: '@Decentralisedco',
    avatar: '/static/tweets/tweet_004.png',
    content: 'A framework to classify DePIN networks',
    image: '/static/tweets/tweet_004.png',
    likes: 3200,
    comments: 156,
    retweets: 478
  },
  {
    id: 'tweet005',
    author: 'SuhailKakar',
    handle: '@SuhailKakar',
    avatar: '/static/tweets/tweet_005.png',
    content: 'Da(data availability): explain like im five ',
    image: '/static/tweets/tweet_005.png',
    likes: 8900,
    comments: 567,
    retweets: 2100
  },
  {
    id: 'tweet006',
    author: 'db',
    handle: '@tier10k',
    avatar: '/static/tweets/tweet_006.png',
    content: 'Wow this case get even more insane',
    image: '/static/tweets/tweet_006.png',
    likes: 99,
    comments: 10,
    retweets: 398
  },
  {
    id: 'tweet007',
    author: 'Cheeezzyyyy',
    handle: '@0xCheeezzyyyy',
    avatar: '/static/tweets/tweet_007.png',
    content: 'MegaETH',
    image: '/static/tweets/tweet_007.png',
    likes: 669,
    comments: 90,
    retweets: 500
  },
  {
    id: 'tweet008',
    author: 'Optimism',
    handle: '@Optimism',
    avatar: '/static/tweets/tweet_008.png',
    content: 'Onchain together, benefit together.',
    image: '/static/tweets/tweet_008.png',
    likes: 3982,
    comments: 5000,
    retweets: 7590
  },
  {
    id: 'tweet009',
    author: 'TradWife Capital',
    handle: '@TradWifeCapital',
    avatar: '/static/tweets/tweet_009.png',
    content: 'An in-depth analysis on @brian_armstrong"s new wife. ',
    image: '/static/tweets/tweet_009.png',
    likes: 980,
    comments: 287,
    retweets: 409
  },
  {
    id: 'tweet010',
    author: 'Coingecko',
    handle: '@coingecko',
    avatar: '/static/tweets/tweet_010.png',
    content: 'The #crypto market got me feeling like Moo Deng',
    image: '/static/tweets/tweet_010.png',
    likes: 51000,
    comments: 500,
    retweets: 7865
  }
]
export function TweetsInfo() {
    const [voteResults, setVoteResults] = useState<{ [key: string]: VoteResult | null }>({})
    const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({})
    const [error, setError] = useState<{ [key: string]: string | null }>({})
  
    const fetchAlphaTransactions = async (tweetId: string) => {
      setIsLoading(prev => ({ ...prev, [tweetId]: true }))
      setError(prev => ({ ...prev, [tweetId]: null }))
      const url = 'https://aptos-testnet.nodit.io/v1/view'
      const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'X-API-KEY': 'vAAMdqvrk2b7r7_u09cqqmr7JUukTTUz' // Replace with your actual API key in production
        },
        body: JSON.stringify({
          function: '0x63278981c03c45fb270f468a2e157bc32b48f8b0e6e65eaa4c8705c179b5a6f9::alpha_voting::view_alpha_votes',
          arguments: [tweetId],
          type_arguments: [],
        })
      }
      try {
        const response = await fetch(url, options)
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data: VoteResult = await response.json()
        setVoteResults(prev => ({ ...prev, [tweetId]: data }))

      } catch (err) {
        console.error(`Error fetching transactions for tweet ${tweetId}:`, err)
        setError(prev => ({ ...prev, [tweetId]: 'Failed to fetch vote data' }))
      } finally {
        setIsLoading(prev => ({ ...prev, [tweetId]: false }))
      }
    }
    useEffect(() => {
      tweets.forEach(tweet => fetchAlphaTransactions(tweet.id))
    }, [])
  
    return (
      <div className="max-w-2xl mx-auto">
        {tweets.map((tweet) => (
          <Card key={tweet.id} className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center mb-4">
                <Image
                  src={tweet.avatar}
                  alt={tweet.author}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="ml-3">
                  <p className="font-semibold">{tweet.author}</p>
                  <p className="text-gray-500 text-sm">{tweet.handle}</p>
                </div>
              </div>
              <Image
                src={tweet.image}
                alt="Tweet image"
                width={500}
                height={500}
                className="w-full h-auto mb-4"
              />
              <p className="mb-4">{tweet.content}</p>
              <div className="flex justify-between text-gray-500 mb-4">
                <button className="flex items-center">
                  <Heart className="w-5 h-5 mr-1" />
                  {tweet.likes}
                </button>
                <button className="flex items-center">
                  <MessageCircle className="w-5 h-5 mr-1" />
                  {tweet.comments}
                </button>
                <button className="flex items-center">
                  <Repeat className="w-5 h-5 mr-1" />
                  {tweet.retweets}
                </button>
                <button>
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <div className="bg-gray-100 p-4 rounded-md text-red-400">
                <h3 className="font-semibold mb-2">Alpha Votes</h3>
                {isLoading[tweet.id] && <p>Loading...</p>}
                {error[tweet.id] && <p className="text-red-500">{error[tweet.id]}</p>}
                {voteResults[tweet.id] && (
                  <div>
                    <p>Vote Count: {voteResults[tweet.id]?.[0]}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }