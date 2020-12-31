export class Work {
    constructor(id:number, title:string, creator:string, thumb?:string) {
        this.id=id;
        this.title=title;
        this.creator=creator;
        this.thumb=thumb;
    }

    id:number;
    title:string;
    thumb:string;
    type:string;
    creator:string; // (@id | o:label) href = @id / p = o:label
    publisher:string; // (@id | o:label)
    contributor:string; // (@id | o:label)
    extent:string;
    medium:string;
    provenance:string;
    date:string;
    description:string;
    spatial:string;
    subject:string;
    isVersionOf:string;
    // relation:Object?

}