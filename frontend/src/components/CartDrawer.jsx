import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";

const CartDrawer = () => {
  const { items, open, setOpen, setQty, remove, subtotal } = useCart();

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50" data-testid="cart-drawer" role="dialog" aria-label="Shopping cart">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
              <h2 className="font-serif text-2xl font-semibold text-navy flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-gold" /> Your Cart
              </h2>
              <button
                type="button"
                data-testid="cart-close-button"
                onClick={() => setOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <p data-testid="cart-empty-message" className="text-slate-500 text-sm py-16 text-center">
                  Your cart is empty. Visit the shop to browse the collection.
                </p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <li key={item.id} className="py-4 flex gap-4" data-testid={`cart-item-${item.id}`}>
                      <div className="h-20 w-20 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                        <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-navy truncate">{item.title}</p>
                        <p className="text-sm text-gold font-medium mt-0.5">${item.price.toFixed(2)}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            type="button"
                            data-testid={`cart-decrease-${item.id}`}
                            onClick={() => setQty(item.id, item.qty - 1)}
                            className="h-7 w-7 rounded-full border border-slate-300 flex items-center justify-center hover:border-gold hover:text-gold transition-colors"
                            aria-label={`Decrease quantity of ${item.title}`}
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="text-sm font-medium w-6 text-center" data-testid={`cart-qty-${item.id}`}>{item.qty}</span>
                          <button
                            type="button"
                            data-testid={`cart-increase-${item.id}`}
                            onClick={() => setQty(item.id, item.qty + 1)}
                            className="h-7 w-7 rounded-full border border-slate-300 flex items-center justify-center hover:border-gold hover:text-gold transition-colors"
                            aria-label={`Increase quantity of ${item.title}`}
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            data-testid={`cart-remove-${item.id}`}
                            onClick={() => remove(item.id)}
                            className="ml-auto p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                            aria-label={`Remove ${item.title}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-t border-slate-200 px-6 py-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Subtotal</span>
                <span className="font-serif text-2xl font-semibold text-navy" data-testid="cart-subtotal">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <p className="text-xs leading-relaxed rounded-lg bg-gold-pale text-amber-800 px-4 py-3" data-testid="cart-fulfillment-note">
                Full order fulfillment is launching soon. Your cart is saved on this device, and checkout will
                open here when the storefront goes live.
              </p>
              <button
                type="button"
                data-testid="cart-checkout-button"
                disabled
                className="w-full rounded-full bg-slate-200 text-slate-500 py-3.5 text-sm font-semibold cursor-not-allowed"
              >
                Checkout — Launching Soon
              </button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
