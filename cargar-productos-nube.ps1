# Carga los productos y el usuario vendedor en la MongoDB de la nube (Atlas, conectada a Vercel).
# Pide la conexión sin mostrarla en pantalla ni guardarla en ningún archivo.
$ErrorActionPreference = "Stop"
Write-Host "Copiá MONGODB_URI desde Vercel: tienda-sol-api > Storage > (tu base) > .env.local > Show secret" -ForegroundColor Cyan
$seguro = Read-Host "Pegá acá MONGODB_URI" -AsSecureString
$env:MONGODB_URI = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($seguro))
$env:MONGODB_DB_NAME = "tienda_sol"
$env:SEED_ONLY = "true"
$env:VENDEDOR_KEYCLOAK_ID = "2143b1fd-1a2b-4464-9e90-31a4036ac9f1"
$env:FRONTEND_IMAGES_PATH = "$PSScriptRoot\packages\frontend\public\images"
node "$PSScriptRoot\scripts\bootstrap\init-stack.mjs"
Remove-Item Env:MONGODB_URI
