import { IsEmpty, IsNotEmpty, IsOptional } from "class-validator";
import { Types } from "mongoose";

export class CreateNegotiationDto {

    @IsNotEmpty()
    user_id: Types.ObjectId | string;

    @IsNotEmpty()
    company_id : Types.ObjectId;

    @IsNotEmpty()
    post_id : Types.ObjectId | string;

    @IsOptional()
    status : string;

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
    creationDate? : Date;

    @IsOptional()
    confirmations? : {user : boolean,company : boolean}

}
