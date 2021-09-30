const { json } = require('express');
const mysql=require('mysql');
//Base de datos conexion 

var latitud = '';
var longitud = '';
var fecha='';
var hora='';

const conexion = mysql.createConnection({
    host: 'instancia1.cwm44prmspog.us-east-2.rds.amazonaws.com',
    database:'Ubicacion', 
    user:'root',
    password: 'elder12345',
    
});

conexion.connect(
    function(error){

        if (error) {
           
            throw error
        };
        console.log('Conexion Exitosa');
    }
)

//sql = `SELECT * FROM ${id} WHERE tstamp BETWEEN ${start} AND 
conexion.query("SELECT *from taxi_location WHERE fecha BETWEEN '22/09/2021'  AND  '22/09/2021' ",(error,rows)=> {
    if (error) throw error
    console.log(rows.length);
    console.log(rows[0]);
    var datos= rows.filter((row)=>{
       // console.log(parseInt(row.hora.substring(0,)) );
        return parseInt(row.hora.substring(0,2))<= 3;
    })
    
    //console.log(datos)
    historico=[];

    for ( var j=0;j<datos.length;j++ ){
        historico.push([datos[j].latitud,datos[j].longitud]);
    }
    console.log(historico)
    
})
