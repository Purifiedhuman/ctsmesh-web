'use client';
import { useState } from 'react';
import { v4 as uuid } from 'uuid';

import useAptosTransaction from '@/hooks/useAptosTransaction';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/scss';
import { Button } from '../ui/button';
import { toast } from '../ui/use-toast.ts';
import EffectTinder from './effect-tinder.js';
import './effect-tinder.scss';
import './facemesh.scss';

type CharacterCardInfo = {
  id: string;
  name: string;
  url: string;
};

const kols: CharacterCardInfo[] = [
  {
    id: uuid(),
    name: 'Angela Nikolau',
    url: '/static/kol_images/AngelaNikolau.jpg'
  },
  {
    id: uuid(),
    name: 'Ash Crypto',
    url: '/static/kol_images/AshCrypto.jpg'
  },
  {
    id: uuid(),
    name: 'Crypto Jack',
    url: '/static/kol_images/CryptoJack.jpg'
  },
  {
    id: uuid(),
    name: 'Crypto Kaduna',
    url: '/static/kol_images/CryptoKaduna.jpg'
  },
  {
    id: uuid(),
    name: 'Elon Musk',
    url: '/static/kol_images/ElonMusk.jpg'
  },
  {
    id: uuid(),
    name: 'Irene Zhao',
    url: '/static/kol_images/IreneZhao.jpg'
  },
  {
    id: uuid(),
    name: 'Laura Shin',
    url: '/static/kol_images/laurashin.jpg'
  },
  {
    id: uuid(),
    name: 'Lukeloo',
    url: '/static/kol_images/lukeloo.apt.jpg'
  },
  {
    id: uuid(),
    name: 'Ryan Wyatt',
    url: '/static/kol_images/RyanWyatt.jpg'
  },
  {
    id: uuid(),
    name: 'Slapp Jakke',
    url: '/static/kol_images/Slappjakke.eth.jpg'
  },
  {
    id: uuid(),
    name: 'Vitalik',
    url: '/static/kol_images/vitalik.eth.jpg'
  }
];

type OngoingStatus = 'pending' | 'approving' | 'rejecting';
type Status = 'pending' | 'approved' | 'rejected';

type ExtendedCharacterCardInfo = CharacterCardInfo & {
  processingStatus: OngoingStatus;
  finalStatus: Status;
};

export default function FaceMesh() {
  const { sendTransactionMutation } = useAptosTransaction();
  const [currentKols, setCurrentKols] = useState<ExtendedCharacterCardInfo[]>(
    kols.map((kol) => ({
      ...kol,
      processingStatus: 'pending',
      finalStatus: 'pending'
    }))
  );

  const handleSwipe = async (swiper: any, direction: 'left' | 'right') => {
    try {
      switch (direction) {
        case 'left':
          await sendTransactionMutation.mutateAsync({ decision: 'beta' });
          break;
        case 'right':
          await sendTransactionMutation.mutateAsync({ decision: 'alpha' });
          break;
      }
    } catch (error) {
      toast({
        title: `Error while sending transaction ${error}}`
      });
    }
  };

  return (
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
              <div>There are no more recommendations</div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-4">
        <Button
          onClick={() => {
            handleSwipe(null, 'left');
          }}
          className="swiper-tinder-button swiper-tinder-button-no"
        >
          Beta
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
          onClick={() => {
            handleSwipe(null, 'right');
          }}
          className="swiper-tinder-button swiper-tinder-button-yes"
        >
          Alpha
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
    </div>
  );
}
