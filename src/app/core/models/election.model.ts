export class Election {
    constructor() {
        this.status = ElectionStatus.DRAFT;
    }

    id?: string;
    title: string;
    titleUppercase: string;
    candidates: any[];
    startDate: Date;
    endDate: Date;
    status: string;
    preliminaryResults: {};
    finalResults: {};
    winner: any[];
}

export class VotedUser {
    constructor() {
        this.insertDate = new Date();
    }

    id?: string;
    insertDate: Date;
}

export class Vote {
    constructor(nominee: string) {
        this.nominee = nominee;
        this.insertDate = new Date();
    }
    id?: string;
    nominee: string;
    insertDate: Date;
}

export enum ElectionStatus {
    DRAFT = 'draft',
    OPEN = 'open',
    CLOSED = 'closed',
}
