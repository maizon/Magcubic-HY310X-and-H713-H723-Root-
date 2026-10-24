# Política de segurança e divulgação responsável

## Não publique backups reais de aparelhos

O ZIP de laboratório incluiu imagens que podem conter dados protegidos, identificadores ou segredos: **private**, **metadata**, **env**, **misc**, **Reserve0**, bootloader e blocos de firmware OEM. Não abra Issues com tais anexos. Não crie Releases públicos de firmwares retirados de aparelhos alheios.

O repositório contém apenas **documentação, código original e inventários sanitizados**. A cópia completa com 21 imagens foi preparada para entrega privada ao proprietário; nenhum binário dessa cópia foi enviado ao GitHub.

## Instruções perigosas

O projeto não executa fastboot flash, dd of=/dev/block, alteração de vbmeta, desativação de AVB, wipe, unlock nem USB auto-update automaticamente. Mesmo com SHA perfeito, uma imagem pode causar bootloop. O risco é do usuário e há aparelhos sem modo de recuperação externa acessível.

## Como reportar achados

Remova números de série, identificadores, MAC, SSIDs, tokens e arquivos de firmware. Informe chip observado, fingerprint **redigido**, versão kernel, partição/slot e comportamento, deixando claro se foi medido ou presumido.

Pessoas que descobrirem credenciais, chaves privadas, endpoints sensíveis ou formas de execução remota devem comunicar o mantenedor sem colocar a amostra em Issue pública.

## Identidade da placa

Marcas comerciais HY310X/HY300/H723 podem aparecer em hardwares diferentes. Nunca redistribuir private.img, metadata.img, frp.img, env ou partições de bootloader como pacotes de recuperação universal.
