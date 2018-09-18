import { filter, isNull, isUndefined, keys, map, omit, reduce, size } from 'lodash';
import { FilterQuery, FindOneOptions, MongoClient, ObjectID } from 'mongodb';

const validateId = (id): ObjectID => (ObjectID.isValid(id) ? new ObjectID(id) : id);
const isEmpty = (value) => isUndefined(value) || isNull(value) || size(keys(value)) === 0;
const mapObjectId = (obj) => (obj ? { id: obj._id, ...omit(obj, ['_id']) } : undefined);

let client: MongoClient;
const getDb = async () => {
	if (!client) {
		client = await new MongoClient(process.env.MONGO_URL, { useNewUrlParser: true }).connect();
	}
	if (!client.isConnected) {
		client = await new MongoClient(process.env.MONGO_URL, { useNewUrlParser: true }).connect();
	}
	return client.db(process.env.MONGO_DBNAME);
};

const getCollection = async (collectionName: string) => (await getDb()).collection(collectionName);

const find = async (collection: string, query: FilterQuery<any> = {}, options: FindOneOptions = {}) => {
	const result = await (await getCollection(collection))
		.find(query, options)
		.map(mapObjectId)
		.toArray();
	return result;
};

const findAll = async (collection: string, options: FindOneOptions) => find(collection, {}, options);

const findOne = async (collection: string, query: FilterQuery<any>, options: FindOneOptions) => {
	const result = await (await getCollection(collection)).findOne(query, options);
	return mapObjectId(result);
};

const findById = async (collection: string, id, options: FindOneOptions) => findOne(collection, { _id: validateId(id) }, options);

const findByIds = (collection: string, ids, options: FindOneOptions) => find(collection, { _id: { $in: map(ids, (id) => validateId(id)) } }, options);

/**
 * o objeto data deve conter os campos a serem alterados
 * caso o campo seja null, o valor null será gravado (set)
 * desejando remover o campo, atribua undefined ao seu valor (unset)
 */
const upsert = async (collectionName: string, id, data) => {
	const set = reduce(filter(Object.keys(data), (k) => !isUndefined(data[k])), (acc, key) => ({ ...acc, [key]: data[key] }), {});
	const unset = reduce(filter(Object.keys(data), (k) => isUndefined(data[k])), (acc, key) => ({ ...acc, [key]: true }), {});
	const update = {
		...(isEmpty(set) ? {} : { $set: set }),
		...(isEmpty(unset) ? {} : { $unset: unset })
	};
	const collection = await getCollection(collectionName);
	const result = await collection.update({ _id: validateId(id) }, update, {
		upsert: true
	});
	return result;
};

const aggregate = async (collection: string, aggregate) =>
	await (await getCollection(collection)).aggregate(aggregate).toArray();

const insertOne = async (collection: string, json) => {
	const dbCollection = await getCollection(collection);
	const data = await dbCollection.insertOne(json);
	return data;
};

const updateOne = async (collection: string, filter: FilterQuery<any>, command) => {
	const dbCollection = await getCollection(collection);
	const data = await dbCollection.updateOne(filter, command, { upsert: true });
	return data;
};

const deleteOne = async (collection: string, id) => {
	const dbCollection = await getCollection(collection);
	const data = await dbCollection.deleteOne({ _id: validateId(id) });
	return data;
};

const count = async (collection: string, query: FilterQuery<any>) => (await getCollection(collection)).find(query).count();

export {
	getCollection,
	find,
	findAll,
	findOne,
	findById,
	findByIds,
	upsert,
	aggregate,
	insertOne,
	updateOne,
	deleteOne,
	count
};
