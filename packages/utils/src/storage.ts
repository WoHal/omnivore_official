import * as Minio from 'minio'
import * as stream from 'node:stream';
import { ObjectInfo } from 'minio/dist/main/internal/type'

let minioClient: Minio.Client

export class File {
    private LONG_TIME: number = 99 * 365 * 24 * 60 * 60
    private bucket: Bucket
    private filePath: string
    constructor(bucket: Bucket, filePath: string) {
        this.bucket = bucket
        this.filePath = filePath
    }
    async publicUrl(): Promise<string> {
        return await minioClient.presignedGetObject(this.bucket.name, this.filePath, this.LONG_TIME)
    }
    async isPublic(): Promise<boolean[]> {
        return [false]
    }
    async save(data: stream.Readable | Buffer | string, options?: any) {
        await this.bucket.checkAvaliable()
        await minioClient.putObject(this.bucket.name, this.filePath, data, void 0, options)
    }
    async listObjects(maxResults?: number): Promise<ObjectInfo[]> {
        const data: ObjectInfo[] = []
        const dataStream = minioClient.listObjects(this.bucket.name, this.filePath, false, {
            MaxKeys: maxResults
        })
        return new Promise((resolve) => {
            dataStream.on('data', function (chuck: any) {
                data.push(chuck)
            })
            dataStream.on('end', function () {
                resolve(data)
            })
            dataStream.on('error', function (err: any) {
                console.error('exist error: ', err)
                resolve([])
            })
        })
    }
    async getMetadata() {
        const stat = await minioClient.statObject(this.bucket.name, this.filePath)
        return [{...stat, md5Hash: stat.etag}]
    }
    async exists(): Promise<boolean[]> {
        const data = await this.listObjects()

        return data.map(item => !!item)
    }
    async createReadStream() {
        return await minioClient.getObject(this.bucket.name, this.filePath)
    }
    createWriteStream(options?: any) {
        return new stream.PassThrough()
    }
    async download(): Promise<Buffer[]> {
        const data: any[] = []
        const dataStream = await this.createReadStream()

        return new Promise((resolve, reject) => {
            dataStream.on('data', (chunk: any) => {
                data.push(chunk)
            })
            dataStream.on('end', () => {
                resolve([Buffer.concat(data)])
            })
            dataStream.on('error', reject)
        })
    }
    async getSignedUrl(options: {action: string, expires?: number}): Promise<string[]> {
        return [await minioClient[options.action == 'read' ? 'presignedGetObject' : 'presignedPutObject'](this.bucket.name, this.filePath, options.expires)]
    }
}
class Bucket {
    name: string = '';
    constructor(name: string) {
        this.name = name;
    }
    file(filePath: string): File {
        return new File(this, filePath);
    }
    async checkAvaliable() {
        if (await this.exist()) {
            return
        }
        await this.init()
    }
    async exist(): Promise<boolean> {
        return await minioClient.bucketExists(this.name)
    }
    async init() {
        await minioClient.makeBucket(this.name)
    }
    async getFiles(options: {prefix: string, maxResults?: number}) {
        const data = await this.file(options.prefix).listObjects(options.maxResults)
        return [data]
    }
}
export class Storage {
    constructor() {
        if (!minioClient) {
            minioClient = new Minio.Client({
                endPoint: process.env.MINIO_HOST ?? 'localhost',
                port: ~~(process.env.MINIO_PORT || 9000),
                useSSL: false,
                accessKey: process.env.MINIO_USERNAME ?? 'minioadmin',
                secretKey: process.env.MINIO_PASSWORD ?? 'minioadmin'
            })
        }
    }
    bucket(bucketName: string): Bucket {
        return new Bucket(bucketName);
    }
}