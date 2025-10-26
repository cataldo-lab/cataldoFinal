"use strict";
import { AppDataSource } from "../../config/configDb.js";
//import { encryptPassword } from "../../helpers/bcrypt.helper.js";
import { PaisSchema } from "../../entity/direccion/pais.entity.js";
import { RegionSchema } from "../../entity/direccion/region.entity.js";
import { ProvinciaSchema } from "../../entity/direccion/provincia.entity.js";
import { ComunaSchema } from "../../entity/direccion/comuna.entity.js";


const PaisRepository= AppDataSource.getRepository(PaisSchema);
const RegionRepository=AppDataSource.getRepository(RegionSchema);
const ProvinciaRepository= AppDataSource.getRepository(ProvinciaSchema);
const ComunaRepository= AppDataSource.getRepository(ComunaSchema);


export async function getPaisService() {
    try {
        const paises = await PaisRepository.find({
            relations: {
                regiones: {
                    provincias: {
                        comunas: true,
                    },
                },
            },
            order: {
                nombre_pais: "ASC",
                regiones: {
                    nombre_region: "ASC",
                    provincias: {
                        nombre_provincia: "ASC",
                        comunas: {
                            nombre_comuna: "ASC",
                        },
                    },
                },
            },
        });

        return paises;
    } catch (error) {
        console.error("❌ Error al obtener países:", error);
        throw new Error("No se pudieron obtener los países");
    }
}

//Create Pais
export async function addPaisService(nombre_pais) {
    try {
        const nuevoPais = PaisRepository.create({ nombre_pais });
        const paisGuardado = await PaisRepository.save(nuevoPais);
        return paisGuardado;
    } catch (error) {
        console.error("❌ Error al crear país:", error);
        throw new Error("No se pudo crear el país");
    }
}


//Create Region a un Pais
export async function addRegionToPaisService(id_pais, nombre_region) {
    try {
        const pais = await PaisRepository.findOne({ where: { id_pais } });
        if (!pais) {
            throw new Error(`No se encontró un país con ID ${id_pais}`);
        }

        const nuevaRegion = RegionRepository.create({
            nombre_region,
            pais, 
        });

        const regionGuardada = await RegionRepository.save(nuevaRegion);

        return regionGuardada;
    } catch (error) {
        console.error("❌ Error al agregar región al país:", error);
        throw new Error("No se pudo agregar la región al país");
    }
}

//Create Provincia a Region
export async function addProvinciaToRegionService(id_region, nombre_provincia) {
    try {
        const region = await RegionRepository.findOne({ where: { id_region } });
        if (!region) throw new Error(`No existe una región con ID ${id_region}`);

        const nuevaProvincia = ProvinciaRepository.create({
            nombre_provincia,
            region,
        });

        return await ProvinciaRepository.save(nuevaProvincia);
    } catch (error) {
        console.error("❌ Error al crear provincia:", error);
        throw new Error("No se pudo agregar la provincia a la región");
    }
}

//Create Comuna a una Provincia
export async function addComunaToProvinciaService(id_provincia, nombre_comuna) {
    try {
        const provincia = await ProvinciaRepository.findOne({ where: { id_provincia } });
        if (!provincia) throw new Error(`No existe una provincia con ID ${id_provincia}`);

        const nuevaComuna = ComunaRepository.create({
            nombre_comuna,
            provincia,
        });

        return await ComunaRepository.save(nuevaComuna);
    } catch (error) {
        console.error("❌ Error al crear comuna:", error);
        throw new Error("No se pudo agregar la comuna a la provincia");
    }
}


//Update Pais
export async function updatePaisService(id_pais, nombre_pais) {
    try {
        const pais = await PaisRepository.findOne({ where: { id_pais } });
        if (!pais) throw new Error(`No se encontró un país con ID ${id_pais}`);

        pais.nombre_pais = nombre_pais;
        return await PaisRepository.save(pais);
    } catch (error) {
        console.error("❌ Error al actualizar país:", error);
        throw new Error("No se pudo actualizar el país");
    }
}




//Update Region
export async function updateRegionService(id_region, data) {
    try {
        const region = await RegionRepository.findOne({
            where: { id_region },
            relations: { pais: true },
        });
        if (!region) throw new Error(`No existe una región con ID ${id_region}`);

        if (data.nombre_region) region.nombre_region = data.nombre_region;

        if (data.id_pais) {
            const PaisRepository = AppDataSource.getRepository(PaisSchema);
            const pais = await PaisRepository.findOne({ where: { id_pais: data.id_pais } });
            if (!pais) throw new Error(`No existe país con ID ${data.id_pais}`);
            region.pais = pais;
        }

        return await RegionRepository.save(region);
    } catch (error) {
        console.error("❌ Error al actualizar región:", error);
        throw new Error("No se pudo actualizar la región");
    }
}

//UpdateProvincia
export async function updateProvinciaService(id_provincia, data) {
    try {
        const provincia = await ProvinciaRepository.findOne({
            where: { id_provincia },
            relations: { region: true },
        });
        if (!provincia) throw new Error(`No existe una provincia con ID ${id_provincia}`);

        if (data.nombre_provincia) provincia.nombre_provincia = data.nombre_provincia;

        if (data.id_region) {
            const RegionRepository = AppDataSource.getRepository(RegionSchema);
            const region = await RegionRepository.findOne({ where: { id_region: data.id_region } });
            if (!region) throw new Error(`No existe región con ID ${data.id_region}`);
            provincia.region = region;
        }

        return await ProvinciaRepository.save(provincia);
    } catch (error) {
        console.error("❌ Error al actualizar provincia:", error);
        throw new Error("No se pudo actualizar la provincia");
    }
}

//update Comuna
export async function updateComunaService(id_comuna, data) {
    try {
        const comuna = await ComunaRepository.findOne({
            where: { id_comuna },
            relations: { provincia: true },
        });
        if (!comuna) throw new Error(`No existe una comuna con ID ${id_comuna}`);

        if (data.nombre_comuna) comuna.nombre_comuna = data.nombre_comuna;

        if (data.id_provincia) {
            const ProvinciaRepository = AppDataSource.getRepository(ProvinciaSchema);
            const provincia = await ProvinciaRepository.findOne({ where: { id_provincia: data.id_provincia } });
            if (!provincia) throw new Error(`No existe provincia con ID ${data.id_provincia}`);
            comuna.provincia = provincia;
        }

        return await ComunaRepository.save(comuna);
    } catch (error) {
        console.error("❌ Error al actualizar comuna:", error);
        throw new Error("No se pudo actualizar la comuna");
    }
}


