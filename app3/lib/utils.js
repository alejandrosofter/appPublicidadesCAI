/*eslint-disable no-unreachable, no-extend-native, no-undef, semi*/
function getMedidas(srcWidth, srcHeight, maxWidth, maxHeight) {

        var ratio = [maxWidth / srcWidth, maxHeight / srcHeight ];
        ratio = Math.min(ratio[0], ratio[1]);

        return { width:srcWidth*ratio, height:srcHeight*ratio };
      }

String.prototype.resizeImage = function(w, h,callback) {
    var data = this;
      var canvas=document.getElementById('canvas');
var context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
var img = new Image();
img.onload = function () {
  var medidas=getMedidas(img.width,img.height,w,h);
    context.drawImage(img, 0, 0,medidas.width,medidas.height);
    var dataurl = canvas.toDataURL();
    if(callback)callback(dataurl);
}
img.src=data;
}
String.prototype.lpad = function(padString, length) {
    var str = this;
    while (str.length < length)
        str = padString + str;
    return str;
}
Date.prototype.addHours = function(h) {
   this.setTime(this.getTime() + (h*60*60*1000)); 
   return this;   
}
Date.prototype.addDays = function (num) {
    var value = this.valueOf();
    value += 86400000 * num;
    return new Date(value);
}
String.prototype.lpad = function(padString, length) {
    var str = this;
    while (str.length < length)
        str = padString + str;
    return str;
}
String.prototype.capitalizar = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
String.prototype.rpad = function(padString, length) {
    var str = this;
    while (str.length < length)
        str = str+ padString ;
    return str;
}
Date.prototype.getFecha = function () {
    var value = this.valueOf();
    value += 86400000 * 1;
    var d= new Date(value);
  return d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear();
}
Date.prototype.getFecha2 = function () {
    var value = this.valueOf();
    value += 86400000 * 1;
    var d= new Date(value);
  return d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear();
}
Date.prototype.getMes = function () {
    var value = this.valueOf();
    value += 86400000 * 1;
    var d= new Date(value);
  return d.getMonth()+1
}
Date.prototype.getDia= function () {
    var value = this.valueOf();
    value += 86400000 * 1;
    var d= new Date(value);
  return d.getDate()
}
Date.prototype.getMesLetras= function () {
   var value = this.valueOf();
    var d= new Date(value);
    var meses=["ENERO","FEBRERO","MARZO","ABRIL","MAYO","JUNIO","JULIO","AGOSTO","SEPTEMBRE","OCTUBRE","NOVIEMBRE","DICIEMBRE"];

  return meses[d.getMonth()]
}
Date.prototype.getAno= function () {
    var value = this.valueOf();
    value += 86400000 * 1;
    var d= new Date(value);
  return d.getFullYear()
}
Number.prototype.formatMoney = function(n, x, s, c) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
        num = this.toFixed(Math.max(0, ~~n));

    return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
};
function validarLargoCBU(cbu) {
  if (cbu.length != 22) { return false }
	return true
}

var validarCodigoBanco=function(codigo) {
 if (codigo.length != 8) { return false }
 var banco = codigo.substr(0,3)
 var digitoVerificador1 = codigo[3]
 var sucursal = codigo.substr(4,3)
 var digitoVerificador2 = codigo[7]

 var suma = banco[0] * 7 + banco[1] * 1 + banco[2] * 3 + digitoVerificador1 * 9 + sucursal[0] * 7 + sucursal[1] * 1 + sucursal[2] * 3

 var diferencia = 10 - (suma % 10)

 return diferencia == digitoVerificador2
}
mesLetras=function(mes)
{
  if(mes==1)return "ENERO";
  if(mes==2)return "FEBRERO";
  if(mes==3)return "MARZO";
  if(mes==4)return "ABRIL";
  if(mes==5)return "MAYO";
  if(mes==6)return "JUNIO";
  if(mes==7)return "JULIO";
  if(mes==8)return "AGOSTO";
  if(mes==9)return "SEPTEMBRE";
  if(mes==10)return "OCTUBRE";
  if(mes==11)return "NOVIEMBRE";
  if(mes==12)return "DICIEMBRE";
  return "s/a";
}
mesNumeros=function(mes)
{
  if(mes=="ENERO")return 1;
  if(mes=="FEBRERO")return 2;
  if(mes=="MARZO")return 3;
  if(mes== "ABRIL")return 4;
  if(mes=="MAYO")return 5;
  if(mes=="JUNIO")return 6;
  if(mes== "JULIO")return 7;
  if(mes=="AGOSTO")return 8;
  if(mes=="SEPTEMBRE")return 9;
  if(mes=="OCTUBRE")return 10;
  if(mes=="NOVIEMBRE")return 11;
  if(mes=="DICIEMBRE")return 12;
  return null;
}
getMeses=function()
{
  return ["ENERO","FEBRERO","MARZO","ABRIL","MAYO","JUNIO","JULIO","AGOSTO","SEPTEMBRE","OCTUBRE","NOVIEMBRE","DICIEMBRE"];
}
ripFechaArchivo=function(fechaDate)
{
    var st=fechaDate.toLocaleDateString();
    var arr=st.split("/");
    
    return arr[0].lpad("0",2)+arr[1].lpad("0",2)+arr[2].lpad("0",2)
}
getImporteTotalSocios=function(arr)
{
    var sum=0;
    for(var i=0;i<arr.length;i++)sum+=arr[i].importe*1;
    return sum;
}
ripImporteArchivo=function(importe)
{
    importe=importe+"";
    var arr=importe.split(".");
    if(arr.length>1)return arr[0].lpad("0",8)+arr[1].lpad("0",2);
    return arr[0].lpad("0",8)+"00";
}
var validarCuenta=function(cuenta) {
 if (cuenta.length != 14) { return false }
 var digitoVerificador = cuenta[13]
 var suma = cuenta[0] * 3 + cuenta[1] * 9 + cuenta[2] * 7 + cuenta[3] * 1 + cuenta[4] * 3 + cuenta[5] * 9 + cuenta[6] * 7 + cuenta[7] * 1 + cuenta[8] * 3 + cuenta[9] * 9 + cuenta[10] * 7 + cuenta[11] * 1 + cuenta[12] * 3
 var diferencia = 10 - (suma % 10)
 return diferencia == digitoVerificador
}

validarCBU=function(cbu) {
 return validarLargoCBU(cbu) && validarCodigoBanco(cbu.substr(0,8)) && validarCuenta(cbu.substr(8,14))
}
getClaseTipoSocio=function(fechaNac,esActivo,estado){
	var tipo=getTipoSocio(fechaNac,esActivo);
	if(estado=="BAJA")return "bajaSocio";
	var clase=tipo==="PARTICIPANTE"?"text-warning":"text-info";
		if(tipo==="ACTIVO")clase="text-danger";
	return clase;
}
geTipoSocioEdad=function(edad,activo)
{
	var edadAdherente=parseFloat(Settings.findOne({clave:"edadAdherente"}).valor);
	if(activo) return "ACTIVO"
	if(edad>=edadAdherente)return "ADHERENTE";
	
	return "PARTICIPANTE";
}
getImporteSocioEdad=function(edad,activo)
{
	var edadAdherente=parseFloat(Settings.findOne({clave:"edadAdherente"}).valor);
	if(activo) return parseFloat(Settings.findOne({clave:"importeActivos"}).valor)
	if(edad>=edadAdherente)return parseFloat(Settings.findOne({clave:"imprteAdherentes"}).valor)
	
	return parseFloat(Settings.findOne({clave:"importeParticipantes"}).valor)
}
getEdadSocio=function(fechaNac){
	var hoy = new Date();
    var cumpleanos = new Date(fechaNac);
    var edad = hoy.getAno() - cumpleanos.getAno();
    var m = hoy.getMes() - cumpleanos.getMes();

    if (m < 0 || (m === 0 && hoy.getDia() < cumpleanos.getDia())) {
        edad--;
    }

    return edad;
}
getTipoSocio=function(fechaNac,esActivo){
	var edadAdherente=parseFloat(Settings.findOne({clave:"edadAdherente"}).valor);
	
	 var anos=getEdadSocio(fechaNac);
	if(esActivo)return "ACTIVO";
   return anos<edadAdherente?"PARTICIPANTE":"ADHERENTE";
}
getImporteSocio=function(idSocio)
{
  var dataParticipantes=Settings.findOne({clave:"importeParticipantes"});
    var dataAdherentes=Settings.findOne({clave:"importeAdherentes"});
    var dataActivos=Settings.findOne({clave:"importeActivos"});
var edadAdherente=parseFloat(Settings.findOne({clave:"edadAdherente"}).valor);
  
  var socio=Socios.findOne({_id:idSocio});
  var anos=getEdadSocio(socio.fechaNacimiento);
	
  if(socio.esActivo)return dataActivos.valor;
  if(anos<edadAdherente) return dataParticipantes.valor;
  return dataAdherentes.valor;
}
getImporteSocioDatos=function(fechaNacimiento,esActivo)
{
  var dataParticipantes=Settings.findOne({clave:"importeParticipantes"});
    var dataAdherentes=Settings.findOne({clave:"importeAdherentes"});
    var dataActivos=Settings.findOne({clave:"importeActivos"});
var edadAdherente=parseFloat(Settings.findOne({clave:"edadAdherente"}).valor);
  

  var anos=getEdadSocio(fechaNacimiento);
	
  if(esActivo)return dataActivos.valor;
  if(anos<edadAdherente) return dataParticipantes.valor;
  return dataAdherentes.valor;
}

module.exports=getTipoSocio;