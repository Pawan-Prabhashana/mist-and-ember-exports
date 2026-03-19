#!/usr/bin/env node
/**
 * Ceylon Roots — Image Optimization Script
 * ----------------------------------------
 * This script scans the /public directory and optimizes all images (JPG, PNG, WebP)
 * by compressing them and optionally generating WebP/AVIF versions.
 *
 * Usage:
 *   node scripts/optimize-images.mjs
 *
 * Dependencies:
 *   npm install sharp ora chalk glob fs-extra
 */

import fs from "fs-extra";
import path from "path";
import sharp from "sharp";
import chalk from "chalk";
import ora from "ora";
import glob from "glob";

const ROOT_DIR = process.cwd();
const INPUT_DIR = path.join(ROOT_DIR, "public");
const OUTPUT_DIR = path.join(ROOT_DIR, "public", "optimized");

const SUPPORTED_FORMATS = [".jpg", ".jpeg", ".png", ".webp"];
const MAX_WIDTH = 1920; // max image width
const QUALITY = 80; // image quality for compression

const spinner = ora("Optimizing images...").start();

/**
 * Optimize a single image and save as optimized versions.
 */
async function optimizeImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!SUPPORTED_FORMATS.includes(ext)) return;

  const relPath = path.relative(INPUT_DIR, filePath);
  const outputBase = path.join(OUTPUT_DIR, relPath.replace(ext, ""));
  await fs.ensureDir(path.dirname(outputBase));

  const image = sharp(filePath);
  const metadata = await image.metadata();
  const width = Math.min(metadata.width, MAX_WIDTH);

  // JPEG/PNG Optimization
  const outputExt = ext === ".png" ? ".png" : ".jpg";
  const optimizedPath = `${outputBase}${outputExt}`;
  await image
    .resize(width)
    .toFormat(ext === ".png" ? "png" : "jpeg", { quality: QUALITY })
    .toFile(optimizedPath);

  // Generate WebP version
  const webpPath = `${outputBase}.webp`;
  await image
    .resize(width)
    .webp({ quality: QUALITY })
    .toFile(webpPath);

  // Generate AVIF version
  const avifPath = `${outputBase}.avif`;
  await image
    .resize(width)
    .avif({ quality: QUALITY })
    .toFile(avifPath);

  spinner.text = `Optimized: ${chalk.green(relPath)}`;
}

/**
 * Run optimization for all images.
 */
async function run() {
  console.log(chalk.cyan.bold("\n🌿 Ceylon Roots – Image Optimization\n"));

  const files = glob.sync(`${INPUT_DIR}/**/*.{jpg,jpeg,png,webp}`, {
    nodir: true,
  });

  if (files.length === 0) {
    spinner.fail("No images found in /public directory.");
    return;
  }

  for (const file of files) {
    try {
      await optimizeImage(file);
    } catch (err) {
      console.error(chalk.red(`❌ Failed to process ${file}:`), err.message);
    }
  }

  spinner.succeed(chalk.green("\n✅ All images optimized successfully!"));
  console.log(
    chalk.gray(
      `\nOptimized images saved to: ${path.relative(ROOT_DIR, OUTPUT_DIR)}`
    )
  );
}

run().catch((err) => {
  spinner.fail(chalk.red("Optimization failed!"));
  console.error(err);
  process.exit(1);
});
