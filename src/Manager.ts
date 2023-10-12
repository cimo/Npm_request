import * as Interface from "./Interface";

let baseUrl: string;
let timeout: number;
let requestInterceptor: Interface.IrequestInterceptor | null;
let responseInterceptor: Interface.IresponseInterceptor | null;

export const create = (baseUrlValue: string, timeoutValue: number) => {
    baseUrl = baseUrlValue;
    timeout = timeoutValue;
    requestInterceptor = null;
    responseInterceptor = null;
};

export const setRequestInterceptor = (callback: (config: RequestInit) => RequestInit) => {
    requestInterceptor = callback;
};

export const setResponseInterceptor = (callback: (response: Response) => void) => {
    responseInterceptor = callback;
};

export const post = <T>(partialUrl: string, config: RequestInit, bodyValue: Record<string, unknown> | FormData): Promise<T> => {
    const isJson = JSON.stringify(bodyValue).length > 2 ? true : false;

    if (requestInterceptor) {
        config = requestInterceptor(config || {});
    }

    return new Promise((resolve, reject) => {
        const fetchConfig = {
            ...config,
            signal: null,
            method: "POST",
            headers: isJson ? { ...config.headers, "Content-Type": "application/json" } : config.headers,
            body: isJson ? JSON.stringify(bodyValue) : (bodyValue as FormData)
        } as RequestInit;

        if (timeout > 0) {
            const controller = new AbortController();

            setTimeout(() => {
                controller.abort();
            }, timeout);

            fetchConfig.signal = controller.signal;
        }

        fetch(`${baseUrl}${partialUrl}`, fetchConfig)
            .then((response) => {
                if (responseInterceptor) {
                    responseInterceptor(response);
                }

                if (!response.ok) {
                    reject(new Error(`Request failed with status: ${response.status}`));
                }

                return response.json();
            })
            .then((data: T) => {
                resolve(data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const get = <T>(partialUrl: string, config: RequestInit): Promise<T> => {
    if (requestInterceptor) {
        config = requestInterceptor(config || {});
    }

    return new Promise((resolve, reject) => {
        const fetchConfig = {
            ...config,
            signal: null,
            method: "POST",
            headers: config.headers
        } as RequestInit;

        if (timeout > 0) {
            const controller = new AbortController();

            setTimeout(() => {
                controller.abort();
            }, timeout);

            fetchConfig.signal = controller.signal;
        }

        fetch(`${baseUrl}${partialUrl}`, fetchConfig)
            .then((response) => {
                if (responseInterceptor) {
                    responseInterceptor(response);
                }

                if (!response.ok) {
                    reject(new Error(`Request failed with status: ${response.status}`));
                }

                return response.json();
            })
            .then((data: T) => {
                resolve(data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};
