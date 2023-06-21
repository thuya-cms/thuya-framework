import { Request, Response, Router } from "express";
import IController from "../../../common/controller";
import ExpressContentDefinitionDTO from "./dto/express-content-definition-dto";
import contentDefinitionManager from "../content-definition-manager";
import ContentDefinitionDTO from "../dto/content-definition/content-definition";

/**
 * Controller for definition management through express.
 */
class ExpressContentDefinitionController implements IController {
    private router: Router;



    constructor() {
        this.router = Router();

        this.router.post("/content-definition", this.createContentDefinition);
    }
    
    
    
    /**
     * @inheritdoc
     */
    getRouter(): Router {
        return this.router;
    }


    private async createContentDefinition(request: Request, response: Response): Promise<void> {
        try {
            const expressContentDefinitionDTO: ExpressContentDefinitionDTO = request.body;
            const contentDefinitionDTO = new ContentDefinitionDTO("", expressContentDefinitionDTO.name);
            
            if (expressContentDefinitionDTO.contentFields) {
                for (const expressContentFieldDTO of expressContentDefinitionDTO.contentFields) {
                    const readContentFieldDefinitionResult = await contentDefinitionManager.readContentFieldDefinitionByName(expressContentFieldDTO.contentFieldDefinitionName);
                    if (readContentFieldDefinitionResult.getIsFailing()) {
                        throw new Error(readContentFieldDefinitionResult.getMessage());
                    }
    
                    contentDefinitionDTO.addContentField(expressContentFieldDTO.name, readContentFieldDefinitionResult.getResult()!, expressContentFieldDTO.options);
                }
            }
    
            const createContentDefinitionResult = await contentDefinitionManager.createContentDefinition(contentDefinitionDTO);
            if (createContentDefinitionResult.getIsFailing()) {
                throw new Error(createContentDefinitionResult.getMessage());
            }

            response.status(200).json({
                id: createContentDefinitionResult.getResult()!
            });
        }

        catch (error: any) {
            response.status(500).json({
                message: error.message
            });
        }
    }
}

export default new ExpressContentDefinitionController();