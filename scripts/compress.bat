@echo off
for %%f in (*.js) do "C:\Program Files\7-Zip\7z.exe" a %%f.gz %%f
for %%f in (*.css) do "C:\Program Files\7-Zip\7z.exe" a %%f.gz %%f
