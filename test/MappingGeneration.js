var should = require("should");
var SourceListMap = require("../").SourceListMap;

describe("MappingGeneration", function() {
	it("should generate mappings", function() {
		var map = new SourceListMap();
		map.add("Gen\nCode ");
		map.add("Source\nCode\n", "file.txt", "Source\nCode\n");
		map.add("Gen ");
		map.add("Code ");
		map.add("Source\nCode", "file.txt", "Source\nCode\n");
		var result = map.toStringWithSourceMap({ file: "test.txt" });
		result.source.should.be.eql("Gen\nCode Source\nCode\nGen Code Source\nCode");
		result.map.sourcesContent[0].should.be.eql("Source\nCode\n");
		result.map.mappings.should.be.eql(";A,KAAA;AACA;A,SADA;AACA");
	})
});
