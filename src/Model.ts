export type Tresponse<T, F extends boolean> = F extends true ? Iresponse<T> : T;

export interface Iresponse<T> {
    data: T;
    status: number;
    ok: boolean;
    headers: Headers;
    url: string;
    contentType: string;
}

export interface IrequestInterceptor {
    (config: RequestInit): RequestInit;
}

export interface IresponseInterceptor {
    (response: Response): void;
}
