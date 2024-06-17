'use client';
import { isEmpty } from 'lodash-es';
import { Check, Terminal, X } from 'lucide-react';
import { forwardRef, useMemo, useRef, useState } from 'react';
import { Case, Default, Switch } from 'react-if';
import TinderCard from 'react-tinder-card';
import { v4 as uuid } from 'uuid';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

type Direction = 'left' | 'right' | 'up' | 'down';

type API = {
  /**
   * Programmatically trigger a swipe of the card in one of the valid directions `'left'`, `'right'`, `'up'` and `'down'`. This function, `swipe`, can be called on a reference of the TinderCard instance. Check the [example](https://github.com/3DJakob/react-tinder-card-demo/blob/master/src/examples/Advanced.js) code for more details on how to use this.
   *
   * @param dir The direction in which the card should be swiped. One of: `'left'`, `'right'`, `'up'` and `'down'`.
   */
  swipe(dir?: Direction): Promise<void>;

  /**
   * Restore swiped-card state. Use this function if you want to undo a swiped-card (e.g. you have a back button that shows last swiped card or you have a reset button. The promise is resolved once the card is returned
   */
  restoreCard(): Promise<void>;
};

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
  const [currentKols, setCurrentKols] = useState<ExtendedCharacterCardInfo[]>(
    kols.map((kol) => ({
      ...kol,
      processingStatus: 'pending',
      finalStatus: 'pending'
    }))
  );

  const firstCharacterCardRef = useRef<API>(null);
  const secondCharacterCardRef = useRef<API>(null);

  const handleSwipeRequirementFulfilled = (id: string) => {
    // console.log('hi');
    // setCurrentKols((prev) => {
    //   const [swipedCard, ...rest] = prev;
    //   const updatedSwipedCard: ExtendedCharacterCardInfo = {
    //     ...swipedCard,
    //     processingStatus: 'approving',
    //     finalStatus: 'pending'
    //   };
    //   return [updatedSwipedCard, ...rest];
    // });
  };

  const handleSwipeRequirementUnfulfilled = (id: string) => {
    // console.log('swipe requirement unfulfilled', id);
  };

  const [firstCard, secondCard] = useMemo(() => {
    const validKols = currentKols.filter(
      (kol) => kol.finalStatus === 'pending'
    );

    const defaultFirstCard: ExtendedCharacterCardInfo = {
      ...validKols[0]
    };

    const defaultSecondCard: ExtendedCharacterCardInfo = {
      ...validKols[1]
    };

    return [defaultFirstCard, defaultSecondCard];
  }, [currentKols]);

  const canSwipe = !isEmpty(firstCard) && !isEmpty(secondCard);

  // console.log(
  //   currentKols.map((kol) => {
  //     return {
  //       name: kol.name,
  //       finalStatus: kol.finalStatus
  //     };
  //   })
  // );

  const manualTriggerRef = useRef<boolean>(false);

  const handleSwipe = (id: string) => {
    // firstCharacterCardRef.current?.restoreCard();
    // secondCharacterCardRef.current?.restoreCard();
    const isFirstCard = firstCard.id === id;

    if (manualTriggerRef.current) {
      manualTriggerRef.current = false;

      //Here we should update the currentKols array for previous both sets the swiped card after few seconds delay
      setTimeout(() => {
        // Whichever being called here is the one being rejected, coz it is being called manually
        // Update opposite card to be approved, current card to be rejected

        if (isFirstCard) {
          setCurrentKols((prev) => {
            //Find array index of the swiped card
            const rejectedIndex = prev.findIndex((kol) => kol.id === id);
            const approvedIndex = prev.findIndex(
              (kol) => kol.id === secondCard.id
            );

            prev[rejectedIndex].processingStatus = 'rejecting';
            prev[rejectedIndex].finalStatus = 'rejected';
            prev[approvedIndex].processingStatus = 'approving';
            prev[approvedIndex].finalStatus = 'approved';

            return [...prev];
          });
        } else {
          setCurrentKols((prev) => {
            //Find array index of the swiped card
            const rejectedIndex = prev.findIndex((kol) => kol.id === id);
            const approvedIndex = prev.findIndex(
              (kol) => kol.id === firstCard.id
            );

            prev[rejectedIndex].processingStatus = 'rejecting';
            prev[rejectedIndex].finalStatus = 'rejected';
            prev[approvedIndex].processingStatus = 'approving';
            prev[approvedIndex].finalStatus = 'approved';

            return [...prev];
          });
        }
      }, 1000);

      return;
    }

    manualTriggerRef.current = true;
    if (isFirstCard) {
      secondCharacterCardRef.current?.swipe('right');
    } else {
      firstCharacterCardRef.current?.swipe('left');
    }
  };

  const undoSwipe = () => {
    firstCharacterCardRef.current?.restoreCard();
    secondCharacterCardRef.current?.restoreCard();
  };

  return (
    <>
      <div className="flex h-[70vh] flex-col justify-center">
        <div className="flex w-full justify-center gap-6">
          <Switch>
            <Case condition={!canSwipe}>
              <Alert className="max-w-[400px] self-center">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>
                  No more cards to swipe! Please check back later.
                </AlertDescription>
              </Alert>
            </Case>
            <Default>
              <SingleCard
                key={'first-card'}
                ref={firstCharacterCardRef}
                swipingCharacterCard={firstCard}
                onSwipeRequirementFulfilled={handleSwipeRequirementFulfilled}
                onSwipeRequirementUnfulfilled={
                  handleSwipeRequirementUnfulfilled
                }
                onSwipe={handleSwipe}
              />
              <SingleCard
                key={'second-card'}
                ref={secondCharacterCardRef}
                swipingCharacterCard={secondCard}
                onSwipeRequirementFulfilled={handleSwipeRequirementFulfilled}
                onSwipeRequirementUnfulfilled={
                  handleSwipeRequirementUnfulfilled
                }
                onSwipe={handleSwipe}
              />
            </Default>
          </Switch>
        </div>
      </div>
      <div>
        {/* <Button disabled={!canSwipe} onClick={() => undoSwipe()}>
          Undo swipe!
        </Button> */}
      </div>
    </>
  );
}

type SingleCardProps = {
  swipingCharacterCard: ExtendedCharacterCardInfo;
  onSwipeRequirementFulfilled: (id: string) => void;
  onSwipeRequirementUnfulfilled: (id: string) => void;
  onSwipe: (id: string) => void;
};

const SingleCard = forwardRef<API, SingleCardProps>(
  (
    {
      swipingCharacterCard,
      onSwipeRequirementFulfilled,
      onSwipeRequirementUnfulfilled,
      onSwipe
    },
    ref
  ) => {
    return (
      <div className="h-[315px] w-full max-w-[275px] rounded-xl border-4 p-1">
        <div className="cursor-grab" key={swipingCharacterCard.name}>
          <TinderCard
            swipeRequirementType="position"
            ref={ref}
            className="absolute"
            swipeThreshold={300}
            onSwipeRequirementFulfilled={(dir) =>
              onSwipeRequirementFulfilled(swipingCharacterCard.id)
            }
            onSwipeRequirementUnfulfilled={() =>
              onSwipeRequirementUnfulfilled(swipingCharacterCard.id)
            }
            onSwipe={(dir) => onSwipe(swipingCharacterCard.id)}
          >
            <div
              style={{
                backgroundImage: 'url(' + swipingCharacterCard.url + ')'
              }}
              className="relative h-[300px] w-[80vw] max-w-[260px] rounded-lg bg-cover bg-center shadow-lg"
            >
              <Switch>
                <Case
                  condition={
                    swipingCharacterCard.processingStatus === 'approving'
                  }
                >
                  <Check className="absolute right-2 top-2 h-10 w-10 rounded-full bg-green-500 p-1" />
                </Case>
                <Case
                  condition={
                    swipingCharacterCard.processingStatus === 'rejecting'
                  }
                >
                  <X className="absolute right-2 top-2 h-10 w-10 rounded-full bg-red-500 p-1" />
                </Case>
              </Switch>

              <h3 className="select-none p-1">{swipingCharacterCard.name}</h3>
            </div>
          </TinderCard>
        </div>
      </div>
    );
  }
);
