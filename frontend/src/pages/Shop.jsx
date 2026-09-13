import { useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Reveal, MaskedLine } from "../components/Reveal";
import { useCart } from "../context/CartContext";

const PRODUCTS = [
  {
    id: "emblem-tee",
    title: "United Pluralism Emblem Tee",
    price: 25.0,
    category: "Apparel",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop",
    desc: "Soft organic cotton tee bearing the community emblem.",
  },
  {
    id: "futurum-mug",
    title: "Coniuncti ad Futurum Ceramic Mug",
    price: 18.0,
    category: "Drinkware",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=1200&auto=format&fit=crop",
    desc: "A stoneware mug for slow mornings and shared tables.",
  },
  {
    id: "seven-lights-tote",
    title: "Seven Lights Canvas Tote Bag",
    price: 22.0,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1200&auto=format&fit=crop",
    desc: "Heavyweight canvas tote honoring the seven lights of Shalaria.",
  },
  {
    id: "reflections-journal",
    title: "Reflections Journal",
    price: 16.0,
    category: "Stationery",
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=1200&auto=format&fit=crop",
    desc: "A lay-flat journal for reflection, memory, and living understanding.",
  },
];

const CATEGORIES = ["All", "Apparel", "Drinkware", "Accessories", "Stationery"];

const Shop = () => {
  const [category, setCategory] = useState("All");
  const { add } = useCart();
  const products = category === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === category);

  const addToCart = (p) => {
    add(p);
    toast.success(`${p.title} added to your cart.`);
  };

  return (
    <div data-testid="shop-page">
      <section className="relative bg-navy-950 grain overflow-hidden">
        <div className="absolute -top-32 right-1/3 h-96 w-96 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-20 lg:pt-44 lg:pb-24">
          <MaskedLine delay={0.1}>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-light">The Shop</p>
          </MaskedLine>
          <h1 className="mt-5 font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white max-w-3xl leading-[1.05]">
            <MaskedLine delay={0.25}>Objects for</MaskedLine>
            <MaskedLine delay={0.37}>
              <span className="italic text-gold-light">a shared life.</span>
            </MaskedLine>
          </h1>
          <Reveal delay={0.55}>
            <p className="mt-7 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-300">
              A first collection of United Pluralism goods. Full order fulfillment is launching soon — add pieces
              to your cart now and it will be waiting when checkout opens.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter products">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  data-testid={`category-${c.toLowerCase()}`}
                  onClick={() => setCategory(c)}
                  className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                    category === c
                      ? "bg-navy text-white shadow"
                      : "bg-white border border-slate-200 text-slate-600 hover:border-gold hover:text-gold"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </Reveal>

          <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4" data-testid="product-grid">
            {products.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.08}>
                <article data-testid={`product-card-${p.id}`} className="group">
                  <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
                    <img
                      src={p.image}
                      alt={p.title}
                      loading="lazy"
                      className="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-navy-950/0 transition-colors duration-300 group-hover:bg-navy-950/10" />
                    <button
                      type="button"
                      data-testid={`add-to-cart-${p.id}`}
                      onClick={() => addToCart(p)}
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-14 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-xs font-semibold text-white shadow-lg hover:bg-navy-800"
                      aria-label={`Add ${p.title} to cart`}
                    >
                      <Plus className="h-3.5 w-3.5" /> Add to Cart
                    </button>
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-serif text-lg font-semibold text-navy leading-snug">{p.title}</h2>
                      <p className="mt-1 text-xs text-slate-500">{p.desc}</p>
                    </div>
                    <p className="font-serif text-lg font-semibold text-gold shrink-0" data-testid={`product-price-${p.id}`}>
                      ${p.price.toFixed(2)}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div
              className="mt-14 rounded-2xl border border-amber-200 bg-gold-pale/60 px-6 py-5 text-sm text-amber-900 text-center"
              data-testid="shop-launch-note"
            >
              Full order fulfillment is launching soon. These first pieces preview the collection — your cart is
              saved on this device and checkout will open here when the storefront goes live.
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default Shop;
