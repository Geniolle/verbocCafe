import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system';
import XLSX from 'xlsx';

const DATA_FILE = FileSystem.documentDirectory + 'data.xlsx';

export default function App() {
  const [products, setProducts] = useState([]);
  const [packs, setPacks] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const exists = await FileSystem.getInfoAsync(DATA_FILE);
      if (!exists.exists) {
        const wb = XLSX.utils.book_new();
        const wsProducts = XLSX.utils.json_to_sheet([]);
        XLSX.utils.book_append_sheet(wb, wsProducts, 'Products');
        const wsPacks = XLSX.utils.json_to_sheet([]);
        XLSX.utils.book_append_sheet(wb, wsPacks, 'Packs');
        const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
        await FileSystem.writeAsStringAsync(DATA_FILE, wbout, { encoding: FileSystem.EncodingType.Base64 });
        setProducts([]);
        setPacks([]);
      } else {
        const b64 = await FileSystem.readAsStringAsync(DATA_FILE, { encoding: FileSystem.EncodingType.Base64 });
        const wb = XLSX.read(b64, { type: 'base64' });
        const wsProducts = wb.Sheets['Products'];
        const wsPacks = wb.Sheets['Packs'];
        setProducts(XLSX.utils.sheet_to_json(wsProducts) || []);
        setPacks(XLSX.utils.sheet_to_json(wsPacks) || []);
      }
    } catch (err) {
      console.error('Failed to load data', err);
    }
  }

  async function saveData(newProducts, newPacks) {
    const wb = XLSX.utils.book_new();
    const wsProducts = XLSX.utils.json_to_sheet(newProducts);
    const wsPacks = XLSX.utils.json_to_sheet(newPacks);
    XLSX.utils.book_append_sheet(wb, wsProducts, 'Products');
    XLSX.utils.book_append_sheet(wb, wsPacks, 'Packs');
    const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
    await FileSystem.writeAsStringAsync(DATA_FILE, wbout, { encoding: FileSystem.EncodingType.Base64 });
  }

  async function addProduct() {
    const nextId = products.reduce((max, p) => Math.max(max, p.id || 0), 0) + 1;
    const newProducts = [...products, { id: nextId, name, price }];
    setProducts(newProducts);
    setName('');
    setPrice('');
    await saveData(newProducts, packs);
  }

  async function deleteProduct(id) {
    const newProducts = products.filter(p => p.id !== id);
    setProducts(newProducts);
    await saveData(newProducts, packs);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Products</Text>
      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text>{item.name} - {item.price}</Text>
            <Button title="Delete" onPress={() => deleteProduct(item.id)} />
          </View>
        )}
      />
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button title="Add Product" onPress={addProduct} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 40
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginVertical: 5
  }
});
