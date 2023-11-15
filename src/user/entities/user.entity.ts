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

}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next: any) {
    const user: any = this;
    if (!user.isModified('password')) return next();
    user.password = await bcrypt.hash(user.password, 10);
    next();
});

// check if password is valid
UserSchema.methods.isValidPassword = async function (password: string) {
    const user: any = this;
    const compare = await bcrypt.compare(password, user.password);
    return compare;
};