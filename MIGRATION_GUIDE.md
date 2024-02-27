# Migration guide

## 1.0.0

Version has breaking change if you use custom Extractor at your project. It is required to change returning type of `extract()` method

Before:
```typescript
class DeepExtractor<T> extends Extractor<T> {
  public extract(data: any): T {
    if (typeof data !== 'object' || data === null) {
      return;
    }
    return this.transformBeforeExtract(
      DeepExtractor.getObjectByPath(data, this.key.split('.')),
    );
  }
  // See full DeepExtractor source code at README or playground
}
```
After:
```typescript
import { ExtractionResult } from 'typescript-object-serializer';

class DeepExtractor<T> extends Extractor<T> {
  public extract(data: any): ExtractionResult<T> {
    if (typeof data !== 'object' || data === null) {
      // Simple `return;` is also allowed here if you don't use validators
      return {
        data: undefined,
        path: this.key,
      };
    }
    return {
      data: this.transformBeforeExtract(
        DeepExtractor.getObjectByPath(data, this.key.split('.')),
      ),
      path: this.key,
    };
  }
  // See full DeepExtractor source code at README or playground
}
```
