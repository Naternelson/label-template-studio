import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";

export type TransformContainerProps = {
    width: string;
    height: string;
    scale: number;
    buffer?: number | string;
}
export const TransformContainer = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const clientRef = useRef<HTMLDivElement>(null);
}




type SetPositionCB = (prev: {x: number, y: number}) => {x: number, y: number}
type SetPositionParam = {x: number, y: number} | SetPositionCB;
type SetPosition = (pos: SetPositionParam) => void;


export type TransformContextType = {
    setPosition: SetPosition;
}

const useBufferSize = (buffer: number | string) => {
    const bufferSize = useMemo(() => {
        const el = document.createElement('div');
        el.style.width = typeof buffer === 'string' ? buffer : `${buffer}px`;
        el.style.height = "1px"
        el.style.visibility = 'hidden';
        document.body.appendChild(el);
        const size = el.getBoundingClientRect();
        document.body.removeChild(el);
        return size.width
    },[buffer]);
    return bufferSize;
}

const useClientDims = (params: {width: string, height: string, scale: number}) =>{
    const {width, height, scale} = params;
    return useMemo(() => {  
        const el = document.createElement('div');
        el.style.width = `calc(${width} * ${scale})`;
        el.style.height = `calc(${height} * ${scale})`;
        el.style.visibility = 'hidden';
        document.body.appendChild(el);
        const size = el.getBoundingClientRect();
        document.body.removeChild(el);
        return {
            width: size.width,
            height: size.height
        }
    },[width, height, scale]);
}

const useParentDims = (parentRef: React.RefObject<HTMLDivElement>) => {
    const [width, setWidth] = useState(0)
    const [height, setHeight] = useState(0)
    useEffect(() => {
        // Create a resize observer
        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                const {width, height} = entry.contentRect;
                setWidth(width);
                setHeight(height);
            }
        });
        // Observe the parent element
        if(parentRef.current){
            resizeObserver.observe(parentRef.current);
        }
        return () => {
            resizeObserver.disconnect();
        }
},[parentRef])

    return {width, height}
}


const useSetPosition = (clientRef: React.RefObject<HTMLDivElement>) =>{
    return useCallback((pos: SetPositionParam) =>{
        const el = clientRef.current;
        if(!el) return;
        let position: {x: number, y: number};
        if(typeof pos === 'function'){
            const currentTop = el.style.top || '0px';
            const currentLeft = el.style.left || '0px';

            position = pos({x: parseInt(currentLeft), y: parseInt(currentTop)});
        } else {
            position = pos;
        }
        el.style.top = `${position.y}px`;
        el.style.left = `${position.x}px`;

    },[clientRef])
}

const useMaxWidth = (clientDims: {width: number, height: number}, bufferSize: number) => {
    return useMemo(() => {
        return clientDims.width + bufferSize * 2;
    },[clientDims, bufferSize])
}
const useMaxHeight = (clientDims: {width: number, height: number}, bufferSize: number) => {
    return useMemo(() => {
        return clientDims.height + bufferSize * 2;
    },[clientDims, bufferSize])
}



export const TransformContext = createContext<TransformContextType>({} as TransformContextType)