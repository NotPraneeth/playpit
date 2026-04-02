import { S3Client } from '@aws-sdk/client-s3'

export const getS3 = (env: {
    R2_ACCESS_KEY: string
    R2_SECRET_KEY: string
    R2_ACCOUNT_ID: string
}) => {
    return new S3Client({
        region: 'auto',
        endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
            accessKeyId: env.R2_ACCESS_KEY,
            secretAccessKey: env.R2_SECRET_KEY,
        },
    })
}