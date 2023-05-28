import express from "express";
const app = express();

app.use("/wgpu-lab", express.static("docs"));
app.use("/", express.static("docs"));

app.listen(3000, () => {
  console.log("Verify build at http://localhost:3000");
});
