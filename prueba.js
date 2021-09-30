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
    
    console.log(datos.length)
    historico=[];

    for ( var j=0;j<datos.length;j++ ){
        historico.push([datos[j].latitud,datos[j].longitud]);
    }
    console.log(historico)
    

    //"2021-09-01 - 2021-09-03"
    var rangoFecha="2021-09-01 - 2021-09-03";
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
    console.log(fechaInicial);
    console.log(fechaFinal);
    console.log(diaInicial);
    console.log(rango);

    var rangoHora="08:00-09:00";
    var horaInicial=rangoHora.substring(0,5);
    var horaFinal=rangoHora.substring(6,11)
    console.log(horaInicial);
    console.log(horaFinal);
})
