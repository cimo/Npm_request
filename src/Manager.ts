// Source
import * as Interface from "./Interface";

export default class Manager {
    private baseUrl: string;
    private timeout: number;
    private requestInterceptor: Interface.IrequestInterceptor | undefined;
    private responseInterceptor: Interface.IresponseInterceptor | undefined;

    constructor(baseUrlValue: string, timeoutValue = 25000) {
        this.baseUrl = baseUrlValue;
        this.timeout = timeoutValue;
        this.requestInterceptor = undefined;
        this.responseInterceptor = undefined;
    }

    setRequestInterceptor = (callback: (config: RequestInit) => RequestInit) => {
        this.requestInterceptor = callback;
    };

    setResponseInterceptor = (callback: (response: Response) => void) => {
        this.responseInterceptor = callback;
    };

    get = <T>(partialUrl: string, config: RequestInit): Promise<T> => {
        if (this.requestInterceptor) {
            config = this.requestInterceptor(config || {});
        }

        return new Promise((resolve, reject) => {
            const fetchConfig = {
                ...config,
                signal: undefined,
                method: "GET",
                headers: config.headers
            } as RequestInit;

            if (this.timeout > 0) {
                const controller = new AbortController();

                setTimeout(() => {
                    controller.abort();
                }, this.timeout);

                fetchConfig.signal = controller.signal;
            }

            fetch(`${this.baseUrl}${partialUrl}`, fetchConfig)
                .then((response) => {
                    if (this.responseInterceptor) {
                        this.responseInterceptor(response);
                    }

                    if (!response.ok) {
                        reject(new Error(`@cimo/request - Manager.ts - fetch() - Error: Request failed with status ${response.status}`));
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

    private send = <T>(
        method: string,
        partialUrl: string,
        config: RequestInit,
        bodyValue: Record<string, unknown> | FormData,
        conversion = false
    ): Promise<T> => {
        const isFormData = bodyValue instanceof FormData ? true : false;

        const data = {};
        let body = {};

        if (conversion && isFormData) {
            const formData = bodyValue as FormData;

            for (const item of formData) {
                data[item[0]] = item[1];
            }

            body = JSON.stringify(data);
        } else if (!conversion && isFormData) {
            body = bodyValue as FormData;
        } else if (!isFormData) {
            body = JSON.stringify(bodyValue);
        }

        if (this.requestInterceptor) {
            config = this.requestInterceptor(config || {});
        }

        return new Promise((resolve, reject) => {
            const fetchConfig = {
                ...config,
                signal: undefined,
                method: method,
                headers: config.headers,
                body: body
            } as unknown as RequestInit;

            if (this.timeout > 0) {
                const controller = new AbortController();

                setTimeout(() => {
                    controller.abort();
                }, this.timeout);

                fetchConfig.signal = controller.signal;
            }

            fetch(`${this.baseUrl}${partialUrl}`, fetchConfig)
                .then((response) => {
                    if (this.responseInterceptor) {
                        this.responseInterceptor(response);
                    }

                    if (!response.ok) {
                        reject(new Error(`@cimo/request - Manager.ts - fetch() - Error: Request failed with status ${response.status}`));
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
}
