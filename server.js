
var cadena="0 0 0 0 0 0 0 0";
var vector;
let contador = 0;

var latitud = '';
var longitud = '';
var fecha='';
var hora='';

require('dotenv').config();
//udp Server:

const dgram=require('dgram');

const udpServer=dgram.createSocket('udp4');

const udpHost = process.env.Host; //La ip del pc que va a recibir la ubicacion dada por el celular
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

    
    /*Aqui se Envia la latitud y longitud cuando el usuario llegue a "webserver/prueba" */
    app.get("/prueba", (req,res) => {
        res.json({
            latitud: latitud, //Enviando datos que recojimos en el servidor UDP
            longitud: longitud,
            fecha:fecha,
            hora:hora,
            contador: contador
        });
    })

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


app.listen(port,()=>{
    console.log('Servidor Web en el puerto ', port)
})