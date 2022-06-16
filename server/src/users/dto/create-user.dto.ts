export class CreateUserDto {
    readonly name: string;
    readonly email: string;
    readonly country: string;
    file: string;
    readonly birthdate: Object;
    password: string;
}
