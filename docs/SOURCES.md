# Fontes, atribuição e estado das evidências

Este projeto **não é afiliado** aos projetos externos. Resumimos e citamos os trabalhos de seus autores; não incorporamos firmware nem binários OEM deles.

| Trabalho | Autor / link | Uso neste laboratório |
|---|---|---|
| NT30 AirPlay Guide | [adrbn/nt30-airplay-guide](https://github.com/adrbn/nt30-airplay-guide) | Referência de /system/bin/wifi, UID efetivo e Magisk no H713 |
| magcubic-root | [well0nez/magcubic-root](https://github.com/well0nez/magcubic-root) | Ferramenta IMAGEWTY, USB stick, HY310 e L018 documentados |
| H713 Linux | [well0nez/allwinner-h713-linux](https://github.com/well0nez/allwinner-h713-linux) | Rota FEL/U-Boot/backup e perfis específicos de placa |
| HY300 Pro+ Research | [YuujiLab/HY300-H713-Research](https://github.com/YuujiLab/HY300-H713-Research) | U-Boot, USB Burn, Secure Storage e anti-rollback |
| HY300-H713-Research | [lolmam/HY300-H713-Research](https://github.com/lolmam/HY300-H713-Research) | Observações sobre fastboot e flash com estado locked em outra unidade |
| Android Platform-Tools | [Google](https://developer.android.com/tools/releases/platform-tools) | ADB e fastboot |
| Magisk | [topjohnwu/Magisk](https://github.com/topjohnwu/Magisk) | Projeto oficial Magisk e patch boot |
| U-Boot sunxi docs | [U-Boot](https://docs.u-boot.org/en/latest/board/allwinner/sunxi.html) | Funcionamento geral de boot/FEL |

## Níveis de evidência

- **Medido:** logs e hashes fornecidos nesta investigação, cabeçalhos, tamanhos.
- **Relatado:** proprietário informou que o root iniciou e funcionou após reboot.
- **Referenciado:** funcionalidade relatada por pesquisador externo em modelo/firmware diferente.
- **Não confirmado:** funcionamento no H723, restauração por pendrive nesta placa, boot temporário por USB.

## Material não incluído

Não espelhamos documentação integral de terceiros, dumps proprietários, configurações OEM, imagens de partições privadas, dispositivos com números de série ou chaves. Consulte cada fonte para licenças específicas.
