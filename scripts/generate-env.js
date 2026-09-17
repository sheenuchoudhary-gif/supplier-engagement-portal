// Runs only as Netlify's build command. Reads the two Netlify environment
// variables and writes them into env.js, which the browser loads at runtime.
// env.js is never committed; it exists only inside the Netlify build output.
"use strict";

var fs = require("fs");

var url = process.env.SUPABASE_URL || "";
var anonKey = process.env.SUPABASE_ANON_KEY || "";

if (!url || !anonKey) {
  console.warn(
    "generate-env.js: SUPABASE_URL and/or SUPABASE_ANON_KEY are not set. " +
    "Submission writes will fail until both are set as Netlify environment variables."
  );
}

var contents =
  "window.SUPABASE_URL = " + JSON.stringify(url) + ";\n" +
  "window.SUPABASE_ANON_KEY = " + JSON.stringify(anonKey) + ";\n";

fs.writeFileSync("env.js", contents);
console.log("generate-env.js: wrote env.js");
