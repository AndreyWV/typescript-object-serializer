# typescript-object-serializer
Typescript library to convert javascript object to typescript class and vice versa

## Installation and configuration
```sh
npm install typescript-object-serializer
```

Required configure `tsconfig.json`:
```json
{
    "compilerOptions": {
        // ...
        "emitDecoratorMetadata": true,
        "experimentalDecorators": true,
        // ...
    }
}
```

## Usage
### Basic usage
```typescript
import {
    SerializableObject,
    property,
    ExtractorCamelCase,
} from 'typescript-object-serializer';

class Example extends SerializableObject {

    @property()
    public simpleProperty: string;
    
    @property(ExtractorCamelCase)
    public snakeCaseToCamelCaseProperty: string;

}

const example = Example.deserialize({
    simpleProperty: 'simple',
    snake_case_to_camel_case_property: 'snake',
});
console.log(example instanceof Example); // true
console.log(example.simpleProperty); // 'simple'
console.log(example.snakeCaseToCamelCaseProperty); // 'snake'

console.log(example.serialize()); // {simpleProperty: 'simple', snake_case_to_camel_case_property: 'snake'}
```
