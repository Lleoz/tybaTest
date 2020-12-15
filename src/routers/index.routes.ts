import { Router } from 'express';
import loginController from '../controllers/login.controllers';
import restaurantsController from '../controllers/restaurantes.controller';
import auth from '../server/middlewares/auth';
import logsController from '../controllers/logs.controller';

class IndexRouter {

    // Router: Para poder configurar el tipo de peticion
    public router: Router = Router();
    
    constructor() {

        // Configuraciones de las rutas principales
        this.config();
    }

    config(): void {

        this.router.post('/login', loginController.Login);
        this.router.post('/logout', auth.verificarToken, loginController.Logout);
        this.router.post('/CreateUser', auth.verificarToken, loginController.CreateUser);
        this.router.post('/getRestaurant', auth.verificarToken, restaurantsController.getRestaurant);
        this.router.post('/getLogs', auth.verificarToken, logsController.getLogs);

    }
}

const indexRouter = new IndexRouter();
export default indexRouter.router;