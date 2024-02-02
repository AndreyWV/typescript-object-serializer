export class ValidationError {

  constructor(
    public message: string,
    public path: string,
  ) {
  }

}
