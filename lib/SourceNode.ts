/*
 MIT License http://www.opensource.org/licenses/mit-license.php
 Author Tobias Koppers @sokra
 */
import base64VLQ = require('./base64-vlq');
import { getNumberOfLines } from './helpers'
import MappingsContext = require('./MappingsContext')

const LINE_MAPPING = 'AACA;';
const LAST_LINE_MAPPING = 'AACA';

class SourceNode {
    constructor(
        public generatedCode: string,
        public source: string,
        public originalSource: string,
        public startingLine = 1
    ) {
    }

    clone() {
        return new SourceNode(this.generatedCode, this.source, this.originalSource, this.startingLine);
    }

    getGeneratedCode() {
        return this.generatedCode;
    }

    getMappings(mappingsContext: MappingsContext) {
        const lines = getNumberOfLines(this.generatedCode);
        const sourceIdx = mappingsContext.ensureSource(this.source, this.originalSource);
        let mappings = 'A'; // generated column 0
        mappings += base64VLQ.encode(sourceIdx - mappingsContext.currentSource); // source index
        mappings += base64VLQ.encode(this.startingLine - mappingsContext.currentOriginalLine); // original line index
        mappings += 'A'; // original column 0
        if (lines !== 0) {
            mappings += ';';
        }
        mappingsContext.currentSource = sourceIdx;
        mappingsContext.currentOriginalLine = (lines || 1) + this.startingLine - 1;
        mappings += Array(lines).join(LINE_MAPPING);
        if (lines !== 0 && this.generatedCode[this.generatedCode.length - 1] !== '\n') {
            mappings += LAST_LINE_MAPPING;
            mappingsContext.currentOriginalLine++;
        }
        return mappings;
    }

    mapGeneratedCode(fn: (code: string) => string) {
        this.generatedCode = fn(this.generatedCode);
    }
}

export = SourceNode;
