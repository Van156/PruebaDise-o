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
var datos  = "INSERT INTO UbicacionTaxi (Latitud,Longitud,Fecha,Hora) "+"VALUES('"+latitud+"','"+longitud+"','"+fecha+"','"+hora+"')";
    //var ubicacion=[[latitud,longitud,fecha,hora]];
    conexion.query(datos,(error, rows) => {
        if(error)  throw error
        console.log("Datos enviados");
    });

conexion.query("SELECT *from UbicacionTaxi",(error,rows)=> {
    if (error) throw error
    console.log(rows)
})
