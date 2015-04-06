# source-list-map

## API

### Example

``` js
var SourceListMap = require("source-list-map").SourceListMap;

var map = new SourceListMap();
map.add("Generated\ncode1\n", "source-code.js", "Orginal\nsource");
map.add("Generated\ncode2\n");

map.toStringWithSourceMap({ file: "generated-code.js" });
// {
//   source: 'Generated\ncode1\nGenerated\ncode2\n',
//   map: {
//      version: 3,
//      file: 'generated-code.js',
//      sources: [ 'source-code.js' ],
//      sourcesContent: [ 'Orginal\nsource' ],
//      mappings: 'AAAA;AACA;;;'
//    }
// }
```

### `new SourceListMap()`

### `SourceListMap.prototype.add(generatedCode: string)`

### `SourceListMap.prototype.add(generatedCode: string, source: string, originalSource: string)`

### `SourceListMap.prototype.add(sourceListMap: SourceListMap)`

### `SourceListMap.prototype.prepend(generatedCode: string)`

### `SourceListMap.prototype.prepend(generatedCode: string, source: string, originalSource: string)`

### `SourceListMap.prototype.prepend(sourceListMap: SourceListMap)`

### `SourceListMap.prototype.toString()`

### `SourceListMap.prototype.toStringWithSourceMap(options: object)`

### `SourceListMap.prototype.mapGeneratedCode(fn: function(generatedCode: string))`
