import app from "./app"
import dotenv from "dotenv"

dotenv.config()

const PORT = process.env.PORT || 5000

//app.listen(PORT, () => {
//	console.log(`Server is live on Port http://localhost:${PORT}`)
//})
app.listen(5000, "0.0.0.0", () => {
	console.log("Server running on port 5000");
});