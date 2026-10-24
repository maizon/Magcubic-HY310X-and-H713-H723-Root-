# Compatibilidade e identificação

**Identifique pelo SoC e pela placa, nunca apenas pelo anúncio ou pelo nome comercial.**

| Família / dispositivo | Evidência | Magisk | Restauração |
|---|---|---|---|
| HY310X desta investigação | H713, tv303, sun50iw12p1, Android 11, kernel 5.4.99, build out/2025 | **30.7: relatado funcional** | **externa não testada** |
| Nonete NT30 (adrbn) | H713 / Android 11 / kernel 5.4.99 | 28.1 documentado pelo autor | consultar repo original |
| HY310 e L018 (well0nez) | H713, builds OEM próprias | documentado via IMAGEWTY | PhoenixUSBPro/USB documentados em modelos testados |
| HY300 Pro+ (YuujiLab) | H713 tv303 em unidade pesquisada | pesquisa própria | USB Burn + anti-rollback documentado |
| Qualquer projetor anunciado como H723 | **nenhuma unidade validada neste projeto** | **NÃO TESTADO** | **NÃO TESTADO** |

### Inventário mínimo read-only

    adb shell getprop ro.boot.hardware
    adb shell getprop ro.build.fingerprint
    adb shell getprop ro.boot.slot_suffix
    adb shell getprop ro.boot.vbmeta.device_state
    adb shell getprop ro.product.cpu.abi
    adb shell uname -a

Se disponível, compare /proc/device-tree/compatible, esquema das partições, resolução do display e revisão da placa. Propriedades ro.* podem ser alteradas pelo fabricante; confirme com múltiplas fontes.

### Regras de compatibilidade

1. Boot de **outro aparelho** nunca é substituto garantido, mesmo com SoC idêntico.
2. Usuários ARMv7 em Cortex-A53 não significam firmware ARM64.
3. **H713 ≠ H723** para fins de firmware, bootloader ou recuperação; qualquer compatibilidade deve ser provada por testes específicos.
4. Firmware de data distinta pode ter AVB, particionamento, DTB ou política de anti-rollback diferente.
5. Boot_b existente não é garantia de recuperação automática.

Para sugerir um aparelho novo, abra Issue sem número de série, MAC, dumps ou endereços IP.
