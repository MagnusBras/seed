import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE } from '../db/drizzle.module';
import type { DrizzleDb } from '../db/drizzle.module';
import { clients, NewClient } from '../db/schema';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDb) {}

  findAll() {
    return this.db.select().from(clients).orderBy(clients.createdAt);
  }

  async findOne(id: string) {
    const [client] = await this.db.select().from(clients).where(eq(clients.id, id));

    if (!client) throw new NotFoundException(`Client ${id} not found`);
    return client;
  }

  async create(dto: CreateClientDto) {
    try {
      const [client] = await this.db
        .insert(clients)
        .values(dto as NewClient)
        .returning();
      return client;
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === '23505') {
        throw new ConflictException(`Email ${dto.email} already in use`);
      }
      throw err;
    }
  }

  async update(id: string, dto: UpdateClientDto) {
    await this.findOne(id);
    try {
      const [updated] = await this.db
        .update(clients)
        .set({ ...dto, updatedAt: new Date() })
        .where(eq(clients.id, id))
        .returning();
      return updated;
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === '23505') {
        throw new ConflictException(`Email ${dto.email} already in use`);
      }
      throw err;
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.db.delete(clients).where(eq(clients.id, id));
  }
}
