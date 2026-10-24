# Caso HY310X — caderno de laboratório (24 de outubro de 2026)

**Estado:** owner-reported SUCCESS / Magisk 30.7 inicializou. **Método:** inspirado no [NT30](https://github.com/adrbn/nt30-airplay-guide); aqui estão apenas fatos observados na unidade estudada.

## 1. Identificação — evidência do aparelho

| Propriedade | Medida |
|---|---|
| Modelo comercial comunicado | HY310X; não assumimos que todo HY310X use esta placa |
| Kernel | 5.4.99-00048-g634ce824ace1-dirty #650, armv7l |
| SoC | sun50iw12p1 (H713); Device Tree: allwinner,tv303 |
| Android | 11, RP1A.201005.006 |
| Build real | Allwinner/h713_tuna_p3/h713-tuna_p3:11/RP1A.201005.006/Projector10131101:user/release-keys |
| Fingerprint externo | ADT-3/adt3/adt3:11/RP1A.201005.006/Projector.20251013.1058:user/release-keys |
| Propriedades | ro.boot.slot_suffix=_a; ro.build.ab_update=true; ro.virtual_ab.enabled=true |
| AVB | ro.boot.vbmeta.device_state=locked; verifiedbootstate vazio |
| SELinux | Permissive |
| USB | 4100000.udc-controller; em Android, not attached/is_otg=0 |
| Armazenamento | eMMC mmcblk0; slots A/B; super dinâmico |
| Boot magic | boot_a/boot_b = ANDROID!; vendor_boot_a/b = VNDRBOOT |

**Cuidado:** o fingerprint ADT-3 é uma identidade de software. Não prova hardware Google ADT-3. H723 não foi identificado neste caso.

## 2. Raiz provisória e permissões

O binário de fábrica /system/bin/wifi aceita execução com UID efetivo 0. Um diagnóstico mostrou:

    Uid: 2000 0 0 0
    CapEff: 0000000000000000
    CapBnd: 00000000000000c0
    SELinux: Permissive

Isto **não equivale a root com todas as capacidades**. A operação de leitura de boot funcionou, mas a leitura do primeiro arquivo Magisk em /data/local/tmp falhou por permissões DAC. O teste shell [ -w ] produziu falso negativo para o acesso efetivo; **somente a operação real autorizada estabeleceu capacidade de escrita**, e ela é arriscada.

O binário privilegiado pode ser uma superfície de segurança grave. Não distribuir exploits nem presumir que ele exista em todo firmware.

## 3. Backup antes do flash

- 21/23 partições pequenas selecionadas extraídas de /dev/block/by-name via dd sem gravar na origem.
- Hash SHA-256 calculado tanto na partição como no arquivo; todos os 21 disponíveis coincidiram.
- Falharam: bootloader_a e frp (Permission denied); arquivo de backup 0 byte não é backup válido.
- Fora do escopo: super, userdata/UDISK, media_data, dispositivo mmcblk0 completo.
- Imagens de private/metadata podem conter segredos. **Guardar somente em ambiente privado.**
- O ZIP recebido não contém a imagem Magisk patched; contém **boot_a original**.

## 4. Patch e instalação observados

- Magisk **30.7**, aplicativo com package com.topjohnwu.magisk.
- boot_a original: **67.108.864 bytes**.
- SHA-256 original: **1b7b7e4f7d4b198d7fe6f51e31b424f19e12b11920e45351f0d19b8bbd5909b7**.
- Patch gerado no projetor: magisk_patched-30700_d8WF2.img (64 MiB, ANDROID!).
- SHA-256 patched: **0b3dca5dd282d1a7b969ecbfb03965f82038b8c4d037f16c0f743405fb7d54ab**.

**Primeira tentativa:** dd não conseguiu ler /data/local/tmp/magisk_boot_a.img (Permission denied); fallback gravou original e confirmou hash. Causa imediata: arquivo não legível pelo processo /system/bin/wifi root limitado. Corrigida a permissão de leitura do arquivo de entrada.

**Segunda tentativa:** 64+0 registros, **67.108.864 bytes** copiados, hash da partição boot_a coincidiu exatamente com o patched; sync executado; sem reinicialização automática.

**Auditoria pré-reboot:** 8/8 testes passaram (slot A, SHA do patch, SHA do boot_a, SHA do backup original, boot_b, vendor_boot_a, dtbo_a e vbmeta_a). Estado locked permaneceu. Após reiniciar, o proprietário relatou que **tudo funcionou**. Não há registro independente anexado do retorno de su -c id, portanto o estado está classificado como *confirmado pelo proprietário*, não teste CI ou validação multiproduto.

## 5. Reproduzir com responsabilidade

Não copie cegamente comandos de gravação de outro aparelho. Leia antes [recuperação](RECOVERY.md), [segurança](../SECURITY.md) e [compatibilidade](COMPATIBILITY.md).

Identificar, **somente leitura**:

    adb shell getprop ro.boot.slot_suffix
    adb shell getprop ro.boot.vbmeta.device_state
    adb shell getprop ro.boot.hardware
    adb shell uname -a
    adb shell ls -l /dev/block/by-name/boot_a

Os verificadores do projeto auditam hashes e cabeçalhos sem fazer flash. Para qualquer gravação, são indispensáveis imagem original íntegra, método de recuperação **externo testado** e identificação exata da placa. O estado AVB locked **não é garantia** de que uma imagem alterada será aceita.

## 6. Limites e pendências

- Sem teste local de recuperação FEL/fastboot USB, sem firmware IMAGEWTY original correspondente.
- Sem backup de bootloader_a ou frp.
- Sem backup super nem drivers residentes em system/vendor/product.
- Sem ensaio no SoC H723; não reutilize imagens H713 nele.
- Uma imagem de boot de outro aparelho pode quebrar display, alimentação, Wi-Fi ou pior.

**Fonte do caso:** logs de ADB, hashes, relatórios e backup ZIP fornecidos pelo proprietário; não é um procedimento universal.
