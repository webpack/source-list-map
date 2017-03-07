var should = require("should");
var SourceListMap = require("../").SourceListMap;

describe("mapGeneratedCode", function() {
	it("should map generated code correctly", function() {
		var map = new SourceListMap();
		var source = [
			"Normal Line 1",
			"Normal Line 2",
			"$",
			"Normal Line 3",
			"Line A;Line B;Line C",
			"Line A;Line B;Line C",
			"No\\",
			"New\\",
			"Line 1",
			"No\\",
			"$",
			"New\\",
			"$",
			"$",
			"Line 2",
			"End Line"
		].join("\n");
		map.add(source + "\n", "file.txt", source + "\n");
		map.add(source + "\n", "file.txt", source + "\n");
		map.add(source + "\n");
		map.add(source, "file.txt", source);
		function mappingFunction(line) {
			return line.replace(/;/g, "\n").replace(/\\\n/g, " ").replace(/\$\n/g, "");
		}
		var newMap = map.mapGeneratedCode(mappingFunction);
		var result = newMap.toStringWithSourceMap({ file: "test.txt" });
		var expectedPart = [
			"AACA",
			"AAEA",
			"AACA",
			"AAAA",
			"AAAA",
			"AACA",
			"AAAA",
			"AAAA",
			"AACA,GACA,IACA",
			"AACA,GAEA,IAGA",
			"AACA"
		].join(";");
		result.map.mappings.should.be.eql([
			"AAAA",
			expectedPart,
			"AAfA",
			expectedPart,
			";;;;;;;;;;;",
			"AAfA",
			expectedPart
		].join(";"));
		result.source.should.be.eql(
			mappingFunction([source, source, source, source].join("\n"))
		);
	});
});
