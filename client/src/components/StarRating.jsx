import { Star } from 'lucide-react';

export default function StarRating({ rating, numReviews, size = 'sm' }) {
  const sizes = { sm: 'w-3.5 h-3.5', md: 'w-5 h-5', lg: 'w-6 h-6' };
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1,2,3,4,5].map(i => (
          <Star
            key={i}
            className={`${sizes[size]} ${i <= Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : i === Math.ceil(rating) && rating % 1 >= 0.5 ? 'text-yellow-400 fill-yellow-400/50' : 'text-white/20'}`}
          />
        ))}
      </div>
      <span className="text-white/60 text-xs">{rating?.toFixed(1)}</span>
      {numReviews !== undefined && <span className="text-white/30 text-xs">({numReviews})</span>}
    </div>
  );
}
