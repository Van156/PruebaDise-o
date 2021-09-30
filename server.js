
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

    contador = contador +1

    var datos  = "INSERT INTO taxi_location (latitud,longitud,fecha,hora) "+"VALUES('"+latitud+"','"+longitud+"','"+fecha+"','"+hora+"')";
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
app.use(express.static('public'));

app.post("/Post",(req,res)=>{
    console.log("Datos recibidos")
    console.log(req.body);
    //"2021-09-01 - 2021-09-03"
    //"2021-09-22 - 2021-09-22"
    var rangoFecha=req.body[0];
    var fechaInicial=rangoFecha.substring(8,10)+'/'+rangoFecha.substring(5,7)+'/'+rangoFecha.substring(0,4);
    var diaInicial=parseInt(rangoFecha.substring(8,10))
    var mesInicial=parseInt(rangoFecha.substring(5,7));
    var añoInicial=parseInt(rangoFecha.substring(0,4));
    var fechaFinal=rangoFecha.substring(21,23)+'/'+rangoFecha.substring(18,20)+'/'+rangoFecha.substring(13,17);
    var diaFinal=parseInt(rangoFecha.substring(21,23));
    var mesFinal=parseInt(rangoFecha.substring(18,20));
    var añoFinal=parseInt(rangoFecha.substring(13,17));
    var rango='(';
    var aux='';
    console.log(mesFinal-mesInicial);
    console.log(diaFinal-diaInicial);
    for (var i=0;i<=(mesFinal-mesInicial); i++){
        for (var p=0;p<=(diaFinal-diaInicial); p++){
            if (diaInicial+p<10){
            aux='0'+String(diaInicial+p)+'/';
            }
            else{
                aux=String(diaInicial+p)+'/';
            }
            if (mesInicial+i<10){
                aux=aux+'0'+String(mesInicial+i)+'/'+String(añoInicial);
                }
                else{
                    aux=aux+String(mesInicial+i)+'/'+String(añoInicial);
                }
            rango=rango+"'"+aux+"',";    
        }
    }

    rango=rango.substring(0,rango.length-1)+')';

    conexion.query("SELECT *from taxi_location WHERE fecha  IN "+rango+"",(error,rows)=> {
        if (error) throw error
        console.log(rows.length);
        console.log(rows[0]);
        var rangoHora=req.body[1];
        var horaInicial=rangoHora.substring(0,5);
        var horaFinal=rangoHora.substring(6,11)
       var datos= rows.filter((row)=>{
           // console.log(parseInt(row.hora.substring(0,)) );
        return (row.fecha==fechaFinal && parseInt(row.hora.substring(0,2))<= paraseInt(horaFinal.substring(0,2)) ) || (row.fecha==fechaInicial && parseInt(row.hora.substring(0,2))>= paraseInt(horaInicial.substring(0,2)) ) || (row.fecha!=fechaInicial && row.fecha!=fechaFinal);
        
    })
        console.log(datos.length)
        historico=[];
    
        for ( var j=0;j<datos.length;j++ ){
            historico.push([datos[j].latitud,datos[j].longitud]);
            
        };
        
        res.json({
            historico : historico,
        });
        
        
    });
    
    

})


// conexion.end()

//F en el chat 


app.listen(port,()=>{
    console.log('Servidor Web en el puerto ', port)
})
