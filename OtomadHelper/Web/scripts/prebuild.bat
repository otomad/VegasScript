@echo off

powershell -ExecutionPolicy Bypass -File ..\..\versioning.ps1
:: tsx scripts\sync-resources-resx.ts
