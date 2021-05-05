/*Puerto del servidor*/
process.env.PORT = process.env.PORT || 3000;
//Base de datos local
let lorcalUrlDB = 'mongodb://localhost:27017/TrabajoTerminal';
//Base de datos remota
let remoteUrlDB = 'mongodb://miguel:Aikothegp0@ds161764.mlab.com:61764/trabajo_terminal';

process.env.URLDB = process.env.URLDB || remoteUrlDB;