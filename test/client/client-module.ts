import { Router } from "express";
import IModule from "../../module";

class ClientModule implements IModule {
    router: Router;
    

    constructor() {
        this.router = Router();

        this.router.get("/test", (req, res, next) => {
            res.send("Test request.")
        });
    }
}

export default ClientModule;
