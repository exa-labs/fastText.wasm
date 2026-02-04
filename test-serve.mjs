#!/usr/bin/env node
/**
 * Quick test script to verify fasttext.wasm can load and serve models.
 * 
 * Usage:
 *   node test-serve.mjs                    # Uses bundled lid.176.ftz
 *   node test-serve.mjs /path/to/model.bin # Uses custom model
 * 
 * This build supports model format versions up to 13 (exa fork with noEos).
 * 
 * Header author: Claude
 */

import { readFile } from "node:fs/promises";
import { FastText } from "./dist/index.mjs";

// FastText model file format constants (from fasttext.cc)
const FASTTEXT_FILEFORMAT_MAGIC = 793712314;
const FASTTEXT_VERSION_SUPPORTED = 13; // exa fork supports up to v13

/**
 * Read model version from binary file header.
 * Format: [magic: int32][version: int32][...rest of model]
 */
function readModelVersion(buffer) {
  const view = new DataView(buffer.buffer || buffer);
  const magic = view.getInt32(0, true); // little-endian
  const version = view.getInt32(4, true);
  return { magic, version, valid: magic === FASTTEXT_FILEFORMAT_MAGIC };
}

async function main() {
  const modelPath = process.argv[2];
  
  console.log("Creating FastText instance...");
  const ft = await FastText.create();
  
  if (modelPath) {
    // Load custom model from file
    console.log(`Loading model from: ${modelPath}`);
    const modelBytes = await readFile(modelPath);
    console.log(`Model size: ${(modelBytes.length / 1024 / 1024).toFixed(2)} MB`);
    
    // Check model version
    const { magic, version, valid } = readModelVersion(modelBytes);
    if (!valid) {
      console.error(`Invalid model file: bad magic number (got ${magic}, expected ${FASTTEXT_FILEFORMAT_MAGIC})`);
      process.exit(1);
    }
    console.log(`Model version: ${version} (this build supports up to v${FASTTEXT_VERSION_SUPPORTED})`);
    if (version > FASTTEXT_VERSION_SUPPORTED) {
      console.error(`Model version ${version} is newer than supported version ${FASTTEXT_VERSION_SUPPORTED}`);
      process.exit(1);
    }
    
    const start = performance.now();
    ft.loadModel(modelBytes);
    const loadTime = performance.now() - start;
    console.log(`Model loaded in ${loadTime.toFixed(1)}ms`);
  } else {
    // Load bundled language detection model
    console.log("Loading bundled lid.176.ftz model...");
    const start = performance.now();
    await ft.loadModel(); // Uses default bundled model
    const loadTime = performance.now() - start;
    console.log(`Model loaded in ${loadTime.toFixed(1)}ms`);
  }
  
  // Test predictions
  const testTexts = [
    "Hello, world! This is a test.",
    "Bonjour le monde! Ceci est un test.",
    "Hola mundo! Esto es una prueba.",
    "这是一个测试文本",
    "This page requires JavaScript to be enabled. Please enable JavaScript and refresh the page.",
    "Access Denied. You don't have permission to access this resource.",
    "Please verify you are human by completing the captcha below.",
  ];
  
  console.log("\n--- Predictions ---\n");
  
  for (const text of testTexts) {
    const start = performance.now();
    const predictions = ft.predict(text, 3, 0.0);
    const inferTime = performance.now() - start;
    
    // Format predictions
    const sorted = Array.from(predictions.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    
    const preview = text.length > 50 ? text.slice(0, 50) + "..." : text;
    console.log(`Text: "${preview}"`);
    console.log(`  Time: ${inferTime.toFixed(2)}ms`);
    for (const [label, score] of sorted) {
      const cleanLabel = label.replace("__label__", "");
      console.log(`  ${cleanLabel}: ${(score * 100).toFixed(1)}%`);
    }
    console.log();
  }
  
  console.log("✓ All predictions completed successfully!");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
