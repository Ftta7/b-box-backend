Write-Host "🌱 Seeding admin user and tenant..."

# إعداد المتغيرات
$psql = "psql -U postgres -p 5433 -d bbox"
$tenantId = [guid]::NewGuid().ToString()
$userId = [guid]::NewGuid().ToString()
$email = "admin@bbox.com"
$password = "admin123"

# توليد bcrypt hash
if (-not (Get-Command bcrypt -ErrorAction SilentlyContinue)) {
    Write-Host "🔧 Installing bcrypt-cli..."
    npm install -g bcrypt-cli | Out-Null
}
$hashed = (& bcrypt-cli hash $password).Trim()

# إنشاء ملف SQL مؤقت
$tempFile = New-TemporaryFile

@"
INSERT INTO tenants (id, subdomain, name_translations, created_at)
VALUES ('$tenantId', 'bbox-demo', '{"en":"BBox Demo", "ar":"بي بوكس"}', NOW())
ON CONFLICT (subdomain) DO NOTHING;

INSERT INTO global_users (id, email, password_hash, is_active, created_at)
VALUES ('$userId', '$email', '$hashed', TRUE, NOW())
ON CONFLICT (email) DO NOTHING;

INSERT INTO tenant_users (id, tenant_id, user_id, role, is_active)
VALUES ('$(New-Guid)', '$tenantId', '$userId', 'admin', TRUE)
ON CONFLICT DO NOTHING;
"@ | Set-Content -Encoding UTF8 $tempFile

# تنفيذ SQL من الملف المؤقت
& cmd /c "$psql -f `"$tempFile`""

# حذف الملف المؤقت
Remove-Item $tempFile

Write-Host "`n✅ Admin user & tenant seeded successfully!"
Write-Host "🔐 Email: $email"
Write-Host "🔑 Password: $password"
