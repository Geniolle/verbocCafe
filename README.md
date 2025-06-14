# VerbocCafe POS

This repository contains two ways to manage products and packs using an Excel workbook:

1. **Flask Web App** (`app.py`)
2. **Vite React Web App** (`src/`)

## Flask version

The Flask application provides a web interface running on `localhost:5000`.

### Setup
```bash
pip install -r requirements.txt
python app.py
```
The application creates `data.xlsx` on first run and stores products and packs there.

## React version

The React app uses Vite and stores the data in `localStorage`. It displays products in a modern grid UI. Selecting items or packs adds them to an order summary showing the running total. You can export the current data to an Excel file at any time.

To add products, enter a name, price and optional image URL. Packs reference products by name (comma separated).

### Setup
```bash
npm install
npm run dev
```
Then open the printed local URL in your browser.
