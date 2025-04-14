Write-Host "👤 Creating users/entities directory and entity files..."

# 1. إنشاء مجلد entities داخل src/users
$dir = "src\users\entities"
if (-not (Test-Path $dir)) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
    Write-Host "📁 Created: $dir"
}

# 2. محتوى global-user.entity.ts
$globalUserCode = @"
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
"@

# 3. محتوى tenant-user.entity.ts
$tenantUserCode = @"
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
"@

# 4. حفظ الملفات
$globalUserFile = "$dir\global-user.entity.ts"
$tenantUserFile = "$dir\tenant-user.entity.ts"

Set-Content -Path $globalUserFile -Value $globalUserCode -Encoding utf8
Set-Content -Path $tenantUserFile -Value $tenantUserCode -Encoding utf8

Write-Host "✅ Entity files created successfully:"
Write-Host " - $globalUserFile"
Write-Host " - $tenantUserFile"
