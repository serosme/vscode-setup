Set-Location -Path $PSScriptRoot

$UserEnter = Read-Host "Enter 1 to export, 2 to import"
$SettingPath = "C:\Users\User\scoop\persist\vscode\data\user-data\User\settings.json"

if ($UserEnter -eq "1") {
    # 导出 settings.json
    Copy-Item -Path $SettingPath -Destination .\.vscode

    # 导出 extensions.json
    $Extensions = code --list-extensions
    $ExtensionsJson = @{
        recommendations = $Extensions
    } | ConvertTo-Json -Depth 2
    $ExtensionsJson | Set-Content .\.vscode\extensions.json -Encoding UTF8
}
elseif ($UserEnter -eq "2") {
    # 导入 settings.json
    Copy-Item -Path .\.vscode\settings.json -Destination $SettingPath

    # 导入 extensions.json
    $Extensions = Get-Content .\.vscode\extensions.json | ConvertFrom-Json
    foreach ($Extension in $Extensions.recommendations) {
        code --install-extension $Extension
    }
}
