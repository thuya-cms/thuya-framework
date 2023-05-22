import { logger } from "../../common";
import IContentCache from "./content-cache.interface";

class LocalContentCache implements IContentCache {
    private content: { contentName: string, content: {
        lastAccessedAt: Date,
        data: any
    }[] }[] = [];
    private timeToLiveSeconds = 60;
    private maxContentCount = 15;
    
    
    
    setTimeToLive(timeToLiveSeconds: number): void {
        if (timeToLiveSeconds <= 0)
        {
            logger.error(`Invalid TTL: "%s".`, timeToLiveSeconds);
            throw new Error("Invalid TTL.");
        }

        this.timeToLiveSeconds = timeToLiveSeconds;
    }

    createContentSchema(): Promise<void> {
        return Promise.resolve();
    }

    createContent(contentName: string, content: any) {
        this.adjustCache();

        let existingContent = this.content.find(existingContent => existingContent.contentName === contentName);

        if (!existingContent) {
            existingContent = {
                contentName: contentName,
                content: []
            };

            this.content.push(existingContent);
        }

        existingContent.content.push({
            lastAccessedAt: new Date(),
            data: content
        });

        return Promise.resolve(content.id);
    }

    deleteContent(contentName: string, id: string): Promise<void> {
        const contentList = this.content.find(content => content.contentName === contentName);
        
        if (!contentList)
            throw new Error("Content not found.");

        const contentIndex = contentList.content.findIndex(content => content.data["id"] === id);

        if (contentIndex === -1)
            throw new Error("Content not found.");

        contentList.content.splice(contentIndex, 1);

        return Promise.resolve();
    }

    updateContent(contentName: string, content: any): Promise<void> {
        const contentList = this.content.find(content => content.contentName === contentName);
        
        if (!contentList)
            throw new Error("Content not found.");

        const oldContentIndex = contentList.content.findIndex(a => a.data["id"] === content.id);

        if (oldContentIndex === -1)
            throw new Error("Content not found.");

        contentList.content.splice(oldContentIndex, 1);
        contentList.content.push(content);

        return Promise.resolve();
    }

    listContent(contentName: string) {
        const result: any[] = [];
        const list = this.content.find(content => content.contentName === contentName);

        if (!list)
            return Promise.resolve([]);

        const ttlDate = new Date();
        ttlDate.setSeconds(ttlDate.getSeconds() + this.timeToLiveSeconds);

        for (let i = 0; i < list.content.length; i++) {
            if (list.content[i].lastAccessedAt >= ttlDate) {
                list.content.splice(i, 1);
            } else {
                result.push(list.content[i].data);
            }
        }

        return Promise.resolve(result);
    }

    readContent(contentName: string, id: string) {
        const contentList = this.content.find(content => content.contentName === contentName);
        
        if (!contentList)
            throw new Error("Content not found.");

        const contentIndex = contentList.content.findIndex(a => a.data["id"] === id);
        
        if (contentIndex === -1)
            throw new Error("Content not found.");

        const content = contentList.content[contentIndex];
        const ttlDate = new Date();
        ttlDate.setSeconds(ttlDate.getSeconds() + this.timeToLiveSeconds);

        if (content.lastAccessedAt >= ttlDate) {
            contentList.content.splice(contentIndex, 1);
            throw new Error("Content not found.");
        }

        return content.data;
    }

    readContentByFieldValue(fieldValue: { name: string; value: any; }, contentName: string) {
        const contentList = this.content.find(content => content.contentName === contentName);
        
        if (!contentList)
            throw new Error("Content not found.");

        const contentIndex = contentList.content.findIndex(content => content.data[fieldValue.name] === fieldValue.value);

        if (contentIndex === -1)
            throw new Error("Content not found.");

        const content = contentList.content[contentIndex];
        const ttlDate = new Date();
        ttlDate.setSeconds(ttlDate.getSeconds() + this.timeToLiveSeconds);

        if (content.lastAccessedAt >= ttlDate) {
            contentList.content.splice(contentIndex, 1);
            throw new Error("Content not found.");
        }

        return content.data;
    }

    clear() {
        this.content = [];
    }


    private adjustCache() {
        let elementsCount = 0;
        let earliestTTL: Date = new Date(9999, 12, 31);
        let latestContentName: string;
        let latestContentId: string;

        for (const content of this.content) {
            elementsCount += content.content.length;

            for (const element of content.content) {
                if (earliestTTL > element.lastAccessedAt) {
                    earliestTTL = element.lastAccessedAt;
                    latestContentName = content.contentName;
                    latestContentId = element.data.id;
                }
            }
        }

        if (elementsCount >= this.maxContentCount) {
            const latestContentIndex = this.content.findIndex(a => a.contentName === latestContentName);
            const startIndex = this.content[latestContentIndex].content.findIndex(b => b.data.id === latestContentId);
            this.content[latestContentIndex].content.splice(startIndex, 1);
        }
    }
}

export default new LocalContentCache();