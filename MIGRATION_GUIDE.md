# Migration guide

## 2.0.0

### 1. Conditional property types
Every type now should have its own condition

Before:
```typescript
class SuccessResult {
  @property()
  public data: any;
}
class FailedResult {
  @property()
  public error: string;
}

class Response {
  @property()
  @propertyType(value => value?.is_success ? SuccessResult : FailedResult) // <- Type condition
  public results: Array<SuccessResult | FailedResult>;
}
```

After:
```typescript
class SuccessResult {
  @property()
  public declare data: Record<string, unknown>;
}
class FailedResult {
  @property()
  public declare error: string;
}

class Response {
  @property()
  @propertyType(SuccessResult, (value: any) => value?.is_success) // <- Success result condition
  @propertyType(FailedResult, (value: any) => !value?.is_success) // <- Failed result condition
  public declare results: Array<SuccessResult | FailedResult>;
}

```

### 2. Value modifiers
Value modifiers (old name 'transformers') now have their own class and decorator. They are separate from extractors.

Before:
```typescript
class Person {

  @property(StraightExtractor.transform({
    onDeserialize: value => Number(value),
    onSerialize: value => String(value),
  }))
  public age: number;

}
```

After:
```typescript
class StringAgeModifier extends Modifier {
  public onSerialize(data: number): string {
    return String(data);
  }
  public onDeserialize(data: string): number {
    return Number(data);
  }
}

class Person {

  @property()
  @modifier(StringAgeModifier)
  public declare age: number;

}

```
Or short record:
```typescript
class Person {

  @property()
  @modifier(
    class extends Modifier {
      public onSerialize(data: number): string {
        return String(data);
      }
      public onDeserialize(data: string): number {
        return Number(data);
      }
    }
  )
  public declare age: number;

}

```

### 3. Use modifiers in extractors
An instance of the modifier is passed to extractors. It must be used when extracting or applying data.

Before:
```typescript
class SomeExtractor extends Extractor<T> {
  public extract(data: any): ExtractionResult<T> {
    return {
      data: this.transformBeforeExtract( // <- Call transformation on extraction
        data[this.key],
      ),
      path: this.key,
    }
  }
  public apply(applyObject: any, value: T): void {
    applyObject[this.key] = this.transformBeforeApply(value);  // <- Call transformation on applying
  }
}
```

After:
```typescript
class SomeExtractor extends Extractor {
  public extract(data: any): ExtractionResult {
    return {
      data: this.modifier.onDeserialize( // <- Call modification on extraction
        data[this.key],
      ),
      path: this.key,
    }
  }
  public apply(applyObject: any, value: any): void {
    applyObject[this.key] = this.modifier.onSerialize(value);  // <- Call modification on applying
  }
}
```

### 4. Remove useless extractor generic
The extractor handles any data type. It is not necessary to specify a generic type. If a special data type is expected by the extractor, a type check is recommended.

Before:
```typescript
class SomeExtractor extends Extractor<T> {
  public extract(data: any): ExtractionResult<T> {
    // ...
  }
  public apply(applyObject: any, value: T): void {
    // ...
  }
}
```

After:
```typescript
class SomeExtractor extends Extractor {
  public extract(data: any): ExtractionResult {
    // ...
  }
  public apply(applyObject: any, value: unknown): void {
    // ...
  }
}
```

### 5. Change function/method `create` to `createPartial` (if need, not recommended)
Function `create` now expects all required properties of the object to be passed. `createPartial` has same behavior as old `create`. If property is optional it should be declared with `optional` syntax - `?:`.

Before:
```typescript
class Person {
  @property()
  public declare name: string;
}
const person = create(Person); // <-- Possible to create an object with missing properties
```

After:
```typescript
class Person {
  @property()
  public declare name: string;
}
const person = create(Person , {}); // <-- Error since `name` is required
const person = createPartial(Person , {}); // <-- Possible to create an object with missing properties
```

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
