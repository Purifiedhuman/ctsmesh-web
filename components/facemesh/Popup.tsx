import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import Image from 'next/image';

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  rewardText: string;
}

export const Popup: React.FC<PopupProps> = ({ isOpen, onClose, rewardText }) => {
  const [isBoxOpen, setIsBoxOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsBoxOpen(false);
      const timer = setTimeout(() => {
        setIsBoxOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-transparent border-none shadow-none">
        <div className="relative flex flex-col items-center justify-center">
          {/* Main Container */}
          <div className="relative w-64 h-64">
            {/* Background Gradient */}
            <motion.div
              className="absolute inset-0 rounded-lg overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: isBoxOpen ? 1 : 0 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400" />
            </motion.div>

            {/* Box Opening Animation Container */}
            <div className="absolute inset-0" style={{ perspective: '1000px' }}>
              {/* Top Flap */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-1/2 bg-yellow-400 origin-bottom"
                initial={{ rotateX: 0, opacity: 1 }}
                animate={{ 
                  rotateX: isBoxOpen ? -180 : 0,
                  opacity: isBoxOpen ? 0 : 1 
                }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
              />
              
              {/* Bottom Flap */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1/2 bg-yellow-500 origin-top"
                initial={{ rotateX: 0, opacity: 1 }}
                animate={{ 
                  rotateX: isBoxOpen ? 180 : 0,
                  opacity: isBoxOpen ? 0 : 1 
                }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
              />
              
              {/* Left Flap */}
              <motion.div
                className="absolute top-0 left-0 bottom-0 w-1/2 bg-yellow-300 origin-right"
                initial={{ rotateY: 0, opacity: 1 }}
                animate={{ 
                  rotateY: isBoxOpen ? -180 : 0,
                  opacity: isBoxOpen ? 0 : 1 
                }}
                transition={{ duration: 0.5 }}
                style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
              />
              
              {/* Right Flap */}
              <motion.div
                className="absolute top-0 right-0 bottom-0 w-1/2 bg-yellow-300 origin-left"
                initial={{ rotateY: 0, opacity: 1 }}
                animate={{ 
                  rotateY: isBoxOpen ? 180 : 0,
                  opacity: isBoxOpen ? 0 : 1 
                }}
                transition={{ duration: 0.5 }}
                style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
              />
            </div>

            {/* Central Image Container - Always on top */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center z-10"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                y: isBoxOpen ? -10 : 0 // Slight bounce up when box opens
              }}
              transition={{ 
                delay: isBoxOpen ? 0.7 : 0,
                duration: 0.5,
                type: "spring",
                stiffness: 200
              }}
            >
              <div className="w-20 h-20 relative">
                <Image
                  src="/static/passion.png"
                  alt="Gift Box"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>

            {/* Sparkles - On top of everything */}
            <motion.div
              className="absolute inset-0 pointer-events-none z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: isBoxOpen ? 1 : 0 }}
              transition={{ delay: 1 }}
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    x: Math.random() * 200 - 100,
                    y: Math.random() * 200 - 100,
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: Math.random() * 1,
                  }}
                />
              ))}
            </motion.div>
          </div>

          {/* Reward Text */}
          <motion.div
            className="mt-6 text-center z-30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isBoxOpen ? 1 : 0, y: isBoxOpen ? 0 : 20 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <p className="text-xl font-bold text-white">{rewardText}</p>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};