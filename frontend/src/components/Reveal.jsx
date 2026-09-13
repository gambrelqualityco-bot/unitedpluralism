import { motion } from "framer-motion";

export const Reveal = ({ children, delay = 0, y = 32, className }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-70px" }}
    transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

export const MaskedLine = ({ children, delay = 0, className }) => (
  <span className={`block overflow-hidden ${className || ""}`}>
    <motion.span
      className="block"
      initial={{ y: "115%" }}
      animate={{ y: 0 }}
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.span>
  </span>
);

export const PageHero = ({ image, children }) => (
  <section className="relative overflow-hidden bg-navy-950 grain">
    <div className="absolute inset-0" aria-hidden="true">
      <motion.img
        src={image}
        alt=""
        initial={{ scale: 1.12, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-navy-950/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/30 to-navy-950/55" />
    </div>
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-20 lg:pt-52 lg:pb-28">
      {children}
    </div>
  </section>
);
