Set-Location -Path $PSScriptRoot
$UserEnter = Read-Host "Enter 1 to export, 2 to import"
$SettingPath = "C:\Users\User\scoop\persist\vscode\data\user-data\User\settings.json"
if ($UserEnter -eq "1") {
    Copy-Item -Path $SettingPath -Destination .\.vscode
    code --list-extensions > extensions.txt
}
elseif ($UserEnter -eq "2") {
    Copy-Item -Path .\.vscode\settings.json -Destination $SettingPath
    Get-Content extensions.txt | ForEach-Object { code --install-extension $_ }
}
