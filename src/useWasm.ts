import { useEffect, useState } from 'react';
import * as AllAsBind from 'as-bind';
const AsBind = AllAsBind as any
console.log(AsBind)
type WasmState = {
    loaded: true;
    instance: any;
    error: any;
} | {
    loaded: false;
    instance: null;
    error: any;
};

export const useWasm = (fileName: string, imports?: any): WasmState => {
    const [state, setState] = useState<WasmState>({
        loaded: false,
        instance: null,
        error: null,
    });
    useEffect(() => {
        const abortController = new AbortController();
        const fetchWasm = async () => {
            try {
                const wasm = await fetch(
                    fileName,
                    { signal: abortController.signal }
                );
                if (!wasm.ok) {
                    throw new Error(`Failed to fetch resource ${fileName}.`);
                }
                const instance = await AsBind.instantiate(wasm, imports);
                if (!abortController.signal.aborted) {
                    setState({ instance, loaded: true, error: null });
                }
            } catch (e) {
                if (!abortController.signal.aborted) {
                    setState(prev => ({ ...prev, error: e }));
                }
            }
        }
        fetchWasm();
        return function cleanup() {
            abortController.abort();
        };
    }, [fileName, imports]);
    return state;
}