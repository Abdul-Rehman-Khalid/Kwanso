const express = require('express');
require('dotenv').config()

//users for Email
const users = []

//tasks for create/list-tasks
const tasks = []

const app = express();
app.use(express.json());

const jwt = require('jsonwebtoken')

app.listen(3000 , ()=>{
    console.log('Listening on the port 3000');
})

app.get('/', (req , res)=>{
    res.json({message: "Api is working.."})
})

//Following is the code for POST resgister

app.post('/register' , (req , res) => {
    if(!req.body.email){
        res.status(400)
        return res.json({error : "Email is requeired.."})
    }
    const user = {
        id: users.length + 1,
        email: req.body.email,
        password: req.body.password
    }

    users.push(user)
    res.json({
        id: users.length,
        email: req.body.email
    })
})

//Following is the code for GET user with JWT authentication

app.get('/user' , authenticateToken, (req , res) => {
    
    res.json(users.filter(post => post.email == req.uzer.login))

})


//Following is the code for POST login and receive token

app.post('/login' , (req , res) => {
    const email = req.body.email
    const uzer = { login: email}  

    const accessToken = jwt.sign(uzer, process.env.ACCESS_TOKEN_SECRET)
    res.json({ accessToken: accessToken})
})

//Following is the code for authenticate Token

function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null)
    {
        //return res.sendStatus(401)
        res.status(400)
        return res.json({error : "Unauthorize access.."})
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, uzer) => {
        if(err)
        {
            return res.sendStatus(403)
        }
        req.uzer = uzer
        next()
    })
}


//Following is code for GET tasks list...

app.get('/list-tasks' , (req , res) => {


    res.json(tasks)

})

//Following is the code for POST create task
app.post('/create-task' , (req , res) => {

    if(!req.body.name){
        res.status(400)
        return res.json({error : "Task name is requeired.."})
    }
    const task = {
        id: tasks.length + 1,
        name: req.body.name
    }

    tasks.push(task)
    res.json(task)
})