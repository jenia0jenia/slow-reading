import { readFile } from "fs"
import { resolve, join, dirname } from "path"
import { fileURLToPath } from 'url';
import express from "express"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express()
const port = 3000

const text = {
    path: resolve("./", "text.txt"),
}

readFile(text.path, "utf-8", (err, data) => {
    text.data = data
    // console.log();
})

app.use("/public", express.static("public"))

app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "/index.html"))
})

app.get("/api/text", (req, res) => {
    const textDataArray = text.data.split(" ")
    const textData = []
    textDataArray.forEach((word, i) => {
        if (word.length < 4) {
            textDataArray.splice(i, 1)
            textDataArray[i] = `${word} ${textDataArray[i]}`
        }
    });

    for (let i = 0; i < textDataArray.length; i++) {
        textData.push(`<span>${textDataArray[i]}</span>`)
    }

    res.send(textData.join(" "))
})

app.listen(port, () => {
    console.log(`Starting server on port ${port}...`)
})
