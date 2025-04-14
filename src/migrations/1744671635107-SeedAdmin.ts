import { MigrationInterface, QueryRunner } from "typeorm";
import * as bcrypt from "bcrypt";

export class SeedAdmin1713130000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tenantId = crypto.randomUUID();
    const userId = crypto.randomUUID();
    const password = await bcrypt.hash("admin123", 10);

    await queryRunner.query(`
      INSERT INTO tenants (id, subdomain, name_translations, created_at)
      VALUES ('${tenantId}', 'bbox-demo', '{"en":"BBox Demo", "ar":"بي بوكس"}', NOW())
    `);

    await queryRunner.query(`
      INSERT INTO global_users (id, email, password_hash, is_active, created_at)
      VALUES ('${userId}', 'admin@bbox.com', '${password}', TRUE, NOW())
    `);

    await queryRunner.query(`
      INSERT INTO tenant_users (id, tenant_id, user_id, role, is_active)
      VALUES ('${crypto.randomUUID()}', '${tenantId}', '${userId}', 'admin', TRUE)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM tenant_users WHERE role = 'admin'`);
    await queryRunner.query(`DELETE FROM global_users WHERE email = 'admin@bbox.com'`);
    await queryRunner.query(`DELETE FROM tenants WHERE subdomain = 'bbox-demo'`);
  }
}
