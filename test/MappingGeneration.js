var should = require("should");
var SourceListMap = require("../").SourceListMap;
var SingleLineNode = require("../lib/SingleLineNode");
var SourceNode = require("../lib/SourceNode");

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
	it("should generate the same mappings for SingleLine and normal node", function() {
		var map1 = new SourceListMap();
		var map2 = new SourceListMap();
		map1.add(new SingleLineNode("abc", "abc", "source", 10));
		map2.add(new SourceNode("abc", "abc", "source", 10));
		[map1, map2].forEach(map => {
			map.add("\n\n");
			map.add("Source Code\n", "file.txt", "Source\nCode\n");
		})
		var result1 = map1.toStringWithSourceMap({ file: "test.txt" });
		var result2 = map2.toStringWithSourceMap({ file: "test.txt" });
		result2.should.be.eql(result1);
	})
});
