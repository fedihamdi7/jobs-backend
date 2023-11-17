import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema()
export class Post {

    @Prop()
    title: string;

    @Prop()
    description: string;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    company: Types.ObjectId;

    @Prop()
    numberOfAvailablePositions: number;

    @Prop()
    typeOfEmployment: string;

    @Prop()
    experienceLevel: string;

    // TODO: salary nzidou option mtaa more than
    @Prop()
    salary: string;

    @Prop()
    levelOfStudy: string;

    @Prop()
    language: string;

    @Prop()
    sexe: string;

    @Prop()
    numberOfSaved: number;

    @Prop()
    views: number;

    @Prop({default: 0})
    applicants: number;

    @Prop()
    accepted: number;

    @Prop()
    rejected: number;

    @Prop(
        {default: () => {
            let date = new Date();
            date.setHours(date.getHours() + 1);
            return date;
          }}
    )
    dateOfCreation: Date;

    @Prop()
    dateOfExpiration: Date;

}


export type PostDocument = Post & Document;
export const PostSchema = SchemaFactory.createForClass(Post);
