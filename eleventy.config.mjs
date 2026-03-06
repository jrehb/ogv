export default function(eleventyConfig) {
eleventyConfig.addPassthroughCopy({ "css": "css" });
eleventyConfig.addPassthroughCopy({ "js": "js" });
eleventyConfig.addPassthroughCopy({ "images": "images" });
eleventyConfig.addPassthroughCopy({ "files": "files" });

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes"
    }
  };
};