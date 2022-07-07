// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          "https://backend-ecommerce-desafiom9.vercel.app/api/:path*",
      },
    ];
  },
};
