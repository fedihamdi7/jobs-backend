import { IsEmpty, IsOptional } from "class-validator";

export class CreateNegotiationDto {

    @IsEmpty()
    user_id: string;

    @IsEmpty()
    company_id : string;

    @IsEmpty()
    post_id : string;

    @IsEmpty()
    state : string;

    @IsOptional()
    dateFromTheCompany: {when : Date, where: string};

    @IsOptional()
    dateFromTheUser: {when : Date, where: string};

    @IsOptional()
    agreedOnDate: {when : Date, where: string};

    @IsOptional()
    link : string;

    @IsOptional()
    additionalInfoCompany : string;

    @IsOptional()
    additionalInfoUser : string;

    @IsEmpty()
    creationDate : Date;

}
