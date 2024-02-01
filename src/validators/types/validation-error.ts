export class ValidationError {

  constructor(
    public code: string,
    public message: string,
    public path: string,
  ) {
  }

}
