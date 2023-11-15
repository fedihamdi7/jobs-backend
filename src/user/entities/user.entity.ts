import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as bcrypt from 'bcrypt';

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