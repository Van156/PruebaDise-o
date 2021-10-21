
var cadena="0 0 0 0 0 0 0 0";
var vector;
let contador = 0;

var latitud = '';
var longitud = '';
var fecha='';
var hora='';
var taxi='';

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

//udp Server:

const dgram=require('dgram');

const udpServer=dgram.createSocket('udp4');

const udpHost = process.env.UDPHOST; //La ip del pc que va a recibir la ubicacion dada por el celular
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
    taxi=vector[9];

    contador = contador +1

    var datos  = "INSERT INTO taxi_location (latitud,longitud,fecha,hora,taxi) "+"VALUES('"+latitud+"','"+longitud+"','"+fecha+"','"+hora+"','"+taxi+"')";
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
const sys = require("child_process");

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

app.post("/Pull",(req,res)=>{
    sys.exec("cd /home/ubuntu/diseño && git reset --hard && git pull origin Elder2");
    console.log("Se realizo un Pull");

})

app.use(express.json({ limit:'4mb' }));
app.use("/public", express.static(__dirname+"/public"));

app.post("/Post",(req,res)=>{
    console.log("Datos recibidos")
    console.log(req.body);
    
    var rangoFecha=req.body[0];
    var fechaInicial=rangoFecha.substring(8,10)+'/'+rangoFecha.substring(5,7)+'/'+rangoFecha.substring(0,4);
    var fechaFinal=rangoFecha.substring(21,23)+'/'+rangoFecha.substring(18,20)+'/'+rangoFecha.substring(13,17);
    
    var fechaInicial_="'"+fechaInicial+"'";
    var fechaFinal_="'"+fechaFinal+"'"
    

    conexion.query("SELECT * FROM taxi_location WHERE fecha  BETWEEN "+fechaInicial_+" AND "+fechaFinal_+"",(error,rows)=> {
        if (error) throw error
        console.log(rows.length);
        console.log(rows[0]);
        var rangoHora=req.body[1];
        var horaInicial=rangoHora.substring(0,5);
        var horaFinal=rangoHora.substring(6,11)
       var datos= rows.filter((row)=>{
        return (row.fecha==fechaFinal && parseInt(row.hora.substring(0,2))<= parseInt(horaFinal.substring(0,2)) ) || (row.fecha==fechaInicial && parseInt(row.hora.substring(0,2))>= parseInt(horaInicial.substring(0,2)) ) || (row.fecha!=fechaInicial && row.fecha!=fechaFinal);
        
    })
        console.log(datos.length)
        var historico=[];
        var taxi1=[];
        var taxi2=[];
        var dates=[]
        var datesTaxi1=[];
        var datesTaxi2=[];
        for ( var j=0;j<datos.length;j++ ){
            
            historico.push([datos[j].latitud,datos[j].longitud]);
        };
        for ( var j=0;j<datos.length;j++ ){
            dates.push([datos[j].fecha,datos[j].hora]);
        };

        for ( var j=0;j<datos.length;j++ ){
            if (datos[j].taxi=='1'){
                taxi1.push([datos[j].latitud,datos[j].longitud]);
                datesTaxi1.push([datos[j].fecha,datos[j].hora]);
            }
            if (datos[j].taxi=='2'){
                taxi2.push([datos[j].latitud,datos[j].longitud]);
                datesTaxi2.push([datos[j].fecha,datos[j].hora]);
            }
           
        };

        
        
        res.json({
            historico : historico,
            dates: dates,
            taxi1:taxi1,
            datesTaxi1:datesTaxi1,
            taxi2:taxi2,
            datesTaxi2:datesTaxi2,
        });
        
        
    });
    
    

})

app.listen(port,()=>{
    console.log('Servidor Web en el puerto ', port)
})