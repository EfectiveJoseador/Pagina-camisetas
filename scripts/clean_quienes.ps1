$f = 'pages\quienes-somos.html'
$lines = [System.IO.File]::ReadAllLines($f)
# Lines 1661-1832 (0-indexed: 1660-1831) are dead pedidos-lightbox code
# Keep lines 0..1659 and 1832..end
$keep = $lines[0..1659] + $lines[1832..($lines.Length - 1)]
[System.IO.File]::WriteAllLines($f, $keep, [System.Text.Encoding]::UTF8)
Write-Host "Done. Total lines: $($keep.Length)"
