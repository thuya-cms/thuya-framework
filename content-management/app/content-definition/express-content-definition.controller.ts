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

        this.router.post("/content-definition", this.createContentDefinition.bind(this));
        this.router.get("/content-definition/name/:name", this.readContentDefinitionByName.bind(this));
        this.router.get("/content-definition", this.listContentDefinitions.bind(this));
        this.router.patch("/content-definition", this.updateContentDefinition.bind(this));
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
            const contentDefinitionDTO = await this.convertExpressToAppDTO(expressContentDefinitionDTO);
    
            const createContentDefinitionResult = await contentDefinitionManager.createContentDefinition(contentDefinitionDTO);
            if (createContentDefinitionResult.getIsFailing()) {
                throw new Error(createContentDefinitionResult.getMessage());
            }

            response.status(201).json({
                id: createContentDefinitionResult.getResult()!
            });
        }

        catch (error: any) {
            response.status(500).json({
                message: error.message
            });
        }
    }
    
    private async updateContentDefinition(request: Request, response: Response): Promise<void> {
        try {
            const expressContentDefinitionDTO: ExpressContentDefinitionDTO = request.body;
            const contentDefinitionDTO = await this.convertExpressToAppDTO(expressContentDefinitionDTO);
    
            const updateContentDefinitionResult = await contentDefinitionManager.updateContentDefinition(contentDefinitionDTO);
            if (updateContentDefinitionResult.getIsFailing()) {
                throw new Error(updateContentDefinitionResult.getMessage());
            }

            response.status(201).json({
                id: updateContentDefinitionResult.getResult()!
            });
        }

        catch (error: any) {
            response.status(500).json({
                message: error.message
            });
        }
    }

    private async readContentDefinitionByName(request: Request, response: Response): Promise<void> {
        try {
            const name: string = request.params.name;
            const readContentDefinitionResult = await contentDefinitionManager.readContentDefinitionByName(name);
            if (readContentDefinitionResult.getIsFailing()) {
                throw new Error(readContentDefinitionResult.getMessage());
            }

            const expressContentDefinitionDTO = this.convertAppToExpressDTO(readContentDefinitionResult.getResult()!);

            response.status(200).json(expressContentDefinitionDTO);
        }

        catch (error: any) {
            response.status(500).json({
                message: error.message
            });
        }
    }

    private async listContentDefinitions(request: Request, response: Response): Promise<void> {
        try {
            const expressContentDefinitionDTOs: ExpressContentDefinitionDTO[] = [];
            const listContentDefinitionResult = await contentDefinitionManager.listContentDefinitions();
            if (listContentDefinitionResult.getIsFailing()) {
                throw new Error(listContentDefinitionResult.getMessage());
            }

            for (const contentDefinitionDTO of listContentDefinitionResult.getResult()!) {
                const expressContentDefinitionDTO = this.convertAppToExpressDTO(contentDefinitionDTO);
                expressContentDefinitionDTOs.push(expressContentDefinitionDTO);
            }

            response.status(200).json(expressContentDefinitionDTOs);
        }

        catch (error: any) {
            response.status(500).json({
                message: error.message
            });
        }
    }
    
    private async convertExpressToAppDTO(expressContentDefinitionDTO: ExpressContentDefinitionDTO): Promise<ContentDefinitionDTO> {
        const contentDefinitionDTO = new ContentDefinitionDTO(expressContentDefinitionDTO.id || "", expressContentDefinitionDTO.name);

        if (expressContentDefinitionDTO.contentFields) {
            for (const expressContentFieldDTO of expressContentDefinitionDTO.contentFields) {
                const readContentFieldDefinitionResult = await contentDefinitionManager.readContentFieldDefinitionByName(expressContentFieldDTO.contentFieldDefinitionName);
                if (readContentFieldDefinitionResult.getIsFailing()) {
                    throw new Error(readContentFieldDefinitionResult.getMessage());
                }

                contentDefinitionDTO.addContentField(expressContentFieldDTO.name, readContentFieldDefinitionResult.getResult()!, expressContentFieldDTO.options);
            }
        }
        
        return contentDefinitionDTO;
    }

    private convertAppToExpressDTO(contentDefinitionDTO: ContentDefinitionDTO<any>): ExpressContentDefinitionDTO {
        const expressContentDefinitionDTO: ExpressContentDefinitionDTO = {
            id: contentDefinitionDTO.getId(),
            name: contentDefinitionDTO.getName(),
            contentFields: []
        };

        for (const contentField of contentDefinitionDTO.getContentFields()) {
            expressContentDefinitionDTO.contentFields.push({
                contentFieldDefinitionName: contentField.contentFieldDefinition.getName(),
                name: contentField.name,
                options: {
                    isRequired: contentField.options.isRequired || false,
                    isUnique: contentField.options.isUnique || false,
                    isIndexed: contentField.options.isIndexed || false
                }
            });
        }
        
        return expressContentDefinitionDTO;
    }
}

export default new ExpressContentDefinitionController();