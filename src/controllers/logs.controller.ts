
import { Request, Response } from 'express';
import pool from '../database/conexion.database';
import jwt from 'jsonwebtoken'

class Logs{
    constructor(){}

    public async logs(action: string, data: string, err: string){
        const query = `INSERT INTO logs (fecha_log, action, query,  error ) \
        values (NOW(), '${action}', '${data}', '${err}')`;
        const connection =  await (await pool).getConnection();
        try {
            connection.beginTransaction();
            let q = connection.query(query);
            connection.commit();
            return true;
        } catch (err) {
            await connection.rollback();
            return err;
        } finally {
            /* CERRAR LA CONECCION CON LA BASE DE DATOS */
            (await pool).releaseConnection(connection);
        }
    }

    public async getLogs(req: Request, res: Response){
        const query = `SELECT * FROM logs ORDER BY fecha_log DESC`;
        const connection =  await (await pool).getConnection();
        const body = req.body;

        try {
            logsController.logs('VerLogs', body.user, 'NO');
            await connection.beginTransaction();
            let q = await connection.query(query);
            await connection.commit();
            let token = jwt.sign({
                usuario: body.user
            }, 'secret', {expiresIn: 60 * 60});
            res.status(200).json({
                OK: true,
                data: q,
                token
            });
        } catch (err) {
            logsController.logs('VerLogs Error', body.user, err.sqlMessage);
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
}
const logsController = new Logs();
export default logsController;