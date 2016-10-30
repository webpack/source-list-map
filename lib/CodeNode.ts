/*
 MIT License http://www.opensource.org/licenses/mit-license.php
 Author Tobias Koppers @sokra
 */
import { getNumberOfLines } from './helpers'
import MappingsContext = require('./MappingsContext')

class CodeNode {
    constructor(public generatedCode: string) {
    }

    clone() {
        return new CodeNode(this.generatedCode);
    }

    getGeneratedCode() {
        return this.generatedCode;
    }

    getMappings(mappingsContext?: MappingsContext) {
        const lines = getNumberOfLines(this.generatedCode);
        return Array(lines + 1).join(';');
    }

    addGeneratedCode(generatedCode:string) {
        this.generatedCode += generatedCode;
    }

    mapGeneratedCode(fn: (code: string) => string) {
        this.generatedCode = fn(this.generatedCode);
    }
}

export = CodeNode;
