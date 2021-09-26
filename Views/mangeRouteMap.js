const mysql=require('mysql');
var latitud=0;
var longitud=0;
var contador=0;
const showLocation = document.getElementById("gps");
var latlngs = [];



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


conexion.query("SELECT *from taxi_location",(error,rows)=> {

    if (error) throw error
    console.log(rows)

})





let myMap = L.map('myMap') // latitude, longitude y zoom

let markerInicial = L.marker([latitud, longitud]).addTo(myMap);
  
L.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`, {
maxZoom: 18,}).addTo(myMap);

myMap.setView([latitud, longitud], 14);

var polyline = L.polyline(latlngs, {color: '#4353ff'}).addTo(myMap);

async function getGPS() {

const response = await fetch("./prueba", {
// mode: 'no-cors'
});

let responseJson = await response.json();

showLocation.innerHTML = await (`Latitud: ${responseJson.latitud}, 
                        Longitud: ${responseJson.longitud},
                        Fecha: ${responseJson.fecha},
                        Hora: ${responseJson.hora},
                        Numero: ${responseJson.contador}`);

latitud=parseFloat(responseJson.latitud);
longitud=parseFloat(responseJson.longitud);

//myMap.panTo([latitud, longitud]);

if (latitud!=0 && contador==0){
var markerInicial = L.marker([latitud, longitud]).addTo(myMap);
var markerFinal = L.marker([latitud, longitud]).addTo(myMap);
contador=2;
}

if (latitud!=0){
latlngs.push([latitud, longitud]);

polyline.setLatLngs(latlngs, {color: '#4353ff'}); //Añaduir esta coordenada a la polilinea
}

markerInicial.setLatLng([latitud, longitud]);

};

document.addEventListener("load", getGPS());

setInterval(getGPS,5000);
