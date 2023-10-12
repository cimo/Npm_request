export interface IrequestInterceptor {
    (config: RequestInit): RequestInit;
}

export interface IresponseInterceptor {
    (response: Response): void;
}
