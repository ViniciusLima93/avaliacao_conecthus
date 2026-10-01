import { Notification } from '../../../../core/domain/notification/notification';
import { NotificationErrors } from '../../../../core/domain/notification/notification.errors';
import { UserValidator } from '../validators/user.validator';
import { Email } from '../value-objects/email.vo';

export type UserProps = {
  id: string;
  name: string;
  registration: string;
  email: Email;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  /** Soft delete: data da exclusão, ou `null` enquanto o usuário existe. */
  deletedAt: Date | null;
};

export type UpdateUserProps = Partial<
  Pick<UserProps, 'name' | 'registration'> & { email: string }
>;

export class UserEntity {
  readonly notification = new Notification();

  private constructor(private readonly props: UserProps) {}

  /** Reconstrói a entidade a partir de dados já persistidos (sem validar). */
  static restore(props: UserProps): UserEntity {
    return new UserEntity(props);
  }

  /** Cria uma nova entidade e garante as invariantes de domínio. */
  static create(props: UserProps): UserEntity {
    const user = new UserEntity({
      ...props,
      name: props.name?.trim(),
      registration: props.registration?.trim(),
    });
    user.validate();
    return user;
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get registration(): string {
    return this.props.registration;
  }

  get email(): string {
    return this.props.email.getValue();
  }

  get password(): string {
    return this.props.password;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get deletedAt(): Date | null {
    return this.props.deletedAt;
  }

  get isDeleted(): boolean {
    return this.props.deletedAt !== null;
  }

  /** Soft delete: marca a exclusão; a linha continua no banco. */
  markAsDeleted(): void {
    if (this.isDeleted) return;
    this.props.deletedAt = new Date();
  }

  update(data: UpdateUserProps): void {
    if (data.name !== undefined) this.props.name = data.name.trim();
    if (data.registration !== undefined)
      this.props.registration = data.registration.trim();
    if (data.email !== undefined) this.props.email = Email.create(data.email);
    this.touch();
    this.validate();
  }

  changePassword(hashedPassword: string): void {
    this.props.password = hashedPassword;
    this.touch();
    this.validate();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  private validate(): void {
    new UserValidator().validate(this);
    if (this.notification.hasErrors()) {
      const errors = this.notification.getErrors();
      this.notification.clear();
      throw new NotificationErrors(errors);
    }
  }
}
