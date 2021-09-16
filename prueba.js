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


conexion.query("SELECT *from UbicacionTaxi2",(error,rows)=> {
    if (error) throw error
    console.log(rows)
})
