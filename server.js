
var cadena="0 0 0 0 0 0 0 0";
var vector;
let contador = 0;

var latitud = '';
var longitud = '';
var fecha='';
var hora='';

//Usar variables de entorno de archivo .env para info privada

require("dotenv").config();

const mysql=require('mysql');
//Base de datos conexion 

const conexion = mysql.createConnection({
    host: process.env.dbHOST,
    database:process.env.dbNAME, 
    user:process.env.dbUSER,
    password:process.env.dbPASSWORD,
    
});

conexion.connect(
    function(error){

        if (error) {
           
            throw error
        };
        console.log('Conexion Exitosa-------');
    }
)


require('dotenv').config();
//udp Server:

const dgram=require('dgram');

const udpServer=dgram.createSocket('udp4');

const udpHost = 'ec2-18-208-170-163.compute-1.amazonaws.com'; //La ip del pc que va a recibir la ubicacion dada por el celular
const udpPort = 8050;                //Debe ser un puerto abierto, para que la aplicacion pueda enviar informacion a el
                                     //a traves de la ip publica



udpServer.on('listening',()=>console.log('Servidor UDP en el puerto ', udpPort));

udpServer.on('message',(msg,rinfo)=>{

    console.log(`${rinfo.address}:${rinfo.port}-${msg}`);

    console.log('----------------------------------------------');

    message = `${msg}`;

    vector = message.split(' ');

    latitud = vector[1];
    longitud = vector[3];
    fecha=vector[5];
    hora=vector[7];

    contador = contador +1

    var datos  = "INSERT INTO new_table (latitud,longitud,fecha,hora) "+"VALUES('"+latitud+"','"+longitud+"','"+fecha+"','"+hora+"')";
    //var ubicacion=[[latitud,longitud,fecha,hora]];
    conexion.query(datos,(error, rows) => {
        if(error)  throw error
        console.log("Datos enviados");
    });
});


udpServer.bind(udpPort, udpHost);

// web server:

const port = 8080;

const express=require('express');
const ejs=require('ejs');
const app=express();

// Motor de plantillas para el fronted
app.set('view engine','ejs');
app.set('views',__dirname+'/Views');


app.get('/',(req,res)=>{
    res.render('index');
})

/*Aqui se Envia la latitud y longitud cuando el usuario llegue a "webserver/prueba" */
app.get("/prueba", (req,res) => {
    

   res.json({
       "latitud": latitud, //Enviando datos que recojimos en el servidor UDP
       "longitud": longitud,
       "fecha":fecha,
       "hora":hora,
       "contador": contador,
   });

})








// conexion.end()


app.listen(port,()=>{
    console.log('Servidor Web en el puerto ', port)
})
