import { useState } from "react";
import API from "../services/api";

export default function DocumentUpload({folderId}){

const [file,setFile] = useState(null);

const uploadFile = async ()=>{

const formData = new FormData();

formData.append("file",file);
formData.append("folderId",folderId);

await API.post("/Documents/upload",formData,{
headers:{ "Content-Type":"multipart/form-data" }
});

alert("Upload Success");

}

return(

<div className="mb-6">

<input type="file"
onChange={(e)=>setFile(e.target.files[0])}
/>

<button
onClick={uploadFile}
className="bg-green-600 text-white px-4 py-2 ml-3 rounded"
>
Upload
</button>

</div>

)

}