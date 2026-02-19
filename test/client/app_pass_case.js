import axios from "axios";

async function getUsers() {
  const response = await fetch("/api/users");
  return response.json();
}

async function createUser(data) {
  const response = await fetch("/api/users", { method: "POST" });
  return response.json();
}

async function deleteUser(id) {
  const res = await axios.delete(`/api/users/${id}`);
  return res.data;
}
