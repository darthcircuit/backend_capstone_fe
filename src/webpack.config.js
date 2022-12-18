// webpack configuration
module: {
  loaders: [
    {
      test: /\.svg$/,
      exclude: /node_modules/,
      use: {
        loader: "svg-react-loader",
      },
    },
  ];
}
