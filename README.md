# Design Summer School 2025 (DSS2025) Reconstructed Frontend

This repository contains the reconstructed, static client-side frontend project for the Design Summer School 2025. It has been refactored from a scraped Next.js bundle into a clean, separated static project.

## Repository Layout

* **`/app`**: Contains the complete production frontend application. This folder contains everything required for a production deployment:
  * `index.html`: Main HTML entrypoint (uses fully localized asset links).
  * `styles/index.css`: Page styling.
  * `scripts/index.js`: Browser animations, sliders, modal, and toggles.
  * `assets/`: Fully localized asset files (logos, images, icons, and PDFs).
* **`/tooling`**: Reverse-engineering scripts and asset scrapers. These utilities are maintained for future updates and data extraction but are completely omitted from production deployments.
* **`/archive`**: Historical Next.js chunks, scraped raw sheets, and intermediate draft string dumps. These files are kept for reference but are not utilized by the production application.
* **`required-assets.txt`**: A manifest listing all frontend assets, their original remote references, local destination paths, and download status.

## Production Deployment

To deploy the frontend to a production host (e.g. Netlify, Vercel, AWS S3, or Apache/Nginx web servers), you only need to publish the contents of the **`app/`** directory. No other folder (`tooling/` or `archive/`) is needed for deployment.

## Asset Localization

All external assets originally hosted on `https://dss2025.iiitd.edu.in` have been downloaded locally and saved under `app/assets/`. The HTML source files now reference these local assets using relative URLs, removing any remote dependencies.
