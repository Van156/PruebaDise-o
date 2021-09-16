const dgram=require('dgram');

const client = dgram.createSocket('udp4');

const msg = "Latitud: 11.0173334 Longitud: -74.81432 Fecha: 8-9-2021 hora: 17:13:21";

const PORT=8050;

const HOST='192.168.100.4';

client.send(msg, PORT, HOST, (error)=>{
    if (error) throw error;
    
    client.close();
});