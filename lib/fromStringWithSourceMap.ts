/*
 MIT License http://www.opensource.org/licenses/mit-license.php
 Author Tobias Koppers @sokra
 */
import base64VLQ = require('./base64-vlq');

import SourceNode = require('./SourceNode');
import CodeNode = require('./CodeNode');
import SourceListMap = require('./SourceListMap');

export = function fromStringWithSourceMap(
    code: string,
    map: {
        sources: (string | SourceNode | CodeNode) []
        sourcesContent: string[]
        mappings: string
    }
) {
    const sources = map.sources;
    const sourcesContent = map.sourcesContent;
    const mappings = map.mappings.split(';');
    const lines = code.split('\n');
    const nodes: (CodeNode | SourceNode)[] = [];
    let currentNode: CodeNode | SourceNode;
    let currentLine = 1;
    let currentSourceIdx = 0;
    let currentSourceNodeLine;
    mappings.forEach((mapping, idx) => {
        let line = lines[idx];
        if (typeof line === 'undefined') {
            return;
        }
        if (idx !== lines.length - 1) {
            line += '\n';
        }
        if (!mapping) {
            return addCode(line);
        }
        const mappingObj = { value: 0, rest: mapping };
        let lineAdded = false;
        while (mappingObj.rest) lineAdded = processMapping(mappingObj, line, lineAdded) || lineAdded;
        if (!lineAdded) {
            addCode(line);
        }
    });
    if (mappings.length < lines.length) {
        let idx = mappings.length;
        while (!lines[idx].trim() && idx < lines.length - 1) {
            addCode(`${lines[idx]}\n`);
            idx++;
        }
        addCode(lines.slice(idx).join('\n'));
    }
    return new SourceListMap(nodes);

    function processMapping(mapping, line, ignore) {
        if (mapping.rest && mapping.rest[0] !== ',') {
            base64VLQ.decode(mapping.rest, mapping);
        }
        if (!mapping.rest) {
            return false;
        }
        if (mapping.rest[0] === ',') {
            mapping.rest = mapping.rest.substr(1);
            return false;
        }

        base64VLQ.decode(mapping.rest, mapping);
        const sourceIdx = mapping.value + currentSourceIdx;
        currentSourceIdx = sourceIdx;

        let linePosition
        if (mapping.rest && mapping.rest[0] !== ',') {
            base64VLQ.decode(mapping.rest, mapping);
            linePosition = mapping.value + currentLine;
            currentLine = linePosition;
        }
        else {
            linePosition = currentLine;
        }

        if (mapping.rest) {
            let next = mapping.rest.indexOf(',');
            mapping.rest = next === -1 ? '' : mapping.rest.substr(next);
        }

        if (!ignore) {
            addSource(
                line,
                sources ? sources[sourceIdx] : null,
                sourcesContent ? sourcesContent[sourceIdx] : null,
                linePosition
            );
            return true;
        }
    }

    function addCode(generatedCode) {
        if (currentNode && (currentNode instanceof CodeNode)) {
            currentNode.addGeneratedCode(generatedCode);
        }
        else if (currentNode && currentNode instanceof SourceNode && !generatedCode.trim()) {
            currentNode.generatedCode += generatedCode;
            currentSourceNodeLine++;
        }
        else {
            currentNode = new CodeNode(generatedCode);
            nodes.push(currentNode);
        }
    }

    function addSource(generatedCode, source, originalSource, linePosition) {
        if (currentNode && currentNode instanceof SourceNode && currentNode.source === source && currentSourceNodeLine === linePosition) {
            currentNode.generatedCode += generatedCode;
            currentSourceNodeLine++;
        }
        else {
            currentNode = new SourceNode(generatedCode, source, originalSource, linePosition);
            currentSourceNodeLine = linePosition + 1;
            nodes.push(currentNode);
        }
    }
};
