import { useCallback } from "react";
import { useTemplateDispatch, useTemplateSelector } from ".."
import { setScale as setGlobalScale, incrementScale as incrementGlobalScale } from ".";

export const useGlobalScale = () => {
    return useTemplateSelector((state) => state.global.scale);
}

export const useGlobalScaleControls = () => {
    const dispatch = useTemplateDispatch();
    const scale = useGlobalScale();
    const setScale = useCallback(
        (value: number) => {
            dispatch(setGlobalScale(value));
        },
        [dispatch],
    );

    const incrementScale = useCallback(
        (value: number) => {
            dispatch(incrementGlobalScale(value));
        },
        [dispatch],
    );

    return { scale, setScale, incrementScale };
}