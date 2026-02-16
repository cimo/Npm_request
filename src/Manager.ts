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
        isFormDataConversion = false,
        isFullResponse = false
    ): Promise<T | model.Iresponse<T>> => {
        const isFormData = bodyValue instanceof FormData ? true : false;

        const data: Record<string, unknown> = {};
        let body: string | FormData | null = null;

        if (isFormData) {
            if (isFormDataConversion) {
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
            } else {
                body = bodyValue as FormData;
            }
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
                .then(async (response) => {
                    let result: unknown;

                    if (this.responseInterceptor) {
                        this.responseInterceptor(response);
                    }

                    if (!response.ok) {
                        reject(new Error(`@cimo/request - Manager.ts - fetch() => Request failed with status ${response.status}!`));

                        return;
                    }

                    const contentType = response.headers.get("content-type") as string;

                    if (contentType.includes("application/json")) {
                        result = await response.json();
                    } else {
                        result = await response.text();
                    }

                    if (!isFullResponse) {
                        resolve(result as T);

                        return;
                    } else {
                        const resultFull: model.Iresponse<T> = {
                            data: result as T,
                            status: response.status,
                            ok: response.ok,
                            headers: response.headers,
                            url: response.url,
                            contentType
                        };

                        resolve(resultFull);

                        return;
                    }
                })
                .catch((error: Error) => {
                    reject(error);

                    return;
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

    get<T>(partialUrl: string, config: RequestInit): Promise<T>;
    get<T>(partialUrl: string, config: RequestInit, isFullResponse: true): Promise<model.Iresponse<T>>;
    get<T>(partialUrl: string, config: RequestInit, isFullResponse: boolean = false): Promise<unknown> {
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
                .then(async (response) => {
                    let result: unknown;

                    if (this.responseInterceptor) {
                        this.responseInterceptor(response);
                    }

                    if (!response.ok) {
                        reject(new Error(`@cimo/request - Manager.ts - fetch() => Request failed with status ${response.status}!`));

                        return;
                    }

                    const contentType = response.headers.get("content-type") as string;

                    if (contentType.includes("application/json")) {
                        result = await response.json();
                    } else {
                        result = await response.text();
                    }

                    if (!isFullResponse) {
                        resolve(result as T);

                        return;
                    } else {
                        const resultFull: model.Iresponse<T> = {
                            data: result as T,
                            status: response.status,
                            ok: response.ok,
                            headers: response.headers,
                            url: response.url,
                            contentType
                        };

                        resolve(resultFull);

                        return;
                    }
                })
                .catch((error: Error) => {
                    reject(error);

                    return;
                });
        });
    }

    post<T>(
        partialUrl: string,
        config: RequestInit,
        bodyValue: Record<string, unknown> | FormData | string,
        isFormDataConversion?: boolean
    ): Promise<T>;
    post<T>(
        partialUrl: string,
        config: RequestInit,
        bodyValue: Record<string, unknown> | FormData | string,
        isFormDataConversion: boolean,
        isFullResponse: true
    ): Promise<model.Iresponse<T>>;
    post<T>(
        partialUrl: string,
        config: RequestInit,
        bodyValue: Record<string, unknown> | FormData | string,
        isFormDataConversion: boolean = false,
        isFullResponse: boolean = false
    ): Promise<unknown> {
        return this.send<T>("POST", partialUrl, config, bodyValue, isFormDataConversion, isFullResponse);
    }

    put<T>(
        partialUrl: string,
        config: RequestInit,
        bodyValue: Record<string, unknown> | FormData | string,
        isFormDataConversion?: boolean
    ): Promise<T>;
    put<T>(
        partialUrl: string,
        config: RequestInit,
        bodyValue: Record<string, unknown> | FormData | string,
        isFormDataConversion: boolean,
        isFullResponse: true
    ): Promise<model.Iresponse<T>>;
    put<T>(
        partialUrl: string,
        config: RequestInit,
        bodyValue: Record<string, unknown> | FormData | string,
        isFormDataConversion: boolean = false,
        isFullResponse: boolean = false
    ): Promise<unknown> {
        return this.send<T>("PUT", partialUrl, config, bodyValue, isFormDataConversion, isFullResponse);
    }

    patch<T>(
        partialUrl: string,
        config: RequestInit,
        bodyValue: Record<string, unknown> | FormData | string,
        isFormDataConversion?: boolean
    ): Promise<T>;
    patch<T>(
        partialUrl: string,
        config: RequestInit,
        bodyValue: Record<string, unknown> | FormData | string,
        isFormDataConversion: boolean,
        isFullResponse: true
    ): Promise<model.Iresponse<T>>;
    patch<T>(
        partialUrl: string,
        config: RequestInit,
        bodyValue: Record<string, unknown> | FormData | string,
        isFormDataConversion: boolean = false,
        isFullResponse: boolean = false
    ): Promise<unknown> {
        return this.send<T>("PATCH", partialUrl, config, bodyValue, isFormDataConversion, isFullResponse);
    }

    delete<T>(
        partialUrl: string,
        config: RequestInit,
        bodyValue: Record<string, unknown> | FormData | string,
        isFormDataConversion?: boolean
    ): Promise<T>;
    delete<T>(
        partialUrl: string,
        config: RequestInit,
        bodyValue: Record<string, unknown> | FormData | string,
        isFormDataConversion: boolean,
        isFullResponse: true
    ): Promise<model.Iresponse<T>>;
    delete<T>(
        partialUrl: string,
        config: RequestInit,
        bodyValue: Record<string, unknown> | FormData | string,
        isFormDataConversion: boolean = false,
        isFullResponse: boolean = false
    ): Promise<unknown> {
        return this.send<T>("DELETE", partialUrl, config, bodyValue, isFormDataConversion, isFullResponse);
    }

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
