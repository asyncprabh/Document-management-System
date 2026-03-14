import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function SearchPage() {

  const [query,setQuery] = useState("");
  const [results,setResults] = useState([]);
  const [suggestions,setSuggestions] = useState([]);

  const navigate = useNavigate();

  // ===============================
  // LIVE SUGGESTIONS
  // ===============================

  const handleChange = async (value) => {

    setQuery(value);

    if(value.length < 1){
      setSuggestions([]);
      return;
    }

    try{

      const res = await API.get(`/Documents/search?keyword=${value}`);

      const docs = Array.isArray(res.data)
        ? res.data
        : res.data.$values || [];

      setSuggestions(docs.slice(0,5));

    }
    catch(err){

      console.log("Suggestion error",err);
      setSuggestions([]);

    }

  };

  // ===============================
  // SEARCH BUTTON / ENTER
  // ===============================

  const search = async () => {

    if(!query.trim()) return;

    try{

      const res = await API.get(`/Documents/search?keyword=${query}`);

      const docs = Array.isArray(res.data)
        ? res.data
        : res.data.$values || [];

      setResults(docs);
      setSuggestions([]);

    }
    catch(err){

      console.log("Search error",err);

    }

  };

  return (

<div className="p-6">

<h1 className="text-2xl font-bold mb-6">
Global Document Search
</h1>

{/* SEARCH BAR */}

<div className="relative w-[500px]">

<input
value={query}
onChange={(e)=>handleChange(e.target.value)}
onKeyDown={(e)=> e.key==="Enter" && search()}
placeholder="Search documents..."
className="border rounded-full px-10 py-2 w-full shadow"
/>

{/* SEARCH ICON */}

<span className="absolute left-3 top-2.5 text-gray-400">
🔍
</span>

{/* SEARCH BUTTON */}

<button
onClick={search}
className="absolute right-1 top-1 bg-blue-600 text-white px-4 py-1 rounded-full"
>
Search
</button>

{/* SUGGESTIONS */}

{suggestions.length>0 && (

<div className="absolute w-full bg-white border shadow mt-1 rounded-lg z-10">

{suggestions.map(doc=>(

<div
key={doc.id}
onClick={()=>navigate(`/preview/${doc.id}`)}
className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between"
>

<span>
📄 {doc.title || doc.name}
</span>

<span className="text-xs text-gray-500">
{doc.folderName || "Folder"}
</span>

</div>

))}

</div>

)}

</div>

{/* RESULTS */}

<div className="space-y-3 mt-6">

{results.map(doc=>(

<div
key={doc.id}
className="p-4 bg-white shadow rounded flex justify-between items-center"
>

<div>

<div className="font-medium">
📄 {doc.title || doc.name}
</div>

<div className="text-sm text-gray-500">
{doc.projectName || "Project"} • {doc.folderName || "Folder"}
</div>

</div>

<button
onClick={()=>navigate(`/preview/${doc.id}`)}
className="text-blue-600"
>
Preview
</button>

</div>

))}

</div>

</div>

  );

}