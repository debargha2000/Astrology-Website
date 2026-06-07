export interface IRepository<T, TCreate, TUpdate> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(data: TCreate): Promise<T>;
  update(id: string, data: TUpdate): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  bulkCreate(items: TCreate[]): Promise<T[]>;
  bulkDelete(ids: string[]): Promise<number>;
}
