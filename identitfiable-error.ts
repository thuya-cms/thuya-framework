class IdentifiableError extends Error {
    constructor(private code: string, message: string) {
      super(message);
      this.name = "NamedError";
      this.code = code;
    }


    getCode(): string {
        return this.code;
    }
}

export default IdentifiableError;