export type Domain = {
    "domain": string,
    "mail_hosting": boolean
    "ssl_enabled": boolean
    "pointers": string[]
}

export type EmailAccount = {
    "username": string
      "email": string
      "quota": number
      "usage": number
      "limit": number
      "sent": number
      "suspended": boolean
}

export type EmailForwarder = {
    alias: string
    email: string
    destinations: string[]

}

export type SuccessResponse<T> = {
    success: true;
    data: T;
}
export type ErrorResponse = {
    success: false;
    error: {
        code: string
        field: string
        message: string
    }
}