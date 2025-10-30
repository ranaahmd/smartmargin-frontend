import React,{useEffect,useState} from 'react'
import axios from 'axios'

export default function IngredientsForm({onSuccess,editItem,onUpdate}) {
  const [form,setForm] = useState({name:"",cost_per_unit:"", unit:""})
  const [message,setMessage]= useState("")
  const API_URL = "http://127.0.0.1:8000/api/ingredients/"
  
  useEffect(()=>{
    if (editItem){
      setForm({
        name: editItem.name,
        cost_per_unit: editItem.cost_per_unit,
        unit: editItem.unit
      })
    } else {
      setForm({name:"",cost_per_unit:"",unit:""})
    }
  },[editItem])
  
  const handleChange =(e) => setForm({...form,[e.target.name]: e.target.value})
  
  const handleSubmit= async(e) =>{
    e.preventDefault()
    try {
      const token = localStorage.getItem("access");
      const headers = { Authorization: `Bearer ${token}` };
      if(editItem){
        const res = await axios.put(`${API_URL}${editItem.id}/`, form, { headers });
        setMessage("Successfully updated")
        onUpdate(res.data)
      } else {
        const res = await axios.post(API_URL, form, { headers });
        setMessage("Successfully added")
        onSuccess(res.data)
      }
      setForm({name:"",cost_per_unit:"",unit:""})
    } catch {
      setMessage("Failed to save ingredient")
    }
  }
  
  return (
    <div className='ingredientsform'>
      <h3>{editItem ? "Edit ingredient:" : "Add new ingredient"}</h3>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder='Name' value={form.name} onChange={handleChange}/>
        <input name="cost_per_unit" placeholder='Cost per unit' value={form.cost_per_unit} onChange={handleChange}/>
        <input name='unit' placeholder='Unit' value={form.unit} onChange={handleChange}/>
        <button type='submit'>{editItem ? "Update" : "Add"}</button>
      </form>
    </div>
  )
}
