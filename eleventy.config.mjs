import htmlmin from "html-minifier-terser";

export default function (eleventyConfig) {

  eleventyConfig.setServerOptions({
    host: process.env.ELEVENTY_HOST || "localhost"
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
  eleventyConfig.addPassthroughCopy("src/sitemap.xml");
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy("src/.htaccess");
  eleventyConfig.addPassthroughCopy({ "src/kontakt/challenge.php": "kontakt/challenge.php" });
  eleventyConfig.addPassthroughCopy({ "src/kontakt/senden.php":    "kontakt/senden.php"    });
  eleventyConfig.addPassthroughCopy("src/config/*"); // aufpassen wenn .html datei dazukommt
  eleventyConfig.addPassthroughCopy("src/mail/*");
  eleventyConfig.addPassthroughCopy("src/phpmailer/*");  // aufpassen wenn .html datei dazukommt

  eleventyConfig.addWatchTarget("src/assets/css/");
  eleventyConfig.addWatchTarget("src/assets/js/");
  

  
  return {
    dir: {
      input: "src",          // Eleventy verarbeitet src/
      output: "_site",
      includes: "_includes", // relativ zu input
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
}