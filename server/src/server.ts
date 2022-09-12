import express from "express"

const app = express()

app.get('/', (req, res) => {
    return res.send("turo")
})

app.listen(3333)