# Ferramentas offline / somente leitura

Este repositório **não inclui** programas que executam flash automático. Scripts são Python 3.9+ e shell Android POSIX; nenhuma dependência de terceiros para auditar ZIP.

## Conferir o backup H713 enviado

    python3 tools/backup_audit.py backupprojeto.zip --reference reference/h713-hy310x-20251024.json

Resultado esperado para a **amostra privada estudada**: 21 imagens verificadas. A referência pública compara nomes, tamanhos e SHA-256 das partições de boot não sensíveis. Os hashes de private/metadata **não** são publicados; a ferramenta calcula seus hashes apenas **localmente** e não envia nenhum dado.

Para extrair:

    python3 tools/backup_audit.py backupprojeto.zip --extract ~/HY310X_backup_privado --reference reference/h713-hy310x-20251024.json

O programa não sobrescreve arquivos e recusa nomes perigosos. Proteja a pasta extraída, especialmente metadata/private.

## Validar boot (nunca grava)

    python3 tools/validate_boot.py --original boot_a.img --patched magisk_patched.img

Se deseja conferir os hashes **desta unidade**:

    python3 tools/validate_boot.py --original boot_a.img --patched magisk_patched.img --expected-original-sha 1b7b7e4f7d4b198d7fe6f51e31b424f19e12b11920e45351f0d19b8bbd5909b7 --expected-patched-sha 0b3dca5dd282d1a7b969ecbfb03965f82038b8c4d037f16c0f743405fb7d54ab

O teste não prova que AVB aceita o boot nem que o root funcionará.

## Inventário no projetor

Copie o conteúdo de tools/adb_probe.sh para o Shell do Bugjaeger, ou envie para o projetor e execute com sh. Não compartilhe relatório com números de série ou dados pessoais. Nenhum comando grava partições.

## CI

O GitHub Actions executa apenas testes unitários com imagens **sintéticas** de poucos bytes e valida a sintaxe Python. Não precisa de ADB nem de firmware.
