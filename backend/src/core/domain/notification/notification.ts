export type NotificationErrorProps = {
  message: string;
  context: string;
};

export class Notification {
  private readonly errors: NotificationErrorProps[] = [];

  addError(error: NotificationErrorProps): void {
    this.errors.push(error);
  }

  hasErrors(): boolean {
    return this.errors.length > 0;
  }

  getErrors(): NotificationErrorProps[] {
    return [...this.errors];
  }

  clear(): void {
    this.errors.length = 0;
  }

  messages(context?: string): string {
    return this.errors
      .filter((error) => !context || error.context === context)
      .map((error) => `${error.context}: ${error.message}`)
      .join(', ');
  }
}
