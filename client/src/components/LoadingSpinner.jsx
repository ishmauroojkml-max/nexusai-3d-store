import { motion } from 'framer-motion';

export default function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizes = { sm: 'w-8 h-8', md: 'w-16 h-16', lg: 'w-24 h-24' };
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <div className={`${sizes[size]} relative`}>
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: '3px solid transparent', borderTopColor: '#00d4ff', borderRightColor: '#9f7aea' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-2 rounded-full"
          style={{ border: '2px solid transparent', borderTopColor: '#f687b3', borderLeftColor: '#9f7aea' }}
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      {text && <p className="text-white/50 text-sm animate-pulse">{text}</p>}
    </div>
  );
}
