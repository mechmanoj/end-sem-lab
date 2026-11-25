import React from 'react';
export default function FoodCard({ food, onEdit, onDelete, busy }) {
  return <div className="card">
    <h2>🍽️ {food.name}</h2><p>Category: {food.category}</p><h3>₹{food.price}</h3>
    <button disabled={busy} onClick={() => onEdit(food)}>Edit</button>
    <button disabled={busy} className="delete" onClick={() => onDelete(food.id)}>Delete</button>
  </div>;
}
