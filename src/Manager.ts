// Source
import * as model from "./Model.js";

export default class Manager {
    private baseUrl: string;
    private timeout: number;
    private isEncoded: boolean;
    private requestInterceptor: model.IrequestInterceptor | undefined;
    private responseInterceptor: model.IresponseInterceptor | undefined;

    private send = <T>(
        method: string,
        partialUrl: string,
        config: RequestInit,
        bodyValue: Record<string, unknown> | FormData | string,
        isConversion = false
    ): Promise<T> => {
        const isFormData = bodyValue instanceof FormData ? true : false;

        const data: Record<string, unknown> = {};
        let body: string | FormData | null = null;

        if (isFormData && isConversion) {
            const formData = bodyValue as FormData;

            for (const item of formData) {
                data[item[0]] = item[1];
            }

            if (!this.isEncoded) {
                body = JSON.stringify(data);
            } else {
                const encodedData = window.btoa(encodeURIComponent(JSON.stringify(data)));

                body = encodedData;
            }
        } else if (isFormData && !isConversion) {
            body = bodyValue as FormData;
        } else if (!isFormData) {
            if (!this.isEncoded) {
                body = JSON.stringify(bodyValue);
            } else {
                const encodedData = window.btoa(encodeURIComponent(JSON.stringify(bodyValue)));

                body = encodedData;
            }
        } else if (typeof bodyValue === "string") {
            body = bodyValue;
        }

        if (this.requestInterceptor) {
            config = this.requestInterceptor(config || {});
        }

        return new Promise((resolve, reject) => {
            const fetchConfigObject: RequestInit = {
                ...config,
                signal: undefined,
                method: method,
                headers: config.headers,
                body: body
            };

            if (this.timeout > 0) {
                const controller = new AbortController();

                setTimeout(() => {
                    controller.abort();
                }, this.timeout);

                fetchConfigObject.signal = controller.signal;
            }

            fetch(`${this.baseUrl}${partialUrl}`, fetchConfigObject)
                .then((response) => {
                    if (this.responseInterceptor) {
                        this.responseInterceptor(response);
                    }

                    if (!response.ok) {
                        reject(new Error(`@cimo/request - Manager.ts - fetch() => Request failed with status ${response.status}!`));
                    }

                    return response.json();
                })
                .then((response: T) => {
                    resolve(response);
                })
                .catch((error: Error) => {
                    reject(error);
                });
        });
    };

    constructor(baseUrlValue: string, timeoutValue = 0, isEncoded = false) {
        this.baseUrl = baseUrlValue;
        this.timeout = timeoutValue;
        this.isEncoded = isEncoded;
        this.requestInterceptor = undefined;
        this.responseInterceptor = undefined;
    }

    setRequestInterceptor = (callback: (config: RequestInit) => RequestInit): void => {
        this.requestInterceptor = callback;
    };

    setResponseInterceptor = (callback: (response: Response) => void): void => {
        this.responseInterceptor = callback;
    };

    get = <T>(partialUrl: string, config: RequestInit): Promise<T> => {
        if (this.requestInterceptor) {
            config = this.requestInterceptor(config || {});
        }

        return new Promise((resolve, reject) => {
            const fetchConfigObject: RequestInit = {
                ...config,
                signal: undefined,
                method: "GET",
                headers: config.headers
            };

            if (this.timeout > 0) {
                const controller = new AbortController();

                setTimeout(() => {
                    controller.abort();
                }, this.timeout);

                fetchConfigObject.signal = controller.signal;
            }

            fetch(`${this.baseUrl}${partialUrl}`, fetchConfigObject)
                .then((response) => {
                    if (this.responseInterceptor) {
                        this.responseInterceptor(response);
                    }

                    if (!response.ok) {
                        reject(new Error(`@cimo/request - Manager.ts - fetch() => Request failed with status ${response.status}!`));
                    }

                    return response.json();
                })
                .then((response: T) => {
                    resolve(response);
                })
                .catch((error: Error) => {
                    reject(error);
                });
        });
    };

    post = <T>(partialUrl: string, config: RequestInit, bodyValue: Record<string, unknown> | FormData | string, isConversion = false): Promise<T> => {
        return this.send<T>("POST", partialUrl, config, bodyValue, isConversion);
    };

    put = <T>(partialUrl: string, config: RequestInit, bodyValue: Record<string, unknown> | FormData | string, isConversion = false): Promise<T> => {
        return this.send<T>("PUT", partialUrl, config, bodyValue, isConversion);
    };

    patch = <T>(
        partialUrl: string,
        config: RequestInit,
        bodyValue: Record<string, unknown> | FormData | string,
        isConversion = false
    ): Promise<T> => {
        return this.send<T>("PATCH", partialUrl, config, bodyValue, isConversion);
    };

    delete = <T>(
        partialUrl: string,
        config: RequestInit,
        bodyValue: Record<string, unknown> | FormData | string,
        isConversion = false
    ): Promise<T> => {
        return this.send<T>("DELETE", partialUrl, config, bodyValue, isConversion);
    };

    stream = async (
        partialUrl: string,
        config: RequestInit,
        bodyValue: Record<string, unknown> | FormData | string
    ): Promise<ReadableStreamDefaultReader<Uint8Array>> => {
        const fetchConfigObject: RequestInit = {
            ...config,
            method: "POST",
            headers: config.headers,
            body: JSON.stringify(bodyValue)
        };

        const response = await fetch(`${this.baseUrl}${partialUrl}`, fetchConfigObject);

        return response.body!.getReader();
    };
}
