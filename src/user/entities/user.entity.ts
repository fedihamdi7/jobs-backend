import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as bcrypt from 'bcrypt';


export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
    EMPLOYER = 'employer',
}
@Schema()
 export class User {

    @Prop()
    name: string;

    @Prop(
        {
            unique: true,
            trim: true,

        }
    )
    email: string;

    @Prop()
    password: string;

    @Prop({ default: 'default-profile-picture.jpg' })
    profilePic: string;
 
    @Prop({ type: String, enum: UserRole, default: UserRole.USER })
    role: UserRole;

    @Prop()
    phone: string;

    @Prop()
    address: string;

    @Prop()
    nationality: string;

    @Prop(
        {
            type: Date,
        }
    )
    birthDate: Date;

    @Prop()
    governorate: string;

    // TODO: 'add resume', links [github, linkedin, facebook, twitter, instagram],

    //TODO: add company user type

    //

}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next: any) {
    const user: any = this;
    if (!user.isModified('password')) return next();
    user.password = await bcrypt.hash(user.password, 10);
    next();
});