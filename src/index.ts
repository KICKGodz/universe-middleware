import express, { Request, Response } from "express";
// import cors from "cors"
const app = express();
app.use(express.json())
app.set('trust proxy', true)
const port = 5175;

type Server = {
    name: string
    uptime: number
}

let serversOnline: Map<string, Server> = new Map()

app.post("/server", (req: Request, res: Response) => {
    let realIp = req.ip
    if(realIp.includes("::")) realIp = "localhost"
    console.log(`Server from ${realIp} (${req.body["name"]}) ${req.body["status"]}`)
    if(req.body["status"] == "starting") {
        serversOnline.set(`${realIp}:${req.body["port"]}`, { name: req.body["name"], uptime: Date.now() })
    } else {
        serversOnline.delete(`${realIp}:${req.body["port"]}`)
    }
    res.sendStatus(200)
})

app.get("/servers", (req: Request, res: Response) => {
    res.status(200).send([...serversOnline])
})

// start the express server
app.listen(port, () => {
    console.log(`Middleware started on port ${port}`);
});