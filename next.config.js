/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [{
            protocol: "https",
            hostname: "www.intel.com",
            port: '',
            pathname: "/**"
        }, {
            protocol: "https",
            hostname: `${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com`,
            pathname: '/posts/**'
        }]
    }
}

module.exports = nextConfig
