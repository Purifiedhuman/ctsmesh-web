'use client'

import Image from 'next/image'
import { Heart, MessageCircle, Repeat, Send } from 'lucide-react'

const tweets = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
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
    id: 5,
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
    id: 6,
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
    id: 7,
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
    id: 8,
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
    id: 9,
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
    id: 10,
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

export function TweetTimeline() {
  return (
    <div className="max-w-lg mx-auto">
      {tweets.map((tweet) => (
        <div key={tweet.id} className="bg-black shadow-md rounded-lg mb-6">
          <div className="flex items-center p-4">
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
            className="w-full h-auto"
          />
          <div className="p-4">
            <p className="mb-2">{tweet.content}</p>
            <div className="flex justify-between text-gray-500">
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
          </div>
        </div>
      ))}
    </div>
  )
}