import express, { request } from "express"
import {PORT,mongoDBURL} from "./config.js"
import mongoose from "mongoose";
import { Book } from "./models/bookModel.js";

const app = express();

app.use(express.json());

app.get('/',(req,res)=> {
    console.log(req);
    return res.status(200).send('Hi how are you?');
})

app.get('/books',async (req,res)=> {
    try{
        const book = await Book.find({});
        return res.status(200).send({
            count: book.length,
            data: book});
    }catch(e){
        console.log(req);
        res.status(500).send({message:e.message});
    }

});

app.get('/books/:id',async (req,res)=> {
    try{
        const {id} = req.params

        const book = await Book.findById(id);
        return res.status(200).send(book);
    }catch(e){
        console.log(req);
        res.status(500).send({message:e.message});
    }

});

app.put('/books/:id',async (req,res)=> {
    try{

        if(!req.body.title || !req.body.author || !req.body.publishYear){
            return res.status(400).send({
                message: "send all fields"
            })
        }

        const {id} = req.params

        const result = await Book.findByIdAndUpdate(id);

        if(!result){
            return res.status(400).send({message:"Book not found"});
        }

        return res.status(200).send({message:"Book updated successfully!"});
    }catch(e){
        console.log(req);
        res.status(500).send({message:e.message});
    }

});

app.delete('/books/:id',async (req,res)=> {
    try{

        const {id} = req.params

        const result = await Book.findByIdAndDelete(id);

        if(!result){
            return res.status(400).send({message:"Book not found"});
        }

        return res.status(200).send({message:"Book deleted successfully!"});
    }catch(e){
        console.log(req);
        res.status(500).send({message:e.message});
    }

});

app.post('/books', async (req,res)=>{
    try{
        if(!req.body.title || !req.body.author || !req.body.publishYear){
            return res.status(400).send({
                message: "send all fields"
            })
        }

        const newBook = {
            title: req.body.title,
            author: req.body.author,
            publishYear: req.body.publishYear
        };

        const book = await Book.create(newBook);

        return res.status(200).send(book);

    }catch(e){
        console.log(e);
        res.status(500).send({message:e.message});
    }
})



mongoose.connect(mongoDBURL).then(()=>{
    console.log('App conneceted to database');

    app.listen(PORT,()=>{
        console.log('port is running on '+ PORT);
    });

}).catch((error)=>{
    console.log(error)
})