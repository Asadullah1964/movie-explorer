'use client';

import { useState } from "react";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async () => {
    await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(form),
    });

    alert("User Registered");
  };

  return (
    <div className="max-w-sm mx-auto mt-20 space-y-4">
      <input placeholder="Name" onChange={(e) => setForm({...form, name: e.target.value})} />
      <input placeholder="Email" onChange={(e) => setForm({...form, email: e.target.value})} />
      <input type="password" placeholder="Password" onChange={(e) => setForm({...form, password: e.target.value})} />
      <button onClick={handleSubmit}>Register</button>
    </div>
  );
}