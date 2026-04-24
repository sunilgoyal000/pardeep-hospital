export default function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`animate-pulse bg-slate-200 rounded-lg ${className}`}
      style={{
        backgroundImage: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite linear",
        ...style
      }}
    />
  );
}
