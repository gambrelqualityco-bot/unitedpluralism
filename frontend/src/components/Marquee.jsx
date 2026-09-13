const ITEMS = [
  "Inherent Human Dignity",
  "Freedom of Conscience",
  "Mutual Care",
  "Living Understanding",
  "Stewardship of the Earth",
  "Compassion over Cruelty",
  "Justice over Indifference",
  "Coniuncti ad futurum",
];

const Marquee = () => {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="relative overflow-hidden border-y border-slate-200 bg-white py-5" data-testid="values-marquee" aria-hidden="true">
      <div className="marquee-track flex w-max items-center">
        {row.map((item, i) => (
          <span key={i} className="flex items-center shrink-0">
            <span className="font-serif text-xl sm:text-2xl italic text-navy/80 px-6">{item}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
