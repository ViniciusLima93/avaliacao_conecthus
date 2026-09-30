import { NotificationErrorProps } from './notification';

export class NotificationErrors extends Error {
  constructor(public readonly errors: NotificationErrorProps[]) {
    super(
      errors.map((error) => `${error.context}: ${error.message}`).join(', '),
    );
    this.name = 'NotificationErrors';
  }
}
