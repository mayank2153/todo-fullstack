const express = require("express");
const cors = require("cors");
const { createTodo, updateTodo } = require("./types");
const { todo } = require("./models/todo.models.js");
const connectDB = require("./db/index.js");

const app = express();
app.use(cors());
app.use(express.json()); // Invoke express.json as a function

app.post("/todo", async function (req, res) {
  const updatedPayload = req.body;
  const parsedPayload = createTodo.safeParse(updatedPayload);
  if (!parsedPayload.success) {
    console.log(parsedPayload.error.errors); // Log the validation errors for debugging
    res.status(411).json({
      msg: "You sent the wrong input",
      errors: parsedPayload.error.errors, // Include validation errors in response
    });
    return;
  }

  await todo.create({
    title: updatedPayload.title,
    description: updatedPayload.description,  // Corrected the typo here
    completed: false,
  });

  res.json({
    msg: "Todo created",
  });
});

app.get("/todos", async function (req, res) {
  const todos = await todo.find({}); // find always returns a promise
  res.json({
    todos,
  });
});

app.put("/completed", async function (req, res) {
  const updatedPayload = req.body;
  const parsedPayload = updateTodo.safeParse(updatedPayload);
  if (!parsedPayload.success) {
    console.log(parsedPayload.error.errors);
    res.status(400).json({
      msg: "Invalid input",
      errors: parsedPayload.error.errors,
    });
    return;
  }

  try {
    const result = await todo.updateOne(
      { _id: parsedPayload.data.id }, // Use the validated id
      { completed: true }
    );

    if (result.nModified === 0) {
      return res.status(404).json({ msg: "Todo not found or already completed" });
    }

    res.json({ msg: "Todo marked as completed" });
  } catch (error) {
    console.log("Database update error: ", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});


app.get('/', (req, res) => {
  res.send("Backend Project");
});

connectDB().then(() => {
  app.listen(3000, () => {
    console.log("App running on port 3000");
  });
}).catch((error) => {
  console.log("Error starting app: ", error);
});

console.log("started");
