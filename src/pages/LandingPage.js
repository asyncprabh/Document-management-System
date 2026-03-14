import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../services/api";
import heroImage from "../assets/dms-hero.png";

export default function LandingPage() {

const navigate = useNavigate();

const [form,setForm] = useState({
firstName:"",
lastName:"",
email:"",
phone:"",
company:"",
department:"",
jobTitle:"",
discipline:"",
role:"InternalUser",
password:"",
confirmPassword:""
});

const handleChange=(e)=>{
setForm({...form,[e.target.name]:e.target.value});
};

const register = async () => {

if(!form.firstName || !form.email || !form.password){
alert("Please fill required fields");
return;
}

if(form.password !== form.confirmPassword){
alert("Passwords do not match");
return;
}

try{

await API.post("/Auth/register",{
firstName:form.firstName,
lastName:form.lastName,
email:form.email,
phone:form.phone,
company:form.company,
department:form.department,
jobTitle:form.jobTitle,
discipline:form.discipline,
role:form.role,
password:form.password
});

alert("Registration Successful");

navigate("/login");

}
catch(err){

console.log("Register error:",err);
alert("Registration Failed");

}

};

return (

<div className="min-h-screen flex flex-col">

{/* NAVBAR */}

<div className="flex justify-between items-center px-10 py-4 shadow bg-white">

<h1 className="text-xl font-bold text-blue-700">
Enterprise DMS
</h1>

<div className="flex gap-6 items-center">

<a href="#features" className="text-gray-600 hover:text-black">
Features
</a>

<a href="#about" className="text-gray-600 hover:text-black">
About
</a>

<Link
to="/login"
className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
>
Login
</Link>

</div>

</div>

{/* HERO SECTION */}

<div className="flex flex-1">

{/* LEFT IMAGE */}

<div
className="w-1/2 bg-cover bg-center flex items-center justify-center"
style={{ backgroundImage: `url(${heroImage})` }}
>

<div className="bg-black bg-opacity-50 text-white p-10 rounded text-center max-w-md">

<h2 className="text-4xl font-bold mb-4">
Document Management System
</h2>

<p className="text-gray-200">
Manage, organize and secure your documents in one place.
Build powerful workflows for your organization.
</p>

<button
onClick={()=>navigate("/login")}
className="mt-6 bg-red-500 px-6 py-3 rounded hover:bg-red-600 transition"
>
Get Started
</button>

</div>

</div>

{/* RIGHT REGISTER FORM */}

<div className="w-1/2 flex items-center justify-center bg-gray-50">

<div className="bg-white p-8 rounded-lg shadow-lg w-[500px]">

<h3 className="text-2xl font-semibold mb-6 text-center">
Create Enterprise Account
</h3>

<div className="grid grid-cols-2 gap-3">

<input name="firstName" placeholder="First Name" onChange={handleChange} className="border p-3 rounded"/>
<input name="lastName" placeholder="Last Name" onChange={handleChange} className="border p-3 rounded"/>

<input name="email" placeholder="Email" onChange={handleChange} className="border p-3 rounded"/>
<input name="phone" placeholder="Phone" onChange={handleChange} className="border p-3 rounded"/>

<input name="company" placeholder="Company / Organization" onChange={handleChange} className="border p-3 rounded"/>
<input name="department" placeholder="Department" onChange={handleChange} className="border p-3 rounded"/>

<input name="jobTitle" placeholder="Job Title" onChange={handleChange} className="border p-3 rounded"/>

<select name="discipline" onChange={handleChange} className="border p-3 rounded">
<option value="">Select Discipline</option>
<option>Mechanical</option>
<option>Civil</option>
<option>Electrical</option>
<option>Instrumentation</option>
<option>Architecture</option>
<option>Quality</option>
<option>Safety</option>
</select>

</div>

<select
name="role"
onChange={handleChange}
className="border p-3 w-full mt-3 rounded"
>

<option value="InternalUser">Internal User</option>
<option value="ExternalUser">External User</option>

</select>

<input
type="password"
name="password"
placeholder="Password"
onChange={handleChange}
className="border p-3 w-full mt-3 rounded"
/>

<input
type="password"
name="confirmPassword"
placeholder="Confirm Password"
onChange={handleChange}
className="border p-3 w-full mt-3 rounded"
/>

<button
onClick={register}
className="bg-red-600 text-white w-full py-3 mt-4 rounded hover:bg-red-700 transition"
>
Create Enterprise Account
</button>

<p className="text-sm text-center mt-4">

Already have account?

<Link
to="/login"
className="text-blue-600 ml-2 hover:underline"
>
Login
</Link>

</p>

</div>

</div>

</div>

{/* FEATURES */}

<div id="features" className="bg-white py-16 px-10">

<h2 className="text-3xl font-bold text-center mb-10">
Powerful Features
</h2>

<div className="grid grid-cols-3 gap-8">

<div className="shadow p-6 rounded text-center bg-gray-300">
<h3 className="font-semibold mb-2">Secure Storage</h3>
<p className="text-gray-600">Store all your documents safely in one place.</p>
</div>

<div className="shadow p-6 rounded text-center bg-gray-300">
<h3 className="font-semibold mb-2">Folder Management</h3>
<p className="text-gray-600">Organize files using smart folder hierarchy.</p>
</div>

<div className="shadow p-6 rounded text-center bg-gray-300">
<h3 className="font-semibold mb-2">Easy Sharing</h3>
<p className="text-gray-600">Share documents with your team instantly.</p>
</div>

</div>

</div>

{/* FOOTER */}

<div className="bg-gray-900 text-gray-400 text-center py-6">

© 2026 Enterprise Document Management System

</div>

</div>

);

}