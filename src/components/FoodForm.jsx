import React from 'react';
export default function FoodForm({ food, setFood, onSubmit, editing, busy, onCancel }) {
  return <form onSubmit={onSubmit}>
    <input aria-label="Food name" placeholder="Food Name" value={food.name} onChange={e => setFood({...food,name:e.target.value})} required />
    <input aria-label="Price" type="number" placeholder="Price" value={food.price} onChange={e => setFood({...food,price:e.target.value})} min="1" step="0.01" required />
    <select aria-label="Category" value={food.category} onChange={e => setFood({...food,category:e.target.value})} required>
      <option value="">Select Category</option><option value="Veg">Veg</option><option value="Non-Veg">Non-Veg</option>
    </select>
    <button disabled={busy} type="submit">{editing ? 'Update Food' : 'Add Food'}</button>
    {editing && <button disabled={busy} type="button" onClick={onCancel}>Cancel</button>}
  </form>;
}
