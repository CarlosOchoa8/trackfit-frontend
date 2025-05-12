// animations.js
// Variantes de animación para el botón de calcular rendimiento

export const buttonVariants = {
  hidden: { 
    opacity: 0,
    y: 20,
    scale: 0.9
  },
  visible: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
      duration: 0.6
    }
  }
};

export const iconAnimation = {
  initial: { rotate: -10 },
  animate: { rotate: 0 },
  transition: { delay: 0.3, duration: 0.4, type: "spring" }
};

export const buttonTapAnimation = {
  scale: 0.98
};

export const spinnerAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.2 }
};

export const resultsVariants = {
  hidden: { 
    opacity: 0,
    y: 10,
    height: 0
  },
  visible: { 
    opacity: 1,
    y: 0,
    height: "auto",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
      duration: 0.5
    }
  }
};