import { Search } from "lucide-react"
import "../Css/SearchBar.css"

export default function SearchBar({ value, onChange, placeholder = "Buscar..." }) {
  return (
    <div className="search-bar">
      <Search size={30} />
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  )
}
