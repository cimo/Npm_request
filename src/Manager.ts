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
        const isFormData = bodyValue instanceof FormData ? true : false;

        if (this.requestInterceptor) {
            config = this.requestInterceptor(config || {});
        }

        return new Promise((resolve, reject) => {
            const fetchConfig = {
                ...config,
                signal: null,
                method: "POST",
                headers: isFormData ? config.headers : { ...config.headers, "Content-Type": "application/json" },
                body: isFormData ? (bodyValue as FormData) : JSON.stringify(bodyValue)
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

    put = <T>(partialUrl: string, config: RequestInit, bodyValue: Record<string, unknown> | FormData): Promise<T> => {
        const isFormData = bodyValue instanceof FormData ? true : false;

        if (this.requestInterceptor) {
            config = this.requestInterceptor(config || {});
        }

        return new Promise((resolve, reject) => {
            const fetchConfig = {
                ...config,
                signal: null,
                method: "PUT",
                headers: isFormData ? config.headers : { ...config.headers, "Content-Type": "application/json" },
                body: isFormData ? (bodyValue as FormData) : JSON.stringify(bodyValue)
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

    delete = <T>(partialUrl: string, config: RequestInit): Promise<T> => {
        if (this.requestInterceptor) {
            config = this.requestInterceptor(config || {});
        }

        return new Promise((resolve, reject) => {
            const fetchConfig = {
                ...config,
                signal: null,
                method: "DELETE",
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

    patch = <T>(partialUrl: string, config: RequestInit, bodyValue: Record<string, unknown> | FormData): Promise<T> => {
        const isFormData = bodyValue instanceof FormData ? true : false;

        if (this.requestInterceptor) {
            config = this.requestInterceptor(config || {});
        }

        return new Promise((resolve, reject) => {
            const fetchConfig = {
                ...config,
                signal: null,
                method: "PATCH",
                headers: isFormData ? config.headers : { ...config.headers, "Content-Type": "application/json" },
                body: isFormData ? (bodyValue as FormData) : JSON.stringify(bodyValue)
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
