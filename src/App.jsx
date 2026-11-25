import React, { useState, useEffect } from 'react';
import FoodCard from './components/FoodCard.jsx';
import FoodForm from './components/FoodForm.jsx';
import './App.css';
const API = 'http://localhost:3001/foods';
const emptyFood = {name:'',price:'',category:''};
async function request(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`Request failed (${response.status})`);
  return response;
}
export default function App() {
  const [foods,setFoods] = useState([]);
  const [food,setFood] = useState(emptyFood);
  const [editId,setEditId] = useState(null);
  const [error,setError] = useState('');
  const [busy,setBusy] = useState(false);
  const [loading,setLoading] = useState(true);
  // READ
  async function fetchFoods() {
    const response = await request(API);
    setFoods(await response.json());
  }
  useEffect(() => {
    fetchFoods().catch(() => setError('Unable to load menu. Start JSON Server on port 3001 and refresh.')).finally(() => setLoading(false));
  }, []);
  function resetForm() { setFood(emptyFood); setEditId(null); }
  // CREATE and UPDATE
  async function handleSubmit(e) {
    e.preventDefault();
    const foodData = {...food,name:food.name.trim(),price:Number(food.price)};
    if (!foodData.name || !Number.isFinite(foodData.price) || foodData.price < 1 || !['Veg','Non-Veg'].includes(foodData.category)) { setError('Enter valid food details.'); return; }
    setBusy(true); setError('');
    try {
      await request(editId === null ? API : `${API}/${encodeURIComponent(editId)}`, {
        method: editId === null ? 'POST' : 'PUT',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(editId === null ? foodData : {...foodData,id:editId})
      });
      resetForm(); await fetchFoods();
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  }
  function handleEdit(item) { setFood({name:item.name,price:item.price,category:item.category}); setEditId(item.id); }
  // DELETE
  async function handleDelete(id) {
    setBusy(true); setError('');
    try {
      await request(`${API}/${encodeURIComponent(id)}`,{method:'DELETE'});
      if (editId === id) resetForm();
      await fetchFoods();
    } catch(err) { setError(err.message); } finally { setBusy(false); }
  }
  return <div className="container">
    <h1>🍔 Food Delivery Application</h1>
    <FoodForm food={food} setFood={setFood} onSubmit={handleSubmit} editing={editId !== null} busy={busy || loading} onCancel={resetForm}/>
    {error && <p role="alert" className="error">{error}</p>}
    <h2>Food Menu</h2>
    {loading ? <p>Loading menu...</p> : !foods.length && <p>No food items available.</p>}
    <div className="food-list">{foods.map(item => <FoodCard key={item.id} food={item} onEdit={handleEdit} onDelete={handleDelete} busy={busy}/>)}</div>
  </div>;
}
