# Proyecto

Api-REST-USUARIOS

## Instalación

```bash
npm install
```

## Creación de Tabla

```bash
CREATE TABLE public.usuarios (
	id SERIAL PRIMARY KEY,
	cedula_identidad VARCHAR(15) NOT NULL,
	nombre VARCHAR NOT NULL,
	primer_apellido VARCHAR NULL,
	segundo_apellido VARCHAR NULL,
	fecha_nacimiento DATE NOT NULL
);
```


## Configuraciones

Crear y configurar archivo `.env` con datos requeridos, ejemplo `.env.sample`

## Inicialización

```bash
npm run dev
```


## Pruebas

Una vez inizializada, pueden probar las apis en el archivo `ApiRestTest.rest` donde se encuentran todos los metodos implementados.