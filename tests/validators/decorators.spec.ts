import { RequiredValidator } from '../../src/validators/common/validators/required';
import { propertyValidators } from '../../src/validators/core/decorators/property-validators';

describe('@propertyValidators', () => {

  it('should declare validators by property', () => {

    class Test {

      @propertyValidators([
        RequiredValidator,
      ])
      public declare property: string;

    }

    const store = (Test as any)['typescript-object-serializer_validators'];

    expect(store.get(Test))
      .toEqual(
        new Map([
          [
            'property',
            [
              RequiredValidator,
            ],
          ],
        ]),
      );

  });

  it('should declare validators by constructor arguments', () => {

    class Test {

      constructor(
        @propertyValidators([
          RequiredValidator,
        ])
        public property: string,
      ) {
      }

    }

    const store = (Test as any)['typescript-object-serializer_validators'];

    expect(store.get(Test))
      .toEqual(
        new Map([
          [
            'property',
            [
              RequiredValidator,
            ],
          ],
        ]),
      );

  });

});
