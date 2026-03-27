import htmlmin from "html-minifier-terser";

export default function (eleventyConfig) {

  eleventyConfig.setServerOptions({
    host: "0.0.0.0"
  });

  eleventyConfig.addTransform("htmlmin", async (content, outputPath) => {
    if (outputPath && outputPath.endsWith(".html")) {
      return await htmlmin.minify(content, {
        collapseWhitespace: true,
        removeComments: true
      });
    }
    return content;
  });

  // Statische Dateien direkt aus src/assets passthrough kopieren
  eleventyConfig.addPassthroughCopy({ "src/assets/css":   "css"    });
  eleventyConfig.addPassthroughCopy({ "src/assets/js":    "js"     });
  eleventyConfig.addPassthroughCopy({ "src/assets/images":"images" });
  eleventyConfig.addPassthroughCopy({ "src/assets/files": "files"  });
  eleventyConfig.addPassthroughCopy({ "src/assets/fonts": "fonts"  });
  eleventyConfig.addPassthroughCopy({ "src/assets/data": "data" });
  eleventyConfig.addPassthroughCopy("sitemap.xml");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("src/kontakt/senden.php");
    eleventyConfig.addPassthroughCopy("src/config/mail_config.php");

  return {
    dir: {
      input: "_includes",    // ← src/ als Eingabe
      output: "_site",
      includes: "_includes", // relativ zu input
      input: "src",          // Eleventy verarbeitet src/
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
}