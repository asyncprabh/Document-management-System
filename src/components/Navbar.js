export default function Navbar(){

return(

<div className="bg-white shadow p-4 flex justify-between">

<h2 className="font-semibold text-lg">
Enterprise DMS
</h2>

<button
className="bg-red-500 text-white px-4 py-1 rounded"
onClick={()=>{

localStorage.removeItem("token");
window.location="/";

}}
>
Logout
</button>

</div>

)

}