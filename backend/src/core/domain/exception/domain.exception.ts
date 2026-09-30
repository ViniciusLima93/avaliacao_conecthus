export abstract class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class NotFoundException extends DomainException {}

export class ConflictException extends DomainException {}
