import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import * as bcrypt from 'bcrypt';


export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
    COMPANY = 'company',
}

export class UserAppliedNotification{
    _id : Types.ObjectId;
    message : string;
    createdAt : Date;
    seen : boolean;
    user : Types.ObjectId;
    post : Types.ObjectId;
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

    @Prop({ default: false })
    isVerified: boolean;

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

    @Prop()
    resume : string;

    @Prop({
        type: {
            _id : false,
            github: { type: String, default: null },
            linkedin: { type: String, default: null },
            facebook: { type: String, default: null },
            twitter: { type: String, default: null },
            instagram: { type: String, default: null },
            website: { type: String, default: null },
            location : {type : String, default : null}
        },
        default: {},
    })
    links: {
        [x: string]: any;
        github: string;
        linkedin: string;
        facebook: string;
        twitter: string;
        instagram: string;
        website: string;
        location : string;
    };

    @Prop({type : Types.ObjectId, ref : 'Post',default : []})
    postsAppliedIn : Types.ObjectId[];

    @Prop({type : Types.ObjectId, ref : 'Post', default : []})
    savedPosts : Types.ObjectId[];

    @Prop({default : []})
    notifications: UserAppliedNotification[];

}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next: any) {
    const user: any = this;
    if (!user.isModified('password')) return next();
    user.password = await bcrypt.hash(user.password, 10);
    next();
});


@Schema()
export class VerificationToken {
    @Prop({ type: Types.ObjectId, ref: 'User' })
    _userId: Types.ObjectId;

    @Prop()
    token: string;

    @Prop()
    createdAt: Date;
}

export const VerificationTokenSchema = SchemaFactory.createForClass(VerificationToken);