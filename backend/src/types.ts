
export type BaseContext = {
    Bindings: {
        SUPABASE_URL: string
        SUPABASE_ANON_KEY: string
    }
    Variables: {
        user: {
            id: string
            email: string
            user_metadata: {
                username: string
            }
        }
        token: string
    }
}


export type StorageContext = {
    Bindings: {
        SUPABASE_URL: string
        SUPABASE_ANON_KEY: string
        R2_ACCESS_KEY: string
        R2_SECRET_KEY: string
        R2_ACCOUNT_ID: string
    }
    Variables: BaseContext['Variables']
}