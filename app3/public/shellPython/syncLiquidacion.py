import time
import sys
from datetime import datetime
from dateutil import parser
from config import db
from config import exeRemote
from config import seEncuentra
from bson.objectid import ObjectId

def getValorRip(data,campo,ultimo):
	if ultimo: return "'"+str(data[campo])+"') ;"
	return "'"+str(data[campo])+"' , "

def getValorRipNro(data,campo,ultimo): 
	if ultimo: return str(data[campo])+") ;"
	return str(data[campo])+" , "
def cambiaEstadoLiquidacion(id):
	db.liquidaciones.update_one({"_id":id}, { "$set":{"estado":"ENVIADO"} } );
def getIdProfesional(idUsuario):
	usuario=db.users.find_one({"_id":idUsuario})
	return usuario['profile']['idProfesional']
def getCadenaInsertLiquidacion(data,idProfesional):
	fechaActual=datetime.now().strftime("%Y-%m-%d")
	valores=(" ( ")
	columnas="( id,idProfesional,detalle,fechaComienzo,fechaEntrega,nroLiquidacion,idUsuarioWeb,estado) "
	valores+=getValorRip(data,"_id",False)
	valores+=idProfesional+", "
	valores+=getValorRip(data,"detalle",False)
	valores+=getValorRip(data,"fecha",False)
	valores+="'"+fechaActual+"', "
	valores+=getValorRipNro(data,"nroLiquidacion",False)
	valores+=getValorRip(data,"idUsuario",False)
	valores+="'PENDIENTE' )"
	return columnas+" VALUES "+valores

def getCadenaInsertLiquidacion_factura(idFactura,idLiquidacion):
	valores=(" ( ")
	columnas="( idFacturaProfesional,idLiquidacionWeb ) "
	valores+= str(idFactura)+" ,"
	valores+= "'"+str(idLiquidacion)+"')"
	
	return columnas+" VALUES "+valores

def getCadenaInsert(data, idProfesional):
	valores=" ( "
	fechaActual=datetime.now().strftime("%Y-%m-%d")
	columnas="( fecha,idProfesional,importe,idObraSocial,estado,ipCarga,idNomenclador,nroAfiliado,nroOrden,importeFijo,paciente,idRangoNomenclador,fechaConsulta,cantidad,coeficiente)"

	valores+="'"+fechaActual+"', "
	valores+=idProfesional+", "
	valores+=getValorRipNro(data,"importe",False)
	valores+=getValorRipNro(data,"idObraSocial",False)
	valores+="'PENDIENTE', "
	valores+="'REMOTE', "
	valores+=getValorRipNro(data,"idNomenclador",False)
	valores+=getValorRip(data,"nroAfiliado",False)
	valores+=getValorRip(data,"nroOrden",False)
	valores+=getValorRip(data,"esImporteFijo",False)
	valores+=getValorRip(data,"paciente",False)
	valores+=getValorRipNro(data,"idRangoNomenclador",False)
	valores+=getValorRip(data,"fechaConsulta",False)
	valores+=getValorRipNro(data,"cantidad",False)
	valores+=getValorRipNro(data,"coeficiente",True)
	return columnas+" VALUES "+valores
def getLiquidacion(id):
	return db.liquidaciones.find_one({"_id":id})
def ingresarFacturas(liquidacion,idProfesional):
	for data in liquidacion['facturas']:
		cadena="insert into facturasProfesional "+getCadenaInsert(data,idProfesional)
		id=exeRemote(cadena)
		cadena="insert into liquidacionesWeb_facturas "+getCadenaInsertLiquidacion_factura(id,liquidacion['_id'])
		print cadena
		exeRemote(cadena)

def ingresarLiquidacion(liquidacion, idProfesional):
	cadena="insert into liquidacionesWeb "+getCadenaInsertLiquidacion(liquidacion, idProfesional)
	try:
		exeRemote(cadena)
	except:
		sys.exit("Esta liquidacion ya existe en el servidor REMOTO.. por favor elimine primero desde la asociacion y vuelva a intentarlo")

def syncFacturas(liquidacion):
	idProfesional=getIdProfesional(liquidacion['idUsuario'])
	ingresarLiquidacion(liquidacion, idProfesional)
	ingresarFacturas(liquidacion,idProfesional)

syncFacturas(getLiquidacion(str(sys.argv[1])))
cambiaEstadoLiquidacion(str(sys.argv[1]))