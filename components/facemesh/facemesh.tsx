'use client';
import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import Image from 'next/image';
import useAptosTransaction from '@/hooks/useAptosTransaction';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/scss';
import { Button } from '../ui/button';
import { toast } from '../ui/use-toast.ts';
import EffectTinder from './effect-tinder.js';
import './effect-tinder.scss';
import './facemesh.scss';
import { Popup } from './Popup.tsx';

type CharacterCardInfo = {
  id: string;
  name: string;
  tweet:string;
  url: string;
};

const kols: CharacterCardInfo[] = [
  {
    id: uuid(),
    name: 'ZackXBT',
    tweet:'tweet001',
    url: '/static/tweets/tweet_001.png'
  },
  {
    id: uuid(),
    name: 'Mert',
    tweet:'tweet002',
    url: '/static/tweets/tweet_002.png'
  },
  {
    id: uuid(),
    name: 'vitalik.eth',
    tweet:'tweet003',
    url: '/static/tweets/tweet_003.png'
  },
  {
    id: uuid(),
    name: 'Decentralised.co',
    tweet:'tweet004',
    url: '/static/tweets/tweet_004.png'
  },
  {
    id: uuid(),
    name: 'Suhail Kakar',
    tweet:'tweet005',
    url: '/static/tweets/tweet_005.png'
  },
  {
    id: uuid(),
    name: 'db',
    tweet:'tweet006',
    url: '/static/tweets/tweet_006.png'
  },
  {
    id: uuid(),
    name: 'Cheeezzyyyy',
    tweet:'tweet007',
    url: '/static/tweets/tweet_007.png'
  },
  {
    id: uuid(),
    name: 'Optimism',
    tweet:'tweet008',
    url: '/static/tweets/tweet_008.png'
  },
  {
    id: uuid(),
    name: 'TradWife Capital',
    tweet:'tweet009',
    url: '/static/tweets/tweet_009.png'
  },
  {
    id: uuid(),
    name: 'Coingecko',
    tweet:'tweet010',
    url: '/static/tweets/tweet_010.png'
  }
];

type OngoingStatus = 'pending' | 'approving' | 'rejecting';
type Status = 'pending' | 'approved' | 'rejected';

type ExtendedCharacterCardInfo = CharacterCardInfo & {
  processingStatus: OngoingStatus;
  finalStatus: Status;
};

export default function FaceMesh() {
  const [currentKols, setCurrentKols] = useState<ExtendedCharacterCardInfo[]>(
    kols.map((kol) => ({
      ...kol,
      processingStatus: 'pending',
      finalStatus: 'pending'
    }))
  );
  const { sendTransactionMutation, account, readTransactionMutation } =
    useAptosTransaction();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [rewardAmount, setRewardAmount] = useState<number>(0);
  const [totalReward, setTotalReward] = useState<number>(0);
  const handleSwipe = async (swiper: any, direction: 'left' | 'right') => {
    const activeCard = currentKols[swiper.activeIndex - 1];
    if (!account?.address) {
      toast({
        title: 'Error',
        description: 'Please connect your wallet first.'
      });
      return;
    }
    try {
      switch (direction) {
        case 'left':
          await sendTransactionMutation.mutateAsync({
            decision: 'noise',
            recipient: activeCard.tweet,
            reward_address: account.address
          });
          break;
        case 'right':
          await sendTransactionMutation.mutateAsync({
            decision: 'alpha',
            recipient: activeCard.tweet,
            reward_address: account.address
          });

          break;
      }
      const result = await readTransactionMutation.mutateAsync({
        reward_address: account?.address
      });
      setRewardAmount(Number(result));
      setTotalReward(prevAmount => prevAmount + Number(result));
      console.log(rewardAmount);
      // Show the popup after successful swipe
      setIsPopupOpen(true);
    } catch (error) {
      toast({
        title: `Error while sending transaction ${error}}`
      });
    }
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="mx-3 mb-2 flex items-center self-end rounded-full bg-black bg-opacity-50 px-3 py-1 md:mx-10 md:mb-0">
          <Image
            src="/static/passion.png"
            alt="Reward"
            width={24}
            height={24}
            className="mr-2"
          />
          <span className="font-bold text-white">{totalReward}</span>
        </div>
      </div>
      <div className="flex flex-col">
        <div id="facemesh-root">
          <div className="swiper h-full">
            <Swiper
              className="swiper-wrapper"
              modules={[Autoplay, Navigation, Pagination, EffectTinder]}
              effect="tinder"
              grabCursor={true}
              // @ts-ignore
              onTinderSwipe={handleSwipe}
            >
              {currentKols.map((characterCard) => (
                <SwiperSlide key={characterCard.id}>
                  <div
                    style={{
                      backgroundImage: 'url(' + characterCard.url + ')'
                    }}
                    className="relative h-full rounded-lg bg-cover bg-center shadow-lg"
                  >
                    <h3 className="demo-slide-name">{characterCard.name}</h3>
                  </div>
                </SwiperSlide>
              ))}

              <SwiperSlide className="swiper-slide demo-empty-slide">
                <div>NO MORE RECOMMENDATIONS</div>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>

        <div className="mt-4 flex justify-center gap-4">
          <Button
            // onClick={() => {
            //   handleSwipe(null, 'left');
            // }}
            className="swiper-tinder-button swiper-tinder-button-no"
          >
            <p className="text-sm md:text-lg">Noise</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="48"
              viewBox="0 -960 960 960"
              width="48"
            >
              <path d="m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z" />
            </svg>
          </Button>
          <Button
            // onClick={() => {
            //   handleSwipe(null, 'right');
            // }}
            className="swiper-tinder-button swiper-tinder-button-yes text-green-400"
          >
            <p className="text-sm md:text-lg">Alpha</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="48"
              viewBox="0 -960 960 960"
              width="48"
            >
              <path d="m480-121-41-37q-106-97-175-167.5t-110-126Q113-507 96.5-552T80-643q0-90 60.5-150.5T290-854q57 0 105.5 27t84.5 78q42-54 89-79.5T670-854q89 0 149.5 60.5T880-643q0 46-16.5 91T806-451.5q-41 55.5-110 126T521-158l-41 37Z" />
            </svg>
          </Button>
        </div>
        <Popup
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          rewardText={`You earned ${rewardAmount} chef's kiss!`}
        />
      </div>
    </>
  );
}
