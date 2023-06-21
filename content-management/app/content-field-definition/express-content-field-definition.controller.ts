import { Request, Response, Router } from "express";
import { IController } from "../../../common";
import ExpressContentFieldDefinitionDTO from "./dto/express-content-field-definition-dto";
import contentDefinitionManager from "../content-definition-manager";
import { ContentFieldDefinitionDTO, ContentFieldType } from "../dto/content-field-definition/content-field-definition";
import TextContentFieldDefinitionDTO from "../dto/content-field-definition/text-content-field-definition";
import NumericContentFieldDefinitionDTO from "../dto/content-field-definition/numeric-content-field-definition";
import DateContentFieldDefinitionDTO from "../dto/content-field-definition/date-content-field-definition";
import ArrayContentFieldDefinitionDTO from "../dto/content-field-definition/array-content-field-definition";
import GroupContentFieldDefinitionDTO from "../dto/content-field-definition/group-content-field-definition";

/**
 * Controller for content field definition management through express.
 */
class ExpressContentFieldDefinitionController implements IController {
    private router: Router;



    constructor() {
        this.router = Router();

        this.router.post("/content-field-definition", this.createContentFieldDefinition.bind(this));
        // this.router.get("/content-definition/name/:name", this.readContentDefinitionByName.bind(this));
        // this.router.get("/content-definition", this.listContentDefinitions.bind(this));
        this.router.delete("/content-field-definition/name/:name", this.deleteContentFieldDefinitionByName.bind(this));
    }
    
    
    
    /**
     * @inheritdoc
     */
    getRouter(): Router {
        return this.router;
    }


    private async createContentFieldDefinition(request: Request, response: Response): Promise<void> {
        try {
            const expressContentFieldDefinitionDTO: ExpressContentFieldDefinitionDTO = request.body;
            const contentFieldDefinitionDTO = await this.convertExpressToAppDTO(expressContentFieldDefinitionDTO);
    
            const createResult = await contentDefinitionManager.createContentFieldDefinition(contentFieldDefinitionDTO);
            if (createResult.getIsFailing()) {
                throw new Error(createResult.getMessage());
            }

            response.status(201).json({
                id: createResult.getResult()!
            });
        }

        catch (error: any) {
            response.status(500).json({
                message: error.message
            });
        }
    }
    
    private async deleteContentFieldDefinitionByName(request: Request, response: Response): Promise<void> {
        try {
            const contentFieldDefinitionName = request.params.name;
    
            const deleteResult = await contentDefinitionManager.deleteContentFieldDefinitionByName(contentFieldDefinitionName);
            if (deleteResult.getIsFailing()) {
                throw new Error(deleteResult.getMessage());
            }

            response.status(200).send();
        }

        catch (error: any) {
            response.status(500).json({
                message: error.message
            });
        }
    }

    private async convertExpressToAppDTO(expressContentDefinitionDTO: ExpressContentFieldDefinitionDTO): Promise<ContentFieldDefinitionDTO> {
        let contentFieldDefinitionDTO!: ContentFieldDefinitionDTO;
        
        switch (expressContentDefinitionDTO.type) {
            case ContentFieldType.Text: {
                contentFieldDefinitionDTO = new TextContentFieldDefinitionDTO(expressContentDefinitionDTO.id || "", expressContentDefinitionDTO.name);

                break;
            }

            case ContentFieldType.Numeric: {
                contentFieldDefinitionDTO = new NumericContentFieldDefinitionDTO(expressContentDefinitionDTO.id || "", expressContentDefinitionDTO.name);

                break;
            }
            
            case ContentFieldType.Date: {
                contentFieldDefinitionDTO = new DateContentFieldDefinitionDTO(expressContentDefinitionDTO.id || "", expressContentDefinitionDTO.name);

                break;
            }
            
            case ContentFieldType.Array: {
                if (!expressContentDefinitionDTO.arrayElementDefinitionName) {
                    throw new Error("Array element type is not defined.");
                }

                const readArrayElementResult = await contentDefinitionManager.readContentFieldDefinitionByName(expressContentDefinitionDTO.arrayElementDefinitionName);
                if (readArrayElementResult.getIsFailing()) {
                    throw new Error(readArrayElementResult.getMessage());
                }

                contentFieldDefinitionDTO = new ArrayContentFieldDefinitionDTO(expressContentDefinitionDTO.id || "", expressContentDefinitionDTO.name, readArrayElementResult.getResult()!);

                break;
            }

            case ContentFieldType.Group: {
                contentFieldDefinitionDTO = new GroupContentFieldDefinitionDTO(expressContentDefinitionDTO.id || "", expressContentDefinitionDTO.name);
                const groupContentFieldDefinitionDTO = contentFieldDefinitionDTO as GroupContentFieldDefinitionDTO;

                if (expressContentDefinitionDTO.groupElements) {
                    for (const groupElement of expressContentDefinitionDTO.groupElements) {
                        const readGroupElementResult = await contentDefinitionManager.readContentFieldDefinitionByName(groupElement.contentDefinitionName);
                        if (readGroupElementResult.getIsFailing()) {
                            throw new Error(readGroupElementResult.getMessage());
                        }

                        groupContentFieldDefinitionDTO.addContentField(groupElement.name, readGroupElementResult.getResult()!, groupElement.options);
                    }
                }

                break;
            }

            default: 
                throw new Error("Invalid type provided for content field definition.");
        }

        return contentFieldDefinitionDTO;
    }
}

export default new ExpressContentFieldDefinitionController();