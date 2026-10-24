# Pendrive, fastboot e FEL: o que funciona e o que não foi comprovado

| Caminho | Grava flash interna? | Comprovação |
|---|---|---|
| Atualização U-Boot por USB (sunxi_flash write) | **SIM** | Documentada em determinados HY300/HY310 H713 |
| Magisk num pacote IMAGEWTY reconstruído | **SIM** | Documentado por well0nez no HY310/L018 |
| fastboot boot (RAM) | Em tese não | **Não testado no caso HY310X**; pode ser rejeitado |
| U-Boot fatload/boot de Android modificado em pendrive | Em tese não | **Não confirmado** para firmware do caso |
| FEL + PC com software compatível | Pode restaurar/gravar | Depende de conector, modo FEL e placa |

### FAT32 e auto_update_check

A documentação externa descreve, para **certos** H713, pasta update, auto_update.txt e update.img. O conteúdo típico dispara sunxi_flash write ... firmware: **é gravação de firmware completo**, não uma imagem boot_a de 64 MiB. Alguns pacotes exigem terminador '%' e podem rejeitar downgrade por Secure Storage. Nada disso foi verificado nesta unidade Projector.20251013.1058.

### Fastboot USB

Na unidade estudada foi possível exibir uma tela de espera por cabo, mas **não foi estabelecida comunicação comprovada via USB** naquele experimento. Em Android normal, USB-A fornecia 5 V; na tela do bootloader deixou de fornecer. Isso **não comprova** o papel USB em fastboot.

Um cabo USB-A macho/macho em duas portas host pode provocar conflito de alimentação. Não improvisar conexões elétricas; utilizar hardware apropriado somente depois de entender o circuito da placa.

### FEL

A BootROM Allwinner possui uma arquitetura FEL documentada, mas acesso real requer conexão ao controlador correto. O identificador USB 1f3a:efe8 visto em outros Allwinner não foi medido nesta unidade. Não afirmar recuperação garantida apenas porque há um UDC no Linux.

### Referências

- [YuujiLab — USB Burn Guide](https://github.com/YuujiLab/HY300-H713-Research/blob/main/Firmware/USB_BURN_GUIDE.md)
- [well0nez — magcubic-root](https://github.com/well0nez/magcubic-root)
- [well0nez — allwinner-h713-linux](https://github.com/well0nez/allwinner-h713-linux)
- [U-Boot — Allwinner/sunxi](https://docs.u-boot.org/en/latest/board/allwinner/sunxi.html)

Nunca usar script automático de gravação como teste de detecção. Primeiro investigar sem executar atualização.
