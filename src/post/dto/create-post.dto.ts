import { IsEmpty, IsNotEmpty, IsOptional } from "class-validator";
import { Types } from "mongoose";

export class CreatePostDto {

    @IsNotEmpty({ message: 'The title is required' })
    title: string;

    @IsNotEmpty({ message: 'The description is required' })
    description: string;
    
    @IsEmpty()
    company: Types.ObjectId;
    
    @IsOptional()
    numberOfAvailablePositions: number;
    
    @IsOptional()
    typeOfEmployment: string[];
    
    @IsOptional()
    experienceLevel: string;
    
    @IsOptional()
    salary: string;
    
    @IsOptional()
    levelOfStudy: string[];
    
    @IsOptional()
    language: string[];
    
    
    @IsOptional()
    sexe: string;
    
    @IsEmpty()
    numberOfSaved: number;
    
    @IsEmpty()
    views: number;
    
    @IsEmpty()
    applicants: number;
    
    @IsEmpty()
    accepted: number;
    
    @IsEmpty()
    rejected: number;
    
    @IsEmpty()
    dateOfCreation: Date;
    
    @IsOptional()
    dateOfExpiration: Date;
    
    @IsOptional()
    isActive: boolean;
}
