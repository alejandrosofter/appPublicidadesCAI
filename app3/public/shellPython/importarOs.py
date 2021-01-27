import datetime
import time
import sys

from dateutil import parser
from config import db
from config import consultaRemote
from config import seEncuentra
from bson.objectid import ObjectId

def cargarNomencladores():
	db.nomencladores.remove({}) 
	for data in  consultaRemote("select * from facturasProfesional_rangoNomencladores order by fechaHasta desc"):
		aux=[]
		for dataNomenclador in  consultaRemote("select * from facturasProfesional_nomencladores where idRangoNomenclador="+str(data['id'])+""):
			aux.append({"_id":str(dataNomenclador['id']),"nombreNomenclador":dataNomenclador['detalle'],"idNomencladorAsociacion":dataNomenclador['id'],"codigoNomenclador":dataNomenclador['codigoInterno'],"importe":dataNomenclador['importe']})

		fechaDesde=datetime.datetime.now()
		fechaHasta=datetime.datetime.now()
		if data["fechaDesde"] is not None: fechaDesde=parser.parse(data['fechaDesde'].strftime("%Y-%m-%d"))
		if data["fechaHasta"] is not None: fechaHasta=parser.parse(data['fechaHasta'].strftime("%Y-%m-%d"))
		db.nomencladores.insert({"_id":str(data['id']),"fechaDesde": fechaDesde,"fechaDesde": fechaDesde,"fechaHasta": fechaHasta,"idObraSocial":data['idObraSocial'],"idAsociacion":data['id'],"nomencladores":aux})



def cargarObrasSociales():
	db.obrasSociales.remove({})
	for data in  consultaRemote("select * from obras_sociales"):
		if data['id']!="" and data['estado']=="ACTIVA": db.obrasSociales.insert({"_id":str(data['id']),"id":data['id'], "nombreOs": data['nombreOs'] })

cargarObrasSociales()
cargarNomencladores()


# !!!REQUIERE sudo pip install python-dateutil
