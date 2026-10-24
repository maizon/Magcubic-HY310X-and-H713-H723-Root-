# Root H713 inspirado no NT30 — procedimento de referência do laboratório

> **AVISO CRÍTICO:** A unidade estudada foi bem-sucedida, mas **outros dispositivos podem entrar em bootloop irreversível sem ferramentas externas**. Não prossiga sem backup **externo** validado e método de recuperação independente comprovado. O bootloader reportava locked. Este guia registra procedimentos executados em hardware próprio, não constitui firmware universal ou promessa de segurança.

## 0. Confirmar o aparelho

Na unidade estudada foram observados, antes de qualquer alteração:

    getprop ro.boot.hardware          # sun50iw12p1
    getprop ro.boot.slot_suffix       # _a
    getprop ro.boot.vbmeta.device_state   # locked
    uname -a                          # Linux 5.4.99 armv7l
    cat /proc/device-tree/compatible # allwinner,tv303

Os campos após # são os resultados **apenas dessa unidade**, não saídas esperadas universais. Se algo divergir, não reutilize instruções destinadas ao boot_a desta pesquisa.

## 1. Backup e hash antes do patch

Nesta unidade, /system/bin/wifi foi um setuid root OEM presente no firmware. **Não existe garantia de que ele funcione em outros dispositivos.** Seu UID efetivo 0 tinha CapEff=0, então o processo não podia ignorar restrições DAC arbitrárias.

A extração original foi realizada por ADB, com o processo privilegiado **somente lendo** a partição e a shell ADB gravando no arquivo:

    mkdir -p /data/local/tmp/backupprojeto
    /system/bin/wifi root /system/bin/dd if=/dev/block/by-name/boot_a bs=1048576 > /data/local/tmp/backupprojeto/boot_a.img
    sha256sum /data/local/tmp/backupprojeto/boot_a.img
    /system/bin/wifi root /system/bin/sha256sum /dev/block/by-name/boot_a

Hashes devem coincidir. **Copie para o PC e confira a cópia externa.** No experimento, boot_a era exatamente 67.108.864 bytes. Há 21 backups pessoais validados; veja [RECOVERY.md](RECOVERY.md). Não publique private/metadata/env/misc.

## 2. Patch Magisk

Instalado o app oficial Magisk no próprio Android de destino, foi escolhida a função **Selecionar e corrigir um arquivo**, apontando para o boot_a original da mesma unidade. O resultado do experimento:

- Magisk 30.7
- boot original SHA-256: 1b7b7e4f7d4b198d7fe6f51e31b424f19e12b11920e45351f0d19b8bbd5909b7
- patch gerado SHA-256: 0b3dca5dd282d1a7b969ecbfb03965f82038b8c4d037f16c0f743405fb7d54ab
- imagem de 64 MiB, cabeçalho ANDROID!

**Esses hashes não serão iguais em outras builds ou unidades.** Não baixe patch de outra placa.

## 3. Falha encontrada: Permission denied

A primeira tentativa de gravação falhou **ao ler o arquivo de entrada** em /data/local/tmp/magisk_boot_a.img. O processo privilegiado tinha UID real 2000 / efetivo 0 / CapEff zero, portanto não conseguia ignorar DAC. O arquivo de entrada foi tornado legível pela shell proprietária do arquivo:

    chmod 644 /data/local/tmp/magisk_boot_a.img
    /system/bin/wifi root /system/bin/sha256sum /data/local/tmp/magisk_boot_a.img

O teste shell [ -w ] sobre a partição mostrou aviso, mas não foi conclusivo por regras de credenciais de access(). Não confunda UID efetivo 0 com um root sem restrições.

## 4. Gravação (PERIGO: altera boot real)

**Este bloco é uma transcrição de procedimento de risco; não o execute por rotina.** É obrigatório confirmar slot, hash do backup, hash do patch, compatibilidade e acesso de recuperação. O exemplo foi executado **somente em boot_a da unidade pesquisada**.

    /system/bin/wifi root /system/bin/dd if=/data/local/tmp/magisk_boot_a.img of=/dev/block/by-name/boot_a bs=1048576
    sync
    /system/bin/wifi root /system/bin/sha256sum /dev/block/by-name/boot_a

No experimento, 64+0 registros foram gravados e o SHA-256 da partição coincidiu com o patch. A auditoria também conferiu boot_b, vendor_boot_a, dtbo_a, vbmeta_a e original. **Nenhuma verificação de hash pode garantir boot.**

Se houve gravação parcial e o Android ainda funciona, preservar a conexão e **restaurar a imagem original do mesmo aparelho** pode ser possível. Se houver dúvida sobre integridade, **não reinicie** antes de identificar a situação. Não use arquivos públicos de outro aparelho.

## 5. Primeiro reboot e confirmação

Após execução de sync e reboot, o proprietário comunicou que o Magisk funcionou. A verificação recomendada no dispositivo iniciado:

    getprop sys.boot_completed
    getprop ro.boot.slot_suffix
    su -c id

O Magisk pode solicitar permissão na interface. O relato do proprietário está documentado; não foi depositado no Git um log pós-boot de su.

## 6. Recuperação e alternativas

- **Fastboot via USB:** requer conexão realmente reconhecida e operação permitida pelo bootloader. No caso estudado, comunicação externa não foi demonstrada.
- **FEL/PhoenixUSBPro:** procedimentos de terceiros só são candidatos se a placa e o método físico forem compatíveis.
- **Pendrive:** sunxi_flash write ... firmware **grava o firmware**, não faz boot temporário. Anti-rollback pode impedir flash.
- **Proprietary IMAGEWTY:** os backups de 21 partições não são um pacote firmware OEM completo.

Consultar [USB-BOOT-AND-FEL.md](USB-BOOT-AND-FEL.md), [COMPATIBILITY.md](COMPATIBILITY.md), [SECURITY.md](../SECURITY.md).

### Referência de origem

Este método foi motivado pelo [Nonete NT30 de adrbn](https://github.com/adrbn/nt30-airplay-guide/blob/main/docs/TECHNICAL.md), cuja unidade também usa Allwinner H713/Android 11/kernel 5.4.99. **O resultado positivo de duas unidades não elimina o risco para outras.**
