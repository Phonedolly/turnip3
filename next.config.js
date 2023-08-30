/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['three'],
    images: {
        remotePatterns: [{
            protocol: "https",
            hostname: `${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com`,
            pathname: '/posts/**',
        }],
        dangerouslyAllowSVG: true,
        contentDispositionType: 'attachment',
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    }
}

module.exports = nextConfig
