import React, { useState, useEffect } from 'react';
import * as XLSX from "xlsx";
import './App.css';

export default function App() {
  const [products, setProducts] = useState([]);
  const [packs, setPacks] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [packName, setPackName] = useState('');
  const [items, setItems] = useState('');
  const [packPrice, setPackPrice] = useState('');
  const [orderItems, setOrderItems] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showPackModal, setShowPackModal] = useState(false);

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
    setProducts([...products, { id: nextId, name, price, image }]);
    setName('');
    setPrice('');
    setImage('');
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

  const togglePackItem = (name) => {
    const current = items ? items.split(',').map(i => i.trim()) : [];
    if (current.includes(name)) {
      setItems(current.filter(i => i !== name).join(', '));
    } else {
      setItems([...current, name].join(', '));
    }
  };

  const addToOrder = (product) => {
    setOrderItems([...orderItems, product]);
  };

  const addPackToOrder = (pack) => {
    const packItems = pack.items.split(',').map(i => i.trim()).map(name => products.find(p => p.name === name)).filter(Boolean);
    setOrderItems([...orderItems, ...packItems]);
  };

  const clearOrder = () => setOrderItems([]);

  const total = orderItems.reduce((sum, p) => sum + parseFloat(p.price || 0), 0);

  const exportExcel = () => {
    const wb = XLSX.utils.book_new();
    const wsProducts = XLSX.utils.json_to_sheet(products);
    XLSX.utils.book_append_sheet(wb, wsProducts, 'Products');
    const wsPacks = XLSX.utils.json_to_sheet(packs);
    XLSX.utils.book_append_sheet(wb, wsPacks, 'Packs');
    XLSX.writeFile(wb, 'data.xlsx');
  };

  return (
    <div className="app">
      <div className="main">
        <h2>Products</h2>
        <div className="product-list">
          <div className="product-grid">
            {products.map(p => (
              <div key={p.id} className="product-card" onClick={() => addToOrder(p)}>
                {p.image && <img src={p.image} alt={p.name} />}
                <div>{p.name}</div>
                <div>€{p.price}</div>
              </div>
            ))}
          </div>
        </div>
        <button onClick={() => setShowProductModal(true)}>Add Product</button>
        <button onClick={() => setShowPackModal(true)}>Packs</button>

        <div className="packs">
          <h2>Packs</h2>
          <ul>
            {packs.map(p => (
              <li key={p.id}>
                <button onClick={() => addPackToOrder(p)}>
                  {p.name} ({p.items}) - €{p.price}
                </button>
                <button onClick={() => deletePack(p.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
        <button onClick={exportExcel}>Export to Excel</button>
      </div>

      <div className="order">
        <h2>Order</h2>
        <ul>
          {orderItems.map((item, i) => (
            <li key={i} className="order-item">
              <span>{item.name}</span>
              <span>€{item.price}</span>
            </li>
          ))}
        </ul>
        <div style={{ marginTop: 10 }}>Total: €{total.toFixed(2)}</div>
        <button onClick={clearOrder}>Clear Order</button>
      </div>

      {showProductModal && (
        <div className="modal">
          <h3>Add Product</h3>
          <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
          <input placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} />
          <input placeholder="Image URL" value={image} onChange={e => setImage(e.target.value)} />
          <button onClick={addProduct}>Save</button>
          <button onClick={() => setShowProductModal(false)}>Close</button>
        </div>
      )}

      {showPackModal && (
        <div className="modal">
          <h3>Add Pack</h3>
          <input placeholder="Name" value={packName} onChange={e => setPackName(e.target.value)} />
          <div className="pack-items">
            {products.map(p => (
              <label key={p.id}>
                <input
                  type="checkbox"
                  checked={(items.split(',').map(i => i.trim()).includes(p.name))}
                  onChange={() => togglePackItem(p.name)}
                />
                {p.name}
              </label>
            ))}
          </div>
          <input placeholder="Price" value={packPrice} onChange={e => setPackPrice(e.target.value)} />
          <button onClick={addPack}>Save</button>
          <button onClick={() => setShowPackModal(false)}>Close</button>
        </div>
      )}
    </div>
  );
}
