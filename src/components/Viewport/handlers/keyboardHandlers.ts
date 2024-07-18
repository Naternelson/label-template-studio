import {  useCallback, useState } from 'react';

type useKeyListenersParams = {
    disabled: boolean; 
}

export const useKeyListeners = (params: useKeyListenersParams) => {
    const [panning, setPanning] = useState(false)
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!params.disabled && e.key === ' ') {
            setPanning(true);
        }
    }, [params.disabled])

    const handleKeyUp = useCallback((e: KeyboardEvent) => {
        if (e.key === ' ') {
            setPanning(false);
        }
    }, [])

    const attachListeners = useCallback(() => {
        document.addEventListener('keydown', handleKeyDown)
        document.addEventListener('keyup', handleKeyUp)
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.removeEventListener('keyup', handleKeyUp)
        }
    }, [handleKeyDown, handleKeyUp])

    return { attachListeners, panning }
}
