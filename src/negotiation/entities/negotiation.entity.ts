import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

export enum StateType{
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED'
}

export enum WhereType{
    ONLINE = 'online',
    ONSITE = 'onsite'
}

@Schema()
export class Negotiation {

    @Prop()
    user_id: Types.ObjectId;

    @Prop()
    company_id : Types.ObjectId;

    @Prop()
    post_id : Types.ObjectId;

    @Prop({default: StateType.PENDING})
    state : StateType;

    @Prop()
    dateFromTheCompany: {when : Date, where: WhereType};

    @Prop()
    dateFromTheUser: {when : Date, where: WhereType};

    @Prop()
    agreedOnDate: {when : Date, where: WhereType};

    @Prop()
    link : string;

    @Prop()
    additionalInfoCompany : string;

    @Prop()
    additionalInfoUser : string;

    @Prop(
        {default: () => {
            let date = new Date();
            date.setHours(date.getHours() + 1);
            return date;
        }}
    )
    creationDate : Date;

}

export type NegotiationDocument = Negotiation & Document;
export const NegotiationSchema = SchemaFactory.createForClass(Negotiation);



