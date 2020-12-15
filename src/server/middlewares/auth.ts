import { Request, Response } from "express";
import jwt from 'jsonwebtoken'

class Auth{
    constructor(){}
    
    public verificarToken( req: Request, res: Response, next: () => void ){
        let token: string = req.get('token') || '';
        jwt.verify( token, 'secret', (err, decode) =>{
            if( err ){
                return res.status(401).json({
                    OK: false,
                    data: 'No autorizado'
                })
            }
            next();
        })
    }
}

const auth = new Auth(); 
export default auth;