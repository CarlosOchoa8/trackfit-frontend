export const hamburgerAnimations = {
  bar1: {
    initial: { rotate: 0 },
    open: { rotate: 45, transition: { duration: 0.3 } },
  },
  bar2: {
    initial: { opacity: 1 },
    open: { opacity: 0, transition: { duration: 0.3 } },
  },
  bar3: {
    initial: { rotate: 0 },
    open: { rotate: -45, transition: { duration: 0.3 } },
  },
};

export const mobileMenuAnimations = {
  initial: { opacity: 0, x: "-100%" },
  open: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: "-100%", transition: { duration: 0.3 } },
};
