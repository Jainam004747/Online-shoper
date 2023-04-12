const { connect } = require('mongoose')
const app = require('./app')
const connectDatabase = require('./config/database')

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