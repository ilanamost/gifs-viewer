module.exports = {
  lintOnSave: false,
  css: {
    loaderOptions: {
      sass: {
        data: `
          @import "@/styles/colors.scss";
          @import "@/styles/breakpoints.scss";
        `
      }
    }
  }
};
