# VerbocCafe POS

This repository contains two examples of a simple point-of-sale system that store data in an Excel file:

1. **Flask Web App** (`app.py`)
2. **React Native Mobile App** (`App.js`)

Both versions allow you to manage products and combo packs (packs).

## Flask version

The Flask application provides a web interface running on `localhost:5000`.

### Setup
```bash
pip install -r requirements.txt
python app.py
```

The application creates `data.xlsx` on first run and stores products and packs there.

## React Native version

The React Native app (created with Expo) stores the same data in `data.xlsx` inside the app's document directory using the `xlsx` and `react-native-fs` libraries.

### Setup
```bash
npm install
npm run start
```
Then follow the instructions from Expo to run the app on a simulator or device.

