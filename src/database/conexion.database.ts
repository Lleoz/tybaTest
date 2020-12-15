import mysql from 'promise-mysql';
import Bluebird from 'bluebird';
import fs from 'fs'

class Conexion {
    public pool: Bluebird<mysql.Pool>;

    constructor() {
        this.pool = mysql.createPool({
            host: 'tybaprueba.mysql.database.azure.com',
            user: 'tyba@tybaprueba',
            password: 'Diciembre.2020',
            database: 'tyba',
            port: 3306,
            ssl  : {
                ca : fs.readFileSync(__dirname + '/BaltimoreCyberTrustRoot.crt.pem')
              }
        }).then();
        this.conexion();
    }



    public async conexion() {
        try {
            const connection = (await (await this.pool).getConnection());
            (await this.pool).releaseConnection(connection);
            console.log(`\nConectado a MySQL: \x1b[32m%s\x1b[0m`, 'online\n');

        } catch (err) {
            console.error(err);
        }
    }
}

const database = new Conexion();
export default database.pool;