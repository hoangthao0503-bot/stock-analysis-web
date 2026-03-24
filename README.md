# Stock Analysis App

A modern stock analysis dashboard built with Next.js, Tailwind CSS, and Recharts.

## Features
- **Dashboard:** Overview of market trends.
- **Stock Details:** Interactive charts and historical data table.
- **Data Import:** Reads CSV files from `public/data/`.

## Setup

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Add Data:**
    - Place your CSV file in `public/data/`.
    - Ensure it has columns: `Date`, `Symbol`, `Open`, `High`, `Low`, `Close`, `Volume`.

3.  **Run Development Server:**
    ```bash
    npm run dev
    ```

4.  **Build for Production:**
    ```bash
    npm run build
    ```
    *Note: If build fails due to SWC/Turbopack errors on Windows, try `npx next build --webpack`.*

## Project Structure
- `src/app`: Page routes.
- `src/components`: UI components (Charts).
- `src/lib`: Data loading logic.
- `public/data`: Data storage.
