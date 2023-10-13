import * as Interface from "./Interface";

export default class Manager {
    private baseUrl: string;
    private timeout: number;
    private requestInterceptor: Interface.IrequestInterceptor | null;
    private responseInterceptor: Interface.IresponseInterceptor | null;

    constructor(baseUrlValue: string, timeoutValue: number) {
        this.baseUrl = baseUrlValue;
        this.timeout = timeoutValue;
        this.requestInterceptor = null;
        this.responseInterceptor = null;
    }

    setRequestInterceptor = (callback: (config: RequestInit) => RequestInit) => {
        this.requestInterceptor = callback;
    };

    setResponseInterceptor = (callback: (response: Response) => void) => {
        this.responseInterceptor = callback;
    };

    post = <T>(partialUrl: string, config: RequestInit, bodyValue: Record<string, unknown> | FormData): Promise<T> => {
        const isJson = JSON.stringify(bodyValue).length > 2 ? true : false;

        if (this.requestInterceptor) {
            config = this.requestInterceptor(config || {});
        }

        return new Promise((resolve, reject) => {
            const fetchConfig = {
                ...config,
                signal: null,
                method: "POST",
                headers: isJson ? { ...config.headers, "Content-Type": "application/json" } : config.headers,
                body: isJson ? JSON.stringify(bodyValue) : (bodyValue as FormData)
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

    get = <T>(partialUrl: string, config: RequestInit): Promise<T> => {
        if (this.requestInterceptor) {
            config = this.requestInterceptor(config || {});
        }

        return new Promise((resolve, reject) => {
            const fetchConfig = {
                ...config,
                signal: null,
                method: "POST",
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
}
