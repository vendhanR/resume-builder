export const isClearAllMouseEnterAndLeave = {
    initial: { opacity: 0, scale: .6, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 6, y: 20 },
}

export const fadeInFadeOut = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
}

export const scaleInOut = (index) => {
    return {
        initial: { opacity: 0, scale: 0.85 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.85 },
        transition: { delay: index * 0.3, ease: 'easeInOut' }
    }
}
