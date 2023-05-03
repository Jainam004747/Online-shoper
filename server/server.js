const { connect } = require('mongoose')
const app = require('./app')
const connectDatabase = require('./config/database')
const cloudinary = require('cloudinary');


//config setup
require('dotenv').config({ path: 'server/config/config.env' })

//Handle Uncaught exceptions 
process.on('uncaughtException', err =>{
    console.log(`Error: ${err.stack}`);
    console.log('Shutting down server due to uncaught exception');
    process.exit(1);
});

//connection of database 
connectDatabase();

//setting up cloudinary config
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
})



const server = app.listen(process.env.PORT, () => {
    console.log(`Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`)
})

// Handle unhandled Promise rejections 
process.on('unhandledRejection', err =>{
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server dur to Unhandled Promise rejections');
    server.close( () => { 
        process.exit(1)  
    });
})