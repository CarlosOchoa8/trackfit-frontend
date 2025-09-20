export const socialVariants = {
    hover: {
        scale: 1.2,
        rotate: 5,
        transition: { duration: 0.3 }
    }
};

export const contactVariants = {
    initial: { opacity: 0, height: 0 },
    expanded: {
        opacity: 1,
        height: "auto",
        transition: { duration: 0.4, ease: "easeInOut" }
    },
    collapsed: {
        opacity: 0,
        height: 0,
        transition: { duration: 0.3, ease: "easeInOut" }
    }
};
