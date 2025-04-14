Write-Host "👤 Creating users/entities directory and entity files..."

# إنشاء مجلد entities
$dir = "src\users\entities"
if (-not (Test-Path $dir)) {
  New-Item -ItemType Directory -Force -Path $dir | Out-Null
  Write-Host "📁 Created: $dir"
}

# ملف global-user.entity.ts
$globalUserCode = @'
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('global_users')
export class GlobalUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ nullable: true })
  last_login: Date;

  @Column({ default: true })
  is_active: boolean;
}
'@
Set-Content "$dir\global-user.entity.ts" -Value $globalUserCode -Encoding utf8

# ملف tenant-user.entity.ts
$tenantUserCode = @'
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tenant_users')
export class TenantUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenant_id: string;

  @Column()
  user_id: string;

  @Column()
  role: string;

  @Column({ default: true })
  is_active: boolean;
}
'@
Set-Content "$dir\tenant-user.entity.ts" -Value $tenantUserCode -Encoding utf8

Write-Host "✅ global-user.entity.ts and tenant-user.entity.ts created successfully!"
