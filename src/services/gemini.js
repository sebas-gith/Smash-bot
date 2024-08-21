const dotenv = require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.IA_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

class Gemini{
    prompt = "";

    constructor(prompt){
        this.prompt = prompt;
    }

    generateContent = async (req,res)=>{
        try{
            const prompt = this.prompt;
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            return text;
        }
        catch(err){
            console.log(err);
            console.log("Unexpected Error!!!");
        }
    }

    setPrompt(prompt){
        this.prompt = prompt;
    }
    
};


module.exports = Gemini;