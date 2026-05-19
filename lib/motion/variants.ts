import type { Variants } from "framer-motion";

export const cardEntry: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" },
  }),
};

export const optionTap: Variants = {
  idle: { scale: 1 },
  tap: { scale: 0.95, transition: { duration: 0.05 } },
  selected: {
    scale: [0.95, 1.02, 1],
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export const optionFill: Variants = {
  unselected: { width: "0%" },
  selected: {
    width: "100%",
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export const slideTransition: Variants = {
  enter: { x: "100%", opacity: 0 },
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
  exit: {
    x: "-100%",
    opacity: 0,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
};

export const resultEmoji: Variants = {
  hidden: { scale: 0, rotate: -180, opacity: 0 },
  show: {
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 260, damping: 12 },
  },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.4, ease: "easeOut" },
  }),
};

export const progressBar: Variants = {
  initial: { width: "0%" },
  animate: (progress: number) => ({
    width: `${progress}%`,
    transition: { duration: 0.5, ease: "easeOut" },
  }),
};

export const sharePulse: Variants = {
  idle: {
    boxShadow: [
      "0 0 0 0 rgba(255, 107, 157, 0.4)",
      "0 0 0 12px rgba(255, 107, 157, 0)",
    ],
    transition: { duration: 2, repeat: Infinity, ease: "easeOut" },
  },
};
