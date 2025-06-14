import React, { useState, useEffect } from 'react';
import * as XLSX from "xlsx";

export default function App() {
  const [products, setProducts] = useState([]);
  const [packs, setPacks] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [packName, setPackName] = useState('');
  const [items, setItems] = useState('');
  const [packPrice, setPackPrice] = useState('');

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('posData')) || { products: [], packs: [] };
    setProducts(data.products);
    setPacks(data.packs);
  }, []);

  useEffect(() => {
    localStorage.setItem('posData', JSON.stringify({ products, packs }));
  }, [products, packs]);

  const addProduct = () => {
    const nextId = products.reduce((m, p) => Math.max(m, p.id || 0), 0) + 1;
    setProducts([...products, { id: nextId, name, price }]);
    setName('');
    setPrice('');
  };

  const deleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const addPack = () => {
    const nextId = packs.reduce((m, p) => Math.max(m, p.id || 0), 0) + 1;
    setPacks([...packs, { id: nextId, name: packName, items, price: packPrice }]);
    setPackName('');
    setItems('');
    setPackPrice('');
  };

  const deletePack = (id) => {
    setPacks(packs.filter(p => p.id !== id));
  };

  const exportExcel = () => {
    const wb = XLSX.utils.book_new();
    const wsProducts = XLSX.utils.json_to_sheet(products);
    XLSX.utils.book_append_sheet(wb, wsProducts, 'Products');
    const wsPacks = XLSX.utils.json_to_sheet(packs);
    XLSX.utils.book_append_sheet(wb, wsPacks, 'Packs');
    XLSX.writeFile(wb, 'data.xlsx');
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Products</h1>
      <ul>
        {products.map(p => (
          <li key={p.id}>
            {p.name} - {p.price}
            <button onClick={() => deleteProduct(p.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} />
      <button onClick={addProduct}>Add Product</button>

      <h1>Packs</h1>
      <ul>
        {packs.map(p => (
          <li key={p.id}>
            {p.name} - {p.items} - {p.price}
            <button onClick={() => deletePack(p.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <input placeholder="Name" value={packName} onChange={e => setPackName(e.target.value)} />
      <input placeholder="Items" value={items} onChange={e => setItems(e.target.value)} />
      <input placeholder="Price" value={packPrice} onChange={e => setPackPrice(e.target.value)} />
      <button onClick={addPack}>Add Pack</button>

      <div style={{ marginTop: 20 }}>
        <button onClick={exportExcel}>Export to Excel</button>
      </div>
    </div>
  );
}
