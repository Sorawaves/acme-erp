# ACME ERP - Evaluación 4

Proyecto desarrollado para la Evaluación N°4 de Arquitectura On Premise & On Cloud.

## Descripción

Esta maqueta funcional implementa una solución ACME ERP en AWS, utilizando una arquitectura de alta disponibilidad con Load Balancer, Auto Scaling Group, instancias EC2, PostgreSQL dockerizado y una aplicación web desarrollada con Node.js y Express.

## Tecnologías utilizadas

- AWS EC2
- Elastic Load Balancer
- Auto Scaling Group
- Launch Template
- Amazon Machine Image
- CloudWatch
- Docker
- PostgreSQL
- Node.js
- Express
- JWT
- GitHub

## Ruta de trabajo

El proyecto fue desarrollado en la siguiente ruta dentro del servidor web EC2:

```bash
/srv/acme-erp/
```

## Funcionalidades implementadas

- Portal web ACME ERP.
- Login con usuario y contraseña.
- Generación de token JWT.
- Acceso privado mediante token.
- Conexión con base de datos PostgreSQL.
- Endpoint de salud para Load Balancer.

## Endpoints principales

```bash
GET /
GET /health
GET /db
POST /login
GET /privado
```

## Usuario de prueba

```text
Usuario: admin
Contraseña: 123456
```

## Auto Scaling

Configuración utilizada:

```text
Capacidad mínima: 2
Capacidad deseada: 3
Capacidad máxima: 4
```

## Arquitectura implementada

El acceso al sistema se realiza mediante un Application Load Balancer, el cual distribuye el tráfico hacia instancias EC2 creadas automáticamente por un Auto Scaling Group.

La base de datos PostgreSQL se ejecuta en Docker dentro de una instancia EC2 dedicada.

La aplicación web se encuentra desarrollada con Node.js y Express, integrando autenticación mediante token JWT para controlar el acceso a recursos privados.

## Consideración sobre AWS Academy

Las IP públicas de las instancias EC2 pueden cambiar al reiniciar el laboratorio de AWS Academy. Por este motivo, el acceso principal al aplicativo se realiza mediante el DNS del Load Balancer.

## Evidencia de funcionamiento

La aplicación fue validada mediante el DNS del Load Balancer, comprobando:

- Acceso al portal ACME ERP.
- Login con usuario y contraseña.
- Generación de token JWT.
- Acceso autorizado a recurso privado.
- Conexión correcta con PostgreSQL.
- Instancias saludables en el grupo de destino.
- Auto Scaling configurado con mínimo 2, deseado 3 y máximo 4 instancias.

## Comandos principales utilizados para pruebas

```bash
docker ps
```

```bash
docker exec -it postgres-acme psql -U admin -d acme -c "SELECT * FROM usuarios;"
```

```bash
sudo systemctl status acme-erp --no-pager
```

```bash
curl http://localhost:3000/health
```

```bash
curl http://localhost:3000/db
```

```bash
curl -X POST http://localhost:3000/login -H "Content-Type: application/json" -d '{"usuario":"admin","password":"123456"}'
```

## Integrantes

- Mabel Blasi
- Camilo Chihuailaf

## Estado del proyecto

Proyecto funcional implementado como maqueta de alta disponibilidad en AWS Academy.
