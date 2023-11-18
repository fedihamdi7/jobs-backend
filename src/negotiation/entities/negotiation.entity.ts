import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export enum StatusType {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
    PENDING_CONFIRMATION = 'PENDING_CONFIRMATION',
}

export enum WhereType {
    ONLINE = 'online',
    ONSITE = 'onsite'
}

@Schema()
export class Negotiation {

    @Prop({type: Types.ObjectId, ref: 'User'})
    user_id: Types.ObjectId;

    @Prop({type: Types.ObjectId, ref: 'User'})
    company_id: Types.ObjectId;

    @Prop({type: Types.ObjectId, ref: 'Post'})
    post_id: Types.ObjectId;

    @Prop({ default: StatusType.PENDING })
    status: string;

    @Prop({ type: { when: Date, where: String } })
    dateFromTheCompany: { when: Date, where: WhereType };

    @Prop({ type: { when: Date, where: String } })
    dateFromTheUser: { when: Date, where: String };

    @Prop({ type: { when: Date, where: String } })
    agreedOnDate: { when: Date, where: WhereType };

    @Prop()
    link: string;

    @Prop()
    additionalInfoCompany: string;

    @Prop()
    additionalInfoUser: string;

    @Prop(
        {
            default: () => {
                let date = new Date();
                date.setHours(date.getHours() + 1);
                return date;
            }
        }
    )
    creationDate: Date;

    @Prop({type :{user : Boolean,company : Boolean} , default: {user : false,company : false}})
    confirmations : {user : boolean,company : boolean}

}

export type NegotiationDocument = Negotiation & Document;
export const NegotiationSchema = SchemaFactory.createForClass(Negotiation);



