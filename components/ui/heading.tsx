interface HeadingProps {
  title: string;
  description: string;
}

export const Heading: React.FC<HeadingProps> = ({ title, description }) => {
  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight text-yellow-400 drop-shadow-[0_0_10px_rgba(255,215,0,0.7)]">{title}</h2>
      <p className="text-sm text-muted-foreground text-yellow-200">{description}</p>
    </div>
  );
};
