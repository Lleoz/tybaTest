import { Request, Response } from "express";
import pool from "../database/conexion.database";
import logsController from "./logs.controller";
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

class loginController {
    constructor(){}
    public async Login(req: Request, res: Response) {
        const body = req.body;
        let password = bcrypt.hashSync( body.password, 10);
        const query = `SELECT password \
        FROM usuarios \
        where user = '${body.user}'`;
        const connection = await (await pool).getConnection();
        
        try {
            await connection.beginTransaction();
            let q = await connection.query(query);
            await connection.commit();
            let match = await bcrypt.compare( body.password, q[0].password )
            if( q.length >= 1 && match ){
                logsController.logs('Login Correcto', body.user, 'No');
                let token = jwt.sign({
                    usuario: body.user
                }, 'secret', {expiresIn: 60 * 60});
                res.status(200).json({
                    OK: true,
                    data: {},
                    token,
                    expireIn: '3600'
                });
            } else {
                logsController.logs('Login Incorrecto', body.user, 'Usuario y/o contraseña erroneo');
                res.status(200).json({
                    OK: false,
                    data: "Usuario y/o contraseña erroneo",
                    token: ''
                });
            }
        } catch (err) {
            await connection.rollback();
            logsController.logs('Login Error', body.user, err.sqlMessage);
            res.status(200).json({
                OK: false,
                data: err.sqlMessage
            });
        } finally {
            /* CERRAR LA CONECCION CON LA BASE DE DATOS */
            (await pool).releaseConnection(connection);
        }
    }
    
    public async CreateUser(req: Request, res: Response) {
        const body = req.body;
        if( !body.nombre || !body.user || !body.password ){
            logsController.logs('Nuevo Usuario', '', 'Datos Invalidos');
            return res.status(200).json({
                OK: false,
                data: 'Datos Invalidos'
            });
        }
        let password = bcrypt.hashSync( body.password, 10);
        const query = `INSERT INTO usuarios \
        (nombre, user, password) values\
        ('${body.nombre}', '${body.user}', '${password}')`;
        
        const connection = await (await pool).getConnection();
        try {
            logsController.logs('Nuevo Usuario', body.user, 'NO');
            await connection.beginTransaction();
            let q = await connection.query(query);
            await connection.commit();
            res.status(200).json({
                OK: true,
                data: {}
            });
        } catch (err) {
            logsController.logs('Nuevo Usuario', body.user, err.sqlMessage);
            await connection.rollback();
            res.status(200).json({
                OK: false,
                data: err.sqlMessage
            });
        } finally {
            /* CERRAR LA CONECCION CON LA BASE DE DATOS */
            (await pool).releaseConnection(connection);
        }
    }
    public async Logout(req: Request, res: Response) {
        let token: string = req.get('token') || '';
        let body = req.body;
        logsController.logs('Logout', body.user, 'No');
        res.status(200).json({
            OK: true,
            data: {}
        });
    }
}



const login = new loginController(); 
export default login;