import express from "express";
const app = express();

app.get("/api/users", (req, res) => {
  res.json({ users: [] });
});

app.post("/api/users", (req, res) => {
  res.json({ created: true });
});

// Notice: NO /api/ghost route here

app.delete("/api/users/:id", (req, res) => {
    res.json({ user: deleted });
})

export default app;
