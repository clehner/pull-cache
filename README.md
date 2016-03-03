# pull-cache

Cache a pull-stream source so that you can read it multiple times and the
underlying source only gets read once. Backpressure is respected, so if none of
the resulting cached sources are read, the underlying source is not read.

```js
var cache = require('pull-cache')

var sourceCache = pull(expensiveSource, cache)
pull(sourceCache(), ...)
pull(sourceCache(), ...)
pull(sourceCache(), ...)
```

## API

#### `cache(source): sourceCache`

Transform a readable stream `source` into a `sourceCache` function

#### `sourceCache(): cachedSource`

Return a new readable stream `cachedSource` that streams the same data as would
be read from `source`

#### `sourceCache(end, cb)`

Abort the underlying source and end its cached sources

## License

Copyright (c) 2016 Charles Lehner

Usage of the works is permitted provided that this instrument is
retained with the works, so that any entity that uses the works is
notified of this instrument.

DISCLAIMER: THE WORKS ARE WITHOUT WARRANTY.
