import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cart";
import { formatINR } from "@/lib/currency";
import { ShoppingCart, X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "wouter";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeFromCart, updateDays, totalPrice, clearCart } = useCart();

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l border-border z-[70] flex flex-col shadow-2xl"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-500/25 flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-orange-400" />
                </div>
                <div>
                  <h2 className="text-foreground font-black text-lg">Rental Cart</h2>
                  <p className="text-foreground/40 text-xs">{items.length} {items.length === 1 ? "item" : "items"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-xs text-foreground/30 hover:text-red-400 transition-colors font-medium px-2 py-1 rounded-lg hover:bg-red-500/10"
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center text-foreground/50 hover:text-foreground transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              <AnimatePresence>
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center h-64 text-center"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-muted/40 border border-border flex items-center justify-center mb-4">
                      <ShoppingBag className="w-7 h-7 text-foreground/20" />
                    </div>
                    <p className="text-foreground/40 font-semibold mb-1">Your cart is empty</p>
                    <p className="text-foreground/20 text-sm">Add tools from the browse page</p>
                    <button
                      onClick={onClose}
                      className="mt-5 px-5 py-2 rounded-full bg-orange-500/15 border border-orange-500/25 text-orange-400 text-sm font-semibold hover:bg-orange-500/25 transition-all"
                    >
                      Browse Tools
                    </button>
                  </motion.div>
                ) : (
                  items.map(item => (
                    <motion.div
                      key={item.tool.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex gap-3 p-3 rounded-2xl bg-muted/40 border border-border hover:border-border transition-all"
                    >
                      {/* Tool image */}
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                        <img src={item.tool.imageUrl} alt={item.tool.name} className="w-full h-full object-cover" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-orange-400 text-[10px] font-bold uppercase tracking-widest mb-0.5 capitalize">
                          {item.tool.category.replace("-", " ")}
                        </p>
                        <h4 className="text-foreground font-semibold text-sm line-clamp-1 mb-2">{item.tool.name}</h4>

                        {/* Days picker */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateDays(item.tool.id, item.days - 1)}
                              className="w-6 h-6 rounded-full bg-muted/60 hover:bg-muted flex items-center justify-center text-foreground/60 hover:text-foreground transition-all"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-foreground font-bold text-sm w-6 text-center">{item.days}</span>
                            <button
                              onClick={() => updateDays(item.tool.id, item.days + 1)}
                              className="w-6 h-6 rounded-full bg-muted/60 hover:bg-muted flex items-center justify-center text-foreground/60 hover:text-foreground transition-all"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <span className="text-foreground/30 text-xs">day{item.days > 1 ? "s" : ""}</span>
                          </div>
                          <span className="text-orange-400 font-extrabold text-sm">
                            {formatINR(item.tool.pricePerDay * item.days)}
                          </span>
                        </div>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(item.tool.id)}
                        className="shrink-0 w-7 h-7 rounded-full bg-muted/40 hover:bg-red-500/15 flex items-center justify-center text-foreground/20 hover:text-red-400 transition-all self-start mt-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-border space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-foreground/50 text-sm font-medium">Total estimate</span>
                  <span className="text-foreground font-black text-xl">{formatINR(totalPrice)}</span>
                </div>
                <p className="text-foreground/20 text-xs">Final price confirmed at checkout. Includes insurance.</p>
                <Link href="/dashboard/renter" onClick={onClose}>
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="w-full h-12 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-foreground font-bold text-sm shadow-lg shadow-orange-500/25 transition-all"
                  >
                    Proceed to Checkout
                  </motion.button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
