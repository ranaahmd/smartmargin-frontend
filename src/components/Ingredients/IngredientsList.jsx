import React,{useEffect,useState} from "react"
import axios from "axios"
import IngredientsForm from "./IngredientsForm"
import "../../App.css";
export default function () {
  const [ingredients,setIngredients] = useState([])
  const [error,setError] = useState("")
  const [editItem,setEditItem] = useState(null)
  const API_URL = "http://127.0.0.1:8000/api/ingredients/"
  
  useEffect(() => {
    const loadIngredients = async () => {
      try {
        const res = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${localStorage.getItem("access")}` }
        });
        setIngredients(res.data);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Failed loading your ingredients");
      }
    };
    loadIngredients();
  }, []);
  
  const handleDelete = async (id) =>{
    try{
      const token = localStorage.getItem("access");
      await axios.delete(`${API_URL}${id}/`, { headers: { Authorization: `Bearer ${token}` }})
      setIngredients(ingredients.filter(i => i.id !== id))
    }catch{
      setError("Can't delete ingredient")
    }
  }
  
  const handleEdit = (item) => setEditItem(item)
  
  const handleUpdate = (updatedItem) => {
    setIngredients(ingredients.map(i => i.id === updatedItem.id ? updatedItem : i))
    setEditItem(null)
  }
  
  const handleAdd = (newItem) => setIngredients([...ingredients, newItem])
  
  return (
    <div className="ingredients-container">
      <h2>Ingredients Invoice</h2>
      <IngredientsForm
        editItem={editItem}
        onUpdate={handleUpdate}
        onSuccess={handleAdd}
      />
      {error && <p>{error}</p>}
      <table className="ingredients-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Cost per Unit</th>
            <th>Unit</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {ingredients.map((i) => (
            <tr key={i.id}>
              <td>{i.name}</td>
              <td>{i.cost_per_unit}</td>
              <td>{i.unit}</td>
              <td>
                <button onClick={() => handleEdit(i)}>Edit</button>
                <button onClick={() => handleDelete(i.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
