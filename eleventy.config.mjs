export default function(eleventyConfig) {

    eleventyConfig.setServerOptions({
    host: "0.0.0.0"
  });
eleventyConfig.addPassthroughCopy({ "css": "css" });
eleventyConfig.addPassthroughCopy({ "js": "js" });
eleventyConfig.addPassthroughCopy({ "images": "images" });
eleventyConfig.addPassthroughCopy({ "files": "files" });
eleventyConfig.addPassthroughCopy("assets");

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes"
    }
  };
};