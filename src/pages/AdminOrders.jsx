import React, { useEffect, useState } from 'react';

export default function AdminOrders(){
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(()=>{
    const load = async ()=>{
      try{
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/purchase-order`);
        const data = await res.json();
        if(!res.ok) throw new Error(data.error || 'Failed to load orders');
        setOrders(data.orders || data);
      }catch(err){
        console.error(err);
        setError(err.message || 'Failed to load');
      }finally{ setLoading(false); }
    };
    load();
  },[]);

  if(loading) return <p>Loading orders...</p>;
  if(error) return <p style={{color:'red'}}>{error}</p>;

  return (
    <div style={{padding:20}}>
      <h2>All Purchase Orders</h2>
      <table style={{width:'100%', borderCollapse:'collapse'}}>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Email</th>
            <th>Items</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o=> (
            <tr key={o._id} style={{borderTop:'1px solid #ddd'}}>
              <td>{o._id}</td>
              <td>{o.customerName}</td>
              <td>{o.email}</td>
              <td>{o.items?.length || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
