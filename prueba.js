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
    //console.log(rows)

   var rangoFechas= "29/09/2021 11:00 PM - 01/10/2021 07:00 AM";
   var array= rangoFechas.split(' ');
   var fechas=array[0]+' - '+array[4];
   var horaInicial='';
   var horaFinal='';
   if(array[2]==='PM'){
        horaInicial=String(parseInt(array[1].substring(0,2))+12)+array[1].substring(2,5);
   }
   else{
    horaInicial=array[1];
   }

   if(array[6]==='PM'){
    horaFinal=String(parseInt(array[5].substring(0,2))+12)+array[5].substring(2,5);
    }
    else{
    horaFinal=array[5];
    }
   console.log(array);
   console.log(horaInicial);
   console.log(horaFinal);
   var horas=horaInicial+'-'+horaFinal;
   console.log(horas);
})
