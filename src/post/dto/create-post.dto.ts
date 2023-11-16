import { IsEmpty, IsNotEmpty, IsOptional } from "class-validator";

export class CreatePostDto {

    @IsNotEmpty({ message: 'The title is required' })
    title: string;

    @IsNotEmpty({ message: 'The description is required' })
    description: string;
    
    @IsEmpty()
    company: string;
    
    @IsNotEmpty({ message: 'The number of available positions is required' })
    numberOfAvailablePositions: number;
    
    @IsNotEmpty({ message: 'The type of employment is required' })
    typeOfEmployment: string;
    
    @IsOptional()
    experienceLevel: string;
    
    @IsOptional()
    salary: string;
    
    @IsOptional()
    levelOfStudy: string;
    
    @IsOptional()
    language: string;
    
    
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
    pending: number;
    
    @IsEmpty()
    dateOfCreation: Date;
    
    @IsOptional()
    dateOfExpiration: Date;
    
}
