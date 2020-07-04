module.exports = {
  plugins: [
    'gatsby-plugin-resolve-src',
    'gatsby-plugin-sass',
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/assets/images`,
      },
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'Couch Co-Op Games',
        short_name: 'Couch Co-Op Games',
        start_url: '/',
        icon: './src/assets/images/favicon-384x384.png',
      },
    },
  ],
}
