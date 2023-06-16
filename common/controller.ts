import { Router } from "express";

/**
 * A controller used in the REST API.
 */
interface IController {
    /**
     * Get the {@link Router} for a controller. 
     * 
     * @returns the {@link Router} of the controller
     */
    getRouter(): Router;
}

export default IController;