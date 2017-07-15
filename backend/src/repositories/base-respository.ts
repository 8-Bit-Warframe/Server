import {Document, Model, Query, Types} from 'mongoose';

interface IRead<T> {
    retrieve(): Query<T[]>;
    findOne(conditions?: object): Query<T>;
    find(conditions: object, options: object): Query<T[]>;
}

interface IWrite<T> {
    create(item: T): Promise<T>;
    update(id: Types.ObjectId, item: T): Query<T>;
    remove(id: Types.ObjectId): Query<T>;
}

export abstract class BaseRepository<T extends Document> implements IRead<T>, IWrite<T> {
    protected model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    retrieve(): Query<T[]> {
        return this.model.find({});
    }

    findOne(conditions?: object): Query<T> {
        return this.model.findOne(conditions);
    }

    find(conditions: object): Query<T[]> {
        return this.model.find(conditions);
    }

    create(item: T): Promise<T> {
        return this.model.create(item);
    }

    update(id: Types.ObjectId, item: T): Query<T> {
        return this.model.findByIdAndUpdate(id, item);
    }

    remove(id: Types.ObjectId): Query<T> {
        return this.model.findByIdAndRemove(id);
    }
}