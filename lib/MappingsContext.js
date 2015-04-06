/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
function MappingsContext() {
	this.sources = [];
	this.sourcesContent = [];
	this.currentOriginalLine = 1;
	this.currentSource = 0;
}
module.exports = MappingsContext;

MappingsContext.prototype.ensureSource = function(source, originalSource) {
	var idx = this.sources.indexOf(source);
	if(idx >= 0)
		return idx;
	idx = this.sources.length;
	this.sources.push(source);
	this.sourcesContent.push(originalSource);
	return idx;
};
