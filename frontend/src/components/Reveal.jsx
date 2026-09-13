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
