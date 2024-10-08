const mongodb_classes = {
    AbstractCursor: {
      accessors: [
        'get closed(): boolean',
        'get id(): undefined | Long',
        'get killed(): boolean',
        'get loadBalanced(): boolean',
        'get namespace(): MongoDBNamespace',
        'get readConcern(): undefined | ReadConcern',
        'get readPreference(): ReadPreference',
        'set session(clientSession): void',
      ],
      methods: [
        '[asyncIterator](): AsyncGenerator<TSchema, void, void>',
        'addCursorFlag(flag, value): AbstractCursor<TSchema, CursorEvents>',
        'addListener<EventKey>(event, listener): AbstractCursor<TSchema, CursorEvents>',
        'batchSize(value): AbstractCursor<TSchema, CursorEvents>',
        'bufferedCount(): number',
        'clone(): AbstractCursor<TSchema, AbstractCursorEvents>',
        'close(): Promise<void>',
        'emit<EventKey>(event, ...args): boolean',
        'eventNames(): string[]',
        'forEach(iterator): Promise<void>',
        'getMaxListeners(): number',
        'hasNext(): Promise<boolean>',
        'listenerCount<EventKey>(type): number',
        'listeners<EventKey>(event): CursorEvents[EventKey][]',
        'map<T>(transform): AbstractCursor<T, AbstractCursorEvents>',
        'maxTimeMS(value): AbstractCursor<TSchema, CursorEvents>',
        'next(): Promise<null | TSchema>',
        'off<EventKey>(event, listener): AbstractCursor<TSchema, CursorEvents>',
        'on<EventKey>(event, listener): AbstractCursor<TSchema, CursorEvents>',
        'once<EventKey>(event, listener): AbstractCursor<TSchema, CursorEvents>',
        'prependListener<EventKey>(event, listener): AbstractCursor<TSchema, CursorEvents>',
      ],
    },
    Admin: {
      accessors: [],
      methods: [
        'buildInfo(options?): Promise<Document>',
        'command(command, options?): Promise<Document>',
        'listDatabases(options?): Promise<ListDatabasesResult>',
        'ping(options?): Promise<Document>',
        'removeUser(username, options?): Promise<boolean>',
        'replSetGetStatus(options?): Promise<Document>',
        'serverInfo(options?): Promise<Document>',
        'serverStatus(options?): Promise<Document>',
        'validateCollection(collectionName, options?): Promise<Document>',
      ],
    },
    AggregationCursor: {
      accessors: [
        'get closed(): boolean',
        'get id(): undefined | Long',
        'get killed(): boolean',
        'get loadBalanced(): boolean',
        'get namespace(): MongoDBNamespace',
        'get pipeline(): Document[]',
        'get readConcern(): undefined | ReadConcern',
        'get readPreference(): ReadPreference',
        'set session(clientSession): void',
      ],
      methods: [
        '[asyncIterator](): AsyncGenerator<TSchema, void, void>',
        'addCursorFlag(flag, value): AggregationCursor<TSchema>',
        'addListener<EventKey>(event, listener): AggregationCursor<TSchema>',
        'batchSize(value): AggregationCursor<TSchema>',
        'bufferedCount(): number',
        'clone(): AggregationCursor<TSchema>',
        'close(): Promise<void>',
        'emit<EventKey>(event, ...args): boolean',
        'eventNames(): string[]',
        'explain(verbosity?): Promise<Document>',
        'forEach(iterator): Promise<void>',
        'geoNear($geoNear): AggregationCursor<TSchema>',
        'getMaxListeners(): number',
        'group<T>($group): AggregationCursor<T>',
        'hasNext(): Promise<boolean>',
        'limit($limit): AggregationCursor<TSchema>',
        'listenerCount<EventKey>(type): number',
        'listeners<EventKey>(event): AbstractCursorEvents[EventKey][]',
        'lookup($lookup): AggregationCursor<TSchema>',
        'map<T>(transform): AggregationCursor<T>',
        'match($match): AggregationCursor<TSchema>',
        'maxTimeMS(value): AggregationCursor<TSchema>',
        'next(): Promise<null | TSchema>',
        'off<EventKey>(event, listener): AggregationCursor<TSchema>',
        'on<EventKey>(event, listener): AggregationCursor<TSchema>',
        'once<EventKey>(event, listener): AggregationCursor<TSchema>',
        'out($out): AggregationCursor<TSchema>',
        'prependListener<EventKey>(event, listener): AggregationCursor<TSchema>',
        'prependOnceListener<EventKey>(event, listener): AggregationCursor<TSchema>',
        'project<T>($project): AggregationCursor<T>',
        'rawListeners<EventKey>(event): AbstractCursorEvents[EventKey][]',
        'readBufferedDocuments(number?): TSchema[]',
        'redact($redact): AggregationCursor<TSchema>',
        'removeAllListeners<EventKey>(event?): AggregationCursor<TSchema>',
        'removeListener<EventKey>(event, listener): AggregationCursor<TSchema>',
        'rewind(): void',
        'setMaxListeners(n): AggregationCursor<TSchema>',
        'skip($skip): AggregationCursor<TSchema>',
        'sort($sort): AggregationCursor<TSchema>',
        'stream(options?): Readable & AsyncIterable<TSchema>',
        'toArray(): Promise<TSchema[]>',
        'tryNext(): Promise<null | TSchema>',
        'unwind($unwind): AggregationCursor<TSchema>',
        'withReadConcern(readConcern): AggregationCursor<TSchema>',
        'withReadPreference(readPreference): AggregationCursor<TSchema>',
      ],
    },
    Batch: {
      accessors: [],
      methods: [],
    },
    BulkOperationBase: {
      accessors: [
        'get batches(): Batch<Document>[]',
        'get bsonOptions(): BSONSerializeOptions',
        'get writeConcern(): undefined | WriteConcern',
      ],
      methods: [
        'addToOperationsList(batchType, document): BulkOperationBase',
        'execute(options?): Promise<BulkWriteResult>',
        'find(selector): FindOperators',
        'insert(document): BulkOperationBase',
        'raw(op): BulkOperationBase',
      ],
    },
    BulkWriteResult: {
      accessors: [
        'get ok(): number',
      ],
      methods: [
        'getRawResponse(): Document',
        'getUpsertedIdAt(index): undefined | Document',
        'getWriteConcernError(): undefined | WriteConcernError',
        'getWriteErrorAt(index): undefined | WriteError',
        'getWriteErrorCount(): number',
        'getWriteErrors(): WriteError[]',
        'hasWriteErrors(): boolean',
        'isOk(): boolean',
        'toString(): string',
      ],
    },
    CancellationToken: {
      accessors: [],
      methods: [
        'addListener<EventKey>(event, listener): CancellationToken',
        'emit<EventKey>(event, ...args): boolean',
        'eventNames(): string[]',
        'getMaxListeners(): number',
        'listenerCount<EventKey>(type): number',
        'off<EventKey>(event, listener): CancellationToken',
        'on<EventKey>(event, listener): CancellationToken',
        'once<EventKey>(event, listener): CancellationToken',
        'prependListener<EventKey>(event, listener): CancellationToken',
        'prependOnceListener<EventKey>(event, listener): CancellationToken',
        'rawListeners<EventKey>(event): { cancel() => void; }[EventKey][]',
        'removeAllListeners<EventKey>(event?): CancellationToken',
        'removeListener<EventKey>(event, listener): CancellationToken',
        'setMaxListeners(n): CancellationToken',
      ],
    },
    ChangeStream: {
      accessors: [
        'get closed(): boolean',
        'get resumeToken(): unknown',
      ],
      methods: [
        '[asyncIterator](): AsyncGenerator<TChange, void, void>',
        'addListener<EventKey>(event, listener): ChangeStream<TSchema, TChange>',
        'close(): Promise<void>',
        'emit<EventKey>(event, ...args): boolean',
        'eventNames(): string[]',
        'getMaxListeners(): number',
        'hasNext(): Promise<boolean>',
        'listenerCount<EventKey>(type): number',
        'listeners<EventKey>(event): ChangeStreamEvents<TSchema, TChange>[EventKey][]',
        'next(): Promise<TChange>',
        'off<EventKey>(event, listener): ChangeStream<TSchema, TChange>',
        'on<EventKey>(event, listener): ChangeStream<TSchema, TChange>',
        'once<EventKey>(event, listener): ChangeStream<TSchema, TChange>',
        'prependListener<EventKey>(event, listener): ChangeStream<TSchema, TChange>',
        'prependOnceListener<EventKey>(event, listener): ChangeStream<TSchema, TChange>',
        'rawListeners<EventKey>(event): ChangeStreamEvents<TSchema, TChange>[EventKey][]',
        'removeAllListeners<EventKey>(event?): ChangeStream<TSchema, TChange>',
        'removeListener<EventKey>(event, listener): ChangeStream<TSchema, TChange>',
        'setMaxListeners(n): ChangeStream<TSchema, TChange>',
        'stream(options?): Readable & AsyncIterable<TChange>',
        'tryNext(): Promise<null | TChange>',
      ],
    },
    ClientEncryption: {
      accessors: [
        'get libmongocryptVersion(): string',
      ],
      methods: [
        'addKeyAltName(_id, keyAltName): Promise<null | WithId<DataKey>>',
        'createDataKey(provider, options?): Promise<UUID>',
        'createEncryptedCollection<TSchema>(db, name, options): Promise<{ collection: Collection<TSchema>; encryptedFields: Document; }>',
        'decrypt<T>(value): Promise<T>',
        'deleteKey(_id): Promise<DeleteResult>',
        'encrypt(value, options): Promise<Binary>',
        'encryptExpression(expression, options): Promise<Binary>',
        'getKey(_id): Promise<null | DataKey>',
        'getKeyByAltName(keyAltName): Promise<null | WithId<DataKey>>',
        'getKeys(): FindCursor<DataKey>',
        'removeKeyAltName(_id, keyAltName): Promise<null | WithId<DataKey>>',
        'rewrapManyDataKey(filter, options): Promise<{ bulkWriteResult?: BulkWriteResult; }>',
      ],
    },
    ClientSession: {
      accessors: [
        'get id(): undefined | ServerSessionId',
        'get isPinned(): boolean',
        'get loadBalanced(): boolean',
        'get serverSession(): ServerSession',
        'get snapshotEnabled(): boolean',
      ],
      methods: [
        'abortTransaction(): Promise<void>',
        'addListener<EventKey>(event, listener): ClientSession',
        'advanceClusterTime(clusterTime): void',
        'advanceOperationTime(operationTime): void',
        'commitTransaction(): Promise<void>',
        'emit<EventKey>(event, ...args): boolean',
        'endSession(options?): Promise<void>',
        'equals(session): boolean',
        'eventNames(): string[]',
        'getMaxListeners(): number',
        'inTransaction(): boolean',
        'incrementTransactionNumber(): void',
        'listenerCount<EventKey>(type): number',
        'listeners<EventKey>(event): ClientSessionEvents[EventKey][]',
        'off<EventKey>(event, listener): ClientSession',
        'on<EventKey>(event, listener): ClientSession',
        'once<EventKey>(event, listener): ClientSession',
        'prependListener<EventKey>(event, listener): ClientSession',
        'prependOnceListener<EventKey>(event, listener): ClientSession',
        'rawListeners<EventKey>(event): ClientSessionEvents[EventKey][]',
        'removeAllListeners<EventKey>(event?): ClientSession',
        'removeListener<EventKey>(event, listener): ClientSession',
        'setMaxListeners(n): ClientSession',
        'startTransaction(options?): void',
        'toBSON(): never',
        'withTransaction<T>(fn, options?): Promise<T>',
      ],
    },
    Collection: {
      accessors: [
        'get bsonOptions(): BSONSerializeOptions',
        'get collectionName(): string',
        'get dbName(): string',
        'get hint(): undefined | Hint',
        'get namespace(): string',
        'get readConcern(): undefined | ReadConcern',
        'get readPreference(): undefined | ReadPreference',
        'get writeConcern(): undefined | WriteConcern',
      ],
      methods: [
        'aggregate<T>(pipeline?, options?): AggregationCursor<T>',
        'bulkWrite(operations, options?): Promise<BulkWriteResult>',
        'count(filter?, options?): Promise<number>',
        'countDocuments(filter?, options?): Promise<number>',
        'createIndex(indexSpec, options?): Promise<string>',
        'createIndexes(indexSpecs, options?): Promise<string[]>',
        'createSearchIndex(description): Promise<string>',
        'createSearchIndexes(descriptions): Promise<string[]>',
        'deleteMany(filter?, options?): Promise<DeleteResult>',
        'deleteOne(filter?, options?): Promise<DeleteResult>',
        'distinct<Key>(key): Promise<Flatten<WithId<TSchema>[Key]>[]>',
        'drop(options?): Promise<boolean>',
        'dropIndex(indexName, options?): Promise<Document>',
        'dropIndexes(options?): Promise<boolean>',
        'dropSearchIndex(name): Promise<void>',
        'estimatedDocumentCount(options?): Promise<number>',
        'find(): FindCursor<WithId<TSchema>>',
        'findOne(): Promise<null | WithId<TSchema>>',
        'findOneAndDelete(filter, options): Promise<ModifyResult<TSchema>>',
        'findOneAndReplace(filter, replacement, options): Promise<ModifyResult<TSchema>>',
        'findOneAndUpdate(filter, update, options): Promise<ModifyResult<TSchema>>',
        'indexExists(indexes, options?): Promise<boolean>',
        'indexInformation(options?): Promise<Document>',
        'indexes(options?): Promise<Document[]>',
        'initializeOrderedBulkOp(options?): OrderedBulkOperation',
        'initializeUnorderedBulkOp(options?): UnorderedBulkOperation',
        'insertMany(docs, options?): Promise<InsertManyResult<TSchema>>',
        'insertOne(doc, options?): Promise<InsertOneResult<TSchema>>',
        'isCapped(options?): Promise<boolean>',
        'listIndexes(options?): ListIndexesCursor',
        'listSearchIndexes(options?): ListSearchIndexesCursor',
        'rename(newName, options?): Promise<Collection<Document>>',
        'replaceOne(filter, replacement, options?): Promise<Document | UpdateResult<TSchema>>',
        'updateMany(filter, update, options?): Promise<UpdateResult<TSchema>>',
        'updateOne(filter, update, options?): Promise<UpdateResult<TSchema>>',
        'updateSearchIndex(name, definition): Promise<void>',
        'watch<TLocal, TChange>(pipeline?, options?): ChangeStream<TLocal, TChange>',
      ],
    },
    CommandFailedEvent: {
      accessors: [
        'get hasServiceId(): boolean',
      ],
      methods: [],
    },
    CommandStartedEvent: {
      accessors: [
        'get hasServiceId(): boolean',
      ],
      methods: [],
    },
    CommandSucceededEvent: {
      accessors: [
        'get hasServiceId(): boolean',
      ],
      methods: [],
    },
    ConnectionCheckOutFailedEvent: {
      accessors: [],
      methods: [],
    },
    ConnectionCheckOutStartedEvent: {
      accessors: [],
      methods: [],
    },
    ConnectionCheckedInEvent: {
      accessors: [],
      methods: [],
    },
    ConnectionCheckedOutEvent: {
      accessors: [],
      methods: [],
    },
    ConnectionClosedEvent: {
      accessors: [],
      methods: [],
    },
    ConnectionCreatedEvent: {
      accessors: [],
      methods: [],
    },
    ConnectionPoolClearedEvent: {
      accessors: [],
      methods: [],
    },
    ConnectionPoolClosedEvent: {
      accessors: [],
      methods: [],
    },
    ConnectionPoolCreatedEvent: {
      accessors: [],
      methods: [],
    },
    ConnectionPoolMonitoringEvent: {
      accessors: [],
      methods: [],
    },
    ConnectionPoolReadyEvent: {
      accessors: [],
      methods: [],
    },
    ConnectionReadyEvent: {
      accessors: [],
      methods: [],
    },
    Db: {
      accessors: [
        'get bsonOptions(): BSONSerializeOptions',
        'get databaseName(): string',
        'get namespace(): string',
        'get options(): undefined | DbOptions',
        'get readConcern(): undefined | ReadConcern',
        'get readPreference(): ReadPreference',
        'get secondaryOk(): boolean',
        'get writeConcern(): undefined | WriteConcern',
      ],
      methods: [
        'admin(): Admin',
        'aggregate<T>(pipeline?, options?): AggregationCursor<T>',
        'collection<TSchema>(name, options?): Collection<TSchema>',
        'collections(options?): Promise<Collection<Document>[]>',
        'command(command, options?): Promise<Document>',
        'createCollection<TSchema>(name, options?): Promise<Collection<TSchema>>',
        'createIndex(name, indexSpec, options?): Promise<string>',
        'dropCollection(name, options?): Promise<boolean>',
        'dropDatabase(options?): Promise<boolean>',
        'indexInformation(name, options?): Promise<Document>',
        'listCollections(filter, options): ListCollectionsCursor<Pick<CollectionInfo, "name" | "type">>',
        'profilingLevel(options?): Promise<string>',
        'removeUser(username, options?): Promise<boolean>',
        'renameCollection<TSchema>(fromCollection, toCollection, options?): Promise<Collection<TSchema>>',
        'runCursorCommand(command, options?): RunCommandCursor',
        'setProfilingLevel(level, options?): Promise<ProfilingLevel>',
        'stats(options?): Promise<Document>',
        'watch<TSchema, TChange>(pipeline?, options?): ChangeStream<TSchema, TChange>',
      ],
    },
    FindCursor: {
        accessors: [
            'get closed(): boolean',
            'get id(): undefined | Long',
            'get killed(): boolean',
            'get loadBalanced(): boolean',
            'get namespace(): MongoDBNamespace',
            'get readConcern(): undefined | ReadConcern',
            'get readPreference(): ReadPreference',
            'set session(clientSession): void',
        ],
        methods: [
            '[asyncIterator](): AsyncGenerator<TSchema, void, void>',
            'addCursorFlag(flag, value): FindCursor<TSchema>',
            'addListener<EventKey>(event, listener): FindCursor<TSchema>',
            'addQueryModifier(name, value): FindCursor<TSchema>',
            'allowDiskUse(allow?): FindCursor<TSchema>',
            'batchSize(value): FindCursor<TSchema>',
            'bufferedCount(): number',
            'clone(): FindCursor<TSchema>',
            'close(): Promise<void>',
            'collation(value): FindCursor<TSchema>',
            'comment(value): FindCursor<TSchema>',
            'count(options?): Promise<number>',
            'emit<EventKey>(event, ...args): boolean',
            'eventNames(): string[]',
            'explain(verbosity?): Promise<Document>',
            'filter(filter): FindCursor<TSchema>',
            'forEach(iterator): Promise<void>',
            'getMaxListeners(): number',
            'hasNext(): Promise<boolean>',
            'hint(hint): FindCursor<TSchema>',
            'limit(value): FindCursor<TSchema>',
            'listenerCount<EventKey>(type): number',
            'listeners<EventKey>(event): AbstractCursorEvents[EventKey][]',
            'map<T>(transform): FindCursor<T>',
            'max(max): FindCursor<TSchema>',
            'maxAwaitTimeMS(value): FindCursor<TSchema>',
            'maxTimeMS(value): FindCursor<TSchema>',
            'min(min): FindCursor<TSchema>',
            'next(): Promise<null | TSchema>',
            'off<EventKey>(event, listener): FindCursor<TSchema>',
            'on<EventKey>(event, listener): FindCursor<TSchema>',
            'once<EventKey>(event, listener): FindCursor<TSchema>',
            'prependListener<EventKey>(event, listener): FindCursor<TSchema>',
            'prependOnceListener<EventKey>(event, listener): FindCursor<TSchema>',
            'project<T>(value): FindCursor<T>',
            'rawListeners<EventKey>(event): AbstractCursorEvents[EventKey][]',
            'readBufferedDocuments(number?): TSchema[]',
            'removeAllListeners<EventKey>(event?): FindCursor<TSchema>',
            'removeListener<EventKey>(event, listener): FindCursor<TSchema>',
            'returnKey(value): FindCursor<TSchema>',
            'rewind(): void',
            'setMaxListeners(n): FindCursor<TSchema>',
            'showRecordId(value): FindCursor<TSchema>',
            'skip(value): FindCursor<TSchema>',
            'sort(sort, direction?): FindCursor<TSchema>',
            'stream(options?): Readable & AsyncIterable<TSchema>',
            'toArray(): Promise<TSchema[]>',
            'tryNext(): Promise<null | TSchema>',
            'withReadConcern(readConcern): FindCursor<TSchema>',
            'withReadPreference(readPreference): FindCursor<TSchema>'
        ],
    },
    FindOperators: {
        accessors: [],
        methods: [
            'arrayFilters(arrayFilters): FindOperators',
            'collation(collation): FindOperators',
            'delete(): BulkOperationBase',
            'deleteOne(): BulkOperationBase',
            'hint(hint): FindOperators',
            'replaceOne(replacement): BulkOperationBase',
            'update(updateDocument): BulkOperationBase',
            'updateOne(updateDocument): BulkOperationBase',
            'upsert(): FindOperators',
        ],
    },
    GridFSBucket: {
        accessors: [],
        methods: [
            'addListener<EventKey>(event, listener): GridFSBucket',
            'delete(id): Promise<void>',
            'drop(): Promise<void>',
            'emit<EventKey>(event, ...args): boolean',
            'eventNames(): string[]',
            'find(filter?, options?): FindCursor<GridFSFile>',
            'getMaxListeners(): number',
            'listenerCount<EventKey>(type): number',
            'listeners<EventKey>(event): GridFSBucketEvents[EventKey][]',
            'off<EventKey>(event, listener): GridFSBucket',
            'on<EventKey>(event, listener): GridFSBucket',
            'once<EventKey>(event, listener): GridFSBucket',
            'openDownloadStream(id, options?): GridFSBucketReadStream',
            'openDownloadStreamByName(filename, options?): GridFSBucketReadStream',
            'openUploadStream(filename, options?): GridFSBucketWriteStream',
            'openUploadStreamWithId(id, filename, options?): GridFSBucketWriteStream',
            'prependListener<EventKey>(event, listener): GridFSBucket',
            'prependOnceListener<EventKey>(event, listener): GridFSBucket',
            'rawListeners<EventKey>(event): GridFSBucketEvents[EventKey][]',
            'removeAllListeners<EventKey>(event?): GridFSBucket',
            'removeListener<EventKey>(event, listener): GridFSBucket',
            'rename(id, filename): Promise<void>',
            'setMaxListeners(n): GridFSBucket',
        ],
    },
    GridFSBucketReadStream: {
        accessors: [],
        methods: [
            'abort(): Promise<void>',
            'end(end?): GridFSBucketReadStream',
            'start(start?): GridFSBucketReadStream',
        ],
    },
    GridFSBucketWriteStream: {
        accessors: [],
        methods: [
            'abort(): Promise<void>',
        ],
    },
    HostAddress: {
        accessors: [],
        methods: [
            'inspect(): string',
            'toHostPort(): { host: string; port: number; }',
            'toString(): string',
            'fromHostPort(host, port): HostAddress',
            'fromSrvRecord(__namedParameters): HostAddress',
            'fromString(this, s): HostAddress',
        ],
    },
    ListCollectionsCursor: {
        accessors: [
            'get closed(): boolean',
            'get id(): undefined | Long',
            'get killed(): boolean',
            'get loadBalanced(): boolean',
            'get namespace(): MongoDBNamespace',
            'get readConcern(): undefined | ReadConcern',
            'get readPreference(): ReadPreference',
            'set session(clientSession): void',
        ],
        methods: [
            '[asyncIterator](): AsyncGenerator<T, void, void>',
            'addCursorFlag(flag, value): ListCollectionsCursor<T>',
            'addListener<EventKey>(event, listener): ListCollectionsCursor<T>',
            'batchSize(value): ListCollectionsCursor<T>',
            'bufferedCount(): number',
            'clone(): ListCollectionsCursor<T>',
            'close(): Promise<void>',
            'emit<EventKey>(event, ...args): boolean',
            'eventNames(): string[]',
            'forEach(iterator): Promise<void>',
            'getMaxListeners(): number',
            'hasNext(): Promise<boolean>',
            'listenerCount<EventKey>(type): number',
            'listeners<EventKey>(event): AbstractCursorEvents[EventKey][]',
            'map<T>(transform): AbstractCursor<T, AbstractCursorEvents>',
            'maxTimeMS(value): ListCollectionsCursor<T>',
            'next(): Promise<null | T>',
            'off<EventKey>(event, listener): ListCollectionsCursor<T>',
            'on<EventKey>(event, listener): ListCollectionsCursor<T>',
            'once<EventKey>(event, listener): ListCollectionsCursor<T>',
            'prependListener<EventKey>(event, listener): ListCollectionsCursor<T>',
            'prependOnceListener<EventKey>(event, listener): ListCollectionsCursor<T>',
            'rawListeners<EventKey>(event): AbstractCursorEvents[EventKey][]',
            'readBufferedDocuments(number?): T[]',
            'removeAllListeners<EventKey>(event?): ListCollectionsCursor<T>',
            'removeListener<EventKey>(event, listener): ListCollectionsCursor<T>',
            'rewind(): void',
            'setMaxListeners(n): ListCollectionsCursor<T>',
            'stream(options?): Readable & AsyncIterable<T>',
            'toArray(): Promise<T[]>',
            'tryNext(): Promise<null | T>',
            'withReadConcern(readConcern): ListCollectionsCursor<T>',
            'withReadPreference(readPreference): ListCollectionsCursor<T>',
        ],
    },
    ListIndexesCursor: {
        accessors: [
            'get closed(): boolean',
            'get id(): undefined | Long',
            'get killed(): boolean',
            'get loadBalanced(): boolean',
            'get namespace(): MongoDBNamespace',
            'get readConcern(): undefined | ReadConcern',
            'get readPreference(): ReadPreference',
            'set session(clientSession): void',
        ],
        methods: [
            '[asyncIterator](): AsyncGenerator<any, void, void>',
            'addCursorFlag(flag, value): ListIndexesCursor',
            'addListener<EventKey>(event, listener): ListIndexesCursor',
            'batchSize(value): ListIndexesCursor',
            'bufferedCount(): number',
            'clone(): ListIndexesCursor',
            'close(): Promise<void>',
            'emit<EventKey>(event, ...args): boolean',
            'eventNames(): string[]',
            'forEach(iterator): Promise<void>',
            'getMaxListeners(): number',
            'hasNext(): Promise<boolean>',
            'listenerCount<EventKey>(type): number',
            'listeners<EventKey>(event): AbstractCursorEvents[EventKey][]',
            'map<T>(transform): AbstractCursor<T, AbstractCursorEvents>',
            'maxTimeMS(value): ListIndexesCursor',
            'next(): Promise<any>',
            'off<EventKey>(event, listener): ListIndexesCursor',
            'on<EventKey>(event, listener): ListIndexesCursor',
            'once<EventKey>(event, listener): ListIndexesCursor',
            'prependListener<EventKey>(event, listener): ListIndexesCursor',
            'prependOnceListener<EventKey>(event, listener): ListIndexesCursor',
            'rawListeners<EventKey>(event): AbstractCursorEvents[EventKey][]',
            'readBufferedDocuments(number?): any[]',
            'removeAllListeners<EventKey>(event?): ListIndexesCursor',
            'removeListener<EventKey>(event, listener): ListIndexesCursor',
            'rewind(): void',
            'setMaxListeners(n): ListIndexesCursor',
            'stream(options?): Readable & AsyncIterable<any>',
            'toArray(): Promise<any[]>',
            'tryNext(): Promise<any>',
            'withReadConcern(readConcern): ListIndexesCursor',
            'withReadPreference(readPreference): ListIndexesCursor',
        ],
    },
    ListSearchIndexesCursor: {
        accessors: [
            'get closed(): boolean',
            'get id(): undefined | Long',
            'get killed(): boolean',
            'get loadBalanced(): boolean',
            'get namespace(): MongoDBNamespace',
            'get pipeline(): Document[]',
            'get readConcern(): undefined | ReadConcern',
            'get readPreference(): ReadPreference',
            'set session(clientSession): void',
        ],
        methods: [
            '[asyncIterator](): AsyncGenerator<{ name: string; }, void, void>',
            'addCursorFlag(flag, value): ListSearchIndexesCursor',
            'addListener<EventKey>(event, listener): ListSearchIndexesCursor',
            'batchSize(value): ListSearchIndexesCursor',
            'bufferedCount(): number',
            'clone(): AggregationCursor<{ name: string; }>',
            'close(): Promise<void>',
            'emit<EventKey>(event, ...args): boolean',
            'eventNames(): string[]',
            'explain(verbosity?): Promise<Document>',
            'forEach(iterator): Promise<void>',
            'geoNear($geoNear): ListSearchIndexesCursor',
            'getMaxListeners(): number',
            'group<T>($group): AggregationCursor<T>',
            'hasNext(): Promise<boolean>',
            'limit($limit): ListSearchIndexesCursor',
            'listenerCount<EventKey>(type): number',
            'listeners<EventKey>(event): AbstractCursorEvents[EventKey][]',
            'lookup($lookup): ListSearchIndexesCursor',
            'map<T>(transform): AggregationCursor<T>',
            'match($match): ListSearchIndexesCursor',
            'maxTimeMS(value): ListSearchIndexesCursor',
            'next(): Promise<null | { name: string; }>',
            'off<EventKey>(event, listener): ListSearchIndexesCursor',
            'on<EventKey>(event, listener): ListSearchIndexesCursor',
            'once<EventKey>(event, listener): ListSearchIndexesCursor',
            'out($out): ListSearchIndexesCursor',
            'prependListener<EventKey>(event, listener): ListSearchIndexesCursor',
            'prependOnceListener<EventKey>(event, listener): ListSearchIndexesCursor',
            'project<T>($project): AggregationCursor<T>',
            'rawListeners<EventKey>(event): AbstractCursorEvents[EventKey][]',
            'readBufferedDocuments(number?): { name: string; }[]',
            'redact($redact): ListSearchIndexesCursor',
            'removeAllListeners<EventKey>(event?): ListSearchIndexesCursor',
            'removeListener<EventKey>(event, listener): ListSearchIndexesCursor',
            'rewind(): void',
            'setMaxListeners(n): ListSearchIndexesCursor',
            'skip($skip): ListSearchIndexesCursor',
            'sort($sort): ListSearchIndexesCursor',
            'stream(options?): Readable & AsyncIterable<{ name: string; }>',
            'toArray(): Promise<{ name: string; }[]>',
            'tryNext(): Promise<null | { name: string; }>',
            'unwind($unwind): ListSearchIndexesCursor',
            'withReadConcern(readConcern): ListSearchIndexesCursor',
            'withReadPreference(readPreference): ListSearchIndexesCursor',
        ],
    },
    MongoAPIError: {
        accessors: [
            'get errmsg(): string',
            'get errorLabels(): string[]',
            'get name(): string',
        ],
        methods: [
            'addErrorLabel(label): void',
            'hasErrorLabel(label): boolean',
        ],
    },
    MongoAWSError: {
        accessors: [
            'get errmsg(): string',
            'get errorLabels(): string[]',
            'get name(): string',
        ],
        methods: [
            'addErrorLabel(label): void',
            'hasErrorLabel(label): boolean',
        ],
    },
    MongoAzureError: {
        accessors: [
            'get errmsg(): string',
            'get errorLabels(): string[]',
            'get name(): string',
        ],
        methods: [
            'addErrorLabel(label): void',
            'hasErrorLabel(label): boolean',
        ],
    },
    MongoBatchReExecutionError: {
        accessors: [
            'get errmsg(): string',
            'get errorLabels(): string[]',
            'get name(): string',
        ],
        methods: [
            'addErrorLabel(label): void',
            'hasErrorLabel(label): boolean',
        ],
    },
    MongoBulkWriteError: {
        accessors: [
            'get deletedCount(): number',
            'get errmsg(): string',
            'get errorLabels(): string[]',
            'get insertedCount(): number',
            'get insertedIds(): { [key: number]: any; }',
            'get matchedCount(): number',
            'get modifiedCount(): number',
            'get name(): string',
            'get upsertedCount(): number',
            'get upsertedIds(): { [key: number]: any; }',
        ],
        methods: [
            'addErrorLabel(label): void',
            'hasErrorLabel(label): boolean',
        ],
    },
    MongoChangeStreamError: {
        accessors: [
            'get errmsg(): string',
            'get errorLabels(): string[]',
            'get name(): string',
        ],
        methods: [
            'addErrorLabel(label): void',
            'hasErrorLabel(label): boolean',
        ],
    },
    MongoClient: {
        accessors: [
            'get bsonOptions(): BSONSerializeOptions',
            'set monitorCommands(value): void',
            'get options(): Readonly<MongoOptions>',
            'get readConcern(): undefined | ReadConcern',
            'get readPreference(): ReadPreference',
            'get serverApi(): Readonly<undefined | ServerApi>',
            'get writeConcern(): undefined | WriteConcern',
        ],
        methods: [
            'addListener<EventKey>(event, listener): MongoClient',
            'close(force?): Promise<void>',
            'connect(): Promise<MongoClient>',
            'db(dbName?, options?): Db',
            'emit<EventKey>(event, ...args): boolean',
            'eventNames(): string[]',
            'getMaxListeners(): number',
            'listenerCount<EventKey>(type): number',
            'listeners<EventKey>(event): MongoClientEvents[EventKey][]',
            'off<EventKey>(event, listener): MongoClient',
            'on<EventKey>(event, listener): MongoClient',
            'once<EventKey>(event, listener): MongoClient',
            'prependListener<EventKey>(event, listener): MongoClient',
            'prependOnceListener<EventKey>(event, listener): MongoClient',
            'rawListeners<EventKey>(event): MongoClientEvents[EventKey][]',
            'removeAllListeners<EventKey>(event?): MongoClient',
            'removeListener<EventKey>(event, listener): MongoClient',
            'setMaxListeners(n): MongoClient',
            'startSession(options?): ClientSession',
            'watch<TSchema, TChange>(pipeline?, options?): ChangeStream<TSchema, TChange>',
            'withSession<T>(executor): Promise<T>',
            'connect(url, options?): Promise<MongoClient>',
        ],
    },
    MongoCompatibilityError: {
        accessors: [
            'get errmsg(): string',
            'get errorLabels(): string[]',
            'get name(): string',
        ],
        methods: [
            'addErrorLabel(label): void',
            'hasErrorLabel(label): boolean',
        ],
    },
    MongoCredentials: {
        accessors: [],
        methods: [
            'equals(other): boolean',
            'resolveAuthMechanism(hello?): MongoCredentials',
            'validate(): void',
            'merge(creds, options): MongoCredentials',
        ],
    },
    MongoCryptAzureKMSRequestError: {
        accessors: [
            'get errmsg(): string',
            'get errorLabels(): string[]',
            'get name(): string',
        ],
        methods: [
            'addErrorLabel(label): void',
            'hasErrorLabel(label): boolean',
        ],
    },
    MongoCryptCreateDataKeyError: {
        accessors: [
            'get errmsg(): string',
            'get errorLabels(): string[]',
            'get name(): string',
        ],
        methods: [
            'addErrorLabel(label): void',
            'hasErrorLabel(label): boolean',
        ],
    },
    MongoCryptCreateEncryptedCollectionError: {
        accessors: [
            'get errmsg(): string',
            'get errorLabels(): string[]',
            'get name(): string',
        ],
        methods: [
            'addErrorLabel(label): void',
            'hasErrorLabel(label): boolean',
        ],
    },
    MongoCryptError: {
        accessors: [
            'get errmsg(): string',
            'get errorLabels(): string[]',
            'get name(): string',
        ],
        methods: [
            'addErrorLabel(label): void',
            'hasErrorLabel(label): boolean',
        ],
    },
    MongoCryptInvalidArgumentError: {
        accessors: [
            'get errmsg(): string',
            'get errorLabels(): string[]',
            'get name(): string',
        ],
        methods: [
            'addErrorLabel(label): void',
            'hasErrorLabel(label): boolean',
        ],
    },
    MongoCryptKMSRequestNetworkTimeoutError: {
        accessors: [
            'get errmsg(): string',
            'get errorLabels(): string[]',
            'get name(): string',
        ],
        methods: [
            'addErrorLabel(label): void',
            'hasErrorLabel(label): boolean',
        ],
    },
    MongoCursorExhaustedError: {
        accessors: [
            'get errmsg(): string',
            'get errorLabels(): string[]',
            'get name(): string',
        ],
        methods: [
            'addErrorLabel(label): void',
            'hasErrorLabel(label): boolean',
        ],
    },
    MongoCursorInUseError: {
        accessors: [
            'get errmsg(): string',
            'get errorLabels(): string[]',
            'get name(): string',
        ],
        methods: [
            'addErrorLabel(label): void',
            'hasErrorLabel(label): boolean',
        ],
    },
    MongoDBCollectionNamespace: {
        accessors: [],
        methods: [
            'toString(): string',
            'withCollection(collection): MongoDBCollectionNamespace',
            'fromString(namespace?): MongoDBCollectionNamespace',
        ],
    },
    MongoDBNamespace: {
        accessors: [],
        methods: [
            'toString(): string',
            'withCollection(collection): MongoDBCollectionNamespace',
            'fromString(namespace?): MongoDBNamespace',
        ],
    },
    MongoDecompressionError: {
        accessors: [
            'get errmsg(): string',
            'get errorLabels(): string[]',
            'get name(): string',
        ],
        methods: [
            'addErrorLabel(label): void',
            'hasErrorLabel(label): boolean',
        ],
    },
    MongoDriverError: {
        accessors: [
            'get errmsg(): string',
            'get errorLabels(): string[]',
            'get name(): string',
        ],
        methods: [
            'addErrorLabel(label): void',
            'hasErrorLabel(label): boolean',
        ],
    },
    MongoError: {
        accessors: [
            'get errmsg(): string',
            'get errorLabels(): string[]',
            'get name(): string',
        ],
        methods: [
            'addErrorLabel(label): void',
            'hasErrorLabel(label): boolean',
        ],
    },
    MongoExpiredSessionError: {
        accessors: [
            'get errmsg(): string',
            'get errorLabels(): string[]',
            'get name(): string',
        ],
        methods: [
            'addErrorLabel(label): void',
            'hasErrorLabel(label): boolean',
        ],
    },
    MongoGridFSChunkError: {
        accessors: [
            'get errmsg(): string',
            'get errorLabels(): string[]',
            'get name(): string',
        ],
        methods: [
            'addErrorLabel(label): void',
            'hasErrorLabel(label): boolean',
        ],
    },
    MongoGridFSStreamError: {
        accessors: [
            'get errmsg(): string',
            'get errorLabels(): string[]',
            'get name(): string',
        ],
        methods: [
            'addErrorLabel(label): void',
            'hasErrorLabel(label): boolean',
        ],
    },
    MongoInvalidArgumentError: {
        accessors: [
            'get errmsg(): string',
            'get errorLabels(): string[]',
            'get name(): string',
        ],
        methods: [
            'addErrorLabel(label): void',
            'hasErrorLabel(label): boolean',
        ],
    },
    MongoKerberosError: {
        accessors: [
            'get errmsg(): string',
            'get errorLabels(): string[]',
            'get name(): string',
        ],
        methods: [
            'addErrorLabel(label): void',
            'hasErrorLabel(label): boolean',
        ],
    },
    MongoMissingCredentialsError: {
        accessors: [
            'get errmsg(): string',
            'get errorLabels(): string[]',
            'get name(): string',
        ],
        methods: [
            'addErrorLabel(label): void',
            'hasErrorLabel(label): boolean',
        ],
    },
    MongoMissingDependencyError: {
        accessors: [
            'get errmsg(): string',
            'get errorLabels(): string[]',
            'get name(): string',
        ],
        methods: [
            'addErrorLabel(label): void',
            'hasErrorLabel(label): boolean',
        ],
    },
    MongoNetworkError: {
        accessors: [
            'get errmsg(): string',
            'get errorLabels(): string[]',
            'get name(): string',
        ],
        methods: [
            'addErrorLabel(label): void',
            'hasErrorLabel(label): boolean',
        ],
    },
    MongoNetworkTimeoutError: {
        accessors: [
            'get errmsg(): string',
            'get errorLabels(): string[]',
            'get name(): string',
        ],
        methods: [
            'addErrorLabel(label): void',
            'hasErrorLabel(label): boolean',
        ],
    },
    MongoNotConnectedError: {
        accessors: [
            'get errmsg(): string',
            'get errorLabels(): string[]',
            'get name(): string',
        ],
        methods: [
            'addErrorLabel(label): void',
            'hasErrorLabel(label): boolean',
        ],
    },
    MongoParseError: {
        accessors: [
            'get errmsg(): string',
            'get errorLabels(): string[]',
            'get name(): string',
        ],
        methods: [
            'addErrorLabel(label): void',
            'hasErrorLabel(label): boolean',
        ],
    },
    MongoRuntimeError: {
        accessors: [
            'get errmsg(): string',
            'get errorLabels(): string[]',
            'get name(): string',
        ],
        methods: [
            'addErrorLabel(label): void',
            'hasErrorLabel(label): boolean',
        ],
    },
    MongoServerClosedError: {
        accessors: [
            'get errmsg(): string',
            'get errorLabels(): string[]',
            'get name(): string',
        ],
        methods: [
            'addErrorLabel(label): void',
            'hasErrorLabel(label): boolean',
        ],
    },
    MongoServerError: {
        accessors: [
            'get errmsg(): string',
            'get errorLabels(): string[]',
            'get name(): string',
        ],
        methods: [
            'addErrorLabel(label): void',
            'hasErrorLabel(label): boolean',
        ],
    },
    MongoServerSelectionError: {
        accessors: [
            'get errmsg(): string',
            'get errorLabels(): string[]',
            'get name(): string',
        ],
        methods: [
            'addErrorLabel(label): void',
            'hasErrorLabel(label): boolean',
        ],
    },
    MongoSystemError: {
        accessors: [
            'get errmsg(): string',
            'get errorLabels(): string[]',
            'get name(): string',
        ],
        methods: [
            'addErrorLabel(label): void',
            'hasErrorLabel(label): boolean',
        ],
    },
    MongoTailableCursorError: {
        accessors: [
            'get errmsg(): string',
            'get errorLabels(): string[]',
            'get name(): string',
        ],
        methods: [
            'addErrorLabel(label): void',
            'hasErrorLabel(label): boolean',
        ],
    },
    MongoTopologyClosedError: {
        accessors: [
            'get errmsg(): string',
            'get errorLabels(): string[]',
            'get name(): string',
        ],
        methods: [
            'addErrorLabel(label): void',
            'hasErrorLabel(label): boolean',
        ],
    },
    MongoTransactionError: {
        accessors: [
            'get errmsg(): string',
            'get errorLabels(): string[]',
            'get name(): string',
        ],
        methods: [
            'addErrorLabel(label): void',
            'hasErrorLabel(label): boolean',
        ],
    },
    MongoUnexpectedServerResponseError: {
        accessors: [
            'get errmsg(): string',
            'get errorLabels(): string[]',
            'get name(): string',
        ],
        methods: [
            'addErrorLabel(label): void',
            'hasErrorLabel(label): boolean',
        ],
    },
    MongoWriteConcernError: {
        accessors: [
            'get errmsg(): string',
            'get errorLabels(): string[]',
            'get name(): string',
        ],
        methods: [
            'addErrorLabel(label): void',
            'hasErrorLabel(label): boolean',
        ],
    },
    OrderedBulkOperation: {
        accessors: [
            'get batches(): Batch<Document>[]',
            'get bsonOptions(): BSONSerializeOptions',
            'get writeConcern(): undefined | WriteConcern',
        ],
        methods: [
            'addToOperationsList(batchType, document): OrderedBulkOperation',
            'execute(options?): Promise<BulkWriteResult>',
            'find(selector): FindOperators',
            'insert(document): BulkOperationBase',
            'raw(op): OrderedBulkOperation',
        ],
    },
    ReadConcern: {
        accessors: [
            'get AVAILABLE(): "available"',
            'get LINEARIZABLE(): "linearizable"',
            'get MAJORITY(): "majority"',
            'get SNAPSHOT(): "snapshot"',
        ],
        methods: [
            'toJSON(): Document',
            'fromOptions(options?): undefined | ReadConcern',
        ],
    },
    ReadPreference: {
        accessors: [
            'get preference(): ReadPreferenceMode',
        ],
        methods: [
            'equals(readPreference): boolean',
            'isValid(mode?): boolean',
            'secondaryOk(): boolean',
            'toJSON(): Document',
            'fromOptions(options?): undefined | ReadPreference',
            'fromString(mode): ReadPreference',
            'isValid(mode): boolean',
            'translate(options): ReadPreferenceLikeOptions',
        ],
    },
    RunCommandCursor: {
        accessors: [
            'get closed(): boolean',
            'get id(): undefined | Long',
            'get killed(): boolean',
            'get loadBalanced(): boolean',
            'get namespace(): MongoDBNamespace',
            'get readConcern(): undefined | ReadConcern',
            'get readPreference(): ReadPreference',
            'set session(clientSession): void',

        ],
        methods: [
            '[asyncIterator](): AsyncGenerator<any, void, void>',
            'addCursorFlag(_, __): never',
            'addListener<EventKey>(event, listener): RunCommandCursor',
            'batchSize(_): never',
            'bufferedCount(): number',
            'clone(): never',
            'close(): Promise<void>',
            'emit<EventKey>(event, ...args): boolean',
            'eventNames(): string[]',
            'forEach(iterator): Promise<void>',
            'getMaxListeners(): number',
            'hasNext(): Promise<boolean>',
            'listenerCount<EventKey>(type): number',
            'listeners<EventKey>(event): AbstractCursorEvents[EventKey][]',
            'map<T>(transform): AbstractCursor<T, AbstractCursorEvents>',
            'maxTimeMS(_): never',
            'next(): Promise<any>',
            'off<EventKey>(event, listener): RunCommandCursor',
            'on<EventKey>(event, listener): RunCommandCursor',
            'once<EventKey>(event, listener): RunCommandCursor',
            'prependListener<EventKey>(event, listener): RunCommandCursor',
            'prependOnceListener<EventKey>(event, listener): RunCommandCursor',
            'rawListeners<EventKey>(event): AbstractCursorEvents[EventKey][]',
            'readBufferedDocuments(number?): any[]',
            'removeAllListeners<EventKey>(event?): RunCommandCursor',
            'removeListener<EventKey>(event, listener): RunCommandCursor',
            'rewind(): void',
            'setBatchSize(batchSize): RunCommandCursor',
            'setComment(comment): RunCommandCursor',
            'setMaxListeners(n): RunCommandCursor',
            'setMaxTimeMS(maxTimeMS): RunCommandCursor',
            'stream(options?): Readable & AsyncIterable<any>',
            'toArray(): Promise<any[]>',
            'tryNext(): Promise<any>',
            'withReadConcern(_): never',
            'withReadPreference(readPreference): RunCommandCursor',
        ],
    },
    ServerCapabilities: {
        accessors: [
            'get commandsTakeCollation(): boolean',
            'get commandsTakeWriteConcern(): boolean',
            'get hasAggregationCursor(): boolean',
            'get hasAuthCommands(): boolean',
            'get hasListCollectionsCommand(): boolean',
            'get hasListIndexesCommand(): boolean',
            'get hasTextSearch(): boolean',
            'get hasWriteCommands(): boolean',
            'get supportsSnapshotReads(): boolean',
        ],
        methods: [],
    },
    ServerClosedEvent: {
        accessors: [],
        methods: [],
    },
    ServerDescription: {
        accessors: [
            'get allHosts(): string[]',
            'get host(): string',
            'get hostAddress(): HostAddress',
            'get isDataBearing(): boolean',
            'get isReadable(): boolean',
            'get isWritable(): boolean',
            'get port(): number',
        ],
        methods: [
            'equals(other?): boolean',
        ],
    },
    ServerDescriptionChangedEvent: {
        accessors: [],
        methods: [],
    },
    ServerHeartbeatFailedEvent: {
        accessors: [],
        methods: [],
    },
    ServerHeartbeatStartedEvent: {
        accessors: [],
        methods: [],
    },
    ServerHeartbeatSucceededEvent: {
        accessors: [],
        methods: [],
    },
    ServerOpeningEvent: {
        accessors: [],
        methods: [],
    },
    ServerSession: {
        accessors: [],
        methods: [
            'hasTimedOut(sessionTimeoutMinutes): boolean',
        ],
    },
    StreamDescription: {
        accessors: [],
        methods: [
            'receiveResponse(response): void',
        ],
    },
    TopologyClosedEvent: {
        accessors: [],
        methods: [],
    },
    TopologyDescription: {
        accessors: [
            'get error(): null | MongoServerError',
            'get hasDataBearingServers(): boolean',
            'get hasKnownServers(): boolean',
        ],
        methods: [],
    },
    TopologyDescriptionChangedEvent: {
        accessors: [],
        methods: [],
    },
    TopologyOpeningEvent: {
        accessors: [],
        methods: [],
    },
    Transaction: {
        accessors: [
            'get isActive(): boolean',
            'get isCommitted(): boolean',
            'get isPinned(): boolean',
            'get isStarting(): boolean',
            'get recoveryToken(): undefined | Document',
        ],
        methods: [],
    },
    TypedEventEmitter: {
        accessors: [],
        methods: [
            'addListener<EventKey>(event, listener): TypedEventEmitter<Events>',
            'emit<EventKey>(event, ...args): boolean',
            'eventNames(): string[]',
            'getMaxListeners(): number',
            'listenerCount<EventKey>(type): number',
            'listeners<EventKey>(event): Events[EventKey][]',
            'off<EventKey>(event, listener): TypedEventEmitter<Events>',
            'on<EventKey>(event, listener): TypedEventEmitter<Events>',
            'once<EventKey>(event, listener): TypedEventEmitter<Events>',
            'prependListener<EventKey>(event, listener): TypedEventEmitter<Events>',
            'prependOnceListener<EventKey>(event, listener): TypedEventEmitter<Events>',
            'rawListeners<EventKey>(event): Events[EventKey][]',
            'removeAllListeners<EventKey>(event?): TypedEventEmitter<Events>',
            'removeListener<EventKey>(event, listener): TypedEventEmitter<Events>',
            'setMaxListeners(n): TypedEventEmitter<Events>',
        ],
    },
    UnorderedBulkOperation: {
        accessors: [
            'get batches(): Batch<Document>[]',
            'get bsonOptions(): BSONSerializeOptions',
            'get writeConcern(): undefined | WriteConcern',
        ],
        methods: [
            'addToOperationsList(batchType, document): UnorderedBulkOperation',
            'execute(options?): Promise<BulkWriteResult>',
            'find(selector): FindOperators',
            'handleWriteError(callback, writeResult): boolean',
            'insert(document): BulkOperationBase',
            'raw(op): UnorderedBulkOperation',
        ],
    },
    WriteConcern: {
        accessors: [],
        methods: [
            'apply(command, writeConcern): Document',
            'fromOptions(options?, inherit?): undefined | WriteConcern',
        ],
    },
    WriteConcernError: {
        accessors: [
            'get code(): undefined | number',
            'get errInfo(): undefined | Document',
            'get errmsg(): undefined | string',
        ],
        methods: [
            'toJSON(): WriteConcernErrorData',
            'toString(): string',
        ],
    },
    WriteError: {
        accessors: [
            'get code(): number',
            'get errInfo(): undefined | Document',
            'get errmsg(): undefined | string',
            'get index(): number',
        ],
        methods: [
            'getOperation(): Document',
            'toJSON(): { code: number; errmsg?: string; index: number; op: Document; }',
            'toString(): string',
        ],
    },
  }

  const parse_return_type_string_to_obj = (rt) => {
    // order of operations
    // Example 1: (step 0) ChangeStreamEvents<{ name: string; }, TChange>[EventKey][]
    // Example 2: (step 0) { cancel() => void; }[EventKey][]

    const regex_order = [

        // check if array symbol at the end of string
        // Example 1: (step 1) ChangeStreamEvents<{ name: string; }, TChange>[EventKey]
        // parsed out: []
        // Example 2: (step 1) { cancel() => void; }[EventKey]
        // parsed out: []
        {
            regex: /^(.*)(\[\])/,
            // index of the data that was kept (parsed_in) and the data that was removed (parsed_out)
            index: { in: 1, out: 2 } 
        },
        
        // check if there is an object key symbol
        // Example 1: (step 2) ChangeStreamEvents<{ name: string; }, TChange>
        // parsed out: [EventKey]
        // Example 2: (step 2) { cancel() => void; }
        // parsed out: [EventKey]
        {
            regex: /^(.*)(\[)(\w+)(\])/,
            // index of the data that was kept (parsed_in) and the data that was removed (parsed_out)
            index: { in: 1, out: 3 } 
        },
        

        // try to parse out a MongoDB Class
        // Example 1: (step 3) { name: string; }, TChange
        // parsed out: ChangeStreamEvents<...>
        {
            regex: /^(.+)(\<)(.*)(\>)/,
            // index of the data that was kept (parsed_in) and the data that was removed (parsed_out)
            index: { in: 3, out: 1 } 
        },

        // check if there is an object format string
        // Example 2: (step 3)
        // parsed out: { cancel() => void; }
        {
            regex: /^([^\{\}\n]*)(\{\s+)(.*)(\s+\})([^\{\}\n]*)/,
            // index of the data that was kept (parsed_in) and the data that was removed (parsed_out)
            index: { in: 3, out: 3 } 
        },
        
        
    ];

    let obj = { [rt]: {} };

    let matchFound = false;
    let i = 0;
    while (i < regex_order.length && !matchFound) {
        const match = rt.match(regex_order[i].regex);
        if (match) {
            matchFound = true;

            switch (i) {
                case 0:
                    obj = { Array: { of: parse_return_type_string_to_obj(match[regex_order[i].index.in]) }}
                    break;
                case 1:
                    obj = { Object: { withKeys: match[regex_order[i].index.out], of: parse_return_type_string_to_obj(match[regex_order[i].index.in]) }}
                    break;
                case 2:
                    obj = { [match[regex_order[i].index.out]]: { of: parse_return_type_string_to_obj(match[regex_order[i].index.in]) }}
                    break;
                case 3:
                    obj = { Object: { withFormat: match[regex_order[i].index.out] }}
                    break;
                default:
                    console.log('index out of bounds for regex_order');
            }
        }

        i += 1;
    }

    return obj

};


  const convertMethodStringsToObjects = (tsDefinitions) => {
    const result = {};
  
    tsDefinitions.forEach((tsDef) => {
      const regex = /^(\[\w*\]|\w*)(\<\w*\>|.*)(\([^\)]*\))(\:\s*)(.*)/;
      const match = tsDef.match(regex);
  
      if (match) {
        const [, key, paramType, params, , returnType] = match;
        // const isPromise = returnType.includes('Promise');
        const regex_promise_parsing = /^((?:Promise\<))(.*)(\>)/;  
        const regex_is_promise_match = returnType.match(regex_promise_parsing);  
  
        const [, promise_start, rtPromise, promise_end] = regex_is_promise_match || [null, null, null, null];  
  
        const rType = rtPromise || returnType;

        // parse types object from return type TypeScript string

        const regex_get_types = /([^\s\|][^\|\n]+[^\s\|])/g;
        const res_types = [...rType.matchAll(regex_get_types)];

        const types = {};

        res_types.map((a) => {
            Object.assign(types, parse_return_type_string_to_obj(a[1]))
            return null;
        });


        // lastly check if the key is special
        // for example: '[asyncIterator]'
        // and make the proper adjustment => '_asyncIterator_'
        // otherwise keep the key the same
        const regex_key_has_square_brackets = /^(\[\w*\])/;
        const k = key.match(regex_key_has_square_brackets) ? `_${key.slice(1,-1)}_` : key;
  
        result[k] = {
          returns: { types, promise: regex_is_promise_match ? true : false },
          doc_description: tsDef,
        };
      } else {
        result[tsDef] = 'error';
      }
    });
  
    return result;
  };

  const convertAccessorStringsToObjects = (tsDefinitions) => {
    const result = {};
  
    tsDefinitions.forEach((tsDef) => {
      const regex = /^((?:get)|(?:set))(\s*)(\w+)(\(.*\))(\:\s*)(([\w\{\"]).*)/;
      const match = tsDef.match(regex);
  
      if (match) {
        const [, accessor_type, , key, ,, returnType] = match;

        const regex_get_types = /([^\s\|][^\|\n]+[^\s\|])/g;
        const res_types = [...returnType.matchAll(regex_get_types)];

        const types = {};

        res_types.map((a) => {
            Object.assign(types, parse_return_type_string_to_obj(a[1]))
            return null;
        });
  
        result[key] = {
          returns: { types, [accessor_type]: true },
          doc_description: tsDef,
        };
      } else {
        result[tsDef] = 'error';
      }
    });
  
    return result;
  };


  let testMethods = [
    "fromOptions(options?, inherit?): undefined | WriteConcern",
    "stream(options?): Readable & AsyncIterable<TSchema>",
    "next(): Promise<null | TSchema>",
    "rawListeners<EventKey>(event): { cancel() => void; }[EventKey][]", 
    "toArray(): Promise<{ name: string; }[]>",
    "[asyncIterator](): AsyncGenerator<TSchema, void, void>",
    "group<T>($group): AggregationCursor<T>",
    "rawListeners<EventKey>(event): Events[EventKey][]",
    "removeAllListeners<EventKey>(event?): TypedEventEmitter<Events>",
    "toBSON(): never",
    "listeners<EventKey>(event): ChangeStreamEvents<TSchema, TChange>[EventKey][]",
    "toHostPort(): { host: string; port: number; }",
];

let testAccessors = [
    'get batches(): Batch<Document>[]',
    'get bsonOptions(): BSONSerializeOptions',
    'get writeConcern(): undefined | WriteConcern',
    'set session(clientSession): void',
    'get AVAILABLE(): "available" | "not available"',
];