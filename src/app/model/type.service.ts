export type token = {
    token: string;
}

export type Member = {
    Business_Area: string;
    Ultimate_Recipient: string;
    Total_Gifts: number;
    Total_Accepted_Gifts: number;
    Gifts: Gift[];
    _id: string;
}

export type Gift = {
    Date_of_Offer: string
    Offered_to: string
    Offered_From: string
    Description_of_offer: string
    Reason_for_offer: string
    Details_of_contract: string
    Estimated_Gift_Value: string
    Action_Taken: string
    hash: string
}

export type MemberForm = {
    _id: string;
    Ultimate_Recipient: string;
}

export type BaForm = {
    Business_Area: string;
}

export type Ba = {
    Business_Area: string;
    Total_Gifts: number;
    Gifts: Gift[];
}

export type MemberGifts = {
    Gifts: Gift[];
    Total_Gifts: number;
    Total_Accepted_Gifts: number;
    Ultimate_Recipient: string;
}

export type BusinessForm = {
    _id: string;
}

export type Business = {
    _id: string;
    Gifts: Gift[];
    Total_Gifts: number;
    Total_Accepted_Gifts: number;
}