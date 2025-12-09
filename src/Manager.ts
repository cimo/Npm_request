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
        bodyValue: Record<string, unknown> | FormData,
        conversion = false
    ): Promise<T> => {
        const isFormData = bodyValue instanceof FormData ? true : false;

        const data: Record<string, unknown> = {};
        let body: string | FormData | null = null;

        if (conversion && isFormData) {
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
        } else if (!conversion && isFormData) {
            body = bodyValue as FormData;
        } else if (!isFormData) {
            if (!this.isEncoded) {
                body = JSON.stringify(bodyValue);
            } else {
                const encodedData = window.btoa(encodeURIComponent(JSON.stringify(bodyValue)));

                body = encodedData;
            }
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

    constructor(baseUrlValue: string, timeoutValue = 25000, isEncoded = false) {
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

    post = <T>(partialUrl: string, config: RequestInit, bodyValue: Record<string, unknown> | FormData, conversion = false): Promise<T> => {
        return this.send<T>("POST", partialUrl, config, bodyValue, conversion);
    };

    put = <T>(partialUrl: string, config: RequestInit, bodyValue: Record<string, unknown> | FormData, conversion = false): Promise<T> => {
        return this.send<T>("PUT", partialUrl, config, bodyValue, conversion);
    };

    patch = <T>(partialUrl: string, config: RequestInit, bodyValue: Record<string, unknown> | FormData, conversion = false): Promise<T> => {
        return this.send<T>("PATCH", partialUrl, config, bodyValue, conversion);
    };

    delete = <T>(partialUrl: string, config: RequestInit, bodyValue: Record<string, unknown> | FormData, conversion = false): Promise<T> => {
        return this.send<T>("DELETE", partialUrl, config, bodyValue, conversion);
    };
}
