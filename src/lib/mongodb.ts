import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "MONGODB_URI belum dikonfigurasi. Tambahkan MONGODB_URI ke file .env.local.",
  );
}

const MONGODB_URI_VALUE: string = MONGODB_URI;

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

global.mongooseCache = cached;

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI_VALUE, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;

  return cached.conn;
}