/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var base64VLQ = require("./base64-vlq");
var SourceNode = require("./SourceNode");
var CodeNode = require("./CodeNode");
var SourceListMap = require("./SourceListMap");

module.exports = function fromStringWithSourceMap(code, map) {
	var sources = map.sources;
	var sourcesContent = map.sourcesContent;
	var mappings = map.mappings.split(";");
	var lines = code.split("\n");
	var nodes = [];
	var currentNode = null;
	var currentLine = 1;
	var currentSourceIdx = 0;
	var currentSourceNodeLine;
	mappings.forEach(function(mapping, idx) {
		var line = lines[idx];
		if(idx !== lines.length - 1) line += "\n";
		if(!mapping)
			return addCode(line);
		mapping = { value: 0, rest: mapping };
		var lineAdded = false;
		while(mapping.rest)
			lineAdded = processMapping(mapping, line, lineAdded) || lineAdded;
		if(!lineAdded)
			addCode(line);
	});
	return new SourceListMap(nodes);
	function processMapping(mapping, line, ignore) {
		base64VLQ.decode(mapping.rest, mapping);
		if(!mapping.rest)
			return false;
		if(mapping.rest[0] === ",") {
			mapping.rest = mapping.rest.substr(1);
			return false;
		}

		base64VLQ.decode(mapping.rest, mapping);
		var sourceIdx = mapping.value + currentSourceIdx;
		currentSourceIdx = sourceIdx;

		base64VLQ.decode(mapping.rest, mapping);
		var linePosition = mapping.value + currentLine;
		currentLine = linePosition;

		if(!ignore) {
			addSource(line, sources[sourceIdx], sourcesContent[sourceIdx], linePosition)
			return true;
		}
	}
	function addCode(generatedCode) {
		if(currentNode && currentNode instanceof CodeNode) {
			currentNode.addGeneratedCode(generatedCode);
		} else {
			currentNode = new CodeNode(generatedCode);
			nodes.push(currentNode);
		}
	}
	function addSource(generatedCode, source, originalSource, linePosition) {
		if(currentNode && currentNode instanceof SourceNode &&
			currentNode.source === source &&
			currentSourceNodeLine === linePosition
		) {
			currentNode.generatedCode += generatedCode;
			currentSourceNodeLine++;
		} else {
			currentNode = new SourceNode(generatedCode, source, originalSource, linePosition);
			currentSourceNodeLine = linePosition + 1;
			nodes.push(currentNode);
		}
	}
};
