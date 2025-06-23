# Changelog

## 2.0.0 (-)
v2 focuses on a more declarative API and stronger type checking
1. Added a base class and decorator for value modifiers
2. Changed the propertyType decorator with a condition - each class requires its own condition
3. All data/value types (at Extractor|Modifier|Validator) are now declared as `unknown` instead of `any`. This is required for better type checking and to reduce runtime errors
4. The method for creating an instance of a serializable class now expects all required properties of the class. Partial instance creation is also allowed by the `createPartial` function, but this does not guarantee that all properties will be defined
5. Removed useless Extractor generic type

## 1.2.2 (2024-07-12)

- Bugfix: Issue 44 - Fixed StringLengthValidator - validation on borders

## 1.2.1 (2024-05-21)

- Bugfix: Issue 42 - Fixed validation error on undefined array of serializable objects and undefined object with property validators

## 1.2.0 (2024-05-03)

- Feature: Issue 40 - Added property type validator

## 1.1.0 (2024-04-25)

- Feature: Issue 38 - Serializable validation errors

## 1.0.1 (2024-03-26)

- Bugfix: Issue 36 - Empty object while serializing array items without serializable type


## 1.0.0 (2024-02-27)

- New Feature: Data validation


## 0.7.0 (2024-01-09)

- Added Typescript 5 support
