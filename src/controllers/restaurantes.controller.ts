import axios from "axios";
import { Request, Response } from 'express';
import { RestaurantRequest } from "../modelos/restaurants";
import logsController from "./logs.controller";
import jwt from 'jsonwebtoken'

class RestaurtesController{
    constructor(){}
    
    public async getRestaurant( req: Request, res: Response): Promise<void>{
        const body = req.body;
        let url: string = '';
        if( body.ciudad ){
            url = `https://api.documenu.com/v2/restaurants/state/${body.ciudad}`;
        } else if ( body.lat && body.lng ) {
            url = `https://api.documenu.com/v2/restaurants/search/geo?lat=${Number(body.lat)}&lon=${Number(body.lng)}&distance=1&fullmenu`;
        } else {
            res.status(200).json({
                OK: false,
                data: 'Debe ingresar una ciudad o las coordenadas'
            })
        }
        axios.get(url, {
        headers:{
            "x-api-key": "a700be1b3bbba0d411a0e5fedfafb62b"
        }
    }).then( x => {
        logsController.logs(`Solicitud Restaurantes: ${url}`, body.user, 'No');
        let token = jwt.sign({
            usuario: body.user
        }, 'secret', {expiresIn: 60 * 60});
        res.status(200).json({
            OK: true,
            data: x.data,
            token
        })
    }).catch((err) => {
        logsController.logs(`Solicitud Restaurantes: ${url}`, body.user, err);
        res.status(200).json({
            OK: false,
            data: err
        })
    });
}
}
const restaurantsController = new RestaurtesController();
export default restaurantsController;