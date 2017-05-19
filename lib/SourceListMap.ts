/*
 MIT License http://www.opensource.org/licenses/mit-license.php
 Author Tobias Koppers @sokra
 */
import CodeNode = require('./CodeNode');
import SourceNode = require('./SourceNode');
import MappingsContext = require('./MappingsContext');

type NodeAlias = CodeNode | SourceNode

class SourceListMap {
    children: (SourceNode | CodeNode)[]

    constructor(generatedCode: string | SourceNode | CodeNode | SourceListMap, source: string, originalSource: string)
    constructor(generatedCode: (SourceNode | CodeNode)[])

    constructor(generatedCode?, source?, originalSource?) {
        if (Array.isArray(generatedCode)) {
            this.children = generatedCode;
        }
        else {
            this.children = [];
            if (generatedCode || source) {
                this.add(generatedCode, source, originalSource);
            }
        }
    }

    add(generatedCode: string | CodeNode | SourceNode | SourceListMap, source?: string, originalSource?: string) {
        if (typeof generatedCode === 'string') {
            if (source) {
                this.children.push(new SourceNode(generatedCode, source, originalSource as string));
            }
            else if (this.children.length > 0 && (<CodeNode>this.children[this.children.length - 1]).addGeneratedCode) {
                (<CodeNode>this.children[this.children.length - 1]).addGeneratedCode(generatedCode);
            }
            else {
                this.children.push(new CodeNode(generatedCode));
            }
        }
        else if ((<NodeAlias>generatedCode).getMappings && (<NodeAlias>generatedCode).getGeneratedCode) {
            this.children.push(<NodeAlias>generatedCode);
        }
        else if ((<SourceListMap>generatedCode).children) {
            (<SourceListMap>generatedCode).children.forEach(function (sln) {
                this.children.push(sln);
            }, this);
        }
        else {
            throw new Error('Invalid arguments to SourceListMap.prototype.add: Expected string, Node or SourceListMap');
        }
    }

    prepend(generatedCode: SourceListMap | SourceNode | CodeNode, source?: string, originalSource?: string) {
        if (typeof generatedCode === 'string') {
            if (source) {
                this.children.unshift(new SourceNode(generatedCode, source, originalSource as string));
            }
            else if (this.children.length > 0 && this.children[this.children.length - 1].preprendGeneratedCode) {
                this.children[this.children.length - 1].preprendGeneratedCode(generatedCode);
            }
            else {
                this.children.unshift(new CodeNode(generatedCode));
            }
        }
        else if ((<NodeAlias>generatedCode).getMappings && (<NodeAlias>generatedCode).getGeneratedCode) {
            this.children.unshift(<NodeAlias>generatedCode);
        }
        else if ((<SourceListMap>generatedCode).children) {
            (<SourceListMap>generatedCode).children.slice().reverse().forEach(function (sln) {
                this.children.unshift(sln);
            }, this);
        }
        else {
            throw new Error('Invalid arguments to SourceListMap.prototype.prerend: Expected string, Node or SourceListMap');
        }
    }

    mapGeneratedCode(fn: (code: string) => string) {
        this.children.forEach((sln: NodeAlias) => {
            sln.mapGeneratedCode(fn);
        });
    }

    toString() {
        return this.children.map((sln: NodeAlias) =>
            sln.getGeneratedCode()
        ).join('');
    }

    toStringWithSourceMap(
        options: {
            file: any
        }
    ) {
        const mappingsContext = new MappingsContext();
        const source = this.children.map((sln: NodeAlias) => sln.generatedCode).join('');
        const mappings = this.children.map((sln: NodeAlias) =>
                sln.getMappings(mappingsContext)
            )
            .join('');
        return {
            source,
            map: {
                version: 3,
                file: options && options.file,
                sources: mappingsContext.sources,
                sourcesContent: mappingsContext.hasSourceContent ? mappingsContext.sourcesContent : undefined,
                mappings
            }
        };
    }
}

export = SourceListMap;
